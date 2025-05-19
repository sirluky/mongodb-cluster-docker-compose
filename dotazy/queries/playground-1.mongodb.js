
use("ecommerce");
db.customers.getShardDistribution()

db.products.getShardDistribution()

db.orders.getShardDistribution()
db.products.getShardDistribution()
db.customers.getShardDistribution()
sh.getBalancerState()
sh.moveChunk()


use("ecommerce");

db.orders.aggregate([
    {
        $unwind: "$items" // 1. De-normalizuje pole 'items'
    },
    {
        $group: { // 2. Seskupí dokumenty podle _id objednávky
            _id: "$_id", // Klíč seskupení - _id objednávky
            customer_id: { $first: "$customer_id" },
            totalOrderValue: { $sum: "$items.price" }, // Sečte ceny všech položek
            totalItems: { $sum: 1 } // Spočítá počet položek
        }
    },
    {
        $sort: { totalOrderValue: -1 } // 3. Seřadí výsledky
    },
    {
        $limit: 10 // 4. Omezíme výstup na prvních 10
    },
    {
        $lookup: { // 5. Připojíme (join) data z kolekce 'customers'
            from: "customers", // Kolekce, se kterou se spojuje
            localField: "customer_id", // Pole z *tohoto* dokumentu (výsledek $group), které se má porovnat
            foreignField: "_id", // Pole z kolekce 'customers', se kterým se má porovnat localField
            as: "customerDetails" // Název nového pole (pole dokumentů), kam se uloží nalezené zákazníci
        }
    },
    {
        // $lookup vrací pole, i když očekáváme jen jeden výsledek.
        // $unwind ho dekonstruuje na samostatný dokument pro každého nalezeného zákazníka.
        // (V tomto případě by mělo být pole vždy s jedním nebo žádným prvkem).
        $unwind: "$customerDetails"
    },
    {
        $project: { // 6. Definuje, která pole se mají ve výstupu zobrazit
            _id: 1, // _id objednávky
            totalOrderValue: 1, // Celková hodnota objednávky
            totalItems: 1, // Celkový počet položek

            customerCity: "$customerDetails.customer_city",
            customerState: "$customerDetails.customer_state"
        }
    }
]);


Vysvětlení změn:

$group fáze: Byla upravena tak, aby kromě součtů(totalOrderValue, totalItems) zachytila také customer_id z původního dokumentu objednávky pomocí $first: "$customer_id".Toto pole je nezbytné pro následné spojení s kolekcí customers.

$lookup fáze: Toto je klíčová nová fáze.Provádí spojení mezi dokumenty vycházejícími z předchozí fáze($group - což jsou dokumenty agregované na úrovni objednávky, které teď obsahují i customer_id) a kolekcí customers.Spojení probíhá na základě shody mezi customer_id(z $group výstupu) a _id(primární klíč v customers).Výsledek spojení se uloží do nového pole nazvaného customerDetails v každém dokumentu.

Druhý $unwind fáze: Protože $lookup vždy vrací pole(i když v tomto případě očekáváme maximálně jeden výsledek), použijeme další $unwind na nově vytvořené pole "$customerDetails".Tím se dokument s polem[{ customerDoc }] změní na dokument s přímo vloženým customerDoc, což usnadňuje přístup k jeho polím v další fázi.Pokud by customerDetails bylo prázdné pole(např.pokud by k customer_id nebyl nalezen odpovídající zákazník), $unwind by tento dokument z pipeline odstranil(defaultní chování).

$project fáze: Byla rozšířena o pole jako customerUniqueId, customerCity a customerState, které se získávají z vnořeného dokumentu customerDetails(který byl dekonstruován pomocí $unwind).

Tento upravený dotaz nejprve spočítá agregace na úrovni objednávky, seřadí a omezí, a poté pro top N objednávek dohledá informace o zákazníkovi a přidá je do výsledku.

    // Příklad 1: Zjištění celkové ceny a počtu položek pro každou objednávku, seřazeno podle celkové ceny sestupně
    // Dotaz: Získejte pro každou objednávku její _id, celkovou sumu cen všech položek a celkový počet položek.
    // Výsledky seřaďte od nejdražší objednávky. Zobrazte pouze prvních 10.
    use("ecommerce");

