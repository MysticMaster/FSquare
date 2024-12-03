import Customer from "../../../models/customerModel.js";
import {generateOTP, responseBody} from "../../../utils/generate.js";
import {
    badRequestResponse,
    notFoundResponse,
    conflictResponse,
    successResponse,
    createdResponse, internalServerErrorResponse, forbiddenResponse
} from "../../../utils/httpStatusCode.js";
import {getSingleImage, putSingleImage} from "../../../utils/media.js";
import {deleteObjectCommand} from "../../../config/aswS3.js";
import {avatarDir, customerDir} from "../../../utils/directory.js";
import {deleteOTPFromRedis, getOTPFromRedis, putOTPToRedis} from "../../../config/redis.js";
import {sendOTP} from "../../../config/mailjet.js";
import argon2 from "argon2";

const maxAge = 86400;

const responseData = async (id, res) => {
    const customer = await Customer.findById(userId)
        .select('firstName lastName email avatar birthDay phone')
        .lean();

    if (!customer) return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Account not found'));
    const customerData = {...customer};
    if (customerData.avatar) customerData.avatar = await getSingleImage(`${customerDir}/${avatarDir}`, customerData.avatar, maxAge);
}

const getProfile = async (req, res) => {
    const userId = req.user.id;
    try {
        const customerData = await responseData(userId, res);
        res.status(successResponse.code)
            .json(responseBody(successResponse.status,
                'Get profile successful',
                customerData
            ));
    } catch (error) {
        console.log(`getProfile ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

const updateProfile = async (req, res) => {
    const userId = req.user.id;
    const {firstName, lastName, birthDay, phone, fcmToken} = req.body;
    try {
        const customer = await Customer.findById(userId)
            .select('_id firstName lastName avatar birthDay phone fcmToken');
        if (!customer) return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Account not found'));
        if (firstName && firstName !== '') customer.firstName = firstName;
        if (lastName && lastName !== '') customer.lastName = lastName;
        if (birthDay && birthDay !== '') customer.birthDay = birthDay;
        if (phone && phone !== '') customer.phone = phone;
        if (fcmToken && fcmToken !== '') customer.lastFcmToken = fcmToken;

        if (req.file) {
            const newAvatar = await putSingleImage(`${customerDir}/${avatarDir}`, req.file);
            if (newAvatar) {
                if (customer.avatar) await deleteObjectCommand(`${customerDir}/${avatarDir}`, customer.avatar);
                customer.avatar = newAvatar;
            }
        }
        await customer.save();

        const customerData = await responseData(customer._id, res);
        res.status(successResponse.code)
            .json(responseBody(successResponse.status,
                'Update Profile Successful',
                customerData
            ));
    } catch (error) {
        console.log(`updateProfile ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

const addAddress = async (req, res) => {
    const userId = req.user.id;
    const {title, address, wardName, districtName, provinceName} = req.body;
    if (!address || !wardName || !districtName || !provinceName) return res.status(badRequestResponse.code).json(responseBody(badRequestResponse.status, 'All fields are required'));
    try {
        const customer = await Customer.findById(userId)
            .select('address');
        if (!customer) return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Account not found'));

        const newAddress = {
            title: title,
            address: address,
            wardName: wardName,
            districtName: districtName,
            provinceName: provinceName,
            isDefault: customer.address.length === 0 // Đặt isDefault là true nếu đây là địa chỉ đầu tiên
        };

        customer.address.push(newAddress);
        await customer.save();

        res.status(successResponse.code)
            .json(responseBody(successResponse.status,
                'Address added successfully',
                customer.address
            ));
    } catch (error) {
        console.log(`addAddress ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
};

const getAddress = async (req, res) => {
    const userId = req.user.id;
    try {
        const customer = await Customer.findById(userId)
            .select('address').lean();
        if (!customer) return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Account not found'));

        res.status(successResponse.code)
            .json(responseBody(successResponse.status,
                'Get address successfully',
                customer.address || []
            ));
    } catch (error) {
        console.log(`getAddress ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

const updateAddress = async (req, res) => {
    const userId = req.user.id;
    const addressId = req.params.id;
    if (!addressId) return res.status(badRequestResponse.code).json(responseBody(badRequestResponse.status, 'Address ID is required'));
    const {title, address, wardName, districtName, provinceName, isDefault} = req.body;

    try {
        const customer = await Customer.findById(userId).select('address');
        if (!customer) return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Account not found'));
        const addressItem = customer.address.id(addressId);
        if (!addressItem) return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Address not found'));

        addressItem.title = title || addressItem.title;
        addressItem.address = address || addressItem.address;
        addressItem.wardName = wardName || addressItem.wardName;
        addressItem.districtName = districtName || addressItem.districtName;
        addressItem.provinceName = provinceName || addressItem.provinceName;

        if (isDefault) {
            customer.address.forEach((addr) => {
                if (addr.id !== addressId) {
                    addr.isDefault = false;
                }
            });
            addressItem.isDefault = true; // Đặt địa chỉ hiện tại thành mặc định
        } else {
            addressItem.isDefault = false; // Nếu isDefault không được gửi, đặt địa chỉ hiện tại thành không mặc định
        }

        await customer.save();

        res.status(successResponse.code)
            .json(responseBody(successResponse.status,
                'Address updated successfully',
                customer.address
            ));
    } catch (error) {
        console.log(`updateAddress ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
};

const deleteAddress = async (req, res) => {
    const userId = req.user.id;
    const addressId = req.params.id;
    if (!addressId) return res.status(badRequestResponse.code).json(responseBody(badRequestResponse.status, 'Address ID is required'));

    try {
        const customer = await Customer.findById(userId).select('address');
        if (!customer) return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Account not found'));
        const addressItem = customer.address.id(addressId);
        if (!addressItem) return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Address not found'));

        customer.address.pull({_id: addressId});

        await customer.save();
        res.status(successResponse.code)
            .json(responseBody(successResponse.status,
                'Address deleted successfully',
                customer.address
            ));
    } catch (error) {
        console.log(`deleteAddress ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
};

const otpAuthentication = async (req, res) => {
    const userId = req.user.id;
    try {
        const customer = await Customer.findById(userId)
            .select('email')
            .lean();
        if (!customer) return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Account not found'));
        const otp = generateOTP(4);
        await putOTPToRedis(customer.email, otp);
        await sendOTP(customer.email, 'Mã xác thực thay đổi mã PIN', otp);
        res.status(successResponse.code)
            .json(responseBody(successResponse.status, 'OTP sent successfully'));
    } catch (error) {
        console.log(`otpAuthentication ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

const otpVerification = async (req, res) => {
    const userId = req.user.id;
    const {otp} = req.body;
    if (!otp) return res.status(badRequestResponse.code).json(responseBody(badRequestResponse.status, 'OTP is required'));

    try {
        const customer = await Customer.findById(userId)
            .select('email')
            .lean();
        if (!customer) return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Account not found'));
        const otpConfirm = await getOTPFromRedis(customer.email);
        if (!otpConfirm) return res.status(badRequestResponse.code).json(responseBody(badRequestResponse.status, 'OTP not found or expired'));
        if (otp !== otpConfirm) return res.status(conflictResponse.code).json(responseBody(conflictResponse.status, 'OTP is incorrect'));
        await deleteOTPFromRedis(customer.email);
        res.status(successResponse.code)
            .json(responseBody(successResponse.status, 'OTP authentication successfully'));
    } catch (error) {
        console.log(`otpVerification ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

const updatePinCode = async (req, res) => {
    const userId = req.user.id;
    const {pinCode, action} = req.body;
    if (!action) return res.status(badRequestResponse.code).json(responseBody(badRequestResponse.status, 'Action is required'));
    try {
        const customer = await Customer.findById(userId)
            .select('pinCode');
        if (!customer) return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Account not found'));
        if (action === 'on') {
            if (!pinCode) return res.status(badRequestResponse.code).json(responseBody(badRequestResponse.status, 'PIN is required'));
            customer.pinCode = await argon2.hash(pinCode);
        } else if (action === 'off') customer.pinCode = null;

        await customer.save();
        res.status(successResponse.code)
            .json(responseBody(successResponse.status,
                'Update Pin code Successful'
            ));
    } catch (error) {
        console.log(`updatePinCode ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

const pinAuthentication = async (req, res) => {
    const userId = req.user.id;
    const {pinCode} = req.body;
    if (!pinCode) return res.status(badRequestResponse.code).json(responseBody(badRequestResponse.status, 'PIN is required'));
    try {
        const customer = await Customer.findById(userId)
            .select('pinCode').lean();
        if (!customer) return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Account not found'));
        const isPinCodeValid = await argon2.verify(customer.pinCode, pinCode);
        if (!isPinCodeValid) {
            return res.status(conflictResponse.code)
                .json(responseBody(conflictResponse.status, 'Incorrect PIN'));
        }
        res.status(successResponse.code)
            .json(responseBody(successResponse.status,
                'PIN authentication successfully'
            ));
    } catch (error) {
        console.log(`pinAuthentication ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

export default {
    getProfile,
    updateProfile,
    addAddress,
    getAddress,
    updateAddress,
    deleteAddress,
    otpAuthentication,
    otpVerification,
    updatePinCode,
    pinAuthentication
}
