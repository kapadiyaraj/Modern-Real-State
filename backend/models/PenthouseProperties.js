

// const mongoose = require("mongoose");

// const penthousePropertySchema = new mongoose.Schema(
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
//       default: "Home",
//     },

//     image: {
//       type: String,
//       required: true,
//       default: "",
//     },

//     images: {
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

//     // Admin who created the property
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
//   "PenthouseProperties",
//   penthousePropertySchema
// );




const mongoose = require("mongoose");

const penthousePropertySchema = new mongoose.Schema(
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
      required: true,
      default: "Home",
    },

    image: {
      type: String,
      required: true,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },

    size: {
      type: String,
      required: true,
    },

    sizes: {
      type: [String],
      default: [],
    },

    price: {
      type: String,
      required: true,
    },

    oldPrice: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },
    // Availability / Inventory
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

    // Admin who created the property
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
  "PenthouseProperties",
  penthousePropertySchema
);