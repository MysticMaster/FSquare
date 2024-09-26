import Admin from "../../models/adminModel.js";
import {generateToken} from "../../middleware/authMiddleware.js";
import {responseBody, generateOTP} from "../../utils/generate.js";
import {sendOTP} from "../../config/mailjet.js";
import {getOTPFromRedis, deleteOTPFromRedis, putOTPToRedis} from "../../config/redis.js";
import {
    badRequestResponse,
    notFoundResponse,
    conflictResponse,
    successResponse,
    createdResponse, internalServerErrorResponse, forbiddenResponse
} from "../../utils/httpStatusCode.js";
import argon2 from "argon2";

const maxAge = 24 * 60 * 60;

const authentication = async (req, res) => {
    const {username, password} = req.body;

    if (!username) {
        return res.status(badRequestResponse.code)
            .json(responseBody(badRequestResponse.status, 'Username is required'));
    }
    if (!password) {
        return res.status(badRequestResponse.code)
            .json(responseBody(badRequestResponse.status, 'Password is required'));
    }

    try {
        const admin = await Admin.findOne({username: username})
            .select('_id password role authority lastLogin isActive');

        if (!admin) {
            return res.status(notFoundResponse.code)
                .json(responseBody(notFoundResponse.status, 'Username not registered'));
        }

        if (admin.isActive === false) {
            return res.status(forbiddenResponse.code)
                .json(responseBody(forbiddenResponse.status, 'Admin has been disabled'));
        }

        const isPasswordValid = await argon2.verify(admin.password, password);
        if (!isPasswordValid) {
            return res.status(conflictResponse.code)
                .json(responseBody(conflictResponse.status, 'Incorrect password'));
        }

        admin.lastLogin += 1;

        const token = await generateToken(admin, maxAge);

        await admin.save();

        res.cookie('Authorization', token, {
            maxAge: maxAge * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        });

        res.status(successResponse.code)
            .json(responseBody(successResponse.status, 'Login successfully', admin.authority));
    } catch (error) {
        console.log(`authentication ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

export default {
    authentication
}
