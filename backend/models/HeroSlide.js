const mongoose = require("mongoose");

const heroSlideSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      default: "",
    },

    title: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    buttonText: {
      type: String,
      default: "Show full details",
    },

    buttonUrl: {
      type: String,
      default: "#details",
    },

    bgImage: {
      type: String,
      default: "",
    },

    bottomCard: {
      number: {
        type: String,
        default: "0",
      },

      title: {
        type: String,
        default: "",
      },

      description: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("HeroSlide", heroSlideSchema);