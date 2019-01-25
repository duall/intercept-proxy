var http = require('http');
var httpProxy = require('http-proxy');
var url = require('url');

var proxy = httpProxy.createProxyServer({});


// Response interception
proxy.on('proxyRes', function (proxyRes, req, res) {
    var body = new Buffer('');
    proxyRes.on('data', function (data) {
        body = Buffer.concat([body, data]);
    });
    proxyRes.on('end', function () {
        body = body.toString();
        var status = proxyRes.statusCode;
        var headers = proxyRes.headers;

        console.log('body', body);

        res.writeHead(status, headers);
        res.end(body);
    });
});

// Request interception
var server = http.createServer(function(req, res) {
    var parts = url.parse(req.url, true);
    var query = parts.query;
    proxy.web(req, res, { xforward: true, selfHandleResponse : true, toProxy: true, target: 'https://' + req.headers.host });
});

console.log("listening on port 1337")
server.listen(1337);