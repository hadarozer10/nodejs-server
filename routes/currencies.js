const express = require("express");
const { User } = require("../models/usersModel");
const router = express.Router();
const auth = require("../middlewares/authorization");
const { validateCurrency } = require("../models/usersModel");
const fs = require("fs");

router.post("/addRate", [auth], async (req, res) => {
  let user = await User.findById(req.session.ui);
  if (!user) {
    return res.status(400).send("user not exist");
  }

  const { error } = validateCurrency(req.body, user.userLanguage);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const checkExistance = await User.findById(
    {
      _id: req.session.ui,
    },
    {
      currenciesRates: {
        $elemMatch: { currencyName: req.body.currencyName },
      },
    }
  );

  if (checkExistance.currenciesRates[0]) {
    if (user.userLanguage === "english") {
      return res.status(400).send("this currency allready have a rate");
    } else {
      return res
        .status(400)
        .send("למטבע זה קיימים כבר מאפייני עמלה, אנא עדכן במידת הצורך");
    }
  }

  await User.findByIdAndUpdate(
    { _id: req.session.ui },
    {
      $push: {
        currenciesRates: {
          currencyName: req.body.currencyName,
          currencyValue: req.body.currencyValue,
          buyCashRate: req.body.buyCashRate,
          sellCashRate: req.body.sellCashRate,
          buyTransferRate: req.body.buyTransferRate,
          sellTransferRate: req.body.sellTransferRate,
          isInTable: false,
        },
      },
    }
  );

  if (user.userLanguage === "english") {
    return res.send({ message: "rates for the currency added successfully" });
  } else {
    return res.send({ message: "ערכי עמלת המטבע הוספו בהצלחה" });
  }
});

//delete a rate from Rates array
router.post("/deleteRate", [auth], async (req, res) => {
  const user = await User.findByIdAndUpdate(
    { _id: req.session.ui },
    {
      $pull: {
        currenciesRates: {
          currencyName: req.body.rateName,
        },
      },
    }
  );

  if (!user) return res.status(404).send("the user not exist");

  if (user.userLanguage === "english") {
    return res.send({ message: "rates for the currency deleted successfully" });
  } else {
    return res.send({ message: "ערכי עמלת המטבע נמחקו בהצלחה" });
  }
});

//update a rate from Rates array
router.post("/updateRate", [auth], async (req, res) => {
  let user = await User.findById(req.session.ui);
  if (!user) {
    return res.status(400).send("user not exist");
  }
  const { error } = validateCurrency(req.body, user.userLanguage);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  await User.updateOne(
    {
      _id: req.session.ui,
      "currenciesRates.currencyName": req.body.currencyName,
    },
    {
      $set: {
        "currenciesRates.$.currencyName": req.body.currencyName,
        "currenciesRates.$.currencyValue": req.body.currencyValue,
        "currenciesRates.$.buyCashRate": req.body.buyCashRate,
        "currenciesRates.$.sellCashRate": req.body.sellCashRate,
        "currenciesRates.$.buyTransferRate": req.body.buyTransferRate,
        "currenciesRates.$.sellTransferRate": req.body.sellTransferRate,
        "currenciesRates.$.isInTable": req.body.isInTable,
      },
    }
  );

  if (user.userLanguage === "english") {
    return res.send({
      message: "updated successfully",
    });
  } else {
    return res.send({ message: "עודכן בהצלחה" });
  }
});

router.get("/getCurrencies", [auth], async (req, res) => {
  let currencies = await JSON.parse(fs.readFileSync("./currencies.json"));
  let israeliCurrency = currencies["ils-israeli-shekel"];
  Object.keys(currencies).map((currency) => {
    currencies[currency] = israeliCurrency / currencies[currency];
  });

  res.send(currencies);
});

module.exports = router;
