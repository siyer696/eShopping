const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const product = require("../models/product");
const Product = require("../models/product");

module.exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
    res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
    });
};

module.exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // console.log(errors.array());
        return res.status(422).render("admin/edit-product", {
            pageTitle: "Add Product",
            path: "/admin/add-product",
            editing: false,
            hasError: true,
            errorMessage: errors.array()[0].msg,
            product: {
                title: title,
                imageUrl: imageUrl,
                price: price,
                description: description,
            },
            validationErrors: errors.array(),
        });
    }

    const product = new Product({
        // _id: new mongoose.Types.ObjectId("627d1224f1cd35d1476cc15d"),
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
        //mongoose understands this and adds id implicitly
        userId: req.user,
    });

    product
        .save()
        .then((result) => {
            //Its not a promise but mongoose still gives us then and catch functions.
            console.log("Created product!")
            res.redirect("/admin/products");
        })
        .catch((err) => {
            // return res.redirect("/500");
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

module.exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        res.redirect("/");
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        //   Product.findByPk(prodId)
        .then((product) => {
            if (!product) {
                return res.redirect("/");
            }
            res.render("admin/edit-product", {
                pageTitle: "Edit Product",
                path: "/admin/edit-product",
                editing: editMode,
                hasError: false,
                product: product,
                errorMessage: null,
                validationErrors: [],
            });
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

module.exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageurl = req.body.imageUrl;
    const updatedDescription = req.body.description;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render("admin/edit-product", {
            pageTitle: "Edit Product",
            path: "/admin/edit-product",
            editing: true,
            hasError: true,
            errorMessage: errors.array()[0].msg,
            product: {
                title: updatedTitle,
                imageUrl: updatedImageurl,
                description: updatedDescription,
                price: updatedPrice,
                _id: prodId,
            },
            validationErrors: errors.array(),
        });
    }

    Product.findById(prodId)
        .then((product) => {
            if (product.userId.toString() != req.user._id.toString()) {
                return res.redirect("/");
            }
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDescription;
            product.imageUrl = updatedImageurl;
            product.save().then((result) => {
                console.log("Updated product!!");
                res.redirect("/admin/products");
            });
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

module.exports.getProducts = (req, res, next) => {
    Product.find({ userId: req.user._id })
        // .select("title price -_id")
        //Fetches all info regarding userId
        .populate("userId", "name email")
        .then((products) => {
            // console.log(products);
            res.render("admin/products", {
                pageTitle: "Shop",
                prods: products,
                docTitle: "Shop",
                path: "/admin/products",
            });
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

module.exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteOne({ _id: prodId, userId: req.user._id })
        .then((result) => {
            console.log(result);
            console.log("DESTROYED PRODUCT");
            res.redirect("/admin/products");
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};
