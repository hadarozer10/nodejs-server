const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  if (req.session.ui) {
    req.session.destroy(err => {
      if (err) {
        return next(err);
      }
      res.clearCookie("connect.sid", { path: "/" });
      res.send("done");
    });
  } else {
    res.send("failed to logout");
  }
});

module.exports = router;
