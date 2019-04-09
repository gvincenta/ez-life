// Create database
var mongoose = require('mongoose');


const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  };
mongoose.connect(process.env.MONGO_URL || "mongodb://localhost/test", options, function(err) {
    // Check error in initial connection. There is no 2nd param to the callback.
    if (err){
      console.log("Failed to connect to DB");
      process.exit(1);
    }
    else{
        console.log("DB connected.");
    }
 
});

require('./person.js');

