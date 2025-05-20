/* global use ecommerce */

//!== Prace s daty
// přidá dvě nové objednávky 
db.orders.insertMany([
    {
        _id: "111111565e28c3e0d756192f84d8731f",
        customer_id: "C100",
        order_status: "created",
        order_purchase_timestamp: new Date(),
        items: [
            { product_id: "8b41fbc2b984a12030090112324d1bc4", shipping_limit_date: new Date(), price: 199.9, freight_value: 15 }
        ]
    },
    {
        _id: "zzzzzz565e28c3e0d756192f84d8731f",
        customer_id: "C101",
        order_status: "created",
        order_purchase_timestamp: new Date(),
        items: [
            { product_id: "8c92109888e8cdf9d66dc7e463025574", shipping_limit_date: new Date(), price: 300.9, freight_value: 15 }
        ]
    }
]);


// 2 – přidá 1 položku do existující objednávky
use("ecommerce");
db.orders.updateOne(
    { _id: "bfe42c22ecbf90bc9f35cf591270b6a7" },
    {
        $push: {
            items: {
                product_id: "8b41fbc2b984a12030090112324d1bc4",
                shipping_limit_date: new Date(),
                price: 299.9,
                freight_value: 20
            }
        }
    }
);

// 3 – změní stav jedné objednávky a vrátí počty ovlivněných dokumentů
use("ecommerce");
db.orders.updateOne(
    { _id: "9d531c565e28c3e0d756192f84d8731f" },
    { $set: { order_status: "delivered", order_delivered_customer_date: new Date() } },
);

// 4 – findOneAndUpdate – přejmenuje město zákazníkovi a vrátí novou verzi dokumentu
use("ecommerce");
db.customers.findOneAndUpdate(
    { _id: "ae8db0691449a44352e7d535ddf78c5e" },
    { $set: { customer_city: "Brno-město" } },
    { returnDocument: "after" }
);

// 5 – hromadně smaže produkty s nulovou váhou, deleteMany vrací deleteCount
use("ecommerce");
db.products.deleteMany({ product_weight_g: { $lte: 0 } });

// 6 – Označí „drahé“ objednávky nad 1000 příznakem expensive:true
use("ecommerce");
db.orders.updateMany(
    {
        // $expr dovoluje v podmínce použít agregační výrazy.
        // Následně sečteme ceny všech položek v poli items.
        $expr: { $gt: [{ $sum: "$items.price" }, 1000] }   // celková cena > 1000 Kč
    },
    [
        { $set: { expensive: true } }
    ]
);

//!== Agregační funkce (slozitejsi dotazy)
// 7 – top 10 států podle tržeb
use("ecommerce");
db.orders.aggregate([
    { $unwind: "$items" },
    // připojíme kolekci customers jelikož na nich jsou státy
    {
        $lookup: {
            from: "customers",
            localField: "customer_id",
            foreignField: "_id",
            as: "c"
        }
    },
    // rozbalí pole customers
    { $unwind: "$c" },
    {
        // seskupí podle státu a spočítá celkovou tržbu
        $group: {
            _id: "$c.customer_state",
            revenue: { $sum: "$items.price" },
            orders: { $addToSet: "$_id" }
        }
    },
    {
        $project: {
            _id: 0,
            state: "$_id",
            revenue: 1,
            orderCount: { $size: "$orders" }
        }
    },
    { $sort: { revenue: -1 } },
    { $limit: 10 }
]);

// 8 - Celková hodnota objednávek a počet položek na objednávku s detaily zákazníka
use("ecommerce");
db.orders.aggregate([
    { $unwind: "$items" },
    { $group: { _id: "$_id", customer_id: { $first: "$customer_id" }, totalOrderValue: { $sum: "$items.price" }, totalItems: { $sum: 1 } } },
    { $sort: { totalOrderValue: -1 } },
    { $limit: 10 },
    { $lookup: { from: "customers", localField: "customer_id", foreignField: "_id", as: "customerDetails" } },
    { $unwind: "$customerDetails" },
    { $project: { _id: 1, totalOrderValue: 1, totalItems: 1, customerCity: "$customerDetails.customer_city", customerState: "$customerDetails.customer_state" } }
]);

