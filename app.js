var router = require("./router.js");

//problem: need a simple way to look at users badge count and JS points in a web browser
//solution: use Node.js to perform the profile lookups and serve our template via http

//1. create a web server
var http = require('http');
http.createServer(function(request, response) {
  router.home(request, response);
  router.user(request, response);
}).listen(3000);
console.log('Server running at http://<workspace-url>');



