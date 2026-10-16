



const express = require("express");

const router = express.Router();

const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

// ===============================
// GET CART
// ===============================
// Logged-in user only
router.get("/:userId", protect, getCart);

// ===============================
// ADD PRODUCT
// ===============================
// Logged-in user only
router.post("/", protect, addToCart);

// ===============================
// UPDATE QUANTITY
// ===============================
// Logged-in user only
router.put(
  "/:userId/:productId",
  protect,
  updateCartItem
);

// ===============================
// REMOVE PRODUCT
// ===============================
// Logged-in user only
router.delete(
  "/:userId/:productId",
  protect,
  removeCartItem
);

// ===============================
// CLEAR CART
// ===============================
// Logged-in user only
router.delete(
  "/:userId",
  protect,
  clearCart
);

module.exports = router;