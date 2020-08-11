const User = require('./../models/userModel');

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
const updateUser = (req, res) => {
  console.log('update User');
};
const deleteUser = (req, res) => {
  console.log('delete User');
};

module.exports = { createUser, deleteUser, updateUser, getAllUsers, getUser };
