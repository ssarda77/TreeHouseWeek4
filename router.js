var Profile = require("./profile.js");
var renderer = require("./renderer.js");
var querystring = require("querystring");

//handle http route GET / and POST
function home(request, response) {
  // if url ==" /" && get
  if (request.url === "/" ) {
    if (request.method.toLowerCase() === "get") {
      //show search 
      response.writeHead(200,{'Content-Type': 'text/html'});
      renderer.view("header", {}, response);
      renderer.view("search", {}, response);
      renderer.view("footer", {}, response);
      response.end();
    } else {
      //if url == "/" and POST
      
      request.on("data", function(postBody) {
        var query = querystring.parse(postBody.toString());
        response.writeHead(303,{"Location": "/" + query.username});
        response.end();
      });
      
      //redirect to /username
    }
  }
  
}

//handle http route GET/:username 
function user(request, response) {  
  //if url ="/..."
  var username = request.url.replace("/","");
  if (username.length > 0) {
    response.writeHead(200,{'Content-Type': 'text/plain'});
    renderer.view("header", {}, response);
    
    //get json from Treehouse
    var studentProfile = new Profile(username);
     //on "end"
    studentProfile.on("end", function(profileJSON) {
      //show profile
      
      //store values we need
      var values = {
        avatarUrl: profileJSON.gravatar_url,
        username: profileJSON.profile_name,
        badges: profileJSON.badges.length,
        javascriptPoints: profileJSON.points.JavaScript
      }
      //simple response
      response.write(values.username + " has " + values.badges + "\n");
      renderer.view("profile", values, response);
      renderer.view("footer", {}, response);
      response.end();
    });
    
    //on "error"
    studentProfile.on("error", function(error) {
      //show error
      renderer.view("error", {errorMessage: error.message}, response);
      renderer.view("search", {}, response); 
      renderer.view("footer", {}, response);
      response.end();
    });
  }
}

module.exports.home = home;
module.exports.user = user;