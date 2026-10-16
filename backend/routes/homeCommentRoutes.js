const express = require("express");

const {
  getComments,
  createComment,
  deleteComment,
} = require("../controllers/homeCommentController");

const router = express.Router();

// GET comments for particular article
router.get("/:homeId", getComments);

// POST new comment
router.post("/", createComment);

// DELETE comment
router.delete("/:id", deleteComment);

module.exports = router;