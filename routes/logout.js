const express = require("express");
const router = express.Router();
const config = require("config");

router.post("/", async (req, res) => {
  const sessName = config.get("SESS_NAME");
  new Promise((resolve, reject) => {
    req.session.destroy(err => {
      if (err) reject(err);

      res.clearCookie(sessName);

      resolve(true);
    });
  });
});

module.exports = router;
