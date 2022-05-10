
const Product = require('../models/product');
const Cart = require('../models/cart');

module.exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
        //pug doesnt need hasProducts
        res.render('shop/product-list', { pageTitle: "All Products", prods: products, docTitle: 'Shop', path: '/products' });
    });
};


module.exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        // res.render('shop/product-list', { pageTitle: "All Products", prods: products, docTitle: 'Shop', path: '/products' });
        console.log(product);
        res.render('shop/product-detail', { pageTitle: product.title, product: product, path: '/products' });
    });
};

module.exports.getIndex = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/index', { pageTitle: "Shop", prods: products, docTitle: 'Shop', path: '/' });
    });

};

module.exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, (product) => {
        Cart.addProduct(prodId, product.price);
    });
};

module.exports.postCartDeleteProduct = (req, res, next) => {
    console.log("Inside post cart delete product");
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        Cart.deleteProduct(prodId, product.price);
        res.redirect('/cart');
    })
};


module.exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll((products) => {
            const cartProducts = [];
            for (let product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if (cart.products.find(prod => prod.id === product.id)) {
                    cartProducts.push({ productData: product, qty: cartProductData.qty });
                }
            }
            res.render('shop/cart', { pageTitle: "Your Cart", path: '/cart', products: cartProducts });
        });
    })

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
