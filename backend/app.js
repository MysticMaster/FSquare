import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import logger from 'morgan';
import {connectDB} from "./config/database.js";
import auth from "./routes/auth/authRoute.js";
import {authentication} from "./middleware/authMiddleware.js";
import adminRoute from "./routes/api/adminRoute.js";
import customerRoute from "./routes/api/customerRoute.js";

const app = express();

connectDB().then(r => {
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/auth', auth);
app.use('/api/v0',authentication('admin'), adminRoute);
app.use('/api/v1',authentication('customer'),customerRoute);

export default app;
