const errorCode = require("../constants/error_codes");

class BorrowService {
    constructor(parentController, opts) {
        let self = this;

        self.parentController = parentController;
        self.config = opts.config;
    }

    async GetAllBorrows(req, res) {
        let self = this;

        const limit = req.query.limit;
        const skip = req.query.skip;

        const result = await self.parentController.model.borrow.GetAllBorrows(limit, skip);

        const response = {success: true, data: result};
        console.log(`[BorrowService :: GetAllBorrows] ${JSON.stringify(response)}`);
        return res.status(200).json(response);
    }

    async GetBorrow(req, res) {
        let self = this;

        const borrowId = req.params.borrow_id;

        if (!borrowId || borrowId == "") {
            const response = {success: false, code: errorCode.missingParams, message: "missing borrowId"};
            console.log(`[BorrowService :: GetBorrow] ${JSON.stringify(response)}`);
            return res.status(400).json(response);
        }

        const result = await self.parentController.model.borrow.GetBorrow(borrowId);
        if (!result || result.length < 1) {
            const response = {success: false, code: errorCode.missingInDb, message: "Borrow not found"};
            console.log(`[BorrowService :: GetBorrow] ${JSON.stringify(response)}`);
            return res.status(400).json(response);
        }

        const response = {success: true, data: result[0]};
        console.log(`[BorrowService :: GetBorrow] ${JSON.stringify(response)}`);
        return res.status(200).json(response);
    }

    async InsertBorrow(req, res) {
        let self = this;

        const fields = req.body;

        if (!fields.bookId) {
            const response = {
                success: false,
                code: errorCode.missingParams,
                message: "missing borrow parameters. bookId required."
            };
            console.log(`[BorrowService :: InsertBorrow] ${JSON.stringify(response)}`);
            return res.status(400).json(response);
        }

        const book = await self.parentController.model.books.GetBook(fields.bookId);

        if (!book || book.length < 1){
            const response = {success: false, code: errorCode.missingInDb, message: "Book id not found"};
            console.log(`[BorrowService :: InsertBorrow] ${JSON.stringify(response)}`);
            return res.status(400).json(response);
        }

        if (!book[0].borrow_status){
            const response = {success: false, code: errorCode.serverError, message: "Book record error"};
            console.log(`[BorrowService :: InsertBorrow] ${JSON.stringify(response)}`);
            return res.status(500).json(response);
        }

        if (book[0].borrow_status == "Borrowed"){
            const response = {success: false, code: errorCode.serverError, message: "Book already borrowed"};
            console.log(`[BorrowService :: InsertBorrow] ${JSON.stringify(response)}`);
            return res.status(500).json(response);
        }

        const result = await self.parentController.model.borrow.InsertBorrow(fields.userId, fields.bookId);

        await self.parentController.model.books.UpdateBook(fields.bookId, null, null, null, null, null, "Borrowed", null);

        const response = {success: true, data: result}
        console.log(`[BookService :: InsertBook] ${JSON.stringify(response)}`)
        return res.status(201).json(response)
    }

    async UpdateBorrow(req, res){
        let self = this;

        const fields = req.body;

        const borrowId = req.params.borrow_id;

        if (!borrowId || borrowId == "") {
            const response = {success: false, code: errorCode.missingParams, message: "missing borrowId"};
            console.log(`[BorrowService :: UpdateBorrow] ${JSON.stringify(response)}`);
            return res.status(400).json(response);
        }

        const borrow = await self.parentController.model.borrow.GetBorrow(borrowId);

        if (!borrow || borrow.length < 1){
            const response = {success: false, code: errorCode.missingInDb, message: "borrow not found"};
            console.log(`[BorrowService :: UpdateBorrow] ${JSON.stringify(response)}`);
            return res.status(400).json(response);
        }

        const book = await self.parentController.model.books.GetBook(borrow[0].bookId);

        if (!book || book.length < 1){
            const response = {success: false, code: errorCode.missingInDb, message: "Book id not found"};
            console.log(`[BorrowService :: UpdateBorrow] ${JSON.stringify(response)}`);
            return res.status(400).json(response);
        }

        if (!book[0].borrow_status){
            const response = {success: false, code: errorCode.serverError, message: "Book record error"};
            console.log(`[BorrowService :: UpdateBorrow] ${JSON.stringify(response)}`);
            return res.status(500).json(response);
        }

        if (book[0].borrow_status == "Available"){
            const response = {success: false, code: errorCode.serverError, message: "Book is Available and cannot be returned."};
            console.log(`[BorrowService :: UpdateBorrow] ${JSON.stringify(response)}`);
            return res.status(500).json(response);
        }

        const result = await self.parentController.model.borrow.UpdateBorrow(borrowId)

        if (!result || result.matchedCount < 1) {
            const response = {success: false, code: errorCode.serverError, message: `Failed to update borrow`}
            console.log(`[BorrowService :: UpdateBorrow] ${JSON.stringify(response)}`)
            return res.status(400).json(response)
        }

        await self.parentController.model.books.UpdateBook(borrow[0].bookId, null, null, null, null, null,"Available", borrow[0].userId);

        const response = {success: true, data: result};
        console.log(`[BorrowService :: UpdateBorrow] ${JSON.stringify(response)}`)
        return res.status(201).json(response)
    }

}

module.exports = BorrowService