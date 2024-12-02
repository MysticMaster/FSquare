import express from 'express';
import brandController from "../../controllers/api/customer/brandController.js";
import categoryController from "../../controllers/api/customer/categoryController.js";
import shoesController from "../../controllers/api/customer/shoesController.js";
import classificationController from "../../controllers/api/customer/classificationController.js";
import sizeController from "../../controllers/api/customer/sizeController.js";
import statisticalController from "../../controllers/api/customer/statisticalController.js";

const router = express.Router();

/**
 * @openapi
 * /v2/brands:
 *   get:
 *     summary: V2 - Retrieve a paginated list of active brands v2
 *     description: Fetch a list of brands that are active, with pagination, searching, and sorting functionality.
 *     parameters:
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           example: 5
 *         description: The number of brands to return per page. Default is 5.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The page number to retrieve. Default is 1.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: Nike
 *         description: A search query to filter brands by name (case-insensitive).
 *     responses:
 *       200:
 *         description: A paginated list of brands with metadata
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Get Brands Successful
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "6123456789abcdef12345678"
 *                       name:
 *                         type: string
 *                         example: "Nike"
 *                       thumbnail:
 *                         type: string
 *                         example: "https://example.com/images/nike-thumbnail.jpg"
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     size:
 *                       type: integer
 *                       example: 5
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     totalItems:
 *                       type: integer
 *                       example: 100
 *                     totalPages:
 *                       type: integer
 *                       example: 20
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *                     hasPreviousPage:
 *                       type: boolean
 *                       example: false
 *                     nextPage:
 *                       type: integer
 *                       example: 2
 *                     prevPage:
 *                       type: integer
 *                       example: null
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Server error
 */
router.get('/brands', brandController.getBrands);

/**
 * @openapi
 * /v2/categories:
 *   get:
 *     summary: V2 - Retrieve a list of active categories
 *     description: Returns a paginated list of active categories with optional search, pagination, and sorting. The categories contain thumbnail, name, and ID.
 *     parameters:
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 5
 *         description: The number of categories to return per page.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The current page of the paginated result.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter categories by name.
 *     responses:
 *       200:
 *         description: A paginated list of categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Get Categories Successful
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 6123456789abcdef01234567
 *                       thumbnail:
 *                         type: string
 *                         example: "https://example.com/images/category_thumbnail.jpg"
 *                       name:
 *                         type: string
 *                         example: "Shoes"
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     size:
 *                       type: integer
 *                       example: 5
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     totalItems:
 *                       type: integer
 *                       example: 25
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *                     hasPreviousPage:
 *                       type: boolean
 *                       example: false
 *                     nextPage:
 *                       type: integer
 *                       example: 2
 *                     prevPage:
 *                       type: integer
 *                       example: null
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Server error
 */
router.get('/categories', categoryController.getCategories);

/**
 * @openapi
 * /v2/shoes:
 *   get:
 *     summary: V2 - Retrieve a paginated list of shoes
 *     description: Retrieve a list of active shoes with optional search, pagination, brand, and category filters. The shoes data includes prices, reviews, and favorite status.
 *     parameters:
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 6
 *         description: The number of shoes to return per page.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The current page of the paginated result.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter shoes by name.
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Filter shoes by brand ID.
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter shoes by category ID.
 *     responses:
 *       200:
 *         description: A paginated list of shoes with prices, reviews, and favorite status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Get Shoes Successful
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 6123456789abcdef01234567
 *                       name:
 *                         type: string
 *                         example: "Air Jordan 1"
 *                       thumbnail:
 *                         type: string
 *                         example: "https://example.com/images/shoes_thumbnail.jpg"
 *                       minPrice:
 *                         type: number
 *                         example: 100
 *                       maxPrice:
 *                         type: number
 *                         example: 200
 *                       rating:
 *                         type: number
 *                         format: float
 *                         example: 4.5
 *                       reviewCount:
 *                         type: integer
 *                         example: 50
 *                       sales:
 *                         type: integer
 *                         example: 100
 *                       isFavorite:
 *                         type: boolean
 *                         example: true
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     size:
 *                       type: integer
 *                       example: 6
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     totalItems:
 *                       type: integer
 *                       example: 100
 *                     totalPages:
 *                       type: integer
 *                       example: 17
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *                     hasPreviousPage:
 *                       type: boolean
 *                       example: false
 *                     nextPage:
 *                       type: integer
 *                       example: 2
 *                     prevPage:
 *                       type: integer
 *                       example: null
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Server error
 */
router.get('/shoes', shoesController.getShoes);

