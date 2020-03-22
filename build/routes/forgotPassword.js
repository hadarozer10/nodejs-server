const express = require("express");
const router = express.Router();
const _ = require("lodash");
const nodemailer = require("nodemailer");
const { User } = require("../models/usersModel");
const Joi = require("joi");
const generator = require("generate-password");
const bcrypt = require("bcryptjs");
const config = require("config");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("email not found");

  //generate random hashed password
  let newPassword = generator.generate({
    length: 10,
    numbers: true
  });
  let transporter = {};
  let mailOptions = {};
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  await User.findByIdAndUpdate(user._id, {
    password: user.password
  });

  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, //true
    requireTLS: true,
    auth: {
      user: config.get("emailRecoveryMailer"),
      pass: config.get("passwordRecoveryMailer")
    }
  });

  mailOptions = {
    from: "ozerhadar10@gmail.com",
    to: "ozerhadar10@gmail.com",
    subject: "moneyExchange reset password",
    text: `new password : ${newPassword}`
  };

  transporter.sendMail(mailOptions, function(error) {
    if (error) {
      return res.status(400).send("recovery email not sent");
    } else {
      return res.status(200).send("recovery email sent");
    }
  });

  function validate(req) {
    const schema = {
      email: Joi.string()
        .email()
        .required()
    };

    return Joi.validate(req, schema);
  }
});
module.exports = router;
