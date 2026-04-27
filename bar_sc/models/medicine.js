const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  name: String,
  barcode: String,
  type: String
});

module.exports = mongoose.model("Medicine", medicineSchema);