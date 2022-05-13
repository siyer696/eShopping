const Product = require("../models/product");
const Order = require("../models/order");

module.exports.getProducts = (req, res, next) => {
    Product.find()
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
    Product.find()
        .then((products) => {
            // console.log(products);
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
            // console.log(result);
            res.redirect("/cart");
        });
};

module.exports.postCartDeleteProduct = (req, res, next) => {
    console.log("Inside post cart delete product");
    const prodId = req.body.productId;
    req.user
        .removeFromCart(prodId)
        .then((result) => {
            res.redirect("/cart");
        })
        .catch((err) => {
            console.log(err);
        });
};

module.exports.getCart = (req, res, next) => {
    req.user
        .populate("cart.items.productId")
        .then((user) => {
            // console.log(user.cart.items);
            const products = user.cart.items;
            res.render("shop/cart", {
                path: "/cart",
                pageTitle: "Your Cart",
                products: products,
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

module.exports.postOrder = (req, res, next) => {
    req.user
        .populate("cart.items.productId")
        .then((user) => {
            const products = user.cart.items.map((i) => {
                return {
                    quantity: i.quantity,
                    //This stores whole doc instead of single product id
                    productData: { ...i.productId._doc },
                };
            });
            const order = new Order({
                user: {
                    name: req.user.name,
                    userId: req.user,
                },
                products: products,
            });
            return order.save();
        })
        .then((result) => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect("/orders");
        })
        .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
    Order.find({ "user.userId": req.user._id })
        .then((orders) => {
            // console.log(orders);
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
