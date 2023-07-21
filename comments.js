// Create web server with Node.js

var http = require("http");
var fs = require("fs");
var url = require("url");
var querystring = require("querystring");
var path = require("path");
var comments = require("./comments.json");

http.createServer(function (req, res) {
    var pathname = url.parse(req.url).pathname;
    var query = url.parse(req.url).query;
    var queryObj = querystring.parse(query);

    if (pathname == "/") {
        fs.readFile("./index.html", function (err, data) {
            if (err) {
                console.log(err);
                res.writeHead(404, { "Content-Type": "text/html" });
                res.end("<h1>404 Not Found</h1>");
            } else {
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(data);
            }
        });
    } else if (pathname == "/getComment") {
        var comment = comments[queryObj.id];
        var str = JSON.stringify(comment);
        res.end(str);
    } else if (pathname == "/submitComment") {
        var comment = queryObj;
        var date = new Date();
        comment.time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        comment.content = comment.content.replace(/</g, "&lt;");
        comment.content = comment.content.replace(/>/g, "&gt;");
        comments.push(comment);
        var str = JSON.stringify(comments);
        fs.writeFile("./comments.json", str, function (err) {
            if (err) {
                console.log(err);
            } else {
                res.end("success");
            }
        });
    } else {
        fs.readFile("." + pathname, function (err, data) {
            if (err) {
                console.log(err);
                res.writeHead(404, { "Content-Type": "text/html" });
                res.end("<h1>404 Not Found</h1>");
            } else {
                var extname = path.extname(pathname);
                var contentType = getContentType(extname);
                res.writeHead(200, { "Content-Type": contentType });
                res.end(data);
            }
        });
    }
}).listen(3000, "

