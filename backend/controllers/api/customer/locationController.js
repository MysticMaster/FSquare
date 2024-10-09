import {getProvincesName, getDistrictsName, getWardsName} from "../../../utils/ghn.js";
import {
    successResponse, createdResponse,
    internalServerErrorResponse, notFoundResponse, badRequestResponse, serviceUnavailableResponse
} from "../../../utils/httpStatusCode.js";
import {responseBody} from "../../../utils/generate.js";

const getProvinces = async (req, res) => {
    try {
        const provinces = await getProvincesName();
        if (!provinces || provinces.length === 0) return res.status(serviceUnavailableResponse.code)
            .json(responseBody(serviceUnavailableResponse.status,
                'Get Provinces Failed'));

        res.status(successResponse.code)
            .json(responseBody(successResponse.status,
                'Get Provinces Successful',
                provinces));
    } catch (error) {
        console.log(`getProvinces ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

const getDistricts = async (req, res) => {
    const provinceID = req.params.id;
    if (!provinceID) {
        return res.status(badRequestResponse.code)
            .json(responseBody(badRequestResponse.status, 'ProvinceID is required'));
    }
    try {
        const districts = await getDistrictsName(provinceID);
        if (!districts || districts.length === 0) {
            return res.status(serviceUnavailableResponse.code)
                .json(responseBody(serviceUnavailableResponse.status,
                    'No districts found or unable to retrieve districts'));
        }
        res.status(successResponse.code)
            .json(responseBody(successResponse.status,
                'Get Districts Successful',
                districts));
    } catch (error) {
        console.log(`getDistricts Error: ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
};

const getWards = async (req, res) => {
    const districtID = req.params.id;
    if (!districtID) {
        return res.status(badRequestResponse.code)
            .json(responseBody(badRequestResponse.status, 'DistrictID is required'));
    }

    try {
        const wards = await getWardsName(districtID);
        if (!wards || wards.length === 0) {
            return res.status(serviceUnavailableResponse.code)
                .json(responseBody(serviceUnavailableResponse.status,
                    'No wards found or unable to retrieve wards'));
        }
        res.status(successResponse.code)
            .json(responseBody(successResponse.status,
                'Get Wards Successful',
                wards));
    } catch (error) {
        console.log(`getWards Error: ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
};

export default {
    getProvinces,
    getDistricts,
    getWards
}
