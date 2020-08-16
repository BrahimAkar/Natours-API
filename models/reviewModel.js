const mongoose = require('mongoose');
const dotenv = require('dotenv');
const slugify = require('slugify');
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

const Review = mongoose.model('Review', reviewShema);

module.exports = Review;
