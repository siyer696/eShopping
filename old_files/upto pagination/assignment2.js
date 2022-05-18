//Core Modules
const http = require('http');

//Third Party Modules
const express = require('express');

const app = express();

//Middleware

app.use((req, res, next) => {
    console.log("This is first middleware");
    next();     //next is a function that redirect the req to next middleware in line
})

app.use((req, res, next) => {
    console.log("This is second middleware");
    next();     //next is a function that redirect the req to next middleware in line
})


app.use('/users', (req, res, next) => {
    console.log("In the users middleware");
    //Set header as text/html as default
    res.send('<h1>Users page</h1>');
})


// '/' uses every req starting with /
app.use('/', (req, res, next) => {
    console.log("In the default middleware");
    //Set header as text/html as default
    res.send('<h1>Default Page</h1>');
})

app.listen(3000);
