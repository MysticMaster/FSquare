import express from 'express';
import multer from 'multer';
import favoriteController from "../../controllers/api/customer/favoriteController.js";
import bagController from "../../controllers/api/customer/bagController.js";
import customerController from "../../controllers/api/customer/customerController.js";
import searchHistoryController from "../../controllers/api/customer/searchHistoryController.js";
import orderController from "../../controllers/api/customer/orderController.js";
import locationController from "../../controllers/api/customer/locationController.js";
import shoesController from "../../controllers/api/customer/shoesController.js";
import brandController from "../../controllers/api/customer/brandController.js";
import categoryController from "../../controllers/api/customer/categoryController.js";
import classificationController from "../../controllers/api/customer/classificationController.js";
import sizeController from "../../controllers/api/customer/sizeController.js";
import paymentController from "../../controllers/api/customer/paymentController.js";
import shoesReviewController from "../../controllers/api/customer/shoesReviewController.js";
import statisticalController from "../../controllers/api/customer/statisticalController.js";
import notificationController from "../../controllers/api/customer/notificationController.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {fileSize: 25 * 1024 * 1024}
});

router.get('/brands', brandController.getBrands);
router.get('/categories', categoryController.getCategories);
router.get('/shoes', shoesController.getShoes);
router.get('/shoes/:id', shoesController.getShoesById);
router.get('/classifications/shoes/:id', classificationController.getClassificationsByIdShoes);
router.get('/classifications/:id', classificationController.getClassificationById);
router.get('/sizes/classification/:id', sizeController.getSizesByIdClassification);

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
 *     description: Cập nhật thông tin tài khoản, đổi avatar thì gửi theo tag file
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
 *      - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token để xác thực người dùng.
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
 *     description: Tạo một đơn hàng mới cho người dùng, bao gồm thông tin khách hàng, các sản phẩm (order items), địa chỉ giao hàng và các thông tin thanh toán.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order:
 *                 type: object
 *                 description: Thông tin chi tiết về đơn hàng.
 *                 properties:
 *                   clientOrderCode:
 *                     type: string
 *                     description: Mã đơn hàng của khách hàng.
 *                     example: "ORD123456"
 *                   shippingAddress:
 *                     type: object
 *                     description: Địa chỉ giao hàng.
 *                     properties:
 *                       toName:
 *                         type: string
 *                         description: Tên người nhận.
 *                         example: "Nguyen Van A"
 *                       toAddress:
 *                         type: string
 *                         description: Địa chỉ giao hàng.
 *                         example: "123 Đường ABC, Quận 1"
 *                       toProvinceName:
 *                         type: string
 *                         description: Tỉnh/Thành phố.
 *                         example: "Hồ Chí Minh"
 *                       toDistrictName:
 *                         type: string
 *                         description: Quận/Huyện.
 *                         example: "Quận 1"
 *                       toWardName:
 *                         type: string
 *                         description: Phường/Xã.
 *                         example: "Phường Bến Nghé"
 *                       toPhone:
 *                         type: string
 *                         description: Số điện thoại người nhận.
 *                         example: "0987654321"
 *                   weight:
 *                     type: number
 *                     description: Tổng trọng lượng của đơn hàng (tính bằng gram).
 *                     example: 2000
 *                   codAmount:
 *                     type: number
 *                     description: Số tiền thu hộ (COD).
 *                     example: 500000
 *                   shippingFee:
 *                     type: number
 *                     description: Phí vận chuyển.
 *                     example: 30000
 *                   content:
 *                     type: string
 *                     description: Mô tả về sản phẩm trong đơn hàng.
 *                     example: "Giày thể thao"
 *                   isFreeShip:
 *                     type: boolean
 *                     description: Cho biết đơn hàng có miễn phí vận chuyển hay không.
 *                     example: false
 *                   isPayment:
 *                     type: boolean
 *                     description: Trạng thái thanh toán của đơn hàng.
 *                     example: false
 *                   note:
 *                     type: string
 *                     description: Ghi chú thêm cho đơn hàng.
 *                     example: "Giao vào buổi sáng"
 *               orderItems:
 *                 type: array
 *                 description: Danh sách các sản phẩm trong đơn hàng.
 *                 items:
 *                   type: object
 *                   properties:
 *                     size:
 *                       type: string
 *                       description: ID của kích thước sản phẩm.
 *                       example: "60d1bda49f1b2c001c8ab4ad"
 *                     shoes:
 *                       type: string
 *                       description: ID của sản phẩm giày.
 *                       example: "60d1bd729f1b2c001c8ab4a0"
 *                     quantity:
 *                       type: number
 *                       description: Số lượng sản phẩm.
 *                       example: 2
 *                     price:
 *                       type: number
 *                       description: Giá của mỗi sản phẩm.
 *                       example: 250000
 *     responses:
 *       201:
 *         description: Đơn hàng được tạo thành công.
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
 *                   example: Order created successfully
 *                 data:
 *                   type: object
 *                   description: Thông tin đơn hàng mới tạo.
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d2cbe469f0d901c8d0f6b2"
 *                     customer:
 *                       type: string
 *                       example: "60d1b8a3f1b2c001c8ab3c9a"
 *                     clientOrderCode:
 *                       type: string
 *                       example: "ORD123456"
 *                     shippingAddress:
 *                       type: object
 *                       properties:
 *                         toName:
 *                           type: string
 *                           example: "Nguyen Van A"
 *                         toPhone:
 *                           type: string
 *                           example: "0987654321"
 *                     orderItems:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           size:
 *                             type: string
 *                             example: "60d1bda49f1b2c001c8ab4ad"
 *                           shoes:
 *                             type: string
 *                             example: "60d1bd729f1b2c001c8ab4a0"
 *                           quantity:
 *                             type: number
 *                             example: 2
 *                           price:
 *                             type: number
 *                             example: 250000
 *       400:
 *         description: Thiếu thông tin cần thiết (order hoặc orderItems).
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
 *                   example: Server error
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

