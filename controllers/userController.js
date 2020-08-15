const User = require('./../models/userModel');
const factory = require('./handlerFactory');

const createUser = (req, res) => {
  console.log('create User');
};
const getAllUsers = async (req, res, next) => {
  const users = await User.find();
  res.send({
    status: 'success',
    data: {
      users
    }
  });
  console.log('get all Users');
};
const getUser = (req, res) => {
  console.log('Get Specific User');
};

// DO NOT UPDATE PASSOWORD WITH THIS
const updateUser = factory.updateOne(User);
const deleteUser = factory.deleteOne(User);

module.exports = { createUser, deleteUser, updateUser, getAllUsers, getUser };
