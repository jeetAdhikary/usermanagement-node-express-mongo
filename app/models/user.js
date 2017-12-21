const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');



var UserSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true ,
        minlength : 1,
        trim : true,
    },
    email : {
        type : String ,
        required :true ,
        minlength : 1,
        trim : true,
        unique : true ,
        validate : {
            validator : (value)=>{
                return validator.isEmail(value);
            } ,
            message : 'Email ID is not valid'
        }
    },
    password : {
        type : String, 
        required: true ,
        minlength : 6
    },
    tokens : [
        {
            access : {
                type : String,
                required : true
            },
            token : {
                type : String,
                required : true 
            }
        }
    ]
});

UserSchema.statics.findByCredencials = function(email,password){
    var User = this;
     return User.findOne({email}).then((user)=>{
        if(!user){
            return Promise.reject('invalidEmail');
        }
        return new Promise((resolve, reject)=>{
            bcrypt.compare(password, user.password, (err, result)=>{
                if(err){
                    reject(err);
                }
                if(result){
                    resolve(user);
                }else{
                    reject('invalidPassword');
                }
            });
        });
    });
}

UserSchema.statics.findByToken = function(token){
    var User = this ;
    var decoded ;
    try{
        decoded = jwt.verify(token, 'jeetAdhikary');
    }catch(e){
        return Promise.reject();
    }
    return User.findOne({
        _id : decoded._id,
        'tokens.token' : token,
        'tokens.access' : 'auth'
    });
}

UserSchema.methods.generateAuthToken = function(){
    user = this ;
    var access = 'auth';
    var token = jwt.sign({_id : user._id.toHexString(),access},'jeetAdhikary').toString();
    user.tokens.push({access,token});
    return user.save().then(()=>{
        return token;   
    })
}

UserSchema.methods.removeToken = function(token){
    user = this ;
    return user.update({
        $pull : {
            tokens:{token}
        }
    });
}

UserSchema.pre('save', function(next){
    user = this ;
    if(user.isModified('password')){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err, hash)=>{
                user.password = hash;
                next();
            })
        })
    }else{
        next();
    }
})

var User = mongoose.model('User', UserSchema);

module.exports = {User};