const AppError = require('../utils/appError');
const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');

const getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  res.status(200).send({
    status: 'success',
    results: reviews.length,
    data: { reviews }
  });
});

const createReview = catchAsync(async (req, res, next) => {
  await Review.create({
    review: req.body.review,
    rating: req.body.rating,
    user: req.user._id,
    tour: req.body.tour
  });

  res.status(200).send({
    status: 'success'
  });
});

module.exports = { getAllReviews, createReview };
