import Order from "../../../models/orderModel.js";
import {
    successResponse, createdResponse,
    internalServerErrorResponse, notFoundResponse, badRequestResponse
} from "../../../utils/httpStatusCode.js";
import {generateString, responseBody} from "../../../utils/generate.js";
import {orderStatus} from "../../../utils/orderStatus.js";
import {orderPreview} from "../../../utils/ghn.js";
import {getSingleImage} from '../../../utils/media.js';
import {classificationDir, thumbnailDir} from '../../../utils/directory.js';

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
    const userId = req.user.id; // Lấy ID người dùng từ token
    const {
        order,
        orderItems,
    } = req.body;
    if (!order || !orderItems || orderItems.length === 0) {
        return res.status(badRequestResponse.code)
            .json(responseBody(badRequestResponse.status, 'All fields are required'));
    }
    try {
        // Tạo đơn hàng mới
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
            statusTimestamps: {
                pending: new Date(),
            }
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
    const userId = req.user.id; // Lấy ID người dùng từ req.user
    const status = req.query.status || orderStatus.pending;

    try {
        const orders = await Order.find({ customer: userId, status: status })
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
            .lean();

        const ordersData = await Promise.all(orders.map(async (order) => {
            const firstOrderItem = order.orderItems[0];

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

            return {
                id: order._id,
                clientOrderCode: order.clientOrderCode,
                codAmount: order.codAmount,
                shippingFee: order.shippingFee,
                status: order.status,
                createdAt: order.createdAt,
                firstOrderItem: productData, // Chỉ lấy thông tin sản phẩm đầu tiên
            };
        }));

        res.status(successResponse.code)
            .json(responseBody(successResponse.status, 'Orders retrieved successfully', ordersData));
    } catch (error) {
        console.log(`getOrders Error: ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
};

const getOrderById = async (req, res) => {
    const orderId = req.params.id; // Lấy orderId từ tham số URL
    try {
        // Tìm kiếm đơn hàng theo orderId và chỉ định các trường cần lấy
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

        const productsData = await Promise.all(order.orderItems.map(async (product) => {
            const size = product.size;
            const classification = size.classification;
            const shoes = classification.shoes;
            return {
                size: size.sizeNumber,
                shoes: shoes.name,
                color: classification.color,
                price: product.price,
                quantity: product.quantity,
                thumbnail: classification.thumbnail
                    ? await getSingleImage(`${classificationDir}/${thumbnailDir}`, classification.thumbnail, maxAge)
                    : null,
            };
        }));

        // Chuẩn bị dữ liệu phản hồi
        const orderDetails = {
            id: order._id,
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
            statusTimestamps: order.statusTimestamps, // Lấy statusTimestamps
            returnInfo: order.returnInfo,
            orderItems: productsData,
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
    // Chỉ cho phép các trạng thái được xác định
    const allowedStatuses = [orderStatus.confirmed, orderStatus.cancelled, orderStatus.returned];
    // Kiểm tra trạng thái mới
    if (!newStatus || !allowedStatuses.includes(newStatus)) {
        return res.status(badRequestResponse.code)
            .json(responseBody(badRequestResponse.status, 'Invalid status'));
    }
    try {
        // Tìm và cập nhật trạng thái đơn hàng
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                status: newStatus,
                [`statusTimestamps.${newStatus}`]: new Date(), // Cập nhật thời gian cho trạng thái mới
            },
            {new: true} // Trả về tài liệu đã cập nhật
        );
        // Kiểm tra nếu đơn hàng không tồn tại
        if (!updatedOrder) {
            return res.status(notFoundResponse.code)
                .json(responseBody(notFoundResponse.status, 'Order not found'));
        }
        // Trả về phản hồi thành công
        res.status(successResponse.code)
            .json(responseBody(successResponse.status, 'Order status updated successfully', updatedOrder));
    } catch (error) {
        console.log(`updateOrderStatus Error: ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
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

export default {
    getShippingFee,
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder
}

// import cron from 'node-cron';
//
// // Thiết lập cron job chạy mỗi 10 phút
// cron.schedule('*/10 * * * *', async () => {
//     const orders = await Order.find({ status: { $ne: 'delivered' } }); // Lấy các đơn hàng chưa giao
//     orders.forEach(order => {
//         updateOrderStatus(order.orderID); // Cập nhật trạng thái cho từng đơn hàng
//     });
// });

// const updateOrderStatus = async (orderID) => {
//     try {
//         // Lấy trạng thái từ GHTK
//         const ghtkData = await getOrderStatusFromGHTK(orderID);
//
//         // Giả sử ghtkData có trường status để cập nhật
//         const ghtkStatus = ghtkData.status; // Cần điều chỉnh theo cấu trúc dữ liệu của bạn
//
//         // Cập nhật vào cơ sở dữ liệu MongoDB
//         await Order.updateOne(
//             { orderID: orderID },
//             { status: ghtkStatus }
//         );
//
//         console.log(`Order status updated to: ${ghtkStatus}`);
//     } catch (error) {
//         console.error('Error updating order status:', error);
//     }
// };

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

