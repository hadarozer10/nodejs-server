const express = require("express");
const { User } = require("../models/usersModel");
const router = express.Router();
const auth = require("../middlewares/authorization");
const fs = require("fs");

//get all Rates array
router.get("/getRates", [auth], async (req, res) => {
  const user = await User.findById(req.session.ui);

  if (!user)
    return res.status(404).send("the user with the given id not exist");

  res.send(user.currenciesRates);
});

// add rate to Rates array
router.post("/addRate", [auth], async (req, res) => {
  let user = await User.findById(req.session.ui);
  if (!user) {
    return res.status(400).send("user not exist");
  }

  for (item in user.currenciesRates) {
    if (item.currencyName === req.body.currencyName)
      return res.status(400).send("the current currency allready have a rate");
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
          isInTable: false
        }
      }
    }
  );

  res.send();
});

//delete a rate from Rates array
router.post("/deleteRate", [auth], async (req, res) => {
  const user = await User.findByIdAndUpdate(
    { _id: req.session.ui },
    {
      $pull: {
        currenciesRates: {
          currencyName: req.body.rateName
        }
      }
    }
  );

  if (!user)
    return res.status(404).send("the user with the given id not exist");

  res.send();
});

//update a rate from Rates array
router.post("/updateRate", [auth], async (req, res) => {
  user = await User.updateOne(
    {
      _id: req.session.ui,
      "currenciesRates.currencyName": req.body.currencyName
    },
    {
      $set: {
        "currenciesRates.$.currencyName": req.body.currencyName,
        "currenciesRates.$.buyCashRate": req.body.buyCashRate,
        "currenciesRates.$.sellCashRate": req.body.sellCashRate,
        "currenciesRates.$.buyTransferRate": req.body.buyTransferRate,
        "currenciesRates.$.sellTransferRate": req.body.sellTransferRate,
        "currenciesRates.$.isInTable": req.body.isInTable
      }
    }
  );

  if (!user)
    return res.status(404).send("the user with the given id not exist");

  res.send();
});

router.get("/updateCurrencies", [auth], async (req, res) => {
  let currencies = JSON.parse(fs.readFileSync("./currencies.json"));
  const user = await User.findById(req.session.ui);

  if (!user || !currencies)
    return res.status(404).send("server failure, cant get currencies");

  let israeliCurrency = currencies["ils-israeli-shekel"];

  Object.keys(currencies).map(
    currency => (currencies[currency] = israeliCurrency / currencies[currency])
  );

  user.currenciesRates.forEach(rate => {
    rate.currencyValue = currencies[rate.currencyName];
  });

  updatedUser = await User.findByIdAndUpdate(req.session.ui, {
    currenciesRates: user.currenciesRates
  });

  res.send(currencies);
});

router.get("/getCurrencies", [auth], async (req, res) => {
  let currencies = JSON.parse(fs.readFileSync("./currencies.json"));
  let israeliCurrency = currencies["ils-israeli-shekel"];

  Object.keys(currencies).map(
    currency => (currencies[currency] = israeliCurrency / currencies[currency])
  );
  res.send(currencies);
});

module.exports = router;
