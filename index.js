const express = require("express");
const app = express();
const fs = require("fs");
const first = require("./middlewares/firstMiddle");
const morgan = require("morgan");
const tourRouter = require('./routes/toursRoutes')
const userRouter = require('./routes/usersRoutes')



const { getAllUsers, getUser, createUser, deleteUser, updateUser }
  = require('./routes/usersRoutes');

const { getAllTours, getTour, createTour, updateTour, deleteTour, }
  = require("./routes/toursRoutes");

// Middlewares

app.use(express.json());
app.use('/api/v1/users', userRouter)
app.use('/api/v1/tours', tourRouter)
// app.use('/api/v1/tours',tourRouter)
app.use(morgan("dev"));

// temp routes



// Routes handlers



// Users Route


// Start Server

app.listen(3006, () => {
  console.log("App listening on port 3006!");
});
