const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/authorize");
const { attachDesigner } = require("../middleware/attachDesigner");
const {
  listProducts,
  getProduct,
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleStatus,
} = require("../controllers/productController");

// Public
router.get("/", listProducts);

// Designer only (must be before /:slug)
router.get("/designer/products", protect, authorize("seller"), attachDesigner, getMyProducts);
router.post("/", protect, authorize("seller"), attachDesigner, createProduct);

// Parameterized routes (must be last)
router.get("/:slug", getProduct);
router.put("/:id", protect, authorize("seller"), updateProduct);
router.delete("/:id", protect, authorize("seller"), deleteProduct);
router.patch("/:id/status", protect, authorize("seller"), toggleStatus);

module.exports = router;
