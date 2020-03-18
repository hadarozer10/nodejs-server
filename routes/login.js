const bcrypt = require("bcryptjs");
const Joi = require("joi");
const express = require("express");
const { User } = require("../models/usersModel");
const router = express.Router();

router.post("/", async (req, res) => {
  const errorMessage = "Invalid email or password";
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send(errorMessage);
  }

  const loggedIn = await getSessions(user._id);
  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) {
    return res.status(400).send(errorMessage);
  }

  if (req.body.userIp != user.ip) {
    return res.status(400).send("ip address not alowed for this acount");
  }

  if (loggedIn) {
    return res.status(400).send("user already logged in");
  }

  await User.findByIdAndUpdate(user._id, {
    isLoggedIn: true
  });

  req.session.ui = user._id;
  res.send();
});

function validate(req) {
  const schema = {
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().required(),
    userIp: Joi.required()
  };
  return Joi.validate(req, schema);
}
module.exports = router;
