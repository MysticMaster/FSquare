import Bag from "../../../models/bagModel.js";
import {
    successResponse, createdResponse,
    internalServerErrorResponse, notFoundResponse, badRequestResponse
} from "../../../utils/httpStatusCode.js";
import {responseBody} from "../../../utils/generate.js";
import Size from "../../../models/sizeModel.js";
import {getSingleImage} from "../../../utils/media.js";
import {classificationDir, thumbnailDir} from "../../../utils/directory.js";

const maxAge = 86400;

const createBag = async (req, res) => {
    const userId = req.user.id;
    const {size, quantity} = req.body;
    if (!size || !quantity) return res.status(badRequestResponse.code)
        .json(responseBody(badRequestResponse.status, 'All fields are required'));
    try {
        const sizeData = await Size.findById(size).select('quantity').lean();

        if (!sizeData) return res.status(notFoundResponse.code)
            .json(responseBody(notFoundResponse.status, 'Size not found'));

        const existingBag = await Bag.findOne({
            customer: userId,
            size: size
        }).select('_id quantity');

        if (existingBag) {
            const newQuantity = existingBag.quantity + quantity;
            if (newQuantity > sizeData.quantity) return res.status(badRequestResponse.code)
                .json(responseBody(badRequestResponse.status, 'Quantity exceeds available size stock'));
            existingBag.quantity = newQuantity;
            await existingBag.save();

            return res.status(successResponse.code)
                .json(responseBody(successResponse.status, 'Bag updated successfully', existingBag));
        }

        if (quantity > sizeData.quantity) return res.status(badRequestResponse.code)
            .json(responseBody(badRequestResponse.status, 'Quantity exceeds available size stock'));

        const newBag = await Bag.create({
            customer: userId,
            size: size,
            quantity: quantity
        });

        res.status(createdResponse.code)
            .json(responseBody(createdResponse.status, 'Bag created successfully', newBag));
    } catch (error) {
        console.log(`createBag ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

const getBags = async (req, res) => {
    const userId = req.user.id;

    try {
        const bags = await Bag.find({customer: userId})
            .populate({
                path: 'size',
                select: '_id sizeNumber classification',
                populate: {
                    path: 'classification',
                    select: '_id shoes color price thumbnail',
                    populate: {
                        path: 'shoes',
                        select: '_id name',
                    }
                }
            })
            .lean();

        const bagsData = await Promise.all(bags.map(async (bag) => {
            const size = bag.size;
            const classification = size.classification;
            const shoes = classification.shoes;

            const bagData = {
                _id: bag._id,
                shoes: shoes.name,
                thumbnail: classification.thumbnail,
                color: classification.color,
                size: size.sizeNumber,
                quantity: bag.quantity,
                price: classification.price,
            };
            if (classification.thumbnail) bagData.thumbnail = await getSingleImage(`${classificationDir}/${thumbnailDir}`, classification.thumbnail, maxAge);
            return bagData;
        }));

        res.status(successResponse.code)
            .json(responseBody(successResponse.status, 'Get Bags Successful', bagsData));
    } catch (error) {
        console.log(`getBags ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
};

const updateBagQuantity = async (req, res) => {
    const {action} = req.body;

    if (!action) {
        return res.status(badRequestResponse.code)
            .json(responseBody(badRequestResponse.status, 'Action is required'));
    }

    try {
        const bag = await Bag.findById(req.params.id).populate({
            path: 'size',
            select: '_id sizeNumber classification',
            populate: {
                path: 'classification',
                select: '_id price'
            }
        });

        if (!bag) return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Bag not found'));
        const sizeData = await Size.findById(bag.size._id).select('quantity');
        if (!sizeData) return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Size not found'));

        if (action === "increase") {
            if (bag.quantity + 1 > sizeData.quantity) return res.status(badRequestResponse.code)
                .json(responseBody(badRequestResponse.status, 'Quantity exceeds available size stock'));
            bag.quantity += 1;

        } else if (action === "decrease") {
            bag.quantity -= 1;

            if (bag.quantity < 1) {
                await Bag.findByIdAndDelete(bag._id);
                return res.status(successResponse.code)
                    .json(responseBody(successResponse.status, 'Bag removed'));
            }
        } else {
            return res.status(badRequestResponse.code)
                .json(responseBody(badRequestResponse.status, 'Invalid action'));
        }

        await bag.save();
        const bagData = {
            _id: bag._id,
            quantity: bag.quantity,
            price: bag.size.classification.price,
        };

        res.status(successResponse.code)
            .json(responseBody(successResponse.status, 'Bag quantity updated', bagData));
    } catch (error) {
        console.log(`updateBagQuantity ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
};

const deleteBags = async (req, res) => {
    const userId = req.user._id;
    try {
        await Bag.deleteMany({customer: userId});
        res.status(successResponse.code)
            .json(responseBody(successResponse.status, 'Bags deleted successfully'));
    } catch (error) {
        console.log(`deleteBags ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
};

const deleteBagById = async (req, res) => {
    try {
        const bagId = req.params.id;
        const deleteBag = await Bag.findByIdAndDelete(bagId);
        if (!deleteBag) return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'Bag not found'));
        res.status(successResponse.code)
            .json(responseBody(successResponse.status, 'Bag deleted successfully',  bagId));
    } catch (error) {
        console.log(`deleteBag ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
};

export default {
    createBag,
    getBags,
    updateBagQuantity,
    deleteBags,
    deleteBagById
};

