var express = require('express');
var router = express.Router();

var controller = require('../controllers/controller.js');

// welcomes users to homepage. 
router.get('/',function(req,res){res.send("Welcome to EZ(Y) LIFE!")});


module.exports = router;