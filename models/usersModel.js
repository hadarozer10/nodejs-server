const Joi = require("joi");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const rateSchema = new mongoose.Schema({
  currencyName: { type: String, required: true },
  currencyValue: { type: Number, required: true },
  buyCashRate: { type: Number, required: true },
  sellCashRate: { type: Number, required: true },
  buyTransferRate: { type: Number, required: true },
  sellTransferRate: { type: Number, required: true },
  isInTable: { type: Boolean, required: true }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    validate: {
      validator: email => User.doesntExist({ email }),
      message: `Email has already taken.`
    },
    required: true
  },
  password: { type: String, required: true },
  storeName: { type: String, required: true },
  address: { type: String, required: true },
  licenceNumber: { type: String, required: true },
  currenciesRates: [rateSchema],
  ip: { type: String, required: true },
  isLoggedIn: Boolean,
  isAdmin: Boolean
});

userSchema.pre("save", async function() {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

userSchema.statics.doesntExist = async function(options) {
  return (await this.where(options).countDocuments()) === 0;
};

const User = mongoose.model("Users", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(2)
      .max(255)
      .required(),
    email: Joi.string()
      .email()
      .min(5)
      .max(255)
      .required(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required(),
    storeName: Joi.string().required(),
    address: Joi.string().required(),
    licenceNumber: Joi.string().required(),
    ip: Joi.string().required()
  };
  return Joi.validate(user, schema);
}

function validateCurrency(rate) {
  const schema = {
    currencyName: Joi.string().required(),
    currencyValue: Joi.number().required(),
    buyCashRate: Joi.number().required(),
    sellCashRate: Joi.number().required(),
    buyTransferRate: Joi.number().required(),
    sellTransferRate: Joi.number().required(),
    isInTable: Joi.boolean()
  };
  return Joi.validate(rate, schema);
}
module.exports.User = User;
module.exports.validate = validateUser;
module.exports.validateCurrency = validateCurrency;
