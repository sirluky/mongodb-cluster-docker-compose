// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use("ecommerce");
// Distribuce dat zakazniku
db.customers.getShardDistribution()


sh.reshardCollection("ecommerce.orders");
sh.status();
db.customers.getShardDistribution()
sh.getBalancerState()

// run in mongosh, connected to a mongos
sh.shardAndDistributeCollection(
    "ecommerce.orders",          // namespace
    { _id: "hashed" },           // better key for even spread
    false,                       // not unique
    { numInitialChunks: 12 }     // split into 12 chunks immediately
);



db.adminCommand({
    reshardCollection: "ecommerce.orders",
    key: { _id: "hashed" },
    numInitialChunks: 12          // optional but speeds things up
});
