const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop')

const router = express.Router();


//Middleware
// '/' uses every req starting with /
router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/delete');

// request url containing params should be at last as express may consider above request for productId
router.get('/products/:productId', shopController.getProduct);

router.post('/cart', shopController.postCart);

router.get('/cart', shopController.getCart);

router.post('/cart-delete-item', shopController.postCartDeleteProduct);

router.get('/orders', shopController.getOrders);

router.get('/checkout', shopController.getCheckout);

module.exports = router;