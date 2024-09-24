import Size from "../../../models/sizeModel.js";
import {responseBody} from "../../../utils/generate.js";
import {
    successResponse,
    internalServerErrorResponse, notFoundResponse
} from "../../../utils/httpStatusCode.js";

const getSizesByIdClassification = async (req, res) => {
    try {
        const sizes = await Size.find({
            classification: req.params.id,
            isActive: true
        }).select('_id sizeNumber').lean();
        res.status(successResponse.code)
            .json(responseBody(successResponse.status, 'Get Sizes Successful', {sizes: sizes}));
    } catch (error) {
        console.log(`getSizesByIdClassification ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error', {}));
    }
}

const getSizeById = async (req, res) => {
    try {
        const size = await Size.findById(req.params.id)
            .select('_id sizeNumber quantity')
            .lean();

        if (!size) return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Size not found', {}));
        res.status(successResponse.code)
            .json(responseBody(successResponse.status, 'Get Size Successful', {size: size}));
    } catch (error) {
        console.log(`getSizeById ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error', {}));
    }
}

export default {
    getSizesByIdClassification,
    getSizeById
}
