



const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },

    productType: {
      type: String,
      enum: ["property", "luxury", "penthouse", "spacious"],
      default: "property",
    },

    title: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    // Property owner / creator
    createdBy: {
      type: String,
      default: null,
    },

    // Per-item revenue split
    adminAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    subAdminAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: {
        type: String,
        enum: ["guest", "registered"],
        default: "guest",
      },

      userId: {
        type: String,
        default: null,
      },

      name: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        default: "",
      },
    },

    shippingAddress: {
      country: {
        type: String,
        default: "India",
      },

      firstName: {
        type: String,
        default: "",
      },

      lastName: {
        type: String,
        default: "",
      },

      address: {
        type: String,
        required: true,
      },

      apartment: {
        type: String,
        default: "",
      },

      city: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        default: "",
      },

      pincode: {
        type: String,
        required: true,
      },
    },

    items: {
      type: [orderItemSchema],
      required: true,
      default: [],
    },

    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },

    shipping: {
      type: Number,
      default: 0,
    },

    taxes: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
      default: 0,
    },

    // Order-level revenue summary
    revenueDistribution: {
      adminPercentage: {
        type: Number,
        default: 20,
      },

      adminAmount: {
        type: Number,
        default: 0,
      },

      subAdminPercentage: {
        type: Number,
        default: 80,
      },

      subAdminAmount: {
        type: Number,
        default: 0,
      },

      distributedAt: {
        type: Date,
        default: null,
      },
    },

    // Prevent revenue from being calculated twice
    revenueDistributed: {
      type: Boolean,
      default: false,
    },

    paymentMethod: {
      type: String,
      default: "test",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: [
        "placed",
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "rejected",
      ],
      default: "placed",
    },

    // Prevent availability from being reduced twice
    availabilityUpdated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
