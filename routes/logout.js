const express = require("express");
const router = express.Router();
const { User } = require("../models/usersModel");

router.get("/", async (req, res, next) => {
  if (req.session.ui) {
    await User.findByIdAndUpdate(req.session.ui, {
      isLoggedIn: false
    });

    req.session.destroy(err => {
      if (err) {
        return next(err);
      }
      res.clearCookie("connect.sid");

      res.send("done");
    });
  } else {
    res.send("failed to logout");
  }
});

module.exports = router;
