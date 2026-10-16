

// const mongoose = require("mongoose");

// // =========================================================
// // SLIDER PROPERTY SCHEMA
// // =========================================================

// const sliderPropertySchema =
//   new mongoose.Schema(
//     {
//       title: {
//         type: String,
//         default: "",
//       },

//       category: {
//         type: String,
//         default: "",
//       },

//       mainImage: {
//         type: String,
//         default: "",
//       },

//       subImages: {
//         type: [String],
//         default: [],
//       },

//       size: {
//         type: String,
//         default: "",
//       },

//       sizes: {
//         type: [String],
//         default: [],
//       },

//       price: {
//         type: String,
//         default: "",
//       },

//       oldPrice: {
//         type: String,
//         default: "",
//       },

//       description: {
//         type: String,
//         default: "",
//       },

//       // =====================================================
//       // IMPORTANT
//       // Each Spacious property has its own owner
//       // =====================================================

//       createdBy: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         default: null,
//       },
//     },
//     {
//       timestamps: true,
//     }
//   );

// // =========================================================
// // SPACIOUS LIVING SCHEMA
// // =========================================================

// const spaciousLivingSchema =
//   new mongoose.Schema(
//     {
//       title: {
//         type: String,
//         default: "",
//       },

//       topDescription: {
//         type: String,
//         default: "",
//       },

//       mainImage: {
//         type: String,
//         default: "",
//       },

//       bottomDescription: {
//         type: String,
//         default: "",
//       },

//       sliderProperties: {
//         type: [sliderPropertySchema],
//         default: [],
//       },

//       // Keep this for old data / section owner.
//       // Property ownership is now handled
//       // inside sliderProperties.createdBy.
//       createdBy: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         default: null,
//       },
//     },
//     {
//       timestamps: true,
//     }
//   );

// module.exports =
//   mongoose.model(
//     "SpaciousLiving",
//     spaciousLivingSchema
//   );


const mongoose = require("mongoose");

const sliderPropertySchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    category: { type: String, default: "" },
    mainImage: { type: String, default: "" },
    subImages: { type: [String], default: [] },
    size: { type: String, default: "" },
    sizes: { type: [String], default: [] },
    price: { type: String, default: "" },
    oldPrice: { type: String, default: "" },
    description: { type: String, default: "" },

    // Availability for each individual Spacious Living property
    totalUnits: {
      type: Number,
      default: 1,
      min: 0,
    },
    availableUnits: {
      type: Number,
      default: 1,
      min: 0,
    },
    bookedUnits: {
      type: Number,
      default: 0,
      min: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

const spaciousLivingSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    topDescription: { type: String, default: "" },
    mainImage: { type: String, default: "" },
    bottomDescription: { type: String, default: "" },

    sliderProperties: {
      type: [sliderPropertySchema],
      default: [],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "SpaciousLiving",
  spaciousLivingSchema
);