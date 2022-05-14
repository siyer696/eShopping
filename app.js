//Core Modules
const http = require("http");
const path = require("path");

//Third Party Modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
// const expressHbs = require('express-handlebars');

const MONGODBURI =
    "mongodb+srv://node-shop:node-shop@sachincluster123.u43vg.mongodb.net/myFirstDatabase";

const app = express();
const store = new MongoDBStore({
    uri: MONGODBURI,
    collection: "sessions",
});

const csrfProtection = csrf();

// app.engine('hbs', expressHbs({ layoutDir: 'views/layout', defaultLayout: 'main-layout', extname: 'hbs' }));
app.set("view engine", "ejs");
app.set("views", "views"); //set location of views

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const errorController = require("./controllers/error");
// const mongoConnect = require("./utils/database").mongoConnect;
const User = require("./models/user");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
    session({
        secret: "my secret",
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);

//These are middlewares
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((err) => console.log(err));
});

app.use((req, res, next) => {
    //set variables that gets rendered local files/views
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

//Filtering requests
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
    .connect(
        "mongodb+srv://node-shop:" +
            "node-shop" +
            "@sachincluster123.u43vg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    )
    .then((ressult) => {
        // User.findOne().then((user) => {
        //     if (!user) {
        //         const user = new User({
        //             name: "Sachin",
        //             email: "sachin@test.com",
        //             cart: {
        //                 items: [],
        //             },
        //         });
        //         user.save();
        //     }
        // });
        app.listen(3000);
    })
    .catch((err) => {
        console.log(err);
    });
