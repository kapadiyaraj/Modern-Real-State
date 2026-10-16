const Wishlist = require("../models/wishlistModel");

/*
=========================================
GET MY WISHLIST
GET /api/wishlist/:userId
=========================================
*/
const getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    // User can only access own wishlist
    if (String(req.user.userId) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const wishlist = await Wishlist.find({
      userId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: wishlist,
    });
  } catch (error) {
    console.error("GET WISHLIST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist",
    });
  }
};

/*
=========================================
ADD TO WISHLIST
POST /api/wishlist
=========================================
*/
// controllers/wishlistController.js
// const addToWishlist = async (req, res) => {
//   try {
//     const body = req.body;

//     // ===== NORMALIZE HERE, SERVER-SIDE =====
//     const resolvedImage =
//       body.mainImage ||
//       body.image ||
//       body.sliderImages?.[0] ||
//       body.subImages?.[0] ||
//       body.images?.[0] ||
//       "";

//     const resolvedGallery =
//       (Array.isArray(body.sliderImages) && body.sliderImages.length && body.sliderImages) ||
//       (Array.isArray(body.subImages) && body.subImages.length && body.subImages) ||
//       (Array.isArray(body.images) && body.images.length && body.images) ||
//       [];

//     const wishlistItem = await Wishlist.create({
//       userId: body.userId,
//       productId: String(body.productId),
//       wishlistType: body.wishlistType || "",
//       title: body.title,
//       category: body.category || "",

//       // CANONICAL FIELDS — always populated regardless of source model
//       image: resolvedImage,
//       gallery: resolvedGallery,

//       price: Number(body.price) || 0,
//       oldPrice: Number(body.oldPrice) || 0,
//       size: body.size || "",
//       sizes: Array.isArray(body.sizes) ? body.sizes : [],
//       description: body.description || "",
//     });

//     // ...
//   } catch (error) { /* ... */ }
// };


const addToWishlist = async (req, res) => {
  try {
    const body = req.body;

    // ===== NORMALIZE HERE, SERVER-SIDE =====
    const resolvedImage =
      body.mainImage ||
      body.image ||
      body.sliderImages?.[0] ||
      body.subImages?.[0] ||
      body.images?.[0] ||
      "";

    const resolvedGallery =
      (Array.isArray(body.sliderImages) && body.sliderImages.length && body.sliderImages) ||
      (Array.isArray(body.subImages) && body.subImages.length && body.subImages) ||
      (Array.isArray(body.images) && body.images.length && body.images) ||
      [];

    const wishlistItem = await Wishlist.create({
      userId: body.userId || req.user.userId,
      productId: String(body.productId),
      wishlistType: body.wishlistType || "",
      title: body.title,
      category: body.category || "",

      // CANONICAL FIELDS
      image: resolvedImage,
      gallery: resolvedGallery,

      price: Number(body.price) || 0,
      oldPrice: Number(body.oldPrice) || 0,
      size: body.size || "",
      sizes: Array.isArray(body.sizes) ? body.sizes : [],
      description: body.description || "",
    });

    // ✅ AA RESPONSE MOKLVANO BHULAY GAYO HATO - AYA ADD KARI DO:
    return res.status(201).json({
      success: true,
      message: "Added to wishlist successfully",
      data: wishlistItem,
    });

  } catch (error) {
    console.error("ADD WISHLIST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add wishlist",
    });
  }
};

/*
=========================================
REMOVE FROM WISHLIST
DELETE /api/wishlist/:userId/:productId
=========================================
*/
const removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    if (String(req.user.userId) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const deleted = await Wishlist.findOneAndDelete({
      userId,
      productId: String(productId),
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Wishlist item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Removed from wishlist",
      data: deleted,
    });
  } catch (error) {
    console.error(
      "REMOVE WISHLIST ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to remove wishlist item",
    });
  }
};

/*
=========================================
CLEAR WISHLIST
DELETE /api/wishlist/:userId
=========================================
*/
const clearWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    if (String(req.user.userId) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    await Wishlist.deleteMany({
      userId,
    });

    return res.status(200).json({
      success: true,
      message: "Wishlist cleared",
    });
  } catch (error) {
    console.error(
      "CLEAR WISHLIST ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to clear wishlist",
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
};