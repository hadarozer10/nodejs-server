const express = require("express");
const app = express();
const winston = require("winston");
const path = require("path");
const port = process.env.PORT || 3000;
const server = require("http").createServer(app);
const fs = require("fs");

require("./startup/db")();
require("./startup/cors")(app);
require("./startup/logging")();
require("./startup/redis")(app);
require("./startup/routes")(app);
require("./startup/config")();
require("./startup/validation")();
require("./startup/prod")(app);

const io = require("socket.io")(server, {
  cookie: false
});

app.disable("x-powered-by");
app.use(express.static(path.join(__dirname, "build")));

if (true) {
  -app.get("/", function(req, res) {
    +app.get("/*", function(req, res) {
      res.sendFile(path.join(__dirname, "build", "index.html"));
    });
  });
}

io.of("/socket.io").on("connection", async socket => {
  // let currencies = await JSON.parse(fs.readFileSync("./currencies.json"));
  // let israeliCurrency = currencies["ils-israeli-shekel"];
  // Object.keys(currencies).map(currency => {
  //   currencies[currency] = israeliCurrency / currencies[currency];
  // });

  // socket.emit("message", currencies);
  // if (interval) {
  //   clearInterval(interval);
  //   interval = null;
  // }

  console.log("Client connected");
  var interval = setInterval(async () => {
    currencies = await JSON.parse(fs.readFileSync("./currencies.json"));
    let israeliCurrency = currencies["ils-israeli-shekel"];
    Object.keys(currencies).map(currency => {
      currencies[currency] = israeliCurrency / currencies[currency];
    });

    socket.emit("message", currencies);
  }, 5000);

  socket.on("disconnect", function() {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

server.listen(port, () => {
  winston.info(`Listening on port ${port}...`);
});

module.exports = server;
