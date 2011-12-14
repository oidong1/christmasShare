var app, count, express, io, routes;

express = require("express");

routes = require("./routes");

app = module.exports = express.createServer();

io = require("socket.io").listen(app);

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

count = 0;

io.sockets.on("connection", function(client) {
  count++;
  client.broadcast.emit("count", count);
  client.emit("count", count);
  client.on("message", function(msg) {
    client.broadcast.emit("message", msg);
    return client.send(msg);
  });
  return client.on("disconnect", function() {
    return count--;
  });
});

app.listen(3000);

console.log("Express server listening on port %d in %s mode", app.address().port);