const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");

module.exports = async function() {
  const db = config.get("db");
  await mongoose
    .connect(db, {
      useFindAndModify: false,
      useUnifiedTopology: true,
      useNewUrlParser: true
    })
    .then(() => winston.info(`connected to ${db}...`));
};
