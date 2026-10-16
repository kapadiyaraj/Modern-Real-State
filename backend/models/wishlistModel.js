const mongoose = require('mongoose');
const wishlistSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: String, required: true },
    wishlistType: { type: String, default: "" }, // "luxury" | "penthouse" | "property"
    title: { type: String, required: true },
    category: { type: String, default: "" },

    // CANONICAL — every wishlist item has exactly these, regardless of source
    image: { type: String, default: "" },
    gallery: { type: [String], default: [] },

    price: { type: Number, default: 0 },
    oldPrice: { type: Number, default: 0 },
    size: { type: String, default: "" },
    sizes: { type: [String], default: [] },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wishlist", wishlistSchema);