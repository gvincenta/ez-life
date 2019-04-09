var express = require("express");
var user = require("express-promise-router")();
var passport = require("passport");

var userController = require('../controllers/users.js');
var passportConfiguration = require("../passport.js");


user.get("/userData",  passport.authenticate("jwt", {session : false}) , userController.getUserData);
user.post("/oauth/google", passport.authenticate('googleToken', {session : false}), userController.login);
user.get("/getAll",function(req, res){
    res.send(userController.getAllUsers);
})
module.exports = user;