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
  cookie: false,
});

app.disable("x-powered-by");
app.use(express.static(path.join(__dirname, "build")));

if (true) {
  -app.get("/", function (req, res) {
    +app.get("/*", function (req, res) {
      res.sendFile(path.join(__dirname, "build", "index.html"));
    });
  });
}

io.of("/socket.io").on("connection", async (socket) => {
  console.log("Client connected");

  // socket.on("initialCall", currencies);
  var interval = setInterval(async () => {
    currencies = await JSON.parse(fs.readFileSync("./currencies.json"));
    let israeliCurrency = currencies["ils-israeli-shekel"];
    Object.keys(currencies).map((currency) => {
      currencies[currency] = israeliCurrency / currencies[currency];
    });
    var servernow = new Date();
    serverTime = servernow.toLocaleTimeString("he-IL", {
      hour12: false,
      timeZone: "Asia/Jerusalem",
    });
    socket.emit("message", { currencies, serverTime });
  }, 60000);

  socket.on("disconnect", function () {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

server.listen(port, () => {
  winston.info(`Listening on port ${port}...`);
});

module.exports = server;
