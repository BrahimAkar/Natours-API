/* eslint-disable no-unused-vars */
/* eslint-disable import/newline-after-import */
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './../../config.env' });
const Tour = require('./../../models/tourModule');

const DB =
  'mongodb+srv://brahim123:brahim123@cluster0-gvzjk.mongodb.net/natours?retryWrites=true&w=majority';

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then();

// Reading file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// import data to database

const importData = async () => {
  try {
    await Tour.create(tours);
    Console.log('Data succeffuly loaded');
  } catch (error) {
    console.error();
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    Console.log('Data succeffuly deleted');
  } catch (error) {
    console.error();
  }
};

if (process.argv[2] === '--import') {
  importData();
  process.exit();
} else if (process.argv[2] === '--delete') {
  deleteData();
  process.exit();
}

importData();
