



const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  getSpaciousLiving,
  getMySpaciousLiving,
  saveSpaciousLiving,
  deleteSpaciousLiving,
} = require("../controllers/spaciousLivingController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// =========================================================
// MULTER STORAGE
// =========================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(
      null,
      path.join(
        __dirname,
        "../uploads"
      )
    );
  },

  filename: (req, file, cb) => {
    const filename =
      `${Date.now()}-${file.originalname.replace(
        /[^a-zA-Z0-9.-]/g,
        "-"
      )}`;

    cb(null, filename);
  },
});

// =========================================================
// MULTER
// =========================================================

const upload = multer({
  storage,
});

// =========================================================
// PUBLIC GET
// =========================================================
// Used by frontend/public website
// Returns complete Spacious Living data
// =========================================================

router.get(
  "/",
  getSpaciousLiving
);

// =========================================================
// ADMIN / SUBADMIN - GET MY
// =========================================================
// IMPORTANT:
// Keep /my before any /:id route if you add one later.
// =========================================================

router.get(
  "/my",
  protect,
  authorize(
    "admin",
    "subAdmin"
  ),
  getMySpaciousLiving
);

// =========================================================
// ADMIN / SUBADMIN - CREATE / UPDATE
// =========================================================

router.post(
  "/",
  protect,
  authorize(
    "admin",
    "subAdmin"
  ),
  upload.any(),
  saveSpaciousLiving
);

// =========================================================
// ADMIN / SUBADMIN - DELETE
// =========================================================

router.delete(
  "/",
  protect,
  authorize(
    "admin",
    "subAdmin"
  ),
  deleteSpaciousLiving
);

// =========================================================
// EXPORT
// =========================================================

module.exports = router;