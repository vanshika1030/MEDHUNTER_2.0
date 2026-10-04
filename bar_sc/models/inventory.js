const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  shopId: String,
  medicineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine"
  },
  quantity: Number,
  price: Number,
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Inventory", inventorySchema);