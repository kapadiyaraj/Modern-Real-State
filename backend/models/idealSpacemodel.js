const mongoose = require("mongoose");

const idealSpaceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Find your ideal space",
    },

    description: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    newsletterTitle: {
      type: String,
      default: "",
    },

    newsletterDescription: {
      type: String,
      default: "",
    },

    emailPlaceholder: {
      type: String,
      default: "Enter email address...",
    },

    buttonText: {
      type: String,
      default: "Subscription",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("IdealSpace", idealSpaceSchema);