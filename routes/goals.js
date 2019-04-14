var mongoose = require('mongoose');
var router = require("express-promise-router")();
var passport = require("passport");
var Goal = mongoose.model("goal");
var {schemas}= require('../validators/validator');
var Joi = require('joi');


/** Creates a new goal for the user. 
 * @param req.body : all the details of the goal inserted as json object. */ 
router.post('/', passport.authenticate("jwt", {session : false}) , (req, res) => {
    // validates user input
    Joi.validate(req.body, schemas.goalSchema).then(
        // if validated, 
        item => {
            var model = new Goal({ "user" : req.user._id,
            "name": item.name,
            "due": item.due,
            "amount": item.amount});
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
 * @param req.query.id : (required) the goal's id to be updated.
 * @param req.body:(required)  updated goal details provided in JSON object.  */  
router.put('/',  passport.authenticate("jwt", {session : false}) ,(req, res) => {
  
  Joi.validate(req.body, schemas.goalSchema)
    .then(item => {
        Goal.findOneAndUpdate({
            _id: req.query.id,
            user: req.user._id
        },{ "user" : req.user._id,
        "name": item.name,
        "due": item.due,
        "amount": item.amount
        } , {
            new: true
        }).then(doc =>{
            res.status(200).json(doc); 
        }).catch(err =>{
            res.status(500).json(err)
        })
    })
    .catch(
      err =>{
          res.json(err);
    })
  
   
   
});
/** Deletes 1 of user's  goals based on the name.
 * @param req.query.id : (required) the goal's id that will be deleted.*/  
router.delete('/', passport.authenticate("jwt", {session : false}) ,(req, res) => {
    Goal.findOneAndDelete({
        _id: req.query.id,
        user: req.user._id
    })
        .then(doc =>{
            res.json(doc)
        })
        .catch(err =>{
            res.status(500).json(err)
        })

})

module.exports = router