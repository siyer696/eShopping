const fs = require('fs');
const path = require('path');

const p = path.join(path.dirname(require.main.filename), 'data', 'cart.json');

module.exports = class Cart {
    constructor() {
        this.products = [];
        this.totalPrice = 0;
    }

    static addProduct(id, productPrice) {
        // Fetch the previous cart
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            //Analyse that -> Find exsisting products
            const exsistingProductIndex = cart.products.findIndex(prod => prod.id === id);
            let exsistingProduct = cart.products[exsistingProductIndex];
            let updatedProduct;
            if (exsistingProduct) {
                // Add new product/increase quantity
                updatedProduct = { ...exsistingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[exsistingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, qty: 1 };
                cart.products = [...cart.products, updatedProduct];
            }

            cart.totalPrice = parseInt(cart.totalPrice) + parseInt(productPrice);
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log("error occured", err);
            });

        })
    }



    static deleteProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                return;
            }
            const updatedCart = { ...JSON.parse(fileContent) };
            const product = updatedCart.products.find(prod => prod.id === id);
            //Perform below only if product is present in cart.
            if (product) {
                const productQty = product.qty;
                updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
                updatedCart.totalPrice -= productPrice * productQty;

                fs.writeFile(p, JSON.stringify(updatedCart), err => {
                    console.log("error occured", err);
                });
            }
        })
    }

    static getCart(cb) {
        fs.readFile(p, (err, fileContent) => {
            const cart = JSON.parse(fileContent);
            if (err) {
                cb(null);
            } else {
                cb(cart);
            }
        })
    }
}