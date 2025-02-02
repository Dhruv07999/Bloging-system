const express = require('express');

const routes = express.Router();

const AuthCtl = require('../controllers/AuthController');

const passport = require('passport');

// Sign In ---- Logout

routes.use("/",require("./userPanelRoutes"))

routes.get('/signIn', AuthCtl.signIn);



routes.post('/signInCheck', passport.authenticate('local', {failureRedirect : '/signIn'}), AuthCtl.signInCheck);

// verify emial 
routes.get("/verifyEmail",AuthCtl.verifyEmail)
routes.post("/verifyEmailCheck",AuthCtl.verifyEmailCheck)
// end 

// otpcheck 
routes.get("/otpCheck",AuthCtl.otpCheck)
routes.post("/verifyOtpSend",AuthCtl.verifyOtpSend)

// forgot pass 
routes.get("/forgotPass",AuthCtl.forgotPass)
routes.post("/verifyPass",AuthCtl.verifyPass)

routes.use('/dashboard', passport.checkAuthUser ,require('./AdminRoutes'));

routes.use('/dashboard', passport.checkAuthUser ,require('./CategoryRoutes'));

routes.use('/dashboard', passport.checkAuthUser ,require('./BlogRoutes'));



module.exports = routes;