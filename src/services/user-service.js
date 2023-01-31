const errorCode = require("../constants/error_codes");
class UserService {
    constructor(parentController, opts) {
        let self = this;

        self.parentController = parentController;
        self.config = opts.config;
    }

    async GetAllUsers(req, res) {
        let self = this;

        const limit = req.params.limit;
        const skip = req.params.skip;

        const result = await self.parentController.model.users.GetAllUsers(limit, skip);

        const response = {success: true, data: result}
        console.log(`[UserService :: GetAllUsers] ${JSON.stringify(response)}`)
        return res.status(200).json(response);
    }

    async GetUser(req, res){
        let self = this;

        const userId = req.params.user_id;

        if (!userId) {
            const response = {success:false, code: errorCode.missingParams, message: "missing user id"}
            console.log(`[UserService :: GetUser] ${JSON.stringify(response)}`)
            return res.status(400).json(response)
        }

        const result = await self.parentController.model.users.GetUser(userId)

        if (!result || result.length < 1){
            const response = {success:false, code: errorCode.missingInDb, message: "User not found"}
            console.log(`[UserService :: GetUser] ${JSON.stringify(response)}`)
            return res.status(400).json(response)
        }

        const response = {success: true, data: result[0]}
        console.log(`[UserService :: GetUser] ${JSON.stringify(response)}`)
        return res.status(200).json(response);
    }

    async InsertUser(req, res){
        let self = this;

        const fields = req.body;

        if (!fields.name) {
            const response = {success: false, code: errorCode.missingParams, message: "missing user name"}
            console.log(`[UserService :: InsertUser] ${JSON.stringify(response)}`)
            return res.status(400).json(response)
        }

        const validRoles = self.config.get("users.valid_roles")

        if (!fields.role) {
            const response = {success: false, code: errorCode.missingParams, message: `missing user role ${validRoles}`}
            console.log(`[UserService :: InsertUser] ${JSON.stringify(response)}`)
            return res.status(400).json(response)
        }

        if (!validRoles.includes(fields.role)){
            const response = {success: false, code: errorCode.invalidParams, message: `invalid user role ${validRoles}`}
            console.log(`[UserService :: InsertUser] ${JSON.stringify(response)}`)
            return res.status(400).json(response)
        }

        const result = await self.parentController.model.users.InsertUser(fields.name, fields.role)

        const response = {success: true, data: result}
        console.log(`[UserService :: InsertUser] ${JSON.stringify(response)}`)
        return res.status(201).json(response)
    }

    async UpdateUser(req, res){
        let self = this;

        const userId = req.params.user_id;

        if (!userId) {
            const response = {success:false, code: errorCode.missingParams, message: "missing user id"}
            console.log(`[UserService :: UpdateUser] ${JSON.stringify(response)}`)
            return res.status(400).json(response)
        }

        const fields = req.body;

        if (!fields.name && !fields.role){
            const response = {success: false, code: errorCode.missingParams, message: "either name or role field must exist"}
            console.log(`[UserService :: UpdateUser] ${JSON.stringify(response)}`)
            return res.status(400).json(response)
        }

        const result = await self.parentController.model.users.UpdateUser(userId, fields.name, fields.role);

        if (!result || result.matchedCount < 1) {
            const response = {success: false, code: errorCode.serverError, message: `Failed to update user`}
            console.log(`[UserService :: UpdateUser] ${JSON.stringify(response)}`)
            return res.status(400).json(response)
        }

        const response = {success: true, data: result};
        return res.status(200).json(response)
    }

    async DeleteUser(req, res){
        const self = this;

        const userId = req.params.user_id;

        if (!userId) {
            const response = {success:false, code: errorCode.missingParams, message: "missing user id"}
            console.log(`[UserService :: UpdateUser] ${JSON.stringify(response)}`)
            return res.status(400).json(response)
        }

        const result = await self.parentController.model.users.DeleteUser(userId);

        if (!result || result.deletedCount < 1) {
            const response = {success: false, code: errorCode.serverError, message: `Failed to delete user`}
            console.log(`[UserService :: DeleteUser] ${JSON.stringify(response)}`)
            return res.status(400).json(response)
        }

        const response = {success: true, data: result};
        console.log(`[UserService :: DeleteUser] ${JSON.stringify(response)}`)
        return res.status(200).json(response)
    }

}

module.exports = UserService