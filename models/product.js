const fs = require('fs');
const path = require('path');

const products = [];

const getProductsFromFile = (cb) => {
    // we pass cb function we readFile is sync fun
    const p = path.join(path.dirname(require.main.filename), 'data', 'products.json');
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            return cb([]);
        }
        else {
            console.log(JSON.parse(fileContent));
            cb(JSON.parse(fileContent));
        }
    });

}

module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    save() {
        getProductsFromFile(products => {
            products.push(this);
            const p = path.join(path.dirname(require.main.filename), 'data', 'products.json');
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log("Error occured", err);
            });
        });
    }

    static fetchAll(cb) {
        // we pass cb function we readFile is sync fun
        getProductsFromFile(cb);
    }

}