// 9 – průměrná doba doručení (purchase → delivered) podle státu
use("ecommerce");
db.orders.aggregate([
    { $match: { order_delivered_customer_date: { $ne: null } } },
    { $lookup: { from: "customers", localField: "customer_id", foreignField: "_id", as: "c" } },
    { $unwind: "$c" },
    {
        $project: {
            state: "$c.customer_state",
            days: {
                // prevedeme timestamp na dny
                $divide: [
                    { $subtract: ["$order_delivered_customer_date", "$order_purchase_timestamp"] },
                    1000 * 60 * 60 * 24
                ]
            }
        }
    },
    { $group: { _id: "$state", avgDays: { $avg: "$days" } } },
    { $sort: { avgDays: 1 } },
    { $limit: 10 }
]);

// 10 - Objednávky, kde VŠECHNY položky byly dodány (tzn. shipping_limit_date je v minulosti).
use("ecommerce");
db.orders.find(
    {
        $and: [
            {
                items: {
                    $not: {
                        $elemMatch: {
                            shipping_limit_date: { $gt: new Date() }
                        }
                    }
                }
            },
            // Vyloučí objednávky bez položek
            { items: { $exists: true, $ne: [] } }
        ]
    },
    {
        _id: 1,
        order_status: 1,
        order_purchase_timestamp: 1,
        "items.product_id": 1,
        "items.shipping_limit_date": 1
    }
);

// 11 – nejdražší objednávka vůbec na počet položek v objednávce
use("ecommerce");
db.orders.aggregate([
    {
        // Zajišťuje, že itemCount bude > 0 a vyhneme se dělení nulou při výpočtu průměru.
        $match: {
            items: { $exists: true, $ne: [], $not: { $size: 0 } },
            order_purchase_timestamp: { $exists: true, $ne: null }
        }
    },
    {
        // Vypočítá totalOrderValue (součet cen položek) a itemCount (počet položek)
        $addFields: {
            totalOrderValue: { $sum: "$items.price" }, // Sečte ceny všech položek v poli 'items' daného dokumentu.
            itemCount: { $size: "$items" } // Spočítá počet prvků v poli 'items' daného dokumentu.
        }
    },
    {
        // Vypočítá průměrnou cenu položky vydělením totalOrderValue počtem položek.
        $addFields: {
            averageItemPrice: { $divide: ["$totalOrderValue", "$itemCount"] }
        }
    },
    {
        // Seřadíme objednávky s vypočtenými poli podle průměrné ceny položky sestupně.
        $sort: { averageItemPrice: -1 }
    },
    {
        // Omezíme výsledek na první dokument, což je objednávka s nejvyšší průměrnou cenou na položku.
        $limit: 1
    },
    {
        // Přidáme informace o zákazníkovi, spojí nalezenou objednávku s informacemi o zákazníkovi.
        $lookup: {
            from: "customers",
            localField: "customer_id", // customers._id je cílem reference z orders.customer_id
            foreignField: "_id",
            as: "customerInfo"
        }
    },
    {
        // preserveNullAndEmptyArrays: true pro případ, že by customer_id neodkazovalo na existujícího zákazníka (i když by nemělo).
        $unwind: { path: "$customerInfo", preserveNullAndEmptyArrays: true }
    },
    {
        $project: {
            orderId: "$_id",
            totalOrderValue: { $round: ["$totalOrderValue", 2] }, // zaokrouhleno na 2 desetiny
            itemCount: "$itemCount",
            averageItemPrice: { $round: ["$averageItemPrice", 2] },
            purchaseTimestamp: 1,
            customerUniqueId: "$customerInfo.customer_unique_id",
            customerCity: "$customerInfo.customer_city",
            customerState: "$customerInfo.customer_state"
        }
    }
]);


