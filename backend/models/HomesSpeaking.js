// const mongoose = require("mongoose");

// const homesSpeakingSchema = new mongoose.Schema(
//   {
//     id: {
//       type: Number,
//       unique: true,
//       required: true,
//     },

//     category: {
//       type: String,
//       default: "realestate",
//       trim: true,
//     },

//     image: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     date: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     author: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     description: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model(
//   "HomesSpeaking",
//   homesSpeakingSchema
// );


const mongoose = require("mongoose");

const homesSpeakingSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
      required: true,
    },

    category: {
      type: String,
      default: "realestate",
      trim: true,
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: String,
      default: "",
      trim: true,
    },

    author: {
      type: String,
      default: "",
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Short description - card page
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Main detailed content
    detailedDescription: {
      type: String,
      default: "",
      trim: true,
    },

    // Additional detailed content
    additionalDescription: {
      type: String,
      default: "",
      trim: true,
    },

    // Quote shown on details page
    quote: {
      type: String,
      default: "",
      trim: true,
    },

    // Tags
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "HomesSpeaking",
  homesSpeakingSchema
);