/**
 * @openapi
 * /v1/payments:
 *   post:
 *     summary: Tạo URL thanh toán
 *     description: Tạo một URL thanh toán để thực hiện giao dịch thanh toán với các thông tin bao gồm mã đơn hàng của khách hàng, số tiền thanh toán và số điện thoại của khách hàng.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientOrderCode:
 *                 type: string
 *                 description: Mã đơn hàng của khách hàng.
 *                 example: "ORD123456"
 *               totalAmount:
 *                 type: integer
 *                 description: Tổng số tiền cần thanh toán.
 *                 example: 100000
 *               toPhone:
 *                 type: string
 *                 description: Số điện thoại của khách hàng.
 *                 example: "0123456789"
 *     responses:
 *       200:
 *         description: Thành công - Trả về thông tin URL thanh toán và mã đơn hàng.
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
 *                   example: Successfully sent order
 *                 data:
 *                   type: object
 *                   properties:
 *                     orderID:
 *                       type: string
 *                       example: "ORD123456"
 *                     redirectUrl:
 *                       type: string
 *                       example: "https://paymentgateway.com/redirect"
 *                     paymentUrl:
 *                       type: string
 *                       example: "https://paymentgateway.com/pay?orderId=ORD123456"
 *       400:
 *         description: Bad Request - Thiếu các trường bắt buộc (clientOrderCode, totalAmount, toPhone).
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
 *       503:
 *         description: Service Unavailable - Phản hồi không xác định từ dịch vụ thanh toán.
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
 *                   example: Unknown response
 *       500:
 *         description: Server error - Lỗi khi xử lý yêu cầu trên máy chủ.
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
router.post('/payments', paymentController.createPaymentURL);

/**
 * @openapi
 * /v1/payments:
 *   get:
 *     summary: Lấy danh sách các khoản thanh toán
 *     description: Lấy thông tin danh sách các khoản thanh toán từ dịch vụ thanh toán bên ngoài.
 *     responses:
 *       200:
 *         description: Thành công - Trả về danh sách các khoản thanh toán.
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
 *                   example: Successfully sent order
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       orderId:
 *                         type: string
 *                         example: "ORD123456"
 *                       amount:
 *                         type: integer
 *                         example: 100000
 *                       status:
 *                         type: string
 *                         example: "Completed"
 *                       paymentDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-11-10T14:30:00Z"
 *       503:
 *         description: Service Unavailable - Phản hồi không xác định từ dịch vụ thanh toán.
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
 *                   example: Unknown response
 *       500:
 *         description: Server error - Lỗi khi xử lý yêu cầu trên máy chủ.
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
router.get('/payments', paymentController.getPayments);

/**
 * @openapi
 * /v1/payments/detail:
 *   post:
 *     summary: Kiểm tra chi tiết thanh toán
 *     description: Kiểm tra trạng thái thanh toán của một đơn hàng bằng cách sử dụng `orderId` và `clientOrderCode`.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: "ORD123456"
 *               clientOrderCode:
 *                 type: string
 *                 example: "MRC7890"
 *     responses:
 *       200:
 *         description: Trạng thái thanh toán của đơn hàng đã được kiểm tra thành công.
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
 *                   example: Order awaiting payment
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: processing
 *       400:
 *         description: Thiếu thông tin cần thiết (orderId hoặc clientOrderCode).
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
 *       503:
 *         description: Service Unavailable - Phản hồi không xác định từ dịch vụ thanh toán.
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
 *                   example: Unknown response
 *       500:
 *         description: Server error - Lỗi khi xử lý yêu cầu trên máy chủ.
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
router.post('/payments/detail', paymentController.checkPayment);

/**
 * @swagger
 * /v1/reviews:
 *   post:
 *     summary: "Create a shoes review"
 *     description: "Ảnh, video thì gửi lên với tag là files, giới hạn 5 cai tất cả."
 *     security:
 *       - BearerAuth: []  # Assuming you use Bearer token for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order:
 *                 type: string
 *                 description: "The ID of the order the review is for."
 *                 example: "606c72ef87f4e91e4b7c58a1"
 *               rating:
 *                 type: integer
 *                 description: "Rating for the shoes, between 1 and 5."
 *                 example: 4
 *               content:
 *                 type: string
 *                 description: "The content of the review."
 *                 example: "Great shoes, very comfortable!"
 *     responses:
 *       201:
 *         description: "Review created successfully."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Review created successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     shoes:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "606c72ef87f4e91e4b7c58a1"
 *                     customer:
 *                       type: string
 *                       example: "606c72ef87f4e91e4b7c58a2"
 *                     rating:
 *                       type: integer
 *                       example: 4
 *                     content:
 *                       type: string
 *                       example: "Great shoes, very comfortable!"
 *       400:
 *         description: "Bad request. Missing required fields."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "All fields are required"
 *       404:
 *         description: "Order not found."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Order not found"
 *       403:
 *         description: "Forbidden. You are not authorized to review this order."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "You are not authorized to review this order"
 *       500:
 *         description: "Internal server error."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Server error"
 *     multipart:
 *       - name: files
 *         description: "Optional files (images/videos) related to the review."
 *         required: false
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 files:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: binary
 *                   description: "An array of files (images or videos)."
 *             encoding:
 *               files:
 *                 contentType: multipart/form-data
 */
