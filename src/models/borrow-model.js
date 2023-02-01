const borrowCollection = "borrow";
const uuid = require("uuid");

let db = ""

class BorrowModel {
    constructor(opts) {
        let self = this;
        self.mongo = opts.mongo;
        self.config = opts.config;
        db = self.config.get('database.db_name');
    }

    async GetAllBorrows(limit, skip) {
        const self = this;

        const options = {};

        if (limit) {
            options.limit = parseInt(limit);
        }

        if (skip) {
            options.skip = parseInt(skip);
        }

        const result = await self.mongo.find(db, borrowCollection, null, options);

        return result;
    }

    async GetBorrow(borrowId) {
        const self = this;

        const query = {borrowId: borrowId};

        const result = await self.mongo.find(db, borrowCollection, query, null);

        return result;
    }

    async InsertBorrow(userId, bookId) {
        const self = this;
        const borrowDate = Date.now(); // timestamp
        const borrowId = uuid.v4(); // generate unique id

        const query = {
            borrowId: borrowId, userId: userId, bookId: bookId, borrowDate: borrowDate, returnDate: null
        };

        const result = await self.mongo.insert(db, borrowCollection, query, null);
        result.borrowId = borrowId;

        return result;
    }

    async UpdateBorrow(borrowId) {
        const self = this;

        const returnDate = Date.now()

        const options = {returnDate: returnDate};

        const query = {borrowId: borrowId};

        const result = await self.mongo.update(db, borrowCollection, query, options);

        return result;
    }
}
module.exports = BorrowModel