const userRequestCollection = "user-requests"
const uuid = require("uuid")

let db = ""

class UserRequestModel {
    constructor(opts) {
        let self = this;
        self.mongo = opts.mongo
        self.config = opts.config
        db = self.config.get('database.db_name');
    }

    async GetAllRequests(limit, skip, status){
        const self = this;

        const query = {};
        if (status){
            query.status = status;
        }

        const options = {}

        if (limit){
            options.limit = parseInt(limit)
        }

        if (skip){
            options.skip = parseInt(skip)
        }

        const result = await self.mongo.find(db, userRequestCollection, query, options);

        return result;
    }

    async GetRequest(requestId){
        const self = this;

        const query = {requestId: requestId};

        const result = await self.mongo.find(db, userRequestCollection, query, null);

        return result;
    }

    async InsertRequest(userId, requestType, payload){
        const self = this;
        const requestDate = Date.now(); // timestamp

        const requestId = uuid.v4();

        const query = {requestId: requestId, requestType: requestType, payload: payload, status: "Pending", requestorId: userId,requestDate: requestDate};

        const result = await self.mongo.insert(db, userRequestCollection, query, null);
        result.requestId = requestId
        result.status = "Pending"

        return result;
    }

    async UpdateRequest(requestId, status){
        const self = this;

        const options = {};
        options.status = status;

        const query = {requestId: requestId};

        const result = await self.mongo.update(db, userRequestCollection, query, options);

        return result;
    }

}
module.exports = UserRequestModel