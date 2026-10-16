
// const express = require("express");
// const router = express.Router();

// const {
//   getRevenueDashboard,
// } = require("../controllers/revenueController");

// const {
//   protect,
// } = require("../middleware/authMiddleware");

// router.get(
//   "/dashboard",
//   protect,
//   getRevenueDashboard
// );

// module.exports = router;




const express = require("express");
const router = express.Router();

const {
  getRevenueDashboard,
} = require("../controllers/revenueController");

const {
  protect,
} = require("../middleware/authMiddleware");

router.get("/dashboard", protect, getRevenueDashboard);

module.exports = router;

