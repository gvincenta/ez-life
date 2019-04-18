// Set up express
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
var path = require('path');

// Database setup
require('./models/db.js');
const PORT = process.env.PORT || 5000; 

// Routes setup
var routes = require('./routes/routes.js');
app.use('/',routes);

//login route
var users = require("./routes/users.js");
app.use("/users",users);

//user's data transactions route
var transactions = require('./routes/transaction.js');
app.use("/transactions", transactions);

//user's goals route
var goals = require('./routes/goals.js');
app.use("/goals", goals);

// Start the server
app.listen(PORT,function(req,res){
	console.log(`Express listening on port ${PORT}`);
});