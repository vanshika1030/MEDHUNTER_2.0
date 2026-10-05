const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  addMedicine,
  getMyMedicines,
  updateMedicine,
  deleteMedicine,
} = require("../controllers/medicineController");

router.use(protect, authorize("shopowner"));

router.post("/", addMedicine);
router.get("/my", getMyMedicines);
router.put("/:id", updateMedicine);
router.delete("/:id", deleteMedicine);

module.exports = router;
