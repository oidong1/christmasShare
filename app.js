(function() {
  var app, express, http, routes, url;

  express = require("express");

  routes = require("./routes");

  app = module.exports = express.createServer();

  http = require('http');

  url = require('url');

  app.configure(function() {
    app.set("views", __dirname + "/views");
    app.set("view engine", "ejs");
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({
      secret: "your secret here"
    }));
    app.use(app.router);
    return app.use(express.static(__dirname + "/public"));
  });

  app.configure("development", function() {
    return app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });

  app.configure("production", function() {
    return app.use(express.errorHandler());
  });

  app.get("/", function(req, res) {
    return res.render("index", {
      title: "ChristmaShare"
    });
  });

  app.post('/req', function(req, res) {
    var options;
    options = url.parse(req.body.url);
    return http.get(options, function(res2) {
      res2.setEncoding(null);
      res2.on('data', function(data) {
        return res.write(data);
      });
      return res2.on('end', function() {
        return res.end();
      });
    });
  });

  app.listen(3000);

  console.log("Express server listening on port %d in %s mode", app.address().port);

}).call(this);
