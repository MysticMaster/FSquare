import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import logger from 'morgan';
import cors from 'cors';
import {connectDB} from "./config/database.js";
import auth from "./routes/auth/authRoute.js";
import {authentication} from "./middleware/authMiddleware.js";
import adminRoute from "./routes/api/adminRoute.js";
import customerRouteV1 from "./routes/api/customerRouteV1.js";
import customerRouteV2 from "./routes/api/customerRouteV2.js";
import {swaggerSpec} from "./config/swagger.js";
import swaggerUi from "swagger-ui-express";

import cron from 'node-cron';
import {getOrderStatusFromGHN} from "./utils/ghn.js";
import Order from "./models/orderModel.js";
import {orderStatus} from "./utils/orderStatus.js";

const app = express();

connectDB().then(r => {
});

const corsOptions = {
    origin: ['http://localhost:5173', 'http://51.79.156.193:5173'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(logger('dev'));
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/auth', auth);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/admin', authentication('admin'), adminRoute);
app.use('/api/customer/v1', authentication('customer'), customerRouteV1);
app.use('/api/customer/v2', customerRouteV2);

cron.schedule('*/5 * * * *', async () => {
    try {
        console.log('Chạy: ' + new Date());
        const orders = await Order.find({ status: orderStatus.shipped })
            .select('_id')
            .lean();

        await Promise.all(orders.map(order => autoDeliveredStatusFake(order._id)));

        const deliveredOrders = await Order.find({ status: orderStatus.delivered })
            .select('_id')
            .lean();

        const fourDaysAgo = new Date();
        fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);

        const ordersToConfirm = deliveredOrders.filter(order => {
            const deliveredDate = new Date(order.statusTimestamps?.delivered);
            return deliveredDate <= fourDaysAgo;
        });

        await Promise.all(ordersToConfirm.map(order => autoConfirmedStatus(order._id)));
    } catch (error) {
        console.error('Error in cron job:', error);
    }
});

const autoUpdateStatus = async (clientOrderCode) => {
    try {
        // Lấy trạng thái từ GHTK
        const ghtkData = await getOrderStatusFromGHN(clientOrderCode);

        // Giả sử ghtkData có trường status để cập nhật
        const ghtkStatus = ghtkData.status; // Cần điều chỉnh theo cấu trúc dữ liệu của bạn

        // Cập nhật vào cơ sở dữ liệu MongoDB
        await Order.updateOne(
            {clientOrderCode: clientOrderCode},
            {status: ghtkStatus}
        );

        console.log(`Order status updated to: ${ghtkStatus}`);
    } catch (error) {
        console.error('Error updating order status:', error);
    }
};

const autoDeliveredStatusFake = async (id) => {
    try {
        await Order.updateOne(
            {_id: id},
            {
                status: orderStatus.delivered,
                [`statusTimestamps.${orderStatus.delivered}`]: new Date(),
            }
        );
    } catch (error) {
        console.error('autoDeliveredStatusFake:', error);
    }
};

const autoConfirmedStatus = async (id) => {
    try {
        await Order.updateOne(
            {_id: id},
            {
                status: orderStatus.confirmed,
                [`statusTimestamps.${orderStatus.confirmed}`]: new Date(),
            }
        );
    } catch (error) {
        console.error('autoConfirmedStatus:', error);
    }
}

export default app;
