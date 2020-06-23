const Joi = require("joi");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { min } = require("lodash");

const rateSchema = new mongoose.Schema({
  currencyName: { type: String, required: true },
  currencyValue: { type: Number, required: true },
  buyCashRate: { type: Number, required: true },
  sellCashRate: { type: Number, required: true },
  buyTransferRate: { type: Number, required: true },
  sellTransferRate: { type: Number, required: true },
  isInTable: { type: Boolean, required: true },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    validate: {
      validator: (email) => User.doesntExist({ email }),
      message: `Email has already taken.`,
    },
    required: true,
  },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  storeName: { type: String, required: true },
  address: { type: String, required: true },
  licenceNumber: { type: String, required: true },
  currenciesRates: [rateSchema],
  ip: { type: String, required: true },
  userLanguage: { type: String, required: true },
  currencyPrecision: { type: Number, required: true },
  calculatorPrecision: { type: Number, required: true },
  isLoggedIn: { type: Boolean, required: true },
  userLogo: { type: String },
  logoEngSize: { type: Number, required: true },
  logoEngVer: { type: Number, required: true },
  logoEngHorz: { type: Number, required: true },
  logoHebSize: { type: Number, required: true },
  logoHebVer: { type: Number, required: true },
  logoHebHorz: { type: Number, required: true },
  backgroundColor: { type: Object, required: true },
  fontColor: { type: Object, required: true },
  fontSize: { type: Number, required: true },
  isAdmin: Boolean,
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

userSchema.statics.doesntExist = async function (options) {
  return (await this.where(options).countDocuments()) === 0;
};

const User = mongoose.model("Users", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(2)
      .max(255)
      .required()
      .error(() => {
        if (user.userLanguage === "english") {
          return {
            message: "Name is incorrect or empty.",
          };
        } else {
          return {
            message: "שם משתמש לא תקין",
          };
        }
      }),
    email: Joi.string()
      .email()
      .min(5)
      .max(255)
      .required()
      .error(() => {
        if (user.userLanguage === "english") {
          return {
            message: "Email is incorrect or empty.",
          };
        } else {
          return {
            message: "אימייל לא תקין",
          };
        }
      }),
    phone: Joi.string()
      .min(5)
      .max(255)
      .required()
      .error(() => {
        if (user.userLanguage === "english") {
          return {
            message: "Phone is incorrect or empty.",
          };
        } else {
          return {
            message: "טלפון לא תקין",
          };
        }
      }),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
      .error(() => {
        if (user.userLanguage === "english") {
          return {
            message: "Password is incorrect or empty.",
          };
        } else {
          return {
            message: "סיסמה לא תקינה",
          };
        }
      }),
    storeName: Joi.string()
      .required()
      .error(() => {
        if (user.userLanguage === "english") {
          return {
            message: "Store name is incorrect or empty.",
          };
        } else {
          return {
            message: "שם חנות לא תקין",
          };
        }
      }),
    address: Joi.string()
      .required()
      .error(() => {
        if (user.userLanguage === "english") {
          return {
            message: "Address is incorrect or empty.",
          };
        } else {
          return {
            message: "כתובת לא תקינה",
          };
        }
      }),
    licenceNumber: Joi.string()
      .required()
      .error(() => {
        if (user.userLanguage === "english") {
          return {
            message: "Licence number is incorrect or empty.",
          };
        } else {
          return {
            message: "מספר רשיון לא תקין",
          };
        }
      }),
    currencyPrecision: Joi.number()
      .required()
      .min(2)
      .max(6)
      .error(() => {
        if (user.userLanguage === "english") {
          return {
            message:
              "number of precision is incorrect, please choose range between 2 to 5.",
          };
        } else {
          return {
            message: "מספר לדיוק המטבע לא תקין, אנא בחר טווח בין 2 ל - 5",
          };
        }
      }),
    calculatorPrecision: Joi.number()
      .required()
      .min(0)
      .max(20)
      .error(() => {
        if (user.userLanguage === "english") {
          return {
            message:
              "number of precision is incorrect, please choose range between 0 to 20.",
          };
        } else {
          return {
            message: "מספר לדיוק המטבע לא תקין, אנא בחר טווח בין 0 ל - 20",
          };
        }
      }),
    ip: Joi.required(),
    userLanguage: Joi.required(),
    isLoggedIn: Joi.required(),
    userLogo: Joi.required(),
    logoEngSize: Joi.number()
      .required()
      .min(0)
      .error(() => {
        if (user.userLanguage === "english") {
          return {
            message: "logo size is incorrect, please enter number.",
          };
        } else {
          return {
            message: "גודל לוגו לא תקין, אנא בחר מספר",
          };
        }
      }),
    logoEngVer: Joi.number()
      .required()
      .error(() => {
        if (user.userLanguage === "english") {
          return {
            message: "incorrect value, please enter number.",
          };
        } else {
          return {
            message: "ערך לא תקין, אנא בחר מספר",
          };
        }
      }),
    logoEngHorz: Joi.number()
      .required()
      .error(() => {
        if (user.userLanguage === "english") {
          return {
            message: "incorrect value, please enter number.",
          };
        } else {
          return {
            message: "ערך לא תקין, אנא בחר מספר",
          };
        }
      }),
    logoHebSize: Joi.number()
      .required()
      .min(0)
      .error(() => {
        if (user.userLanguage === "english") {
          return {
            message: "logo size is incorrect, please enter number.",
          };
        } else {
          return {
            message: "גודל לוגו לא תקין, אנא בחר מספר",
          };
        }
      }),
    logoHebVer: Joi.number()
      .required()
      .error(() => {
        if (user.userLanguage === "english") {
          return {
            message: "incorrect value, please enter number.",
          };
        } else {
          return {
            message: "ערך לא תקין, אנא בחר מספר",
          };
        }
      }),
    logoHebHorz: Joi.number()
      .required()
      .error(() => {
        if (user.userLanguage === "english") {
          return {
            message: "logo size is incorrect, please enter number.",
          };
        } else {
          return {
            message: "גודל לוגו לא תקין, אנא בחר מספר",
          };
        }
      }),
    backgroundColor: Joi.required(),
    fontColor: Joi.required(),
    fontSize: Joi.number()
      .required()
      .min(0)
      .error(() => {
        if (user.userLanguage === "english") {
          return {
            message: "font size is incorrect, please enter number.",
          };
        } else {
          return {
            message: "גודל גופן רשומת טבלה לא תקין, אנא בחר מספר",
          };
        }
      }),
  };
  return Joi.validate(user, schema);
}

