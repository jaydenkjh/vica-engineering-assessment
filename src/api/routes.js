const AUTH = require('../services/auth-permission')
const {PERMISSION} = require('../constants/permission')

module.exports = (app, controller) => {

    const VERSION = {
        v1: 'v1',
    }

    const PATHS = {
        user: 'user',
        userRequest: 'user-request',
        book: 'book',
        borrow: 'borrow'
    }

    app.get('/', (req, res) => {
        res.send('VICA Engineering Assessment');
    });

    /* User routes */

    app.get(`/${VERSION.v1}/${PATHS.user}/all`, AUTH(PERMISSION["1"]), function (req, res) {
        controller.service.users.GetAllUsers(req, res);
    })

    app.get(`/${VERSION.v1}/${PATHS.user}/:user_id`, function (req, res) {
        controller.service.users.GetUser(req, res);
    })

    app.patch(`/${VERSION.v1}/${PATHS.user}/:user_id`, AUTH(PERMISSION["1"]), function (req, res) {
        controller.service.users.UpdateUser(req, res);
    })

    app.delete(`/${VERSION.v1}/${PATHS.user}/:user_id`, AUTH(PERMISSION["1"]), function (req, res) {
        controller.service.users.DeleteUser(req, res);
    })

    app.post(`/${VERSION.v1}/${PATHS.user}`, AUTH(PERMISSION["1"]), function (req, res) {
        controller.service.users.InsertUser(req, res);
    })

    /* User Request Routes */

    app.get(`/${VERSION.v1}/${PATHS.userRequest}/all`, AUTH(PERMISSION["1"]), function (req, res) {
        controller.service.userRequest.GetAllRequests(req, res);
    })

    app.get(`/${VERSION.v1}/${PATHS.userRequest}/:request_id`, AUTH(PERMISSION["1"]), function (req, res) {
        controller.service.userRequest.GetRequest(req, res);
    })

    app.patch(`/${VERSION.v1}/${PATHS.userRequest}/:request_id`, AUTH(PERMISSION["1"]), function (req, res) {
        controller.service.userRequest.UpdateRequest(req, res);
    })

    /* Book routes */

    app.get(`/${VERSION.v1}/${PATHS.book}/all`, function (req, res) {
        controller.service.books.GetAllBooks(req, res);
    })

    app.post(`/${VERSION.v1}/${PATHS.book}`, AUTH(PERMISSION["2"]), function (req, res) {
        controller.service.books.InsertBook(req, res);
    })

    app.get(`/${VERSION.v1}/${PATHS.book}/:book_id`, function (req, res) {
        controller.service.books.GetBook(req, res);
    })

    app.patch(`/${VERSION.v1}/${PATHS.book}/:book_id`, AUTH(PERMISSION["2"]), function (req, res) {
        controller.service.books.UpdateBook(req, res);
    })

    app.del(`/${VERSION.v1}/${PATHS.book}/:book_id`, AUTH(PERMISSION["2"]), function (req, res) {
        controller.service.books.DeleteBook(req, res);
    })


    /* Borrow Routes */
}