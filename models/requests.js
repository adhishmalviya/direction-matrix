const mongoose = require("mongoose");
const requestSchema = new mongoose.Schema({}, { strict: false });
const RequestFare = mongoose.model("RequestFare", requestSchema);

exports.RequestFare = RequestFare;
