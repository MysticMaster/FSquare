import express from 'express';
import multer from 'multer';
import brandController from "../../controllers/api/admin/brandController.js";
import adminController from "../../controllers/api/admin/adminController.js";
import categoryController from "../../controllers/api/admin/categoryController.js";
import shoesController from "../../controllers/api/admin/shoesController.js";
import classificationController from "../../controllers/api/admin/classificationController.js";
import sizeController from "../../controllers/api/admin/sizeController.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {fileSize: 25 * 1024 * 1024}
});

router.post('/admins', upload.single('file'), adminController.createAdmin);

router.post('/brands', upload.single('file'), brandController.createBrand);
router.get('/brands', brandController.getBrands);
router.get('/brands/:id', brandController.getBrandById);
router.patch('/brands/:id', upload.single('file'), brandController.updateBrand);

router.post('/categories', upload.single('file'), categoryController.createCategory);
router.get('/categories', categoryController.getCategories);
router.get('/categories/:id', categoryController.getCategoryById);
router.patch('/categories/:id', upload.single('file'), categoryController.updateCategory);

router.post('/shoes', upload.single('file'), shoesController.createShoes);
router.get('/shoes', shoesController.getShoes);
router.get('/shoes/:id', shoesController.getShoesById);
router.patch('/shoes/:id', upload.single('file'), shoesController.updateShoes);

router.post('/classifications', upload.fields([
    {name: 'file', maxCount: 1},
    {name: 'files', maxCount: 6}
]), classificationController.createClassification);
router.get('/classifications/shoes/:id', classificationController.getClassificationsByIdShoes);
router.get('/classifications/:id', classificationController.getClassificationById);
router.patch('/classifications/:id', classificationController.updateClassification);
router.patch('/classifications/:id/media', upload.array('files'), classificationController.addMedias);
router.delete('/classifications/:id/media', classificationController.deleteMedia);

router.post('/sizes',sizeController.createSize);
router.get('/sizes/classifications/:id',sizeController.getSizeByIdClassification);
router.get('/sizes/:id', sizeController.getSizeById);
router.patch('/sizes/:id', sizeController.updateSize);

export default router;
