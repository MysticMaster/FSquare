import express from 'express';
import customerController from "../../controllers/auth/customerController.js";
import adminController from "../../controllers/auth/adminController.js";

const router = express.Router();

router.post('/v0/authentications', adminController.authentication);

router.post('/v1/authentications', customerController.authentication);
router.post('/v1/registrations', customerController.registration);
router.post('/v1/verifications', customerController.verification);

export default router;

