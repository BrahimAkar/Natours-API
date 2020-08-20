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

const getAllTours = factory.getAll(Tour);
const getTour = factory.getOne(Tour, 'reviews');
const createTour = factory.createOne(Tour);
const deleteTour = factory.deleteOne(Tour);
const updateTour = factory.updateOne(Tour);

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

const getToursWithin = catchAsync(async (req, res, next) => {
  console.log(req.params);
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  if (!lat || !lng) {
    return next(new AppError('Please provide a langitude & a latitude', 400));
  }

  //? geoWithin ==> find documents within a geomitry
  const tours = await Tour.find({
    //? mongoose expect Earth's Equatorial Radius
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });
  res.status(200).send({
    results: tours.length,
    status: 'success',
    tours
  });
  console.log('radius', radius);
});

const getDistances = catchAsync(async (req, res, next) => {
  console.log(req.params);
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  if (!lat || !lng) {
    return next(new AppError('Please provide a langitude & a latitude', 400));
  }
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
  const distances = await Tour.aggregate([
    // for the geospatial thre is one single stage: $geoNear
    {
      // always needs to be the first one on the pipline
      $geoNear: {
        // is the point from which to calculate the distances ( the point we difine here and all startLocation )
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        // the field where all the calculated distances will be stored
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);

  res.status(200).send({
    status: 'success',
    data: {
      data: distances
    }
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
  getMonthlyPlan,
  getToursWithin,
  getDistances
};
