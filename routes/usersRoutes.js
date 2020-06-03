const express = require("express");
const app = express();

const route = express.Router();



let log = console.log;

const createUser = (req, res) => {
    log("create User");
};
const getAllUsers = (req, res) => {
    res.send({
        message: "get all users"
    })
    log("get all Users");
};
const getUser = (req, res) => {
    log("Get Specific User");
};
const updateUser = (req, res) => {
    log("update User");
};
const deleteUser = (req, res) => {
    log("delete User");
};

route
    .route("/")
    .get(getAllUsers)
    .post(createUser);

route
    .route("/:id")
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

module.exports = route;