const cors = require("cors");

module.exports = function(app) {
  app.use(
    cors({
      origin: "https://localhost:3002",
      credentials: true
    })
  );
};
