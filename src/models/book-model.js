const bookCollection = "books"
const uuid = require("uuid")

let db = ""

class BookModel {
    constructor(opts) {
        let self = this;
        self.mongo = opts.mongo
        self.config = opts.config
        db = self.config.get('database.db_name');
    }

    async GetAllBooks(limit, skip) {
        const self = this;

        const options = {}

        if (limit) {
            options.limit = parseInt(limit)
        }

        if (skip) {
            options.skip = parseInt(skip)
        }

        const result = await self.mongo.find(db, bookCollection, null, options);

        return result;
    }

    async GetBook(bookId) {
        const self = this;

        const query = {bookId: bookId};

        const result = await self.mongo.find(db, bookCollection, query);

        return result;
    }

    async InsertBook(title, description, genre, author, year_published) {
        const self = this;
        const dateAdded = Date.now(); // timestamp
        const bookId = uuid.v4(); // generate unique id

        const query = {
            bookId: bookId, title: title, description: description, genre: genre,
            author: author, year_published: year_published, borrow_status: "Available",
            last_borrower: "NA", dateAdded: dateAdded
        };

        const result = await self.mongo.insert(db, bookCollection, query, null);
        result.bookId = bookId;

        return result;
    }

    async UpdateBook(bookId, title, description, genre, author, year_published, borrow_status, last_borrower) {
        const self = this;

        const options = {};

        if (title) {
            options.title = title;
        }

        if (description) {
            options.description = description;
        }

        if (genre) {
            options.genre = genre;
        }

        if (author) {
            options.author = author;
        }

        if (description) {
            options.description = description;
        }

        if (year_published) {
            options.year_published = year_published;
        }

        if (borrow_status) {
            options.borrow_status = borrow_status;
        }

        if (last_borrower) {
            options.last_borrower = last_borrower;
        }

        const query = {bookId: bookId};
        const result = await self.mongo.update(db, bookCollection, query, options);

        return result;
    }

    async DeleteBook(bookId) {
        const self = this;

        const query = {bookId: bookId}

        const result = await self.mongo.delete(db, bookCollection, query, null);

        return result;
    }
}

module.exports = BookModel