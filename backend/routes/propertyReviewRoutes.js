


const express = require("express");

const router =
  express.Router();

const {
  getReviews,
  getReviewSummary,
  createReview,
  deleteReview,
} = require("../controllers/propertyReviewController");

const reviewUpload =
  require("../middleware/reviewUpload");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// =====================================================
// GET REVIEWS
// Public
// =====================================================

router.get(
  "/:propertyType/:propertyId",
  getReviews
);

// =====================================================
// GET SUMMARY
// Public
// =====================================================

router.get(
  "/:propertyType/:propertyId/summary",
  getReviewSummary
);

// =====================================================
// CREATE REVIEW
// Login required
// Purchase verification happens
// inside controller.
// =====================================================

router.post(
  "/",
  protect,
  reviewUpload.array(
    "media",
    3
  ),
  createReview
);

// =====================================================
// DELETE REVIEW
// Admin only
// =====================================================

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteReview
);

module.exports = router;