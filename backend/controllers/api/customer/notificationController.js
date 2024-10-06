import Notification from "../../../models/notificationModel.js";
import {
    successResponse, createdResponse,
    internalServerErrorResponse, notFoundResponse, badRequestResponse
} from "../../../utils/httpStatusCode.js";
import {responseBody} from "../../../utils/generate.js";

const createNotification = async (req, res) => {
    const userId = req.user.id;
    const {orderId, action} = req.body;
    if (!orderId || !action) return res.status(badRequestResponse.code)
        .json(responseBody(badRequestResponse.status, 'All fields are required'));
    try {
        let title, content;
        if(action === 'pending') title = ''
        const notification = new Notification({
            customer: userId,
            orderId: orderId
        })
    } catch (error) {
        console.log(`createNotification ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

const getNotifications = async (req, res) => {

}
