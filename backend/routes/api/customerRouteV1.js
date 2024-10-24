import express from 'express';
import multer from 'multer';
import favoriteController from "../../controllers/api/customer/favoriteController.js";
import bagController from "../../controllers/api/customer/bagController.js";
import customerController from "../../controllers/api/customer/customerController.js";
import * as authenticationController from "../../middleware/authMiddleware.js";
import searchHistoryController from "../../controllers/api/customer/searchHistoryController.js";
import orderController from "../../controllers/api/customer/orderController.js";
import locationController from "../../controllers/api/customer/locationController.js";

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
 *               fcmToken:
 *                 type: string
 *                 description: The customer's Firebase Cloud Messaging token.
 *                 example: some-fcm-token
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
 * /v1/customers/location:
 *   get:
 *     summary: Get Customer Address
 *     description: Retrieves the customer's saved addresses. Requires authentication.
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the customer's addresses.
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
 *                   example: Get address successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         example: "Nhà riêng"
 *                       address:
 *                         type: string
 *                         example: "123 Main St, Springfield, USA"
 *                       wardName:
 *                         type: string
 *                         example: "Ward 1"
 *                       districtName:
 *                         type: string
 *                         example: "District A"
 *                       provinceName:
 *                         type: string
 *                         example: "Province X"  # Removed the comma here
 *                       isDefault:
 *                         type: boolean
 *                         example: true
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
router.get('/customers/location', customerController.getAddress);

