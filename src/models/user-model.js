const userCollection = "users"
const uuid = require("uuid")

let db = ""

class UserModel {
    constructor(opts) {
        let self = this;
        self.mongo = opts.mongo
        self.config = opts.config
        db = self.config.get('database.db_name');
    }

    async GetAllUsers(limit, skip) {
        const self = this;

        const options = {}

        if (limit) {
            options.limit = parseInt(limit)
        }

        if (skip) {
            options.skip = parseInt(skip)
        }

        const result = await self.mongo.find(db, userCollection, null, options);

        return result;
    }

    async GetUser(userId) {
        const self = this;

        const query = {userId: userId};

        const result = await self.mongo.find(db, userCollection, query);

        return result;
    }

    async InsertUser(name, role) {
        const self = this;
        const dateJoined = Date.now(); // timestamp
        const userId = uuid.v4(); // generate unique id

        const query = {userId: userId, name: name, role: role, dateJoined: dateJoined};

        const result = await self.mongo.insert(db, userCollection, query, null);
        result.userId = userId
        result.status = "Completed"

        return result;
    }

    async UpdateUser(userId, name, role) {
        const self = this;

        const options = {};

        if (name) {
            options.name = name;
        }

        if (role) {
            options.role = role;
        }

        const query = {userId: userId};

        const result = await self.mongo.update(db, userCollection, query, options);

        return result;
    }

    async DeleteUser(userId) {
        const self = this;

        const query = {userId: userId}

        const result = await self.mongo.delete(db, userCollection, query, null);
        result.status = "Completed"

        return result;

    }
}

module.exports = UserModel