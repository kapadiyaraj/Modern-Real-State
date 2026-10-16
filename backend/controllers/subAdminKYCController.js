





// const SubAdminKYC = require("../models/SubAdminKYC");
// const User = require("../models/userModel");

// const {
//   notifyAdmins,
// } = require("../services/notificationService");

// // ======================================================
// // HELPER - GET USER ID
// // ======================================================

// const getUserId = (req) => {
//   return (
//     req.user?.userId ||
//     req.user?.id ||
//     req.user?._id
//   );
// };

// // ======================================================
// // HELPER - GET UPLOADED FILE
// // ======================================================

// const getUploadedFilePath = (
//   req,
//   fieldName
// ) => {
//   const file =
//     req.files?.[fieldName]?.[0];

//   if (!file) {
//     return "";
//   }

//   return `/uploads/kyc/${file.filename}`;
// };

// // ======================================================
// // SUB-ADMIN SUBMIT KYC
// // ======================================================

// const submitKYC = async (req, res) => {
//   try {
//     const userId = getUserId(req);

//     // ==================================================
//     // AUTHENTICATION
//     // ==================================================

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "Authentication required",
//       });
//     }

//     // ==================================================
//     // CHECK USER
//     // ==================================================

//     const user =
//       await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // ==================================================
//     // ONLY SUB-ADMIN
//     // ==================================================

//     if (user.role !== "subAdmin") {
//       return res.status(403).json({
//         success: false,
//         message:
//           "Only Sub-Admin can submit KYC",
//       });
//     }

//     // ==================================================
//     // EXISTING KYC
//     // ==================================================

//     const existingKYC =
//       await SubAdminKYC.findOne({
//         userId,
//       });

//     // ==================================================
//     // APPROVED KYC CANNOT BE RESUBMITTED
//     // ==================================================

//     if (
//       existingKYC &&
//       existingKYC.status === "approved"
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Your KYC is already approved",
//       });
//     }

//     // ==================================================
//     // TEXT DATA
//     // ==================================================

//     const {
//       firstName,
//       lastName,
//       phone,
//       dateOfBirth,
//       address,
//       city,
//       state,
//       pincode,

//       idType,
//       idNumber,
//       panNumber,

//       accountHolderName,
//       bankName,
//       accountNumber,
//       ifscCode,
//       branchName,
//     } = req.body;

//     // ==================================================
//     // UPLOADED DOCUMENTS
//     // ==================================================

//     const newIdDocument =
//       getUploadedFilePath(
//         req,
//         "idDocument"
//       );

//     const newAddressProof =
//       getUploadedFilePath(
//         req,
//         "addressProof"
//       );

//     // ==================================================
//     // REQUIRED TEXT VALIDATION
//     // ==================================================

//     if (
//       !firstName ||
//       !lastName ||
//       !phone ||
//       !dateOfBirth ||
//       !address ||
//       !city ||
//       !state ||
//       !pincode ||
//       !idType ||
//       !idNumber ||
//       !panNumber ||
//       !accountHolderName ||
//       !bankName ||
//       !accountNumber ||
//       !ifscCode ||
//       !branchName
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "All required KYC and bank details are required",
//       });
//     }

//     // ==================================================
//     // DOCUMENT PATHS
//     //
//     // If resubmitting rejected KYC and no new file
//     // is selected, keep the old document.
//     // ==================================================

//     const idDocument =
//       newIdDocument ||
//       existingKYC?.idDocument ||
//       "";

//     const addressProof =
//       newAddressProof ||
//       existingKYC?.addressProof ||
//       "";

//     // ==================================================
//     // REQUIRED DOCUMENT VALIDATION
//     // ==================================================

//     if (!idDocument) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "ID document is required",
//       });
//     }

//     if (!addressProof) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Address proof is required",
//       });
//     }

//     // ==================================================
//     // CREATE / UPDATE KYC
//     // ==================================================

//     let kyc;

//     if (existingKYC) {
//       // ================================================
//       // UPDATE EXISTING KYC
//       // ================================================

//       existingKYC.firstName =
//         firstName;

//       existingKYC.lastName =
//         lastName;

//       existingKYC.phone =
//         phone;

//       existingKYC.dateOfBirth =
//         dateOfBirth;

//       existingKYC.address =
//         address;

//       existingKYC.city =
//         city;

//       existingKYC.state =
//         state;

