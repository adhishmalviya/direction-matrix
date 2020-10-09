const mongoose = require("mongoose");
const requestSchema = new mongoose.Schema({});
const RequestFare = mongoose.model("RequestFare", requestSchema);

exports.RequestFare = RequestFare;
