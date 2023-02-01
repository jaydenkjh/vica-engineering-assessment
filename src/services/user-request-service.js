const errorCode = require("../constants/error_codes");

class UserRequestService {
    constructor(parentController, opts) {
        let self = this;

        self.parentController = parentController;
        self.config = opts.config;
    }

    async GetAllRequests(req, res) {
        let self = this;

        const status = req.query.status;

        const limit = req.query.limit;
        const skip = req.query.skip;

        const result = await self.parentController.model.userRequest.GetAllRequests(limit, skip, status);
        const response = {success: true, data: result}
        console.log(`[UserRequestService :: GetPendingRequests] ${JSON.stringify(response)}`)
        return res.status(200).json(response);
    }

    async GetRequest(req, res) {
        let self = this;

        const requestId = req.params.request_id;

        const result = await self.parentController.model.userRequest.GetRequest(requestId);
        if (!result || result.length < 1) {
            const response = {success: false, code: errorCode.missingInDb, message: "User request not found"}
            console.log(`[UserRequestService :: GetRequest] ${JSON.stringify(response)}`)
            return res.status(400).json(response)
        }

        const response = {success: true, data: result[0]};
        console.log(`[UserRequestService :: GetRequest] ${JSON.stringify(response)}`)
        return res.status(200).json(response);
    }

    async InsertRequest(req, res) {
        let self = this;

        const fields = req.body;

        if (!fields.requestType || !fields.payload || !fields.userId) {
            const response = {success: false, code: errorCode.missingParams, message: "missing type / payload"}
            console.log(`[UserRequestService :: InsertRequest] ${JSON.stringify(response)}`)
            return res.status(400).json(response)
        }

        const result = await self.parentController.model.userRequest.InsertRequest(fields.userId, fields.requestType, fields.payload);
        const response = {success: true, data: result}
        console.log(`[UserRequestService :: InsertRequest] ${JSON.stringify(response)}`)
        return res.status(201).json(response);
    }

    async UpdateRequest(req, res) {
        let self = this;

        const requestId = req.params.request_id;

        const fields = req.body;

        const status = fields.status;

        if (!requestId || !status) {
            const response = {success: false, code: errorCode.missingParams, message: "missing requestId / status"};
            console.log(`[UserRequestService :: UpdateRequest] ${JSON.stringify(response)}`);
            return res.status(400).json(response);
        }

        if (status != "Approved" && status != "Rejected" && status != "COMPLETED") {
            const response = {success: false, code: errorCode.invalidParams, message: "Invalid status"};
            console.log(`[UserRequestService :: UpdateRequest] ${JSON.stringify(response)}`);
            return res.status(400).json(response);
        }

        const record = await self.parentController.model.userRequest.GetRequest(requestId);

        if (record.length == 0) {
            const response = {success: false, code: errorCode.serverError, message: `Failed to update user request`};
            console.log(`[UserRequestService :: UpdateRequest] ${JSON.stringify(response)}`);
            return res.status(400).json(response);
        }

        if (!record[0].payload || !record[0].requestType || !record[0].requestorId || !record[0].status) {
            const response = {success: false, code: errorCode.serverError, message: `Error in request record`}
            console.log(`[UserRequestService :: UpdateRequest] ${JSON.stringify(response)}`)
            return res.status(400).json(response)
        }

        if (record[0].status != "Pending") {
            const response = {
                success: false,
                code: errorCode.serverError,
                message: `Record has already been processed.`
            }
            console.log(`[UserRequestService :: UpdateRequest] ${JSON.stringify(response)}`)
            return res.status(400).json(response)
        }

        // Update database
        const result = await self.parentController.model.userRequest.UpdateRequest(requestId, status);

        if (!result || result.matchedCount < 1) {
            const response = {success: false, code: errorCode.serverError, message: `Failed to update user request`}
            console.log(`[UserRequestService :: UpdateRequest] ${JSON.stringify(response)}`)
            return res.status(400).json(response)
        }

        if (status == "Approved") { // process request
            let body = record[0].payload

            if (record[0].requestorId == fields.userId) {
                const response = {success: false, code: errorCode.serverError, message: `Unable to approve own request`}
                console.log(`[UserRequestService :: UpdateRequest] ${JSON.stringify(response)}`)
                return res.status(400).json(response)
            }

            body.approver = req.headers['auth'];
            body.requestId = requestId

            req.body = body // recreate request body

            if (record[0].requestType == "Add") {
                await self.parentController.service.users.InsertUser(req, res);
            } else if (record[0].requestType == "Remove") {
                await self.parentController.service.users.DeleteUser(req, res);
            } else if (record[0].requestType == "Update") {
                await self.parentController.service.users.UpdateUser(req, res);
            } else {
                const response = {success: false, code: errorCode.serverError, message: `Error in request record`}
                console.log(`[UserRequestService :: UpdateRequest] ${JSON.stringify(response)}`)
                return res.status(400).json(response)
            }
        }

        // Database updated
        const response = {success: true, data: {message: "status updated"}};
        console.log(`[UserRequestService :: UpdateRequest] ${JSON.stringify(response)}`)
        return res.status(201).json(response);
    }
}

module.exports = UserRequestService