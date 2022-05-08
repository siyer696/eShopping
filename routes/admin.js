const path = require('path');

const express = require('express');

const rootDir = require('./../utils/path')

const router = express.Router();

const products = [];

// /admin/add-product -> GET Req
router.get('/add-product', (req, res, next) => {
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
    res.render('add-product', { pageTitle: 'Add Product', path: '/admin/add-product' });
})

router.post('/add-product', (req, res, next) => {
    console.log(req.body);
    products.push({ pageTitle: 'Add Product', title: req.body.title });
    res.redirect('/');
})

module.exports.routes = router;
module.exports.products = products;