db.orders.aggregate([
        {
            $unwind: "$items" // De-normalizuje pole 'items', vytvoří samostatný dokument pro každou položku v objednávce
        },
        {
            $group: { // Seskupí dokumenty podle _id objednávky
                _id: "$_id", // Klíč seskupení - _id objednávky
                totalOrderValue: { $sum: "$items.price" }, // Sečte ceny všech položek v dané objednávce
                totalItems: { $sum: 1 } // Spočítá počet položek v dané objednávce
            }
        },
        {
            $sort: { totalOrderValue: -1 } // Seřadí výsledky podle celkové hodnoty objednávky sestupně
        },
        {
            $limit: 10 // Omezí výstup na prvních 10 objednávek
        },
        {
            $project: { // Definuje, která pole se mají ve výstupu zobrazit
                _id: 1, // Zobrazí _id objednávky
                totalOrderValue: 1, // Zobrazí celkovou hodnotu objednávky
                totalItems: 1, // Zobrazí celkový počet položek
                "customer.customer_unique_id": 1,
                "customer.customer_city": 1,
                "customer.customer_state": 1
                // order_status: 1 // Toto by zde nefungovalo, protože order_status není v $group fázi
            }
        }
    ]);
// Vysvětlení:
// $unwind: Tento operátor "rozbalí" pole `items` v každém dokumentu objednávky. Pokud má objednávka 3 položky, vzniknou 3 samostatné dokumenty, každý s jednou položkou, ale se stejnými ostatními poli objednávky.
// $group: Následně seskupujeme tyto "rozbalené" dokumenty zpět podle `_id` původní objednávky.
//   _id: "$_id": Určuje, že seskupení proběhne na základě unikátního identifikátoru objednávky.
//   totalOrderValue: { $sum: "$items.price" }: Pro každou skupinu (objednávku) sečte hodnoty pole `price` ze všech de-normalizovaných položek (`items.price`).
//   totalItems: { $sum: 1 }: Pro každou skupinu (objednávku) spočítá počet de-normalizovaných položek, což odpovídá celkovému počtu položek v objednávce.
// $sort: Seřadí výsledné dokumenty (každý reprezentuje jednu objednávku s agregovanými daty) podle pole `totalOrderValue` v sestupném pořadí (od nejvyšší hodnoty po nejnižší).
// $limit: Omezí počet vrácených dokumentů na prvních 10 po seřazení.
// $project: Specifikuje finální strukturu výstupních dokumentů. Zde chceme zobrazit `_id` objednávky, vypočítanou `totalOrderValue` a `totalItems`.

// Příklad 2: Počet objednávek podle stavu
// Dotaz: Spočítejte, kolik objednávek se nachází v každém `order_status`.
db.orders.aggregate([
    {
        $group: { // Seskupí dokumenty podle hodnoty pole 'order_status'
            _id: "$order_status", // Klíč seskupení - stav objednávky
            count: { $sum: 1 } // Pro každý stav spočítá počet objednávek
        }
    },
    {
        $sort: { count: -1 } // Seřadí stavy podle počtu objednávek sestupně
    }
]);
// Vysvětlení:
// $group: Seskupuje všechny dokumenty v kolekci `orders`.
//   _id: "$order_status": Jako klíč seskupení používá hodnotu pole `order_status`. Tím vznikne jedna skupina pro každý unikátní stav objednávky (např. "delivered", "shipped", "canceled").
//   count: { $sum: 1 }: Pro každou vytvořenou skupinu (tj. pro každý stav) sečte jedničku za každý dokument, který do této skupiny spadá. Výsledkem je celkový počet objednávek pro daný stav.
// $sort: Seřadí výsledné dokumenty (kde každý dokument reprezentuje jeden stav a jeho počet) podle pole `count` v sestupném pořadí.

