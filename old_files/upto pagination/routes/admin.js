const path = require("path");

const express = require("express");
const { check, body } = require("express-validator");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// /admin/add-product -> GET Req
//is Auth is a middle ware. We can add as many middleware as we want with commma seperation
router.get("/add-product", isAuth, adminController.getAddProduct);

router.get("/products", isAuth, adminController.getProducts);

router.post(
    "/add-product",
    isAuth,
    [
        body("title", "Please enter correct Title")
            .isString()
            .isLength({ min: 3 })
            .notEmpty(),
        // body("imageUrl", "Please enter correct Image URL.").notEmpty(),
        body("price", "Please enter price as numeric value")
            .isFloat()
            .notEmpty(),
        body("description", "Please add some description")
            .notEmpty()
            .isLength({ min: 5, max: 400 })
            .trim(),
    ],
    adminController.postAddProduct
);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post("/edit-product/", isAuth, 
[
    body("title", "Please enter correct Title")
        .isString()
        .isLength({ min: 3 })
        .notEmpty(),
    // body("imageUrl", "Please enter correct Image URL.").isURL().notEmpty(),
    body("price", "Please enter price as numeric value")
        .isFloat()
        .notEmpty(),
    body("description", "Please add some description")
        .notEmpty()
        .isLength({ min: 5, max: 400 })
        .trim(),
], adminController.postEditProduct);

router.post("/delete-product/", isAuth, adminController.postDeleteProduct);

module.exports = router;
