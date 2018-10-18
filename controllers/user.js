const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.user_signup = (req,res,next) => {

    User.find({email:req.body.email})
    .then(user =>{
        //user shouldn't be an empty array
        if(user.length >= 1){
            //409 is a conflict
            return res.status(409).json({
                message : 'Mail exists!'
            });
        }
        else{
 //the number 10 here is to perform hashing 10 times to 
     //avoid our password to googling in dictionary tables
            bcrypt.hash(req.body.password,10,(err,hash) =>{
                if(err){
                    return res.status(500).json({
                        error : err
                    });
                }
                else{
                    const user = new User({
                        _id : new mongoose.Types.ObjectId(),
                        email : req.body.email,
                        password : hash
                    });
                    user
                    .save()
                    .then(result =>{
                        console.log(result);
                        res.status(201).json({
                            message :'User created!'
                        })
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error : err
                        })
                    });
                }
            });

        }
    });
}

exports.user_login = (req,res,next) =>{

    User.find({ email : req.body.email})
    .exec()
    .then(user =>{
        if(user.length < 1){
            return res.status(401).json({
                message : 'Authentication failed!'
            });
        }
        bcrypt.compare(req.body.password,user[0].password,(err,result) =>{
            if(err){
                return res.status(401).json({
                    message : 'Authentication failed!'
                });
            }
            if(result){
                const token = jwt.sign({
                    email : user[0].email,
                    userId : user[0]._id
                },
                process.env.JWTKEY,
                {
                    expiresIn:"1h"
                }
               );
                return res.status(200).json({
                    message:'Authentication successful, User successfully logged in!',
                    token : token
                });
            }
            res.status(401).json({
                message : 'Authentication failed!'
            });
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        });
    });
}

exports.user_delete = (req,res,next) => {
    User.remove({_id:req.params.userId})
    .exec()
    .then(result => {
        res.status(200).json({
            message:'User deleted!   '
        }); 
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        });
    });
}