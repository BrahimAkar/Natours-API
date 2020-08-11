const mongoose = require('mongoose');
const dotenv = require('dotenv');
const slugify = require('slugify');
dotenv.config({ path: './../config.env' });

const DB =
  'mongodb+srv://brahim123:brahim123@cluster0-gvzjk.mongodb.net/natours?retryWrites=true&w=majority';

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then();
const reviewShema = new mongoose.Schema({
  review: {
    type: String
  },
  rating: {
    type: Number
  },
  createdAt: {
    type: Date.now()
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

tourShema.pre(/^find/, function(next) {
  this.populate({
    path: 'user'
  });
  next();
});

const Review = mongoose.model('Review', reviewShema);

module.exports = Review;
