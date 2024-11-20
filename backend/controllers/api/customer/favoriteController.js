import Favorite from "../../../models/favoriteModel.js";
import {
    successResponse, createdResponse,
    internalServerErrorResponse, notFoundResponse, badRequestResponse
} from "../../../utils/httpStatusCode.js";
import {responseBody} from "../../../utils/generate.js";
import Classification from "../../../models/classificationModel.js";
import ShoesReview from "../../../models/shoesReview.js";
import {getSingleImage} from "../../../utils/media.js";
import {shoesDir, thumbnailDir} from "../../../utils/directory.js";
import Statistical from "../../../models/statisticalModel.js";

const maxAge = 86400;

const createOrDeleteFavorite = async (req, res) => {
    const userId = req.user.id;
    const {shoes} = req.body;
    if (!shoes) return res.status(badRequestResponse.code)
        .json(responseBody(badRequestResponse.status, 'Shoes is required'));
    try {
        const existingFavorite = await Favorite.findOne({
            customer: userId,
            shoes: shoes,
        }).select('_id').lean();
        if (existingFavorite) {
            await Favorite.findByIdAndDelete(existingFavorite._id);
            return res.status(successResponse.code)
                .json(responseBody(successResponse.status,
                    'Removed favorite this shoe',
                    existingFavorite._id));
        }
        const favorite = await Favorite.create({
            customer: userId,
            shoes: shoes
        });
        res.status(createdResponse.code)
            .json(responseBody(createdResponse.status,
                'Added shoes to favorites',
                favorite
            ));
    } catch (error) {
        console.log(`createFavorite ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

const getFavorites = async (req, res) => {
    const userId = req.user.id;
    try {
        const favorites = await Favorite.find({customer: userId})
            .sort({createdAt: -1})
            .select('_id shoes')
            .populate({
                path: 'shoes',
                select: '_id name thumbnail',
            })
            .lean();

        const shoesIds = favorites.map(fav => fav.shoes._id);

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

        const favoriteData = await Promise.all(favorites.map(async (fav) => {
            const shoe = fav.shoes;

            const priceRange = priceRanges.find(c => c._id.equals(shoe._id)) || {minPrice: 0, maxPrice: 0};
            const reviewInfo = reviewData.find(r => r._id.equals(shoe._id)) || {avgRating: 0, reviewCount: 0};
            const statisticalInfo = statisticalData.find(sd => sd.shoes.equals(shoe._id));
            const shoesData = {
                _id: fav._id,
                shoesId: shoe._id,
                name: shoe.name,
                minPrice: priceRange.minPrice,
                maxPrice: priceRange.maxPrice,
                avgRating: reviewInfo.avgRating,
                reviewCount: reviewInfo.reviewCount,
                sales: statisticalInfo ? statisticalInfo.sales : 0
            };

            if (shoe.thumbnail) shoesData.thumbnail = await getSingleImage(`${shoesDir}/${thumbnailDir}`, shoe.thumbnail, maxAge);
            return shoesData;
        }));

        res.status(successResponse.code)
            .json(responseBody(successResponse.status,
                'Get Favorites Successful',
                favoriteData
            ));
    } catch (error) {
        console.log(`getFavorites ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
};

const deleteFavorite = async (req, res) => {
    try {
        const favoriteId = req.params.id;
        const deletedFavorite = await Favorite.findByIdAndDelete(favoriteId);

        if (!deletedFavorite) return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Favorite not found'));
        res.status(successResponse.code)
            .json(responseBody(successResponse.status, 'Favorite deleted successfully', favoriteId));
    } catch (error) {
        console.log(`deleteFavorite ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
};

export default {
    createOrDeleteFavorite,
    getFavorites,
    deleteFavorite
}

