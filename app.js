//Core Modules
const http = require("http");
const path = require("path");

//Third Party Modules
const express = require("express");
const bodyParser = require("body-parser");
// const expressHbs = require('express-handlebars');

const app = express();

// app.engine('hbs', expressHbs({ layoutDir: 'views/layout', defaultLayout: 'main-layout', extname: 'hbs' }));
app.set("view engine", "ejs");
app.set("views", "views"); //set location of views

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");
const mongoConnect = require("./utils/database").mongoConnect;
const User = require("./models/user");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    User.findById("622b2b9d53978dd0436dba7b")
        .then((user) => {
            // console.log(user);
            req.user = new User(user.name, user.email, user.cart, user._id);
            next();
        })
        .catch((err) => console.log(err));
});

//Filtering requests
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000);
});
