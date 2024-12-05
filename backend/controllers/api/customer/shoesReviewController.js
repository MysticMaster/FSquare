import {
    successResponse, createdResponse,
    internalServerErrorResponse, notFoundResponse, badRequestResponse, forbiddenResponse
} from "../../../utils/httpStatusCode.js";
import {responseBody} from "../../../utils/generate.js";
import Shoes from "../../../models/shoesModel.js";
import Order from "../../../models/orderModel.js";
import ShoesReview from "../../../models/shoesReviewModel.js";
import {getFiles, getSingleImage, putFiles} from "../../../utils/media.js";
import {avatarDir, customerDir, imageDir, shoesReviewDir, videoDir} from "../../../utils/directory.js";

const maxAge = 86400;

const createShoesReview = async (req, res) => {
    const userId = req.user.id;
    const {order, rating, content, images, videos} = req.body;

    // order là _id của đơn hàng đánh giá
    // rating là rating
    // content là nội dung đánh giá

    if (!order || !rating || !content) {
        return res.status(badRequestResponse.code)
            .json(responseBody(badRequestResponse.status, 'All fields are required'));
    }

    try {
        const orderData = await Order.findById(order).lean();
        if (!orderData) {
            return res.status(notFoundResponse.code)
                .json(responseBody(notFoundResponse.status, 'Order not found'));
        }

        if (orderData.customer.toString() !== userId) {
            return res.status(forbiddenResponse.code)
                .json(responseBody(forbiddenResponse.status, 'You are not authorized to review this order'));
        }
        const shoes = orderData.orderItems.map(item => item.shoes);

        const shoesData = await Shoes.find({_id: {$in: shoes}}).lean();
        if (shoesData.length === 0) {
            return res.status(notFoundResponse.code)
                .json(responseBody(notFoundResponse.status, 'Some shoes not found'));
        }

        const newReview = new ShoesReview({
            shoes: shoes,
            customer: userId,
            order: order,
            rating: rating,
            content: content,
            images: images || [],
            videos: videos || [],
        });

        if (req.files && req.files.length > 0) {
            const {images, videos} = await putFiles(shoesReviewDir, req.files);
            newReview.images = images;
            newReview.videos = videos;
        }

        await newReview.save();

        res.status(createdResponse.code)
            .json(responseBody(createdResponse.status, 'Review created successfully', newReview));
    } catch (error) {
        console.log(`createShoesReview ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
};

const getReviewByShoesId = async (req, res) => {
    const shoesId = req.params.id;
    if (!shoesId) {
        return res.status(badRequestResponse.code)
            .json(responseBody(badRequestResponse.status, 'ShoesId is required'));
    }
    try {
        const reviews = await ShoesReview.find({shoes: {$in: [shoesId]}})
            .select('_id customer rating content images videos feedback createdAt')
            .populate('customer', 'firstName lastName avatar')
            .sort({createdAt: -1})
            .lean();

        const reviewsData = await Promise.all(reviews.map(async (review) => {
            const reviewData = {
                ...review
            }
            if (reviewData.customer.avatar) reviewData.customer.avatar = await getSingleImage(`${customerDir}/${avatarDir}`, reviewData.customer.avatar, maxAge);
            if (reviewData.images) reviewData.images = await getFiles(`${shoesReviewDir}/${imageDir}`, reviewData.images, maxAge);
            if (reviewData.videos) reviewData.videos = await getFiles(`${shoesReviewDir}/${videoDir}`, reviewData.videos, maxAge);
            return reviewData;
        }));
        res.status(successResponse.code)
            .json(responseBody(successResponse.status,
                'Get Review Successful',
                reviewsData
            ));
    } catch (error) {
        console.log(`getReviewByShoesId ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

export default {
    createShoesReview,
    getReviewByShoesId
}
