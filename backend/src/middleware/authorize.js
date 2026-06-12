const asyncHandler = require("express-async-handler");

/**
 * Check that req.user.role is one of the allowed roles.
 * Usage:  router.get('/admin-only', authorize('admin'), handler)
 *         router.get('/designer-or-admin', authorize('seller', 'admin'), handler)
 */
exports.authorize = (...roles) =>
  asyncHandler((req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error("Not authenticated");
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`Role "${req.user.role}" is not authorized to access this resource`);
    }

    next();
  });

// Shorthand
exports.designerOnly = exports.authorize("seller");
exports.adminOnly = exports.authorize("admin");
exports.sellerOrAdmin = exports.authorize("seller", "admin");

/**
 * Verify that the authenticated user owns the resource
 * , looks for {designer, customer, user} fields on req.resource
 *   (set by a prior findById in the route handler)
 */
exports.ownerOrAdmin = asyncHandler((req, res, next) => {
  const resource = req.resource;
  if (!resource) {
    res.status(500);
    throw new Error("Resource not loaded for ownership check");
  }

  const isOwner =
    resource.designer?.toString() === req.user._id.toString() ||
    resource.customer?.toString() === req.user._id.toString() ||
    resource.userId?.toString() === req.user._id.toString();

  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error("You do not have permission to modify this resource");
  }

  next();
});
