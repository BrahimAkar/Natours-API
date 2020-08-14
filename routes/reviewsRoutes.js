const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

// ! matches
//  POST tours/18d9azd1a/reviews
//  POST /reviews

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

module.exports = router;
