// const express = require("express");

// const router = express.Router();

// const {
//   getIdealSpace,
//   updateIdealSpace,
//   resetIdealSpace,
// } = require("../controllers/idealSpacecontroller");

// // GET
// router.get("/", getIdealSpace);

// // UPDATE
// router.put("/", updateIdealSpace);

// // RESET
// router.delete("/", resetIdealSpace);

// module.exports = router;



const express = require("express");

const router = express.Router();

const {
  getIdealSpace,
  updateIdealSpace,
  resetIdealSpace,
} = require("../controllers/idealSpacecontroller");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// ===============================
// GET IDEAL SPACE
// ===============================
// Public
router.get("/", getIdealSpace);

// ===============================
// UPDATE IDEAL SPACE
// ===============================
// Admin only
router.put(
  "/",
  protect,
  authorize("admin"),
  updateIdealSpace
);

// ===============================
// RESET IDEAL SPACE
// ===============================
// Admin only
router.delete(
  "/",
  protect,
  authorize("admin"),
  resetIdealSpace
);

module.exports = router;