const config = require("config");
const { User } = require("../models/usersModel");

module.exports = async function(req, res, next) {
  if (!config.get("requireAuth")) return next();
  try {
    let user = await User.findById(req.session.ui);
    if (!user || !user.isAdmin) return res.status(404).send("access denied.");
    next();
  } catch (ex) {
    res.status(400).send("failed to connect");
  }
};
