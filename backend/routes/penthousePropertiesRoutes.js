



const express = require("express");

const {
  getPenthouseProperties,
  getPenthouseProperty,
  getMyPenthouseProperties,
  createPenthouseProperty,
  updatePenthouseProperty,
  deletePenthouseProperty,
} = require("../controllers/penthousePropertiesController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ======================================================
// PUBLIC - GET ALL
// ======================================================

router.get(
  "/",
  getPenthouseProperties
);

// ======================================================
// SUB ADMIN / ADMIN - GET OWN PROPERTIES
// IMPORTANT: /my MUST COME BEFORE /:id
// ======================================================

router.get(
  "/my",
  protect,
  authorize("admin", "subAdmin"),
  getMyPenthouseProperties
);

// ======================================================
// PUBLIC - GET SINGLE
// ======================================================

router.get(
  "/:id",
  getPenthouseProperty
);

// ======================================================
// ADMIN + SUB ADMIN - CREATE
// ======================================================

router.post(
  "/",
  protect,
  authorize("admin", "subAdmin"),
  createPenthouseProperty
);

// ======================================================
// ADMIN + SUB ADMIN - UPDATE
// ======================================================

router.put(
  "/:id",
  protect,
  authorize("admin", "subAdmin"),
  updatePenthouseProperty
);

// ======================================================
// ADMIN + SUB ADMIN - DELETE
// ======================================================

router.delete(
  "/:id",
  protect,
  authorize("admin", "subAdmin"),
  deletePenthouseProperty
);

module.exports = router;