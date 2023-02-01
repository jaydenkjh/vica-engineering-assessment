const
    bookController = require('./book-service'),
    userController = require('./user-service'),
    userRequestController = require('./user-request-service'),
    borrowController = require('./borrow-service'),

    userModel = require('../models/user-model'),
    userRequestModel = require('../models/user-request-model'),
    bookModel = require('../models/book-model'),
    borrowModel = require('../models/borrow-model')

class Controller {
    constructor(opts) {
        let self = this

        self.service = {}
        self.service.users = new userController(self, opts);
        self.service.userRequest = new userRequestController(self, opts);
        self.service.books = new bookController(self, opts);
        self.service.borrow = new borrowController(self, opts);

        self.model = {}
        self.model.users = new userModel(opts);
        self.model.userRequest = new userRequestModel(opts);
        self.model.books = new bookModel(opts);
        self.model.borrow = new borrowModel(opts);
    }
}

module.exports = Controller;