/**
 * @openapi
 * /v1/customers/location:
 *   post:
 *     summary: Add Customer Address
 *     description: Adds a new address for the authenticated customer. Requires authentication.
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: nhãn của địa chỉ
 *                 example: Nhà riêng
 *               address:
 *                 type: string
 *                 description: The customer's address.
 *                 example: 123 Main St
 *               wardName:
 *                 type: string
 *                 description: The name of the ward.
 *                 example: Ward 5
 *               districtName:
 *                 type: string
 *                 description: The name of the district.
 *                 example: District 1
 *               provinceName:
 *                 type: string
 *                 description: The name of the province.
 *                 example: Ho Chi Minh City
 *     responses:
 *       200:
 *         description: Address added successfully.
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
 *                   example: Address added successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 6123456789abcdef01234567
 *                       title:
 *                         type: string
 *                         example: nhà riêng
 *                       address:
 *                         type: string
 *                         example: 123 Main St
 *                       wardName:
 *                         type: string
 *                         example: Ward 5
 *                       districtName:
 *                         type: string
 *                         example: District 1
 *                       provinceName:
 *                         type: string
 *                         example: Ho Chi Minh City
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
router.post('/customers/location', customerController.addAddress);

/**
 * @openapi
 * /v1/customers/location/{id}:
 *   patch:
 *     summary: Update Customer Address
 *     description: Updates the customer's address based on the address ID. Requires authentication.
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the address to be updated.
 *         schema:
 *           type: string
 *           example: 609c72ef1f1b2c001f31c8b7
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: nhãn của địa chỉ
 *                 example: Nhà riêng
 *               address:
 *                 type: string
 *                 description: The new address.
 *                 example: 123 New Street, New York, USA
 *               wardName:
 *                 type: string
 *                 description: The new ward name.
 *                 example: Downtown
 *               districtName:
 *                 type: string
 *                 description: The new district name.
 *                 example: Manhattan
 *               provinceName:
 *                 type: string
 *                 description: The new province name.
 *                 example: New York
 *               isDefault:
 *                 type: boolean
 *                 description: mặc định
 *                 example: true
 *     responses:
 *       200:
 *         description: Address updated successfully.
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
 *                   example: Address updated successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         example: Công ty
 *                       address:
 *                         type: string
 *                         example: 123 New Street, New York, USA
 *                       wardName:
 *                         type: string
 *                         example: Downtown
 *                       districtName:
 *                         type: string
 *                         example: Manhattan
 *                       provinceName:
 *                         type: string
 *                         example: New York
 *                       isDefault:
 *                          type: boolean
 *                          example: true
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
 *                   example: Address ID is required
 *       404:
 *         description: Customer or address not found.
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
 *                   example: Account not found or Address not found
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
router.patch('/customers/location/:id', customerController.updateAddress);

/**
 * @openapi
 * /v1/customers/location/{id}:
 *   delete:
 *     summary: Delete Customer Address
 *     description: Deletes a customer's address by its ID. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the address to be deleted.
 *     responses:
 *       200:
 *         description: Address deleted successfully.
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
 *                   example: Address deleted successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       address:
 *                         type: string
 *                         example: 123 Main St, Springfield, USA
 *                       wardName:
 *                         type: string
 *                         example: Ward 1
 *                       districtName:
 *                         type: string
 *                         example: District 1
 *                       provinceName:
 *                         type: string
 *                         example: Province 1
 *       400:
 *         description: Bad request when address ID is not provided or invalid.
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
 *                   example: Address ID is required
 *       404:
 *         description: Customer or address not found.
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
 *                   example: Account not found or Address not found
 *       500:
 *         description: Server error while deleting the address.
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
router.delete('/customers/location/:id', customerController.deleteAddress);

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

/**
 * @openapi
 * /v1/histories:
 *   post:
 *     summary: V1 - Ghi nhận một mục lịch sử tìm kiếm mới
 *     description: Thêm một mục lịch sử tìm kiếm mới cho người dùng dựa trên từ khóa được cung cấp. Nếu đã tồn tại một mục với cùng từ khóa cho cùng người dùng, không thêm mục mới.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               keyword:
 *                 type: string
 *                 description: Từ khóa tìm kiếm được sử dụng bởi khách hàng.
 *                 example: "Nike Ak rồng xanh"
 *     responses:
 *       201:
 *         description: Mục lịch sử tìm kiếm đã được tạo thành công.
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
 *                   example: Mục lịch sử đã được tạo thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "6123456789abcdef01234567"
 *                     customer:
 *                       type: string
 *                       example: "6123456789abcdef01234567"
 *                     keyword:
 *                       type: string
 *                       example: "Nike Ak rồng xanh"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Thời điểm tạo mục lịch sử.
 *       204:
 *         description: Không có nội dung mới được thêm vào vì từ khóa này đã tồn tại cho người dùng, do đó không thêm mục mới.
 *       500:
 *         description: Lỗi máy chủ xảy ra khi tạo mục lịch sử tìm kiếm.
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
 *                   example: Lỗi máy chủ
 */
router.post('/histories', searchHistoryController.createHistory);

/**
 * @openapi
 * /v1/histories:
 *   get:
 *     summary: V1 - Lấy danh sách lịch sử tìm kiếm của người dùng
 *     description: Trả về danh sách các mục lịch sử tìm kiếm của người dùng, được sắp xếp theo thứ tự mới nhất.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng để truy vấn lịch sử tìm kiếm của họ.
 *     responses:
 *       200:
 *         description: Danh sách lịch sử tìm kiếm đã được lấy thành công.
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
 *                   example: Lịch sử tìm kiếm đã được lấy thành công.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "6123456789abcdef01234567"
 *                       customer:
 *                         type: string
 *                         example: "6123456789abcdef01234567"
 *                       keyword:
 *                         type: string
 *                         example: "Nike Ak rồng xanh"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Thời điểm tạo mục lịch sử.
 *       500:
 *         description: Lỗi máy chủ xảy ra khi truy vấn lịch sử tìm kiếm.
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
 *                   example: Lỗi máy chủ
 */
router.get('/histories', searchHistoryController.getHistories);

