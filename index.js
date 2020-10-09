const express = require("express");
const { mongo } = require("./config");
const mongoose = require("mongoose");
const app = express();
mongoose
  .connect(mongo.url)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) =>
    console.log("Error: Couldn't connect to MongoDB", err.message)
  );
app.use("/api", require("./routes/getFares"));

const PORT = process.env.PORT || 3000;

app.listen(3000, function () {
  console.log(`Listening at port ${PORT}`);
});