// Příklad 3: Průměrná cena a dopravné pro produkty v určité kategorii
// Dotaz: Najděte průměrnou cenu (`price`) a průměrné dopravné (`freight_value`) pro všechny položky objednávek, které patří k produktům z kategorie 'informatica_acessorios'.
db.orders.aggregate([
    {
        $unwind: "$items" // Rozbalí položky objednávek
    },
    {
        $lookup: { // Propojí položky objednávek s kolekcí 'products'
            from: "products", // Cílová kolekce pro propojení
            localField: "items.product_id", // Pole v kolekci 'orders' (po unwindu)
            foreignField: "_id", // Pole v kolekci 'products'
            as: "product_details" // Název nového pole, které bude obsahovat propojené dokumenty z 'products'
        }
    },
    {
        $unwind: "$product_details" // Rozbalí pole 'product_details' (předpokládáme, že product_id je unikátní)
    },
    {
        $match: { // Filtruje pouze produkty z dané kategorie
            "product_details.product_category_name": "informatica_acessorios"
        }
    },
    {
        $group: { // Seskupí výsledky (v tomto případě do jedné skupiny, protože _id je null)
            _id: "informatica_acessorios", // Statický identifikátor skupiny
            averagePrice: { $avg: "$items.price" }, // Vypočítá průměrnou cenu položek
            averageFreightValue: { $avg: "$items.freight_value" } // Vypočítá průměrné dopravné
        }
    }
]);
// Vysvětlení:
// $unwind: "$items": De-normalizuje pole `items` z kolekce `orders`.
// $lookup: Provede levé vnější spojení s kolekcí `products`.
//   from: "products": Specifikuje kolekci, se kterou se má spojit.
//   localField: "items.product_id": Pole z (rozbalené) kolekce `orders`, které se použije pro spojení.
//   foreignField: "_id": Pole z kolekce `products`, které se použije pro spojení.
//   as: "product_details": Výsledek spojení (nalezený produkt/produkty) bude přidán jako pole `product_details` do dokumentu z `orders`.
// $unwind: "$product_details": Protože `product_id` by mělo být unikátní, `product_details` bude pole s jedním prvkem. Tento `$unwind` ho "rozbalí" na objekt.
// $match: Filtruje dokumenty tak, aby zůstaly pouze ty, kde `product_category_name` v propojeném `product_details` je "informatica_acessorios".
// $group:
//   _id: "informatica_acessorios": Seskupí všechny vyfiltrované položky do jedné skupiny (protože chceme celkový průměr pro tuto kategorii).
//   averagePrice: { $avg: "$items.price" }: Vypočítá průměrnou hodnotu pole `price` ze všech položek patřících do kategorie "informatica_acessorios".
//   averageFreightValue: { $avg: "$items.freight_value" }: Vypočítá průměrnou hodnotu pole `freight_value` pro tyto položky.

// Příklad 4: Najdi 5 zákazníků s největším počtem objednávek
// Dotaz: Zjistěte, kteří zákazníci (jejich `customer_id`) mají nejvíce objednávek, a zobrazte prvních 5.
db.orders.aggregate([
    {
        $group: { // Seskupí objednávky podle customer_id
            _id: "$customer_id",
            numberOfOrders: { $sum: 1 } // Spočítá počet objednávek pro každého zákazníka
        }
    },
    {
        $sort: { numberOfOrders: -1 } // Seřadí zákazníky podle počtu objednávek sestupně
    },
    {
        $limit: 5 // Omezí výstup na prvních 5 zákazníků
    },
    {
        $lookup: { // Připojí detailní informace o zákazníkovi
            from: "customers",
            localField: "_id", // customer_id z předchozí fáze
            foreignField: "customer_id", // customer_id v kolekci customers
            as: "customerInfo"
        }
    },
    {
        $unwind: "$customerInfo" // Rozbalí pole s informacemi o zákazníkovi
    },
    {
        $project: { // Vybere finální pole pro zobrazení
            _id: 0, // Skryje původní _id (což je customer_id)
            customerId: "$_id",
            numberOfOrders: 1,
            customerUniqueId: "$customerInfo.customer_unique_id",
            city: "$customerInfo.customer_city",
            state: "$customerInfo.customer_state"
        }
    }
]);
// Vysvětlení:
// $group: Seskupí dokumenty z kolekce `orders` podle `customer_id`.
//   _id: "$customer_id": Klíč seskupení.
//   numberOfOrders: { $sum: 1 }: Pro každého zákazníka spočítá počet jeho objednávek.
// $sort: Seřadí zákazníky podle `numberOfOrders` sestupně.
// $limit: Omezí výsledek na prvních 5 zákazníků.
// $lookup: Připojí informace z kolekce `customers`.
//   localField: "_id": Zde `_id` je `customer_id` z výsledku `$group` fáze.
//   foreignField: "customer_id": Porovnává s `customer_id` v kolekci `customers`. (Poznámka: Lepší by bylo porovnávat s `customers._id`, pokud `customers.customer_id` není unikátní index nebo primární klíč). Ve vašem schématu je `customers._id` definováno jako primární klíč a `customers.customer_id` jako cizí klíč pro `orders.customer_id`. Zde by tedy mělo být `foreignField: "_id"` nebo `foreignField: "customer_id"` pokud je unikátní. Pro tento příklad ponechávám `customer_id` dle popisu, ale zvažte `_id`.
// $unwind: Rozbalí pole `customerInfo`, protože očekáváme jednoho zákazníka.
// $project: Formátuje výstup tak, aby obsahoval `customerId`, `numberOfOrders` a vybrané detaily zákazníka.

