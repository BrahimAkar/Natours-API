const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './../config.env' });

const DB =
  'mongodb+srv://brahim123:brahim123@cluster0-gvzjk.mongodb.net/natours?retryWrites=true&w=majority';

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then();

const testShema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a tour name'],
    unique: true
  },
  duration: {
    type: Number,
    required: [true, 'a tour must have a duration']
  }
});

const Test = mongoose.model('Test', testShema);

module.exports = Test;
