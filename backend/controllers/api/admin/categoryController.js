import Category from '../../../models/categoryModel.js';
import {responseBody} from "../../../utils/generate.js";
import {
    badRequestResponse,
    conflictResponse,
    createdResponse,
    forbiddenResponse,
    internalServerErrorResponse,
    notFoundResponse,
    successResponse
} from "../../../utils/httpStatusCode.js";
import {getSingleImage, putSingleImage} from "../../../utils/media.js";
import {categoryDir, thumbnailDir} from "../../../utils/directory.js";
import Shoes from "../../../models/shoesModel.js";
import {deleteObjectCommand} from "../../../config/aswS3.js";

const maxAge = 86400;

const responseData = async (id, res) => {
    const category = await Category.findById(id)
        .select('_id thumbnail name createdAt isActive').lean();

    if (!category) return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Category not found'));
    if (category.thumbnail) category.thumbnail = await getSingleImage(`${categoryDir}/${thumbnailDir}`, category.thumbnail, maxAge);
    category.shoesCount = await Shoes.countDocuments({category: category._id})
    return category
}

const createCategory = async (req, res) => {
    const user = req.user;
    if (user.authority !== 'superAdmin') return res.status(forbiddenResponse.code).send(responseBody(forbiddenResponse.status, 'Access denied, you are not super admin'));
    let {name} = req.body;
    if (!name) return res.status(badRequestResponse.code).json(responseBody(badRequestResponse.status, 'Name is required'));
    name = name.trim().replace(/\s+/g, ' ');
    try {
        const existingCategory = await Category.findOne({
            name: new RegExp(`^${name}$`, 'i')
        });
        if (existingCategory) return res.status(conflictResponse.code).json(responseBody(conflictResponse.status, 'Category name already exists'));

        const category = new Category({name: name});
        if (req.file) category.thumbnail = await putSingleImage(`${categoryDir}/${thumbnailDir}`, req.file);
        await category.save();

        const categoryData = await responseData(category._id, res);
        res.status(createdResponse.code)
            .json(responseBody(createdResponse.status,
                'A new category has been created',
                categoryData
            ));
    } catch (error) {
        console.log(`createCategory ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

const getCategories = async (req, res) => {
    const sizePage = parseInt(req.query.size, 10);
    const currentPage = parseInt(req.query.page, 10);
    const searchQuery = req.query.search || '';
    const status = req.query.status;

    try {
        const query = {name: {$regex: searchQuery, $options: 'i'}};
        if (status !== undefined) query.isActive = status;
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

        const hasNextPage = currentPage < totalPages;
        const hasPreviousPage = currentPage > 1;
        const nextPage = hasNextPage ? currentPage + 1 : null;
        const prevPage = hasPreviousPage ? currentPage - 1 : null;

        res.status(successResponse.code)
            .json(responseBody(successResponse.status,
                'Get Categories Successful',
                categoriesData,
                {
                    size: sizePage,
                    page: currentPage,
                    totalItems: totalCategories,
                    totalPages: totalPages,
                    hasNextPage: hasNextPage,
                    hasPreviousPage: hasPreviousPage,
                    nextPage: nextPage,
                    prevPage: prevPage
                }));
    } catch (error) {
        console.log(`getCategories ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
};

const getCategoryById = async (req, res) => {
    try {
        const categoryData = await responseData(req.params.id, res);
        res.status(successResponse.code)
            .json(responseBody(successResponse.status,
                'Get Category Successful',
                categoryData
            ));
    } catch (error) {
        console.log(`getCategoryById ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

const updateCategory = async (req, res) => {
    const user = req.user;
    if (user.authority !== 'superAdmin') return res.status(forbiddenResponse.code).send(responseBody(forbiddenResponse.status, 'Access denied, you are not super admin'));
    const {isActive} = req.body;
    let {name} = req.body;
    name = name.trim().replace(/\s+/g, ' ');
    try {
        const category = await Category.findById(req.params.id)
            .select('_id thumbnail name isActive');
        if (!category) return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Category not found'));

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

        const categoryData = await responseData(category._id, res);
        res.status(successResponse.code)
            .json(responseBody(successResponse.status,
                'Update Category Successful',
                categoryData
            ));
    } catch (error) {
        console.log(`updateCategory ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

export default {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory
}