function validateUpdate(user, language) {
  const schema = {
    name: Joi.string()
      .min(2)
      .max(255)
      .required()
      .error(() => {
        if (language === "english") {
          return {
            message: "Name is incorrect or empty.",
          };
        } else {
          return {
            message: "שם משתמש לא תקין",
          };
        }
      }),
    email: Joi.string()
      .email()
      .min(5)
      .max(255)
      .required()
      .error(() => {
        if (language === "english") {
          return {
            message: "Email is incorrect or empty.",
          };
        } else {
          return {
            message: "אימייל לא תקין",
          };
        }
      }),
    phone: Joi.string()
      .min(5)
      .max(255)
      .required()
      .error(() => {
        if (language === "english") {
          return {
            message: "Phone is incorrect or empty.",
          };
        } else {
          return {
            message: "טלפון לא תקין",
          };
        }
      }),
    storeName: Joi.string()
      .required()
      .error(() => {
        if (language === "english") {
          return {
            message: "Store name is incorrect or empty.",
          };
        } else {
          return {
            message: "שם חנות לא תקין",
          };
        }
      }),
    address: Joi.string()
      .required()
      .error(() => {
        if (language === "english") {
          return {
            message: "Address is incorrect or empty.",
          };
        } else {
          return {
            message: "כתובת לא תקינה",
          };
        }
      }),
    licenceNumber: Joi.string()
      .required()
      .error(() => {
        if (language === "english") {
          return {
            message: "Licence number is incorrect or empty.",
          };
        } else {
          return {
            message: "מספר רשיון לא תקין",
          };
        }
      }),
    currencyPrecision: Joi.number()
      .required()
      .min(2)
      .max(5)
      .error(() => {
        if (user.userLanguage === "english") {
          return {
            message:
              "number of precision is incorrect, please choose range between 2 to 5.",
          };
        } else {
          return {
            message: "מספר לדיוק המטבע לא תקין, אנא בחר טווח בין 2 ל - 5",
          };
        }
      }),
    calculatorPrecision: Joi.number()
      .required()
      .min(0)
      .max(20)
      .error(() => {
        if (user.userLanguage === "english") {
          return {
            message:
              "number of precision is incorrect, please choose range between 0 to 20.",
          };
        } else {
          return {
            message: "מספר לדיוק המטבע לא תקין, אנא בחר טווח בין 0 ל - 20",
          };
        }
      }),
    logoEngSize: Joi.number()
      .required()
      .min(0)
      .error(() => {
        if (user.userLanguage === "english") {
          return {
            message: "logo size is incorrect, please enter number.",
          };
        } else {
          return {
            message: "גודל לוגו לא תקין, אנא בחר מספר",
          };
        }
      }),
    logoEngVer: Joi.number()
      .required()
      .error(() => {
        if (user.userLanguage === "english") {
          return {
            message: "incorrect value, please enter number.",
          };
        } else {
          return {
            message: "ערך לא תקין, אנא בחר מספר",
          };
        }
      }),
    logoEngHorz: Joi.number()
      .required()
      .error(() => {
        if (user.userLanguage === "english") {
          return {
            message: "incorrect value, please enter number.",
          };
        } else {
          return {
            message: "ערך לא תקין, אנא בחר מספר",
          };
        }
      }),
    logoHebSize: Joi.number()
      .required()
      .min(0)
      .error(() => {
        if (user.userLanguage === "english") {
          return {
            message: "logo size is incorrect, please enter number.",
          };
        } else {
          return {
            message: "גודל לוגו לא תקין, אנא בחר מספר",
          };
        }
      }),
    logoHebVer: Joi.number()
      .required()
      .error(() => {
        if (user.userLanguage === "english") {
          return {
            message: "incorrect value, please enter number.",
          };
        } else {
          return {
            message: "ערך לא תקין, אנא בחר מספר",
          };
        }
      }),
    logoHebHorz: Joi.number()
      .required()
      .error(() => {
        if (user.userLanguage === "english") {
          return {
            message: "incorrect value, please enter number.",
          };
        } else {
          return {
            message: "ערך לא תקין, אנא בחר מספר",
          };
        }
      }),
    backgroundColor: Joi.required(),
    fontColor: Joi.required(),
    fontSize: Joi.number()
      .required()
      .min(0)
      .error(() => {
        if (user.userLanguage === "english") {
          return {
            message: "font size is incorrect, please enter number.",
          };
        } else {
          return {
            message: "גודל גופן רשומת טבלה לא תקין, אנא בחר מספר",
          };
        }
      }),
  };
  return Joi.validate(user, schema);
}

