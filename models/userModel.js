const mongoose = require('mongoose');
const crypto = require('crypto');
const dotenv = require('dotenv');
const slugify = require('slugify');
const validator = require('validator');
var bcrypt = require('bcryptjs');

dotenv.config({ path: './../config.env' });

const DB = `mongodb+srv://${process.env.DATABASE_PASSWORD}:${process.env.DATABASE_PASSWORD}@cluster0-gvzjk.mongodb.net/natours?retryWrites=true&w=majority`;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then();

const userShema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your beautiful name :) ']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'The email is not valid']
  },
  photo: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'guide', 'lead-guide'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please provide a password'],
    validate: {
      // ! this work on create & save
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords must be the same'
    }
  },
  passwordChangeAt: Date,
  passwordResetToken: String,
  passwordResetExipres: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

userShema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
});

userShema.pre('save', function() {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangeAt = Date.now() - 1000;
  next();
});

userShema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});

userShema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userShema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangeAt) {
    const changedTimestamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  // ! False means NOT CHANGED
  return false;
};

userShema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExipres = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userShema);

module.exports = User;
