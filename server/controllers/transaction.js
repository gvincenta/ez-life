var mongoose = require('mongoose');
var TransactionModel = mongoose.model("transaction");
var {schemas}= require('../validators/validator');
var Joi = require('joi');
var Budget = mongoose.model("budget"); 

/** Creates a new transaction for the user. 
 * @param req.body : all the details of the transaction inserted as json object. */ 
var createNewTransaction = function (req, res) {
    Joi.validate(req.body, schemas.transactionCreateSchema)
        .then( item => {
            var model = new TransactionModel({ 
           
            "date": item.date,
            "realAmount": item.realAmount
            } );
            
            
            //save model. 
            model.save();

            //add this to Budget: 
            Budget.updateOne({
                user : req.user._id,
                name : req.body.name
            },
            {
                $push : {transactionID : model._id}
            }).then(doc => {
                res.json(doc) 
            } ).catch(err =>{
                res.status(500).json(err);
             });
        }).catch(err =>{
           res.status(500).json(err);
        })
};

/** Checks on  transactions of the month related to 1 user.
 * */ 
var findTransaction =  function (req, res) {
    // gives the related user's transactions to the query name. 

    var currMonth = new Date();
    var currYear = currMonth.getFullYear();
    currMonth = currMonth.getMonth();
    // gives all of user's transactions if no query name defined. 
    var upperBound = new Date(currYear, currMonth+1);
    var lowerBound = new Date(currYear, currMonth);
    
    Budget.aggregate([
        { $match : 
        {user: req.user._id}
        },
        {$lookup: 
            {
            "from" : "transactions",
            "localField" : "transactionID",
            "foreignField" : "_id",
            "as" : "data"
            } 
        },
        {
            $unwind : "$data"
        },{ $match : 
            {"data.date": 
                {
                $gt: lowerBound,
                $lte: upperBound
                }
            }
        },
        {
            $project : {
              _id : "$data._id",
              name : "$name",
              amount : "$data.realAmount",
               date: "$data.date"
            }
          }
        
           
        ]).then(
            doc =>{
                res.json(doc);
            }
        );
};

/** Updates user's  transaction (date/realAmount).
 * @param req.query.id : (required) the transaction's id to be updated.*/
var updateTransaction =  function (req, res) {
   
   //allows user to change name/type/frequency/amount of the transaction. 
   Joi.validate(req.body, schemas.transactionUpdateSchema)
    .then(item => 
        {
            TransactionModel.findOneAndUpdate(
                {
                _id: req.query.id}, 
                { 
                "date": req.body.date,
                "realAmount": req.body.realAmount
                } , 
                {
                new: true 
                }
            )
            //if found, send the updated data.
            .then(doc =>{
                res.json(doc)
            })
            // if error, show the error. 
            .catch(err =>{
                res.status(500).json(err)
            })
        })
    .catch(err =>{
        res.status(500).json(err)
    })
        

};

/*exporting.. */
module.exports.createNewTransaction = createNewTransaction;
module.exports.findTransaction = findTransaction;
module.exports.updateTransaction = updateTransaction;
