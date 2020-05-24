const cors = require("cors");

module.exports = function (app) {
  app.use(
    cors({
      origin: "http://localhost:3002",
      credentials: true,
    })
  );
};
//https://www.moneyexchangeco.com/
//http://localhost:3002
