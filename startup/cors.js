const cors = require("cors");

module.exports = function(app) {
  app.use(
    cors({
      origin: "http://localhost:5000",
      credentials: true
    })
  );
};
