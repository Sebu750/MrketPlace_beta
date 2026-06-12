const router = require("express").Router();
const { protect } = require("../middleware/auth");
const { adminOnly } = require("../middleware/authorize");
const ctrl = require("../controllers/adminController");

// All routes require authentication + admin role
router.use(protect);
router.use(adminOnly);

/* ── Platform Stats ──────────────────────────────────── */
router.get("/stats", ctrl.getPlatformStats);
router.get("/analytics", ctrl.getPlatformAnalytics);

/* ── Users ───────────────────────────────────────────── */
router.get("/users", ctrl.getUsers);
router.put("/users/:id", ctrl.updateUserRole);
router.delete("/users/:id", ctrl.deleteUser);

/* ── Designers ───────────────────────────────────────── */
router.get("/designers", ctrl.getAllDesigners);
router.put("/designers/:id", ctrl.updateDesigner);
router.delete("/designers/:id", ctrl.deleteDesigner);

/* ── Orders ──────────────────────────────────────────── */
router.get("/orders", ctrl.getAllOrders);
router.put("/orders/:id/status", ctrl.adminUpdateOrderStatus);

/* ── Collections ─────────────────────────────────────── */
router.get("/collections", ctrl.getAllCollections);
router.put("/collections/:id", ctrl.adminUpdateCollection);

/* ── Products ────────────────────────────────────────── */
router.get("/products", ctrl.getAllProducts);
router.put("/products/:id", ctrl.adminToggleProduct);

/* ── Payouts ─────────────────────────────────────────── */
router.get("/payouts", ctrl.getAllPayouts);
router.put("/payouts/:id", ctrl.processPayout);

/* ── Reviews ─────────────────────────────────────────── */
router.get("/reviews", ctrl.getAllReviews);
router.delete("/reviews/:id", ctrl.deleteReview);

module.exports = router;
