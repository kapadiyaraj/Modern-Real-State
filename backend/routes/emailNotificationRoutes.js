const express = require("express");

const router = express.Router();

const {
  sendNotificationEmail,
} = require("../services/emailService");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");


// ==========================================
// TEST EMAIL
// Admin only
// ==========================================

router.post(
  "/test",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const {
        email,
      } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      const result =
        await sendNotificationEmail({
          recipient: email,

          recipientRole: "admin",

          subject:
            "Modern Real Estate - Email Test",

          message:
            "Your email notification system is working successfully.",

          type: "test",
        });

      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: result.message,
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Test email sent successfully",
        data: result.notification,
      });
    } catch (error) {
      console.error(
        "TEST EMAIL ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to send test email",
      });
    }
  }
);

module.exports = router;