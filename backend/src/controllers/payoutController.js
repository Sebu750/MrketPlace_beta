const asyncHandler = require("express-async-handler");
const Payout = require("../models/Payout");
const Order = require("../models/Order");
const { buildPaginated, paginate } = require("../middleware/pagination");

exports.getPayouts = [
  paginate(20, 100),
  asyncHandler(async (req, res) => {
    const { data, pagination } = await buildPaginated(
      Payout, { designer: req.designer._id }, req, { sort: "-createdAt" }
    );
    res.json({ success: true, data, pagination });
  }),
];

exports.getSummary = asyncHandler(async (req, res) => {
  const designerId = req.designer._id;

  const [totalEarnings, pendingPayout, lastPayout] = await Promise.all([
    Order.aggregate([
      { $match: { designer: designerId, status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$financial.netPayout" } } },
    ]),
    Payout.findOne({ designer: designerId, status: "pending" }).sort("-createdAt"),
    Payout.findOne({ designer: designerId, status: "processed" }).sort("-processedAt"),
  ]);

  res.json({
    success: true,
    data: {
      totalEarnings: totalEarnings[0]?.total || 0,
      pendingPayout: pendingPayout ? pendingPayout.amount : 0,
      lastPayout: lastPayout
        ? { amount: lastPayout.amount, date: lastPayout.processedAt, reference: lastPayout.reference }
        : null,
    },
  });
});

exports.updateBankDetails = asyncHandler(async (req, res) => {
  const { holder, accountNumber, accountMasked, bank, branch } = req.body;
  req.designer.bankDetails = { holder, accountMasked, bank, branch };
  if (accountNumber) req.designer.bankDetails.accountNumber = accountNumber;
  res.json({ success: true, data: await req.designer.save() });
});
