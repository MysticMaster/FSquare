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
import Statistical from "../../../models/statisticalModel.js";
import Brand from "../../../models/brandModel.js";

const maxAge = 86400;

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


//
// const updateOrderStatus = async (req, res) => {
//     const {newStatus} = req.body;
//
//     // Chỉ cho phép các trạng thái được xác định
//     const allowedStatuses = [orderStatus.confirmed, orderStatus.cancelled, orderStatus.returned];
//
//     // Kiểm tra trạng thái mới
//     if (!newStatus || !allowedStatuses.includes(newStatus)) {
//         return res.status(badRequestResponse.code)
//             .json(responseBody(badRequestResponse.status, 'Invalid status'));
//     }
//
//     try {
//         // Tìm đơn hàng
//         const order = await Order.findById(req.params.id).populate('orderItems.shoes');
//
//         // Kiểm tra nếu đơn hàng không tồn tại
//         if (!order) {
//             return res.status(notFoundResponse.code)
//                 .json(responseBody(notFoundResponse.status, 'Order not found'));
//         }
//
//         // Tạo mới bản ghi Statistical nếu trạng thái mới là confirmed
//         if (newStatus === orderStatus.confirmed) {
//             for (const item of order.orderItems) {
//                 await createStatistical(item.shoes, item.quantity, item.price);
//             }
//         }
//
//         // Tìm và cập nhật trạng thái đơn hàng
//         const updatedOrder = await Order.findByIdAndUpdate(
//             req.params.id,
//             {
//                 status: newStatus,
//                 [`statusTimestamps.${newStatus}`]: new Date(), // Cập nhật thời gian cho trạng thái mới
//             },
//             {new: true} // Trả về tài liệu đã cập nhật
//         );
//
//         // Trả về phản hồi thành công
//         res.status(successResponse.code)
//             .json(responseBody(successResponse.status, 'Order status updated successfully', updatedOrder));
//     } catch (error) {
//         console.log(`updateOrderStatus Error: ${error.message}`);
//         res.status(internalServerErrorResponse.code)
//             .json(responseBody(internalServerErrorResponse.status, 'Server error'));
//     }
// };
//
// const createStatistical = async (shoesId, quantity, price) => {
//     const revenue = quantity * price;
//
//     await Statistical.create({
//         shoes: shoesId,
//         sales: quantity,
//         revenue: revenue
//     });
// };
//
// const deleteOrder = async (req, res) => {
//     const orderId = req.params.id;
//     try {
//         const order = await Order.findByIdAndUpdate(orderId,
//             {
//                 isActive: false
//             }, {new: true});
//         if (!order) return res.status(notFoundResponse.code)
//             .json(responseBody(notFoundResponse.status, 'Order not found'));
//         res.status(successResponse.code)
//             .json(responseBody(successResponse.status, 'Order status updated successfully', order._id));
//     } catch (error) {
//         console.log(`deleteOrder Error: ${error.message}`);
//         res.status(internalServerErrorResponse.code)
//             .json(responseBody(internalServerErrorResponse.status, 'Server error'));
//     }
// };

export default {
    getOrders,
    getOrderById
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

