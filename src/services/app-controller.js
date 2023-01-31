const
    bookController = require('./book-service'),
    userController = require('./user-service'),

userModel = require('../models/user-model')

class Controller {
    constructor(opts){
        let self = this

        self.service = {}
        self.service.books = new bookController();
        self.service.users = new userController(self, opts);

        self.model = {}
        self.model.users = new userModel(opts);
    }
}

module.exports = Controller;