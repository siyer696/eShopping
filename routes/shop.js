const path = require('path');

const express = require('express');

const productController = require('../controllers/products')

const router = express.Router();


//Middleware
// '/' uses every req starting with /
router.get('/', productController.getProducts);

module.exports = router;