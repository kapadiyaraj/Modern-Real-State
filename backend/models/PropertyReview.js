


const mongoose = require("mongoose");

const propertyReviewSchema = new mongoose.Schema(
  {
    propertyId: {
      type: String,
      required: true,
      index: true,
    },

    propertyType: {
      type: String,
      enum: ["property", "luxury", "spacious", "penthouse"],
      required: true,
      default: "property",
    },

    propertyTitle: {
      type: String,
      default: "",
      trim: true,
    },

    // Logged-in customer
    userId: {
      type: String,
      required: true,
      index: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    reviewTitle: {
      type: String,
      default: "",
      trim: true,
      maxlength: 100,
    },

    reviewContent: {
      type: String,
      default: "",
      trim: true,
    },

    displayName: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    media: {
      type: [String],
      default: [],
      validate: {
        validator: function (value) {
          return value.length <= 3;
        },
        message: "Maximum 3 review images are allowed",
      },
    },

    // Only customers who actually purchased can create review
    verifiedPurchase: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// One customer can submit only one review
// for one property.
propertyReviewSchema.index(
  {
    propertyId: 1,
    propertyType: 1,
    userId: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "PropertyReview",
  propertyReviewSchema
);