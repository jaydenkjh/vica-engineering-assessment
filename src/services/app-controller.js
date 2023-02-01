const
    bookController = require('./book-service'),
    userController = require('./user-service'),
    userRequestController = require('./user-request-service'),

    userModel = require('../models/user-model'),
    userRequestModel = require('../models/user-request-model'),
bookModel = require('../models/book-model')

class Controller {
    constructor(opts) {
        let self = this

        self.service = {}
        self.service.users = new userController(self, opts);
        self.service.userRequest = new userRequestController(self, opts);
        self.service.books = new bookController(self, opts);

        self.model = {}
        self.model.users = new userModel(opts);
        self.model.userRequest = new userRequestModel(opts);
        self.model.books = new bookModel(opts);
    }
}

module.exports = Controller;