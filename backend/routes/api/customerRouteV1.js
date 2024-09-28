import express from 'express';
import multer from 'multer';
import favoriteController from "../../controllers/api/customer/favoriteController.js";
import bagController from "../../controllers/api/customer/bagController.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {fileSize: 25 * 1024 * 1024}
});

/**
 * @openapi
 * /v1/favorites:
 *   post:
 *     summary: V1 - Add or remove a shoe from favorites
 *     description: Adds a shoe to the customer's favorites if it's not already in favorites, or removes it if it is.
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shoes:
 *                 type: string
 *                 description: The ID of the shoe to add or remove from favorites.
 *                 example: 6123456789abcdef01234567
 *     responses:
 *       200:
 *         description: Shoe successfully removed from favorites.
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
 *                   example: Removed favorite this shoe
 *                 data:
 *                   type: string
 *                   example: 6123456789abcdef01234567
 *       201:
 *         description: Shoe successfully added to favorites.
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
 *                   example: Added shoes to favorites
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6123456789abcdef01234567
 *       400:
 *         description: Bad request when shoes ID is missing.
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
 *                   example: Shoes is required
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
router.post('/favorites', favoriteController.createOrDeleteFavorite);

/**
 * @openapi
 * /v1/favorites:
 *   get:
 *     summary: V1 - Retrieve a list of favorite shoes for the authenticated user
 *     description: Fetches a list of shoes that the authenticated user has marked as favorites, including details such as price range, average rating, and review count.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of favorite shoes with details.
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
 *                   example: Get Favorites Successful
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 6123456789abcdef01234567
 *                       shoesId:
 *                         type: string
 *                         example: 6123456789abcdef01234568
 *                       name:
 *                         type: string
 *                         example: "Air Jordan 1"
 *                       minPrice:
 *                         type: number
 *                         example: 150.00
 *                       maxPrice:
 *                         type: number
 *                         example: 250.00
 *                       avgRating:
 *                         type: number
 *                         example: 4.5
 *                       reviewCount:
 *                         type: integer
 *                         example: 10
 *                       thumbnail:
 *                         type: string
 *                         example: "https://example.com/images/shoes_thumbnail.jpg"
 *       404:
 *         description: No favorites found for the user
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
 *                   example: No favorites found
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
router.get('/favorites', favoriteController.getFavorites);

/**
 * @openapi
 * /v1/favorites/{id}:
 *   delete:
 *     summary: V1 - Delete a specific favorite by its ID
 *     description: Remove a favorite item from the user's favorites list using its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the favorite to delete.
 *     responses:
 *       200:
 *         description: Successfully deleted the favorite.
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
 *                   example: Favorite deleted successfully
 *                 data:
 *                   type: string
 *                   example: "6123456789abcdef01234567"
 *       404:
 *         description: Favorite not found
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
 *                   example: Favorite not found
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
router.delete('/favorites/:id', favoriteController.deleteFavorite);

/**
 * @openapi
 * /v1/bags:
 *   post:
 *     summary: V1 - Create a new bag entry
 *     description: Add a new bag item for the customer, or update the quantity if the size already exists in the bag.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               size:
 *                 type: string
 *                 description: The ID of the size for the bag.
 *                 example: "6123456789abcdef01234567"
 *               quantity:
 *                 type: integer
 *                 description: The quantity of the item to add to the bag.
 *                 example: 2
 *     responses:
 *       201:
 *         description: Bag created successfully.
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
 *                   example: Bag created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6123456789abcdef01234567
 *                     customer:
 *                       type: string
 *                       example: "6123456789abcdef01234567"
 *                     size:
 *                       type: string
 *                       example: "6123456789abcdef01234567"
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *       400:
 *         description: Bad request due to missing fields or exceeding stock.
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
 *                   example: All fields are required
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
router.post('/bags', bagController.createBag);

/**
 * @openapi
 * /v1/bags:
 *   get:
 *     summary: V1 - Retrieve a list of bags for the authenticated user
 *     description: Fetch all bags in the user's shopping bag, including details about the shoes, size, and price.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of bags for the user.
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
 *                   example: Get Bags Successful
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 6123456789abcdef01234567
 *                       shoes:
 *                         type: string
 *                         example: "Air Jordan 1"
 *                       thumbnail:
 *                         type: string
 *                         example: "https://example.com/images/shoes_thumbnail.jpg"
 *                       color:
 *                         type: string
 *                         example: "Red"
 *                       size:
 *                         type: string
 *                         example: "42"
 *                       quantity:
 *                         type: integer
 *                         example: 2
 *                       price:
 *                         type: number
 *                         example: 199.99
 *       401:
 *         description: Unauthorized access, user must be authenticated.
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
 *                   example: Unauthorized
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
router.get('/bags', bagController.getBags);

/**
 * @openapi
 * /v1/bags/{id}:
 *   patch:
 *     summary: V1 - Update the quantity of a specific bag
 *     description: Adjust the quantity of items in a user's bag using its ID. It allows increasing or decreasing the quantity.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the bag to update.
 *       - in: body
 *         name: action
 *         required: true
 *         description: Action to perform on the quantity. Can be either "increase" or "decrease".
 *         schema:
 *           type: object
 *           properties:
 *             action:
 *               type: string
 *               enum: ["increase", "decrease"]
 *               example: "increase"
 *     responses:
 *       200:
 *         description: Successfully updated the bag quantity.
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
 *                   example: Bag quantity updated
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6123456789abcdef01234567
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *                     price:
 *                       type: number
 *                       example: 199.99
 *       400:
 *         description: Bad request due to missing or invalid action
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
 *                   example: Action is required
 *       404:
 *         description: Bag not found or Size not found
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
 *                   example: Bag not found
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
router.patch('/bags/:id', bagController.updateBagQuantity);

/**
 * @openapi
 * /v1/bags:
 *   delete:
 *     summary: V1 - Delete all bags for the authenticated user
 *     description: Removes all bags associated with the authenticated user from the shopping cart.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully deleted all bags.
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
 *                   example: Bags deleted successfully
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
router.delete('/bags', bagController.deleteBags);

/**
 * @openapi
 * /v1/bags/{id}:
 *   delete:
 *     summary: V1 - Delete a specific bag by its ID
 *     description: Remove a bag from the user's bag list using its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the bag to delete.
 *     responses:
 *       200:
 *         description: Successfully deleted the bag.
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
 *                   example: Bag deleted successfully
 *                 data:
 *                   type: string
 *                   example: "6123456789abcdef01234567"
 *       404:
 *         description: Bag not found
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
 *                   example: Bag not found
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
router.delete('/bags/:id', bagController.deleteBagById);

export default router;
