



// const express = require("express");

// const router = express.Router();

// const {
//   getProperties,
//   getMyProperties,
//   getProperty,
//   createProperty,
//   updateProperty,
//   deleteProperty,
// } = require("../controllers/propertyController");

// const upload = require("../middleware/upload");

// const {
//   protect,
//   authorize,
// } = require("../middleware/authMiddleware");

// // ======================================================
// // PUBLIC — GET ALL PROPERTIES
// // ======================================================

// router.get(
//   "/",
//   getProperties
// );

// // ======================================================
// // SUB-ADMIN — GET OWN PROPERTIES
// // ======================================================

// router.get(
//   "/my",
//   protect,
//   authorize("subAdmin"),
//   getMyProperties
// );

// // ======================================================
// // PUBLIC — GET SINGLE PROPERTY
// // ======================================================

// router.get(
//   "/:id",
//   getProperty
// );

// // ======================================================
// // CREATE PROPERTY
// // ======================================================

// router.post(
//   "/",
//   protect,
//   authorize("admin", "subAdmin"),
//   upload.fields([
//     {
//       name: "mainImage",
//       maxCount: 1,
//     },
//     {
//       name: "subImages",
//       maxCount: 4,
//     },
//   ]),
//   createProperty
// );

// // ======================================================
// // UPDATE PROPERTY
// // ======================================================

// router.put(
//   "/:id",
//   protect,
//   authorize("admin", "subAdmin"),
//   upload.fields([
//     {
//       name: "mainImage",
//       maxCount: 1,
//     },
//     {
//       name: "subImages",
//       maxCount: 4,
//     },
//   ]),
//   updateProperty
// );

// // ======================================================
// // DELETE PROPERTY
// // ======================================================

// router.delete(
//   "/:id",
//   protect,
//   authorize("admin", "subAdmin"),
//   deleteProperty
// );

// module.exports = router;


const express = require("express");

const router = express.Router();

const {
  getProperties,
  getMyProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyController");

const upload = require("../middleware/upload");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// ======================================================
// PUBLIC — GET ALL PROPERTIES
// ======================================================

router.get(
  "/",
  getProperties
);

// ======================================================
// SUB-ADMIN — GET OWN PROPERTIES
// ======================================================

router.get(
  "/my",
  protect,
  authorize("subAdmin"),
  getMyProperties
);

// ======================================================
// PUBLIC — GET SINGLE PROPERTY
// ======================================================

router.get(
  "/:id",
  getProperty
);

// ======================================================
// CREATE PROPERTY
// ADMIN + SUB-ADMIN
// ======================================================

router.post(
  "/",
  protect,
  authorize("admin", "subAdmin"),
  upload.fields([
    {
      name: "mainImage",
      maxCount: 1,
    },
    {
      name: "subImages",
      maxCount: 4,
    },
  ]),
  createProperty
);

// ======================================================
// UPDATE PROPERTY
// ADMIN + SUB-ADMIN
// ======================================================

router.put(
  "/:id",
  protect,
  authorize("admin", "subAdmin"),
  upload.fields([
    {
      name: "mainImage",
      maxCount: 1,
    },
    {
      name: "subImages",
      maxCount: 4,
    },
  ]),
  updateProperty
);

// ======================================================
// DELETE PROPERTY
// ADMIN + SUB-ADMIN
// ======================================================

router.delete(
  "/:id",
  protect,
  authorize("admin", "subAdmin"),
  deleteProperty
);

module.exports = router;