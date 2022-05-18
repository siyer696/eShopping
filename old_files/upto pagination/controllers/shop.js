const fs = require("fs");
const path = require("path");

const PDFDocument = require("pdfkit");

const Product = require("../models/product");
const Order = require("../models/order");

const ITEMS_PER_PAGE = 2;

module.exports.getProducts = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;
    Product.count()
        .then((numProducts) => {
            totalItems = numProducts;
            return Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE) //Skip N Items
                .limit(ITEMS_PER_PAGE);
        })
        .then((products) => {
            res.render("shop/product-list", {
                pageTitle: "All Products",
                prods: products,
                docTitle: "Shop",
                path: "/products",
                currentPage: page,
                hasNextPage: totalItems > ITEMS_PER_PAGE * page,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
            });
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
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
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

module.exports.getIndex = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;

    Product.find()
        .count()
        .then((numProducts) => {
            totalItems = numProducts;
            return Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE) //Skip N Items
                .limit(ITEMS_PER_PAGE);
        })
        .then((products) => {
            // console.log(products);
            res.render("shop/index", {
                pageTitle: "Shop",
                prods: products,
                path: "/",
                csrfToken: req.csrfToken(),
                currentPage: page,
                hasNextPage: totalItems > ITEMS_PER_PAGE * page,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
            });
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
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
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
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
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
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
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
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
                    email: req.user.email,
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
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
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
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getCheckout = (req, res, next) => {
    res.render("shop/checkout", {
        path: "/checkout",
        pageTitle: "Checkout",
    });
};

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    Order.findById(orderId)
        .then((order) => {
            if (!order) {
                return next(new Error("No Order Found"));
            }
            if (order.user.userId.toString() !== req.user._id.toString()) {
                return next(new Error("Unauthorized"));
            }

            const invoiceName = "invoice-" + orderId + ".pdf";
            const invoicePath = path.join("data", "invoices", invoiceName);

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
                "Content-Disposition",
                'inline; filename="' + invoiceName + '"'
            );

            const pdfDoc = new PDFDocument();
            pdfDoc.pipe(fs.createWriteStream(invoicePath));
            pdfDoc.pipe(res);

            pdfDoc.fontSize(26).text("Invoice", {
                underline: true,
            });

            pdfDoc.text("--------------------------");
            let totalPrice = 0;
            order.products.forEach((prod) => {
                totalPrice += prod.quantity * prod.productData.price;
                pdfDoc
                    .fontSize(14)
                    .text(
                        prod.productData.title +
                            "  --  " +
                            prod.quantity +
                            "  x  " +
                            "$" +
                            prod.productData.price
                    );
            });
            pdfDoc.text("Total Price: $" + totalPrice);

            pdfDoc.end();
            // fs.readFile(invoicePath, (err, data) => {
            //     if (err) {
            //         return next(err);
            //     }
            //     res.setHeader("Content-Type", "application/pdf");
            //     res.setHeader(
            //         "Content-Disposition",
            //         'inline; filename="' + invoiceName + '"'
            //     );
            //     res.send(data);
            // });

            //It streams the files present.
            // const file = fs.createReadStream(invoicePath);
            // file.pipe(res);
        })
        .catch((err) => {
            next(err);
        });
};
