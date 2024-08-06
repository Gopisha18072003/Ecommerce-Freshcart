// controllers/cartController.js
const Cart = require('../models/cartModel');

exports.createCart = async (req, res) => {
  const userId  = req.user._id;
  try {
    const newCart = await Cart.create({ userId, items: [], total: 0 });
    res.status(201).json({
      status: 'success',
      data: newCart,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail', 
      message: error.message,
    });
  }
};

// controllers/cartController.js
exports.getCart = async (req, res) => {
    try {
      const userId = req.user._id
      const cart = await Cart.findOne({ userId }).populate('items.productId');
      if (!cart) {
        return res.status(404).json({
          status: 'fail',
          message: 'Cart not found',
        });
      }
    // Transform the items to move product details into a 'product' field
    const transformedItems = cart.items.map(item => ({
      product: item.productId,
      quantity: item.quantity,
      _id: item._id
    }));

    // Create a new cart object with the transformed items
    const transformedCart = {
      ...cart._doc,
      items: transformedItems
    };

    res.status(200).json({
      status: 'success',
      data: transformedCart,
    });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error.message,
      });
    }
  };

  // controllers/cartController.js
exports.updateCart = async (req, res) => {
    const cartData = req.body;
    let total = 0;
    let reducedItems = []
    if(cartData) {
      total = cartData.total // calculate total
      reducedItems = cartData.items.map(item => ({
        productId: item.product._id,
        quantity: item.quantity
      }));
    }
    
    const userId = req.user._id
    try {
      const updatedCart = await Cart.findOneAndUpdate(
        { userId },
        { items: reducedItems, total },
        { new: true, runValidators: true }
      );
      if (!updatedCart) {
        return res.status(404).json({
          status: 'fail',
          message: 'Cart not found',
        });
      }
      res.status(200).json({
        status: 'success',
        data: updatedCart,
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error.message,
      });
    }
  };
  
  exports.removeItemFromCart = async (req, res) => {
    const { productId } = req.body; // Product ID to be removed
  
    const userId = req.user._id;
    try {
      // Fetch the cart for the user
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({
          status: 'fail',
          message: 'Cart not found',
        });
      }
  
      // Filter out the item to be removed and recalculate the total
      const updatedItems = cart.items.filter(item => item.productId.toString() !== productId);
      const total = updatedItems.reduce((acc, item) => acc + (item.quantity * item.product.price), 0);
  
      // Update the cart with the new items and total
      cart.items = updatedItems;
      cart.total = total;
      const updatedCart = await cart.save();
  
      res.status(200).json({
        status: 'success',
        data: updatedCart,
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error.message,
      });
    }
  };

  
// controllers/cartController.js
exports.resetCart = async (req, res) => {
  const userId = req.user._id;
  try {
    const updatedCart = await Cart.findOneAndUpdate(
      { userId },
      { items: [], total: 0 },
      { new: true, useFindAndModify: false }
    );

    if (!updatedCart) {
      return res.status(404).json({
        status: 'fail',
        message: 'Cart not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        cart: updatedCart,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};