router.post('/reviews', upload.array('files', 5), shoesReviewController.createShoesReview);

/**
 * @swagger
 * /v1/reviews/shoes/{id}:
 *   get:
 *     summary: Get reviews for a specific shoes by its ID
 *     description: Retrieves all reviews for a specific shoes, including rating, content, images, and videos.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the shoes for which to retrieve reviews.
 *         schema:
 *           type: string
 *           example: 609b6e48f6d4c3f4a6d1e831
 *     responses:
 *       200:
 *         description: Successfully retrieved the reviews for the shoes.
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
 *                   example: Get Review Successful
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 60fbd9c8f8f9f52b8c3a4b7d
 *                       customer:
 *                         type: object
 *                         properties:
 *                           firstName:
 *                             type: string
 *                             example: John
 *                           lastName:
 *                             type: string
 *                             example: Doe
 *                           avatar:
 *                             type: string
 *                             example: https://example.com/avatar.jpg
 *                       rating:
 *                         type: number
 *                         example: 4
 *                       content:
 *                         type: string
 *                         example: Great shoes, very comfortable!
 *                       images:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: https://example.com/image1.jpg
 *                       videos:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: https://example.com/video1.mp4
 *                       feedback:
 *                         type: string
 *                         example: Highly recommend this product!
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2024-12-01T12:34:56Z
 *       400:
 *         description: Bad Request - shoesId is required.
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
 *                   example: ShoesId is required
 *       404:
 *         description: No reviews found for shoes.
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
 *                   example: No reviews found for shoes
 *       500:
 *         description: Internal server error.
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
 *                   example: "Server error: error message"
 */
