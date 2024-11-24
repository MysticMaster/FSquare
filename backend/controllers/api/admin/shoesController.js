import Shoes from "../../../models/shoesModel.js";
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
import {getSingleImage, putSingleImage} from "../../../utils/media.js";
import {shoesDir, thumbnailDir} from "../../../utils/directory.js";
import {deleteObjectCommand} from "../../../config/aswS3.js";
import Classification from "../../../models/classificationModel.js";

const maxAge = 86400;

const createShoes = async (req, res) => {
    const user = req.user;
    if (user.authority !== 'superAdmin') return res.status(forbiddenResponse.code).send(responseBody(forbiddenResponse.status, 'Access denied, you are not super admin'));
    const {brand, category, describe, description} = req.body;
    let {name} = req.body;
    if (!brand || !category || !name || !describe) return res.status(badRequestResponse.code).json(responseBody(badRequestResponse.status, 'Có thuộc tính bắt buộc bị bỏ trống'));
    name = name.trim().replace(/\s+/g, ' ');
    try {
        const existingShoes = await Shoes.findOne({
            name: new RegExp(`^${name}$`, 'i'),
            brand: brand, category: category
        });
        if (existingShoes) return res.status(conflictResponse.code).json(responseBody(conflictResponse.status, 'Danh mục và thương hiệu đã tồn tại sản phẩm này'));

        const shoes = new Shoes({
            brand: brand,
            category: category,
            name: name,
            describe: describe,
            description: description
        });
        if (req.file) shoes.thumbnail = await putSingleImage(`${shoesDir}/${thumbnailDir}`, req.file);

        await shoes.save();

        const findShoes = await Shoes.findById(shoes._id)
            .select('_id thumbnail name createdAt isActive brand category')
            .populate('brand', 'name')
            .populate('category', 'name')
            .lean();
        if (!findShoes) return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Shoes not found'));
        const shoesData = {...findShoes}
        if (shoesData.thumbnail) shoesData.thumbnail = await getSingleImage(`${shoesDir}/${thumbnailDir}`, shoesData.thumbnail, maxAge);
        shoesData.classificationCount = await Classification.countDocuments({shoes: shoesData._id});
        res.status(createdResponse.code)
            .json(responseBody(createdResponse.status,
                'A new shoes has been created',
                shoesData
            ));
    } catch (error) {
        console.log(`createShoes ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

const getShoes = async (req, res) => {
    const sizePage = parseInt(req.query.size, 10);
    const currentPage = parseInt(req.query.page, 10);
    const searchQuery = req.query.search || '';
    const brandId = req.query.brand || '';
    const categoryId = req.query.category || '';
    const status = req.query.status;

    try {
        const query = {name: {$regex: searchQuery, $options: 'i'}};
        if (status !== undefined) query.isActive = status;
        if (brandId) query.brand = brandId;
        if (categoryId) query.category = categoryId;
        const totalShoes = await Shoes.countDocuments(query);
        const totalPages = Math.ceil(totalShoes / sizePage);

        const shoes = await Shoes.find(query)
            .sort({createdAt: -1})
            .skip((currentPage - 1) * sizePage)
            .limit(sizePage)
            .select('_id thumbnail name createdAt isActive brand category')
            .populate('brand', 'name')
            .populate('category', 'name')
            .lean();

        const shoesIds = shoes.map(shoes => shoes._id);

        const classificationCounts = await Classification.aggregate([
            {$match: {shoes: {$in: shoesIds}}},
            {$group: {_id: "$shoes", count: {$sum: 1}}}
        ]);

        const shoesData = await Promise.all(shoes.map(async (shoe) => {
            const classificationCountData = classificationCounts.find(sc => sc._id.equals(shoe._id));
            const shoeData = {
                ...shoe,
                classificationCount: classificationCountData ? classificationCountData.count : 0
            }

            if (shoeData.thumbnail) shoeData.thumbnail = await getSingleImage(`${shoesDir}/${thumbnailDir}`, shoeData.thumbnail, maxAge);
            return shoeData;
        }));

        const hasNextPage = currentPage < totalPages;
        const hasPreviousPage = currentPage > 1;
        const nextPage = hasNextPage ? currentPage + 1 : null;
        const prevPage = hasPreviousPage ? currentPage - 1 : null;

        res.status(successResponse.code)
            .json(responseBody(successResponse.status,
                'Get Shoes Successful',
                shoesData,
                {
                    size: sizePage,
                    page: currentPage,
                    totalItems: totalShoes,
                    totalPages: totalPages,
                    hasNextPage: hasNextPage,
                    hasPreviousPage: hasPreviousPage,
                    nextPage: nextPage,
                    prevPage: prevPage
                }));
    } catch (error) {
        console.log(`getShoes ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

const getShoesById = async (req, res) => {
    try {
        const shoes = await Shoes.findById(req.params.id)
            .select('_id thumbnail name describe description createdAt isActive brand category')
            .populate('brand', 'name')
            .populate('category', 'name')
            .lean();
        if (!shoes) return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Shoes not found'));
        const shoesData = {...shoes};
        if (shoesData.thumbnail) shoesData.thumbnail = await getSingleImage(`${shoesDir}/${thumbnailDir}`, shoesData.thumbnail, maxAge);
        res.status(successResponse.code)
            .json(responseBody(successResponse.status,
                'Get Shoes Successful',
                shoesData
            ));
    } catch (error) {
        console.log(`getShoesById ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

const updateShoes = async (req, res) => {
    const user = req.user;
    if (user.authority !== 'superAdmin') return res.status(forbiddenResponse.code).send(responseBody(forbiddenResponse.status, 'Access denied, you are not super admin'));
    const {brand, category, describe, description, isActive} = req.body;
    let {name} = req.body;
    name = name.trim().replace(/\s+/g, ' ');
    try {
        const shoes = await Shoes.findById(req.params.id)
            .select('_id thumbnail name brand category describe description isActive');
        if (!shoes) return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Sản phẩm không tồn tại'));

        if (name && name !== '') {
            const existingShoes = await Shoes.findOne({
                name: new RegExp(`^${name}$`, 'i'),
                brand: shoes.brand, category: shoes.category
            });
            if (existingShoes && existingShoes.name !== shoes.name) return res.status(conflictResponse.code).json(responseBody(conflictResponse.status, 'Danh mục và thương hiệu đã tồn tại sản phẩm này'));
            shoes.name = name;
        }
        if (brand) {
            const existingShoes = await Shoes.findOne({
                name: shoes.name,
                brand: brand, category: shoes.category
            });
            if (existingShoes) return res.status(conflictResponse.code).json(responseBody(conflictResponse.status, 'Thương hiệu đã tồn tại sản phẩm này'));
            shoes.brand = brand;
        }
        if (category) {
            const existingShoes = await Shoes.findOne({
                name: shoes.name,
                brand: shoes.brand, category: category
            });
            if (existingShoes) return res.status(conflictResponse.code).json(responseBody(conflictResponse.status, 'Danh mục đã tồn tại sản phẩm này'));
            shoes.category = category
        }
        if (describe) shoes.describe = describe;
        if (description) shoes.description = description;
        if (typeof isActive !== 'undefined') shoes.isActive = isActive;
        if (req.file) {
            const newThumbnail = await putSingleImage(`${shoesDir}/${thumbnailDir}`, req.file);
            if (newThumbnail) {
                if (shoes.thumbnail) await deleteObjectCommand(`${shoesDir}/${thumbnailDir}`, shoes.thumbnail);
                shoes.thumbnail = newThumbnail;
            }
        }
        await shoes.save();

        const findShoes = await Shoes.findById(shoes._id)
            .select('_id thumbnail name createdAt isActive brand category')
            .populate('brand', 'name')
            .populate('category', 'name')
            .lean();
        if (!findShoes) return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Shoes not found'));
        const shoesData = {...findShoes}
        if (shoesData.thumbnail) shoesData.thumbnail = await getSingleImage(`${shoesDir}/${thumbnailDir}`, shoesData.thumbnail, maxAge);
        shoesData.classificationCount = await Classification.countDocuments({shoes: shoesData._id});
        res.status(successResponse.code)
            .json(responseBody(successResponse.status,
                'Update Shoes Successful',
                shoesData
            ));
    } catch (error) {
        console.log(`updateShoes ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

export default {
    createShoes,
    getShoes,
    getShoesById,
    updateShoes
}
