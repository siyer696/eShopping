const http = require('http');


//Takes function as aurgument. that is callback function
const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;
    if (url === '/') {
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>');
        res.write('<body><form action="/create-user" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
        res.write('</html>');
        return res.end();
    }


    if (url === '/users') {
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>');
        res.write('<body><ul><li>User 1</li><li>User2</li></ul></body>');
        res.write('</html>');
        return res.end();
    }

    if (url === '/create-user' && method === 'POST') {
        const body = [];
        //As data comes in chunk we need to push them in an array
        req.on("data", (chunk) => {
            body.push(chunk);
        });
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];
            console.log(message);
            res.statusCode = 302;
            res.setHeader('Location', '/');
            return res.end();
        })
    }
});

server.listen(3000);
