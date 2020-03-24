const express = require("express");
const users = require("../routes/users");
const login = require("../routes/login");
const autoLogin = require("../routes/autoLogin");
const autoLogout = require("../routes/autoLogout");
const logout = require("../routes/logout");
const forgotPassword = require("../routes/forgotPassword");
const currencies = require("../routes/currencies");
const error = require("../middlewares/error");

module.exports = function(app) {
  app.use(express.json());
  app.use("/api/userPage", users);
  app.use("/api/login", login);
  app.use("/api/autoLogout", autoLogout);
  app.use("/api/autoLogin", autoLogin);
  app.use("/api/logout", logout);
  app.use("/api/currencies", currencies);
  app.use("/api/forgotPassword", forgotPassword);
  app.use(error);
};
