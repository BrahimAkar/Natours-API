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

route.post('/signup', authController.signup);
route.post('/login', authController.login);

route.post('/forgotpassword', authController.forgotpassword);
route.patch('/resetpassword/:token', authController.resetpassword);
route.patch(
  '/updatepassword',
  authController.protect,
  authController.updatePassword
);
route.patch('/updateMe', authController.protect, authController.updateMe);
route.delete('/deleteMe', authController.protect, authController.deleteMe);
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
