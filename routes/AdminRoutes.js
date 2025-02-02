const express = require('express');

const routes = express.Router();

const AdminCtl = require('../controllers/AdminController');

const AdminModel = require('../models/AdminModel');

const passport = require('passport');
const {check ,validationResult } = require("express-validator")

// Dashboard
routes.get('/', AdminCtl.dashboard);


routes.get('/addAdmin', AdminCtl.addAdmin);
routes.post('/insertAdmin', AdminModel.uploadImageFile,[
    check('fname').notEmpty().withMessage("First name Is required").isLength({min : 3}).withMessage("Minimun  3 charecter is required"),
    check('lname').notEmpty().withMessage("Last name Is required").isLength({min : 3}).withMessage("Minimun  3 charecter is required"),
    check('email').notEmpty().withMessage("Email is required").isEmail().withMessage("email is wrong").custom(async(value)=>{
        let checkEmail = await AdminModel.find({email:value}).countDocuments();
        if (checkEmail > 0) {
            throw new Error("Admin Already Exites"); 
        }
    }),
    check('password',"...").notEmpty().withMessage("password is requied").matches( /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/, "i").withMessage("one uppercase,one lowercase,one special charecter and 8 charectis required"),
    check("gender").notEmpty().withMessage("Select gender"),
    check("hobby").notEmpty().withMessage("Select hobby"),
    check("role").notEmpty().withMessage("Select role"),
    check("message").notEmpty().withMessage("Select message"),
    
]
     ,AdminCtl.insertAdmin);
routes.get('/viewAdmin', AdminCtl.viewAdmin);
routes.get('/deleteAdmin', AdminCtl.deleteAdmin);
routes.get('/updateAdmin/:updateId', AdminCtl.updateAdmin);
routes.post('/editAdmin', AdminModel.uploadImageFile, AdminCtl.editAdmin);

// change Password 
routes.get("/changePassword",AdminCtl.changePassword)
routes.post("/changeNewPassword",AdminCtl.changeNewPassword)

// Show Profile
routes.get('/myProfile', (req, res) => {
    try{
        return res.render('Admin/MyProfile')
    }
    catch(error){
        console.log("Error = ", error);
        return res.redirect('back');
    }
});

// SignOut
routes.get('/signOut', AdminCtl.signOut);

// soft delete 
// routes.get('/statusCheck', AdminCtl.statusCheck);



module.exports = routes;
