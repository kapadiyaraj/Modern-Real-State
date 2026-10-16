const mongoose = require("mongoose");

const beachfrontCardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false }
);

const beachfrontSchema = new mongoose.Schema(
  {
    titleTop: {
      type: String,
      default: "",
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    cards: {
      type: [beachfrontCardSchema],
      default: [],
    },

    featureImage: {
      type: String,
      default: "",
      trim: true,
    },

    featureDescription: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Beachfront", beachfrontSchema);