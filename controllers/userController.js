const User = require('./../models/userModel');
const factory = require('./handlerFactory');

const createUser = (req, res) => {
  console.log('create User');
};
const getAllUsers = factory.getAll(User);
const getUser = factory.getOne(User);

// DO NOT UPDATE PASSOWORD WITH THIS
const updateUser = factory.updateOne(User);
const deleteUser = factory.deleteOne(User);

module.exports = { createUser, deleteUser, updateUser, getAllUsers, getUser };
