const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/authorize");
const { attachDesigner } = require("../middleware/attachDesigner");
const {
  listCollections,
  getCollection,
  getMyCollections,
  createCollection,
  updateCollection,
  updateStatus,
  deleteCollection,
} = require("../controllers/collectionController");

router.get("/", listCollections);
router.get("/designer/collections", protect, authorize("seller"), attachDesigner, getMyCollections);
router.get("/:slug", getCollection);
router.post("/", protect, authorize("seller"), attachDesigner, createCollection);
router.put("/:id", protect, authorize("seller"), updateCollection);
router.patch("/:id/status", protect, authorize("seller"), updateStatus);
router.delete("/:id", protect, authorize("seller"), deleteCollection);

module.exports = router;
