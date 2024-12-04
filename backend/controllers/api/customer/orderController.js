import Order from "../../../models/orderModel.js";
import {
    successResponse, createdResponse,
    internalServerErrorResponse, notFoundResponse, badRequestResponse
} from "../../../utils/httpStatusCode.js";
import {generateString, responseBody} from "../../../utils/generate.js";
import {orderStatus, returnOrderStatus} from "../../../utils/orderStatus.js";
import {orderPreview} from "../../../utils/ghn.js";
import {getSingleImage} from '../../../utils/media.js';
import {classificationDir, thumbnailDir} from '../../../utils/directory.js';
import Statistical from "../../../models/statisticalModel.js";
import ShoesReview from "../../../models/shoesReviewModel.js";

const maxAge = 86400;

const getShippingFee = async (req, res) => {
    const {
        clientOrderCode, toName, toPhone, toAddress, toWardName,
        toDistrictName, toProvinceName, codAmount, weight, content
    } = req.body;

    if (!clientOrderCode || !toName || !weight || !toPhone ||
        !toAddress || !toWardName || !toDistrictName ||
        !toProvinceName || !codAmount || !content) return res.status(badRequestResponse.code)
        .json(responseBody(badRequestResponse.status, 'All fields are required'));
    try {
        const fee = await orderPreview(clientOrderCode, toName, toPhone, toAddress, toWardName,
            toDistrictName, toProvinceName, codAmount, weight, content);
        res.status(successResponse.code)
            .json(responseBody(successResponse.status,
                'Get Shipping Fee Successful',
                fee
            ));
    } catch (error) {
        console.log(`getShippingFee Error: ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

const createOrder = async (req, res) => {
    const userId = req.user.id;
    const {
        order,
        orderItems,
    } = req.body;
    if (!order || !orderItems || orderItems.length === 0) {
        return res.status(badRequestResponse.code)
            .json(responseBody(badRequestResponse.status, 'All fields are required'));
    }
    try {

        const statusTimestamps = {
            pending: new Date()
        };

        const newOrder = await Order.create({
            customer: userId,
            clientOrderCode: order.clientOrderCode,
            shippingAddress: order.shippingAddress,
            orderItems: orderItems,
            weight: order.weight,
            codAmount: order.codAmount,
            shippingFee: order.shippingFee,
            content: order.content,
            isFreeShip: order.isFreeShip,
            isPayment: order.isPayment,
            note: order.note,
            statusTimestamps: statusTimestamps
        });
        res.status(createdResponse.code)
            .json(responseBody(createdResponse.status, 'Order created successfully', newOrder));
    } catch (error) {
        console.log(`createOrder Error: ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

const getOrders = async (req, res) => {
    const userId = req.user.id;
    const status = req.query.status || orderStatus.pending;
    const sizePage = parseInt(req.query.size, 10) || 6;
    const currentPage = parseInt(req.query.page, 10) || 1;

    try {
        const query = {customer: userId, status: status, isActive: true};
        const totalOrders = await Order.countDocuments(query);
        const totalPages = Math.ceil(totalOrders / sizePage);

        const orders = await Order.find(query)
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
            .select('_id clientOrderCode codAmount shippingFee status createdAt orderItems')
            .sort({createdAt: -1})
            .skip((currentPage - 1) * sizePage)
            .limit(sizePage)
            .lean();

        const orderIds = orders.map(order => order._id);
        const reviewedOrderIds = (await ShoesReview.find({ order: { $in: orderIds } })
            .distinct('order'))
            .map(id => id.toString());

        const ordersData = await Promise.all(orders.map(async (order) => {
            const firstOrderItem = order.orderItems[0];

            const totalQuantity = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
            const productSamplesCount = order.orderItems.length;

            const productData = firstOrderItem ? {
                size: firstOrderItem.size.sizeNumber,
                shoes: firstOrderItem.size.classification.shoes.name,
                color: firstOrderItem.size.classification.color,
                price: firstOrderItem.size.classification.price,
                quantity: firstOrderItem.quantity,
                thumbnail: firstOrderItem.size.classification.thumbnail
                    ? await getSingleImage(`${classificationDir}/${thumbnailDir}`, firstOrderItem.size.classification.thumbnail, maxAge)
                    : null,
            } : null;

            const isReview = reviewedOrderIds.includes(order._id.toString());

            return {
                _id: order._id,
                clientOrderCode: order.clientOrderCode,
                codAmount: order.codAmount,
                shippingFee: order.shippingFee,
                status: order.status,
                createdAt: order.createdAt,
                firstOrderItem: productData,
                totalQuantity: totalQuantity,
                productSamplesCount: productSamplesCount,
                isReview: isReview
            };
        }));

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
        console.log(`getOrders Error: ${error.message}`);
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
            .lean();

        if (!order) {
            return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Order not found'));
        }

        const isReview = await ShoesReview.countDocuments({order: order._id});

        const orderItemsData = await Promise.all(order.orderItems.map(async (orderItem) => {
            const size = orderItem.size;
            const classification = size.classification;
            const shoes = classification.shoes;
            return {
                _id: orderItem._id,
                size: size.sizeNumber,
                shoes: shoes.name,
                color: classification.color,
                price: orderItem.price,
                quantity: orderItem.quantity,
                thumbnail: classification.thumbnail
                    ? await getSingleImage(`${classificationDir}/${thumbnailDir}`, classification.thumbnail, maxAge)
                    : null,
            };
        }));

        const orderDetails = {
            _id: order._id,
            clientOrderCode: order.clientOrderCode,
            shippingAddress: order.shippingAddress,
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
            orderItems: orderItemsData,
            isReview: isReview !== 0 ? true : false
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

    const allowedStatuses = [orderStatus.confirmed, orderStatus.cancelled];

    if (!newStatus || !allowedStatuses.includes(newStatus)) {
        return res.status(badRequestResponse.code)
            .json(responseBody(badRequestResponse.status, 'Invalid status'));
    }

    try {
        const order = await Order.findById(req.params.id).populate('orderItems.shoes');

        if (!order) {
            return res.status(notFoundResponse.code)
                .json(responseBody(notFoundResponse.status, 'Order not found'));
        }

        if (newStatus === orderStatus.confirmed) {
            for (const item of order.orderItems) {
                await createStatistical(item.shoes, item.quantity, item.price);
            }
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                status: newStatus,
                [`statusTimestamps.${newStatus}`]: new Date(),
            },
            {new: true}
        );

        res.status(successResponse.code)
            .json(responseBody(successResponse.status, 'Order status updated successfully', updatedOrder));
    } catch (error) {
        console.log(`updateOrderStatus Error: ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
};

const createStatistical = async (shoesId, quantity, price) => {
    const revenue = quantity * price;

    await Statistical.create({
        shoes: shoesId,
        sales: quantity,
        revenue: revenue
    });
};

const deleteOrder = async (req, res) => {
    const orderId = req.params.id;
    try {
        const order = await Order.findByIdAndUpdate(orderId,
            {
                isActive: false
            }, {new: true});
        if (!order) return res.status(notFoundResponse.code)
            .json(responseBody(notFoundResponse.status, 'Order not found'));
        res.status(successResponse.code)
            .json(responseBody(successResponse.status, 'Order status updated successfully', order._id));
    } catch (error) {
        console.log(`deleteOrder Error: ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
};

const returnOrder = async (req, res) => {
    const orderId = req.params.id;
    const {reason} = req.body;
    try {
        const order = await Order.findById(orderId)
            .select('_id');

        if (!order) {
            return res.status(notFoundResponse.code)
                .json(responseBody(notFoundResponse.status, 'Order not found'));
        }

        const updateOrder = await Order.findByIdAndUpdate(
            order._id,
            {
                status: orderStatus.returned,
                returnInfo: {
                    reason: reason,
                    status: returnOrderStatus.pending,
                    ['statusTimestamps.pending']: new Date(),
                }
            },
            {new: true}
        );

        res.status(successResponse.code)
            .json(responseBody(successResponse.status, 'Order status updated successfully', updateOrder));
    } catch (error) {
        console.log(`returnOrder Error: ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

export default {
    getShippingFee,
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
    returnOrder
}

