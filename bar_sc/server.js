require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Medicine = require("./models/medicine");
const Inventory = require("./models/inventory");

const app = express();

app.use(cors());
app.use(express.json());


app.post("/add-medicine", async (req, res) => {
  try {
    const { name, barcode, type, quantity, price, shopId } = req.body;

    console.log("BODY:", req.body);

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Medicine name is required" });
    }

    if (!shopId) {
      return res.status(400).json({ error: "Shop ID is required" });
    }

    if (!quantity || Number(quantity) <= 0) {
      return res.status(400).json({ error: "Quantity must be greater than 0" });
    }

    // Check if medicine exists by barcode
    let medicine;
    
    if (barcode && barcode.trim()) {
      medicine = await Medicine.findOne({ barcode: barcode.trim() });
    }

    // If medicine doesn't exist, create it
    if (!medicine) {
      medicine = new Medicine({
        name: name.trim(),
        barcode: barcode ? barcode.trim() : "",
        type: type ? type.trim() : ""
      });
      await medicine.save();
      console.log("Created new medicine:", medicine);
    } else {
      // If medicine exists with same barcode, update the name/type
      if (medicine.name !== name.trim()) {
        medicine.name = name.trim();
      }
      if (type && type.trim() && medicine.type !== type.trim()) {
        medicine.type = type.trim();
      }
      await medicine.save();
      console.log("Updated existing medicine:", medicine);
    }

    // Add to inventory
    const inventory = new Inventory({
      shopId,
      medicineId: medicine._id,
      quantity: Number(quantity),
      price: Number(price) || 0
    });

    await inventory.save();
    console.log("Added to inventory:", inventory);

    res.json({ message: "Medicine added successfully", medicine });

  } catch (err) {
    console.log("ADD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/scan-barcode", async (req, res) => {
  const { barcode } = req.body;

  try {
    let medicine = await Medicine.findOne({ barcode });

    // ❌ NOT FOUND
    if (!medicine) {
      return res.json({
        found: false,
        barcode
      });
    }

    
    let existing = await Inventory.findOne({
      shopId: "SHOP001",
      medicineId: medicine._id
    });

    if (existing) {
      existing.quantity += 1;
      await existing.save();
    } else {
      const inventory = new Inventory({
        shopId: "SHOP001",
        medicineId: medicine._id,
        quantity: 1,
        price: 0
      });

      await inventory.save();
    }

    res.json({
      found: true,
      medicine
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Scan failed" });
  }
});

app.get("/inventory/:shopId", async (req, res) => {
  try {
    const data = await Inventory.find({
      shopId: req.params.shopId
    }).populate("medicineId");

    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Fetch error" });
  }
});


/* -----to delete medicine--- */
app.delete("/delete-inventory/:id", async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});


/* ------ connecting to database ---- */
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(5000, () => {
      console.log("Server running on 5000");
    });
  })
  .catch(err => console.log(err));