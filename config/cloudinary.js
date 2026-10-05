const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "medhunter_licenses",
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
    transformation: [{ width: 1000, crop: "limit" }],
  },
});

const upload = multer({ storage });

module.exports = { cloudinary, upload };
