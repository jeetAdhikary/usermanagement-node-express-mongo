const express = require('express');
const {
    User
} = require('./../models/user');

const router = express.Router();

router.get('/signup', (req, res) => {
    res.render('signup', {
        message: ''
    });
});

router.post('/signup/addUser', (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var body = {
        name,
        email,
        password
    };
    user = User(body);

    user.save().then(() => {
        console.log('user addedd successfully');
        return user.generateAuthToken();
       // res.status(200).send(user);
    }).then((token)=>{
        req.session.jwtToken = token;
        res.redirect('/home');
    }, (e)=>{
        if(e){
            console.log(e);
        }
    }).catch((e) => {
        if (e.code === 11000) {
            res.render('signup', {
                message: 'Email id is already taken'
            })
        } else
        if (e.errors.email) {
            res.render('signup', {
                message: 'Please provide valid email ID'
            });
        }else
        if(e.errors.password){
            res.render('signup', {
                message: 'please provide valid password'
            });
        }else{
            res.render('signup', {
                message: 'Unable to process request.'
            });
        }
    })

})

module.exports = router;