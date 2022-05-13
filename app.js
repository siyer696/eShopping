//Core Modules
const http = require("http");
const path = require("path");

//Third Party Modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const expressHbs = require('express-handlebars');

const app = express();

// app.engine('hbs', expressHbs({ layoutDir: 'views/layout', defaultLayout: 'main-layout', extname: 'hbs' }));
app.set("view engine", "ejs");
app.set("views", "views"); //set location of views

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");
// const mongoConnect = require("./utils/database").mongoConnect;
const User = require("./models/user");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    User.findById("627d0d4bd77946820ce2437f")
        .then((user) => {
            // console.log(user);
            //it is not object... it is mongoose model.. 
            req.user = user;
            next();
        })
        .catch((err) => console.log(err));
});

//Filtering requests
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
    .connect(
        "mongodb+srv://node-shop:" +
            "node-shop" +
            "@sachincluster123.u43vg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    )
    .then((ressult) => {
        User.findOne().then(user => {
            if(!user){
                const user = new User({
                    name: 'Sachin',
                    email: 'sachin@test.com',
                    cart: {
                        items: []
                    }
                });
                user.save();

            }
        })
        app.listen(3000);
    })
    .catch((err) => {
        console.log(err);
    });
