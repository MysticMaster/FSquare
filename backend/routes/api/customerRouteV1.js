import express from 'express';
import multer from 'multer';
import favoriteController from "../../controllers/api/customer/favoriteController.js";
import bagController from "../../controllers/api/customer/bagController.js";
import customerController from "../../controllers/api/customer/customerController.js";
import * as authenticationController from "../../middleware/authMiddleware.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {fileSize: 25 * 1024 * 1024}
});

/**
 * @openapi
 * /v1/customers/profile:
 *   get:
 *     summary: Get Customer Profile
 *     description: Retrieves the profile information of the logged-in customer.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved customer profile.
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
 *                   example: Get profile successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *                     avatar:
 *                       type: string
 *                       example: http://example.com/avatars/john_doe.png
 *                     birthDay:
 *                       type: string
 *                       format: date
 *                       example: 1990-01-01
 *                     phone:
 *                       type: string
 *                       example: +1234567890
 *                     address:
 *                       type: string
 *                       example: 123 Main St, Anytown, USA
 *                     longitude:
 *                       type: number
 *                       example: -73.935242
 *                     latitude:
 *                       type: number
 *                       example: 40.730610
 *       404:
 *         description: Customer not found.
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
 *                   example: Account not found
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
router.get('/customers/profile', customerController.getProfile);

/**
 * @openapi
 * /v1/customers/profile:
 *   patch:
 *     summary: Update Customer Profile
 *     description: Updates the customer's profile information. Requires authentication.
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The customer's first name.
 *                 example: John
 *               lastName:
 *                 type: string
 *                 description: The customer's last name.
 *                 example: Doe
 *               birthDay:
 *                 type: string
 *                 format: date
 *                 description: The customer's birthday.
 *                 example: 1990-01-01
 *               phone:
 *                 type: string
 *                 description: The customer's phone number.
 *                 example: 123-456-7890
 *               address:
 *                 type: string
 *                 description: The customer's address.
 *                 example: 123 Main St, Springfield, USA
 *               fcmToken:
 *                 type: string
 *                 description: The customer's Firebase Cloud Messaging token.
 *                 example: some-fcm-token
 *               longitude:
 *                 type: number
 *                 format: float
 *                 description: The customer's longitude coordinate.
 *                 example: -73.935242
 *               latitude:
 *                 type: number
 *                 format: float
 *                 description: The customer's latitude coordinate.
 *                 example: 40.730610
 *     responses:
 *       200:
 *         description: Profile updated successfully.
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
 *                   example: Update Profile Successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     avatar:
 *                       type: string
 *                       example: https://example.com/avatar.jpg
 *                     birthDay:
 *                       type: string
 *                       format: date
 *                       example: 1990-01-01
 *                     phone:
 *                       type: string
 *                       example: 123-456-7890
 *                     address:
 *                       type: string
 *                       example: 123 Main St, Springfield, USA
 *                     longitude:
 *                       type: number
 *                       format: float
 *                       example: -73.935242
 *                     latitude:
 *                       type: number
 *                       format: float
 *                       example: 40.730610
 *       400:
 *         description: Bad request when required fields are missing or invalid.
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
 *                   example: Required fields are missing
 *       404:
 *         description: Customer not found.
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
 *                   example: Account not found
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
router.patch('/customers/profile', upload.single('file'), customerController.updateProfile);

/**
 * @openapi
 * /v1/customers/otp/authentications:
 *   get:
 *     summary: Send OTP for PIN code authentication
 *     description: Sends a One-Time Password (OTP) to the customer's email for verifying PIN code changes.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OTP sent successfully.
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
 *                   example: OTP sent successfully
 *       404:
 *         description: Account not found.
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
 *                   example: Account not found
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
router.get('/customers/otp/authentications', customerController.otpAuthentication);

/**
 * @openapi
 * /v1/customers/otp/verifications:
 *   post:
 *     summary: Verify OTP for customer
 *     description: Verifies the OTP sent to the customer's email for authentication.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *                 description: The OTP code sent to the customer's email.
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verification successful.
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
 *                   example: OTP authentication successfully
 *       400:
 *         description: Bad request if OTP is missing or invalid.
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
 *                   example: OTP is required
 *       404:
 *         description: Not found if customer account does not exist.
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
 *                   example: Account not found
 *       409:
 *         description: Conflict if OTP is incorrect or expired.
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
 *                   example: OTP is incorrect
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
router.post('/customers/otp/verifications', customerController.otpVerification);

/**
 * @openapi
 * /v1/customers/pin:
 *   patch:
 *     summary: Update customer's PIN code
 *     description: Updates the customer's PIN code based on the action specified (on/off).
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pinCode:
 *                 type: string
 *                 description: The new PIN code to be set if action is 'on'.
 *                 example: "123456"
 *               action:
 *                 type: string
 *                 description: Action to perform - 'on' to set a new PIN code or 'off' to disable it.
 *                 example: "on"
 *     responses:
 *       200:
 *         description: PIN code updated successfully.
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
 *                   example: Update Pin code Successful
 *       400:
 *         description: Bad request when required fields are missing.
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
 *         description: Account not found for the given user ID.
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
 *                   example: Account not found
 *       500:
 *         description: Server error during processing.
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
router.patch('/customers/pin', customerController.updatePinCode);

/**
 * @openapi
 * /v1/customers/pin:
 *   post:
 *     summary: Authenticate customer PIN
 *     description: Validates the customer's PIN code for authentication purposes.
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pinCode:
 *                 type: string
 *                 description: The PIN code of the customer to be validated.
 *                 example: 123456
 *     responses:
 *       200:
 *         description: PIN authentication was successful.
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
 *                   example: PIN authentication successfully
 *       400:
 *         description: Bad request when PIN code is missing.
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
 *                   example: PIN is required
 *       404:
 *         description: Not found when the customer account does not exist.
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
 *                   example: Account not found
 *       409:
 *         description: Conflict when the provided PIN is incorrect.
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
 *                   example: Incorrect PIN
 *       500:
 *         description: Server error during processing.
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
router.post('/customers/pin', customerController.pinAuthentication);

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