router.get('/reviews/shoes/:id', shoesReviewController.getReviewByShoesId);

router.get('/statistical', statisticalController.getTop5);

/**
 * @swagger
 * /v1/notifications:
 *   get:
 *     summary: Get notifications for a user
 *     description: Fetches notifications for the currently authenticated user based on their user ID with pagination support.
 *     parameters:
 *       - in: query
 *         name: size
 *         required: false
 *         schema:
 *           type: integer
 *           example: 5
 *         description: The number of notifications per page (default is 5)
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The page number to retrieve (default is 1)
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *           example: 'order'
 *         description: Search term for filtering notifications by title (optional)
 *     responses:
 *       200:
 *         description: Successfully retrieved notifications with pagination
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
 *                   example: Get Notifications Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     notifications:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 5f4e6c4f7b4f8c1b2c8c9b1f
 *                           order:
 *                             type: string
 *                             example: 123456789
 *                           title:
 *                             type: string
 *                             example: Order Confirmation
 *                           content:
 *                             type: string
 *                             example: Your order has been confirmed and is being processed.
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2024-12-01T14:12:47.149+00:00
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         size:
 *                           type: integer
 *                           example: 5
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         totalItems:
 *                           type: integer
 *                           example: 50
 *                         totalPages:
 *                           type: integer
 *                           example: 10
 *                         hasNextPage:
 *                           type: boolean
 *                           example: true
 *                         hasPreviousPage:
 *                           type: boolean
 *                           example: false
 *                         nextPage:
 *                           type: integer
 *                           example: 2
 *                         prevPage:
 *                           type: integer
 *                           example: null
 *       500:
 *         description: Internal server error
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
router.get('/notifications', notificationController.getNotifications);

/**
 * @swagger
 * /v1/notifications/{id}:
 *   delete:
 *     summary: Delete a notification by its ID
 *     description: Deletes a notification for the currently authenticated user by the provided notification ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the notification to be deleted
 *         required: true
 *         schema:
 *           type: string
 *           example: 5f4e6c4f7b4f8c1b2c8c9b1f
 *     responses:
 *       200:
 *         description: Successfully deleted the notification
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
 *                   example: Delete Notification Successfully
 *       404:
 *         description: Notification not found
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
 *                   example: Notify not found
 *       500:
 *         description: Internal server error
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
router.delete('/notifications/:id', notificationController.deleteNotification);

/**
 * @swagger
 * /v1/orders/return/{id}:
 *   patch:
 *     summary: Request to return an order
 *     description: Updates the return information for a specific order, including the reason for the return and sets the initial status to "pending".
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order to be returned.
 *       - in: body
 *         name: body
 *         description: Reason for returning the order.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             reason:
 *               type: string
 *               description: The reason for returning the order.
 *               example: "Product was defective."
 *     responses:
 *       200:
 *         description: Order status updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Response status.
 *                   example: success
 *                 message:
 *                   type: string
 *                   description: Response message.
 *                   example: Order status updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: ID of the updated order.
 *                       example: "64a3f8b2b6a2a9a08c98c34b"
 *                     returnInfo:
 *                       type: object
 *                       description: Return information.
 *                       properties:
 *                         reason:
 *                           type: string
 *                           description: Reason for returning the order.
 *                           example: "Product was defective."
 *                         status:
 *                           type: string
 *                           description: Return status.
 *                           example: "pending"
 *                         statusTimestamps:
 *                           type: object
 *                           properties:
 *                             pending:
 *                               type: string
 *                               format: date-time
 *                               description: Timestamp when the return was initiated.
 *                               example: "2024-12-03T12:34:56.789Z"
 *       404:
 *         description: Order not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Response status.
 *                   example: error
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: Order not found
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Response status.
 *                   example: error
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: Server error
 */
router.patch('/orders/return/:id',orderController.returnOrder);

export default router;
