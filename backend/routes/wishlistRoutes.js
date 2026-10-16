const express = require("express");

const router = express.Router();

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = require("../controllers/wishlistController");

const {
  protect,
} = require("../middleware/authMiddleware");

/*
GET wishlist
*/
router.get(
  "/:userId",
  protect,
  getWishlist
);

/*
ADD wishlist
*/
router.post(
  "/",
  protect,
  addToWishlist
);

/*
REMOVE wishlist item
*/
router.delete(
  "/:userId/:productId",
  protect,
  removeFromWishlist
);

/*
CLEAR wishlist
*/
router.delete(
  "/:userId",
  protect,
  clearWishlist
);

module.exports = router;