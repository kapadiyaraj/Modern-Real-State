const express = require("express");
const router = express.Router();
const {
  getCompare,
  addToCompare,
  removeFromCompare,
  clearCompare,
} = require("../controllers/compareController");

router.get("/:userId", getCompare);
router.post("/", addToCompare);
router.delete("/:userId/:productId", removeFromCompare);
router.delete("/:userId", clearCompare);

module.exports = router;