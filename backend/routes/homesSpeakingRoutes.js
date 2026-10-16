// // const express = require("express");
// // const multer = require("multer");
// // const path = require("path");
// // const fs = require("fs");

// // const router = express.Router();

// // const {
// //   getHomes,
// //   getHomeById,
// //   createHome,
// //   updateHome,
// //   deleteHome,
// // } = require("../controllers/homesSpeakingController");

// // // =========================================================
// // // UPLOAD FOLDER
// // // =========================================================

// // const uploadFolder = path.join(
// //   __dirname,
// //   "..",
// //   "uploads",
// //   "homes-speaking"
// // );

// // if (!fs.existsSync(uploadFolder)) {
// //   fs.mkdirSync(uploadFolder, {
// //     recursive: true,
// //   });
// // }

// // // =========================================================
// // // MULTER STORAGE
// // // =========================================================

// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => {
// //     cb(null, uploadFolder);
// //   },

// //   filename: (req, file, cb) => {
// //     const extension = path.extname(
// //       file.originalname
// //     );

// //     const fileName = `home-${Date.now()}-${Math.round(
// //       Math.random() * 1e9
// //     )}${extension}`;

// //     cb(null, fileName);
// //   },
// // });

// // // =========================================================
// // // FILE FILTER
// // // =========================================================

// // const fileFilter = (req, file, cb) => {
// //   const allowedTypes = [
// //     "image/jpeg",
// //     "image/jpg",
// //     "image/png",
// //     "image/webp",
// //     "image/avif",
// //   ];

// //   if (
// //     allowedTypes.includes(file.mimetype)
// //   ) {
// //     cb(null, true);
// //   } else {
// //     cb(
// //       new Error(
// //         "Only JPG, JPEG, PNG, WEBP and AVIF images are allowed"
// //       ),
// //       false
// //     );
// //   }
// // };

// // // =========================================================
// // // MULTER
// // // =========================================================

// // const upload = multer({
// //   storage,
// //   fileFilter,
// //   limits: {
// //     fileSize: 5 * 1024 * 1024,
// //   },
// // });

// // // =========================================================
// // // ROUTES
// // // =========================================================

// // router.get("/", getHomes);

// // router.get("/:id", getHomeById);

// // router.post(
// //   "/",
// //   upload.single("image"),
// //   createHome
// // );

// // router.put(
// //   "/:id",
// //   upload.single("image"),
// //   updateHome
// // );

// // router.delete(
// //   "/:id",
// //   deleteHome
// // );

// // module.exports = router;


// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// const router = express.Router();

// const {
//   getHomes,
//   getHomeById,
//   createHome,
//   updateHome,
//   deleteHome,
// } = require("../controllers/homesSpeakingController");

// const {
//   protect,
//   authorize,
// } = require("../middleware/authMiddleware");

// // =========================================================
// // UPLOAD FOLDER
// // =========================================================

// const uploadFolder = path.join(
//   __dirname,
//   "..",
//   "uploads",
//   "homes-speaking"
// );

// if (!fs.existsSync(uploadFolder)) {
//   fs.mkdirSync(uploadFolder, {
//     recursive: true,
//   });
// }

// // =========================================================
// // MULTER STORAGE
// // =========================================================

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadFolder);
//   },

//   filename: (req, file, cb) => {
//     const extension = path.extname(
//       file.originalname
//     );

//     const fileName = `home-${Date.now()}-${Math.round(
//       Math.random() * 1e9
//     )}${extension}`;

//     cb(null, fileName);
//   },
// });

// // =========================================================
// // FILE FILTER
// // =========================================================

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = [
//     "image/jpeg",
//     "image/jpg",
//     "image/png",
//     "image/webp",
//     "image/avif",
//   ];

//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(
//       new Error(
//         "Only JPG, JPEG, PNG, WEBP and AVIF images are allowed"
//       ),
//       false
//     );
//   }
// };

// // =========================================================
// // MULTER
// // =========================================================

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: 5 * 1024 * 1024,
//   },
// });

// // =========================================================
// // ROUTES
// // =========================================================

// // GET ALL - PUBLIC
// router.get("/", getHomes);

// // GET SINGLE - PUBLIC
// router.get("/:id", getHomeById);

// // CREATE - ADMIN ONLY
// router.post(
//   "/",
//   protect,
//   authorize("admin"),
//   upload.single("image"),
//   createHome
// );

// // UPDATE - ADMIN ONLY
// router.put(
//   "/:id",
//   protect,
//   authorize("admin"),
//   upload.single("image"),
//   updateHome
// );

// // DELETE - ADMIN ONLY
// router.delete(
//   "/:id",
//   protect,
//   authorize("admin"),
//   deleteHome
// );

// module.exports = router;





const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const {
  getHomes,
  getHomeById,
  createHome,
  updateHome,
  deleteHome,
} = require("../controllers/homesSpeakingController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// =========================================================
// UPLOAD FOLDER
// =========================================================

const uploadFolder = path.join(
  __dirname,
  "..",
  "uploads",
  "homes-speaking"
);

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, {
    recursive: true,
  });
}

// =========================================================
// MULTER STORAGE
// =========================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(
      file.originalname
    );

    const fileName =
      `home-${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${extension}`;

    cb(null, fileName);
  },
});

// =========================================================
// FILE FILTER
// =========================================================

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/avif",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG, WEBP and AVIF images are allowed"
      ),
      false
    );
  }
};

// =========================================================
// MULTER
// =========================================================

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// =========================================================
// ROUTES
// =========================================================

// GET ALL - PUBLIC
router.get("/", getHomes);

// GET SINGLE HOME - PUBLIC
router.get("/:id", getHomeById);

// CREATE - ADMIN ONLY
router.post(
  "/",
  protect,
  authorize("admin"),
  upload.single("image"),
  createHome
);

// UPDATE - ADMIN ONLY
router.put(
  "/:id",
  protect,
  authorize("admin"),
  upload.single("image"),
  updateHome
);

// DELETE - ADMIN ONLY
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteHome
);

module.exports = router;