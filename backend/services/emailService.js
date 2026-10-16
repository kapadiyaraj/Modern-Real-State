// const nodemailer = require("nodemailer");
// const EmailNotification = require(
//   "../models/EmailNotification"
// );

// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: Number(process.env.EMAIL_PORT),

//   secure:
//     String(process.env.EMAIL_SECURE).toLowerCase() ===
//     "true",

//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// const sendNotificationEmail = async ({
//   recipient,
//   recipientRole = "customer",
//   subject,
//   message,
//   type = "general",
//   propertyId = "",
//   userId = "",
// }) => {
//   let notification = null;

//   try {
//     notification = await EmailNotification.create({
//       recipient,
//       recipientRole,
//       subject,
//       message,
//       type,
//       propertyId,
//       userId,
//       status: "pending",
//     });

//     const info = await transporter.sendMail({
//       from: process.env.EMAIL_FROM,
//       to: recipient,
//       subject,
//       text: message,

//       html: `
//         <div
//           style="
//             font-family: Arial, sans-serif;
//             max-width: 600px;
//             margin: auto;
//             padding: 25px;
//           "
//         >
//           <h2 style="color:#17232a;">
//             Modern Real Estate
//           </h2>

//           <p
//             style="
//               color:#536169;
//               line-height:1.7;
//               white-space:pre-line;
//             "
//           >
//             ${message}
//           </p>

//           <hr
//             style="
//               border:0;
//               border-top:1px solid #eeeeee;
//               margin:25px 0;
//             "
//           />

//           <p
//             style="
//               color:#999999;
//               font-size:12px;
//             "
//           >
//             This is an automated notification from
//             Modern Real Estate.
//           </p>
//         </div>
//       `,
//     });

//     notification.status = "sent";
//     notification.sentAt = new Date();
//     notification.error = "";

//     await notification.save();

//     return {
//       success: true,
//       message: "Email sent successfully",
//       messageId: info.messageId,
//       notification,
//     };
//   } catch (error) {
//     console.error("EMAIL SEND ERROR:", error);

//     if (notification) {
//       notification.status = "failed";
//       notification.error =
//         error.message || "Email sending failed";

//       await notification.save();
//     }

//     return {
//       success: false,
//       message:
//         error.message || "Email sending failed",
//       notification,
//     };
//   }
// };

// module.exports = {
//   sendNotificationEmail,
// };


const nodemailer = require("nodemailer");
const EmailNotification = require(
  "../models/EmailNotification"
);

// ======================================================
// CREATE EMAIL TRANSPORTER
// ======================================================

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),

  secure:
    String(process.env.EMAIL_SECURE).toLowerCase() ===
    "true",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },

  // Helpful for debugging SMTP connection
  logger: false,
  debug: false,
});

// ======================================================
// VERIFY SMTP CONNECTION
// ======================================================

const verifyEmailTransporter = async () => {
  try {
    await transporter.verify();

    console.log(
      "EMAIL SMTP CONNECTION SUCCESS"
    );

    console.log(
      "EMAIL USER:",
      process.env.EMAIL_USER
    );

    console.log(
      "EMAIL FROM:",
      process.env.EMAIL_FROM
    );

    return true;
  } catch (error) {
    console.error(
      "EMAIL SMTP CONNECTION ERROR:",
      error
    );

    console.error(
      "EMAIL HOST:",
      process.env.EMAIL_HOST
    );

    console.error(
      "EMAIL PORT:",
      process.env.EMAIL_PORT
    );

    console.error(
      "EMAIL SECURE:",
      process.env.EMAIL_SECURE
    );

    return false;
  }
};

// ======================================================
// SEND NOTIFICATION EMAIL
// ======================================================

