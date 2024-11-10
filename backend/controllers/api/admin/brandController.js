import Brand from "../../../models/brandModel.js";
import {responseBody} from "../../../utils/generate.js";
import {
    badRequestResponse,
    notFoundResponse,
    conflictResponse,
    successResponse,
    createdResponse, internalServerErrorResponse, forbiddenResponse
} from "../../../utils/httpStatusCode.js";
import {getSingleImage, putSingleImage} from "../../../utils/media.js";
import {brandDir, thumbnailDir} from "../../../utils/directory.js";
import Shoes from "../../../models/shoesModel.js";
import {deleteObjectCommand} from "../../../config/aswS3.js";

const maxAge = 86400;

const createBrand = async (req, res) => {
    const user = req.user;
    if (user.authority !== 'superAdmin') return res.status(forbiddenResponse.code).send(responseBody(forbiddenResponse.status, 'Access denied, you are not super admin'));

    let {name} = req.body;
    if (!name) return res.status(badRequestResponse.code).json(responseBody(badRequestResponse.status, 'Name is required'));

    name = name.trim().replace(/\s+/g, ' ');

    try {
        const existingBrand = await Brand.findOne({
            name: new RegExp(`^${name}$`, 'i')
        });
        if (existingBrand) return res.status(conflictResponse.code).json(responseBody(conflictResponse.status, 'Brand name already exists'));

        const brand = new Brand({name: name});
        if (req.file) brand.thumbnail = await putSingleImage(`${brandDir}/${thumbnailDir}`, req.file);
        await brand.save();

        const brandData = await Brand.findById(brand._id)
            .select('_id thumbnail name createdAt isActive').lean();

        if (!brandData) return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Brand not found'));
        if (brandData.thumbnail) brandData.thumbnail = await getSingleImage(`${brandDir}/${thumbnailDir}`, brandData.thumbnail, maxAge);
        brandData.shoesCount = 0;
        res.status(createdResponse.code)
            .json(responseBody(createdResponse.status, 'A new brand has been created', brandData));
    } catch (error) {
        console.log(`createBrand ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

const getBrands = async (req, res) => {
    const sizePage = parseInt(req.query.size, 10);
    const currentPage = parseInt(req.query.page, 10);
    const searchQuery = req.query.search || '';
    const status = req.query.status;

    try {
        const query = {name: {$regex: searchQuery, $options: 'i'}};
        if (status !== undefined) query.isActive = status;
        const totalBrands = await Brand.countDocuments(query);
        const totalPages = Math.ceil(totalBrands / sizePage);

        const brands = await Brand.find(query)
            .sort({createdAt: -1})
            .skip((currentPage - 1) * sizePage)
            .limit(sizePage)
            .select('_id thumbnail name createdAt isActive')
            .lean();

        const brandIds = brands.map(brand => brand._id);

        const shoesCounts = await Shoes.aggregate([
            {$match: {brand: {$in: brandIds}}},
            {$group: {_id: "$brand", count: {$sum: 1}}}
        ]);

        const brandsData = await Promise.all(brands.map(async (brand) => {
            const shoesCountData = shoesCounts.find(sc => sc._id.equals(brand._id));
            const brandData = {
                ...brand,
                shoesCount: shoesCountData ? shoesCountData.count : 0
            };

            if (brandData.thumbnail) brandData.thumbnail = await getSingleImage(`${brandDir}/${thumbnailDir}`, brandData.thumbnail, maxAge);
            return brandData;
        }));

        const hasNextPage = currentPage < totalPages;
        const hasPreviousPage = currentPage > 1;
        const nextPage = hasNextPage ? currentPage + 1 : null;
        const prevPage = hasPreviousPage ? currentPage - 1 : null;

        res.status(successResponse.code)
            .json(responseBody(successResponse.status,
                'Get Brands Successful',
                brandsData,
                {
                    size: sizePage,
                    page: currentPage,
                    totalItems: totalBrands,
                    totalPages: totalPages,
                    hasNextPage: hasNextPage,
                    hasPreviousPage: hasPreviousPage,
                    nextPage: nextPage,
                    prevPage: prevPage
                }));
    } catch (error) {
        console.log(`getBrands ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
};

const getBrandById = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id)
            .select('_id thumbnail name createdAt isActive').lean();

        if (!brand) return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Brand not found'));
        const brandData = {...brand}
        if (brandData.thumbnail) brandData.thumbnail = await getSingleImage(`${brandDir}/${thumbnailDir}`, brandData.thumbnail, maxAge);
        res.status(successResponse.code)
            .json(responseBody(successResponse.status,
                'Get Brand Successful',
                brandData
            ));
    } catch (error) {
        console.log(`getBrandById ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

const updateBrand = async (req, res) => {
    const user = req.user;
    if (user.authority !== 'superAdmin') return res.status(forbiddenResponse.code).send(responseBody(forbiddenResponse.status, 'Access denied, you are not super admin'));
    const {isActive} = req.body;
    let {name} = req.body;
    name = name.trim().replace(/\s+/g, ' ');
    try {
        const brand = await Brand.findById(req.params.id)
            .select('_id thumbnail name isActive');
        if (!brand) return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Brand not found'));

        if (name && name !== '') {
            const existingBrand = await Brand.findOne({
                name: new RegExp(`^${name}$`, 'i')
            });
            if (existingBrand && existingBrand.name !== brand.name) return res.status(conflictResponse.code).json(responseBody(conflictResponse.status, 'Brand name already exists'));
            brand.name = name;
        }

        if (typeof isActive !== 'undefined') brand.isActive = isActive;
        if (req.file) {
            const newThumbnail = await putSingleImage(`${brandDir}/${thumbnailDir}`, req.file);
            if (newThumbnail) {
                if (brand.thumbnail) await deleteObjectCommand(`${brandDir}/${thumbnailDir}`, brand.thumbnail);
                brand.thumbnail = newThumbnail;
            }
        }

        await brand.save();

        const brandData = await Brand.findById(brand._id)
            .select('_id thumbnail name createdAt isActive').lean();

        if (!brandData) return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Brand not found'));
        if (brandData.thumbnail) brandData.thumbnail = await getSingleImage(`${brandDir}/${thumbnailDir}`, brandData.thumbnail, maxAge);

        const brandCountResult = await Shoes.aggregate([
            { $match: { brand: brandData._id } },
            { $group: { _id: "$brand", count: { $sum: 1 } } }
        ]);

        brandData.shoesCount = brandCountResult.length > 0 ? brandCountResult[0].count : 0;
        res.status(successResponse.code)
            .json(responseBody(successResponse.status,
                'Update Brand Successful',
                brandData
            ));
    } catch (error) {
        console.log(`updateBrand ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

export default {
    createBrand,
    getBrands,
    getBrandById,
    updateBrand
}
