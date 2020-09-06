const Tour = require('./../models/tourModule');
const Booking = require('./../models/bookingModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('./../models/userModel');
const getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) get the current booked tour
  const tour = await Tour.findById(req.params.tourId);
  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/mytours`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
        amount: tour.price * 100, // ?  cent
        currency: 'usd',
        quantity: 1
      }
    ]
  });
  // 3) send it to client
  res.status(200).send({
    status: 'success',
    session
  });
});

const createBookingCheckout = catchAsync(async session => {
  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.line_items[0].amount / 100;
  console.log('LOOK AT ME ', tour, user, price);
  await Booking.create({ tour, user, price });
});
const webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    // if error, stripe will receive it
    return res.status(400).send(`Webhook error ${error.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    createBookingCheckout(event.data.object);
  }
  res.status(200).json({ received: true });
};

const createBooking = factory.createOne(Booking);
const getBooking = factory.getOne(Booking);
const getAllBooking = factory.getAll(Booking);
const updateBooking = factory.updateOne(Booking);
const deleteBooking = factory.deleteOne(Booking);
module.exports = {
  getCheckoutSession,
  createBooking,
  getBooking,
  getAllBooking,
  updateBooking,
  deleteBooking,
  webhookCheckout
};
