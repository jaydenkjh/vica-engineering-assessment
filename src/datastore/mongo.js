const
    mongodb = require('mongodb')

class Mongo {
    constructor(url, config) {
        const self = this;

        const client = new mongodb.MongoClient(url)


        self.mongoClient = client
        self.config = config

        const dbName = self.config.get("database.db_name")
        self.dbName = dbName

    }

    async init() {
        let self = this;

        await self.mongoClient.connect();

        const collections = self.config.get("database.collections");

        if (!Array.isArray(collections)) {
            throw new Error("Invalid collection config")
        }

        collections.forEach((collection) => {
            self.mongoClient.db(self.dbName).createCollection(collection, function (err, res) {
                if (!err) {
                    console.log(`Collection ${collection} created`);
                }
            });
        })

    }

    find(database, collection, query, options) {
        const self = this;

        const coll = self.getCollection(database, collection);
        const findResult = coll.find(query, options).toArray();

        return findResult;
    }

    insert(database, collection, query, options) {
        let self = this;

        const coll = self.getCollection(database, collection);

        let result = null
        if (Array.isArray(query)) {
            result = coll.insertMany(query);
        } else {
            result = coll.insertOne(query);
        }

        return result
    }

    async update(database, collection, query, options) {
        let self = this;

        const coll = self.getCollection(database, collection);

        const result = await coll.updateOne(query, {$set: options});
        return result;
    }

    async delete(database, collection, query, options) {
        let self = this;

        const coll = self.getCollection(database, collection);

        let result = null;

        result = await coll.deleteOne(query, options);

        return result;
    }

    getCollection(db, collection) {
        let self = this;
        const coll = self.mongoClient.db(db).collection(collection);
        if (!coll) throw new Error('DB or collection not found')

        return coll
    }
}


module.exports = Mongo;