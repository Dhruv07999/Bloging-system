const express = require('express');

const port = 8000;

const path = require('path');

const app = express();

const db = require('./config/mongoose');

const session = require('express-session');
const passport = require('passport');  
const LocalStrategy = require('./config/Passport-Local-Strategy');
const cookieParser = require('cookie-parser')
const flash = require('connect-flash');
const flashMessage = require("./config/flashMessage")


app.use(express.urlencoded());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(cookieParser())


app.use(express.static(path.join(__dirname, 'assets')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(session({
    name : 'admin',
    secret : 'adminKey',
    resave : false,
    saveUninitialized :false,
    cookie : {
        maxAge : 1000*60*60
    }
}));

// Session
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthUser);

// connect-flash 
app.use(flash());
app.use(flashMessage.setFlash);


app.use('/', require('./routes/AuthRoutes'));

app.listen(port, (err) => {
    if(err) {
        console.log(err);
    }
    console.log("Server is running on port :", port)
})