//       existingKYC.pincode =
//         pincode;

//       existingKYC.idType =
//         idType;

//       existingKYC.idNumber =
//         idNumber;

//       existingKYC.panNumber =
//         panNumber;

//       existingKYC.idDocument =
//         idDocument;

//       existingKYC.addressProof =
//         addressProof;

//       existingKYC.accountHolderName =
//         accountHolderName;

//       existingKYC.bankName =
//         bankName;

//       existingKYC.accountNumber =
//         accountNumber;

//       existingKYC.ifscCode =
//         ifscCode;

//       existingKYC.branchName =
//         branchName;

//       // New submission becomes pending
//       existingKYC.status =
//         "pending";

//       existingKYC.rejectionReason =
//         "";

//       existingKYC.reviewedBy =
//         null;

//       existingKYC.reviewedAt =
//         null;

//       kyc =
//         await existingKYC.save();
//     } else {
//       // ================================================
//       // CREATE NEW KYC
//       // ================================================

//       kyc =
//         await SubAdminKYC.create({
//           userId,

//           firstName,
//           lastName,
//           phone,
//           dateOfBirth,
//           address,
//           city,
//           state,
//           pincode,

//           idType,
//           idNumber,
//           panNumber,

//           idDocument,
//           addressProof,

//           accountHolderName,
//           bankName,
//           accountNumber,
//           ifscCode,
//           branchName,

//           status: "pending",
//         });
//     }

//     // ==================================================
//     // NOTIFY SUPER ADMIN
//     // ==================================================

//     try {
//       await notifyAdmins({
//         subject:
//           "Modern Real Estate - New Sub-Admin KYC Request",

//         message: `
// A Sub-Admin has submitted a KYC verification request.

// Sub-Admin:
// ${user.firstName} ${user.lastName}

// Email:
// ${user.email}

// KYC ID:
// ${kyc._id}

// Status:
// Pending

// Please login to the Super Admin Panel and review the submitted KYC.
// `,

//         type:
//           "subadmin-kyc-submitted",

//         userId:
//           userId.toString(),
//       });
//     } catch (notificationError) {
//       console.error(
//         "SUB-ADMIN KYC ADMIN NOTIFICATION ERROR:",
//         notificationError
//       );
//     }

//     // ==================================================
//     // RESPONSE
//     // ==================================================

//     return res.status(201).json({
//       success: true,

//       message:
//         "KYC submitted successfully. Waiting for Super Admin approval.",

//       data: kyc,
//     });
//   } catch (error) {
//     console.error(
//       "SUB-ADMIN KYC SUBMIT ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Failed to submit KYC",
//       error: error.message,
//     });
//   }
// };

// // ======================================================
// // GET MY KYC
// // ======================================================

// const getMyKYC = async (req, res) => {
//   try {
//     const userId = getUserId(req);

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message:
//           "Authentication required",
//       });
//     }

//     const kyc =
//       await SubAdminKYC.findOne({
//         userId,
//       });

//     return res.status(200).json({
//       success: true,
//       data: kyc || null,
//     });
//   } catch (error) {
//     console.error(
//       "GET MY KYC ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Failed to fetch KYC",
//       error: error.message,
//     });
//   }
// };

// // ======================================================
// // SUPER ADMIN - GET ALL KYC
// // ======================================================

// const getAllKYC = async (req, res) => {
//   try {
//     const kycs =
//       await SubAdminKYC.find()
//         .populate(
//           "userId",
//           "firstName lastName email role"
//         )
//         .populate(
//           "reviewedBy",
//           "firstName lastName email"
//         )
//         .sort({
//           createdAt: -1,
//         });

//     return res.status(200).json({
//       success: true,
//       count: kycs.length,
//       data: kycs,
//     });
//   } catch (error) {
//     console.error(
//       "GET ALL KYC ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Failed to fetch KYC requests",
//       error: error.message,
//     });
//   }
// };

// // ======================================================
// // SUPER ADMIN - GET PENDING KYC
// // ======================================================

// const getPendingKYC = async (
//   req,
//   res
// ) => {
//   try {
//     const kycs =
//       await SubAdminKYC.find({
//         status: "pending",
//       })
//         .populate(
//           "userId",
//           "firstName lastName email role"
//         )
//         .sort({
//           createdAt: -1,
//         });

