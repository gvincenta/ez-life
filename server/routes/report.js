var mongoose = require('mongoose');
var router = require("express-promise-router")();
var passport = require("passport");
var Report = mongoose.model("report");
var {schemas}= require('../validators/validator');
var Joi = require('joi');
var Budget = mongoose.model("budget");

// aggregates each income & expense category, then put it into report. 

router.get('/', passport.authenticate("jwt", {session : false}) , (req, res) => {
    // get distinct values of transaction
    var currMonth = new Date();
    var currYear = currMonth.getFullYear();
    currMonth = currMonth.getMonth();
    // lowerBound = last month's last date, e.g. 31st March. 
    var lowerBound = new Date(currYear, currMonth);
    // upperBound = this month's last date, e.g. 30th April. 
    var upperBound = new Date(currYear, currMonth+1);

    //check if user already make report or nah: 
    Report.find({
        user: req.user._id,
        month: {
        $gt: lowerBound,
        $lte: upperBound
      
        }
    }).then(doc => {
        if (doc.length >0){
            //send the report that's been created already.
            Budget.aggregate([{ $match : 
                {user: req.user._id,
                ignored : false}},
                   {$lookup: {
                       "from" : "reports",
                       "localField" : "reportID",
                       "foreignField" : "_id",
                       "as" : "data"
                   } } ,
                   {
                       $unwind : "$data"
                   },
                   { $match : 
                    {"data.month": 
                        {
                        $gt: lowerBound,
                        $lte: upperBound
                      
                        }
                    }},
                    {$project : {
                        name: "$name",
                        totalAmount: "$data.amountPerMonth",
                        isIncome:"$isIncome"
                    }}
                    
                   ]).then((doc) => {res.send({document :doc, found: true} )});
        
        return;
        }
        else{
            //make this month's report for each category from the list of transactions: 
            Budget.aggregate([{ $match : 
                {user: req.user._id,
                ignored : false}},
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
                        }, {new:true}).then ( (result) => {});
                        answer.push({
                            name: doc[i]._id.name,
                            totalAmount: model.amountPerMonth,
                            isIncome:  doc[i]._id.isIncome});
                        
            
                        if (doc[i]._id.isIncome === "income" ){
                            sum = sum + doc[i].totalAmount;
                        }
                        else{
                            sum = sum - doc[i].totalAmount;
                        }
                    }
                
                answer.push(sum);
                res.send({document :answer, found: false} );
                return;
                });
            
        }
    });
    
    
});

module.exports = router;