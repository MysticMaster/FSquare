import Account from "../../models/accountModel.js";
import Customer from "../../models/customerModel.js";
import {generateToken} from "../../middleware/authMiddleware.js";
import {responseBody, generateOTP, generateString} from "../../utils/generate.js";
import {sendOTP} from "../../config/mailjet.js";
import {getOTPFromRedis, deleteOTPFromRedis, putOTPToRedis} from "../../config/redis.js";
import {
    badRequestResponse,
    notFoundResponse,
    conflictResponse,
    successResponse,
    createdResponse, internalServerErrorResponse, forbiddenResponse
} from "../../utils/httpStatusCode.js";

const maxAge = 30 * 24 * 60 * 60;

const authentication = async (req, res) => {
    const {email} = req.body;
    if (!email) return res.status(badRequestResponse.code).json(responseBody(badRequestResponse.status, 'Email is required', {}));

    try {
        const account = await Account.findOne({email: email})
            .select('_id isActive').lean();

        if (!account) return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Email not registered', {}));
        if (account.isActive === false) return res.status(forbiddenResponse.code).json(responseBody(forbiddenResponse.status, 'Account has been disabled', {}));

        const otp = generateOTP(4);
        await putOTPToRedis(email, otp);
        await sendOTP(email, 'Mã xác nhận đăng nhập tài khoản', otp);
        res.status(successResponse.code)
            .json(responseBody(successResponse.status, 'OTP sent successfully', {}));
    } catch (error) {
        console.log(`authentication ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error', {}));
    }
}

const registration = async (req, res) => {
    const {email} = req.body;
    if (!email) return res.status(badRequestResponse.code).json(responseBody(badRequestResponse.status, 'Email is required', {}));
    try {
        const account = await Account.findOne({email: email})
            .select('_id').lean();
        if (account) return res.status(conflictResponse.code).json(responseBody(conflictResponse.status, 'Email already in use', {}));

        const otp = generateOTP(4);
        await putOTPToRedis(email, otp);
        await sendOTP(email, 'Mã xác nhận đăng ký tài khoản', otp);
        res.status(successResponse.code)
            .json(responseBody(successResponse.status, 'OTP sent successfully', {}));
    } catch (error) {
        console.log(`registration ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error', {}));
    }
}

const verification = async (req, res) => {
    const {otp, email, type, fcmToken} = req.body;
    if (!otp) return res.status(badRequestResponse.code).json(responseBody(badRequestResponse.status, 'OTP is required', {}));
    if (!email) return res.status(badRequestResponse.code).json(responseBody(badRequestResponse.status, 'Email is required', {}));
    if (!type) return res.status(badRequestResponse.code).json(responseBody(badRequestResponse.status, 'Type is required', {}));

    try {
        const otpConfirm = await getOTPFromRedis(email);
        if (!otpConfirm) return res.status(badRequestResponse.code).json(responseBody(badRequestResponse.status, 'OTP not found or expired', {}));
        if (otp !== otpConfirm) return res.status(conflictResponse.code).json(responseBody(conflictResponse.status, 'OTP is incorrect', {}));

        await deleteOTPFromRedis(email);

        if (type === 'login') {
            const account = await Account.findOne({email: email})
                .select('accountId fcmToken');
            const customer = await Customer.findOne({accountId: account.accountId})
                .select('_id role');

            if (!customer) {
                return res.status(notFoundResponse.code)
                    .json(responseBody(notFoundResponse.status, 'Customer not found', {}));
            }
            const token = await generateToken(customer, maxAge);
            if (fcmToken) {
                account.fcmToken = fcmToken;
                await account.save();
            }
            return res.status(successResponse.code)
                .json(responseBody(successResponse.status, 'Login successfully', {token: token}));
        }

        if (type === 'signup') {
            const account = await Account.create({
                accountId: generateString(16),
                email: email,
                fcmToken: fcmToken || null
            });
            const customer = await Customer.create({accountId: account.accountId});
            const token = await generateToken(customer, maxAge);
            return res.status(createdResponse.code)
                .json(responseBody(createdResponse.status, 'Register successfully', {token: token}));
        }

    } catch (error) {
        console.log(`verification ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error', {}));
    }
}

export default {
    authentication,
    registration,
    verification
}
