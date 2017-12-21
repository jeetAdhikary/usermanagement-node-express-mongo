'use strict';
const express = require('express');
const {authenticate} = require('./../middleware/authenicate');         
const router = express.Router();
   

router.get('/home', authenticate, (req, res) => {
    var token = req.header('x-auth');
     var userName =req.userName;
    res.render('home',{
        userName
    });
});

router.post('/logout', authenticate, (req,res)=>{
    req.user.removeToken(req.session.jwtToken).then(()=>{
        req.session.destroy();
        res.redirect('/');
    })

})

module.exports = router;