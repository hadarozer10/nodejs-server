const config = require("config");

module.exports = function(req, res, next) {
  if (!config.get("requireAuth")) return next();
  try {
    if (!req.session.ui) return res.status(401).send("access denied.");
    next();
  } catch (ex) {
    res.status(400).send("failed to connect");
  }
};
