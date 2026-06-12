const express = require("express");
const router = express.Router();
const path = require("path");
const { protect } = require("../middleware/auth");
const { upload, useCloudinary } = require("../config/cloudinary");

// Convert file path to URL — local disk returns /uploads/..., Cloudinary returns CDN URL
const fileUrl = (file) => {
  if (useCloudinary) return file.path;
  // Local disk: convert absolute path to relative URL
  const rel = path.relative(path.join(__dirname, "..", "..", "uploads"), file.path).replace(/\\/g, "/");
  return `/uploads/${rel}`;
};

// Single image upload
router.post("/image", protect, upload("general").single("image"), (req, res) => {
  if (!req.file) { res.status(400); throw new Error("No file uploaded"); }
  res.json({ success: true, data: { url: fileUrl(req.file), publicId: req.file.filename } });
});

// Multiple image upload (gallery)
router.post("/gallery", protect, upload("general").array("images", 10), (req, res) => {
  if (!req.files || req.files.length === 0) { res.status(400); throw new Error("No files uploaded"); }
  res.json({
    success: true,
    data: req.files.map((f) => ({ url: fileUrl(f), publicId: f.filename })),
  });
});

// Product-specific upload
router.post("/product", protect, upload("products").single("image"), (req, res) => {
  if (!req.file) { res.status(400); throw new Error("No file uploaded"); }
  res.json({ success: true, data: { url: fileUrl(req.file) } });
});

// Collection-specific upload
router.post("/collection", protect, upload("collections").array("lookbook", 6), (req, res) => {
  if (!req.files) { res.status(400); throw new Error("No files uploaded"); }
  res.json({ success: true, data: req.files.map((f) => ({ url: fileUrl(f) })) });
});

module.exports = router;
