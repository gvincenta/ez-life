var express = require("express");
var user = require("express-promise-router")();
var passport = require("passport");

var userController = require('../controllers/users.js');
var passportConfiguration = require("../passport.js");

//get user data
user.get("/details",  passport.authenticate("jwt", {session : false}) , userController.getUserData);

//sign in / login users
user.post("/login",passport.authenticate('googleToken', {session : false}), userController.login);


//add details optionally
user.post("/details",  passport.authenticate("jwt", {session : false}) , userController.addUserData);

module.exports = user;