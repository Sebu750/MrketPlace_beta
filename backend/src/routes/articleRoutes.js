const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/authorize");
const {
  listArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
} = require("../controllers/articleController");

// Public
router.get("/", listArticles);
router.get("/:slug", getArticle);

// Admin only
router.post("/", protect, authorize("admin"), createArticle);
router.put("/:id", protect, authorize("admin"), updateArticle);
router.delete("/:id", protect, authorize("admin"), deleteArticle);

module.exports = router;
