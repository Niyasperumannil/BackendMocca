const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads/women directory exists
const uploadDir = path.join(__dirname, "..", "uploads", "women");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // use absolute path
  },
  filename: (req, file, cb) => {
    const uniqueName = "women-" + Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }

  cb(new Error("Only image files (jpeg, jpg, png, webp) are allowed!"));
};

const uploadWomen = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});

module.exports = uploadWomen;
