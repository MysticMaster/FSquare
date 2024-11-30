import Size from "../../../models/sizeModel.js";
import {responseBody} from "../../../utils/generate.js";
import {
    badRequestResponse,
    notFoundResponse,
    conflictResponse,
    successResponse,
    createdResponse,
    internalServerErrorResponse,
    forbiddenResponse
} from "../../../utils/httpStatusCode.js";

const responseData = async (id, res) => {
    const size = await Size.findById(id)
        .select('_id sizeNumber quantity weight createdAt isActive')
        .populate('classification', '_id color')
        .lean();
    if (!size) return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Size not found'));
    return size
}

const createSize = async (req, res) => {
    const user = req.user;
    if (user.authority !== 'superAdmin') return res.status(forbiddenResponse.code).send(responseBody(forbiddenResponse.status, 'Access denied, you are not super admin'));
    const {classification, sizeNumber, quantity, weight} = req.body;
    if (classification === null || sizeNumber === null || quantity === null || weight === null) {
        return res.status(badRequestResponse.code)
            .json(responseBody(badRequestResponse.status, 'All fields are required'));
    }
    if (quantity < 0) return res.status(badRequestResponse.code).json(responseBody(badRequestResponse.status, 'Quantity must be greater than -1'));
    try {
        const existingSize = await Size.findOne({
            sizeNumber: new RegExp(`^${sizeNumber}$`, 'i'),
            classification: classification
        });
        if (existingSize) return res.status(conflictResponse.code).json(responseBody(conflictResponse.status, 'Phân loại đã tồn tại kích cỡ này'));
        const size = new Size({
            classification: classification,
            sizeNumber: sizeNumber,
            weight: weight,
            quantity: quantity
        });
        await size.save();
        const sizeData = await responseData(size._id, res)
        res.status(createdResponse.code)
            .json(responseBody(createdResponse.status,
                'A new size has been created',
                sizeData
            ));
    } catch (error) {
        console.log(`createSize ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

const getSizeByIdClassification = async (req, res) => {
    const sizePage = parseInt(req.query.size, 10) || 5;
    const currentPage = parseInt(req.query.page, 10) || 1;
    const searchQuery = req.query.search || '';
    const status = req.query.status;

    try {
        const query = {
            classification: req.params.id,
            sizeNumber: {$regex: searchQuery, $options: 'i'}
        };
        if (status !== undefined) query.isActive = status;
        const totalSizes = await Size.countDocuments(query);
        const totalPages = Math.ceil(totalSizes / sizePage);

        const sizes = await Size.find(query)
            .sort({createdAt: -1})
            .skip((currentPage - 1) * sizePage)
            .limit(sizePage)
            .select('_id sizeNumber quantity weight createdAt isActive')
            .populate('classification', '_id color')
            .lean();

        const hasNextPage = currentPage < totalPages;
        const hasPreviousPage = currentPage > 1;
        const nextPage = hasNextPage ? currentPage + 1 : null;
        const prevPage = hasPreviousPage ? currentPage - 1 : null;

        res.status(successResponse.code)
            .json(responseBody(successResponse.status,
                'Get Sizes Successful',
                sizes,
                {
                    size: sizePage,
                    page: currentPage,
                    totalItems: totalSizes,
                    totalPages: totalPages,
                    hasNextPage: hasNextPage,
                    hasPreviousPage: hasPreviousPage,
                    nextPage: nextPage,
                    prevPage: prevPage
                }));
    } catch (error) {
        console.log(`getSizeByIdClassification ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

const getSizeById = async (req, res) => {
    try {
        const sizeData = await responseData(req.params.id, res)
        res.status(successResponse.code)
            .json(responseBody(successResponse.status,
                'Get Size Successful',
                sizeData
            ));
    } catch (error) {
        console.log(`getSizeById ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

const updateSize = async (req, res) => {
    const user = req.user;
    if (user.authority !== 'superAdmin') return res.status(forbiddenResponse.code).send(responseBody(forbiddenResponse.status, 'Access denied, you are not super admin'));
    const {sizeNumber, quantity, weight, isActive} = req.body;
    try {
        const size = await Size.findById(req.params.id)
            .select('_id classification sizeNumber quantity weight isActive');
        if (!size) return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Size not found'));

        if (sizeNumber && sizeNumber !== '') {
            const existingSize = await Size.findOne({
                sizeNumber: new RegExp(`^${sizeNumber}$`, 'i'),
                classification: size.classification
            });
            if (existingSize && existingSize.sizeNumber !== size.sizeNumber) return res.status(conflictResponse.code).json(responseBody(conflictResponse.status, 'Phân loại đã tồn tại kích cỡ này'));
            size.sizeNumber = sizeNumber
        }

        if (quantity && quantity > -1) size.quantity = quantity
        if (weight && weight > 0) size.weight = weight
        if (isActive !== null) size.isActive = isActive;

        await size.save();
        const sizeData = await responseData(size._id, res)
        res.status(successResponse.code)
            .json(responseBody(successResponse.status,
                'Update Size Successful',
                sizeData
            ));
    } catch (error) {
        console.log(`updateSize ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

export default {
    createSize,
    getSizeByIdClassification,
    getSizeById,
    updateSize
}
