const AUTH = require('../services/auth-permission')
const {PERMISSION} = require('../constants/permission')

module.exports = (app, controller) => {

    const VERSION = {
        v1 : 'v1',
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

    app.get(`/${VERSION.v1}/${PATHS.user}/all`, AUTH(PERMISSION["1"]), function(req, res) {
        controller.service.users.GetAllUsers(req, res);
    })

    app.get(`/${VERSION.v1}/${PATHS.user}/:user_id`, function(req, res) {
        controller.service.users.GetUser(req, res);
    })

    app.patch(`/${VERSION.v1}/${PATHS.user}/:user_id`, AUTH(PERMISSION["1"]), function(req, res) {
        controller.service.users.UpdateUser(req, res);
    })

    app.delete(`/${VERSION.v1}/${PATHS.user}/:user_id`, AUTH(PERMISSION["1"]), function(req, res) {
        controller.service.users.DeleteUser(req, res);
    })

    app.post(`/${VERSION.v1}/${PATHS.user}`, AUTH(PERMISSION["1"]), function(req, res) {
        controller.service.users.InsertUser(req, res);
    })

    /* User Request Routes */

    app.get(`/${VERSION.v1}/${PATHS.userRequest}/all`, AUTH(PERMISSION["1"]), function(req, res) {
        controller.service.userRequest.GetAllRequests(req, res);
    })

    app.get(`/${VERSION.v1}/${PATHS.userRequest}/:request_id`, AUTH(PERMISSION["1"]), function(req, res) {
        controller.service.userRequest.GetRequest(req, res);
    })

    app.patch(`/${VERSION.v1}/${PATHS.userRequest}/:request_id`, AUTH(PERMISSION["1"]), function(req, res) {
        controller.service.userRequest.UpdateRequest(req, res);
    })

    /* Book routes */



    /* Borrow Routes */
}