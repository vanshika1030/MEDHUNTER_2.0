const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Medicine name is required"],
      trim: true,
    },
    nameNormalized: {
      type: String,
      index: true,
    },
    manufacturer: {
      type: String,
      trim: true,
      default: "",
    },
    batchNumber: {
      type: String,
      trim: true,
      default: "",
    },
    expiryDate: {
      type: Date,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    stock: {
      type: Number,
      required: [true, "Stock count is required"],
      min: 0,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

medicineSchema.index({ nameNormalized: 1, shop: 1 });
medicineSchema.index({ name: "text", manufacturer: "text" });

medicineSchema.pre("save", function () {
  this.nameNormalized = this.name.toLowerCase().trim();
});

module.exports = mongoose.model("Medicine", medicineSchema);
