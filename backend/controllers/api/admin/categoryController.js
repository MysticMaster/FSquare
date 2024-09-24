import Category from '../../../models/categoryModel.js';
import {responseBody} from "../../../utils/generate.js";
import {
    badRequestResponse,
    notFoundResponse,
    conflictResponse,
    successResponse,
    createdResponse, internalServerErrorResponse, forbiddenResponse
} from "../../../utils/httpStatusCode.js";
import {getSingleImage, putSingleImage} from "../../../utils/media.js";
import {categoryDir, thumbnailDir} from "../../../utils/directory.js";
import Shoes from "../../../models/shoesModel.js";
import {deleteObjectCommand} from "../../../config/aswS3.js";

const maxAge = 86400;

const createCategory = async (req, res) => {
    const user = req.user;
    if (user.authority !== 'superAdmin') return res.status(forbiddenResponse.code).send(responseBody(forbiddenResponse.status, 'Access denied, you are not super admin', {}));
    const {name} = req.body;
    if (!name) return res.status(badRequestResponse.code).json(responseBody(badRequestResponse.status, 'Name is required', {}));

    try {
        const existingCategory = await Category.findOne({
            name: new RegExp(`^${name}$`, 'i')
        });
        if (existingCategory) return res.status(conflictResponse.code).json(responseBody(conflictResponse.status, 'Category name already exists'));

        const category = new Category({name: name});
        if (req.file) category.thumbnail = await putSingleImage(`${categoryDir}/${thumbnailDir}`, req.file);
        await category.save();
        res.status(createdResponse.code)
            .json(responseBody(createdResponse.status, 'A new category has been created', {category: category}));
    } catch (error) {
        console.log(`createCategory ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error', {}));
    }
}

const getCategories = async (req, res) => {
    const sizePage = parseInt(req.query.size, 10) || 5;
    const currentPage = parseInt(req.query.page, 10) || 1;
    const searchQuery = req.query.search || '';

    try {
        const query = {name: {$regex: searchQuery, $options: 'i'}};
        const totalCategories = await Category.countDocuments(query);
        const totalPages = Math.ceil(totalCategories / sizePage);

        const categories = await Category.find(query)
            .sort({createdAt: -1})
            .skip((currentPage - 1) * sizePage)
            .limit(sizePage)
            .select('_id thumbnail name createdAt isActive')
            .lean();

        const categoryIds = categories.map(category => category._id);

        const shoesCounts = await Shoes.aggregate([
            {$match: {category: {$in: categoryIds}}},
            {$group: {_id: "$category", count: {$sum: 1}}}
        ]);

        const categoriesData = await Promise.all(categories.map(async (category) => {
            const shoesCountData = shoesCounts.find(sc => sc._id.equals(category._id));
            const categoryData = {
                ...category,
                shoesCount: shoesCountData ? shoesCountData.count : 0
            };

            if (categoryData.thumbnail) categoryData.thumbnail = await getSingleImage(`${categoryDir}/${thumbnailDir}`, categoryData.thumbnail, maxAge);
            return categoryData;
        }));

        res.status(successResponse.code)
            .json(responseBody(successResponse.status, 'Get Categories Successful', {
                categories: categoriesData,
                currentPage: currentPage,
                totalPages: totalPages
            }));
    } catch (error) {
        console.log(`getCategories ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error', {}));
    }
};

const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)
            .select('_id thumbnail name createdAt isActive').lean();

        if (!category) return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Category not found', {}));
        const categoryData = {...category}
        if (categoryData.thumbnail) categoryData.thumbnail = await getSingleImage(`${categoryDir}/${thumbnailDir}`, categoryData.thumbnail, maxAge);
        res.status(successResponse.code)
            .json(responseBody(successResponse.status, 'Get Category Successful', {category: categoryData}));
    } catch (error) {
        console.log(`getCategoryById ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error', {}));
    }
}

const updateCategory = async (req, res) => {
    const user = req.user;
    if (user.authority !== 'superAdmin') return res.status(forbiddenResponse.code).send(responseBody(forbiddenResponse.status, 'Access denied, you are not super admin', {}));
    const {name, isActive} = req.body;
    try {
        const category = await Category.findById(req.params.id)
            .select('_id thumbnail name isActive');
        if (!category) return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Category not found', {}));

        if (name && name !== '') {
            const existingCategory = await Category.findOne({
                name: new RegExp(`^${name}$`, 'i')
            });
            if (existingCategory && existingCategory.name !== category.name) return res.status(conflictResponse.code).json(responseBody(conflictResponse.status, 'Category name already exists'));
            category.name = name;
        }

        if (typeof isActive !== 'undefined') category.isActive = isActive;
        if (req.file) {
            const newThumbnail = await putSingleImage(`${categoryDir}/${thumbnailDir}`, req.file);
            if (newThumbnail) {
                if (category.thumbnail) await deleteObjectCommand(`${categoryDir}/${thumbnailDir}`, category.thumbnail);
                category.thumbnail = newThumbnail;
            }
        }
        await category.save();
        res.status(successResponse.code)
            .json(responseBody(successResponse.status, 'Update Category Successful', {category: category}));
    } catch (error) {
        console.log(`updateCategory ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error', {}));
    }
}

export default {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory
}
