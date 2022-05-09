const path = require('path');

const express = require('express');

const productController = require('../controllers/products')

const router = express.Router();

// /admin/add-product -> GET Req
router.get('/add-product', productController.getAddProduct)

router.post('/add-product', productController.postAddProduct)

module.exports = router;