/**
 * @openapi
 * /v1/histories:
 *   delete:
 *     summary: V1 - Xóa các mục lịch sử tìm kiếm của người dùng
 *     description: Xóa tất cả các mục lịch sử tìm kiếm của người dùng được chỉ định bởi ID. Thao tác này không thể hoàn tác.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token để xác thực người dùng.
 *     responses:
 *       204:
 *         description: Lịch sử tìm kiếm đã được xóa thành công.
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
 *                   example: Histories deleted successfully
 *       400:
 *         description: Yêu cầu không hợp lệ nếu ID người dùng không được cung cấp hoặc không hợp lệ.
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
 *                   example: Invalid request
 *       500:
 *         description: Lỗi máy chủ xảy ra khi cố gắng xóa lịch sử tìm kiếm.
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
router.delete('/histories', searchHistoryController.deleteHistories);

/**
 * @openapi
 * /v1/histories/{id}:
 *   delete:
 *     summary: V1 - Xóa một mục lịch sử tìm kiếm
 *     description: Xóa một mục lịch sử tìm kiếm dựa trên ID được cung cấp. Nếu mục không tồn tại, trả về lỗi.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của mục lịch sử tìm kiếm cần xóa.
 *     responses:
 *       200:
 *         description: Mục lịch sử đã được xóa thành công.
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
 *                   example: "History deleted successfully"
 *                 data:
 *                   type: string
 *                   example: "6123456789abcdef01234567"
 *       404:
 *         description: Không tìm thấy mục lịch sử
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
 *                   example: "History not found"
 *       500:
 *         description: Lỗi máy chủ xảy ra khi xóa mục lịch sử.
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
 *                   example: "Server error"
 */
router.delete('/histories/:id', searchHistoryController.deleteHistory);

/**
 * @openapi
 * /v1/orders/fee:
 *   post:
 *     summary: Tính phí vận chuyển
 *     description: Tính toán phí vận chuyển dựa trên thông tin địa chỉ nhận hàng, tổng trọng lượng đơn hàng và mã đơn hàng.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientOrderCode:
 *                 type: string
 *                 example: "ORD123456"
 *                 description: Mã đơn hàng của khách hàng
 *               toName:
 *                 type: string
 *                 example: "Nguyễn Văn A"
 *                 description: Tên người nhận
 *               toPhone:
 *                 type: string
 *                 example: "0123456789"
 *                 description: Số điện thoại người nhận
 *               toAddress:
 *                 type: string
 *                 example: "Số 123, đường ABC"
 *                 description: Địa chỉ nhận hàng
 *               toWardName:
 *                 type: string
 *                 example: "Phường Định Công"
 *                 description: Tên phường xã nơi nhận hàng
 *               toDistrictName:
 *                 type: string
 *                 example: "Quận Hoàng Mai"
 *                 description: Tên quận huyện nơi nhận hàng
 *               toProvinceName:
 *                 type: string
 *                 example: "Hà Nội"
 *                 description: Tên tỉnh thành nơi nhận hàng
 *               codAmount:
 *                 type: number
 *                 example: 200000
 *                 description: Số tiền thu hộ
 *               weight:
 *                 type: number
 *                 example: 1500
 *                 description: Tổng trọng lượng đơn hàng (tính bằng gram)
 *               content:
 *                 type: string
 *                 example: "Đơn hàng giày dép"
 *                 description: Nội dung đơn hàng
 *     responses:
 *       200:
 *         description: Tính toán phí vận chuyển thành công
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
 *                   example: "Get Shipping Fee Successful"
 *                 data:
 *                   type: number
 *                   example: 50000
 *       400:
 *         description: Thiếu thông tin cần thiết
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
 *                   example: "All fields are required"
 *       500:
 *         description: Lỗi máy chủ khi tính phí vận chuyển
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
 *                   example: "Server error"
 */
router.post('/orders/fee', orderController.getShippingFee);

