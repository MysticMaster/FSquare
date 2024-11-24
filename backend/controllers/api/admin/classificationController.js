import Classification from "../../../models/classificationModel.js";
import {responseBody} from "../../../utils/generate.js";
import {
    badRequestResponse,
    notFoundResponse,
    conflictResponse,
    successResponse,
    createdResponse, internalServerErrorResponse, forbiddenResponse
} from "../../../utils/httpStatusCode.js";
import {getFiles, getSingleImage, putFiles, putSingleImage} from "../../../utils/media.js";
import {classificationDir, thumbnailDir, imageDir, videoDir} from "../../../utils/directory.js";
import {deleteObjectCommand} from "../../../config/aswS3.js";
import Size from "../../../models/sizeModel.js";

const maxAge = 86400;

const createClassification = async (req, res) => {
    const user = req.user;
    if (user.authority !== 'superAdmin') return res.status(forbiddenResponse.code).send(responseBody(forbiddenResponse.status, 'Access denied, you are not super admin'));
    const {shoes, color, country, price} = req.body;
    if (!shoes || !color || !country || !price) return res.status(badRequestResponse.code).json(responseBody(badRequestResponse.status, 'All fields are required'));
    if (price < 0) return res.status(badRequestResponse.code).json(responseBody(badRequestResponse.status, 'Price must be greater than 0'));
    try {
        const existingClassification = await Classification.findOne({
            color: new RegExp(`^${color}$`, 'i'),
            shoes: shoes
        });
        if (existingClassification) return res.status(conflictResponse.code).json(responseBody(conflictResponse.status, 'Classification with the same color already exists for this shoes'));
        const classification = new Classification({
            shoes: shoes,
            color: color,
            country: country,
            price: price,
        });
        if (req.files && req.files['file']) {
            classification.thumbnail = await putSingleImage(`${classificationDir}/${thumbnailDir}`, req.files['file'][0]);
        }
        if (req.files && req.files['files']) {
            const {images, videos} = await putFiles(classificationDir, req.files['files']);
            classification.images = images;
            classification.videos = videos;
        }
        await classification.save();
        res.status(createdResponse.code)
            .json(responseBody(createdResponse.status,
                'A new classification has been created',
                classification
            ));
    } catch (error) {
        console.log(`createClassification ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

const getClassificationsByIdShoes = async (req, res) => {
    const sizePage = parseInt(req.query.size, 10) || 5;
    const currentPage = parseInt(req.query.page, 10) || 1;
    const searchQuery = req.query.search || '';
    const status = req.query.status;

    try {
        const query = {
            shoes: req.params.id,
            color: {$regex: searchQuery, $options: 'i'}
        };
        if (status !== undefined) query.isActive = status;
        const totalClassifications = await Classification.countDocuments(query);
        const totalPages = Math.ceil(totalClassifications / sizePage);

        const classifications = await Classification.find(query)
            .sort({createdAt: -1})
            .skip((currentPage - 1) * sizePage)
            .limit(sizePage)
            .select('_id thumbnail color country price createdAt isActive')
            .populate('shoes','_id name')
            .lean();

        const classificationsIds = classifications.map(classifications => classifications._id);

        const sizeCounts = await Size.aggregate([
            {$match: {classifications: {$in: classificationsIds}}},
            {$group: {_id: "$classifications", count: {$sum: 1}}}
        ]);

        const classificationsData = await Promise.all(classifications.map(async (classification) => {
            const sizeCountData = sizeCounts.find(sc => sc._id.equals(classification._id));
            const classificationData = {
                ...classification,
                sizeCount: sizeCountData ? sizeCountData.count : 0
            }

            if (classificationData.thumbnail) classificationData.thumbnail = await getSingleImage(`${classificationDir}/${thumbnailDir}`, classificationData.thumbnail, maxAge);
            return classificationData;
        }));

        const hasNextPage = currentPage < totalPages;
        const hasPreviousPage = currentPage > 1;
        const nextPage = hasNextPage ? currentPage + 1 : null;
        const prevPage = hasPreviousPage ? currentPage - 1 : null;

        res.status(successResponse.code)
            .json(responseBody(successResponse.status, 'Get Classification Successful',
                classificationsData,
                {
                    size: sizePage,
                    page: currentPage,
                    totalItems: totalClassifications,
                    totalPages: totalPages,
                    hasNextPage: hasNextPage,
                    hasPreviousPage: hasPreviousPage,
                    nextPage: nextPage,
                    prevPage: prevPage
                }));
    } catch (error) {
        console.log(`getClassificationsByIdShoes ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

const getClassificationById = async (req, res) => {
    try {
        const classification = await Classification.findById(req.params.id)
            .select('_id thumbnail images videos color country price createdAt isActive')
            .lean();
        if (!classification) return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Classification not found'));
        const classificationData = {...classification};
        if (classificationData.thumbnail) classificationData.thumbnail = await getSingleImage(`${classificationDir}/${thumbnailDir}`, classificationData.thumbnail, maxAge);
        if (classificationData.images) classificationData.images = await getFiles(`${classificationDir}/${imageDir}`, classificationData.images, maxAge, true);
        if (classificationData.videos) classificationData.videos = await getFiles(`${classificationDir}/${videoDir}`, classificationData.videos, maxAge, true);
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

const updateClassification = async (req, res) => {
    const user = req.user;
    if (user.authority !== 'superAdmin') return res.status(forbiddenResponse.code).send(responseBody(forbiddenResponse.status, 'Access denied, you are not super admin'));
    const {color, country, price, isActive} = req.body;
    try {
        const classification = await Classification.findById(req.params.id)
            .select('_id shoes thumbnail color country price isActive');
        if (!classification) return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Classification not found'));
        if (color && color !== '') {
            const existingClassification = await Classification.findOne({
                color: new RegExp(`^${color}$`, 'i'),
                shoes: classification.shoes
            });
            if (existingClassification && existingClassification.color !== classification.color) return res.status(conflictResponse.code).json(responseBody(conflictResponse.status, 'Classification with the same color already exists for this shoes'));
            classification.color = color;
        }
        if (country) classification.country = country;
        if (price && price > 0) classification.price = price;
        if (typeof isActive !== 'undefined') classification.isActive = isActive;
        if (req.file) {
            const newThumbnail = await putSingleImage(`${classificationDir}/${thumbnailDir}`, req.file);
            if (newThumbnail) {
                if (classification.thumbnail) await deleteObjectCommand(`${classificationDir}/${thumbnailDir}`, classification.thumbnail);
                classification.thumbnail = newThumbnail;
            }
        }
        await classification.save();
        res.status(successResponse.code)
            .json(responseBody(successResponse.status,
                'Update Classification Successful',
                classification
            ));
    } catch (error) {
        console.log(`updateClassification ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

const addMedias = async (req, res) => {
    const user = req.user;
    if (user.authority !== 'superAdmin') return res.status(forbiddenResponse.code).send(responseBody(forbiddenResponse.status, 'Access denied, you are not super admin'));
    try {
        const classification = await Classification.findById(req.params.id)
            .select('_id images videos');

        if (!classification) {
            return res.status(notFoundResponse.code)
                .json(responseBody(notFoundResponse.status, 'Classification not found'));
        }

        let newImagesCount = 0;
        let newVideosCount = 0;

        if (req.files) {
            for (const file of req.files) {
                const mimeType = file.mimetype;
                if (mimeType.startsWith('image/')) newImagesCount++;
                if (mimeType.startsWith('video/')) newVideosCount++;
            }
        }

        if (classification.images.length + newImagesCount > 5) {
            return res.status(badRequestResponse.code)
                .json(responseBody(badRequestResponse.status, 'Adding these images would exceed the limit of 5'));
        }

        if (classification.videos.length + newVideosCount > 5) {
            return res.status(badRequestResponse.code)
                .json(responseBody(badRequestResponse.status, 'Adding these videos would exceed the limit of 5'));
        }

        if (req.files) {
            const {images, videos} = await putFiles(classificationDir, req.files);

            classification.images = classification.images.concat(images);
            classification.videos = classification.videos.concat(videos);
        }

        await classification.save();
        res.status(successResponse.code)
            .json(responseBody(successResponse.status,
                'Medias added successfully',
                classification
            ));
    } catch (error) {
        console.log(`addMedias ${error.message}`);
        return res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
};

const deleteMedia = async (req, res) => {
    const user = req.user;
    if (user.authority !== 'superAdmin') return res.status(forbiddenResponse.code).send(responseBody(forbiddenResponse.status, 'Access denied, you are not super admin'));
    const {key} = req.body;
    try {
        if (!key) {
            return res.status(badRequestResponse.code)
                .json(responseBody(badRequestResponse.status, 'Missing key'));
        }
        let mediaType;
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'tif', 'webp', 'svg', 'ico', 'heic'];
        const videoExtensions = ['mp4', 'mov', 'avi', 'wmv', 'flv', 'mkv', 'webm', 'mpg', 'mpeg', '3gp', 'm4v'];

        if (imageExtensions.some(ext => key.toLowerCase().endsWith(ext))) {
            mediaType = 'images';
        } else if (videoExtensions.some(ext => key.toLowerCase().endsWith(ext))) {
            mediaType = 'videos';
        }

        const classification = await Classification.findById(req.params.id)
            .select('_id images videos');
        if (!classification) return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Classification not found'));
        const mediaList = classification[mediaType];
        const mediaIndex = mediaList.indexOf(key);
        if (mediaIndex === -1) return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Media not found in classification'));
        await deleteObjectCommand(`${classificationDir}/${mediaType}`, key);
        mediaList.splice(mediaIndex, 1);
        await classification.save();

        res.status(successResponse.code)
            .json(responseBody(successResponse.status,
                `Deleted ${mediaType.slice(0, -1)} successfully`,
                classification
            ));
    } catch (error) {
        console.log(`deleteMedia ${error.message}`);
        return res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

export default {
    createClassification,
    getClassificationsByIdShoes,
    getClassificationById,
    updateClassification,
    addMedias,
    deleteMedia
}
