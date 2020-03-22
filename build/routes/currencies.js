const express = require("express");
const { User } = require("../models/usersModel");
const router = express.Router();
const auth = require("../middlewares/authorization");
const { validateCurrency } = require("../models/usersModel");

router.post("/addRate", [auth], async (req, res) => {
  let user = await User.findById(req.session.ui);
  if (!user) {
    return res.status(400).send("user not exist");
  }

  const { error } = validateCurrency(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const checkExistance = await User.findById(
    {
      _id: req.session.ui
    },
    {
      currenciesRates: {
        $elemMatch: { currencyName: req.body.currencyName }
      }
    }
  );

  if (checkExistance.currenciesRates[0]) {
    return res.status(400).send("this currency allready have a rate");
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
  const { error } = validateCurrency(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  user = await User.updateOne(
    {
      _id: req.session.ui,
      "currenciesRates.currencyName": req.body.currencyName
    },
    {
      $set: {
        "currenciesRates.$.currencyName": req.body.currencyName,
        "currenciesRates.$.currencyValue": req.body.currencyValue,
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

module.exports = router;
