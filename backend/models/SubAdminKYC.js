const mongoose = require("mongoose");

const subAdminKYCSchema = new mongoose.Schema(
  {
    // ==========================================
    // SUB-ADMIN USER
    // ==========================================

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // ==========================================
    // PERSONAL DETAILS
    // ==========================================

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    dateOfBirth: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    pincode: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // KYC / VERIFICATION DETAILS
    // ==========================================

    idType: {
      type: String,
      enum: [
        "aadhaar",
        "pan",
        "passport",
        "driving_license",
        "voter_id",
      ],
      required: true,
    },

    idNumber: {
      type: String,
      required: true,
      trim: true,
    },

    panNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    idDocument: {
      type: String,
      default: "",
    },

    addressProof: {
      type: String,
      default: "",
    },

    // ==========================================
    // BANK DETAILS
    // ==========================================

    accountHolderName: {
      type: String,
      required: true,
      trim: true,
    },

    bankName: {
      type: String,
      required: true,
      trim: true,
    },

    accountNumber: {
      type: String,
      required: true,
      trim: true,
    },

    ifscCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    branchName: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // KYC STATUS
    // ==========================================

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
      ],
      default: "pending",
    },

    rejectionReason: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // REVIEWED BY SUPER ADMIN
    // ==========================================

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model(
    "SubAdminKYC",
    subAdminKYCSchema
  );