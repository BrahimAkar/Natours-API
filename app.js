const express = require('express');
const appError = require('./utils/appError');
const GlobalErrorHandler = require('./controllers/errorController');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
dotenv.config({ path: './config.env' });

const app = express();
// const fs = require('fs');
const morgan = require('morgan');

const tourRouter = require('./routes/toursRoutes');
const userRouter = require('./routes/usersRoutes');
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

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

app.set('views', './views');
app.set('view engine', 'ejs');

const name = {
  name: 'Brahim Akarouch',
  approved: true,
  description:
    'Im a fullStack web developer, also i can create android apps using flutter, i have a good experience with Adobe pack, like photoshop, illustrator, premier, Xd etc ...',
  birthay: 'Mar 21, 1995',
  job: 'Web & Mobile Developer',
  img:
    'https://avatars3.githubusercontent.com/u/28510601?s=460&u=2d4b0c1a5e3b2ba6c570f470614cb696a31d2bf3&v=4'
};

app.get('/home', (req, res) => {
  console.log(req);
  res.render('index', { name: name });
});

app.all('*', (req, res, next) => {
  next(new appError('we cant find this route at the moment', 404));
});
// app.use('/api/v1/tours',tourRouter)

app.use(GlobalErrorHandler);

module.exports = app;
