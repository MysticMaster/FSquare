import Order from "../../../models/orderModel.js";
import {
    successResponse,
    internalServerErrorResponse, notFoundResponse, badRequestResponse, serviceUnavailableResponse, conflictResponse
} from "../../../utils/httpStatusCode.js";
import {responseBody} from "../../../utils/generate.js";
import {orderStatus} from "../../../utils/orderStatus.js";
import {createOrderInGHN, orderPreview} from "../../../utils/ghn.js";
import {getSingleImage} from '../../../utils/media.js';
import {classificationDir, thumbnailDir} from '../../../utils/directory.js';
import Statistical from "../../../models/statisticalModel.js";
import {sendNotification} from "../../../config/FCM.js";
import Notification from "../../../models/notificationModel.js";
import Size from "../../../models/sizeModel.js";

const maxAge = 86400;

const responseData = async (id, res) => {
    const order = await Order.findById(id)
        .populate({
            path: 'customer',
            select: '_id firstName lastName email phone'
        })
        .select('_id customer clientOrderCode shippingAddress codAmount shippingFee orderItems weight isFreeShip isPayment status createdAt')
        .lean();

    return {
        _id: order._id,
        clientOrderCode: order.clientOrderCode,
        customer: order.customer,
        shippingAddress: order.shippingAddress,
        orderItems: order.orderItems.length,
        weight: order.weight,
        codAmount: order.codAmount,
        shippingFee: order.shippingFee,
        status: order.status,
        createdAt: order.createdAt,
    };
}

