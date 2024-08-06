const express = require("express");
const groceryController = require("./../controller/groceryController");
const reviewRoutes = require('./reviewRoutes');
const authController = require('./../controller/authController');
const router = express.Router();
const productFileUploads = require('../utils/productImageUploads');

router.use(express.json());

router
  .route("/")
  .get( groceryController.getAllGroceries)
router.post('/addGrocery', authController.protect, authController.restrictTo('admin'), productFileUploads.single("image"), groceryController.addGrocery);
router.get('/category', groceryController.getNoOfItemsInCategory)

router.route('/updateimage/:id').post(authController.protect, productFileUploads.single("image"), authController.uploadProductImage);

router
  .route("/:id")
  .get(groceryController.getGrocery)
  .patch(authController.protect, authController.restrictTo('admin'),groceryController.updateGrocery)
  .delete(authController.protect, authController.restrictTo('admin'),groceryController.deleteGrocery);

router.use('/:itemId/reviews', reviewRoutes);


module.exports = router;
