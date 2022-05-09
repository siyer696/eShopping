
const Product = require('../models/product');


module.exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
        //pug doesnt need hasProducts
        res.render('shop/product-list', { pageTitle: "All Products", prods: products, docTitle: 'Shop', path: '/products' });
    });
};

module.exports.getIndex = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/index', { pageTitle: "Shop", prods: products, docTitle: 'Shop', path: '/' });
    });

};

module.exports.getCart = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/cart', { pageTitle: "Your Cart", path: '/cart', });
    });

};

module.exports.getOrders = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/orders', { pageTitle: "Your Orders", path: '/orders', });
    });

};

module.exports.getCheckout = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/checkout', { pageTitle: "Checkout", path: '/checkout', });
    });
}
