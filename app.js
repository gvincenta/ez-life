// Set up express
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

// Database setup
require('./models/db.js');
const PORT = process.env.PORT || 3000; 

// Routes setup
var routes = require('./routes/routes.js');
app.use('/',routes);
// users setup 
var users = require("./routes/users.js");
app.use("/users",users);
// Start the server
app.listen(PORT,function(req,res){
	console.log(`Express listening on port ${PORT}`);
});