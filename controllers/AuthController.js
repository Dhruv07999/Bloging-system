const nodemailer = require("nodemailer");
const AdminModel = require("../models/AdminModel");


// Sign In
module.exports.signIn = async (req, res) => {
    try{
            res.render('Authentication/SignIn');
    }
    catch(err){
        console.log(err);
    }
};

module.exports.signInCheck = async (req, res) => {
    try{
        return res.redirect('/dashboard');
    }
    catch(err){
        console.log(err);
        return res.redirect('back')
    }
};

module.exports.verifyEmail = async (req,res)=>{
    try {
        res.render("Authentication/verifyEmail")
    } catch (err) {
        console.log("some thing is wrong",err);
        res.redirect("back")
    }
}


// check Email 
module.exports.verifyEmailCheck = async(req,res)=>{
    try {
        console.log(req.body);
        let singleObj = await AdminModel.find({email : req.body.email}).countDocuments()
        if (singleObj == 1) {
            let singleAdminData = await AdminModel.findOne({email : req.body.email});
            let OTP = Math.floor(Math.random()*100000);

            res.cookie("OTP",OTP)
            res.cookie("email",singleAdminData.email)
        
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                  user: "dhruvbhavsar07999@gmail.com",
                  pass: "ahvrgcxkmyapzaqc",
                },
                tls:{
                    rejectUnauthorized :false,
                }
              });

              const info = await transporter.sendMail({
                from: "dhruvbhavsar07999@gmail.com", // sender address
                to: singleAdminData.email, // list of receivers
                subject: "Hello ✔", // Subject line
                text: "Verify OTP", // plain text body
                html: `<b>Your OTP :${OTP}</b>`, // html body
              });
            
              console.log("Message sent:");

              res.redirect("/otpCheck");
            
        } else {
            console.log("Email is Not verify");
            res.redirect("back")
        }

        
    } catch (error) {
        console.log("Some thing is wrong");
        res.redirect("back")
    }
}


// OTP Check 
module.exports.otpCheck = async(req,res) =>{
    try {
        res.render("Authentication/otpCheck")
    } catch (err) {
        console.log("Some thing is Wrong",err);
        res.redirect("back")
    }
}

module.exports.verifyOtpSend = async(req,res)=>{
    try {
        console.log(req.body.otp);
        console.log(req.cookies.OTP);

        if (req.body.otp == req.cookies.OTP) {
            console.log("OTP Is Valiedd");
            res.clearCookie('OTP')
            res.redirect("/forgotPass")
        } else {
            console.log("Invalied OTP ! Please Try Again...");
            res.redirect("back")
        }
        
        
    } catch (error) {
        console.log("Some thing is wrong");
        res.redirect("back")
    }
}

module.exports.forgotPass = async(req,res) =>{
    try {
        res.render("Authentication/forgotPass")
    } catch (err) {
        console.log("Some thing is Wrong",err);
        res.redirect("back")
    }
}

module.exports.verifyPass = async(req,res)=>{
    try {
        

        if (req.body.newPass == req.body.confirmedPass) {
            let checklastTime = await AdminModel.find({email :req.cookies.email}).countDocuments();
            console.log(checklastTime);
            if (checklastTime == 1) {
                let adminDataNew = await AdminModel.findOne({email : req.cookies.email});
                console.log(adminDataNew);
                let updatePass = await AdminModel.findByIdAndUpdate(adminDataNew.id,{password :req.body.newPass})
                if (updatePass) {
                    res.clearCookie("email");
                    res.redirect("/")
                } else {
                    console.log("Some thing is wrong1");
                    res.redirect("back")
                }
                
            } else {
                console.log("Email Is NOt Found ! Please Check The Your Email...");
                res.redirect("back")
            }
            
        } else {
            console.log("New Password & Confirmed Password Is Not Match");
        }
        
    } catch (error) {
        console.log("Some thing is wrong");
        res.redirect("back")
    }
}