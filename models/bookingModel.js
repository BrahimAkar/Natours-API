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

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Booking must belong to a tour']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a user']
  },
  price: {
    type: Number,
    required: [true, 'Booking must have a price']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  paid: {
    type: Boolean,
    default: true
  }
});

bookingSchema.pre(/^find/, function(next) {
  this.populate({ path: 'tour', select: 'name' }).populate('user');
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
