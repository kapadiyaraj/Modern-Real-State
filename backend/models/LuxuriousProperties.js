



// const mongoose = require("mongoose");

// const luxuriousPropertySchema = new mongoose.Schema(
//   {
//     id: {
//       type: Number,
//       required: true,
//       unique: true,
//     },

//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     category: {
//       type: String,
//       required: true,
//       default: "Luxury Properties",
//     },

//     type: {
//       type: String,
//       default: "Home",
//     },

//     mainImage: {
//       type: String,
//       default: "",
//     },

//     sliderImages: {
//       type: [String],
//       default: [],
//     },

//     size: {
//       type: String,
//       required: true,
//     },

//     sizes: {
//       type: [String],
//       default: [],
//     },

//     price: {
//       type: String,
//       required: true,
//     },

//     oldPrice: {
//       type: String,
//       default: "",
//     },

//     description: {
//       type: String,
//       default: "",
//     },

//     isNew: {
//       type: Boolean,
//       default: false,
//     },

//     // User who created this luxury property
//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model(
//   "LuxuriousProperties",
//   luxuriousPropertySchema
// );



const mongoose = require("mongoose");

const luxuriousPropertiesSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      default: "Luxury Properties",
      trim: true,
    },

    type: {
      type: String,
      default: "Home",
      trim: true,
    },

    mainImage: {
      type: String,
      default: "",
    },

    sliderImages: {
      type: [String],
      default: [],
      validate: {
        validator: function (value) {
          return value.length <= 4;
        },
        message: "Maximum 4 slider images are allowed",
      },
    },

    size: {
      type: String,
      default: "",
    },

    sizes: {
      type: [String],
      default: [],
    },

    price: {
      type: String,
      default: "",
    },

    oldPrice: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    isNew: {
      type: Boolean,
      default: false,
    },

    // ==================================================
    // AVAILABILITY
    // ==================================================

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

    // ==================================================
    // CREATED BY
    // ==================================================

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "LuxuriousProperties",
  luxuriousPropertiesSchema
);