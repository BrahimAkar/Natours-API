const express = require('express');

const {
  createUser,
  deleteUser,
  updateUser,
  getAllUsers,
  getUser
} = require('../controllers/userController');

const route = express.Router();
const authController = require('./../controllers/authController');
const userController = require('../controllers/userController');

route.post('/signup', authController.signup);
route.post('/login', authController.login);
route.get('/logout', authController.logout);
route.post('/forgotpassword', authController.forgotpassword);
route.patch('/resetpassword/:token', authController.resetpassword);

// This midllware makes sure that user is authenticated
route.use(authController.protect);

route.patch('/updatepassword', authController.updatePassword);
route.patch('/updateMe', userController.updateMe);
route.delete('/deleteMe', userController.deleteMe);
route.get('/me', userController.getMe, userController.getUser);

route.use(authController.restrictTo('admin'));

route
  .route('/')
  .get(getAllUsers)
  .post(createUser);

route
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = route;
