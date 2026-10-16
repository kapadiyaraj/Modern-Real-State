// const express = require("express");

// const router =
//   express.Router();

// const {
//   submitKYC,
//   getMyKYC,
//   getAllKYC,
//   getPendingKYC,
//   approveKYC,
//   rejectKYC,
// } = require("../controllers/subAdminKYCController");

// const {
//   protect,
//   authorize,
// } = require("../middleware/authMiddleware");

// // ======================================================
// // SUB-ADMIN
// // ======================================================

// // Submit KYC
// router.post(
//   "/",
//   protect,
//   authorize("subAdmin"),
//   submitKYC
// );

// // Get own KYC
// router.get(
//   "/my",
//   protect,
//   authorize("subAdmin"),
//   getMyKYC
// );

// // ======================================================
// // SUPER ADMIN
// // ======================================================

// // Get all KYC
// router.get(
//   "/all",
//   protect,
//   authorize("admin"),
//   getAllKYC
// );

// // Get pending KYC
// router.get(
//   "/pending",
//   protect,
//   authorize("admin"),
//   getPendingKYC
// );

// // Approve KYC
// router.put(
//   "/:id/approve",
//   protect,
//   authorize("admin"),
//   approveKYC
// );

// // Reject KYC
// router.put(
//   "/:id/reject",
//   protect,
//   authorize("admin"),
//   rejectKYC
// );

// module.exports = router;




const express = require("express");
const router = express.Router();

const {
  submitKYC,
  getMyKYC,
  getAllKYC,
  getPendingKYC,
  approveKYC,
  rejectKYC,
} = require("../controllers/subAdminKYCController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const kycUpload = require("../middleware/kycUpload");

// ======================================================
// SUB-ADMIN
// ======================================================

router.post(
  "/",
  protect,
  authorize("subAdmin"),
  kycUpload.fields([
    {
      name: "idDocument",
      maxCount: 1,
    },
    {
      name: "addressProof",
      maxCount: 1,
    },
  ]),
  submitKYC
);

router.get(
  "/my",
  protect,
  authorize("subAdmin"),
  getMyKYC
);

// ======================================================
// SUPER ADMIN
// ======================================================

router.get(
  "/all",
  protect,
  authorize("admin"),
  getAllKYC
);

router.get(
  "/pending",
  protect,
  authorize("admin"),
  getPendingKYC
);

router.put(
  "/:id/approve",
  protect,
  authorize("admin"),
  approveKYC
);

router.put(
  "/:id/reject",
  protect,
  authorize("admin"),
  rejectKYC
);

module.exports = router;