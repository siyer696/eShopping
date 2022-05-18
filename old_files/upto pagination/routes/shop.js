const path = require("path");

const express = require("express");

const shopController = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

//Middleware
// '/' uses every req starting with /
router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

// router.get('/products/delete');

// // request url containing params should be at last as express may consider above request for productId
router.get("/products/:productId", shopController.getProduct);

router.post("/cart", isAuth, shopController.postCart);

router.get("/cart", isAuth, shopController.getCart);

router.post("/cart-delete-item", isAuth, shopController.postCartDeleteProduct);

router.post("/create-order", isAuth, shopController.postOrder);

router.get("/orders", isAuth, shopController.getOrders);

router.get("/orders/:orderId", isAuth, shopController.getInvoice);

// router.get('/checkout', shopController.getCheckout);

module.exports = router;
