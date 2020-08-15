const AppError = require('../utils/appError');
const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

const getAllReviews = catchAsync(async (req, res, next) => {
  // if tourId exist
  const filter = {};
  if (req.body.tourId) filter = { tour: req.params.tourId };

  const reviews = await Review.find(filter);

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

const deleteReview = factory.deleteOne(Review);

module.exports = { getAllReviews, createReview, deleteReview };
