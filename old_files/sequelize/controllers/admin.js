const Product = require("../models/product");

module.exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
    res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/edit-product",
        editing: false,
    });
};

module.exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    //Magic done by sequalize - creat+AssociationName
    req.user
        .createProduct({
            title: title,
            price: price,
            imageUrl: imageUrl,
            description: description,
            userId: req.user.id,
        })
        .then((result) => {
            console.log(result);
            res.redirect("/admin/products");
        })
        .catch((err) => {
            console.log(err);
        });
};

module.exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        res.redirect("/");
    }
    const prodId = req.params.productId;
    req.user
        .getProducts({ where: { id: prodId } })
        //   Product.findByPk(prodId)
        .then((products) => {
            const product = products[0];
            if (!product) {
                return res.redirect("/");
            }
            res.render("admin/edit-product", {
                pageTitle: "Edit Product",
                path: "/admin/edit-product",
                editing: editMode,
                product: product,
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

module.exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageurl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    Product.findByPk(prodId)
        .then((product) => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.imageUrl = updatedImageurl;
            product.description = updatedDescription;
            return product.save();
        })
        .then((result) => {
            console.log("Updated product!!");
            res.redirect("/admin/products");
        })
        .catch((err) => {
            console.log(err);
        });
};

module.exports.getProducts = (req, res, next) => {
    req.user
        .getProducts()
        //   Product.findAll()
        .then((products) => {
            res.render("admin/products", {
                pageTitle: "Shop",
                prods: products,
                docTitle: "Shop",
                path: "/admin/products",
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

module.exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByPk(prodId)
        .then((product) => {
            return product.destroy();
        })
        .then((result) => {
            console.log("DESTROYED PRODUCT");
            res.redirect("/admin/products");
        })
        .catch((err) => {
            console.log(err);
        });
};
