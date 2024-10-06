import SearchHistory from "../../../models/searchHistoryModel.js";
import {responseBody} from "../../../utils/generate.js";
import {
    badRequestResponse,
    notFoundResponse,
    conflictResponse,
    successResponse,
    createdResponse, internalServerErrorResponse, forbiddenResponse, noContentResponse
} from "../../../utils/httpStatusCode.js";

const createHistory = async (req, res) => {
    const userId = req.user.id;
    const {keyword} = req.body;
    try {
        const existingHistory = await SearchHistory.findOne({
            customer: userId,
            keyword: keyword
        }).select('_id').lean();
        if (existingHistory) return res.status(noContentResponse.code)
            .json(responseBody(noContentResponse.status, ''));
        const history = await SearchHistory.create({
            customer: userId,
            keyword: keyword,
        });
        res.status(createdResponse.code)
            .json(responseBody(createdResponse.status,
                'History created successfully',
                history
            ));
    } catch (error) {
        console.log(`createHistory ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

const getHistories = async (req, res) => {
    const userId = req.user.id;
    try {
        const histories = await SearchHistory.find({customer: userId})
            .sort({createdAt: -1})
            .select('_id keyword').lean();
        res.status(successResponse.code)
            .json(responseBody(successResponse.status,
                'Get Histories Successfully',
                histories));
    } catch (error) {
        console.log(`getHistories ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

const deleteHistories = async (req, res) => {
    const userId = req.user.id;
    try {
        await SearchHistory.deleteMany({customer: userId});
        res.status(noContentResponse.code)
            .json(responseBody(noContentResponse.status, 'Histories deleted successfully'));
    } catch (error) {
        console.log(`deleteHistories ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

const deleteHistory = async (req, res) => {
    try {
        const history = await SearchHistory.findByIdAndDelete(req.params.id);
        if (!history) return res.status(notFoundResponse.code).json(responseBody(notFoundResponse.status, 'History not found'));
        res.status(successResponse.code)
            .json(responseBody(successResponse.status, 'History deleted successfully', history._id));
    } catch (error) {
        console.log(`deleteHistory ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

export default {
    createHistory,
    getHistories,
    deleteHistories,
    deleteHistory
}
