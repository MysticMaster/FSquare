import Classification from "../../../models/classificationModel.js";
import {responseBody} from "../../../utils/generate.js";
import {
    successResponse,
    internalServerErrorResponse, notFoundResponse
} from "../../../utils/httpStatusCode.js";
import {getFiles, getSingleImage} from "../../../utils/media.js";
import {thumbnailDir, imageDir, videoDir, classificationDir} from "../../../utils/directory.js";

const maxAge = 86400;

const getClassificationsByIdShoes = async (req, res) => {
    try {
        const classifications = await Classification.find({
            shoes: req.params.id,
            isActive: true
        }).select('_id thumbnail').lean();

        const classificationsData = await Promise.all(classifications.map(async (classification) => {
            const classificationData = {
                ...classification,
            }
            if (classificationData.thumbnail) classificationData.thumbnail = await getSingleImage(`${classificationDir}/${thumbnailDir}`, classificationData.thumbnail, maxAge);
            return classificationData;
        }));
        res.status(successResponse.code)
            .json(responseBody(successResponse.status,
                'Get Classification Successful',
                classificationsData
            ));
    } catch (error) {
        console.log(`getClassificationsByIdShoes ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

const getClassificationById = async (req, res) => {
    try {
        const classification = await Classification.findById(req.params.id)
            .select('_id images videos color country price')
            .lean();

        if (!classification) return res.status(notFoundResponse.code)
            .json(responseBody(notFoundResponse.status, 'Classification not found'));
        const classificationData = {...classification};
        if (classificationData.images) classificationData.images = await getFiles(`${classificationDir}/${imageDir}`, classificationData.images, maxAge);
        if (classificationData.videos) classificationData.videos = await getFiles(`${classificationDir}/${videoDir}`, classificationData.videos, maxAge);
        res.status(successResponse.code)
            .json(responseBody(successResponse.status,
                'Get Classification Successful',
                classificationData
            ));
    } catch (error) {
        console.log(`getClassificationById ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

export default {
    getClassificationsByIdShoes,
    getClassificationById
}
