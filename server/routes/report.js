var mongoose = require('mongoose');
var router = require("express-promise-router")();
var passport = require("passport");
var Report = mongoose.model("report");
var {schemas}= require('../validators/validator');
var Joi = require('joi');
var Budget = mongoose.model("budget");


router.get('/', passport.authenticate("jwt", {session : false}) , (req, res) => {
    // get distinct values of transaction
    var currMonth = new Date();
    var currYear = currMonth.getFullYear();
    currMonth = currMonth.getMonth();
    // lowerBound = last month's last date, e.g. 31st March. 
    var lowerBound = new Date(currYear, currMonth);
    // upperBound = this month's last date, e.g. 30th April. 
    var upperBound = new Date(currYear, currMonth+1);
        console.log(lowerBound);
    console.log(upperBound);
    // aggregates each income & expense category, then put it into report. 
    Budget.aggregate([{ $match : 
    {user: req.user._id}},
       {$lookup: {
           "from" : "transactions",
           "localField" : "transactionID",
           "foreignField" : "_id",
           "as" : "data"
       } } ,
       {
           $unwind : "$data"
       },
       { $match : 
        {"data.date": 
            {
            $gt: lowerBound,
            $lte: upperBound
          
            }
        }
        },
       {
           $group :
            {_id : {
                id : "$_id",
                month: {$month: "$data.date"},
                year : {$year: "$data.date"},
                isIncome: "$isIncome",
                name: "$name"
            },
           totalAmount: {
               $sum : "$data.realAmount"
           }
        }
    }]).then(doc => {
       // append each category's sum into report db. 
       var sum = 0;
       var answer = []; 
       for (let i = 0; i < doc.length; i++){
            var model = new Report({ 
            
                "amountPerMonth": doc[i].totalAmount,
                "month" : new Date(doc[i]._id.year,doc[i]._id.month)
                
                } );    
            model.save(); 
            //add this to Budget: 
            Budget.updateOne({
                user : req.user._id,
                _id : doc[i]._id.id 
            },
            {
                $push : {reportID : model._id}
            });
            answer.push({
                name: doc[i]._id.name,
                totalAmount: model.amountPerMonth,
                isIncome:  doc[i]._id.isIncome
            });

            if (doc[i]._id.isIncome === "income" ){
                sum = sum + doc[i].totalAmount;
            }
            else{
                sum = sum - doc[i].totalAmount;
            }
        }
    
    if (sum < 0){
        console.log("losing money");
    }
    else{
        console.log("gaining money");

    }
    answer.push(sum);
    res.send(answer);
    });

});

module.exports = router;