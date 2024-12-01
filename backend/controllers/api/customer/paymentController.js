import jwt from 'jsonwebtoken';
import axios from "axios";
import {responseBody} from "../../../utils/generate.js";
import {
    badRequestResponse,
    notFoundResponse,
    conflictResponse,
    successResponse,
    createdResponse,
    internalServerErrorResponse,
    forbiddenResponse, serviceUnavailableResponse
} from "../../../utils/httpStatusCode.js";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.BK_API_KEY;
const apiSecret = process.env.BK_API_SECRET;
const merchantId = process.env.BK_MERCHANT_ID;
const apiUrl = process.env.BK_API_URL;
const webhookURL = process.env.BK_WEBHOOK_URL;

const generateJWT = () => {
    const payload = {
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60,
        iss: apiKey,
    };
    return jwt.sign(payload, apiSecret, {algorithm: "HS256"});
}

const createPaymentURL = async (req, res) => {
    const {clientOrderCode, totalAmount, toPhone} = req.body;
    if (!clientOrderCode || !totalAmount || !toPhone) return res.status(badRequestResponse.code)
        .json(responseBody(badRequestResponse.status, 'All fields are required'));

    const data = {
        Payment_type: "Pay and Create Token",
        api_operation: "PAY",
        init_token: 1,
        merchant_id: merchantId,
        mrc_order_id: clientOrderCode,
        total_amount: totalAmount,
        description: "test_package",
        webhooks: webhookURL,
        customer_phone: toPhone
    }

    const token = generateJWT();
    const headers = {
        "Content-Type": "application/json",
        "jwt": `Bearer ${token}`,
    };

    try {
        const response = await axios.post(
            `${apiUrl}/payment/api/v5/order/send`,
            data,
            {headers}
        );

        console.log('createPaymentURL: '+response.data)

        if (response.data.code !== 0) return res.status(conflictResponse.code)
            .json(responseBody(conflictResponse.status, `Unknown response: ${response.data.message}`));

        res.status(successResponse.code)
            .json(responseBody(successResponse.status, 'Successfully sent order', {
                orderID: response.data.data.order_id,
                redirectUrl: response.data.data.redirect_url,
                paymentUrl: response.data.data.payment_url
            }));
    } catch (error) {
        console.log(`createPaymentURL ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, `Server error: ${error.message}`));
    }
}

const getPayments = async (req, res) => {
    try {
        const token = generateJWT();
        const headers = {
            "Content-Type": "application/json",
            "jwt": `Bearer ${token}`,
        };

        const response = await axios.get(
            `${apiUrl}/payment/api/v5/bpm/list`,
            {headers}
        );
        if (response.data.code !== 0) return res.status(serviceUnavailableResponse.code)
            .json(responseBody(serviceUnavailableResponse.status, 'Unknown response'));

        res.status(successResponse.code)
            .json(responseBody(successResponse.status, 'Successfully sent order', response.data.data));
    } catch (error) {
        console.log(`getPayments ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

const checkPayment = async (req, res) => {
    const {orderId, clientOrderCode} = req.body;
    if (!clientOrderCode || !orderId) return res.status(badRequestResponse.code)
        .json(responseBody(badRequestResponse.status, 'All fields are required'));
    try {
        const token = generateJWT();
        const headers = {
            "Content-Type": "application/json",
            "jwt": `Bearer ${token}`,
        };

        const response = await axios.get(
            `${apiUrl}/payment/api/v5/order/detail?id=${orderId}&mrc_order_id=${clientOrderCode}`,
            {headers}
        );
        if (response.data.code !== 0) return res.status(serviceUnavailableResponse.code)
            .json(responseBody(serviceUnavailableResponse.status, 'Unknown response'));

        let message = ''
        const data = {}
        switch (response.data.data.stat) {
            case 'p':
                message = 'Order awaiting payment'
                data.status = "processing"
                break;
            case 'c':
                message = 'Order payment successful'
                data.status = "completed"
                break;
            case 'd':
                message = 'Order cancelled or payment failed'
                data.status = "destructed"
                break;
            default:
                return res.status(serviceUnavailableResponse.code)
                    .json(responseBody(serviceUnavailableResponse.status, 'Unknown payment status'));
        }

        res.status(successResponse.code)
            .json(responseBody(successResponse.status, message, data));
    } catch (error) {
        console.log(`getPayments ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

export default {
    createPaymentURL,
    getPayments,
    checkPayment
}
