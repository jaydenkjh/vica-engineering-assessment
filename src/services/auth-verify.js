const jwt = require('jsonwebtoken');
const errorCode = require("../constants/error_codes");

class AuthVerify {
    constructor() {
    }

    VerifyToken(authToken, permission) {
        const cert = process.env.TOKEN

        let authCredentials;
        try {
            authCredentials = jwt.verify(authToken, cert);
        } catch {
            return false;
        }

        if (!Array.isArray(permission)) {
            return false;
        }

        if (!authCredentials || !authCredentials.role || !permission.includes(authCredentials.role)) {
            return false;
        }

        return true;
    }

}

module.exports = AuthVerify;