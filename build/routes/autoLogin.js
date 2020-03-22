const { User } = require("../models/usersModel");

module.exports = async function(req, res) {
  if (req.session.ui) {
    let user = await User.findById(req.session.ui);
    if (user.isLoggedIn) {
      res.send(true);
    } else {
      res.send(false);
    }
  } else {
    res.send(false);
  }
};
