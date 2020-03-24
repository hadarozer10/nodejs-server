const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  if (req.session.ui) {
    res.send(true);
  } else {
    res.send(false);
  }
});

module.exports = router;
