const asyncHandler = require("express-async-handler");
const Review = require("../models/Review");
const Order = require("../models/Order");
const { buildPaginated, paginate } = require("../middleware/pagination");

exports.getProductReviews = [
  paginate(20, 100),
  asyncHandler(async (req, res) => {
    const { data, pagination } = await buildPaginated(
      Review, { product: req.params.productId, status: "approved" }, req, {
        populate: "customer",
        sort: "-createdAt",
      }
    );
    res.json({ success: true, data, pagination });
  }),
];

exports.createReview = asyncHandler(async (req, res) => {
  const { rating, title, text } = req.body;
  if (!rating || rating < 1 || rating > 5) { res.status(400); throw new Error("Rating 1-5 is required"); }

  // Verify purchase
  const hasOrder = await Order.findOne({
    customer: req.user._id,
    items: { $elemMatch: { product: req.params.productId } },
    status: { $in: ["shipped", "delivered"] },
  });

  const review = await Review.create({
    product: req.params.productId,
    customer: req.user._id,
    designer: req.designer?._id || req.body.designer,
    rating, title, text,
    verifiedPurchase: !!hasOrder,
  });

  res.status(201).json({ success: true, data: review });
});

exports.getDesignerReviews = [
  paginate(20, 100),
  asyncHandler(async (req, res) => {
    const { data, pagination } = await buildPaginated(
      Review, { designer: req.designer._id }, req, {
        populate: "product customer",
        sort: "-createdAt",
      }
    );
    res.json({ success: true, data, pagination });
  }),
];
