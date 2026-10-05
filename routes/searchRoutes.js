const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const { searchMedicine } = require("../controllers/searchController");

router.get("/", protect, authorize("user", "admin"), searchMedicine);

module.exports = router;
