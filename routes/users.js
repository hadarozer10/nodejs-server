require("express-async-errors");
const express = require("express");
const auth = require("../middlewares/authorization");
const admin = require("../middlewares/admin");
const _ = require("lodash");
const router = express.Router();
const { User, validate } = require("../models/usersModel");
const bcrypt = require("bcryptjs");

// register user
router.post("/", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  user = new User(
    _.pick(req.body, [
      "name",
      "email",
      "password",
      "storeName",
      "address",
      "licenceNumber",
      "ip"
    ])
  );
  await user.save();
  res.send();
});

//update a user
router.put("/updateUser", [auth], async (req, res) => {
  let user = await User.findById(req.session.ui);
  if (!user) {
    return res.status(400).send("user not exist");
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) {
    return res
      .status(400)
      .send("your password is incorrect, please type again");
  }

  if (req.body.newPassword !== "") {
    const newPass = req.body.newPassword;
    const salt = await bcrypt.genSalt(10);
    const newUserpassword = await bcrypt.hash(newPass, salt);
    user = await User.findByIdAndUpdate(req.body._id, {
      password: newUserpassword,
      name: req.body.name,
      email: req.body.email,
      storeName: req.body.storeName,
      address: req.body.address,
      licenceNumber: req.body.licenceNumber
    }).select("-password -ip -currenciesRates");
  } else {
    user = await User.findByIdAndUpdate(req.body._id, {
      name: req.body.name,
      email: req.body.email,
      storeName: req.body.storeName,
      address: req.body.address,
      licenceNumber: req.body.licenceNumber
    }).select("-password -ip -currenciesRates");
  }

  res.send(user);
});

//get a user
router.get("/me", [auth], async (req, res) => {
  const user = await User.findById(req.session.ui).select(
    "-password -ip -currenciesRates"
  );

  if (!user)
    return res.status(404).send("the user with the given id not exist");

  res.send(user);
});

//delete a user
router.delete("/:id", [auth, admin], async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  if (!user)
    return res.status(404).send("the user with the given id not exist");

  res.send();
});

//get all users
router.get("/", [auth, admin], async (req, res) => {
  const users = await User.find()
    .sort("name")
    .select("-password -ip -currenciesRates");
  res.send(users);
});

module.exports = router;