/**
 * @openapi
 * /v1/orders:
 *   post:
 *     summary: Tạo đơn hàng mới
 *     description: Tạo một đơn hàng mới dựa trên thông tin người dùng, sản phẩm và địa chỉ giao hàng.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order:
 *                 type: object
 *                 required:
 *                   - shippingAddress
 *                   - weight
 *                   - codAmount
 *                   - shippingFee
 *                   - content
 *                   - isFreeShip
 *                   - isPayment
 *                 properties:
 *                   shippingAddress:
 *                     type: object
 *                     required:
 *                       - toName
 *                       - toAddress
 *                       - toProvinceName
 *                       - toDistrictName
 *                       - toWardName
 *                       - toPhone
 *                     properties:
 *                       toName:
 *                         type: string
 *                         description: Tên người nhận
 *                         example: "Nguyễn Văn A"
 *                       toAddress:
 *                         type: string
 *                         description: Địa chỉ nhận hàng
 *                         example: "123 Đường ABC"
 *                       toProvinceName:
 *                         type: string
 *                         description: Tỉnh/Thành phố nhận hàng
 *                         example: "Hà Nội"
 *                       toDistrictName:
 *                         type: string
 *                         description: Quận/Huyện nhận hàng
 *                         example: "Cầu Giấy"
 *                       toWardName:
 *                         type: string
 *                         description: Phường/Xã nhận hàng
 *                         example: "Phường Dịch Vọng"
 *                       toPhone:
 *                         type: string
 *                         description: Số điện thoại người nhận
 *                         example: "0123456789"
 *                   weight:
 *                     type: number
 *                     description: Tổng khối lượng đơn hàng
 *                     example: 2.5
 *                   codAmount:
 *                     type: number
 *                     description: Tổng tiền thu hộ
 *                     example: 500000
 *                   shippingFee:
 *                     type: number
 *                     description: Phí vận chuyển
 *                     example: 30000
 *                   content:
 *                     type: string
 *                     description: Nội dung đơn hàng
 *                     example: "Giao hàng nhanh chóng"
 *                   isFreeShip:
 *                     type: boolean
 *                     description: Đơn hàng có miễn phí ship không
 *                     example: false
 *                   isPayment:
 *                     type: boolean
 *                     description: Đơn hàng đã thanh toán chưa
 *                     example: true
 *                   note:
 *                     type: string
 *                     description: Ghi chú của khách hàng về đơn hàng
 *                     example: "Giao trước 5 giờ chiều"
 *               orderItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - size
 *                     - shoes
 *                     - quantity
 *                     - price
 *                   properties:
 *                     size:
 *                       type: string
 *                       description: ID của kích cỡ sản phẩm
 *                       example: "6123456789abcdef01234567"
 *                     shoes:
 *                       type: string
 *                       description: ID của sản phẩm
 *                       example: "6123456789abcdef01989664"
 *                     quantity:
 *                       type: number
 *                       description: Số lượng sản phẩm
 *                       example: 2
 *                     price:
 *                       type: number
 *                       description: Giá của sản phẩm (VNĐ)
 *                       example: 250000
 *     responses:
 *       201:
 *         description: Đơn hàng đã được tạo thành công.
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
 *                   example: "Order created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     customer:
 *                       type: string
 *                       description: ID khách hàng
 *                       example: "6123456789abcdef01234567"
 *                     clientOrderCode:
 *                       type: string
 *                       example: "ORD123456"
 *                     shippingAddress:
 *                       type: object
 *                       description: Địa chỉ giao hàng
 *                       properties:
 *                         toName:
 *                           type: string
 *                           example: "Nguyễn Văn A"
 *                         toAddress:
 *                           type: string
 *                           example: "123 Đường ABC"
 *                         toProvinceName:
 *                           type: string
 *                           example: "Hà Nội"
 *                         toDistrictName:
 *                           type: string
 *                           example: "Cầu Giấy"
 *                         toWardName:
 *                           type: string
 *                           example: "Phường Dịch Vọng"
 *                         toPhone:
 *                           type: string
 *                           example: "0123456789"
 *                     orderItems:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           size:
 *                             type: string
 *                             example: "6123456789abcdef01234567"
 *                           shoes:
 *                             type: string
 *                             example: "6123456789abcdef01989664"
 *                           quantity:
 *                             type: number
 *                             example: 2
 *                           price:
 *                             type: number
 *                             example: 250000
 *                     weight:
 *                       type: number
 *                       example: 2.5
 *                     codAmount:
 *                       type: number
 *                       example: 500000
 *                     shippingFee:
 *                       type: number
 *                       example: 30000
 *                     content:
 *                       type: string
 *                       example: "Giao hàng nhanh chóng"
 *                     isFreeShip:
 *                       type: boolean
 *                       example: false
 *                     isPayment:
 *                       type: boolean
 *                       example: true
 *                     note:
 *                       type: string
 *                       example: "Giao trước 5 giờ chiều"
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc thiếu thông tin.
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
 *                   example: "All fields are required"
 *       500:
 *         description: Lỗi máy chủ khi tạo đơn hàng.
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
 *                   example: "Server error"
 */