//     return res.status(200).json({
//       success: true,
//       count: kycs.length,
//       data: kycs,
//     });
//   } catch (error) {
//     console.error(
//       "GET PENDING KYC ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Failed to fetch pending KYC requests",
//       error: error.message,
//     });
//   }
// };

// // ======================================================
// // SUPER ADMIN - APPROVE KYC
// // ======================================================

// const approveKYC = async (
//   req,
//   res
// ) => {
//   try {
//     const { id } =
//       req.params;

//     const adminId =
//       getUserId(req);

//     if (!adminId) {
//       return res.status(401).json({
//         success: false,
//         message:
//           "Authentication required",
//       });
//     }

//     const kyc =
//       await SubAdminKYC.findById(
//         id
//       );

//     if (!kyc) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "KYC request not found",
//       });
//     }

//     // ==================================================
//     // APPROVE
//     // ==================================================

//     kyc.status =
//       "approved";

//     kyc.rejectionReason =
//       "";

//     kyc.reviewedBy =
//       adminId;

//     kyc.reviewedAt =
//       new Date();

//     await kyc.save();

//     // ==================================================
//     // GET SUB ADMIN
//     // ==================================================

//     const subAdmin =
//       await User.findById(
//         kyc.userId
//       );

//     // ==================================================
//     // NOTIFY SUB ADMIN
//     // ==================================================

//     if (subAdmin) {
//       try {
//         await notifyAdmins({
//           subject:
//             "Modern Real Estate - KYC Approved",

//           message: `
// Sub-Admin KYC has been approved.

// Sub-Admin:
// ${subAdmin.firstName} ${subAdmin.lastName}

// Email:
// ${subAdmin.email}

// KYC Status:
// Approved

// The Sub-Admin can now add and manage properties according to the assigned permissions.
// `,

//           type:
//             "subadmin-kyc-approved",

//           userId:
//             subAdmin._id.toString(),
//         });
//       } catch (notificationError) {
//         console.error(
//           "KYC APPROVAL NOTIFICATION ERROR:",
//           notificationError
//         );
//       }
//     }

//     return res.status(200).json({
//       success: true,
//       message:
//         "KYC approved successfully",
//       data: kyc,
//     });
//   } catch (error) {
//     console.error(
//       "APPROVE KYC ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Failed to approve KYC",
//       error: error.message,
//     });
//   }
// };

// // ======================================================
// // SUPER ADMIN - REJECT KYC
// // ======================================================

// const rejectKYC = async (
//   req,
//   res
// ) => {
//   try {
//     const { id } =
//       req.params;

//     const {
//       rejectionReason,
//     } = req.body;

//     const adminId =
//       getUserId(req);

//     if (!adminId) {
//       return res.status(401).json({
//         success: false,
//         message:
//           "Authentication required",
//       });
//     }

//     if (
//       !rejectionReason ||
//       !rejectionReason.trim()
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Rejection reason is required",
//       });
//     }

//     const kyc =
//       await SubAdminKYC.findById(
//         id
//       );

//     if (!kyc) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "KYC request not found",
//       });
//     }

//     // ==================================================
//     // REJECT
//     // ==================================================

//     kyc.status =
//       "rejected";

//     kyc.rejectionReason =
//       rejectionReason.trim();

//     kyc.reviewedBy =
//       adminId;

//     kyc.reviewedAt =
//       new Date();

//     await kyc.save();

//     // ==================================================
//     // GET SUB ADMIN
//     // ==================================================

//     const subAdmin =
//       await User.findById(
//         kyc.userId
//       );

//     // ==================================================
//     // NOTIFY SUB ADMIN
//     // ==================================================

//     if (subAdmin) {
//       try {
//         await notifyAdmins({
//           subject:
//             "Modern Real Estate - KYC Rejected",

//           message: `
// Your Sub-Admin KYC request has been rejected.

// Sub-Admin:
// ${subAdmin.firstName} ${subAdmin.lastName}

// Email:
// ${subAdmin.email}

// KYC Status:
// Rejected

// Reason:
// ${rejectionReason}

// Please update your KYC details and submit the verification request again.
// `,

//           type:
//             "subadmin-kyc-rejected",

//           userId:
//             subAdmin._id.toString(),
//         });
//       } catch (notificationError) {
//         console.error(
//           "KYC REJECTION NOTIFICATION ERROR:",
//           notificationError
//         );
//       }
//     }

