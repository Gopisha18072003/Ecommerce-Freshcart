const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  items: [
    {
      productId: { type: mongoose.Types.ObjectId, required: true, ref: 'groceryItems' },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
  total: { type: Number, required: true }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
