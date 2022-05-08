const http = require('http');

const routes = require('./routes');
console.log(routes.someText);
// function rqListener(req, res) {

// }

//Takes function as aurgument. that is callback function
const server = http.createServer(routes.handler);

server.listen(3000);
