
const BlogModel = require('../models/BlogModel');
const CategoryModel = require('../models/CategoryModel');
const path = require('path');
const fs = require('fs')

module.exports.addBlog = async (req, res) => {
    try{
        let CategoryData = await CategoryModel.find();
        return res.render('Blog/AddBlog', {
            CategoryData
        });
    }
    catch(error){
        console.log("error = ", error);    
        return res.redirect('back'); 
    }
};

module.exports.insertBlog = async (req, res) => {
    try{

        var blogImg = ''
        if(req.file){
            blogImg = BlogModel.imagePath + '/' + req.file.filename;
        }
        req.body.blogImage = blogImg;

        let addBlog = await BlogModel.create(req.body)

        if (addBlog) {
            let findByCategory = await CategoryModel.findById(req.body.categoryId)
            console.log(findByCategory);
            
            findByCategory.Blog_Ids.push(addBlog)
            await CategoryModel.findByIdAndUpdate(req.body.categoryId,findByCategory)
            console.log("data add");
        } else {
            return res.redirect('back'); 
        }

        return res.redirect('back');
    }
    catch(error){
        console.log("error = ", error);    
        return res.redirect('back'); 
    }
};

module.exports.viewBlog = async (req, res) => {
    try{
        
        // Pagination code 
        let par_page = 3;
        let page = 0;

        if (req.query.page) {
           page = req.query.page
        }
        

        // Search
        let Search = '';
        if(req.query.searchBlog){
            Search = req.query.searchBlog;
        }
        // Sort Order
        // let sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

        let sortOrder;
        if (req.query.sortOrder === 'desc') {
            sortOrder = -1; // Descending order
        } else {
             sortOrder = 1; // Ascending order
        }

        let BlogData = await BlogModel.find({
            $or : [
                {blogTitle : {$regex : Search, $options : 'i'}},
                {'categoryId.categoryName' : {$regex : Search, $options : 'i'}},
                {description : {$regex : Search, $options : 'i'}}
            ]
        }).limit(par_page).sort({ blogTitle: sortOrder }).skip(page*par_page).populate('categoryId').exec();

        // TotalRecorde
        var totalRecode = await BlogModel.find({
           $or:[
              {blogTitle : {$regex : Search}},
              {description : {$regex : Search}}
           ]
        }).countDocuments();

        // console.log(totalRecode/par_page);
        let totalblog = Math.ceil(totalRecode / par_page);


        return res.render('Blog/ViewBlog', {
            BlogData,
            Search,
            page,
            totalblog,
            sortOrder: req.query.sortOrder || 'asc',
        });
    }
    catch(error){
        console.log("error = ", error);    
        return res.redirect('back'); 
    }
};

module.exports.deleteBlog = async (req, res) => {
    try{
        // Get category ID from the query string
        const categoryId = req.query.categoryId;

        
        if (categoryId) {
            // Fetch blogs that belong to the selected category
             await BlogModel.find({ categoryId }).populate('categoryId');
        } else {
            // Fetch all blogs if no category is selected
             await BlogModel.find().populate('categoryId');
        }



        let id = req.query.blogId
        let getBlog = await BlogModel.findById(id);
        if(getBlog){
            let oldImagePath = path.join(__dirname, '..', getBlog.blogImage);
            await fs.unlinkSync(oldImagePath);
        }

        let deleteBlog = await BlogModel.findByIdAndDelete(id);
        if(deleteBlog){
            console.log("Data deleted successfully..");
            return res.redirect('back');
        }
        else{
            console.log("Something went wrong..");
            return res.redirect('back');
        }
    }
    catch(error){
        console.log("error = ", error);    
        return res.redirect('back'); 
    }
};

module.exports.updateBlog = async (req, res) => {
    try{
        let singleObj = await BlogModel.findById(req.params.updateId);
        let CategoryData = await CategoryModel.find();
        res.render('Blog/UpdateBlog', {
            singleObj,
            CategoryData
        })
    }
    catch(error){
        console.log("error = ", error);    
        return res.redirect('back'); 
    }
};

module.exports.editBlog = async (req, res) => {
    try{

        let blogData = await BlogModel.findById(req.body.blogId);
        if(req.file){
            // Delete Old Image 
            let deleteImg = path.join(__dirname, '..', blogData.blogImage);
            await fs.unlinkSync(deleteImg);
            
            // Insert New Image
            let newImagePath = await BlogModel.imagePath + '/' + req.file.filename;
            req.body.blogImage = newImagePath;
        }
        else{
            req.body.blogImage = blogData.blogImage;
        }

        const updateBlog = await BlogModel.findByIdAndUpdate(req.body.blogId, req.body);

        if(updateBlog){
            console.log("Blog updated successfully");
            return res.redirect('/dashboard/viewBlog')
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
module.exports.allDeletebtn = async(req,res)=>{
    try {
        let multiDelete = await BlogModel.deleteMany({_id : {$in : req.body.Ids}})
        if (multiDelete) {
            res.redirect("back")
        } else {
            console.log("err");
            res.redirect("back")
        }    
    } catch (error) {
        console.log("error = ", error);    
        return res.redirect('back'); 
    }
}

// soft Delete 
module.exports.statusCheck = async(req,res)=>{
    try {
          console.log(req.query);
        let statusCheck1 = await BlogModel.findByIdAndUpdate(req.query.statusId,{'status' : req.query.status});
        
        if (statusCheck1) {
            res.redirect("back")
        } else {
            console.log("err");
            res.redirect("back")
        }
    } catch (err) {
        console.log(err);
        res.redirect("back")
    }
}