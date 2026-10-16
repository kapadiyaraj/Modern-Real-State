



const express = require("express");

const {
  getLuxuriousProperties,
  getLuxuriousProperty,
  getMyLuxuriousProperties,
  createLuxuriousProperty,
  updateLuxuriousProperty,
  deleteLuxuriousProperty,
} = require("../controllers/luxuriousPropertiesController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();


// ======================================================
// GET ALL LUXURY PROPERTIES
// PUBLIC
// ======================================================

router.get(
  "/",
  getLuxuriousProperties
);


// ======================================================
// GET MY LUXURY PROPERTIES
// ADMIN + SUBADMIN
//
// Admin    -> All properties
// SubAdmin -> Only own properties
// ======================================================

router.get(
  "/my",
  protect,
  authorize("admin", "subAdmin"),
  getMyLuxuriousProperties
);


// ======================================================
// GET SINGLE LUXURY PROPERTY
// PUBLIC
// ======================================================

router.get(
  "/:id",
  getLuxuriousProperty
);


// ======================================================
// CREATE LUXURY PROPERTY
// ADMIN + SUBADMIN
// ======================================================

router.post(
  "/",
  protect,
  authorize("admin", "subAdmin"),
  createLuxuriousProperty
);


// ======================================================
// UPDATE LUXURY PROPERTY
// ADMIN + SUBADMIN
//
// Admin    -> Can update any property
// SubAdmin -> Can update only own property
// ======================================================

router.put(
  "/:id",
  protect,
  authorize("admin", "subAdmin"),
  updateLuxuriousProperty
);


// ======================================================
// DELETE LUXURY PROPERTY
// ADMIN + SUBADMIN
//
// Admin    -> Can delete any property
// SubAdmin -> Can delete only own property
// ======================================================

router.delete(
  "/:id",
  protect,
  authorize("admin", "subAdmin"),
  deleteLuxuriousProperty
);


module.exports = router;