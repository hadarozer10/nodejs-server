const cors = require("cors");

module.exports = function(app) {
  app.use(
    cors({
      origin: "http://http://3.8.195.168",
      credentials: true
    })
  );
};
