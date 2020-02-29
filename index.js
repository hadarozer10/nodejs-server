const express = require("express");
const app = express();
const winston = require("winston");
const http = require("http");
const path = require("path");
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

app.use(express.static(path.join(__dirname, "build")));

if (true) {
  -app.get("/", function(req, res) {
    +app.get("/*", function(req, res) {
      res.sendFile(path.join(__dirname, "build", "index.html"));
    });
  });
}

const server = http.createServer(app).listen(port, () => {
  winston.info(`Listening on port ${port}...`);
});

module.exports = server;
