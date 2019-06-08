const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id, email: this.email, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  // in the line above we generate the payload and authentication token to the client as encoded token, we sent only the id for now
  return token;
};

const User = mongoose.model("Users", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required(),
    email: Joi.string()
      .min(3)
      .required(),
    password: Joi.string()
      .min(3)
      .required()
  };
  //relavant to lecture 119 to create
  //other database for users and syncronize them
  // name: Joi.objectId()
  // .min(3)
  // .required(),
  return Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.validate = validateUser;
