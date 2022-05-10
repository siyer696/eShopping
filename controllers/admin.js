
const Product = require('../models/product');


module.exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
    res.render('admin/edit-product', { pageTitle: 'Add Product', path: '/admin/edit-product', editing: false });
}

module.exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product(null, title, imageUrl, description, price);
    product.save();
    res.redirect('/');
};

module.exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        if (!product) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', { pageTitle: 'Edit Product', path: '/admin/edit-product', editing: editMode, product: product });
    })
};


module.exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageurl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const updatedProduct = new Product(prodId, updatedTitle, updatedImageurl, updatedDescription, updatedPrice);
    updatedProduct.save();
    res.redirect('/admin/products');
}

module.exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('admin/products', { pageTitle: "Shop", prods: products, docTitle: 'Shop', path: '/admin/products' });
    });
};

module.exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteById(prodId);
    res.redirect('/admin/products');
};