const express = require('express');
const userController = require('./../controller/userController');
const authController = require('./../controller/authController');
const cartController = require('../controller/cartController');
const fileUpload = require('../utils/fileUploads');
const orderController = require('../controller/orderController');
const reviewController = require('../controller/reviewController');
const router = express.Router();

// Implementation done
router.route('/signup').post(authController.signUp);
router.route('/login').post(authController.login);
router.route('/logout').post(authController.logOut);
router.route('/refresh').get(authController.refresh);
router.route('/updateimage').post(authController.protect, fileUpload.single('image'), authController.uploadImage);
router.route('/updateMe').patch(authController.protect, userController.updateUser);
router.get('/me', authController.protect, userController.getMe, userController.getUser);
router.patch('/updatepassword',authController.protect, authController.updatePassword);
router.patch('/updatepassword',authController.protect, authController.updatePassword);
router.delete('/deleteme', authController.protect, userController.deleteUser);

router.post('/createCart', authController.protect, cartController.createCart)
router.get('/getCart', authController.protect, cartController.getCart)
router.patch('/updateCart', authController.protect, cartController.updateCart)
router.patch('/removeFromCart', authController.protect, cartController.removeItemFromCart)

router.patch('/resetCart', authController.protect, cartController.resetCart)

router.route('/forgotpassword').post(authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);

router.get('/getMyOrder', authController.protect, orderController.getMyOrders);
router.get('/getAllOrders', authController.protect, authController.restrictTo('admin'), orderController.getAllOrders);
router.get('/getOrder/:id', authController.protect, authController.restrictTo('admin'), orderController.getOrder);
router.post('/support', authController.protect, userController.sendMessage);

router.get('/getAllUsers',authController.restrictTo(['admin']), userController.getAllUser);

router.get('/:id', userController.getUser);

// creating Review
router.post('/review', authController.protect,authController.restrictTo('user'), reviewController.createReview);

module.exports = router;