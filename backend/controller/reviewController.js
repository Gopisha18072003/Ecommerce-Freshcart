const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Reviews = require('./../models/reviewModel');

exports.getAllReviews = catchAsync(async (req, res, next) => {
    const id = req.params.itemId
    const reviews = await Reviews.find({'product':id});
    if(reviews) {
        res.status(200).json({
            status: 'success',
            result: reviews.length,
            data: {reviews}
        })
    } else {
        res.status(200).json({
            status: 'success',
            result: 0,
            data: {reviews: null}
        })
    }

})

exports.createReview = catchAsync(async (req, res, next) => {
    const userId = req.user._id;
    const {productId, rating, comment} = req.body
    const data = {
        rating: rating,
        comment: comment,
        product: productId,
        user: userId
    }
    const review = await Reviews.create(data);
    res.status(200).json({
        status: 'success',
        data: {review}
    })
})