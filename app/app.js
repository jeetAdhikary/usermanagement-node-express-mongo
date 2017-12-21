'use strict';

const express = require('express');
const mongoose = require('./db/dbConnection'); 
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
app.set('view engine', 'ejs');
app.set('views','app/views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'jeetAdhikary',
    saveUninitialized : false ,
    resave: false
}))

app.use(express.static('app/public'));
app.use(require('./routes/index'));
app.use(require('./routes/login'));
app.use(require('./routes/signup'));
app.use(require('./routes/home'));


app.listen(3000,()=>{
    console.log('The Server is listening in Port 3000');
})