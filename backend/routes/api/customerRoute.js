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

router.get('/v1/brands', brandController.getBrands);

router.get('/v1/categories', categoryController.getCategories);

router.get('/v1/shoes', shoesController.getShoes);
router.get('/v1/shoes/:id', shoesController.getShoesById);

router.get('/v1/classifications/shoes/:id', classificationController.getClassificationsByIdShoes);
router.get('/v1/classifications/:id', classificationController.getClassificationById);

router.get('/v1/sizes/classifications/:id', sizeController.getSizesByIdClassification);
router.get('/v1/sizes/:id', sizeController.getSizeById);

router.post('/v1/favorites', favoriteController.createOrDeleteFavorite);
router.get('/v1/favorites', favoriteController.getFavorites);
router.delete('/v1/favorites/:id', favoriteController.deleteFavorite);

router.post('/v1/bags', bagController.createBag);
router.get('/v1/bags', bagController.getBags);
router.patch('/v1/bags/:id', bagController.updateBagQuantity);
router.delete('/v1/bags', bagController.deleteBags);
router.delete('/v1/bags/:id', bagController.deleteBagById);

export default router;
