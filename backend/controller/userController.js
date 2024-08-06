const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');
const Cart = require('../models/cartModel');
const Email = require('../utils/email');

exports.addItemToCart = catchAsync(async (req, res, next) => {
    const cartData = req.body.cart;
    const user = await User.findById(req.user.id);

    const cart = [...user.cart, ...cartData];
    user.cart = cart;
    user.save({validateBeforeSave: false});

    res.status(200).json({
        status: 'success',
        data: {user}
    });

});

exports.getAllUser = catchAsync(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        status: 'success',
        data: {users}
    });
});

exports.getMe =  catchAsync(async (req, res, next) => {
    req.params.id = req.user.id;
    next();
})

exports.getUser = catchAsync(async (req, res, next) => {
    const users = await User.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        data: {users}
    });

});

exports.updateUser = catchAsync(async (req, res, next) => {
    const {name, email, address, pincode} = req.body;
    const userId = req.user.id; 
    if(email && name) {
        const data = {'name': name, 'email': email, 'address': address, 'pincode': pincode}
        const user = await User.findByIdAndUpdate(userId, data,
            { new: true, runValidators: true });
        res.status(200).json({
            status: 'success',
            data: {user}
        });
    }
    else {
        res.status(400).json({
            status: 'fail',
            error: {message: 'Email or Name is invalid'}
        });
    }
   
    

});

exports.deleteUser = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    
    // Delete cart associated with user
    const cart = await Cart.findOneAndDelete({ userId });
    
    // Delete user
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }
  
    res.status(200).json({
      status: 'success',
      data: { user }
    });
  });
  

exports.updateOrderHistory = catchAsync(async (req, res, next) => {
    const orderData = req.body.cart;
    const user = req.user;
    const updatedHistory = [...user.orderHistory, ...orderData];
    user.orderHistory = updatedHistory;
    user.save({validateBeforeSave: false});
    
    res.status(200).json({
        status: 'success',
        data: {user}
    });

});

exports.updateCart = catchAsync(async (req, res, next) => {
    const updatedCart = req.body.items;
    const user = req.user; 
    user.cart = updatedCart;
    user.save({validateBeforeSave: false});
    
    res.status(200).json({
        status: 'success',
        data: {user}
    });

});

exports.sendMessage = catchAsync(async (req, res, next) => {
    const {email, message} = req.body;
    const data = {email, message}
    new Email({name: 'Admin Dummy', email: process.env.ADMIN_EMAIL}).sendSupportMessage(data)
    res.status(200).json({status: "success", message: "message sent"})
})

