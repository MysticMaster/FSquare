import express from 'express';
import multer from 'multer';
import brandController from "../../controllers/api/admin/brandController.js";
import adminController from "../../controllers/api/admin/adminController.js";
import categoryController from "../../controllers/api/admin/categoryController.js";
import shoesController from "../../controllers/api/admin/shoesController.js";
import classificationController from "../../controllers/api/admin/classificationController.js";
import sizeController from "../../controllers/api/admin/sizeController.js";
import orderController from "../../controllers/api/admin/orderController.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {fileSize: 25 * 1024 * 1024}
});

router.post('/v1/admins', upload.single('file'), adminController.createAdmin);
router.get('/v1/admins/profile', adminController.getProfile);

router.post('/v1/brands', upload.single('file'), brandController.createBrand);
router.get('/v1/brands', brandController.getBrands);
router.get('/v1/brands/:id', brandController.getBrandById);
router.patch('/v1/brands/:id', upload.single('file'), brandController.updateBrand);

router.post('/v1/categories', upload.single('file'), categoryController.createCategory);
router.get('/v1/categories', categoryController.getCategories);
router.get('/v1/categories/:id', categoryController.getCategoryById);
router.patch('/v1/categories/:id', upload.single('file'), categoryController.updateCategory);

router.post('/v1/shoes', upload.single('file'), shoesController.createShoes);
router.get('/v1/shoes', shoesController.getShoes);
router.get('/v1/shoes/:id', shoesController.getShoesById);
router.patch('/v1/shoes/:id', upload.single('file'), shoesController.updateShoes);

router.post('/v1/classifications', upload.fields([
    {name: 'file', maxCount: 1}
]), classificationController.createClassification);
router.get('/v1/classifications/shoes/:id', classificationController.getClassificationsByIdShoes);
router.get('/v1/classifications/:id', classificationController.getClassificationById);
router.patch('/v1/classifications/:id', upload.single('file'), classificationController.updateClassification);
router.patch('/v1/classifications/media/:id', upload.array('files'), classificationController.addMedias);
router.delete('/v1/classifications/media/:id', classificationController.deleteMedia);

router.post('/v1/sizes', sizeController.createSize);
router.get('/v1/sizes/classification/:id', sizeController.getSizeByIdClassification);
router.get('/v1/sizes/:id', sizeController.getSizeById);
router.patch('/v1/sizes/:id', sizeController.updateSize);

router.get('/v1/orders', orderController.getOrders);
router.get('/v1/orders/:id', orderController.getOrderById);
router.patch('/v1/orders/:id', orderController.updateOrderStatus);

export default router;
