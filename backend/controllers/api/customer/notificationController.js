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
        if (action === 'pending') title = ''
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
    const userId = req.user.id;
    const sizePage = parseInt(req.query.size, 10) || 5;
    const currentPage = parseInt(req.query.page, 10) || 1;

    try {
        const query = {
            customer: userId
        };

        const totalNotifications = await Notification.countDocuments(query);
        const totalPages = Math.ceil(totalNotifications / sizePage);

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .skip((currentPage - 1) * sizePage)
            .limit(sizePage)
            .select('_id order title content createdAt')
            .lean();

        const hasNextPage = currentPage < totalPages;
        const hasPreviousPage = currentPage > 1;
        const nextPage = hasNextPage ? currentPage + 1 : null;
        const prevPage = hasPreviousPage ? currentPage - 1 : null;

        res.status(successResponse.code)
            .json(responseBody(
                successResponse.status,
                'Get Notifications Successfully',
                notifications,
                {
                    size: sizePage,
                    page: currentPage,
                    totalItems: totalNotifications,
                    totalPages: totalPages,
                    hasNextPage: hasNextPage,
                    hasPreviousPage: hasPreviousPage,
                    nextPage: nextPage,
                    prevPage: prevPage
                }
            ));
    } catch (error) {
        console.log(`getNotifications ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
};

const deleteNotification = async (req, res) => {
    const id = req.params.id;
    try {
        const notification = await Notification.findById(id)
            .select('_id').lean();

        if (!notification) return res.status(notFoundResponse.code).json(responseBody(
            notFoundResponse.status,
            'Notify not found',
        ));

        await Notification.findByIdAndDelete(notification._id);

        res.status(successResponse.code)
            .json(responseBody(
                successResponse.status,
                'Delete Notification Successfully'
            ));
    } catch (error) {
        console.log(`deleteNotification ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

export default {
    getNotifications,
    deleteNotification
}
