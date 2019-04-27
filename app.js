// Set up express
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
var path = require('path');

// Database setup
require('./server/models/db.js');
const PORT = process.env.PORT || 5000; 

// Routes setup
var routes = require('./server/routes/routes.js');
app.use('/api',routes);

//login route
var users = require("./server/routes/users.js");
app.use("/api/users",users);

//user's data transactions route
var transactions = require('./server/routes/transaction.js');
app.use("/api/transactions", transactions);

//user's goals route
var goals = require('./server/routes/goals.js');
app.use("/api/goals", goals);


//user's budget route
var budget = require('./server/routes/budget.js');
app.use("/api/budget", budget);

//user's report route
var report = require('./server/routes/report.js');
app.use("/api/report", report);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname+'/client/build/index.html'));
  });

// Start the server
app.listen(PORT,function(req,res){
	console.log(`Express listening on port ${PORT}`);
});