// 12 – nejdražší objednávka v každém měsíci
use("ecommerce");
db.orders.aggregate([
    { $unwind: "$items" },
    {
        $group: {
            _id: { month: { $dateTrunc: { date: "$order_purchase_timestamp", unit: "month" } }, order: "$_id" },
            total: { $sum: "$items.price" }
        }
    },
    { $sort: { "_id.month": 1, total: -1 } },
    {
        $group: {
            _id: "$_id.month",
            orderId: { $first: "$_id.order" },
            maxTotal: { $first: "$total" }
        }
    },
    { $sort: { "_id.month": 1 } }
]);

//!== Konfigurace / administrace (collection & cluster)

// 13 – sharding – krátký výpis stavu
sh.status();

// 14 – informace o kolekci s validačním schématem
use("ecommerce");
db.getCollectionInfos({ name: "orders" });

// 15 – změna zpřísnění validace (přidavat do validace nejde takže se přepíše): 
// povolí jen známé stavy objednávky
use("ecommerce");
db.runCommand({
    collMod: "orders",
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["order_status"],
            properties: {
                order_status: { enum: ["created", "approved", "shipped", "delivered", "canceled", "returned"] }
            }
        }
    }
});

// 16 – Nastavení logování pomalých dotazů na mongos
use("ecommerce");
db.customers.getShardDistribution()

// 17 - Zobrazení pomalých dotazů a zdrojů připojení
use("ecommerce");
db.adminCommand({
    getLog: "global"
}).log.filter(line => line.includes("command")).slice(0, 50);

// 18 – odpojení a připojení shardu od clusteru
// 'docker network disconnect - f funkcni_reseni_default "shard-02-node-a"'
// 'docker network connect funkcni_reseni_default "shard-02-node-a"'


// !== Nested (embedded) dokumenty

// 19 – objednávky, kde alespoň jedna položka stála > 100 Kč
use("ecommerce");
db.orders.find(
    { items: { $elemMatch: { price: { $gt: 100 } } } },
    {
        _id: 1,
        order_status: 1,
        order_purchase_timestamp: 1,
        "items.price": 1,
        "items.product_id": 1,
        "items.shipping_limit_date": 1
    }
).limit(5);

// 20 – projekce jen drahých položek (> 200 Kč) – používá $filter
use("ecommerce");
db.orders.aggregate([
    {
        $lookup: {
            from: "products",
            localField: "items.product_id",
            foreignField: "_id",
            as: "products"
        }
    },
    {
        $project: {
            _id: 1,
            order_status: 1,
            order_purchase_timestamp: 1,
            customer_id: 1,
            expensiveItems: {
                $filter: {
                    input: "$items",
                    as: "it",
                    cond: { $gt: ["$$it.price", 200] }
                }
            },
            products: {
                $filter: {
                    input: "$products",
                    as: "p",
                    cond: { $in: ["$$p._id", "$items.product_id"] }
                }
            }
        }
    }
])

// 21 – výpočet marže na položku
use("ecommerce");
db.orders.aggregate([
    { $unwind: "$items" }, // rozbalí pole veci v objednávce
    {
        $lookup: {
            from: "products", // připojí kolekci products
            localField: "items.product_id",
            foreignField: "_id",
            as: "product"
        }
    },
    { $unwind: "$product" }, // rozbalí pole veci v produktu
    {
        $project: {
            order: "$_id",
            order_status: 1,
            customer_id: 1,
            // product_id: "$items.product_id",
            // product_category: "$product.product_category_name",
            // product_weight_g: "$product.product_weight_g",
            price: "$items.price",
            freight: "$items.freight_value",
            margin: { $subtract: ["$items.price", "$items.freight_value"] }
        }
    }
]);

// 22 – update nested pole pomocí pozičního operátoru [$]
// nastaví novou lhůtu dopravy pro první položku konkrétního produktu
use("ecommerce");
db.orders.findOneAndUpdate(
    { _id: "05b126974a95c4a8c2ed51e8e0334c6e", "items.product_id": "83b9bc6aae6f527ff6aafb9e01d6cbf3" },
    { $set: { "items.$.shipping_limit_date": new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) } },
    {
        returnDocument: "after",
        projection: {
            _id: 1,
            order_status: 1,
            order_purchase_timestamp: 1,
            "items.product_id": 1,
            "items.shipping_limit_date": 1,
            "items.price": 1
        }
    }
);

