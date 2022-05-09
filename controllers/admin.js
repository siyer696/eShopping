
const Product = require('../models/product');


module.exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
    res.render('admin/add-product', { pageTitle: 'Add Product', path: '/admin/add-product', formsCss: true, productCss: true, activeAddProduct: true });
}

module.exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product(title, imageUrl, description, price);
    product.save();
    res.redirect('/');
};

module.exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('admin/products', { pageTitle: "Shop", prods: products, docTitle: 'Shop', path: '/admin/products' });
    });
}