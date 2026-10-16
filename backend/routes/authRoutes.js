


const express = require("express");

const router = express.Router();

const {
  register,
  registerSubAdmin,
  login,
  getMe,
  getUsers,
} = require("../controllers/authController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// ==========================================
// REGISTER
// ==========================================

router.post(
  "/register",
  register
);

// ==========================================
// SUB-ADMIN REGISTER
// ==========================================

router.post(
  "/sub-admin/register",
  registerSubAdmin
);


// ==========================================
// LOGIN
// ==========================================

router.post(
  "/login",
  login
);

// ==========================================
// GET CURRENT LOGGED-IN USER
// ==========================================

router.get(
  "/me",
  protect,
  getMe
);

// ==========================================
// GET ALL USERS - ADMIN ONLY
// ==========================================

router.get(
  "/users",
  protect,
  authorize("admin"),
  getUsers
);

module.exports = router;