const Shop = require("../models/Shop");
const User = require("../models/User");

exports.getAllShops = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && ["pending", "approved", "rejected"].includes(status)) {
      filter.status = status;
    }

    const shops = await Shop.find(filter)
      .populate("owner", "email")
      .sort({ createdAt: -1 });

    res.json({ count: shops.length, shops });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).populate("owner", "email");
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.json(shop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.approveShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    shop.status = "approved";
    await shop.save();

    res.json({ message: "Shop approved successfully", shop });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.rejectShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    shop.status = "rejected";
    await shop.save();

    res.json({ message: "Shop rejected successfully", shop });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
