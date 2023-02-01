const
    bookController = require('./book-service'),
    userController = require('./user-service'),
    userRequestController = require('./user-request-service'),

    userModel = require('../models/user-model'),
    userRequestModel = require('../models/user-request-model')

class Controller {
    constructor(opts) {
        let self = this

        self.service = {}
        self.service.books = new bookController();
        self.service.users = new userController(self, opts);
        self.service.userRequest = new userRequestController(self, opts);

        self.model = {}
        self.model.users = new userModel(opts);
        self.model.userRequest = new userRequestModel(opts);
    }
}

module.exports = Controller;