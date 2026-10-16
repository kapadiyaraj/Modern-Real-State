// const express = require("express");
// const router = express.Router();
// const { getAboutData, saveAboutData } = require("../controllers/aboutcontroller");
// const uploadAbout = require("../middleware/uploadAbout");

// router.get("/", getAboutData);
// router.put("/", saveAboutData);

// // POST /api/about/upload — uploads a single image to backend/uploads/about
// router.post("/upload", uploadAbout.single("image"), (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const filePath = `/uploads/about/${req.file.filename}`;

//     res.status(200).json({
//       message: "Image uploaded successfully",
//       path: filePath,
//     });
//   } catch (error) {
//     console.error("About Image Upload Error:", error);
//     res.status(500).json({
//       message: "Failed to upload image",
//       error: error.message,
//     });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();

const {
  getAboutData,
  saveAboutData,
} = require("../controllers/aboutcontroller");

const uploadAbout = require("../middleware/uploadAbout");
const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// Public - Anyone can view About data
router.get("/", getAboutData);

// Admin only - Update About data
router.put(
  "/",
  protect,
  authorize("admin"),
  saveAboutData
);

// Admin only - Upload About image
router.post(
  "/upload",
  protect,
  authorize("admin"),
  uploadAbout.single("image"),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded",
        });
      }

      const filePath = `/uploads/about/${req.file.filename}`;

      res.status(200).json({
        message: "Image uploaded successfully",
        path: filePath,
      });
    } catch (error) {
      console.error(
        "About Image Upload Error:",
        error
      );

      res.status(500).json({
        message: "Failed to upload image",
        error: error.message,
      });
    }
  }
);

module.exports = router;