router.post('/orders', orderController.createOrder);

/**
 * @openapi
 * /v1/orders:
 *   get:
 *     summary: V1 - Lấy danh sách đơn hàng của khách hàng
 *     description: Trả về danh sách các đơn hàng dựa trên ID của khách hàng đã đăng nhập và trạng thái đơn hàng. Mỗi đơn hàng sẽ bao gồm thông tin cơ bản về đơn hàng và sản phẩm đầu tiên trong danh sách sản phẩm của đơn hàng.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - pending
 *             - processing
 *             - shipped
 *             - delivered
 *             - confirmed
 *             - cancelled
 *             - returned
 *         description: |
 *           Trạng thái của đơn hàng cần lấy (mặc định là 'pending').
 *           Các trạng thái có thể có:
 *           - **pending**: Đơn hàng đã được tạo nhưng chưa xử lý.
 *           - **processing**: Đơn hàng đang được xử lý.
 *           - **shipped**: Đơn hàng đã được giao cho đơn vị vận chuyển.
 *           - **delivered**: Đơn hàng đã được giao cho khách hàng.
 *           - **confirmed**: Đơn hàng đã được khách hàng xác nhận đã nhận.
 *           - **cancelled**: Đơn hàng đã bị hủy.
 *           - **returned**: Đơn hàng đã được trả lại.
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng đã được lấy thành công
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
 *                   example: "Orders retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "6123456789abcdef01234567"
 *                       value:
 *                         type: number
 *                         example: 1000000
 *                       status:
 *                         type: string
 *                         example: "pending"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-10-06T14:23:45.123Z"
 *                       firstProduct:
 *                         type: object
 *                         properties:
 *                           size:
 *                             type: string
 *                             example: "42"
 *                           color:
 *                             type: string
 *                             example: "Black"
 *                           price:
 *                             type: number
 *                             example: 500000
 *                           quantity:
 *                             type: number
 *                             example: 1
 *                           thumbnail:
 *                             type: string
 *                             example: "https://example.com/images/product-thumbnail.jpg"
 *       500:
 *         description: Lỗi máy chủ xảy ra khi lấy danh sách đơn hàng
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
 *                   example: "Server error"
 */
router.get('/orders', orderController.getOrders);

