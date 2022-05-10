const fs = require('fs');
const path = require('path');

const Cart = require('./cart');

const p = path.join(path.dirname(require.main.filename), 'data', 'products.json');

const getProductsFromFile = (cb) => {
    // we pass cb function we readFile is sync fun
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            return cb([]);
        }
        else {
            // console.log(JSON.parse(fileContent));
            cb(JSON.parse(fileContent));
        }
    });

}

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile(products => {
            if (this.id) {
                const exsistingProductIndex = products.findIndex(prod => prod.id === this.id);
                const updatedProduct = [...products];
                updatedProduct[exsistingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProduct), (err) => {
                    console.log("Error occured", err);
                });
            }
            else {
                this.id = Math.random().toString();
                products.push(this);
                const p = path.join(path.dirname(require.main.filename), 'data', 'products.json');
                fs.writeFile(p, JSON.stringify(products), (err) => {
                    console.log("Error occured", err);
                });
            }
        });
    }

    static fetchAll(cb) {
        // we pass cb function we readFile is sync fun
        getProductsFromFile(cb);
    }

    static findById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            cb(product);
        });
    }

    static deleteById(id) {
        getProductsFromFile(products => {
            const product = products.find(prod => prod.id === id);
            const updatedProducts = products.filter(p => p.id !== id);
            fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                if (!err) {
                    Cart.deleteProduct(id, product.price);
                }
                else { console.log("Error occured in deltebyId", err); }
            })
        });

    }

}