const sendNotificationEmail = async ({
  recipient,
  recipientRole = "customer",
  subject,
  message,
  type = "general",
  propertyId = "",
  userId = "",
}) => {
  let notification = null;

  try {
    // ==================================================
    // VALIDATION
    // ==================================================

    if (!recipient) {
      throw new Error(
        "Recipient email is required"
      );
    }

    if (!subject) {
      throw new Error(
        "Email subject is required"
      );
    }

    if (!message) {
      throw new Error(
        "Email message is required"
      );
    }

    // ==================================================
    // CHECK EMAIL CONFIGURATION
    // ==================================================

    if (!process.env.EMAIL_HOST) {
      throw new Error(
        "EMAIL_HOST is missing in .env"
      );
    }

    if (!process.env.EMAIL_PORT) {
      throw new Error(
        "EMAIL_PORT is missing in .env"
      );
    }

    if (!process.env.EMAIL_USER) {
      throw new Error(
        "EMAIL_USER is missing in .env"
      );
    }

    if (!process.env.EMAIL_PASSWORD) {
      throw new Error(
        "EMAIL_PASSWORD is missing in .env"
      );
    }

    if (!process.env.EMAIL_FROM) {
      throw new Error(
        "EMAIL_FROM is missing in .env"
      );
    }

    // ==================================================
    // LOG RECIPIENT
    // ==================================================

    console.log(
      "=========================================="
    );

    console.log(
      "SENDING EMAIL"
    );

    console.log(
      "Recipient:",
      recipient
    );

    console.log(
      "Recipient Role:",
      recipientRole
    );

    console.log(
      "Subject:",
      subject
    );

    console.log(
      "Type:",
      type
    );

    console.log(
      "=========================================="
    );

    // ==================================================
    // SAVE NOTIFICATION AS PENDING
    // ==================================================

    notification =
      await EmailNotification.create({
        recipient,
        recipientRole,
        subject,
        message,
        type,
        propertyId,
        userId,
        status: "pending",
      });

    // ==================================================
    // SEND EMAIL
    // ==================================================

    const info =
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,

        to: recipient,

        subject,

        text: message,

        html: `
          <div
            style="
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: auto;
              padding: 25px;
              background:#ffffff;
              border:1px solid #eeeeee;
              border-radius:10px;
            "
          >

            <h2
              style="
                color:#17232a;
                margin-bottom:20px;
              "
            >
              Modern Real Estate
            </h2>

            <p
              style="
                color:#536169;
                line-height:1.7;
                white-space:pre-line;
              "
            >
              ${message}
            </p>

            <hr
              style="
                border:0;
                border-top:1px solid #eeeeee;
                margin:25px 0;
              "
            />

            <p
              style="
                color:#999999;
                font-size:12px;
                line-height:1.5;
              "
            >
              This is an automated notification from
              Modern Real Estate.
            </p>

          </div>
        `,
      });

    // ==================================================
    // UPDATE NOTIFICATION
    // ==================================================

    notification.status =
      "sent";

    notification.sentAt =
      new Date();

    notification.error =
      "";

    await notification.save();

    // ==================================================
    // SUCCESS LOG
    // ==================================================

    console.log(
      "EMAIL SENT SUCCESSFULLY"
    );

    console.log(
      "Recipient:",
      recipient
    );

    console.log(
      "Message ID:",
      info.messageId
    );

    console.log(
      "=========================================="
    );

    return {
      success: true,

      message:
        "Email sent successfully",

      messageId:
        info.messageId,

      notification,
    };
  } catch (error) {
    // ==================================================
    // ERROR LOG
    // ==================================================

    console.error(
      "=========================================="
    );

    console.error(
      "EMAIL SEND ERROR"
    );

    console.error(
      "Recipient:",
      recipient
    );

    console.error(
      "Subject:",
      subject
    );

    console.error(
      "Error:",
      error
    );

    console.error(
      "Error Message:",
      error.message
    );

    console.error(
      "=========================================="
    );

    // ==================================================
    // SAVE FAILED NOTIFICATION
    // ==================================================

    if (notification) {
      try {
        notification.status =
          "failed";

        notification.error =
          error.message ||
          "Email sending failed";

        await notification.save();
      } catch (saveError) {
        console.error(
          "FAILED TO SAVE EMAIL ERROR:",
          saveError
        );
      }
    }

    return {
      success: false,

      message:
        error.message ||
        "Email sending failed",

      notification,
    };
  }
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  sendNotificationEmail,
  verifyEmailTransporter,
};