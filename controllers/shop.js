const Product = require("../models/product");

module.exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then((products) => {
            res.render("shop/product-list", {
                pageTitle: "All Products",
                prods: products,
                docTitle: "Shop",
                path: "/products",
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    // Product.findAll({ where: { id: prodId } })
    //   .then(products => {
    //     res.render('shop/product-detail', {
    //       product: products[0],
    //       pageTitle: products[0].title,
    //       path: '/products'
    //     });
    //   })
    //   .catch(err => console.log(err));
    Product.findById(prodId)
        .then((product) => {
            res.render("shop/product-detail", {
                product: product,
                pageTitle: product.title,
                path: "/products",
            });
        })
        .catch((err) => console.log(err));
};

module.exports.getIndex = (req, res, next) => {
    Product.fetchAll()
        .then((products) => {
            res.render("shop/index", {
                pageTitle: "Shop",
                prods: products,
                path: "/",
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

module.exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then((product) => {
            return req.user.addToCart(product);
        })
        .then((result) => {
            console.log(result);
            res.redirect("/cart");
        });
};

module.exports.postCartDeleteProduct = (req, res, next) => {
    console.log("Inside post cart delete product");
    const prodId = req.body.productId;
    req.user
        .deleteItemFromCart(prodId)
        .then((result) => {
            res.redirect("/cart");
        })
        .catch((err) => {
            console.log(err);
        });
};

module.exports.getCart = (req, res, next) => {
    console.log(req.user);
    req.user
        .getCart()
        .then((products) => {
            res.render("shop/cart", {
                path: "/cart",
                pageTitle: "Your Cart",
                products: products,
            });
        })
        .catch((err) => console.log(err));
};

module.exports.postOrder = (req, res, next) => {
    console.log("Inside POst Order");
    let fetchedCart;
    req.user
        .addOrder()
        .then((result) => {
            res.redirect("/orders");
        })
        .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
    req.user
        .getOrders()
        .then((orders) => {
            console.log(orders);
            res.render("shop/orders", {
                path: "/orders",
                pageTitle: "Your Orders",
                orders: orders,
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getCheckout = (req, res, next) => {
    res.render("shop/checkout", {
        path: "/checkout",
        pageTitle: "Checkout",
    });
};
