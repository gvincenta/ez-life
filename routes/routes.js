var express = require('express');
var router = express.Router();

var controller = require('../controllers/controller.js');

// welcomes users to homepage. 
router.get('/api',controller.findAllPeople);

module.exports = router;