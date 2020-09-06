const express = require('express');
const appError = require('./utils/appError');
const GlobalErrorHandler = require('./controllers/errorController');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const path = require('path');
const bodyParser = require('body-parser');
dotenv.config({ path: './config.env' });

const app = express();
//? Template engine

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// implements CORS
app.use(
  cors({
    origin: 'https://www.brahim.com'
  })
);

// OPTIONS is like PUT PATCH ETC...
app.options('*', cors());

//? serving static files
app.use(express.static(path.join(__dirname, 'public')));
const morgan = require('morgan');
const tourRouter = require('./routes/toursRoutes');
const userRouter = require('./routes/usersRoutes');
const reviewRouter = require('./routes/reviewsRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const bookingController = require('./controllers/bookingController');
const viewRouter = require('./routes/viewRoutes');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
// app.use(express.static(''));

// Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ! GLOBAL LIMIT
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requets from this ip, please try again!'
});

app.use(cors());
app.use('/api', limiter);

app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  bookingController.webhookCheckout
);
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// ! DATA SANITIZATION AGAINST NoSQL query injection:
app.use(mongoSanitize());

// ! DATA SANITIZATION AGAINST XSS:
app.use(xss());

// ! HPP ( HTTP PARAMETER POLLUTION ):
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);
// app.use(compression());

app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new appError('we cant find this route at the moment', 404));
});
// app.use('/api/v1/tours',tourRouter)

app.use(GlobalErrorHandler);

module.exports = app;
