// const express = require("express");

// const router = express.Router();

// const {
//   getFAQs,
//   getFAQById,
//   createFAQ,
//   updateFAQ,
//   deleteFAQ,
// } = require("../controllers/faqController");

// router.get("/", getFAQs);

// router.get("/:id", getFAQById);

// router.post("/", createFAQ);

// router.put("/:id", updateFAQ);

// router.delete("/:id", deleteFAQ);

// module.exports = router;



const express = require("express");

const router = express.Router();

const {
  getFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
} = require("../controllers/faqController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// ===============================
// GET ALL FAQs
// ===============================
// Public
router.get("/", getFAQs);

// ===============================
// GET FAQ BY ID
// ===============================
// Public
router.get("/:id", getFAQById);

// ===============================
// CREATE FAQ
// ===============================
// Admin only
router.post(
  "/",
  protect,
  authorize("admin"),
  createFAQ
);

// ===============================
// UPDATE FAQ
// ===============================
// Admin only
router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateFAQ
);

// ===============================
// DELETE FAQ
// ===============================
// Admin only
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteFAQ
);

module.exports = router;