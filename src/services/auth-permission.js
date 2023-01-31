const jwt = require('jsonwebtoken');
const errorCode = require("../constants/error_codes");

module.exports = (permission) => {
    return async (req, res, next) => {
        if (!req.headers || !req.headers['auth']){
            const response = {success: false, code: errorCode.unauthorized, message: "User not authorized"}
            console.log(JSON.stringify(response))
            return res.status(401).json(response)
        }

        const authToken = req.headers['auth'];

        const cert = process.env.TOKEN

        const authCredentials = jwt.verify(authToken, cert)

        if (!Array.isArray(permission)){
            const response = {success: false, code: errorCode.serverError, message: "Permission setting issue"}
            console.log(JSON.stringify(response))
            return res.status(401).json(response)
        }

        if (!authCredentials || !authCredentials.role || !permission.includes(authCredentials.role)){
            const response = {success: false, code: errorCode.unauthorized, message: "User not authorized"}
            console.log(JSON.stringify(response))
            return res.status(401).json(response)
        }



        next();
    }
}