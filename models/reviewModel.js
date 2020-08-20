const mongoose = require('mongoose');
const dotenv = require('dotenv');
const slugify = require('slugify');
const Tour = require('./tourModule');
dotenv.config({ path: './../config.env' });

const DB = `mongodb+srv://${process.env.DATABASE_PASSWORD}:${process.env.DATABASE_PASSWORD}@cluster0-gvzjk.mongodb.net/natours?retryWrites=true&w=majority`;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })

  .then();
const reviewShema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must be long to a tour']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must be long to a user']
    }
  },
  {
    // make sure when we have a virtual property, show it as output
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewShema.pre(/^find/, function(next) {
  this.populate({
    path: 'tour',
    select: 'name'
  }).populate({
    path: 'user',
    select: '-_id name photo'
  });

  next();
});

reviewShema.statics.calcAverageRatings = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
  console.log('stats', stats);
};

reviewShema.post('save', function() {
  // this points to current review
  this.constructor.calcAverageRatings(this.tour);
});

//! for this we dont have document middlware, but only query middlware so we dont have direcaccess
//! to direct document.
//? findByIdAndUpdate ==> short hand for findOneAndUpdate
//? findByIdAndDelete ==> short hand for findOneAndDelete

reviewShema.pre(/^findOneAnd/, async function(next) {
  //! this means query
  //! and when we executed it, then we get a Document
  this.r = await this.findOne();
  next();
});

reviewShema.post(/^findOneAnd/, async function() {
  console.log('this  r tour', this.r.tour);
  await this.r.constructor.calcAverageRatings(this.r.tour._id);
});

const Review = mongoose.model('Review', reviewShema);

module.exports = Review;
