const express = require("express")
const routes = express.Router();
const userCtl = require("../controllers/userController")
const CommentModel = require("../models/CommentModel");
const passport = require("passport");


// likes 
routes.get("/setLikesByUsers/:commentId",userCtl.setLikesByUsers)
routes.get("/setDisLikesByUsers/:commentId",userCtl.setDisLikesByUsers)
// userLogin 
routes.get("/userLogin",async (req,res)=>{
    try {
        res.render("userPanel/userLogin")
    } catch (err) {
        console.log(err);
        res.redirect("back")
    }
})

routes.post("/userLoginData", passport.authenticate("UserAuth",{failureRedirect : "/userLogin",failureFlash : "Some thing is wrong"}),userCtl.userLoginData);
routes.post("/userRegisterData",userCtl.userRegisterData);
routes.get("/userRegister",async (req,res)=>{
    try {
        res.render("userPanel/userRegister")
    } catch (err) {
        console.log(err);
        res.redirect("back")
    }
})

routes.get("/",userCtl.home)
routes.get("/catrgoryPost",userCtl.catrgoryPost)

routes.post("/addComment",CommentModel.uploadImageFile ,userCtl.addComment)
routes.get("/viewComment",userCtl.viewComment)
module.exports = routes;