// Příklad 5: Objednávky vytvořené v určitém časovém rozmezí s konkrétním stavem
// Dotaz: Najděte všechny objednávky vytvořené (order_purchase_timestamp) v lednu 2017, které mají stav 'delivered'.
// Zobrazte pouze _id objednávky, datum nákupu a datum doručení zákazníkovi.
db.orders.aggregate([
    {
        $match: { // Filtruje objednávky
            order_purchase_timestamp: {
                $gte: ISODate("2017-01-01T00:00:00.000Z"), // Větší nebo rovno než 1. leden 2017
                $lt: ISODate("2017-02-01T00:00:00.000Z")  // Menší než 1. únor 2017
            },
            order_status: "delivered" // Stav objednávky je 'delivered'
        }
    },
    {
        $project: { // Vybere pole pro zobrazení
            _id: 1,
            order_purchase_timestamp: 1,
            order_delivered_customer_date: 1
        }
    },
    {
        $sort: { order_purchase_timestamp: 1 } // Seřadí podle data nákupu vzestupně
    }
]);
// Vysvětlení:
// $match: Filtruje dokumenty v kolekci `orders`.
//   order_purchase_timestamp: {$gte: ..., $lt: ...}: Vybere objednávky, jejichž `order_purchase_timestamp` spadá do ledna 2017. Používáme `ISODate` pro správné porovnání dat.
//   order_status: "delivered": Dále omezuje výběr na objednávky se statusem "delivered".
// $project: Definuje, která pole se mají zobrazit ve výsledku: `_id` objednávky, `order_purchase_timestamp` a `order_delivered_customer_date`.
// $sort: Seřadí vyfiltrované a projeté objednávky podle data nákupu vzestupně.

// Příklad 6: Seznam produktů, které byly součástí objednávek se zpožděným doručením
// Dotaz: Získejte seznam unikátních ID produktů, které byly součástí objednávek, kde `order_delivered_customer_date` je pozdější než `order_estimated_delivery_date`.
// Spolu s ID produktu zobrazte i jeho kategorii.
db.orders.aggregate([
    {
        $match: { // Filtruje objednávky, kde skutečné doručení je pozdější než odhadované
            $expr: { $gt: ["$order_delivered_customer_date", "$order_estimated_delivery_date"] }
            // $expr umožňuje použít agregační výrazy v dotazu $match pro porovnání hodnot dvou polí
        }
    },
    {
        $unwind: "$items" // Rozbalí položky objednávek
    },
    {
        $group: { // Seskupí podle ID produktu, aby se získaly unikátní produkty
            _id: "$items.product_id"
        }
    },
    {
        $lookup: { // Připojí informace o produktu
            from: "products",
            localField: "_id", // product_id z předchozí fáze
            foreignField: "_id", // _id v kolekci products
            as: "productInfo"
        }
    },
    {
        $unwind: "$productInfo"
    },
    {
        $project: { // Formátuje výstup
            _id: 0, // Skryje původní _id (což je product_id)
            productId: "$_id",
            productCategory: "$productInfo.product_category_name"
        }
    },
    {
        $sort: { productId: 1 } // Seřadí podle ID produktu
    }
]);
// Vysvětlení:
// $match:
//   $expr: { $gt: ["$order_delivered_customer_date", "$order_estimated_delivery_date"] }: Filtruje objednávky, kde datum skutečného doručení (`order_delivered_customer_date`) je větší (pozdější) než odhadované datum doručení (`order_estimated_delivery_date`). Operátor `$expr` umožňuje použít agregační výrazy, včetně porovnání hodnot dvou polí přímo v `$match` fázi.
// $unwind: "$items": Rozbalí pole `items`, aby každá položka objednávky byla samostatným dokumentem.
// $group:
//   _id: "$items.product_id": Seskupí dokumenty podle `product_id` z položek. Tím získáme seznam unikátních ID produktů, které byly v opožděných objednávkách.
// $lookup: Připojí detaily produktu z kolekce `products` na základě `product_id`.
// $unwind: "$productInfo": Rozbalí pole `productInfo` (očekává se jeden produkt).
// $project: Formátuje výstup, aby obsahoval `productId` a `productCategory`.
// $sort: Seřadí výsledky podle `productId` vzestupně.


