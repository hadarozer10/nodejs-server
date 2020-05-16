const bcrypt = require("bcryptjs");
const Joi = require("joi");
const express = require("express");
const { User } = require("../models/usersModel");
const router = express.Router();

router.post("/", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).send("Email or password is incorrect");
  }

  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const loggedIn = await getSessions(user._id, req.body.sess);

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) {
    if (user.userLanguage === "english") {
      return res.status(400).send("Email or password is incorrect");
    } else {
      return res.status(400).send("שם משתמש או סיסמא אינם נכונים");
    }
  }

  if (req.body.userIp != user.ip) {
    if (user.userLanguage === "english") {
      return res.status(400).send("ip address not alowed for this acount");
    } else {
      return res.status(400).send("כתובת האינטרנט אינה מורשת למשתמש זה");
    }
  }

  if (loggedIn) {
    if (user.userLanguage === "english") {
      return res.status(400).send("user already logged in");
    } else {
      return res.status(400).send("המשתמש הקיים כבר מחובר");
    }
  }

  await User.findByIdAndUpdate(user._id, {
    isLoggedIn: true,
  });

  req.session.ui = user._id;
  res.send();
});

function validate(req) {
  const schema = {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    userIp: Joi.required(),
    sess: Joi.required(),
  };
  return Joi.validate(req, schema);
}
module.exports = router;
