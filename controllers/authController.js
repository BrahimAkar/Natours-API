const { promisify } = require('util');
const crypto = require('crypto');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');
const Email = require('./../utils/email');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};
const createThenSendToke = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }
  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role
  });
  const url = `${req.protocol}://${req.get('host')}/me`;
  new Email(newUser, url).sendWelcome();
  createThenSendToke(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check if email and password exists in req.body
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // 2) check if user exists && password is correcrt
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  // 3) if everything is ok, send token to client
  createThenSendToke(user, 200, res);
});

exports.logout = (req, res, next) => {
  res.cookie('jwt', 'Seeyou', {
    maxAge: 1,
    httpOnly: true
  });
  res.status(200).json({
    status: 'success'
  });
};

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  //  1) Getting token and check if its there
  try {
    if (req.cookies.jwt) {
      // 2) Verification token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 3) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // ! 4) Check if user changed password after token issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    }
  } catch (error) {
    return next();
  }
  next();
});
exports.protect = catchAsync(async (req, res, next) => {
  // ! 1) Getting token and check if its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // ! 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // ! 3) Check if user still exists
  console.log('decoded id ', decoded.id);
  const currentUser = await User.findById(decoded.id);
  console.log('current user', currentUser);
  if (!currentUser) {
    return next(new AppError('User belongine to token doesnt exist', 401));
  }

  // ! 4) Check if user changed password after token issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! please login again', 401)
    );
  }

  // !  Grant access to protected route
  res.locals.user = currentUser;
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log('Hello', req.user.role);
    if (!roles.includes(req.user.role)) {
      return next(new AppError('you have no permissions', 403));
    }
    next();
  };
};

exports.forgotpassword = catchAsync(async (req, res, next) => {
  // !1) get user based on POST email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('Ther is no user with that email address', 404));
  }

  // !2) generate the random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // !3) send it back as an email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetpassword/${resetToken}`;

  new Email(user, resetURL).resetPassword();

  res.status(201).send({
    status: 'success',
    message: 'Token sent to email'
  });
});

exports.resetpassword = catchAsync(async (req, res, next) => {
  //! 1) get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExipres: { $gt: Date.now() }
  });

  if (!user) {
    return next(new AppError('Token is invalid or expired!!', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExipres = undefined;
  await user.save();
  // user.passwordChangeAt = Date.now();
  //! 2) if token has not expired & there is a user

  //! 3) Update chagedPasswordAt property for the user
  //! 4) Log the user in, send JWT Token
  createThenSendToke(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) check if POST password is correct

  if (!(await user.correctPassword(req.body.currentpassword, user.password))) {
    return next(
      new AppError('Current password is not correct, please try again!', 403)
    );
  }
  // 3) if so, update the password

  user.password = req.body.newpassword;
  user.passwordConfirm = req.body.newpassword;
  await user.save();
  // 4) log the user in, send JWT

  createThenSendToke(user, 200, res);
});
