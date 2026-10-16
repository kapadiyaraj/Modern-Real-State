const HomeComment = require("../models/HomeComment");

// ==========================================
// GET COMMENTS FOR HOME
// ==========================================
const getComments = async (req, res) => {
  try {
    const { homeId } = req.params;

    const comments = await HomeComment.find({
      homeId: String(homeId),
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    console.error("Get Comments Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
    });
  }
};

// ==========================================
// CREATE COMMENT
// ==========================================
const createComment = async (req, res) => {
  try {
    const {
      homeId,
      name,
      email,
      message,
    } = req.body;

    if (!homeId || !name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const comment = await HomeComment.create({
      homeId: String(homeId),
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: comment,
    });
  } catch (error) {
    console.error("Create Comment Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add comment",
    });
  }
};

// ==========================================
// DELETE COMMENT
// ==========================================
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await HomeComment.findByIdAndDelete(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    res.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Delete Comment Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete comment",
    });
  }
};

module.exports = {
  getComments,
  createComment,
  deleteComment,
};