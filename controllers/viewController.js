const Tour = require('../models/tourModule');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const Booking = require('../models/bookingModel');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking') {
    res.locals.alert =
      'Your booking was successful! Please check your email for a confirmation. if your booking doesnt show up here immediatly, Please come back later.';
  }
  next();
};

exports.getTour = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const tour = await Tour.findOne({ slug: slug }).populate({ path: 'reviews' });
  if (!tour) {
    return next(new AppError('No Document found with that ID', 404));
  }
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

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings of this user
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tour with the return Id's
  const tourIds = bookings.map(el => el.tour._id);
  const tours = await Tour.find({ _id: { $in: tourIds } });
  res.status(200).render('overview', {
    title: 'My booked tours',
    tours
  });
});
