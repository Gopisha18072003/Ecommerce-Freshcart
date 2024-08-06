const mongoose = require("mongoose");
const groceryItems = require("./groceryModel");

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: [true, "rating is required"],
    },
    comment: {
      type: "String",
      required: [true, "comment is required"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "groceryItems",
      required: [true, "Id of item is required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Id of user is required"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
  }
);

reviewSchema.indexes({product: 1, user: 1}, {unique: true});

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name image",
  });
  next();
});

reviewSchema.statics.calcAvgRating = async function (productId) {
  const result = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "$product",
        nRatings: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if(result.length > 0){
    await groceryItems.findByIdAndUpdate(productId, {
        ratingsQuantity: result[0].nRatings,
        averageRating: result[0].avgRating,
    });

  }else {
    await groceryItems.findByIdAndUpdate(productId, {
        ratingsQuantity: 0,
        averageRating: 4.5,
    });
  }
};

reviewSchema.post("save", function () {
  this.constructor.calcAvgRating(this.product);
});

const Review = mongoose.model("Reviews", reviewSchema);

module.exports = Review;
