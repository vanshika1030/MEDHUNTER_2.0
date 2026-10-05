const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  getAllShops,
  getShopById,
  approveShop,
  rejectShop,
} = require("../controllers/adminController");

router.use(protect, authorize("admin"));

router.get("/shops", getAllShops);
router.get("/shops/:id", getShopById);
router.put("/shops/:id/approve", approveShop);
router.put("/shops/:id/reject", rejectShop);

module.exports = router;
