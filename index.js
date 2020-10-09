const express = require("express");
const axios = require("axios");
const { google, mongo } = require("./config");
const app = express();
const checkUnits = (units) => {
  if (units && units == "imperial") {
    return "units=imperial&";
  } else {
    return "";
  }
};
const getFares = (distance, duration) => {
  distance = distance.split(" ");
  distance[0] = parseFloat(distance[0]);
  if (distance[1] == "mi") {
    distance[0] = 1.60934 * distance[0]; // converting miles to kms
    //now distance[0] is numerical distance in kms
  }

  return {
    fare: {
      Pool: {
        distance: "$" + (distance[0] * 1).toFixed(2),
        duration: "$" + (duration.split(" ")[0] * 1).toFixed(2),
      },
      Premier: {
        distance: "$" + (distance[0] * 1.5).toFixed(2),
        duration: "$" + (duration.split(" ")[0] * 1).toFixed(2),
      },
      XL: {
        distance: "$" + (distance[0] * 2).toFixed(2),
        duration: "$" + (duration.split(" ")[0] * 1.3).toFixed(2),
      },
    },
  };
};
app.get("/", (req, res) => {
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
      console.log(response.data.rows);
      let data = response.data.rows[0].elements[0];
      responseObj = getFares(data.distance.text, data.duration.text);
      responseObj["duration"] = data.duration.text;
      responseObj.distance = data.distance.text;
      responseObj.destination_address = response.data.destination_addresses[0];
      res.status(200).send(responseObj);
    })
    .catch((err) => console.log(err));
  //origin=23.1944,77.0759&destination=23.2032,77.0844
});

const PORT = process.env.PORT || 3000;
//URL ENCODING-->  7C for | (Pipe) and 2C for , (Comma)
app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
