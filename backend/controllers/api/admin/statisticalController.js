import Statistical from "../../../models/statisticalModel.js";
import {responseBody} from "../../../utils/generate.js";
import {
    successResponse,
    internalServerErrorResponse, badRequestResponse
} from "../../../utils/httpStatusCode.js";
import {getSingleImage} from "../../../utils/media.js";
import {shoesDir, thumbnailDir} from "../../../utils/directory.js";
import Order from "../../../models/orderModel.js";

import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek.js';
import advancedFormat from 'dayjs/plugin/advancedFormat.js';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(isoWeek);
dayjs.extend(advancedFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(utc);
dayjs.extend(timezone);

const maxAge = 86400;

const getTop5 = async (req, res) => {
    try {
        const statistical = await Statistical.aggregate([
            {
                $group: {
                    _id: "$shoes",
                    totalSales: {$sum: "$sales"},
                    totalRevenue: {$sum: "$revenue"}
                }
            },
            {
                $sort: {totalSales: -1, totalRevenue: -1}
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

        const statisticalData = await Promise.all(statistical.map(async sta => {
            const staData = {
                _id: sta.shoesId,
                name: sta.name,
                totalSales: sta.totalSales,
                totalRevenue: sta.totalRevenue,
            }
            if (sta.thumbnail) staData.thumbnail = await getSingleImage(`${shoesDir}/${thumbnailDir}`, sta.thumbnail, maxAge);
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

const getStatisticalByTimePeriod = async (req, res) => {
    try {
        const {start: customStartDate, end: customEndDate} = req.query;

        let start, end;
        if (customStartDate && customEndDate) {

            const isValidDateFormat = (date) => {
                const regex = /^\d{2}-\d{2}-\d{4}$/;
                return regex.test(date);
            };

            const formattedStartDate = isValidDateFormat(customStartDate) ? customStartDate.split('-').reverse().join('-') : customStartDate
            const formattedEndDate = isValidDateFormat(customEndDate) ?  customEndDate.split('-').reverse().join('-') : customEndDate


            start = dayjs(formattedStartDate, 'MM-DD-YYYY').startOf('day').tz('Asia/Ho_Chi_Minh'); // Giữ múi giờ Ho_Chi_Minh
            end = dayjs(formattedEndDate, 'MM-DD-YYYY').endOf('day').tz('Asia/Ho_Chi_Minh'); // Giữ múi giờ Ho_Chi_Minh

            if (!start.isValid() || !end.isValid()) {
                return res.status(badRequestResponse.code).json(responseBody(
                    badRequestResponse.status,
                    'Invalid date format. Use MM-DD-YYYY.'
                ));
            }

            if (end.isBefore(start)) {
                return res.status(badRequestResponse.code).json(responseBody(
                    badRequestResponse.status,
                    'End date must be after or equal to start date.'
                ));
            }
        } else {
            const now = dayjs().tz('Asia/Ho_Chi_Minh');
            start = now.startOf('month');
            end = now.endOf('day');
        }

        const aggregatePipeline = [
            {
                $match: {
                    createdAt: {
                        $gte: start.toDate(),
                        $lte: end.toDate(),
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalSales: {$sum: '$sales'},
                    totalRevenue: {$sum: '$revenue'},
                },
            },
        ];

        const statisticalData = await Statistical.aggregate(aggregatePipeline);

        const salesData = statisticalData[0] || {totalSales: 0, totalRevenue: 0};

        const confirmedOrdersCount = await Order.countDocuments({
            status: 'confirmed',
            'statusTimestamps.confirmed': {
                $gte: start.toDate(),
                $lte: end.toDate(),
            },
        });

        const result = {
            start: start.format('DD-MM-YYYY'),
            end: end.format('DD-MM-YYYY'),
            totalSales: salesData.totalSales,
            totalRevenue: salesData.totalRevenue,
            totalOrder: confirmedOrdersCount,
        };

        res.status(successResponse.code).json(responseBody(
            successResponse.status,
            `Get Statistical Successful`,
            result
        ));
    } catch (error) {
        console.error(`getStatistical Error: ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
};

const getStatisticalByYear = async (req, res) => {
    try {
        const {year: customYear} = req.query;

        const year = customYear ? parseInt(customYear) : dayjs().year();

        const months = [
            'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
            'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
        ];

        const results = [];

        for (let month = 0; month < 12; month++) {
            const startOfMonth = dayjs().year(year).month(month).startOf('month');
            const endOfMonth = dayjs().year(year).month(month).endOf('month');

            const aggregatePipeline = [
                {
                    $match: {
                        createdAt: {
                            $gte: startOfMonth.toDate(),
                            $lte: endOfMonth.toDate(),
                        },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalSales: {$sum: '$sales'},
                        totalRevenue: {$sum: '$revenue'},
                    },
                },
            ];

            const statisticalData = await Statistical.aggregate(aggregatePipeline);

            const data = statisticalData[0] || {totalSales: 0, totalRevenue: 0};

            results.push({
                month: months[month],
                totalSales: data.totalSales,
                totalRevenue: data.totalRevenue,
            });
        }

        res.status(successResponse.code).json(responseBody(
            successResponse.status,
            `Get Statistical for ${year} Successful`,
            results
        ));
    } catch (error) {
        console.error(`getStatisticalByYear Error: ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
};


export default {getTop5, getStatisticalByTimePeriod, getStatisticalByYear}