// Kategorie 2: Agregační Pipeline (Pokročilé - Vztahy a Pole)
//------------------------------------------------------------------

// Příklad 7: Zákazníci, kteří si objednali produkty z více než dvou různých kategorií v jedné objednávce.
// Dotaz: Najděte zákazníky (customer_unique_id) a ID jejich objednávek, kde objednávka obsahovala produkty z více než 2 různých kategorií.
db.orders.aggregate([
    {
        $unwind: "$items" // Rozbalíme položky objednávky
    },
    {
        $lookup: { // Připojíme informace o produktu k každé položce
            from: "products",
            localField: "items.product_id",
            foreignField: "_id",
            as: "itemProductInfo"
        }
    },
    {
        $unwind: "$itemProductInfo" // Rozbalíme informace o produktu (předpokládáme 1:1)
    },
    {
        $group: { // Seskupíme podle objednávky a zákazníka, abychom shromáždili kategorie produktů
            _id: { orderId: "$_id", customerId: "$customer_id" },
            categoriesInOrder: { $addToSet: "$itemProductInfo.product_category_name" } // Vytvoříme pole unikátních kategorií v objednávce
        }
    },
    {
        $match: { // Filtrujeme objednávky, které mají více než 2 kategorie
            $expr: { $gt: [{ $size: "$categoriesInOrder" }, 2] }
        }
    },
    {
        $lookup: { // Připojíme customer_unique_id
            from: "customers",
            localField: "_id.customerId",
            foreignField: "customer_id", // Nebo lépe customers._id pokud je customer_id v orders reference na něj
            as: "customerDetails"
        }
    },
    {
        $unwind: "$customerDetails"
    },
    {
        $project: { // Formátujeme výstup
            _id: 0,
            orderId: "$_id.orderId",
            customerUniqueId: "$customerDetails.customer_unique_id",
            categories: "$categoriesInOrder",
            numberOfCategories: { $size: "$categoriesInOrder" }
        }
    },
    {
        $sort: { numberOfCategories: -1 }
    }
]);
// Vysvětlení:
// $unwind (první): Rozbalí položky objednávky.
// $lookup (první): Pro každou položku připojí detaily produktu z kolekce `products`.
// $unwind (druhý): Rozbalí pole s detaily produktu.
// $group (první):
//   _id: { orderId: "$_id", customerId: "$customer_id" }: Seskupí data podle kombinace ID objednávky a ID zákazníka.
//   categoriesInOrder: { $addToSet: "$itemProductInfo.product_category_name" }: Pro každou objednávku vytvoří pole unikátních názvů kategorií produktů, které obsahuje. `$addToSet` zajistí, že každá kategorie bude v poli pouze jednou.
// $match:
//   $expr: { $gt: [{ $size: "$categoriesInOrder" }, 2] }: Filtruje výsledky tak, aby zůstaly pouze ty objednávky, kde počet unikátních kategorií (velikost pole `categoriesInOrder`) je větší než 2.
// $lookup (druhý): Připojí detaily zákazníka z kolekce `customers` na základě `customerId`.
// $unwind (třetí): Rozbalí pole s detaily zákazníka.
// $project: Formátuje výstupní dokumenty, aby obsahovaly ID objednávky, unikátní ID zákazníka, seznam kategorií a jejich počet.
// $sort: Seřadí výsledky podle počtu kategorií sestupně.

