const User = require('./../models/userModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');

const createUser = (req, res) => {
  console.log('create User');
};
const getAllUsers = factory.getAll(User);
const getUser = factory.getOne(User);

// DO NOT UPDATE PASSOWORD WITH THIS
const updateUser = factory.updateOne(User);
const deleteUser = factory.deleteOne(User);

const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        'This route is not for password updates, Please use /updatePassword',
        400
      )
    );

  // ! Function to filter :
  const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
      if (allowedFields.includes(el)) {
        newObj[el] = obj[el];
      }
    });
    return newObj;
  };
  // filtered out unwanted fields names that are not allowed to be updated
  const filtredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filtredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).send({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'Success',
    data: null
  });
});

const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

module.exports = {
  createUser,
  deleteUser,
  updateUser,
  getAllUsers,
  getUser,
  deleteMe,
  updateMe,
  getMe
};
