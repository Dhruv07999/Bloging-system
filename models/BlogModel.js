const mongoose = require('mongoose');

const path = require("path");
const blogImagePath = '/uploads/blogImage';

const multer = require("multer");

const blogSchema = mongoose.Schema({
    blogTitle : {
        type : String,
        required : true
    },
    categoryId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'CategoryModel',
        required : true
    },
    Comment_Id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'CommentModel',
    },
    description : {
        type : String,
        required : true
    },
    status : {
        type : Boolean,
        required : true,
        default  : true,
    },
    blogImage :{
        type : String,
        required : true,
    }
},
{
    timestamps : true
});


const blogImageStorage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, path.join(__dirname, '..', blogImagePath));
    },
    filename : (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now());
    }
});

blogSchema.statics.uploadImageFile = multer({storage : blogImageStorage}).single('blogImage');
blogSchema.statics.imagePath = blogImagePath;

const BlogModel = mongoose.model('BlogModel', blogSchema);

module.exports = BlogModel;