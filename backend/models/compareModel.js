const mongoose = require("mongoose");

const compareSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: "Real Estate",
    },
    image: {
      type: String,
      default: "",
    },
    price: {
      type: String,
      default: "",
    },
    oldPrice: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "",
    },
    sizes: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Compare", compareSchema);