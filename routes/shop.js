const path = require('path');

const express = require('express');

const rootDir = require('./../utils/path'); 
const adminData = require('./admin');

const router = express.Router();


//Middleware
// '/' uses every req starting with /
router.get('/', (req, res, next) => {
    const products = adminData.products;
    console.log('Shop.js', adminData.products);
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    res.render('shop', {pageTitle: "Shop", prods: products, docTitle: 'Shop', path: '/'});
})

module.exports = router;