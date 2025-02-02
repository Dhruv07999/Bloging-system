const express = require('express');

const routes = express.Router();

const categoryCtl = require('../controllers/CategoryController');

routes.get('/addCategory', categoryCtl.addCategory);

routes.post('/insertCategory', categoryCtl.insertCategory);

routes.get('/viewCategory', categoryCtl.viewCategory);

routes.get('/deleteCategory', categoryCtl.deleteCategory);

routes.get('/updateCategory/:updateId', categoryCtl.updateCategory);

routes.post('/editCategory', categoryCtl.editCategory);
// multiple Delete 
routes.post('/multipleDelteCategory', categoryCtl.multipleDelteCategory);

// soft delete 
routes.get('/statusCheckTrue', categoryCtl.statusCheckTrue);

module.exports = routes;