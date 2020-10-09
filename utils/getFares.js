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

module.exports.getFares = getFares;
module.exports.checkUnits = checkUnits;
