const Tour = require('../models/tourModule');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getTour = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const tour = await Tour.findOne({ slug: slug }).populate({ path: 'reviews' });
  if (!tour) {
    return next(new AppError('No Document found with that ID', 404));
  }
  console.log(tour);
  res.status(200).render('tour', {
    tour,
    title: 'The forest tiker'
  });
});
exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All tours',
    tours
  });
});
exports.getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'OK'
  });
});

exports.getAccount = (req, res, next) => {
  res.status(200).render('account', {
    title: 'My account'
  });
};
