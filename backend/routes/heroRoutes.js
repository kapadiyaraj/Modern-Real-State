// const express = require("express");

// const {
//   getHeroSlides,
//   getHeroSlide,
//   createHeroSlide,
//   updateHeroSlide,
//   deleteHeroSlide,
// } = require("../controllers/heroController");

// const upload = require("../middleware/upload");

// const router = express.Router();

// router.get("/", getHeroSlides);

// router.get("/:id", getHeroSlide);

// router.post(
//   "/",
//   upload.single("bgImage"),
//   createHeroSlide
// );

// router.put(
//   "/:id",
//   upload.single("bgImage"),
//   updateHeroSlide
// );

// router.delete("/:id", deleteHeroSlide);

// module.exports = router;



const express = require("express");

const {
  getHeroSlides,
  getHeroSlide,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
} = require("../controllers/heroController");

const upload = require("../middleware/upload");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ===============================
// GET ALL HERO SLIDES
// ===============================
// Public
router.get("/", getHeroSlides);

// ===============================
// GET SINGLE HERO SLIDE
// ===============================
// Public
router.get("/:id", getHeroSlide);

// ===============================
// CREATE HERO SLIDE
// ===============================
// Admin only
router.post(
  "/",
  protect,
  authorize("admin"),
  upload.single("bgImage"),
  createHeroSlide
);

// ===============================
// UPDATE HERO SLIDE
// ===============================
// Admin only
router.put(
  "/:id",
  protect,
  authorize("admin"),
  upload.single("bgImage"),
  updateHeroSlide
);

// ===============================
// DELETE HERO SLIDE
// ===============================
// Admin only
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteHeroSlide
);

module.exports = router;