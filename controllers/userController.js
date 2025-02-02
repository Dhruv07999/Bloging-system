const CategoryModel = require("../models/CategoryModel")
const BlogModel = require("../models/BlogModel")
const CommentModel = require("../models/CommentModel")
const UserModel = require("../models/userRegisterModel")

module.exports.home = async(req,res)=>{
    try {

        // seacrh 
        let Search = ""
        if (req.query.searchBlog) {
            Search = req.query.searchBlog
        }
        let allBlog = await BlogModel.find({status : true})
        let allCategory = await CategoryModel.find({status : true})

        if (req.query.categoryId) {  
            allBlog = await BlogModel.find({
                categoryId: req.query.categoryId,
                status: true,
            }).populate('categoryId').exec();
        } else {
            allBlog = await BlogModel.find({ status: true ,blogTitle :{$regex : Search}}).populate('categoryId').exec();
        } 

        var getBlog = await BlogModel.find({ status: true }).countDocuments();

        
        res.render("userPanel/home",{
            allCategory,
            allBlog,
            Search,
            getBlog
        })
    } catch (err) {
        console.log(err);
        res.redirect("back");
    }
}
module.exports.catrgoryPost = async (req, res) => {
    try {
        const postId = req.query.catpost;

        if (!postId) {
            console.log("Post ID is missing.");
            return res.redirect("back");
        }
        const post = await BlogModel.findById(postId).populate("categoryId");
        if (!post) {
            console.log("Post not found.");
            res.redirect("back");
        }
        // Comment Data print 
        let commentDataShow = await CommentModel.find({ 
            status: true, 
            Blog_Id: postId 
        });
        
        // recent Blog 
        let allBlog = await BlogModel.find({status : true}).sort({ createdAt: -1 }).limit(5);
        
        // Render the post detail page
        res.render("userPanel/catgoryPost", { 
            post,
            allBlog,
            commentDataShow
         });
    } catch (err) {
        console.log("Error :", err);
        res.redirect("back");
    }
};

module.exports.addComment = async(req,res)=>{
    try {
        // console.log(req.body);
        // console.log(req.file);
        var commentImg = ""

        if (req.file) {
            commentImg = CommentModel.imagePath+"/"+req.file.filename;
        }
        req.body.commentImage = commentImg;

        let addComment = await CommentModel.create(req.body)
        if(addComment){
            console.log("Data inserted successfully..");
            return res.redirect('back');
        }
        else{
            console.log("Somethig went wrong..");
            return res.redirect('back');
        }

    } catch (err) {
        console.log("Error", err);
        res.redirect("back");
    }
}

module.exports.viewComment = async(req,res)=>{
    try {
        // Comment Data print 
        let commentDataShow = await CommentModel.find({status : true})
        
        res.render("userPanel/viewComment",{
            commentDataShow
        })
    } catch (err) {
        console.log(err);
        res.redirect("back")
    }
}

// user register page 
module.exports.userRegisterData = async(req,res)=>{
    try {
       
        if (req.body.password === req.body.comPass) {
            let checkregister = await UserModel.create(req.body)
            if (checkregister) {
                res.redirect("back")
                console.log("Register Successfully..."); 
            }
            else{
                res.redirect("back")
                console.log("Invalided Registe "); 
            }
        }
        else{
            console.log("your password & comfired password is not match");
            
        }
    } catch (error) {
        console.log(error);
        res.redirect("back")
    }
}
// user Login page 
module.exports.userLoginData = async(req,res)=>{
    try {
        res.redirect("/")
        
    } catch (error) {
        console.log(error);
        res.redirect("back")
    }
}

// likes 
module.exports.setLikesByUsers = async(req,res)=>{
    try {
        console.log(req.params.commentId);
        let singleComment = await CommentModel.findById(req.params.commentId);
        if (singleComment) {
            console.log(req.user._id);
            let likesUserAlreadyExites = singleComment.likes.includes(req.user._id)
            if (likesUserAlreadyExites) {
                let newData = singleComment.likes.filter((v,i)=>{
                    if (!v.equals(req.user._id)) {
                        return v;
                    }
                })
                singleComment.likes = newData 
            } else {
                singleComment.likes.push(req.user._id)
            }
            let disLikesUserAlreadyExites = singleComment.disLikes.includes(req.user._id)
            if (disLikesUserAlreadyExites) {
                let newData = singleComment.disLikes.filter((v,i)=>{
                    if (!v.equals(req.user._id)) {
                        return v;
                    }
                })
                singleComment.disLikes = newData 
            } 
            await CommentModel.findByIdAndUpdate(req.params.commentId,singleComment)
            res.redirect("back")
            
        } else {
            console.log("comment is not found");  
        } 
    } catch (error) {
        console.log(error);
        res.redirect("back")
    }
}

// Dislikes 
module.exports.setDisLikesByUsers = async(req,res)=>{
    try {
        console.log(req.params.commentId);
        let singleComment = await CommentModel.findById(req.params.commentId);
        if (singleComment) {
            console.log(req.user._id);
            let disLikesUserAlreadyExites = singleComment.disLikes.includes(req.user._id)
            if (disLikesUserAlreadyExites) {
                let newData = singleComment.disLikes.filter((v,i)=>{
                    if (!v.equals(req.user._id)) {
                        return v;
                    }
                })
                singleComment.disLikes = newData
                
            } else {
                singleComment.disLikes.push(req.user._id)
            }
            let likesUserAlreadyExites = singleComment.likes.includes(req.user._id)
            if (likesUserAlreadyExites) {
                let newData = singleComment.likes.filter((v,i)=>{
                    if (!v.equals(req.user._id)) {
                        return v;
                    }
                })
                singleComment.likes = newData
                
            }
            await CommentModel.findByIdAndUpdate(req.params.commentId,singleComment)
            res.redirect("back")
            
        } else {
            console.log("comment is not found");  
        }
        
    } catch (error) {
        console.log(error);
        res.redirect("back")
    }
}
