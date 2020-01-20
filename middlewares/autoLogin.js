const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res) {
    if (req.session.ui) {
        res.send(true);
      } else {
        res.send(false);
      }
};