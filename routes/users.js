require("express-async-errors");
const express = require("express");
//const mongoose = require("mongoose");
const auth = require("../middlewares/authorization");
const admin = require("../middlewares/admin");

//required uniqly for post new users
const bcrypt = require("bcrypt");
const _ = require("lodash");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User, validate } = require("../models/usersModel");

// getting the current user
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("user already registered");

  user = new User(_.pick(req.body, ["email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.header("x-login-token", token).send(_.pick(user, ["_id", "email"]));
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    },
    { new: true }
  );

  if (!user)
    return res.status(404).send("the user with the given id not exist");

  res.send(user);
});

// router.get("/:id", async (req, res) => {
//   const user = await User.findById(req.params.id);

//   if (!user)
//     return res.status(404).send("the user with the given id not exist");

//   res.send(user);
// });

router.delete("/:id", [auth, admin], async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  if (!user)
    return res.status(404).send("the user with the given id not exist");

  res.send(user);
});

// router.get("/", async (req, res) => {
//   const users = await User.find().sort("name");
//   res.send(users);
// });

module.exports = router;
