require("express-async-errors");
const express = require("express");
const auth = require("../middlewares/authorization");
const admin = require("../middlewares/admin");
const _ = require("lodash");
const router = express.Router();
const { User, validate, validateUpdate } = require("../models/usersModel");
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
      "phone",
      "password",
      "storeName",
      "address",
      "licenceNumber",
      "ip",
      "userLanguage",
      "isLoggedIn",
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

  const { error } = validateUpdate(
    _.pick(req.body, [
      "name",
      "email",
      "phone",
      "storeName",
      "address",
      "licenceNumber",
    ]),
    user.userLanguage
  );
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  if (req.body.newPassword !== "") {
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      if (user.userLanguage === "english") {
        return res
          .status(400)
          .send("your password is incorrect, please type again");
      } else {
        return res.status(400).send("סיסמא אינה נכונה אנא הקלד שוב");
      }
    }

    const newPass = req.body.newPassword;
    const salt = await bcrypt.genSalt(10);
    const newUserpassword = await bcrypt.hash(newPass, salt);
    user = await User.findByIdAndUpdate(req.body._id, {
      password: newUserpassword,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      storeName: req.body.storeName,
      address: req.body.address,
      licenceNumber: req.body.licenceNumber,
      ip: req.body.ip,
      userLanguage: req.body.userLanguage,
    }).select("-password -ip -isLoggedIn");
  } else if (req.body.password === "") {
    user = await User.findByIdAndUpdate(req.body._id, {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      storeName: req.body.storeName,
      address: req.body.address,
      licenceNumber: req.body.licenceNumber,
      ip: req.body.ip,
      userLanguage: req.body.userLanguage,
    }).select("-password -ip -isLoggedIn");
  } else {
    if (user.userLanguage === "english") {
      return res
        .status(400)
        .send(
          "failed to update, password or new password is incorrect or not empty"
        );
    } else {
      return res
        .status(400)
        .send("עדכון נכשל, סיסמא או סיסמא חדשה שגוים או אינם ריקים");
    }
  }

  res.send(user);
});

//set user language
router.put("/setUserLanguage", [auth], async (req, res) => {
  let user = await User.findById(req.session.ui);
  if (!user) {
    return res.status(400).send("user not exist");
  }
  user = await User.findByIdAndUpdate(req.session.ui, {
    userLanguage: req.body.userLanguage,
  });

  res.send();
});

//get a user
router.get("/me", [auth], async (req, res) => {
  const user = await User.findById(req.session.ui).select(
    "-password -ip -isLoggedIn"
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
    .select("-password -currenciesRates");
  res.send(users);
});

module.exports = router;
