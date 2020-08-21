const express = require('express');
const appError = require('./utils/appError');
const GlobalErrorHandler = require('./controllers/errorController');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const path = require('path');
dotenv.config({ path: './config.env' });

const app = express();

//? Template engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
//? serving static files
app.use(express.static(path.join(__dirname, 'public')));

const morgan = require('morgan');
const tourRouter = require('./routes/toursRoutes');
const userRouter = require('./routes/usersRoutes');
const reviewRouter = require('./routes/reviewsRoutes');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
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

app.use('/api', limiter);

app.use(express.json());

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
app.get('/', (req, res, next) => {
  res.status(200).render('base', {
    tour: 'The forest taker',
    user: 'Brahim akarouch'
  });
});
app.get('/overview', (req, res, next) => {
  res.status(200).render('overview', {
    title: 'All tours'
  });
});
app.get('/tour', (req, res, next) => {
  res.status(200).render('tour', {
    title: 'The forest tiker'
  });
});
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new appError('we cant find this route at the moment', 404));
});
// app.use('/api/v1/tours',tourRouter)

app.use(GlobalErrorHandler);

module.exports = app;
