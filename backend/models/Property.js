// const mongoose = require("mongoose");

// const propertySchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     category: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     mainImage: {
//       type: String,
//       required: true,
//     },

//     subImages: {
//       type: [String],
//       default: [],
//       validate: {
//         validator: function (value) {
//           return value.length <= 4;
//         },
//         message: "Maximum 4 sub images are allowed",
//       },
//     },

//     size: {
//       type: String,
//       default: "",
//     },

//     sizes: {
//       type: [String],
//       default: [],
//     },

//     price: {
//       type: String,
//       default: "",
//     },

//     oldPrice: {
//       type: String,
//       default: "",
//     },

//     description: {
//       type: String,
//       default: "",
//     },

//     // Admin who created this property
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

// module.exports = mongoose.model("Property", propertySchema);



const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    mainImage: {
      type: String,
      required: true,
    },

    subImages: {
      type: [String],
      default: [],
      validate: {
        validator: function (value) {
          return value.length <= 4;
        },
        message: "Maximum 4 sub images are allowed",
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
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Property",
  propertySchema
);