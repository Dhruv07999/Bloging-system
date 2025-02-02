const mongoose = require('mongoose');
const passport = require('passport');
const { type } = require('os');

const UserSchema = mongoose.Schema({
    
    registerName :{
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type: String,
        required : true
    },
    comPass : {
        type: String,
        required : true
    }
},
{
    timestamps : true
});




const UserModel = mongoose.model('UserModel', UserSchema);

module.exports = UserModel;