const errorCode = require("../constants/error_codes");

class BookService {
    constructor(parentController, opts) {
        let self = this;

        self.parentController = parentController;
        self.config = opts.config;
    }

    async GetAllBooks(req, res) {
        let self = this;

        const limit = req.query.limit;
        const skip = req.query.skip;

        /* Future enhancement: Add filtering, sorting */

        const result = await self.parentController.model.books.GetAllBooks(limit, skip);

        const response = {success: true, data: result}
        console.log(`[BookService :: GetAllBooks] ${JSON.stringify(response)}`)
        return res.status(200).json(response);
    }

    async GetBook(req, res) {
        let self = this;

        const bookId = req.params.book_id;

        if (!bookId || bookId == "") {
            const response = {success: false, code: errorCode.missingParams, message: "missing book id"}
            console.log(`[BookService :: GetBook] ${JSON.stringify(response)}`)
            return res.status(400).json(response)
        }

        const result = await self.parentController.model.books.GetBook(bookId)

        if (!result || result.length < 1) {
            const response = {success: false, code: errorCode.missingInDb, message: "Book not found"}
            console.log(`[BookService :: GetBook] ${JSON.stringify(response)}`)
            return res.status(400).json(response)
        }

        const response = {success: true, data: result[0]}
        console.log(`[BookService :: GetBook] ${JSON.stringify(response)}`)
        return res.status(200).json(response);
    }

    async InsertBook(req, res) {
        let self = this;

        const fields = req.body;

        if (!fields.title || !fields.description || !fields.genre || !fields.author || !fields.year_published) {
            const response = {
                success: false,
                code: errorCode.missingParams,
                message: "missing books parameters. title, description, genre, author, year_published required."
            }
            console.log(`[BookService :: InsertBook] ${JSON.stringify(response)}`)
            return res.status(400).json(response)
        }

        const result = await self.parentController.model.books.InsertBook(fields.title, fields.description, fields.genre, fields.author, fields.year_published)

        const response = {success: true, data: result}
        console.log(`[BookService :: InsertBook] ${JSON.stringify(response)}`)
        return res.status(201).json(response)
    }

    async UpdateBook(req, res) {
        let self = this;

        const fields = req.body;

        const bookId = req.params.book_id;

        if (!bookId || bookId == "") {
            const response = {success: false, code: errorCode.missingParams, message: "missing bookId"};
            console.log(`[BookService :: UpdateBook] ${JSON.stringify(response)}`);
            return res.status(400).json(response);
        }

        if (!fields.title && !fields.description && !fields.genre && !fields.author && !fields.year_published && !fields.borrow_status && !fields.last_borrower) {
            const response = {
                success: false,
                code: errorCode.missingParams,
                message: "at least one books parameter required. title, description, genre, author, year_published required."
            }
            console.log(`[BookService :: UpdateBook] ${JSON.stringify(response)}`)
            return res.status(400).json(response)
        }

        if (fields.borrow_status && fields.borrow_status != "Borrowed" && fields.borrow_status != "Available") {
            const response = {
                success: false,
                code: errorCode.invalidParams,
                message: "borrow status should only be Borrowed or Available"
            }
            console.log(`[BookService :: UpdateBook] ${JSON.stringify(response)}`)
            return res.status(400).json(response)
        }

        const result = await self.parentController.model.books.UpdateBook(bookId, fields.title, fields.description, fields.genre, fields.author, fields.year_published, fields.borrow_status, fields.last_borrower)

        if (!result || result.matchedCount < 1) {
            const response = {success: false, code: errorCode.serverError, message: `Failed to update book`}
            console.log(`[BookService :: UpdateBook] ${JSON.stringify(response)}`)
            return res.status(400).json(response)
        }

        const response = {success: true, data: result};
        console.log(`[BookService :: UpdateBook] ${JSON.stringify(response)}`)
        return res.status(201).json(response)
    }

    async DeleteBook(req, res) {
        let self = this;

        const bookId = req.params.book_id;

        if (!bookId || bookId == "") {
            const response = {success: false, code: errorCode.missingParams, message: "missing book id"}
            console.log(`[BookService :: DeleteBook] ${JSON.stringify(response)}`)
            return res.status(400).json(response)
        }

        const result = await self.parentController.model.books.DeleteBook(bookId);

        if (!result || result.deletedCount < 1) {
            const response = {success: false, code: errorCode.serverError, message: `Failed to delete bookId`}
            console.log(`[BookService :: DeleteBook] ${JSON.stringify(response)}`)
            return res.status(400).json(response)
        }

        const response = {success: true, data: result};
        console.log(`[BookService :: DeleteBook] ${JSON.stringify(response)}`)
        return res.status(201).json(response)
    }


}

module.exports = BookService