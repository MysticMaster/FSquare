import Brand from "../../../models/brandModel.js";
import {responseBody} from "../../../utils/generate.js";
import {
    successResponse,
    internalServerErrorResponse
} from "../../../utils/httpStatusCode.js";
import {getSingleImage} from "../../../utils/media.js";
import {brandDir, thumbnailDir} from "../../../utils/directory.js";

const maxAge = 86400;

const getBrands = async (req, res) => {
    const sizePage = parseInt(req.query.size, 10) || 5;
    const currentPage = parseInt(req.query.page, 10) || 1;
    const searchQuery = req.query.search || '';

    try {
        const query = {
            isActive: true,
            name: {$regex: searchQuery, $options: 'i'}
        };
        const totalBrands = await Brand.countDocuments(query);
        const totalPages = Math.ceil(totalBrands / sizePage);

        const brands = await Brand.find(query)
            .sort({createdAt: -1})
            .skip((currentPage - 1) * sizePage)
            .limit(sizePage)
            .select('_id thumbnail name')
            .lean();

        const brandsData = await Promise.all(brands.map(async (brand) => {
            const brandData = {...brand};
            if (brandData.thumbnail) brandData.thumbnail = await getSingleImage(`${brandDir}/${thumbnailDir}`, brandData.thumbnail, maxAge);
            return brandData;
        }));

        res.status(successResponse.code)
            .json(responseBody(successResponse.status, 'Get Brands Successful', {
                brands: brandsData,
                currentPage: currentPage,
                totalPages: totalPages
            }));
    } catch (error) {
        console.log(`getBrands ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error', {}));
    }
};

export default {getBrands}
