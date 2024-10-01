import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import {responseBody} from "../utils/generate.js";
import {
    unauthorizedResponse,
    forbiddenResponse,
    internalServerErrorResponse,
    notFoundResponse
} from "../utils/httpStatusCode.js";
import Admin from "../models/adminModel.js";
import Customer from "../models/customerModel.js";

dotenv.config();

const generateToken = async (user, maxAge) => {
    const payload = {
        id: user._id.toString(),
        role: user.role,
        lastLogin: user.lastLogin
    }

    if (user.authority) payload.authority = user.authority;

    try {
        return jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: maxAge});
    } catch (error) {
        console.error('Error creating JWT token:', error);
        throw error;
    }
}

const verifyToken = async (token) => {
    try {
        return jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
        throw error;
    }
};

const authentication = (requiredRole) => async (req, res, next) => {
    let token;

    if (requiredRole === 'admin') {
        token = req.cookies.Authorization;
        if (!token) {
            return res.status(unauthorizedResponse.code).json(
                responseBody(unauthorizedResponse.status, 'No token provided')
            );
        }
    } else {
        token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(unauthorizedResponse.code).json(
                responseBody(unauthorizedResponse.status, 'No token provided')
            );
        }
    }

    try {
        const decodedToken = await verifyToken(token);

        if (requiredRole && decodedToken.role !== requiredRole) {
            return res.status(forbiddenResponse.code).json(
                responseBody(forbiddenResponse.status, 'Access denied')
            );
        }

        const UserModel = decodedToken.role === 'admin' ? Admin : Customer;
        const user = await UserModel.findById(decodedToken.id).select('lastLogin isActive').lean();

        if (!user) {
            return res.status(notFoundResponse.code).json(
                responseBody(notFoundResponse.status, `${decodedToken.role.charAt(0).toUpperCase() + decodedToken.role.slice(1)} not found`)
            );
        }

        if (decodedToken.lastLogin !== user.lastLogin) {
            return res.status(forbiddenResponse.code).json(
                responseBody(forbiddenResponse.status, 'Token is obsolete')
            );
        }

        if (user.isActive === false) return res.status(forbiddenResponse.code).json(
            responseBody(forbiddenResponse.status, 'Account has been disabled')
        );

        req.user = decodedToken;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(unauthorizedResponse.code).json(
                responseBody(unauthorizedResponse.status, 'Token has expired')
            );
        }
        res.status(internalServerErrorResponse.code).json(
            responseBody(internalServerErrorResponse.status, 'An unspecified exception occurred.')
        );
    }
};


export {generateToken, authentication};
