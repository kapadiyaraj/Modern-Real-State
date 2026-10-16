// const mongoose = require("mongoose");

// const emailNotificationSchema = new mongoose.Schema(
//   {
//     recipient: {
//       type: String,
//       required: true,
//       trim: true,
//       lowercase: true,
//     },

//     recipientRole: {
//       type: String,
//       enum: [
//         "admin",
//         "owner",
//         "buyer",
//         "tenant",
//         "customer",
//       ],
//       default: "customer",
//     },

//     subject: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     message: {
//       type: String,
//       required: true,
//     },

//     type: {
//       type: String,
//       default: "general",
//       trim: true,
//     },

//     propertyId: {
//       type: String,
//       default: "",
//     },

//     userId: {
//       type: String,
//       default: "",
//     },

//     status: {
//       type: String,
//       enum: ["pending", "sent", "failed"],
//       default: "pending",
//     },

//     sentAt: {
//       type: Date,
//       default: null,
//     },

//     error: {
//       type: String,
//       default: "",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model(
//   "EmailNotification",
//   emailNotificationSchema
// );


const mongoose = require("mongoose");

const emailNotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    recipientRole: {
      type: String,
      enum: [
        "admin",
        "subAdmin",
        "owner",
        "buyer",
        "tenant",
        "customer",
      ],
      default: "customer",
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      default: "general",
      trim: true,
    },

    propertyId: {
      type: String,
      default: "",
    },

    userId: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "sent",
        "failed",
      ],
      default: "pending",
    },

    sentAt: {
      type: Date,
      default: null,
    },

    error: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "EmailNotification",
  emailNotificationSchema
);