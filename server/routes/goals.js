var mongoose = require('mongoose');
var router = require("express-promise-router")();
var passport = require("passport");
var Goal = mongoose.model("goal");
var {schemas}= require('../validators/validator');
var Joi = require('joi');


/** Creates a new goal for the user. 
 * @param req.query : all the details of the goal inserted as queries. */ 
router.post('/', passport.authenticate("jwt", {session : false}) , (req, res) => {
    // validates user input
    console.log("asdja");
    Joi.validate(req.body, schemas.goalSchema).then(
        // if validated, 
        item => {
            var model = new Goal({ "user" : req.user._id,
            "name": item.name,
            "due": item.due,
            "amount": item.amount,
        "preference": item.preference});
            model.save();
            res.status(200).json(model);


    }).catch(err=> {
        res.json(err);
    })
    
});

/** Checks on 1 goal or all goals related to 1 user.
 * @param req.query.id : (optional) if provided, returns 1 user's goal specified by this id.  */  
router.get('/', passport.authenticate("jwt", {session : false}) , (req, res) => {
    // gives the related user's goal according to the query id. 

    if (Object.keys(req.query).length !== 0){
        Goal.findOne({
            _id: req.query.id,
            user: req.user._id
        })
            .then(doc =>{
                res.json(doc)
            })
            .catch(err =>{
                res.status(500).json(err)
            });
        return;
    }
    
    // gives all of user's goals if no query id defined. 
    Goal.find({
            user: req.user._id            
    })
        .then(doc =>{
            res.json(doc)
        })
        .catch(err =>{
            res.status(500).json(err)
        });
    

    
})


/** Updates user's  goal (name/due date/amount).
 * @param req.body:(required)  updated goal details provided in JSON object.  */  
router.put('/',  passport.authenticate("jwt", {session : false}) ,(req, res) => {
  
    
        Goal.findOneAndUpdate({
            user: req.user._id,
            name : req.body.name
        },{ 
            progress : req.body.progress
        } , {
            new: true
        }).then(doc =>{
            res.status(200).json(doc); 
        }).catch(err =>{
            res.status(500).json(err)
        })
    
    
  
   
   
});


module.exports = router