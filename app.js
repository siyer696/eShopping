//Core Modules
const http = require('http');
const path = require('path');

//Third Party Modules
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'pug');  
app.set('views', 'views')   //set location of views

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

//Filtering requests
app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
    // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
    res.status(404).render('404', {pageTitle: "Page Not Found"});
});

app.listen(3000);
