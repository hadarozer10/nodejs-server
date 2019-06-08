const express = require("express");
const users = require("../routes/users");
const login = require("../routes/login");
const error = require("../middlewares/error");

module.exports = function(app) {
  app.use(express.json());
  app.use("/userPage", users);
  app.use("/login", login);
  app.use(error);
};
