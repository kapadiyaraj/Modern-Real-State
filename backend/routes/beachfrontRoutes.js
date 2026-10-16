// const express = require("express");

// const router = express.Router();

// const {
//   getBeachfronts,
//   getBeachfrontById,
//   createBeachfront,
//   updateBeachfront,      // ← imported here
//   deleteBeachfront,
//   updateBeachfrontCard,
// } = require("../controllers/beachfrontController");
// const uploadBeachfront = require("../middleware/uploadBeachfront");

// // Image upload
// router.post(
//   "/upload",
//   uploadBeachfront.single("image"),
//   (req, res) => {
//     try {
//       if (!req.file) {
//         return res.status(400).json({
//           success: false,
//           message: "No image uploaded",
//         });
//       }

//       const imagePath =
//         `/uploads/beachfront/${req.file.filename}`;

//       res.status(200).json({
//         success: true,
//         message: "Image uploaded successfully",
//         path: imagePath,
//       });
//     } catch (error) {
//       console.error(
//         "BEACHFRONT IMAGE UPLOAD ERROR:",
//         error
//       );

//       res.status(500).json({
//         success: false,
//         message: "Image upload failed",
//         error: error.message,
//       });
//     }
//   }
// );

// // CRUD
// router.get("/", getBeachfronts);

// router.get("/:id", getBeachfrontById);

// router.post("/", createBeachfront);

// // IMPORTANT: specific route first
// router.put("/:id/cards/:cardIndex", updateBeachfrontCard);

// // general update after it
// router.put("/:id", updateBeachfront);

// router.delete("/:id", deleteBeachfront);
// module.exports = router;



const express = require("express");

const router = express.Router();

const {
  getBeachfronts,
  getBeachfrontById,
  createBeachfront,
  updateBeachfront,
  deleteBeachfront,
  updateBeachfrontCard,
} = require("../controllers/beachfrontController");

const uploadBeachfront = require("../middleware/uploadBeachfront");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// ===============================
// IMAGE UPLOAD - ADMIN ONLY
// ===============================
router.post(
  "/upload",
  protect,
  authorize("admin"),
  uploadBeachfront.single("image"),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No image uploaded",
        });
      }

      const imagePath =
        `/uploads/beachfront/${req.file.filename}`;

      res.status(200).json({
        success: true,
        message: "Image uploaded successfully",
        path: imagePath,
      });
    } catch (error) {
      console.error(
        "BEACHFRONT IMAGE UPLOAD ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Image upload failed",
        error: error.message,
      });
    }
  }
);

// ===============================
// GET - PUBLIC
// ===============================

router.get("/", getBeachfronts);

router.get("/:id", getBeachfrontById);

// ===============================
// CREATE - ADMIN ONLY
// ===============================

router.post(
  "/",
  protect,
  authorize("admin"),
  createBeachfront
);

// ===============================
// UPDATE CARD - ADMIN ONLY
// ===============================

router.put(
  "/:id/cards/:cardIndex",
  protect,
  authorize("admin"),
  updateBeachfrontCard
);

// ===============================
// UPDATE - ADMIN ONLY
// ===============================

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateBeachfront
);

// ===============================
// DELETE - ADMIN ONLY
// ===============================

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteBeachfront
);

module.exports = router;