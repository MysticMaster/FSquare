import Order from "../../../models/orderModel.js";
import {
    successResponse, createdResponse,
    internalServerErrorResponse, notFoundResponse, badRequestResponse
} from "../../../utils/httpStatusCode.js";
import {generateString, responseBody} from "../../../utils/generate.js";
import {orderStatus} from "../../../utils/orderStatus.js";
import {calculateShippingFee} from "../../../utils/ghtk.js";
import {getSingleImage} from '../../../utils/media.js';
import {classificationDir, thumbnailDir} from '../../../utils/directory.js';

const maxAge = 86400;

const getShippingFee = async (req, res) => {
    const {province, district, totalWeight, transportMethod} = req.body;
    if (!province || !district || !totalWeight || !transportMethod) return res.status(badRequestResponse.code)
        .json(responseBody(badRequestResponse.status, 'All fields are required'));
    try {
        const fee = await calculateShippingFee(province, district, totalWeight, transportMethod);
        res.status(successResponse.status)
            .json(responseBody(successResponse.status,
                'Get Shipping Fee Successful',
                fee));
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
        products,
    } = req.body;
    // Kiểm tra dữ liệu đầu vào
    if (!order || !products || products.length === 0) {
        return res.status(badRequestResponse.code)
            .json(responseBody(badRequestResponse.status, 'All fields are required'));
    }
    // Tạo ID đơn hàng ngẫu nhiên hoặc tự sinh
    const orderID = `DH-${generateString(10)}`;
    try {
        // Tạo đơn hàng mới
        const newOrder = await Order.create({
            customer: userId,
            orderID,
            shippingAddress: order.shippingAddress,
            products: products,
            totalWeight: order.totalWeight,
            totalPrice: order.totalPrice,
            transportMethod: order.transportMethod,
            isFreeShip: order.isFreeShip,
            shippingFee: order.shippingFee,
            notes: order.notes,
            statusTimestamps: {
                pending: new Date(), // Ghi nhận thời gian khi đơn hàng được tạo
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
        const orders = await Order.find({customer: userId, status: status})
            .populate({
                path: 'products.size',
                select: '_id sizeNumber classification',
                populate: {
                    path: 'classification',
                    select: '_id color price thumbnail',
                }
            })
            .select('_id totalPrice status createdAt products')
            .lean();

        const ordersData = await Promise.all(orders.map(async (order) => {
            const firstProduct = order.products[0]; // Lấy sản phẩm đầu tiên

            // Kiểm tra xem sản phẩm có tồn tại không
            const productData = firstProduct ? {
                size: firstProduct.size.sizeNumber,
                color: firstProduct.size.classification.color,
                price: firstProduct.size.classification.price,
                quantity: firstProduct.quantity,
                thumbnail: firstProduct.size.classification.thumbnail
                    ? await getSingleImage(`${classificationDir}/${thumbnailDir}`, firstProduct.size.classification.thumbnail, maxAge)
                    : null,
            } : null;

            return {
                id: order._id,
                totalPrice: order.totalPrice,
                status: order.status,
                createdAt: order.createdAt,
                firstProduct: productData, // Chỉ lấy thông tin sản phẩm đầu tiên
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
            .select('_id orderID shippingAddress totalWeight totalPrice shippingFee transportMethod isFreeShip status statusTimestamps products')
            .populate({
                path: 'products.size',
                select: '_id sizeNumber classification',
                populate: {
                    path: 'classification',
                    select: '_id color price thumbnail',
                }
            })
            .lean(); // Chuyển đổi đối tượng Mongoose thành đối tượng JavaScript thuần túy

        // Kiểm tra xem đơn hàng có tồn tại không
        if (!order) {
            return res.status(notFoundResponse.status).json(responseBody(notFoundResponse.status, 'Order not found'));
        }

        // Lấy thông tin chi tiết của sản phẩm
        const productsData = await Promise.all(order.products.map(async (product) => {
            const size = product.size;
            const classification = size.classification;

            return {
                size: size.sizeNumber,
                shoes: product.name,
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
            orderID: order.orderID,
            shippingAddress: order.shippingAddress,
            totalWeight: order.totalWeight,
            totalPrice: order.totalPrice,
            shippingFee: order.shippingFee,
            transportMethod: order.transportMethod,
            isFreeShip: order.isFreeShip,
            status: order.status,
            statusTimestamps: order.statusTimestamps, // Lấy statusTimestamps
            products: productsData,
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
}

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

