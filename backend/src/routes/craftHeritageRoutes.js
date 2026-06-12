const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/authorize");
const {
  listCrafts,
  getCraft,
  createCraft,
  updateCraft,
  deleteCraft,
} = require("../controllers/craftHeritageController");

// Public
router.get("/", listCrafts);
router.get("/:slug", getCraft);

// Admin only
router.post("/", protect, authorize("admin"), createCraft);
router.put("/:id", protect, authorize("admin"), updateCraft);
router.delete("/:id", protect, authorize("admin"), deleteCraft);

module.exports = router;
