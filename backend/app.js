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

const app = express();

connectDB().then(r => {
});

const corsOptions = {
    origin: 'http://localhost:5173',
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
app.use('/api/admin',authentication('admin'),  adminRoute);
app.use('/api/customer/v1', authentication('customer'), customerRouteV1);
app.use('/api/customer/v2', customerRouteV2);

export default app;
