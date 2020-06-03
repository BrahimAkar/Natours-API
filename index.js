const express = require("express");
const app = express();
const fs = require("fs");
const first = require("./middlewares/firstMiddle");
const morgan = require("morgan");

const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
} = require("./routers/routers");

// Middlewares

app.use(express.json());
app.use(morgan("dev"));

// temp routes

const createUser = (req, res) => {
  console.log("create User");
};
const getAllUsers = (req, res) => {
  console.log("get all Users");
};
const getUser = (req, res) => {
  console.log("Get Specific User");
};
const updateUser = (req, res) => {
  console.log("update User");
};
const deleteUser = (req, res) => {
  console.log("delete User");
};

// Routes handlers

app.get("/test", (req, res) => {
  console.log(req.ip);
});
app.route("/api/v1/tours").get(getAllTours).post(createTour);
app
  .route("/api/v1/tours/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// Users Route

app.route("/api/v1/users").get(getAllUsers).post(createUser);
app
  .route("/api/v1/users/:id")
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

// Start Server

app.listen(3006, () => {
  console.log("App listening on port 3006!");
});
