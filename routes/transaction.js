var mongoose = require('mongoose');
var TransactionModel = mongoose.model("transaction");
var router = require("express-promise-router")();
var passport = require("passport");
//var passportConfiguration = require("../passport.js");
var {schemas}= require('../validators/validator');
var Joi = require('joi');

/** Creates a new transaction for the user. 
 * @param req.body : all the details of the transaction inserted as json object. */ 
router.post('/', passport.authenticate("jwt", {session : false}) , (req, res) => {
    Joi.validate(req.body, schemas.transactionSchema)
        .then( item => {
            var model = new TransactionModel({ "user" : req.user._id,
            "name": req.body.name,
            "isIncome": req.body.isIncome,
            "frequency": req.body.frequency,
            "amount": req.body.amount
            } );
            
            //save model. 
            model.save();
            res.status(200).json(model);
        }).catch(err =>{
            res.status(500).json(err);
        })
});

/** Checks on 1 transaction or all transactions related to 1 user.
 * @param req.query.id : (optional) if provided, returns 1 user's transaction specified by this id.  */ 
router.get('/', passport.authenticate("jwt", {session : false}) , (req, res) => {
    // gives the related user's transactions to the query name. 
    if (Object.keys(req.query).length !== 0){
        TransactionModel.findOne({
            _id: req.query.id,
            user: req.user._id
        })
            // if succeed, send the transaction.
            .then(doc =>{
                res.json(doc)
            })
            // if error, send the error.
            .catch(err =>{
                res.status(500).json(err)
            });
        return;
    }
    
    // gives all of user's transactions if no query name defined. 
    TransactionModel.find({
            user: req.user._id            
    })
        // if succeed, send the transaction.
        .then(doc =>{
            res.json(doc)
        })
        // if error, send the error.
        .catch(err =>{
            res.status(500).json(err)
        });
    

    
})

/** Updates user's  transaction (name/isIncome/frequency/amount).
 * @param req.query.id : (required) the transaction's id to be updated.*/
router.put('/',  passport.authenticate("jwt", {session : false}) ,(req, res) => {
   
   //allows user to change name/type/frequency/amount of the transaction. 
   Joi.validate(req.body, schemas.transactionSchema)
    .then(item => 
        {
            TransactionModel.findOneAndUpdate(
                {
                _id: req.query.id,
                user: req.user._id
                }, 
                { "user" : req.user._id,
                "name": req.body.name,
                "isIncome": req.body.isIncome,
                "frequency": req.body.frequency,
                "amount": req.body.amount
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
        

})
/** Deletes a transaction based on its name. 
 * @param req.query.id : (required) the transaction's id that will be deleted.*/
router.delete('/', passport.authenticate("jwt", {session : false}) ,(req, res) => {
    TransactionModel.findOneAndDelete({
        _id: req.query.id,
        user: req.user._id
    })
        // if found, send the data that's being deleted. 
        .then(doc =>{
            res.json(doc)
        })
        // if error, show the error. 
        .catch(err =>{
            res.status(500).json(err)
        })

})

module.exports = router