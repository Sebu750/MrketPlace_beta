const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/authorize");
const { attachDesigner } = require("../middleware/attachDesigner");
const { getProductReviews, createReview, getDesignerReviews } = require("../controllers/reviewController");

router.get("/products/:productId/reviews", getProductReviews);
router.post("/products/:productId/reviews", protect, authorize("buyer"), createReview);
router.get("/designer/reviews", protect, authorize("seller"), attachDesigner, getDesignerReviews);

module.exports = router;
