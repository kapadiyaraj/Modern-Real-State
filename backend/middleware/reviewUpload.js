// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// const reviewUploadPath = path.join(
//   __dirname,
//   "../uploads/review"
// );

// // Folder ન હોય તો automatically create થશે
// if (!fs.existsSync(reviewUploadPath)) {
//   fs.mkdirSync(reviewUploadPath, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, reviewUploadPath);
//   },

//   filename: (req, file, cb) => {
//     const extension = path.extname(file.originalname);

//     const originalName = path
//       .basename(file.originalname, extension)
//       .replace(/[^a-zA-Z0-9]/g, "-");

//     const filename = `${Date.now()}-${originalName}${extension}`;

//     cb(null, filename);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image files are allowed"), false);
//   }
// };

// const reviewUpload = multer({
//   storage,
//   fileFilter,
//   limits: {
//     files: 3,
//     fileSize: 5 * 1024 * 1024, // 5 MB per image
//   },
// });

// module.exports = reviewUpload;


const multer = require("multer");
const path = require("path");
const fs = require("fs");

const reviewUploadPath = path.join(
  __dirname,
  "../uploads/review"
);

// Folder ન હોય તો automatically create થશે
if (!fs.existsSync(reviewUploadPath)) {
  fs.mkdirSync(reviewUploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, reviewUploadPath);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    const originalName = path
      .basename(file.originalname, extension)
      .replace(/[^a-zA-Z0-9]/g, "-");

    const filename = `${Date.now()}-${originalName}${extension}`;

    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const reviewUpload = multer({
  storage,
  fileFilter,
  limits: {
    files: 3,
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = reviewUpload;