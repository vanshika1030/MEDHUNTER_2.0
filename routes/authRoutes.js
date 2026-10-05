const express = require("express");
const router = express.Router();
const { upload } = require("../config/cloudinary");
const {
  registerUser,
  registerShop,
  loginUser,
  loginShop,
  loginAdmin,
} = require("../controllers/authController");

router.post("/register/user", registerUser);
router.post("/register/shop", upload.single("licensePhoto"), registerShop);

router.post("/login/user", loginUser);
router.post("/login/shop", loginShop);
router.post("/login/admin", loginAdmin);

module.exports = router;