function validateCurrency(rate, userLanguage) {
  const schema = {
    currencyName: Joi.string()
      .required()
      .error(() => {
        if (userLanguage === "english") {
          return {
            message: "Currency name is incorrect.",
          };
        } else {
          return {
            message: "מטבע אינו תקין",
          };
        }
      }),
    currencyValue: Joi.number()
      .required()
      .error(() => {
        if (userLanguage === "english") {
          return {
            message: "Currency value is incorrect.",
          };
        } else {
          return {
            message: "ערך מטבע אינו תקין",
          };
        }
      }),
    buyCashRate: Joi.number()
      .required()
      .error(() => {
        if (userLanguage === "english") {
          return {
            message: "operation canceled, illegal rate value.",
          };
        } else {
          return {
            message: "הפעולה לא בוצעה, ערך עמלה אינו תקין",
          };
        }
      }),
    sellCashRate: Joi.number()
      .required()
      .error(() => {
        if (userLanguage === "english") {
          return {
            message: "operation canceled, illegal rate value.",
          };
        } else {
          return {
            message: "הפעולה לא בוצעה, ערך עמלה אינו תקין",
          };
        }
      }),
    buyTransferRate: Joi.number()
      .required()
      .error(() => {
        if (userLanguage === "english") {
          return {
            message: "operation canceled, illegal rate value.",
          };
        } else {
          return {
            message: "הפעולה לא בוצעה, ערך עמלה אינו תקין",
          };
        }
      }),
    sellTransferRate: Joi.number()
      .required()
      .error(() => {
        if (userLanguage === "english") {
          return {
            message: "operation canceled, illegal rate value.",
          };
        } else {
          return {
            message: "הפעולה לא בוצעה, ערך עמלה אינו תקין",
          };
        }
      }),
    isInTable: Joi.boolean(),
  };
  return Joi.validate(rate, schema);
}
module.exports.User = User;
module.exports.validate = validateUser;
module.exports.validateUpdate = validateUpdate;
module.exports.validateCurrency = validateCurrency;
