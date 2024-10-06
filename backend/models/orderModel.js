import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    orderID: {
        type: String,
        required: true,
        unique: true
    },
    shippingAddress: {
        name: {type: String, required: true}, // Tên người nhận
        address: {type: String, required: true}, // Địa chỉ nhận hàng
        province: {type: String, required: true}, // Tỉnh/Thành phố nhận hàng
        district: {type: String, required: true}, // Quận/Huyện nhận hàng
        ward: {type: String, required: true}, // Phường/Xã nhận hàng
        tel: {type: String, required: true} // Số điện thoại người nhận
    },
    products: [{
        size: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Size',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        weight: {
            type: Number,
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
    }],
    totalWeight: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    shippingFee:{
        type: Number,
        required: true
    },
    transportMethod: {
        type: String,
        enum: ['road', 'fly'],
        default: 'road'
    },
    isFreeShip: {
        type: Boolean,
        default: false
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
        pending: {type: Date},     // Thời gian khi đơn hàng ở trạng thái 'pending'
        processing: {type: Date},  // Thời gian khi đơn hàng ở trạng thái 'processing'
        shipped: {type: Date},     // Thời gian khi đơn hàng ở trạng thái 'shipped'
        delivered: {type: Date},   // Thời gian khi đơn hàng ở trạng thái 'delivered'
        confirmed: {type: Date},   // Thời gian khi đơn hàng ở trạng thái 'confirmed'
        cancelled: {type: Date},    // Thời gian khi đơn hàng ở trạng thái 'cancelled'
        returned: {type: Date}      // Thời gian khi đơn hàng ở trạng thái 'returned'
    },
    ghtkOrderID: {
        type: String,
    },
    notes: {
        type: String
    },
    returnInfo: {
        reason: {type: String}, // Lý do hoàn trả (ví dụ: sản phẩm bị lỗi, không đúng mô tả, không còn nhu cầu,...)
        returnDate: {type: Date}, // Ngày hoàn trả (ngày mà đơn hàng được hoàn trả)
        status: {
            type: String,
            enum: [
                'initiated', // - 'initiated': Quá trình hoàn trả đã bắt đầu nhưng chưa hoàn tất
                'completed',// - 'completed': Quá trình hoàn trả đã hoàn tất, sản phẩm đã được trả về
                'refunded'// - 'refunded': Tiền đã được hoàn lại cho khách hàng sau khi hoàn trả thành công
            ],
            default: 'initiated' // Trạng thái mặc định là 'initiated' khi quá trình hoàn trả bắt đầu
        },
        statusTimestamps: {
            initiated: {type: Date}, // Thời gian khi trạng thái 'initiated'
            completed: {type: Date}, // Thời gian khi trạng thái 'completed'
            refunded: {type: Date}    // Thời gian khi trạng thái 'refunded'
        }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {timestamps: true, versionKey: false});

export default mongoose.model('Order', OrderSchema);