//     return res.status(200).json({
//       success: true,
//       message:
//         "KYC rejected successfully",
//       data: kyc,
//     });
//   } catch (error) {
//     console.error(
//       "REJECT KYC ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Failed to reject KYC",
//       error: error.message,
//     });
//   }
// };

// // ======================================================
// // EXPORTS
// // ======================================================

// module.exports = {
//   submitKYC,
//   getMyKYC,
//   getAllKYC,
//   getPendingKYC,
//   approveKYC,
//   rejectKYC,
// };

const SubAdminKYC = require("../models/SubAdminKYC");
const User = require("../models/userModel");

const {
  notifyAdmins,
  notifyUser,
} = require("../services/notificationService");

// ======================================================
// HELPER - GET USER ID
// ======================================================

const getUserId = (req) => {
  return (
    req.user?.userId ||
    req.user?.id ||
    req.user?._id
  );
};

// ======================================================
// HELPER - GET UPLOADED FILE
// ======================================================

const getUploadedFilePath = (req, fieldName) => {
  const file = req.files?.[fieldName]?.[0];

  if (!file) {
    return "";
  }

  return `/uploads/kyc/${file.filename}`;
};

// ======================================================
// HELPER - SEND EMAIL SAFELY
// ======================================================

const sendUserEmail = async ({
  user,
  subject,
  message,
  type,
  userId,
}) => {
  try {
    if (!user) {
      console.error(
        "KYC EMAIL ERROR: User object not found"
      );

      return {
        success: false,
        message: "User not found",
      };
    }

    const recipientEmail = String(
      user.email || ""
    )
      .trim()
      .toLowerCase();

    console.log(
      "------------------------------------------"
    );
    console.log("KYC EMAIL");
    console.log("User ID:", user._id?.toString());
    console.log(
      "User Name:",
      `${user.firstName || ""} ${user.lastName || ""}`.trim()
    );
    console.log("Recipient Email:", recipientEmail);
    console.log("Role:", user.role);
    console.log("Subject:", subject);
    console.log("Type:", type);
    console.log(
      "------------------------------------------"
    );

    if (!recipientEmail) {
      console.error(
        "KYC EMAIL ERROR: User email is missing"
      );

      return {
        success: false,
        message: "User email is missing",
      };
    }

    const result = await notifyUser({
      email: recipientEmail,
      role: user.role || "subAdmin",
      subject,
      message,
      type,
      userId:
        userId ||
        user._id?.toString(),
    });

    console.log(
      "KYC EMAIL RESULT:",
      result
    );

    if (
      !result ||
      result.success !== true
    ) {
      console.error(
        "KYC EMAIL FAILED:",
        result
      );

      return {
        success: false,
        message:
          result?.message ||
          "Email sending failed",
        result,
      };
    }

    console.log(
      "KYC EMAIL SENT SUCCESSFULLY TO:",
      recipientEmail
    );

    return result;
  } catch (error) {
    console.error(
      "KYC EMAIL EXCEPTION:",
      error
    );

    return {
      success: false,
      message:
        error.message ||
        "Email sending failed",
    };
  }
};

// ======================================================
// SUB-ADMIN SUBMIT KYC
// ======================================================

