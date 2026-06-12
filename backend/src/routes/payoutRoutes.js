const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/authorize");
const { attachDesigner } = require("../middleware/attachDesigner");
const { getPayouts, getSummary, updateBankDetails } = require("../controllers/payoutController");

router.get("/designer/payouts", protect, authorize("seller"), attachDesigner, getPayouts);
router.get("/designer/payouts/summary", protect, authorize("seller"), attachDesigner, getSummary);
router.put("/designer/bank", protect, authorize("seller"), attachDesigner, updateBankDetails);

module.exports = router;
