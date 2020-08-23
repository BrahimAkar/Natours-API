const Tour = require('../models/tourModule');
const CatchAsync = require('./../utils/catchAsync');
const catchAsync = require('./../utils/catchAsync');

exports.getTour = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const tour = await Tour.findOne({ slug: slug }).populate({ path: 'reviews' });
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
