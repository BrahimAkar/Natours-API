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
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  await Review.create(req.body);

  res.status(200).send({
    status: 'success'
  });
});

module.exports = { getAllReviews, createReview };