/**
 * @openapi
 * /v1/orders/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết đơn hàng
 *     description: Truy xuất chi tiết đơn hàng dựa trên ID được cung cấp. Nếu đơn hàng không tồn tại, trả về lỗi.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của đơn hàng cần lấy thông tin.
 *     responses:
 *       200:
 *         description: Thông tin chi tiết đơn hàng đã được lấy thành công.
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
 *                   example: "Order details retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "6123456789abcdef01234567"
 *                     orderID:
 *                       type: string
 *                       example: "ORDER-123456"
 *                     shippingAddress:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "Nguyen Van A"
 *                         address:
 *                           type: string
 *                           example: "123 Đường ABC"
 *                         province:
 *                           type: string
 *                           example: "Hà Nội"
 *                         district:
 *                           type: string
 *                           example: "Quận 1"
 *                         ward:
 *                           type: string
 *                           example: "Phường 1"
 *                         tel:
 *                           type: string
 *                           example: "0123456789"
 *                     totalWeight:
 *                       type: number
 *                       example: 2.5
 *                     value:
 *                       type: number
 *                       example: 1500000
 *                     shippingFee:
 *                       type: number
 *                       example: 50000
 *                     transportMethod:
 *                       type: string
 *                       enum: [road, fly]
 *                       example: "road"
 *                     isFreeShip:
 *                       type: boolean
 *                       example: false
 *                     status:
 *                       type: string
 *                       enum: [pending, processing, shipped, delivered, confirmed, cancelled, returned]
 *                       example: "pending"
 *                     statusTimestamps:
 *                       type: object
 *                       properties:
 *                         pending:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-10-06T12:00:00Z"
 *                         processing:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-10-06T13:00:00Z"
 *                         shipped:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-10-06T14:00:00Z"
 *                         delivered:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-10-06T15:00:00Z"
 *                         confirmed:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-10-06T16:00:00Z"
 *                         cancelled:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-10-06T17:00:00Z"
 *                         returned:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-10-06T18:00:00Z"
 *                     products:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           size:
 *                             type: number
 *                             example: 42
 *                           shoes:
 *                             type: string
 *                             example: "Giày thể thao XYZ"
 *                           color:
 *                             type: string
 *                             example: "Đỏ"
 *                           price:
 *                             type: number
 *                             example: 500000
 *                           quantity:
 *                             type: number
 *                             example: 2
 *                           thumbnail:
 *                             type: string
 *                             example: "https://example.com/image.jpg"
 *       404:
 *         description: Không tìm thấy đơn hàng với ID đã cho.
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
 *                   example: "Order not found"
 *       500:
 *         description: Lỗi máy chủ xảy ra khi lấy thông tin đơn hàng.
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
 *                   example: "Server error"
 */
router.get('/orders/:id', orderController.getOrderById);

/**
 * @openapi
 * /v1/orders/{id}:
 *   patch:
 *     summary: V1 - Cập nhật trạng thái đơn hàng
 *     description: |
 *       Cập nhật trạng thái của một đơn hàng dựa trên ID được cung cấp.
 *       Chỉ cho phép cập nhật các trạng thái:
 *       - **confirmed**: Đơn hàng đã được khách hàng xác nhận đã nhận.
 *       - **cancelled**: Đơn hàng đã bị hủy.
 *       - **returned**: Đơn hàng đã được trả lại.
 *       Nếu đơn hàng không tồn tại, trả về lỗi.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của đơn hàng cần cập nhật trạng thái.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newStatus:
 *                 type: string
 *                 enum: [confirmed, cancelled, returned]
 *                 description: # Trạng thái mới của đơn hàng. Có thể là:
 *                              #- **confirmed**
 *                              #- **cancelled**
 *                              #- **returned**
 *             required:
 *               - newStatus
 *     responses:
 *       200:
 *         description: Trạng thái đơn hàng đã được cập nhật thành công.
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
 *                   example: "Order status updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "6123456789abcdef01234567"
 *                     status:
 *                       type: string
 *                       example: "confirmed"
 *                     # thêm các thuộc tính khác của đơn hàng nếu cần
 *       400:
 *         description: Yêu cầu không hợp lệ (trạng thái không hợp lệ).
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
 *                   example: "Invalid status"
 *       404:
 *         description: Không tìm thấy đơn hàng.
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
 *                   example: "Order not found"
 *       500:
 *         description: Lỗi máy chủ xảy ra khi cập nhật trạng thái đơn hàng.
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
 *                   example: "Server error"
 */
router.patch('/orders/:id', orderController.updateOrderStatus);

