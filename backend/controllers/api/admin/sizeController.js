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

const createSize = async (req, res) => {
    const user = req.user;
    if (user.authority !== 'superAdmin') return res.status(forbiddenResponse.code).send(responseBody(forbiddenResponse.status, 'Access denied, you are not super admin', {}));
    const {classification, sizeNumber, quantity} = req.body;
    if (!classification || !sizeNumber || !quantity) return res.status(badRequestResponse.code).json(responseBody(badRequestResponse.status, 'All fields are required', {}));
    if (quantity < 0) return res.status(badRequestResponse.code).json(responseBody(badRequestResponse.status, 'Quantity must be greater than -1', {}));
    try {
        const existingSize = await Size.findOne({
            sizeNumber: new RegExp(`^${sizeNumber}$`, 'i'),
            classification: classification
        });
        if (existingSize) return res.status(conflictResponse.code).json(responseBody(conflictResponse.status, 'Size with the same size number already exists for this classification', {}));
        const size = new Size({
            classification: classification,
            sizeNumber: sizeNumber,
            quantity: quantity
        });
        await size.save();
        res.status(createdResponse.code)
            .json(responseBody(createdResponse.status, 'A new size has been created', {size: size}));
    } catch (error) {
        console.log(`createSize ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error', {}));
    }
}

const getSizeByIdClassification = async (req, res) => {
    const sizePage = parseInt(req.query.size, 10) || 5;
    const currentPage = parseInt(req.query.page, 10) || 1;
    const searchQuery = req.query.search || '';

    try {
        const query = {
            classification: req.params.id,
            sizeNumber: {$regex: searchQuery, $options: 'i'}
        };
        const totalSize = await Size.countDocuments(query);
        const totalPages = Math.ceil(totalSize / sizePage);

        const sizes = await Size.find(query)
            .sort({createdAt: -1})
            .skip((currentPage - 1) * sizePage)
            .limit(sizePage)
            .select('_id sizeNumber quantity createdAt isActive')
            .lean();
        res.status(successResponse.code)
            .json(responseBody(successResponse.status, 'Get Sizes Successful', {
                sizes: sizes,
                currentPage: currentPage,
                totalPages: totalPages
            }));
    } catch (error) {
        console.log(`getSizeByIdClassification ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error', {}));
    }
}

const getSizeById = async (req, res) => {
    try {
        const size = await Size.findById(req.params.id)
            .select('_id sizeNumber quantity createdAt isActive')
            .lean()
        if (!size) return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Size not found', {}));
        res.status(successResponse.code)
            .json(responseBody(successResponse.status, 'Get Size Successful', {size: size,}));
    } catch (error) {
        console.log(`getSizeById ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error', {}));
    }
}

const updateSize = async (req, res) => {
    const user = req.user;
    if (user.authority !== 'superAdmin') return res.status(forbiddenResponse.code).send(responseBody(forbiddenResponse.status, 'Access denied, you are not super admin', {}));
    const {sizeNumber, quantity, isActive} = req.body;
    try {
        const size = await Size.findById(req.params.id)
            .select('_id classification sizeNumber quantity isActive');
        if (!size) return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Size not found', {}));

        if (sizeNumber && sizeNumber !== '') {
            const existingSize = await Size.findOne({
                sizeNumber: new RegExp(`^${sizeNumber}$`, 'i'),
                classification: size.classification
            });
            if (existingSize && existingSize.sizeNumber !== size.sizeNumber) return res.status(conflictResponse.code).json(responseBody(conflictResponse.status, 'Size with the same size number already exists for this classification', {}));
            size.sizeNumber = sizeNumber
        }

        if (quantity > -1) size.quantity = quantity
        if (typeof isActive !== 'undefined') size.isActive = isActive;

        await size.save();
        res.status(successResponse.code)
            .json(responseBody(successResponse.status, 'Update Size Successful', {size: size}));
    } catch (error) {
        console.log(`updateSize ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error', {}));
    }
}

export default {
    createSize,
    getSizeByIdClassification,
    getSizeById,
    updateSize
}
