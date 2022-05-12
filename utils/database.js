const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect(
        "mongodb+srv://node-shop:" +
            "node-shop" +
            "@sachincluster123.u43vg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    )
        .then((client) => {
            console.log("Connected!");
            _db = client.db();
            callback(client);
        })
        .catch((err) => {
            console.log(err);
            throw err;
        });
};

const getDb = () => {
    if(_db){
        return _db;
    }
    throw 'No Database Found!';
}

module.exports.mongoConnect = mongoConnect;
module.exports.getDb = getDb;
