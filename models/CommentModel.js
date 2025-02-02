const mongoose = require('mongoose');

const commentImagePath = '/uploads/commentImage';
const path = require("path");

const multer = require("multer");

const CommentSchema = mongoose.Schema({
    
    Blog_Id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'BlogModel',
    },
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    commentImage :{
        type : String,
        required : true
    },
    comment:{
        type : String,
        required : true
    },
    status : {
        type : Boolean,
        required : true,
        default  : true,
    },
    
    likes:[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "UserModel"
        }
    ],
    disLikes:[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "UserModel"
        }
    ]
    
},
{
    timestamps : true
});


const commentImageStorage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, path.join(__dirname, '..', commentImagePath));
    },
    filename : (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now());
    }
});

CommentSchema.statics.uploadImageFile = multer({storage : commentImageStorage}).single('commentImage');
CommentSchema.statics.imagePath = commentImagePath;

const CommentModel = mongoose.model('CommentModel', CommentSchema);

module.exports = CommentModel;