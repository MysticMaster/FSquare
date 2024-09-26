import express from 'express';
import customerController from "../../controllers/auth/customerController.js";
import adminController from "../../controllers/auth/adminController.js";

const router = express.Router();

router.post('/admin/v1/authentications', adminController.authentication);

router.post('/customer/v1/authentications', customerController.authentication);
router.post('/customer/v1/registrations', customerController.registration);
router.post('/customer/v1/verifications', customerController.verification);

export default router;

