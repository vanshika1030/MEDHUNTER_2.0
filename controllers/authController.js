const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Shop = require("../models/Shop");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

exports.registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({ email, password, role: "user" });

    res.status(201).json({
      message: "User registered successfully. Please login.",
      _id: user._id,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.registerShop = async (req, res) => {
  try {
    const {
      shopName,
      ownerName,
      email,
      contactNumber,
      password,
      drugLicenseNumber,
      gstNumber,
      shopAddress,
      latitude,
      longitude,
    } = req.body;

    if (
      !shopName ||
      !ownerName ||
      !email ||
      !contactNumber ||
      !password ||
      !drugLicenseNumber ||
      !gstNumber ||
      !shopAddress ||
      !latitude ||
      !longitude
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "License photo is required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({ email, password, role: "shopowner" });

    const shop = await Shop.create({
      owner: user._id,
      shopName,
      ownerName,
      email,
      contactNumber,
      drugLicenseNumber,
      gstNumber,
      licensePhotoUrl: req.file.path,
      shopAddress,
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
    });

    res.status(201).json({
      message: "Shop registered successfully. Please login.",
      _id: user._id,
      email: user.email,
      role: user.role,
      shop: shop._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: "user" });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginShop = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: "shopowner" });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const shop = await Shop.findOne({ owner: user._id });

    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
      shopId: shop ? shop._id : null,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: "admin" });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





