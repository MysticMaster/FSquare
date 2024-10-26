import express from 'express';
import brandController from "../../controllers/api/customer/brandController.js";
import categoryController from "../../controllers/api/customer/categoryController.js";
import shoesController from "../../controllers/api/customer/shoesController.js";
import classificationController from "../../controllers/api/customer/classificationController.js";
import sizeController from "../../controllers/api/customer/sizeController.js";

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
 *     summary: V2 - Retrieve a specific shoe by its ID
 *     description: Fetch detailed information about a specific shoe using its ID, including brand, category, description, and ratings.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the shoe to retrieve.
 *     responses:
 *       200:
 *         description: A detailed object of the shoe.
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
 *                       example: "A description of the shoe for marketing purposes."
 *                     description:
 *                       type: string
 *                       example: "This is the full description of the shoe, including materials and features."
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
 *       404:
 *         description: Shoe not found
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
 * /v2/sizes/classifications/{id}:
 *   get:
 *     summary: V2 - Retrieve a list of sizes by classification ID
 *     description: Fetch a list of active sizes associated with a specific classification using its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the classification for which to retrieve sizes.
 *     responses:
 *       200:
 *         description: A list of sizes associated with the specified classification.
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
 *                         example: "10"
 *       404:
 *         description: Classification not found or no sizes available
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
 *                   example: Classification not found or no sizes available
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
router.get('/sizes/classifications/:id', sizeController.getSizesByIdClassification);

/**
 * @openapi
 * /v2/sizes/{id}:
 *   get:
 *     summary: V2 - Retrieve a specific size by its ID
 *     description: Fetch detailed information about a specific size using its ID, including size number and quantity.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the size to retrieve.
 *     responses:
 *       200:
 *         description: A detailed object of the size.
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
 *                   example: Get Size Successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6123456789abcdef01234567
 *                     sizeNumber:
 *                       type: string
 *                       example: "42"
 *                     quantity:
 *                       type: integer
 *                       example: 10
 *       404:
 *         description: Size not found
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
 *                   example: Size not found
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
router.get('/sizes/:id', sizeController.getSizeById);

export default router;
