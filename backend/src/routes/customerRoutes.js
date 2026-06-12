const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/authorize");
const {
  getProfile,
  updateProfile,
  changePassword,
  getWishlist,
  toggleWishlist,
  removeFromWishlist,
  getAddresses,
  addAddress,
  updateAddress,
  removeAddress,
  setDefaultAddress,
  getMyReviews,
  getStats,
} = require("../controllers/customerController");

// All routes require buyer auth
router.use(protect);
router.use(authorize("buyer"));

// ── Profile & Password ──────────────────────────────────────────────────────
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.put("/password", changePassword);

// ── Stats ────────────────────────────────────────────────────────────────────
router.get("/stats", getStats);

// ── Wishlist ─────────────────────────────────────────────────────────────────
router.get("/wishlist", getWishlist);
router.post("/wishlist", toggleWishlist);
router.delete("/wishlist/:productId", removeFromWishlist);

// ── Addresses ────────────────────────────────────────────────────────────────
router.get("/addresses", getAddresses);
router.post("/addresses", addAddress);
router.put("/addresses/:id", updateAddress);
router.delete("/addresses/:id", removeAddress);
router.patch("/addresses/:id/default", setDefaultAddress);

// ── Reviews ──────────────────────────────────────────────────────────────────
router.get("/reviews", getMyReviews);

module.exports = router;
