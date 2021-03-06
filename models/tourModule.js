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
  .then()
 


const tourShema = new mongoose.Schema(
  {
    _id: String,
    name: {
      type: String,
      required: [true, 'Please add a tour name'],
      unique: true
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'a tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'a tour must have a groupe size']
    },
    difficulty: {
      type: String,
      required: [true, 'a tour must have a difficulty']
    },

    ratingsAverage: {
      type: Number,
      default: 4.5
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },

    price: {
      type: Number,
      required: [true, 'Please add price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        message: 'the price discount must be lower the the price',
        validator: function(val) {
          return val < this.price;
        }
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

tourShema.index({ price: 1, ratingsAverage: -1 });
tourShema.index({ slug: 1 });
tourShema.index({ startLocation: '2dsphere' });
tourShema.virtual('durationweeks').get(function() {
  return this.duration / 7;
});

// ! Virtual Populate:

tourShema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});

// ! Document middlware
tourShema.pre('save', function(next) {
  this.slug = slugify(this.name, {
    lower: true
  });
  next();
});

// ! Document middlware
tourShema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

tourShema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v'
  });
  next();
});

// ! Aggregation middleware

// tourShema.pre('aggregate', function(next) {
//   this.pipeline().unshift({
//     $match: { secretTour: { $ne: true } }
//   });
//   next();
// });

const Tour = mongoose.model('Tour', tourShema);

module.exports = Tour;
