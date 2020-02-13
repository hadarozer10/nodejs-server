const express = require("express");
const users = require("../routes/users");
const login = require("../routes/login");
const autoLogin = require("../routes/autoLogin");
const logout = require("../routes/logout");
const forgotPassword = require("../routes/forgotPassword");
const currencies = require("../routes/currencies");
const error = require("../middlewares/error");

module.exports = function(app) {
  app.use(express.json());
  app.use("/userPage", users);
  app.use("/login", login);
  app.use("/autoLogin", autoLogin);
  app.use("/logout", logout);
  app.use("/currencies", currencies);
  app.use("/forgotPassword", forgotPassword);
  app.use(error);
};
