const mongoose = require("mongoose");
const slugify = require("slugify");

const groceryItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Grocey item must have a name."],
    unique: true,
  },
  description: {
    type: String,
  },
  quantity: {
    type: Number,
    required: [true, "amount of the item must be defined."],
  },
  price: {
    type: Number,
    required: [true, "Price of the item must be defined"],
  },
  discount: {
    type: Number,
    default: 0
  },
  ordersQuantity: {
    type: Number,
    default: 1001
  },
  image: String,
  slug: { type: String },
  averageRating: {
    type: Number,
    min: 1,
    max: 5,
    set: (val) => Math.round(val * 10) / 10,
  },
  ratingsQuantity: Number,
  isOrganic: Boolean,
  isFeatured: Boolean,
  category: {
    type: String,
    enum: ['fruits', 'vegetables', 'packed seafoods', 'frozen foods', 'poultry', 'dairy', 'meats', 'grocery'],
    required: true,
  },
  parameter: {
    type: String,
    required: [true, 'parameter is required']
  },
  finalPrice: {
    type: Number
  }
});

groceryItemSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
groceryItemSchema.pre('save', function(next) {
  this.finalPrice = this.price - this.price*this.discount/100
  next();
});
  

const groceryItems = mongoose.model("groceryItems", groceryItemSchema);

module.exports = groceryItems;
