const Medicine = require("../models/Medicine");
const Shop = require("../models/Shop");

exports.addMedicine = async (req, res) => {
  try {
    const { name, manufacturer, batchNumber, expiryDate, price, stock, description } =
      req.body;

    if (!name || price === undefined || stock === undefined) {
      return res
        .status(400)
        .json({ message: "Name, price, and stock are required" });
    }

    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found for this user" });
    }

    const medicine = await Medicine.create({
      shop: shop._id,
      name,
      manufacturer,
      batchNumber,
      expiryDate,
      price,
      stock,
      description,
    });

    res.status(201).json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyMedicines = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found for this user" });
    }

    const medicines = await Medicine.find({ shop: shop._id }).sort({
      name: 1,
    });

    res.json({ count: medicines.length, medicines });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found for this user" });
    }

    const medicine = await Medicine.findOne({ _id: id, shop: shop._id });
    if (!medicine) {
      return res
        .status(404)
        .json({ message: "Medicine not found in your shop" });
    }

    const allowedFields = [
      "name",
      "manufacturer",
      "batchNumber",
      "expiryDate",
      "price",
      "stock",
      "description",
    ];
    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        medicine[field] = updates[field];
      }
    });

    await medicine.save();

    res.json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;

    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found for this user" });
    }

    const medicine = await Medicine.findOneAndDelete({
      _id: id,
      shop: shop._id,
    });
    if (!medicine) {
      return res
        .status(404)
        .json({ message: "Medicine not found in your shop" });
    }

    res.json({ message: "Medicine deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
