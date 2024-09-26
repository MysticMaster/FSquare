import Admin from "../../../models/adminModel.js";
import argon2 from "argon2";
import {responseBody} from "../../../utils/generate.js";
import {
    badRequestResponse,
    notFoundResponse,
    conflictResponse,
    successResponse,
    createdResponse, internalServerErrorResponse, forbiddenResponse
} from "../../../utils/httpStatusCode.js";
import {getSingleImage, putSingleImage} from "../../../utils/media.js";
import {adminDir, avatarDir} from "../../../utils/directory.js";
import {deleteObjectCommand} from "../../../config/aswS3.js";

const maxAge = 86400;

const createAdmin = async (req, res) => {
    const user = req.user;

    if (user.authority !== 'superAdmin') return res.status(forbiddenResponse.code).send(responseBody(forbiddenResponse.status, 'Access denied'));

    const {firstName, lastName, email, username, password} = req.body;
    if (!firstName || !lastName || !email || !username || !password) return res.status(badRequestResponse.code).json(responseBody(badRequestResponse.status, 'All fields are required'));
    try {
        const existingEmail = await Admin.findOne({email});
        if (existingEmail) return res.status(conflictResponse.code).json(responseBody(conflictResponse.status, 'Email already exists'));
        const existingUsername = await Admin.findOne({username});
        if (existingUsername) return res.status(conflictResponse.code).json(responseBody(conflictResponse.status, 'Username already exists'));

        const admin = new Admin({
            firstName: firstName,
            lastName: lastName,
            email: email,
            username: username,
            password: await argon2.hash(password),
        });

        if (req.file) admin.avatar = await putSingleImage(`${adminDir}/${avatarDir}`, req.file);
        await admin.save();
        res.status(createdResponse.code)
            .json(responseBody(createdResponse.status, 'A new admin has been created', admin));
    } catch (error) {
        console.log(`createAdmin ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

const getProfile = async (req, res) => {
    const userId = req.user.id;
    try {
        const admin = await Admin.findById(userId)
            .select('_id firstName lastName avatar phone fcmToken authority')
            .lean();
        if (!admin) return res.status(notFoundResponse.code)
            .json(responseBody(notFoundResponse.status, 'Admin not found'));
        if (admin.avatar) admin.avatar = await getSingleImage(`${adminDir}/${avatarDir}`, admin.avatar);
        res.status(successResponse.code)
            .json(responseBody(successResponse.status,
                'Get profile successful',
                admin
            ));
    } catch (error) {
        console.log(`getProfile ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

export default {
    createAdmin,
    getProfile
}
