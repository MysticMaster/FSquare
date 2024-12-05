import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
    size: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Size',
        required: true
    },
    shoes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shoes',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, {versionKey: false});

const OrderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    clientOrderCode: {
        type: String,
        required: true,
        unique: true
    },
    shippingAddress: {
        toName: {type: String, required: true},
        toAddress: {type: String, required: true},
        toProvinceName: {type: String, required: true}, // Tỉnh/Thành phố nhận hàng
        toDistrictName: {type: String, required: true}, // Quận/Huyện nhận hàng
        toWardName: {type: String, required: true}, // Phường/Xã nhận hàng
        toPhone: {type: String, required: true} // Số điện thoại người nhận
    },
    orderItems: {
        type: [OrderItemSchema],
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    codAmount: {
        type: Number,
        required: true
    },
    shippingFee: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    isFreeShip: {
        type: Boolean,
        default: false
    },
    isPayment: {
        type: Boolean,
        default: false
    },
    note: {
        type: String
    },
    status: {
        type: String,
        enum: [
            'pending',     // Đơn hàng đã được tạo nhưng chưa xử lý
            'processing',  // Đơn hàng đang được xử lý
            'shipped',     // Đơn hàng đã được giao cho đơn vị vận chuyển
            'delivered',   // Đơn hàng đã được giao cho khách hàng
            'confirmed',   // Đơn hàng đã được khách hàng xác nhận đã nhận
            'cancelled',   // Đơn hàng đã bị hủy
            'returned'     // Đơn hàng đã được trả lại
        ],
        default: 'pending'
    },
    statusTimestamps: {
        pending: {type: Date},  // Thời gian khi đơn hàng ở trạng thái 'pending'
        processing: {type: Date},  // Thời gian khi đơn hàng ở trạng thái 'processing'
        shipped: {type: Date},     // Thời gian khi đơn hàng ở trạng thái 'shipped'
        delivered: {type: Date},   // Thời gian khi đơn hàng ở trạng thái 'delivered'
        confirmed: {type: Date},   // Thời gian khi đơn hàng ở trạng thái 'confirmed'
        cancelled: {type: Date},    // Thời gian khi đơn hàng ở trạng thái 'cancelled'
        returned: {type: Date}      // Thời gian khi đơn hàng ở trạng thái 'returned'
    },
    returnInfo: {
        reason: {type: String}, // Lý do hoàn trả (ví dụ: sản phẩm bị lỗi, không đúng mô tả, không còn nhu cầu,...)
        status: {
            type: String,
            enum: [
                'pending', // Quá trình chờ xác nhận yêu cầu hoàn trả
                'initiated', // - 'initiated': Quá trình hoàn trả đã bắt đầu nhưng chưa hoàn tất
                'completed',// - 'completed': Quá trình hoàn trả đã hoàn tất, sản phẩm đã được trả về
                'refunded',// - 'refunded': Tiền đã được hoàn lại cho khách hàng sau khi hoàn trả thành công
                'cancelled' // Không chap nhạn hoàn tra
            ]
        },
        statusTimestamps: {
            pending: {type: Date},// Thời gian gưi yêu  cầu hoàn hàng
            initiated: {type: Date}, // Thời gian khi trạng thái 'initiated'
            completed: {type: Date}, // Thời gian khi trạng thái 'completed'
            refunded: {type: Date},
            cancelled: {type: Date}// Thời gian khi trạng thái 'refunded'
        }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {timestamps: true, versionKey: false});

export default mongoose.model('Order', OrderSchema);

