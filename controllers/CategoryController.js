const CategoryModel = require('../models/CategoryModel')
const BlogModel = require('../models/BlogModel')
const path = require("path")
const fs = require("fs")

module.exports.addCategory = async (req, res) => {
    try{
        return res.render('Category/AddCategory');
    }
    catch(error){
        console.log("error = ", error);    
        return res.redirect('back'); 
    }
};

module.exports.insertCategory = async (req, res) => {
    try{
        req.flash('success',"Data Insert Successfully")
        await CategoryModel.create(req.body);
        return res.redirect('back');
    }
    catch(error){
        console.log("error = ", error);    
        return res.redirect('back'); 
    }
};

module.exports.viewCategory = async (req, res) => {
    try{
        // Pagination code 
        let par_page = 3;
        let page = 0;

        if (req.query.page) {
           page = req.query.page
        }

        //Search 
        let Search = '';
        if(req.query.searchCategory){
            Search = req.query.searchCategory;
        }

        let CategoryData = await CategoryModel.find({categoryName : {$regex : Search, $options : 'i'}}).skip(page*par_page).limit(par_page);

        // TotalRecorde
        var totalRecode = await CategoryModel.find({
            $or:[
               {categoryName : {$regex : Search}},
    
            ]
         }).countDocuments();
 
         // console.log(totalRecode/par_page);
         let totalblog = Math.ceil(totalRecode / par_page);


        return res.render('Category/ViewCategory', {
            CategoryData,
            Search,
            page,
            totalblog,
            
        });
    }
    catch(error){
        console.log("error = ", error);    
        return res.redirect('back'); 
    }
};

module.exports.deleteCategory = async (req, res) => {
    try{
         // Get the category ID from the query string
         const categoryId = req.query.categoryId;

         if (!categoryId) {
             console.log("Category ID not provided");
             return res.redirect('back');
         }
 
         // Fetch all blogs associated with this category
         const blogsToDelete = await BlogModel.find({ categoryId });
 
         // Delete associated blogs
         for (const blog of blogsToDelete) {
             // Delete blog image file from the server
             if (blog.blogImage) {
                 const blogImagePath = path.join(__dirname, '..', blog.blogImage);
                 if (fs.existsSync(blogImagePath)) {
                     fs.unlinkSync(blogImagePath);
                 }
             }
 
             // Delete the blog record
             await BlogModel.findByIdAndDelete(blog._id);
         }
 
         // Delete the category itself
         await CategoryModel.findByIdAndDelete(categoryId);
        return res.redirect('back')
    }
    catch(error){
        console.log("error = ", error);    
        return res.redirect('back'); 
    }
};

module.exports.updateCategory = async (req, res) => {
    try{
        let singleObj = await CategoryModel.findById(req.params.updateId)
        res.render('Category/UpdateCategory', {
            singleObj
        })
    }
    catch(error){
        console.log("error = ", error);    
        return res.redirect('back'); 
    }
};

module.exports.editCategory = async (req, res) => {
    try{
        const updateCategory = await CategoryModel.findByIdAndUpdate(req.body.categoryId, req.body);

        if(updateCategory){
            console.log("Category updated successfully");
            return res.redirect('/dashboard/viewCategory')
        }
        else{
            console.log("Something went wrong");    
            return res.redirect('back');
        }
    }
    catch(error){
        console.log("error = ", error);    
        return res.redirect('back'); 
    }
};

// multiple Delete 
module.exports.multipleDelteCategory = async(req,res)=>{
    try {
        console.log(req.body);

        let multiDeleteData = await CategoryModel.deleteMany({_id :{$in :req.body.Ids}});

        if (multiDeleteData) {
            res.redirect("back")
        } else {
            console.log("error = ",);    
            return res.redirect('back');
        }
        
    } catch (error) {
        console.log("error = ", error);    
        return res.redirect('back');
    }
}

// soft Delete 
module.exports.statusCheckTrue = async(req,res)=>{
    try {
        let statusCheck = await CategoryModel.findByIdAndUpdate(req.query.statusId,{'status' : req.query.status})
        if (statusCheck) {
            res.redirect("back")
        } else {
            
            res.redirect("back")
        }
    } catch (error) {
        console.log(error);
        res.redirect("back")
    }
}