const submitKYC = async (req, res) => {
  try {
    const userId = getUserId(req);

    // ==================================================
    // AUTHENTICATION
    // ==================================================

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // ==================================================
    // GET USER
    // ==================================================

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ==================================================
    // ONLY SUB-ADMIN
    // ==================================================

    if (user.role !== "subAdmin") {
      return res.status(403).json({
        success: false,
        message:
          "Only Sub-Admin can submit KYC",
      });
    }

    // ==================================================
    // EXISTING KYC
    // ==================================================

    const existingKYC =
      await SubAdminKYC.findOne({
        userId,
      });

    // ==================================================
    // APPROVED KYC CANNOT BE RESUBMITTED
    // ==================================================

    if (
      existingKYC &&
      existingKYC.status === "approved"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Your KYC is already approved",
      });
    }

    // ==================================================
    // TEXT DATA
    // ==================================================

    const {
      firstName,
      lastName,
      phone,
      dateOfBirth,
      address,
      city,
      state,
      pincode,

      idType,
      idNumber,
      panNumber,

      accountHolderName,
      bankName,
      accountNumber,
      ifscCode,
      branchName,
    } = req.body;

    // ==================================================
    // UPLOADED DOCUMENTS
    // ==================================================

    const newIdDocument =
      getUploadedFilePath(
        req,
        "idDocument"
      );

    const newAddressProof =
      getUploadedFilePath(
        req,
        "addressProof"
      );

    // ==================================================
    // REQUIRED TEXT VALIDATION
    // ==================================================

    if (
      !firstName ||
      !lastName ||
      !phone ||
      !dateOfBirth ||
      !address ||
      !city ||
      !state ||
      !pincode ||
      !idType ||
      !idNumber ||
      !panNumber ||
      !accountHolderName ||
      !bankName ||
      !accountNumber ||
      !ifscCode ||
      !branchName
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All required KYC and bank details are required",
      });
    }

    // ==================================================
    // DOCUMENT PATHS
    // ==================================================

    const idDocument =
      newIdDocument ||
      existingKYC?.idDocument ||
      "";

    const addressProof =
      newAddressProof ||
      existingKYC?.addressProof ||
      "";

    // ==================================================
    // REQUIRED DOCUMENT VALIDATION
    // ==================================================

    if (!idDocument) {
      return res.status(400).json({
        success: false,
        message:
          "ID document is required",
      });
    }

    if (!addressProof) {
      return res.status(400).json({
        success: false,
        message:
          "Address proof is required",
      });
    }

    // ==================================================
    // CREATE / UPDATE KYC
    // ==================================================

    let kyc;

    if (existingKYC) {
      existingKYC.firstName =
        firstName;

      existingKYC.lastName =
        lastName;

      existingKYC.phone =
        phone;

      existingKYC.dateOfBirth =
        dateOfBirth;

      existingKYC.address =
        address;

      existingKYC.city =
        city;

      existingKYC.state =
        state;

      existingKYC.pincode =
        pincode;

      existingKYC.idType =
        idType;

      existingKYC.idNumber =
        idNumber;

      existingKYC.panNumber =
        panNumber;

      existingKYC.idDocument =
        idDocument;

      existingKYC.addressProof =
        addressProof;

      existingKYC.accountHolderName =
        accountHolderName;

      existingKYC.bankName =
        bankName;

      existingKYC.accountNumber =
        accountNumber;

      existingKYC.ifscCode =
        ifscCode;

      existingKYC.branchName =
        branchName;

      // Resubmission becomes pending
      existingKYC.status =
        "pending";

      existingKYC.rejectionReason =
        "";

      existingKYC.reviewedBy =
        null;

      existingKYC.reviewedAt =
        null;

      kyc =
        await existingKYC.save();
    } else {
      kyc =
        await SubAdminKYC.create({
          userId,

          firstName,
          lastName,
          phone,
          dateOfBirth,
          address,
          city,
          state,
          pincode,

          idType,
          idNumber,
          panNumber,

          idDocument,
          addressProof,

          accountHolderName,
          bankName,
          accountNumber,
          ifscCode,
          branchName,

          status: "pending",
        });
    }

    // ==================================================
    // IMPORTANT
    // REFRESH USER FROM DATABASE
    // ==================================================

    const latestUser =
      await User.findById(userId).select(
        "firstName lastName email role"
      );

    if (!latestUser) {
      console.error(
        "KYC EMAIL ERROR: Sub-Admin not found after KYC save"
      );
    } else {
      console.log(
        "=========================================="
      );
      console.log(
        "KYC SUBMISSION COMPLETED"
      );
      console.log(
        "KYC ID:",
        kyc._id.toString()
      );
      console.log(
        "Sub-Admin Email:",
        latestUser.email
      );
      console.log(
        "Sub-Admin Role:",
        latestUser.role
      );
      console.log(
        "=========================================="
      );
    }

    // ==================================================
    // NOTIFY SUPER ADMIN
    // ==================================================

    try {
      const adminResult =
        await notifyAdmins({
          subject:
            "Modern Real Estate - New Sub-Admin KYC Request",

          message: `
A Sub-Admin has submitted a KYC verification request.

Sub-Admin:
${latestUser?.firstName || user.firstName || ""} ${
            latestUser?.lastName ||
            user.lastName ||
            ""
          }

Email:
${latestUser?.email || user.email || "N/A"}

KYC ID:
${kyc._id}

Status:
Pending

Please login to the Super Admin Panel and review the submitted KYC.
`,

          type:
            "subadmin-kyc-submitted",

          userId:
            userId.toString(),
        });

      console.log(
        "SUPER ADMIN KYC EMAIL RESULT:",
        adminResult
      );
    } catch (notificationError) {
      console.error(
        "SUB-ADMIN KYC ADMIN NOTIFICATION ERROR:",
        notificationError
      );
    }

    // ==================================================
    // NOTIFY SUB-ADMIN
    // KYC SUBMISSION CONFIRMATION
    // ==================================================

    let subAdminEmailResult =
      null;

    if (latestUser) {
      subAdminEmailResult =
        await sendUserEmail({
          user: latestUser,

          subject:
            "Modern Real Estate - KYC Request Submitted Successfully",

          message: `Hello ${
            latestUser.firstName ||
            "Sub-Admin"
          } ${
            latestUser.lastName ||
            ""
          },

Your KYC verification request has been submitted successfully.

Your KYC request has been successfully sent to the Super Admin for review.

KYC ID:
${kyc._id}

Current Status:
Pending

The Super Admin will review your submitted KYC details and documents.

You will receive another email after the review informing you whether your KYC request has been approved or rejected.

Thank you,
Modern Real Estate`,

          type:
            "subadmin-kyc-submitted-confirmation",

          userId:
            userId.toString(),
        });
    }

    // ==================================================
    // FINAL RESPONSE
    // ==================================================

    return res.status(201).json({
      success: true,

      message:
        "KYC submitted successfully. Waiting for Super Admin approval.",

      data: kyc,

      emailNotification: {
        sent:
          subAdminEmailResult?.success === true,
        message:
          subAdminEmailResult?.message ||
          "Email notification processed",
      },
    });
  } catch (error) {
    console.error(
      "SUB-ADMIN KYC SUBMIT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to submit KYC",
      error: error.message,
    });
  }
};

