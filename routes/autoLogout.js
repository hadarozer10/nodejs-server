const express = require("express");
const { User } = require("../models/usersModel");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.body._id, {
      isLoggedIn: false,
    });

    await deleteSession(req.body._id);
    res.send("done");
  } catch {
    res.send("cannot logout");
  }
});

module.exports = router;
