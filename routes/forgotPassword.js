const express = require("express");
const router = express.Router();
const _ = require("lodash");
const nodemailer = require("nodemailer");
const { User } = require("../models/usersModel");
const Joi = require("joi");
const generator = require("generate-password");
const bcrypt = require("bcryptjs");
const config = require("config");
const auth = require("../middlewares/authorization");
const admin = require("../middlewares/admin");

router.post("/", async (req, [auth, admin], res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("email not registered");

  //generate random hashed password
  let newPassword = generator.generate({
    length: 10,
    numbers: true
  });
  let transporter = {};
  let mailOptions = {};
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  await user
    .updateOne({
      email: req.body.email,
      password: user.password
    })
    .then(
      (transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: config.get("emailRecoveryMailer"),
          pass: config.get("passwordRecoveryMailer")
        }
      }))
    )

    .then(
      (mailOptions = {
        from: "ozerhadar10@gmail.com",
        to: "ozerhadar10@gmail.com",
        subject: "presents reset password",
        text: `reset password : ${newPassword}`
      })
    )

    .then(
      transporter.sendMail(mailOptions, function(error) {
        if (error) {
          return res.status(400).send("recovery email not sent");
        } else {
          return res.status(200).send("recovery email sent");
        }
      })
    );

  //update the user in database with the new password
  //send an email with the new password

  function validate(req) {
    const schema = {
      email: Joi.string()
        .email()
        .required()
    };

    return Joi.validate(req, schema);
  }
  console.log(user.password);
});
module.exports = router;
