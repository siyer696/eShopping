const db = require('../utils/database');

const Cart = require('./cart');

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        return db.execute('INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
        //?, ? , ? , ? ... parses values and check that ip does not contain any sql command. It is safe.
            [this.title, this.price, this.imageUrl, this.description]);
    }

    static fetchAll() {
        return db.execute('SELECT * from products');
    }

    static findById(id) {
        return db.execute('SELECT * from products WHERE products.id = ?', [id]);
    }

    static deleteById(id) {

    }

}