// Příklad 8: Pro každou kategorii produktu, najdi nejdražší a nejlevnější produkt v ní
// Dotaz: Zobrazte pro každou `product_category_name` minimální a maximální cenu produktu (z `orders.items.price`, kde se produkt objevil).
// Toto je komplexnější, protože ceny jsou v `orders.items`, ne přímo v `products`.
// Pro zjednodušení, pokud bychom chtěli cenu z `products`, potřebovali bychom pole `price` v `products`.
// Tento dotaz se zaměří na ceny, za které byly produkty skutečně prodány.
db.orders.aggregate([
    { $unwind: "$items" },
    {
        $lookup: {
            from: "products",
            localField: "items.product_id",
            foreignField: "_id",
            as: "productInfo"
        }
    },
    { $unwind: "$productInfo" },
    { $match: { "productInfo.product_category_name": { $ne: null, $exists: true } } }, // Zajistíme, že kategorie existuje
    {
        $group: {
            _id: "$productInfo.product_category_name", // Seskupení podle kategorie produktu
            maxPriceSold: { $max: "$items.price" }, // Maximální cena, za kterou byl produkt z této kategorie prodán
            minPriceSold: { $min: "$items.price" }, // Minimální cena, za kterou byl produkt z této kategorie prodán
            productsInvolved: { $addToSet: "$items.product_id" } // Seznam unikátních produktů v této kategorii, které byly prodány
        }
    },
    {
        $project: {
            category: "$_id",
            maxPriceSold: 1,
            minPriceSold: 1,
            numberOfDistinctProductsSold: { $size: "$productsInvolved" },
            _id: 0
        }
    },
    { $sort: { category: 1 } }
]);
// Vysvětlení:
// $unwind (první): Rozbalí položky objednávek.
// $lookup: Připojí detaily produktu z kolekce `products`.
// $unwind (druhý): Rozbalí detaily produktu.
// $match: Zajistí, že `product_category_name` není `null` a existuje, aby se předešlo chybám při seskupování.
// $group:
//   _id: "$productInfo.product_category_name": Seskupí podle kategorie produktu.
//   maxPriceSold: { $max: "$items.price" }: Najde maximální cenu z `items.price` pro danou kategorii.
//   minPriceSold: { $min: "$items.price" }: Najde minimální cenu z `items.price` pro danou kategorii.
//   productsInvolved: { $addToSet: "$items.product_id" }: Shromáždí unikátní ID produktů prodaných v této kategorii.
// $project: Formátuje výstup a přidává počet unikátních prodaných produktů v kategorii.
// $sort: Seřadí výsledky podle názvu kategorie.

// Příklad 9: Objednávky obsahující produkty s délkou názvu produktu menší než 15 znaků.
// Dotaz: Najděte objednávky (jejich _id a customer_id), které obsahují alespoň jednu položku, kde délka názvu produktu (`product_name_lenght`) je menší než 15.
db.orders.aggregate([
    { $unwind: "$items" },
    {
        $lookup: {
            from: "products",
            localField: "items.product_id",
            foreignField: "_id",
            as: "productDetails"
        }
    },
    { $unwind: "$productDetails" },
    {
        $match: {
            "productDetails.product_name_lenght": { $lt: 15 }
        }
    },
    {
        $group: { // Seskupíme zpět podle objednávky, abychom neměli duplicitní objednávky
            _id: "$_id",
            customer_id: { $first: "$customer_id" }, // Vezmeme customer_id z první nalezené položky (bude stejné pro celou objednávku)
            productsWithShortName: { $push: "$productDetails._id" } // Shromáždíme ID produktů s krátkým názvem v této objednávce
        }
    },
    {
        $project: {
            orderId: "$_id",
            customerId: "$customer_id",
            productsWithShortName: 1,
            countOfShortNameProducts: { $size: "$productsWithShortName" },
            _id: 0
        }
    },
    { $sort: { orderId: 1 } }
]);
// Vysvětlení:
// $unwind (první), $lookup, $unwind (druhý): Standardní postup pro rozbalení položek a připojení detailů produktu.
// $match: Filtruje položky, kde `product_name_lenght` připojeného produktu je menší než 15.
// $group:
//   _id: "$_id": Seskupí zpět podle ID objednávky. Tím zajistíme, že každá objednávka splňující podmínku se objeví ve výsledku pouze jednou.
//   customer_id: { $first: "$customer_id" }: Převezme `customer_id` z objednávky.
//   productsWithShortName: { $push: "$productDetails._id" }: Vytvoří pole ID produktů, které v dané objednávce splnily podmínku krátkého názvu.
// $project: Formátuje výstup.
// $sort: Seřadí podle ID objednávky.

// Příklad 10: Výpočet doby mezi schválením objednávky a jejím doručením dopravci
// Dotaz: Pro každou objednávku, která byla schválena a předána dopravci, vypočítejte dobu (v milisekundách a pak v hodinách) mezi těmito dvěma událostmi.
// Zobrazte pouze objednávky, kde tato doba byla delší než 24 hodin.
db.orders.aggregate([
    {
        $match: { // Filtruje objednávky, které mají obě potřebná data
            order_approved_at: { $ne: null, $exists: true },
            order_delivered_carrier_date: { $ne: null, $exists: true }
        }
    },
    {
        $addFields: { // Přidá nové pole s vypočteným rozdílem času
            processing_time_ms:
