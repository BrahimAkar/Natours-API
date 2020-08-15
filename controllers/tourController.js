const Tour = require('./../models/tourModule');
const Test = require('./../models/testingModel');
const ApiFeatures = require('../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-price,-ratingsAverage';
  req.query.fields = 'name,price,summary';
  next();
};

const getAllTests = catchAsync(async (req, res, next) => {
  const reqObj = { ...req.query };
  const excludedFields = ['page', 'limit', 'sort', 'fields'];
  excludedFields.forEach(element => {
    delete reqObj[element];
  });
  let quertStr = JSON.stringify(reqObj);
  quertStr = quertStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  let query = Test.find(JSON.parse(quertStr));

  let results = query;
  res.send({
    success: true,
    data: results
  });
});

const getAllTours = catchAsync(async (req, res, next) => {
  // Execute Query
  const features = new ApiFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();
  const tours = await features.query;
  res.status(201).json({
    status: 'Success',
    resuluts: tours.length,
    data: { tours }
  });
});
const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate({
    path: 'reviews'
  });
  // Tour.findOne({ _id: req.params.id })

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});

const createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    success: true,
    data: {
      tour: newTour
    }
  });
});

const updateTour = catchAsync(async (req, res, next) => {
  const id = req.params.id * 1;
  const item = tours.find(el => el.id === id);
  item
    ? res.send({
        success: true,
        message: 'time updated successfully',
        data: item
      })
    : res.send({ success: false, message: "we can't find this item" });
});

const deleteTour = factory.deleteOne(Tour);

const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = '2020'; // 2021
  console.log(year);
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: { $gte: new Date(`${year}-01-01`) }
      }
    }
  ]);
  res.status(200).json({
    status: 'success',
    data: { plan }
  });
});

const getTourStats = catchAsync(async (req, res, next) => {
  const stats = Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: '$difficulty',
        numOfTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    }
  ]);
  const data = await stats;
  res.status(201).json({
    status: 'Success',
    data: { data }
  });
});

module.exports = {
  createTour,
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getAllTests,
  getTourStats,
  getMonthlyPlan
};