/*
23 – $reduce uvnitř $addFields  
   z každé objednávky udělá malý "statistický balíček" nad embedded polem items  
   počítáme celkové poštovné, kolik položek stálo > 200 Kč a nejnižší cenu v objednávce  
   $reduce prochází položku po položce a kumuluje hodnoty do objektu $$value             */
use("ecommerce");
db.orders.aggregate([
    {
        $addFields: {
            itemStats: {
                $reduce: {
                    input: "$items",
                    initialValue: { totalFreight: 0, expensiveCnt: 0, minPrice: Number.MAX_VALUE },
                    in: {
                        totalFreight: { $add: ["$$value.totalFreight", "$$this.freight_value"] },
                        expensiveCnt: {
                            $add: ["$$value.expensiveCnt",
                                { $cond: [{ $gt: ["$$this.price", 200] }, 1, 0] }]
                        },
                        minPrice: {
                            $cond: [
                                { $lt: ["$$this.price", "$$value.minPrice"] },
                                "$$this.price",
                                "$$value.minPrice"
                            ]
                        }
                    }
                }
            }
        }
    },
    {
        $project: {
            _id: 1,
            order_status: 1,
            "itemStats.totalFreight": 1,
            "itemStats.expensiveCnt": 1,
            "itemStats.minPrice": 1
        }
    },
    { $limit: 8 }                                               // výsledků jen pár, ať je ukázka čitelná
]);

use("ecommerce");
/*
24 – $bucketAuto – dynamické cenové "pásma" objednávek  
   sečteme ceny položek uvnitř každé objednávky (unwind → group)  
   $bucketAuto podle totalPrice rozdělí všechny objednávky do 4 intervalů po 10 objednávkách  
   pro každý koš vracíme seznam objednávek a průměrný počet položek        */
db.orders.aggregate([
    { $unwind: "$items" },
    {
        $group: {
            _id: "$_id",
            order_status: { $first: "$order_status" },
            totalPrice: { $sum: "$items.price" },
            itemCnt: { $sum: 1 }
        }
    },
    {
        $bucketAuto: {
            groupBy: "$totalPrice",
            buckets: 4,
            output: {
                orders: { $push: { orderId: "$_id", total: "$totalPrice", order_status: "$order_status" } },
                avgItems: { $avg: "$itemCnt" }
            }
        }
    },
    {
        $project: {
            _id: 0,
            rangeMin: "$_id.min",          // hranice intervalu, které bucketAuto vyneslo do _id
            rangeMax: "$_id.max",
            avgItems: 1,
            orders: { $slice: ["$orders", 10] } // jen prvních 10 z každého "kyblíku"
        }
    }
]);

// !== Indexy (vytváření / využití / statistiky)
// 25 – tvorba compound indexu na orders (customer + status)
use("ecommerce");
db.orders.createIndex({ customer_id: 1, order_status: 1 });

// 26 – dotaz, který nutí Mongo použít právě vytvořený index (hint)
use("ecommerce");
db.orders.find(
    { customer_id: "e50a30de3c32f9406a7185f40ce6874d", order_status: "delivered" }
).hint({ customer_id: 1, order_status: 1 });

// 27 - smazání nevyužívaného indexu na products.product_category_name
use("ecommerce");
db.products.dropIndex({ product_category_name: 1 });

// 28 – explain – přehled, zda se index použije a jaký node
use("ecommerce");
db.orders.find(
    { customer_id: "e50a30de3c32f9406a7185f40ce6874d", order_status: "created" }
).hint({ customer_id: 1, order_status: 1 }).explain("executionStats");

// 29 – výpis všech indexů kolekce customers
use("ecommerce");
db.customers.getIndexes();

// 30 – $indexStats – dlouhodobá statistika používání indexů na orders
use("ecommerce");
db.orders.aggregate([{ $indexStats: {} }]);
