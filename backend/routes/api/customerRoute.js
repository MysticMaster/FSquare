import express from 'express';
import multer from 'multer';
import brandController from "../../controllers/api/customer/brandController.js";
import categoryController from "../../controllers/api/customer/categoryController.js";
import shoesController from "../../controllers/api/customer/shoesController.js";
import classificationController from "../../controllers/api/customer/classificationController.js";
import sizeController from "../../controllers/api/customer/sizeController.js";
import favoriteController from "../../controllers/api/customer/favoriteController.js";
import bagController from "../../controllers/api/customer/bagController.js";

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

router.get('/sizes/classifications/:id', sizeController.getSizesByIdClassification);
router.get('/sizes/:id', sizeController.getSizeById);

router.post('/favorites', favoriteController.createOrDeleteFavorite);
router.get('/favorites', favoriteController.getFavorites);
router.delete('/favorites/:id', favoriteController.deleteFavorite);

router.post('/bags', bagController.createBag);
router.get('/bags', bagController.getBags);
router.patch('/bags/:id',bagController.updateBagQuantity);
router.delete('/bags/:id',bagController.deleteBag);

export default router;