// ======================================================
// GET MY KYC
// ======================================================

const getMyKYC = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    const kyc =
      await SubAdminKYC.findOne({
        userId,
      });

    return res.status(200).json({
      success: true,
      data: kyc || null,
    });
  } catch (error) {
    console.error(
      "GET MY KYC ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch KYC",
      error: error.message,
    });
  }
};

// ======================================================
// SUPER ADMIN - GET ALL KYC
// ======================================================

const getAllKYC = async (req, res) => {
  try {
    const kycs =
      await SubAdminKYC.find()
        .populate(
          "userId",
          "firstName lastName email role"
        )
        .populate(
          "reviewedBy",
          "firstName lastName email"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: kycs.length,
      data: kycs,
    });
  } catch (error) {
    console.error(
      "GET ALL KYC ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch KYC requests",
      error: error.message,
    });
  }
};

// ======================================================
// SUPER ADMIN - GET PENDING KYC
// ======================================================

const getPendingKYC = async (
  req,
  res
) => {
  try {
    const kycs =
      await SubAdminKYC.find({
        status: "pending",
      })
        .populate(
          "userId",
          "firstName lastName email role"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: kycs.length,
      data: kycs,
    });
  } catch (error) {
    console.error(
      "GET PENDING KYC ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch pending KYC requests",
      error: error.message,
    });
  }
};

// ======================================================
// SUPER ADMIN - APPROVE KYC
// ======================================================

