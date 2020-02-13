const express = require("express");
const app = express();
const winston = require("winston");
const https = require("https");
const http = require("http");
const fs = require("fs");
const WebSocket = require("ws");

const port = process.env.PORT || 3000;

require("./startup/db")();
require("./startup/redis")(app);
require("./startup/cors")(app);
require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/config")();
require("./startup/validation")();
require("./startup/prod")(app);

app.disable("x-powered-by");

const httpsOptions = {
  key: fs.readFileSync("ssl/key.pem"),
  cert: fs.readFileSync("ssl/key-cert.pem")
};

const server = http.createServer(app).listen(port, () => {
  winston.info(`Listening on port ${port}...`);
});

// const wss = new WebSocket.Server({ server });
// wss.on("connection", function connection(ws) {
//   ws.on("message", function incoming(message) {
//     console.log("received: %s", message);
//   });

//   ws.send("something");
// });

module.exports = server;