/**
 * @openapi
 * /v2/shoes/{id}:
 *   get:
 *     summary: V2 - Lấy thông tin chi tiết một đôi giày theo ID
 *     description: Lấy thông tin chi tiết về một đôi giày theo ID, bao gồm thương hiệu, loại sản phẩm, mô tả, mức giá và đánh giá.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của đôi giày cần lấy thông tin.
 *     responses:
 *       200:
 *         description: Một đối tượng chi tiết về đôi giày.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Get Shoes by ID Successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6123456789abcdef01234567
 *                     name:
 *                       type: string
 *                       example: "Air Jordan 1"
 *                     brand:
 *                       type: string
 *                       example: "Nike"
 *                     category:
 *                       type: string
 *                       example: "Sneakers"
 *                     describe:
 *                       type: string
 *                       example: "Mô tả về đôi giày cho mục đích marketing."
 *                     description:
 *                       type: string
 *                       example: "Đây là mô tả chi tiết về đôi giày, bao gồm chất liệu và các tính năng."
 *                     thumbnail:
 *                       type: string
 *                       example: "https://example.com/images/shoes_thumbnail.jpg"
 *                     rating:
 *                       type: number
 *                       example: 4.5
 *                     reviewCount:
 *                       type: integer
 *                       example: 12
 *                     isFavorite:
 *                       type: boolean
 *                       example: true
 *                     classificationCount:
 *                       type: integer
 *                       example: 3
 *                     sales:
 *                       type: integer
 *                       example: 60
 *                     minPrice:
 *                       type: number
 *                       example: 100.0
 *                     maxPrice:
 *                       type: number
 *                       example: 150.0
 *       404:
 *         description: Không tìm thấy đôi giày
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Shoes not found
 *       500:
 *         description: Lỗi máy chủ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Server error
 */
router.get('/shoes/:id', shoesController.getShoesById);

/**
 * @openapi
 * /v2/classifications/shoes/{id}:
 *   get:
 *     summary: V2 - Retrieve classifications for a specific shoe by its ID
 *     description: Fetch a list of classifications (like color, images, etc.) for a specific shoe based on its ID. Only active classifications are returned.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the shoe for which classifications are to be retrieved.
 *     responses:
 *       200:
 *         description: A list of classifications for the shoe.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Get Classification Successful
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 6123456789abcdef01234567
 *                       thumbnail:
 *                         type: string
 *                         example: "https://example.com/images/classification_thumbnail.jpg"
 *                       color:
 *                         type: string
 *                         example: red
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Server error
 */
router.get('/classifications/shoes/:id', classificationController.getClassificationsByIdShoes);

/**
 * @openapi
 * /v2/classifications/{id}:
 *   get:
 *     summary: V2 - Retrieve a specific classification by its ID
 *     description: Fetch detailed information about a specific classification using its ID, including images, videos, color, country, and price.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the classification to retrieve.
 *     responses:
 *       200:
 *         description: A detailed object of the classification.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Get Classification Successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6123456789abcdef01234567
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "https://example.com/images/classification_image.jpg"
 *                     videos:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "https://example.com/videos/classification_video.mp4"
 *                     color:
 *                       type: string
 *                       example: "Red"
 *                     country:
 *                       type: string
 *                       example: "USA"
 *                     price:
 *                       type: number
 *                       example: 199.99
 *       404:
 *         description: Classification not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Classification not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Server error
 */
router.get('/classifications/:id', classificationController.getClassificationById);

/**
 * @openapi
 * /v2/sizes/classification/{id}:
 *   get:
 *     summary: V2 - Lấy tất cả kích thước theo classification ID
 *     description: Lấy danh sách các kích thước theo ID của classification, chỉ bao gồm các kích thước có trạng thái hoạt động.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của classification cần lấy các kích thước.
 *     responses:
 *       200:
 *         description: Danh sách các kích thước theo classification.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Get Sizes Successful
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 6123456789abcdef01234567
 *                       sizeNumber:
 *                         type: string
 *                         example: "42"
 *                       weight:
 *                         type: number
 *                         example: 0.5
 *                       quantity:
 *                         type: integer
 *                         example: 10
 *                       classification:
 *                         type: string
 *                         example: "classification_id"
 *                       isActive:
 *                         type: boolean
 *                         example: true
 *       500:
 *         description: Lỗi máy chủ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Server error
 */
router.get('/sizes/classification/:id', sizeController.getSizesByIdClassification);

/**
 * @swagger
 * /v2/statistical:
 *   get:
 *     summary: Get Top 5 Best Seller Shoes
 *     description: Retrieve the top 5 best-selling shoes based on total sales and revenue. Each item includes details such as name, thumbnail, total sales, and revenue.
 *     responses:
 *       200:
 *         description: Successfully retrieved top 5 best-selling shoes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Get Top 5 Best Seller Successful
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The ID of the shoes.
 *                         example: 64cbe6c58a5f8e4b8d9c3c45
 *                       name:
 *                         type: string
 *                         description: Name of the shoes.
 *                         example: "Air Max 90"
 *                       thumbnail:
 *                         type: string
 *                         description: URL of the thumbnail image.
 *                         example: "https://example.com/images/airmax90.jpg"
 *                       totalSales:
 *                         type: integer
 *                         description: Total number of shoes sold.
 *                         example: 150
 *                       totalRevenue:
 *                         type: number
 *                         format: float
 *                         description: Total revenue generated by the shoes.
 *                         example: 45000.5
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Server error
 */
router.get('/statistical', statisticalController.getTop5);

export default router;