const approveKYC = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const adminId =
      getUserId(req);

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    const kyc =
      await SubAdminKYC.findById(id);

    if (!kyc) {
      return res.status(404).json({
        success: false,
        message:
          "KYC request not found",
      });
    }

    // ==================================================
    // APPROVE
    // ==================================================

    kyc.status =
      "approved";

    kyc.rejectionReason =
      "";

    kyc.reviewedBy =
      adminId;

    kyc.reviewedAt =
      new Date();

    await kyc.save();

    // ==================================================
    // GET SUB-ADMIN
    // ==================================================

    const subAdmin =
      await User.findById(
        kyc.userId
      ).select(
        "firstName lastName email role"
      );

    // ==================================================
    // NOTIFY ALL ADMINS
    // ==================================================

    try {
      await notifyAdmins({
        subject:
          "Modern Real Estate - Sub-Admin KYC Approved",

        message: `
A Sub-Admin KYC verification request has been approved.

Sub-Admin:
${
  subAdmin
    ? `${subAdmin.firstName} ${subAdmin.lastName}`
    : "N/A"
}

Email:
${subAdmin?.email || "N/A"}

KYC ID:
${kyc._id}

Status:
Approved

This sub-admin can now access approved sub-admin features.
`,

        type:
          "subadmin-kyc-approved",

        userId:
          kyc.userId.toString(),
      });
    } catch (notificationError) {
      console.error(
        "KYC APPROVAL ADMIN NOTIFICATION ERROR:",
        notificationError
      );
    }

    // ==================================================
    // NOTIFY SUB-ADMIN - APPROVED
    // ==================================================

    if (subAdmin) {
      await sendUserEmail({
        user: subAdmin,

        subject:
          "Modern Real Estate - KYC Approved",

        message: `Hello ${
          subAdmin.firstName ||
          "Sub-Admin"
        } ${
          subAdmin.lastName ||
          ""
        },

Congratulations!

Your Sub-Admin KYC verification has been approved by the Super Admin.

KYC ID:
${kyc._id}

Status:
Approved

You can now access the approved Sub-Admin features and manage properties according to your assigned permissions.

Thank you,
Modern Real Estate`,

        type:
          "subadmin-kyc-approved",

        userId:
          subAdmin._id.toString(),
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "KYC approved successfully",
      data: kyc,
    });
  } catch (error) {
    console.error(
      "APPROVE KYC ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to approve KYC",
      error: error.message,
    });
  }
};

// ======================================================
// SUPER ADMIN - REJECT KYC
// ======================================================

const rejectKYC = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const {
      rejectionReason,
    } = req.body;

    const adminId =
      getUserId(req);

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    if (
      !rejectionReason ||
      !rejectionReason.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Rejection reason is required",
      });
    }

    const kyc =
      await SubAdminKYC.findById(id);

    if (!kyc) {
      return res.status(404).json({
        success: false,
        message:
          "KYC request not found",
      });
    }

    // ==================================================
    // REJECT
    // ==================================================

    kyc.status =
      "rejected";

    kyc.rejectionReason =
      rejectionReason.trim();

    kyc.reviewedBy =
      adminId;

    kyc.reviewedAt =
      new Date();

    await kyc.save();

    // ==================================================
    // GET SUB-ADMIN
    // ==================================================

    const subAdmin =
      await User.findById(
        kyc.userId
      ).select(
        "firstName lastName email role"
      );

    // ==================================================
    // NOTIFY ALL ADMINS
    // ==================================================

    try {
      await notifyAdmins({
        subject:
          "Modern Real Estate - Sub-Admin KYC Rejected",

        message: `
A Sub-Admin KYC verification request has been rejected.

Sub-Admin:
${
  subAdmin
    ? `${subAdmin.firstName} ${subAdmin.lastName}`
    : "N/A"
}

Email:
${subAdmin?.email || "N/A"}

KYC ID:
${kyc._id}

Status:
Rejected

Rejection Reason:
${kyc.rejectionReason}
`,

        type:
          "subadmin-kyc-rejected",

        userId:
          kyc.userId.toString(),
      });
    } catch (notificationError) {
      console.error(
        "KYC REJECTION ADMIN NOTIFICATION ERROR:",
        notificationError
      );
    }

    // ==================================================
    // NOTIFY SUB-ADMIN - REJECTED
    // ==================================================

    if (subAdmin) {
      await sendUserEmail({
        user: subAdmin,

        subject:
          "Modern Real Estate - KYC Rejected",

        message: `Hello ${
          subAdmin.firstName ||
          "Sub-Admin"
        } ${
          subAdmin.lastName ||
          ""
        },

Your Sub-Admin KYC verification request has been rejected by the Super Admin.

KYC ID:
${kyc._id}

Status:
Rejected

Rejection Reason:
${kyc.rejectionReason}

Please review the rejection reason, update your KYC details and submit the verification request again.

Thank you,
Modern Real Estate`,

        type:
          "subadmin-kyc-rejected",

        userId:
          subAdmin._id.toString(),
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "KYC rejected successfully",
      data: kyc,
    });
  } catch (error) {
    console.error(
      "REJECT KYC ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to reject KYC",
      error: error.message,
    });
  }
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  submitKYC,
  getMyKYC,
  getAllKYC,
  getPendingKYC,
  approveKYC,
  rejectKYC,
};