const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/authorize");
const { attachDesigner } = require("../middleware/attachDesigner");
const {
  placeOrder,
  getMyOrders,
  getDesignerOrders,
  getOrderDetail,
  advanceStatus,
  addTracking,
} = require("../controllers/orderController");

router.post("/", protect, authorize("buyer"), placeOrder);
router.get("/", protect, authorize("buyer"), getMyOrders);
router.get("/designer/orders", protect, authorize("seller"), attachDesigner, getDesignerOrders);
router.get("/designer/orders/:id", protect, authorize("seller"), attachDesigner, getOrderDetail);
router.get("/:id", protect, getOrderDetail);
router.patch("/:id/status", protect, authorize("seller"), advanceStatus);
router.patch("/:id/tracking", protect, authorize("seller"), addTracking);

module.exports = router;
