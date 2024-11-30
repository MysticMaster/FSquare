import Shoes from "../../../models/shoesModel.js";
import {responseBody} from "../../../utils/generate.js";
import {
    successResponse,
    internalServerErrorResponse, notFoundResponse
} from "../../../utils/httpStatusCode.js";
import {getSingleImage} from "../../../utils/media.js";
import {shoesDir, thumbnailDir} from "../../../utils/directory.js";
import Classification from "../../../models/classificationModel.js";
import ShoesReview from "../../../models/shoesReview.js";
import Favorite from "../../../models/favoriteModel.js";
import Statistical from "../../../models/statisticalModel.js";

const maxAge = 86400;

const getShoes = async (req, res) => {
    const sizePage = parseInt(req.query.size, 10) || 6;
    const currentPage = parseInt(req.query.page, 10) || 1;
    const searchQuery = req.query.search || '';
    const brandId = req.query.brand || '';
    const categoryId = req.query.category || '';
    const customerId = req.user ? req.user.id : null; // Kiểm tra nếu `req.user` tồn tại

    try {
        const query = {
            isActive: true,
            name: {$regex: searchQuery, $options: 'i'}
        };
        if (brandId) query.brand = brandId;
        if (categoryId) query.category = categoryId;

        const totalShoes = await Shoes.countDocuments(query);
        const totalPages = Math.ceil(totalShoes / sizePage);

        const shoes = await Shoes.find(query)
            .sort({createdAt: -1})
            .skip((currentPage - 1) * sizePage)
            .limit(sizePage)
            .select('_id thumbnail name')
            .lean();

        const shoesIds = shoes.map(shoe => shoe._id);

        const statisticalData = await Statistical.find({shoes: {$in: shoesIds}})
            .select('shoes sales')
            .lean();

        const priceRanges = await Classification.aggregate([
            {$match: {shoes: {$in: shoesIds}, isActive: true}},
            {
                $group: {
                    _id: "$shoes",
                    minPrice: {$min: "$price"},
                    maxPrice: {$max: "$price"}
                }
            }
        ]);

        const reviewData = await ShoesReview.aggregate([
            {$match: {shoes: {$in: shoesIds}, isActive: true}},
            {
                $group: {
                    _id: "$shoes",
                    avgRating: {$avg: "$rating"},
                    reviewCount: {$sum: 1}
                }
            }
        ]);

        // Nếu `customerId` tồn tại, thực hiện các thao tác liên quan đến yêu thích
        let favoriteShoesIds = [];
        if (customerId) {
            const favoriteData = await Favorite.find({customer: customerId, shoes: {$in: shoesIds}})
                .select('shoes')
                .lean();

            favoriteShoesIds = favoriteData.map(fav => fav.shoes.toString());
        }

        const shoesData = await Promise.all(shoes.map(async (shoe) => {
            const priceRange = priceRanges.find(pr => pr._id.equals(shoe._id));
            const reviewInfo = reviewData.find(rd => rd._id.equals(shoe._id));
            const statisticalInfo = statisticalData.find(sd => sd.shoes.equals(shoe._id));
            const shoeData = {
                _id: shoe._id,
                name: shoe.name,
                minPrice: priceRange ? priceRange.minPrice : 0,
                maxPrice: priceRange ? priceRange.maxPrice : 0,
                rating: reviewInfo ? reviewInfo.avgRating.toFixed(1) : 0,
                reviewCount: reviewInfo ? reviewInfo.reviewCount : 0,
                sales: statisticalInfo ? statisticalInfo.sales : 0
            };
            if (customerId) shoeData.isFavorite = customerId ? favoriteShoesIds.includes(shoe._id.toString()) : false

            if (shoe.thumbnail) {
                shoeData.thumbnail = await getSingleImage(`${shoesDir}/${thumbnailDir}`, shoe.thumbnail, maxAge);
            }

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
    const customerId = req.user ? req.user.id : null;

    try {
        const shoes = await Shoes.findOne({
            _id: req.params.id,
            isActive: true
        })
            .select('_id thumbnail brand category name describe description')
            .populate('brand', 'name')
            .populate('category', 'name')
            .lean();

        if (!shoes) {
            return res.status(notFoundResponse.code)
                .json(responseBody(notFoundResponse.status, 'Shoes not found'));
        }

        const priceRange = await Classification.aggregate([
            {$match: {shoes: shoes._id, isActive: true}},
            {
                $group: {
                    _id: "$shoes",
                    minPrice: {$min: "$price"},
                    maxPrice: {$max: "$price"}
                }
            }
        ]);

        const reviewData = await ShoesReview.aggregate([
            {$match: {shoes: {$in: [shoes._id]}, isActive: true}},
            {
                $group: {
                    _id: "$shoes",
                    avgRating: {$avg: "$rating"},
                    reviewCount: {$sum: 1}
                }
            }
        ]);

        const classificationCounts = await Classification.countDocuments({shoes: shoes._id})
        const salesCounts = await Statistical.countDocuments({shoes: shoes._id})

        const shoeData = {
            _id: shoes._id,
            name: shoes.name,
            brand: shoes.brand.name,
            category: shoes.category.name,
            describe: shoes.describe,
            description: shoes.description,
            classificationCount: classificationCounts,
            sales: salesCounts,
            minPrice: priceRange.length > 0 ? priceRange[0].minPrice : 0,
            maxPrice: priceRange.length > 0 ? priceRange[0].maxPrice : 0,
            rating: reviewData.length > 0 ? reviewData[0].avgRating.toFixed(1) : 0, // Kiểm tra reviewData
            reviewCount: reviewData.length > 0 ? reviewData[0].reviewCount : 0,   // Kiểm tra reviewData
        };

        if (customerId) shoeData.isFavorite = !!(await Favorite.exists({customer: customerId, shoes: shoes._id}));

        if (shoes.thumbnail) {
            shoeData.thumbnail = await getSingleImage(`${shoesDir}/${thumbnailDir}`, shoes.thumbnail, maxAge);
        }

        res.status(successResponse.code)
            .json(responseBody(successResponse.status, 'Get Shoes by ID Successful', shoeData));
    } catch (error) {
        console.log(`getShoesById ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
};

export default {
    getShoes,
    getShoesById
}
