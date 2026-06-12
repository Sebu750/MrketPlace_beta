const Designer = require("../models/Designer");

/**
 * If req.user is a seller, find their Designer profile and attach it as req.designer.
 * Place this AFTER protect() in routes that need designer context.
 */
exports.attachDesigner = async (req, res, next) => {
  if (req.user && req.user.role === "seller") {
    req.designer = await Designer.findOne({ userId: req.user._id });
    if (!req.designer) {
      // Auto-create Designer profile if missing
      req.designer = await Designer.create({
        userId: req.user._id,
        name: req.user.name,
        email: req.user.email,
        password: req.user.password, // will be re-hashed
        role: "seller",
      });
    }
  }
  next();
};
