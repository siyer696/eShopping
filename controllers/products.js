
const Product = require('../models/product');


module.exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
    res.render('add-product', { pageTitle: 'Add Product', path: '/admin/add-product', formsCss: true, productCss: true, activeAddProduct: true });
}

module.exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
}

module.exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
        //pug doesnt need hasProducts
        res.render('shop', { pageTitle: "Shop", prods: products, docTitle: 'Shop', path: '/', hasProducts: products.length > 0, activeShop: true, productCss: true });
    });
};
