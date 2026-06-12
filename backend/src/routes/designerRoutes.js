const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/authorize");
const { attachDesigner } = require("../middleware/attachDesigner");
const {
  listDesigners,
  getDesigner,
  getProfile,
  updateProfile,
  getDashboard,
  getAnalytics,
} = require("../controllers/designerController");

router.get("/", listDesigners);
router.get("/dashboard", protect, authorize("seller"), attachDesigner, getDashboard);
router.get("/analytics", protect, authorize("seller"), attachDesigner, getAnalytics);
router.get("/me", protect, authorize("seller"), attachDesigner, getProfile);
router.put("/profile", protect, authorize("seller"), attachDesigner, updateProfile);
router.get("/:slug", getDesigner);

module.exports = router;
