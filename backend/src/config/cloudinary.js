const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ── Detect whether real Cloudinary credentials are configured ──────────
const useCloudinary =
  process.env.CLOUD_NAME &&
  process.env.CLOUD_NAME !== "your_cloud_name" &&
  process.env.CLOUD_API_KEY &&
  process.env.CLOUD_API_KEY !== "your_api_key";

if (useCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });
  console.log("Cloudinary: using cloud storage");
} else {
  console.log("Cloudinary: using local disk storage (dev fallback)");
}

// ── Storage factory — Cloudinary in production, local disk in dev ─────
const createStorage = (folder) => {
  if (useCloudinary) {
    return new CloudinaryStorage({
      cloudinary,
      params: async () => ({
        folder: `adorzia/${folder}`,
        resource_type: "auto",
        format: "webp",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      }),
    });
  }

  // Local disk fallback — stores in backend/uploads/<folder>/
  const dest = path.join(__dirname, "..", "..", "uploads", folder);
  fs.mkdirSync(dest, { recursive: true });

  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dest),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
      cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
    },
  });
};

// ── Pre-configured uploaders per domain ────────────────────────────────
const uploaders = {
  products: multer({ storage: createStorage("products") }),
  collections: multer({ storage: createStorage("collections") }),
  designers: multer({ storage: createStorage("designers") }),
  general: multer({ storage: createStorage("general") }),
};

/**
 * Middleware factory — pick domain then upload
 * Usage:  upload("products").single("image")
 *         upload("collections").array("lookbook", 6)
 */
const upload = (domain = "general") => uploaders[domain] || uploaders.general;

module.exports = { cloudinary, upload, useCloudinary };
