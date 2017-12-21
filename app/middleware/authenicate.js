const {User} =  require('./../models/user');

var authenticate = (req, res, next)=>{
    if(!req.session.jwtToken){
        res.redirect('/');
    }else{
        var token = req.session.jwtToken;
        User.findByToken(token).then((user)=>{
            if(!user){
                return Promise.reject('userNotFound');
            }
            req.user = user;
            req.userName = user.name;
            req.uniqueId = user._id.toHexString();
            next();
        }).catch((e)=>{
            console.log(e);
            res.status(401).send('<h1>Unauthorised<h1>');
        })
    }
   
}

module.exports = {authenticate}