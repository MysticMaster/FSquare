import Statistical from "../../../models/statisticalModel.js";
import {responseBody} from "../../../utils/generate.js";
import {
    successResponse,
    internalServerErrorResponse
} from "../../../utils/httpStatusCode.js";
import {getSingleImage} from "../../../utils/media.js";
import {shoesDir, thumbnailDir} from "../../../utils/directory.js";

const maxAge = 86400;

const getTop5 = async (req, res) => {
    try {
        const statistical = await Statistical.aggregate([
            {
                $group: {
                    _id: "$shoes",
                    totalSales: { $sum: "$sales" },
                    totalRevenue: { $sum: "$revenue" }
                }
            },
            {
                $sort: { totalSales: -1, totalRevenue: -1 }
            },
            {
                $limit: 5
            },
            {
                $lookup: {
                    from: "shoes",
                    localField: "_id",
                    foreignField: "_id",
                    as: "shoesInfo"
                }
            },
            {
                $unwind: "$shoesInfo"
            },
            {
                $project: {
                    _id: 0,
                    shoesId: "$_id",
                    name: "$shoesInfo.name",
                    thumbnail: "$shoesInfo.thumbnail",
                    totalSales: 1,
                    totalRevenue: 1
                }
            }
        ]);

        const statisticalData = await Promise.all(statistical.map(async sta =>{
            const staData = {
                _id: sta.shoesId,
                name: sta.name,
                totalSales: sta.totalSales,
                totalRevenue: sta.totalRevenue,
            }
            if(sta.thumbnail) staData.thumbnail = await getSingleImage(`${shoesDir}/${thumbnailDir}`, sta.thumbnail, maxAge);
            return staData
        }))

        res.status(successResponse.code)
            .json(responseBody(successResponse.status, 'Get Top 5 Best Seller Successful', statisticalData));
    } catch (error) {
        console.log(`getTop5 Error: ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
};


export default {getTop5}
