const cors = require("cors");

module.exports = function (app) {
  app.use(
    cors({
      origin: "https://www.moneyexchangeco.com/",
      credentials: true,
    })
  );
};
//https://www.moneyexchangeco.com/
//http://localhost:3002
