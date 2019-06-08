//require("winston-mongodb");
const winston = require("winston");
require("express-async-errors");

module.exports = function() {
  winston.handleExceptions(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );

  process.on("unhandledRejection", ex => {
    throw ex;
  });

  winston.handleExceptions(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "uncaughtException.log" })
  );

  winston.add(winston.transports.File, { filename: "logfile.log" });
  // winston.add(winston.transports.MongoDB, {
  //   db:
  //     "mongodb+srv://hadarOzer:realmadridcr7.@presentsdb-q4wt6.mongodb.net/Users",
  // level: "error"
  // });
  //unauthorized issue with mongodb cant log messages
};