const getOrders = async (req, res) => {
    const sizePage = parseInt(req.query.size, 10) || 10;
    const currentPage = parseInt(req.query.page, 10) || 1;
    const searchQuery = req.query.search || '';
    const status = req.query.status;

    try {
        const query = {
            isActive: true,
            clientOrderCode: {$regex: searchQuery, $options: 'i'}
        };
        if (status) query.status = status;

        const totalOrders = await Order.countDocuments(query);
        const totalPages = Math.ceil(totalOrders / sizePage);

        const orders = await Order.find(query)
            .sort({createdAt: -1})
            .skip((currentPage - 1) * sizePage)
            .limit(sizePage)
            .populate({
                path: 'customer',
                select: '_id firstName lastName email phone'
            })
            .select('_id customer clientOrderCode shippingAddress codAmount shippingFee orderItems weight isFreeShip isPayment status createdAt')
            .lean();

        const ordersData = orders.map(order => {
            return {
                _id: order._id,
                clientOrderCode: order.clientOrderCode,
                customer: order.customer,
                shippingAddress: order.shippingAddress,
                orderItems: order.orderItems.length,
                weight: order.weight,
                codAmount: order.codAmount,
                shippingFee: order.shippingFee,
                status: order.status,
                createdAt: order.createdAt,
            };
        });

        const hasNextPage = currentPage < totalPages;
        const hasPreviousPage = currentPage > 1;
        const nextPage = hasNextPage ? currentPage + 1 : null;
        const prevPage = hasPreviousPage ? currentPage - 1 : null;

        res.status(successResponse.code)
            .json(responseBody(successResponse.status,
                'Orders retrieved successfully',
                ordersData,
                {
                    size: sizePage,
                    page: currentPage,
                    totalItems: totalOrders,
                    totalPages: totalPages,
                    hasNextPage: hasNextPage,
                    hasPreviousPage: hasPreviousPage,
                    nextPage: nextPage,
                    prevPage: prevPage
                }));

    } catch (error) {
        console.error(`getOrders Error: ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
};


const getOrderById = async (req, res) => {
    const orderId = req.params.id;
    try {
        const order = await Order.findById(orderId)
            .select('_id clientOrderCode shippingAddress orderItems weight codAmount shippingFee content isFreeShip isPayment note status statusTimestamps returnInfo')
            .populate({
                path: 'orderItems.size',
                select: '_id sizeNumber classification',
                populate: {
                    path: 'classification',
                    select: '_id color price thumbnail shoes',
                    populate: {
                        path: 'shoes',
                        select: '_id name',
                    }
                }
            })
            .populate({
                path: 'customer',
                select: '_id firstName lastName email phone'
            })
            .lean();

        if (!order) {
            return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Order not found'));
        }

        const productsData = await Promise.all(order.orderItems.map(async (product) => {
            const size = product.size;
            const classification = size.classification;
            const shoes = classification.shoes;
            return {
                shoes: {
                    _id: size._id,
                    name: shoes.name
                },
                classification: {
                    _id: classification._id,
                    color: classification.color,
                    thumbnail: classification.thumbnail
                        ? await getSingleImage(`${classificationDir}/${thumbnailDir}`, classification.thumbnail, maxAge)
                        : null,
                },
                size: {
                    _id: size._id,
                    sizeNumber: size.sizeNumber
                },
                price: product.price,
                quantity: product.quantity,
            };
        }));

        const orderDetails = {
            id: order._id,
            clientOrderCode: order.clientOrderCode,
            customer: order.customer,
            shippingAddress: order.shippingAddress,
            orderItems: productsData,
            weight: order.weight,
            codAmount: order.codAmount,
            shippingFee: order.shippingFee,
            content: order.content,
            isFreeShip: order.isFreeShip,
            isPayment: order.isPayment,
            note: order.note,
            status: order.status,
            statusTimestamps: order.statusTimestamps,
            returnInfo: order.returnInfo,
        };

        res.status(successResponse.code)
            .json(responseBody(successResponse.status, 'Order details retrieved successfully', orderDetails));
    } catch (error) {
        console.log(`getOrderDetails Error: ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
};


const updateOrderStatus = async (req, res) => {
    const {newStatus} = req.body;

    const allowedStatuses = [orderStatus.processing, orderStatus.cancelled, orderStatus.shipped];

    if (!newStatus || !allowedStatuses.includes(newStatus)) {
        return res.status(badRequestResponse.code)
            .json(responseBody(badRequestResponse.status, 'Invalid status'));
    }

    try {
        const order = await Order.findById(req.params.id)
            .select('_id customer shippingAddress clientOrderCode orderItems weight codAmount isPayment content statusTimestamps')
            .populate('customer', '_id fcmToken');

        if (!order) {
            return res.status(notFoundResponse.code)
                .json(responseBody(notFoundResponse.status, 'Order not found'));
        }

        order.status = newStatus;
        order.statusTimestamps[newStatus] = new Date();

        let notificationTitle = '';
        let notificationContent = '';

        if (newStatus === orderStatus.processing) {
            notificationTitle = 'Đơn hàng đã được xác nhận';
            notificationContent = `Đơn hàng ${order.clientOrderCode} đang chuẩn bị giao cho đơn vị vận chuyển`;
        }

        if (newStatus === orderStatus.cancelled) {
            order.content = 'Đơn hàng bị hủy do không xác minh được thông tin';
            notificationTitle = 'Đơn hàng đã bị hủy';
            notificationContent = `Đơn hàng ${order.clientOrderCode} đã bị hủy do không xác minh được thông tin đơn hàng`;
        }

        if (newStatus === orderStatus.shipped) {
            try {
                const errors = [];
                await Promise.all(order.orderItems.map(async (item) => {
                    const size = await Size.findById(item.size).select('_id sizeNumber quantity');
                    if (!size) {
                        errors.push('Size not found');
                        return;
                    }
                    if (size.quantity < item.quantity) {
                        errors.push(`Cỡ ${size.sizeNumber} không đủ tồn kho để giao hàng`);
                        return;
                    }
                    size.quantity -= item.quantity;
                    await size.save();
                }));

                if (errors.length > 0) {
                    return res.status(conflictResponse.code)
                        .json(responseBody(conflictResponse.status, errors.join(', ')));
                }

                await createOrderInGHN(order);

                notificationTitle = 'Đơn hàng đã giao cho đơn vị vận chuyển';
                notificationContent = `Đơn hàng ${order.clientOrderCode} đã bàn giao cho đơn vị vận chuyển`;
            } catch (e) {
                console.error(`Size Update Error: ${e.message}`);
                return res.status(serviceUnavailableResponse.code)
                    .json(responseBody(serviceUnavailableResponse.status, e.message));
            }
        }

        await order.save()

        const notificationTasks = [];

        if (order.customer.fcmToken) {
            notificationTasks.push(
                sendNotification(order.customer.fcmToken, notificationTitle, notificationContent)
            );
        }

        notificationTasks.push(
            Notification.create({
                customer: order.customer._id,
                order: order._id,
                title: notificationTitle,
                content: notificationContent,
            })
        );

        try {
            await Promise.all(notificationTasks);
        } catch (error) {
            console.error(`Notification Error: ${error.message}`);
        }

        const orderData = await responseData(order._id, res);

        res.status(successResponse.code)
            .json(responseBody(successResponse.status, 'Order status updated successfully', orderData));
    } catch (error) {
        console.log(`Shipped Error: ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
};

export default {
    getOrders,
    getOrderById,
    updateOrderStatus
}

// const updateReturnStatus = async (req, res) => {
//     const { orderId, newReturnStatus } = req.body;
//
//     // Kiểm tra trạng thái hoàn trả mới
//     if (!newReturnStatus || !Object.values(returnOrderStatus).includes(newReturnStatus)) {
//         return res.status(badRequestResponse.code)
//             .json(responseBody(badRequestResponse.status, 'Invalid return status'));
//     }
//
//     // Logic cập nhật trạng thái hoàn trả
// }

