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
        }).select('_id sizeNumber weight quantity').lean();
        res.status(successResponse.code)
            .json(responseBody(successResponse.status, 'Get Sizes Successful',  sizes));
    } catch (error) {
        console.log(`getSizesByIdClassification ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

export default {
    getSizesByIdClassification
}
