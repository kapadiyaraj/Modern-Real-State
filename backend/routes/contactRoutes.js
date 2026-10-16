// const express = require("express");

// const router = express.Router();

// const {
//   createContact,
//   getContacts,
//   getContactById,
//   deleteContact,
// } = require("../controllers/contactController");

// router.post("/", createContact);

// router.get("/", getContacts);

// router.get("/:id", getContactById);

// router.delete("/:id", deleteContact);

// module.exports = router;



const express = require("express");

const router = express.Router();

const {
  createContact,
  getContacts,
  getContactById,
  deleteContact,
} = require("../controllers/contactController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// ===============================
// CREATE CONTACT
// ===============================
// Public - Guest/Customer can submit contact form
router.post("/", createContact);

// ===============================
// GET ALL CONTACTS
// ===============================
// Admin only
router.get(
  "/",
  protect,
  authorize("admin"),
  getContacts
);

// ===============================
// GET CONTACT BY ID
// ===============================
// Admin only
router.get(
  "/:id",
  protect,
  authorize("admin"),
  getContactById
);

// ===============================
// DELETE CONTACT
// ===============================
// Admin only
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteContact
);

module.exports = router;