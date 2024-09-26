import Category from "../../../models/categoryModel.js";
import {responseBody} from "../../../utils/generate.js";
import {
    successResponse,
    internalServerErrorResponse
} from "../../../utils/httpStatusCode.js";
import {getSingleImage} from "../../../utils/media.js";
import {categoryDir, thumbnailDir} from "../../../utils/directory.js";

const maxAge = 86400;

const getCategories = async (req, res) => {
    const sizePage = parseInt(req.query.size, 10) || 5;
    const currentPage = parseInt(req.query.page, 10) || 1;
    const searchQuery = req.query.search || '';

    try {
        const query = {
            isActive: true,
            name: {$regex: searchQuery, $options: 'i'}
        };
        const totalCategories = await Category.countDocuments(query);
        const totalPages = Math.ceil(totalCategories / sizePage);

        const categories = await Category.find(query)
            .sort({createdAt: -1})
            .skip((currentPage - 1) * sizePage)
            .limit(sizePage)
            .select('_id thumbnail name')
            .lean();

        const categoriesData = await Promise.all(categories.map(async (brand) => {
            const category = {...brand};
            if (category.thumbnail) category.thumbnail = await getSingleImage(`${categoryDir}/${thumbnailDir}`, category.thumbnail, maxAge);
            return category;
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

export default {getCategories}
