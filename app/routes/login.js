'use strict';
const express = require('express');
const {User} = require('./../models/user');
const router = express.Router();


router.post('/login',(req,res)=>{
    var email = req.body.email;
    var password = req.body.password;
    User.findByCredencials(email, password).then((user)=>{
        return user.generateAuthToken().then((token)=>{
            req.session.jwtToken = token;
            res.redirect('/home');
        })
    }).catch((e)=>{
        if(e && e==='invalidEmail'||'invalidPassword'){
            res.render('index',{
                message : 'Please provide valid Email Id or Password'
            })
        }else if(e){
            res.render('index',{
                message : 'Something went wrong'
            })
        }
    });
});

module.exports = router;