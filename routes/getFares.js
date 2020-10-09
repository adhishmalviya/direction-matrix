const router = require("express").Router();
const { getFares, checkUnits } = require("../utils/getFares");
const axios = require("axios");
const { google } = require("../config");
const { RequestFare } = require("../models/requests");
//URL ENCODING-->  7C for | (Pipe) and 2C for , (Comma)

router.get("/getFares", (req, res) => {
  if (!req.query.origin || !req.query.destination) {
    res.status(400).send("Origin and Destination both are required");
    return;
  }
  origin = req.query.origin.split(",");
  destination = req.query.destination.split(",");
  if (
    origin.length != 2 ||
    destination.length != 2 ||
    parseFloat(origin[0]) == NaN ||
    parseFloat(origin[1]) == NaN ||
    parseFloat(destination[0]) == NaN ||
    parseFloat(destination[1]) == NaN
  ) {
    res.status(400).send("Please specify valid origin and destination");
    return;
  }
  axios
    .get(
      `https://maps.googleapis.com/maps/api/distancematrix/json?${checkUnits(
        req.query.units
      )}origins=${req.query.origin}&destinations=${req.query.destination}&key=${
        google.apiKey
      }`
    )
    .then((response) => {
      let data = response.data.rows[0].elements[0];
      responseObj = getFares(data.distance.text, data.duration.text);
      responseObj.duration = data.duration.text;
      responseObj.distance = data.distance.text;
      responseObj.destination_address = response.data.destination_addresses[0];
      let newRequest = RequestFare(responseObj);
      newRequest
        .save()
        .then(() => {
          res.status(200).send(responseObj);
        })
        .catch(() => {
          res.send("Error while saving response in database");
          process.exit();
        });
    })
    .catch((err) => console.log(err));
  //origin=23.1944,77.0759&destination=23.2032,77.0844
});

module.exports = router;