/**
 * @openapi
 * /v1/orders/{id}:
 *   delete:
 *     summary: V1 - Xóa một đơn hàng
 *     description: Xóa một đơn hàng dựa trên ID được cung cấp. Nếu đơn hàng không tồn tại, trả về lỗi.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của đơn hàng cần xóa.
 *     responses:
 *       200:
 *         description: Đơn hàng đã được cập nhật trạng thái thành công.
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
 *                   example: "Order status updated successfully"
 *                 data:
 *                   type: string
 *                   example: "6123456789abcdef01234567"  # Đây là ID của đơn hàng đã xóa.
 *       404:
 *         description: Không tìm thấy đơn hàng
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
 *                   example: "Order not found"
 *       500:
 *         description: Lỗi máy chủ xảy ra khi xóa đơn hàng.
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
 *                   example: "Server error"
 */
router.delete('/orders/:id', orderController.deleteOrder);

/**
 * @openapi
 * /v1/locations/provinces:
 *   get:
 *     summary: Lấy danh sách các tỉnh
 *     description: Trả về danh sách tất cả các tỉnh có sẵn. Nếu không có tỉnh nào, trả về lỗi.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách các tỉnh được lấy thành công.
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
 *                   example: "Provinces retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       provinceID:
 *                         type: integer
 *                         example: 269
 *                       provinceName:
 *                         type: string
 *                         example: "Lào Cai"
 *       404:
 *         description: Không tìm thấy tỉnh nào.
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
 *                   example: "No provinces found"
 *       500:
 *         description: Lỗi máy chủ xảy ra khi lấy danh sách các tỉnh.
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
 *                   example: "Server error"
 */
router.get('/locations/provinces', locationController.getProvinces);

/**
 * @openapi
 * /v1/locations/districts/{id}:
 *   get:
 *     summary: Lấy danh sách các quận/huyện theo tỉnh
 *     description: Trả về danh sách tất cả các quận/huyện của tỉnh dựa trên `province_id` được cung cấp. Nếu không có quận/huyện nào, trả về lỗi.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của tỉnh cần lấy danh sách các quận/huyện.
 *     responses:
 *       200:
 *         description: Danh sách các quận/huyện được lấy thành công.
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
 *                   example: "Districts retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       districtID:
 *                         type: integer
 *                         example: 123
 *                       districtName:
 *                         type: string
 *                         example: "Hà Đông"
 *       400:
 *         description: Thiếu `province_id` trong yêu cầu.
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
 *                   example: "Province ID is required"
 *       404:
 *         description: Không tìm thấy quận/huyện cho tỉnh đã cung cấp.
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
 *                   example: "No districts found"
 *       500:
 *         description: Lỗi máy chủ xảy ra khi lấy danh sách các quận/huyện.
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
 *                   example: "Server error"
 */
router.get('/locations/districts/:id', locationController.getDistricts);

/**
 * @openapi
 * /v1/locations/wards/{id}:
 *   get:
 *     summary: Lấy danh sách các phường/xã theo quận/huyện
 *     description: Trả về danh sách tất cả các phường/xã của quận/huyện dựa trên `district_id` được cung cấp. Nếu không có phường/xã nào, trả về lỗi.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của quận/huyện cần lấy danh sách các phường/xã.
 *     responses:
 *       200:
 *         description: Danh sách các phường/xã được lấy thành công.
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
 *                   example: "Wards retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       wardCode:
 *                         type: string
 *                         example: "001"
 *                       wardName:
 *                         type: string
 *                         example: "Phường Láng Hạ"
 *       400:
 *         description: Thiếu `district_id` trong yêu cầu.
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
 *                   example: "District ID is required"
 *       404:
 *         description: Không tìm thấy phường/xã cho quận/huyện đã cung cấp.
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
 *                   example: "No wards found"
 *       500:
 *         description: Lỗi máy chủ xảy ra khi lấy danh sách các phường/xã.
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
 *                   example: "Server error"
 */
router.get('/locations/wards/:id', locationController.getWards);

export default router;
