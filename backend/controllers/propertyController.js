


// const Property = require("../models/Property");
// const User = require("../models/userModel");
// const fs = require("fs");
// const path = require("path");

// const {
//   notifyUser,
//   notifyAdmins,
//   notifyPreviousBuyersByOwner,
//   notifyPreviousBuyersOfProperty,
// } = require("../services/notificationService");

// // ======================================================
// // HELPER — GET AUTHENTICATED USER ID
// // ======================================================

// const getUserId = (req) => {
//   return (
//     req.user?.userId ||
//     req.user?._id ||
//     req.user?.id
//   );
// };

// // ======================================================
// // HELPER — CHECK SUB-ADMIN KYC
// // ======================================================

// const checkSubAdminKYC = async (req) => {
//   if (req.user?.role !== "subAdmin") {
//     return {
//       allowed: true,
//     };
//   }

//   const userId = getUserId(req);

//   if (!userId) {
//     return {
//       allowed: false,
//       status: 401,
//       message: "Authenticated user ID not found",
//     };
//   }

//   const SubAdminKYC = require("../models/SubAdminKYC");

//   const kyc = await SubAdminKYC.findOne({
//     userId,
//   }).select("status");

//   if (!kyc || kyc.status !== "approved") {
//     return {
//       allowed: false,
//       status: 403,
//       message:
//         "KYC verification is required before managing properties",
//     };
//   }

//   return {
//     allowed: true,
//   };
// };

// // ======================================================
// // HELPER — CHECK PROPERTY OWNERSHIP
// // ======================================================

// const checkPropertyOwnership = (req, property) => {
//   if (req.user?.role !== "subAdmin") {
//     return true;
//   }

//   const userId = getUserId(req);

//   if (!userId || !property.createdBy) {
//     return false;
//   }

//   return (
//     property.createdBy.toString() ===
//     userId.toString()
//   );
// };

// // ======================================================
// // DELETE IMAGE FILE
// // ======================================================

// const deleteImageFile = (imagePath) => {
//   if (!imagePath) return;

//   try {
//     const cleanPath =
//       imagePath.replace(/^\/+/, "");

//     const fullPath = path.join(
//       __dirname,
//       "..",
//       cleanPath
//     );

//     if (fs.existsSync(fullPath)) {
//       fs.unlinkSync(fullPath);
//     }
//   } catch (error) {
//     console.log(
//       "Image delete error:",
//       error.message
//     );
//   }
// };

// // ======================================================
// // EMAIL → ALL REGISTERED CUSTOMERS
// // NEW PROPERTY
// // ======================================================

// const notifyAllCustomersAboutNewProperty = async (
//   property
// ) => {
//   try {
//     const customers = await User.find({
//       role: "customer",
//       email: {
//         $exists: true,
//         $ne: "",
//       },
//     }).select(
//       "_id firstName lastName email"
//     );

//     if (!customers.length) {
//       console.log(
//         "No registered customers found for new property email."
//       );

//       return {
//         success: true,
//         message:
//           "No registered customers found",
//         results: [],
//       };
//     }

//     const results = [];

//     for (const customer of customers) {
//       try {
//         const customerName =
//           [
//             customer.firstName,
//             customer.lastName,
//           ]
//             .filter(Boolean)
//             .join(" ") || "Customer";

//         const result = await notifyUser({
//           email: customer.email,

//           role: "customer",

//           subject:
//             "Modern Real Estate - New Property Available",

//           message: `Hello ${customerName},

// A new property has been added to Modern Real Estate.

// Property:
// ${property.title}

// Category:
// ${property.category}

// Price:
// ${property.price}

// Property ID:
// ${property._id}

// You can visit Modern Real Estate to view this new property.

// Thank you,
// Modern Real Estate`,

//           type:
//             "property_created_for_customer",

//           propertyId:
//             property._id.toString(),

//           userId:
//             customer._id.toString(),
//         });

//         results.push({
//           email: customer.email,
//           success:
//             result?.success === true,
//         });
//       } catch (customerEmailError) {
//         console.error(
//           `CUSTOMER PROPERTY EMAIL ERROR (${customer.email}):`,
//           customerEmailError
//         );

//         results.push({
//           email: customer.email,
//           success: false,
//           error:
//             customerEmailError.message ||
//             "Customer email failed",
//         });
//       }
//     }

//     return {
//       success: true,
//       results,
//     };
//   } catch (error) {
//     console.error(
//       "NOTIFY ALL CUSTOMERS ABOUT NEW PROPERTY ERROR:",
//       error
//     );

//     return {
//       success: false,
//       message:
//         error.message ||
//         "Failed to notify customers about new property",
//     };
//   }
// };

// // ======================================================
// // EMAIL → ALL REGISTERED CUSTOMERS
// // UPDATED PROPERTY
// // ======================================================

// const notifyAllCustomersAboutUpdatedProperty =
//   async (property) => {
//     try {
//       const customers = await User.find({
//         role: "customer",
//         email: {
//           $exists: true,
//           $ne: "",
//         },
//       }).select(
//         "_id firstName lastName email"
//       );

//       if (!customers.length) {
//         console.log(
//           "No registered customers found for updated property email."
//         );

//         return {
//           success: true,
//           message:
//             "No registered customers found",
//           results: [],
//         };
//       }

//       const results = [];

//       for (const customer of customers) {
//         try {
//           const customerName =
//             [
//               customer.firstName,
//               customer.lastName,
//             ]
//               .filter(Boolean)
//               .join(" ") || "Customer";

//           const result = await notifyUser({
//             email: customer.email,

//             role: "customer",

//             subject:
//               "Modern Real Estate - Property Updated",

//             message: `Hello ${customerName},

// A property has been updated on Modern Real Estate.

// Property:
// ${property.title}

// Category:
// ${property.category}

// Price:
// ${property.price}

// Property ID:
// ${property._id}

// Please visit Modern Real Estate to view the updated property.

// Thank you,
// Modern Real Estate`,

//             type:
//               "property_updated_for_customer",

//             propertyId:
//               property._id.toString(),

//             userId:
//               customer._id.toString(),
//           });

//           results.push({
//             email: customer.email,
//             success:
//               result?.success === true,
//           });
//         } catch (customerEmailError) {
//           console.error(
//             `CUSTOMER PROPERTY UPDATE EMAIL ERROR (${customer.email}):`,
//             customerEmailError
//           );

//           results.push({
//             email: customer.email,
//             success: false,
//             error:
//               customerEmailError.message ||
//               "Customer update email failed",
//           });
//         }
//       }

//       return {
//         success: true,
//         results,
//       };
//     } catch (error) {
//       console.error(
//         "NOTIFY ALL CUSTOMERS ABOUT UPDATED PROPERTY ERROR:",
//         error
//       );

//       return {
//         success: false,
//         message:
//           error.message ||
//           "Failed to notify customers about updated property",
//       };
//     }
//   };

// // ======================================================
// // GET ALL PROPERTIES
// // ======================================================

// const getProperties = async (req, res) => {
//   try {
//     let query = {};

//     // Sub-Admin → only own properties
//     if (req.user?.role === "subAdmin") {
//       const kyc = await checkSubAdminKYC(req);

//       if (!kyc.allowed) {
//         return res.status(
//           kyc.status || 403
//         ).json({
//           success: false,
//           message: kyc.message,
//         });
//       }

//       const userId = getUserId(req);

//       query.createdBy = userId;
//     }

//     const properties =
//       await Property.find(query)
//         .sort({
//           createdAt: -1,
//         })
//         .populate(
//           "createdBy",
//           "firstName lastName email"
//         );

//     res.status(200).json(properties);
//   } catch (error) {
//     console.error(
//       "Get properties error:",
//       error
//     );

//     res.status(500).json({
//       success: false,
//       message:
//         "Failed to fetch properties",
//       error: error.message,
//     });
//   }
// };

// // ======================================================
// // GET SINGLE PROPERTY
// // ======================================================

// const getProperty = async (req, res) => {
//   try {
//     const property =
//       await Property.findById(
//         req.params.id
//       ).populate(
//         "createdBy",
//         "firstName lastName email"
//       );

//     if (!property) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "Property not found",
//       });
//     }

//     // Sub-Admin → only own property
//     if (
//       req.user?.role === "subAdmin"
//     ) {
//       const kyc =
//         await checkSubAdminKYC(req);

//       if (!kyc.allowed) {
//         return res.status(
//           kyc.status || 403
//         ).json({
//           success: false,
//           message: kyc.message,
//         });
//       }

//       if (
//         !checkPropertyOwnership(
//           req,
//           property
//         )
//       ) {
//         return res.status(403).json({
//           success: false,
//           message:
//             "You can only access your own properties",
//         });
//       }
//     }

//     res.status(200).json(property);
//   } catch (error) {
//     console.error(
//       "Get property error:",
//       error
//     );

//     res.status(500).json({
//       success: false,
//       message:
//         "Failed to fetch property",
//       error: error.message,
//     });
//   }
// };

// // ======================================================
// // CREATE PROPERTY
// // ======================================================

// const createProperty = async (req, res) => {
//   try {
//     console.log(
//       "FILES RECEIVED:",
//       req.files
//     );

//     console.log(
//       "BODY RECEIVED:",
//       req.body
//     );

//     // ----------------------------------------------
//     // KYC CHECK FOR SUB-ADMIN
//     // ----------------------------------------------

//     const kyc =
//       await checkSubAdminKYC(req);

//     if (!kyc.allowed) {
//       return res.status(
//         kyc.status || 403
//       ).json({
//         success: false,
//         message: kyc.message,
//       });
//     }

//     // ----------------------------------------------
//     // AUTHENTICATED USER
//     // ----------------------------------------------

//     const userId = getUserId(req);

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message:
//           "Authenticated user ID not found",
//       });
//     }

//     // ----------------------------------------------
//     // MAIN IMAGE
//     // ----------------------------------------------

//     if (
//       !req.files ||
//       !req.files.mainImage ||
//       req.files.mainImage.length === 0
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Main image is required",
//       });
//     }

//     const mainImage =
//       "/uploads/" +
//       req.files.mainImage[0].filename;

//     // ----------------------------------------------
//     // SUB IMAGES
//     // ----------------------------------------------

//     const subImages =
//       req.files.subImages
//         ? req.files.subImages
//             .slice(0, 4)
//             .map(
//               (file) =>
//                 "/uploads/" +
//                 file.filename
//             )
//         : [];

//     // ----------------------------------------------
//     // SIZES
//     // ----------------------------------------------

//     let sizes = [];

//     if (req.body.sizes) {
//       sizes = req.body.sizes
//         .split(",")
//         .map(
//           (size) => size.trim()
//         )
//         .filter(Boolean);
//     }

//     // ----------------------------------------------
//     // CREATE PROPERTY
//     // ----------------------------------------------

//     const property =
//       await Property.create({
//         title:
//           req.body.title || "",

//         category:
//           req.body.category || "",

//         mainImage,

//         subImages,

//         size:
//           req.body.size || "",

//         sizes,

//         price:
//           req.body.price || "",

//         oldPrice:
//           req.body.oldPrice || "",

//         description:
//           req.body.description || "",

//         // Important:
//         // Property owner/creator
//         createdBy: userId,
//       });

//     // ==================================================
//     // EMAIL → ALL ADMINS
//     // ==================================================

//     await notifyAdmins({
//       subject:
//         "Modern Real Estate - New Property Added",

//       message:
//         `A new property has been added to Modern Real Estate.

// Property:
// ${property.title}

// Category:
// ${property.category}

// Price:
// ${property.price}

// Property ID:
// ${property._id}

// The property was created successfully.`,

//       type:
//         "property_created",

//       propertyId:
//         property._id.toString(),
//     });

//     // ==================================================
//     // EMAIL → PREVIOUS BUYERS OF SAME OWNER
//     // ==================================================

//     await notifyPreviousBuyersByOwner({
//       ownerId: userId,

//       subject:
//         "Modern Real Estate - New Property Available",

//       message:
//         `Hello,

// A new property has been added by the property owner you previously purchased from.

// Property:
// ${property.title}

// Category:
// ${property.category}

// Price:
// ${property.price}

// You can visit Modern Real Estate to view the new property.`,

//       type:
//         "property_created_for_previous_buyer",

//       propertyId:
//         property._id.toString(),
//     });

//     // ==================================================
//     // EMAIL → ALL REGISTERED CUSTOMERS
//     // ==================================================

//     try {
//       await notifyAllCustomersAboutNewProperty(
//         property
//       );
//     } catch (customerEmailError) {
//       console.error(
//         "NEW PROPERTY CUSTOMER EMAIL ERROR:",
//         customerEmailError
//       );
//     }

//     // ==================================================
//     // RESPONSE
//     // ==================================================

//     res.status(201).json({
//       success: true,

//       message:
//         "Property created successfully",

//       property,
//     });
//   } catch (error) {
//     console.error(
//       "Create property error:",
//       error
//     );

//     res.status(500).json({
//       success: false,

//       message:
//         "Failed to create property",

//       error:
//         error.message,
//     });
//   }
// };

// // ======================================================
// // UPDATE PROPERTY
// // ======================================================

// const updateProperty = async (req, res) => {
//   try {
//     console.log(
//       "UPDATE FILES:",
//       req.files
//     );

//     console.log(
//       "UPDATE BODY:",
//       req.body
//     );

//     // ----------------------------------------------
//     // KYC CHECK
//     // ----------------------------------------------

//     const kyc =
//       await checkSubAdminKYC(req);

//     if (!kyc.allowed) {
//       return res.status(
//         kyc.status || 403
//       ).json({
//         success: false,
//         message: kyc.message,
//       });
//     }

//     const property =
//       await Property.findById(
//         req.params.id
//       );

//     if (!property) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "Property not found",
//       });
//     }

//     // ----------------------------------------------
//     // OWNERSHIP CHECK
//     // ----------------------------------------------

//     if (
//       !checkPropertyOwnership(
//         req,
//         property
//       )
//     ) {
//       return res.status(403).json({
//         success: false,
//         message:
//           "You can only update your own properties",
//       });
//     }

//     // ----------------------------------------------
//     // BASIC DATA
//     // ----------------------------------------------

//     property.title =
//       req.body.title !== undefined
//         ? req.body.title
//         : property.title;

//     property.category =
//       req.body.category !== undefined
//         ? req.body.category
//         : property.category;

//     property.size =
//       req.body.size !== undefined
//         ? req.body.size
//         : property.size;

//     property.price =
//       req.body.price !== undefined
//         ? req.body.price
//         : property.price;

//     property.oldPrice =
//       req.body.oldPrice !== undefined
//         ? req.body.oldPrice
//         : property.oldPrice;

//     property.description =
//       req.body.description !== undefined
//         ? req.body.description
//         : property.description;

//     // ----------------------------------------------
//     // SIZES
//     // ----------------------------------------------

//     if (
//       req.body.sizes !== undefined
//     ) {
//       property.sizes =
//         req.body.sizes
//           .split(",")
//           .map(
//             (size) =>
//               size.trim()
//           )
//           .filter(Boolean);
//     }

//     // ----------------------------------------------
//     // NEW MAIN IMAGE
//     // ----------------------------------------------

//     if (
//       req.files &&
//       req.files.mainImage &&
//       req.files.mainImage.length > 0
//     ) {
//       const oldMainImage =
//         property.mainImage;

//       property.mainImage =
//         "/uploads/" +
//         req.files.mainImage[0]
//           .filename;

//       if (oldMainImage) {
//         deleteImageFile(
//           oldMainImage
//         );
//       }
//     }

//     // ----------------------------------------------
//     // NEW SUB IMAGES
//     // ----------------------------------------------

//     if (
//       req.files &&
//       req.files.subImages &&
//       req.files.subImages.length > 0
//     ) {
//       if (
//         property.subImages &&
//         property.subImages.length > 0
//       ) {
//         property.subImages.forEach(
//           (image) => {
//             deleteImageFile(
//               image
//             );
//           }
//         );
//       }

//       property.subImages =
//         req.files.subImages
//           .slice(0, 4)
//           .map(
//             (file) =>
//               "/uploads/" +
//               file.filename
//           );
//     }

//     // ----------------------------------------------
//     // SAVE
//     // ----------------------------------------------

//     await property.save();

//     // ==================================================
//     // EMAIL → ADMINS
//     // ==================================================

//     await notifyAdmins({
//       subject:
//         "Modern Real Estate - Property Updated",

//       message:
//         `A property has been updated.

// Property:
// ${property.title}

// Category:
// ${property.category}

// Price:
// ${property.price}

// Property ID:
// ${property._id}`,

//       type:
//         "property_updated",

//       propertyId:
//         property._id.toString(),
//     });

//     // ==================================================
//     // EMAIL → PREVIOUS BUYERS
//     // ==================================================

//     try {
//       await notifyPreviousBuyersOfProperty({
//         propertyId:
//           property._id.toString(),

//         subject:
//           "Modern Real Estate - Property Updated",

//         message:
//           `Hello,

// A property you previously purchased has been updated.

// Property:
// ${property.title}

// Category:
// ${property.category}

// Current Price:
// ${property.price}

// Please visit Modern Real Estate for the latest information.`,

//         type:
//           "purchased_property_updated",
//       });
//     } catch (buyerEmailError) {
//       console.error(
//         "PREVIOUS BUYER UPDATE EMAIL ERROR:",
//         buyerEmailError
//       );
//     }

//     // ==================================================
//     // EMAIL → ALL CUSTOMERS
//     // ==================================================

//     try {
//       await notifyAllCustomersAboutUpdatedProperty(
//         property
//       );
//     } catch (customerEmailError) {
//       console.error(
//         "UPDATED PROPERTY CUSTOMER EMAIL ERROR:",
//         customerEmailError
//       );
//     }

//     // ==================================================
//     // RESPONSE
//     // ==================================================

//     res.status(200).json({
//       success: true,

//       message:
//         "Property updated successfully",

//       property,
//     });
//   } catch (error) {
//     console.error(
//       "Update property error:",
//       error
//     );

//     res.status(500).json({
//       success: false,

//       message:
//         "Failed to update property",

//       error:
//         error.message,
//     });
//   }
// };

// // ======================================================
// // DELETE PROPERTY
// // ======================================================

// const deleteProperty = async (req, res) => {
//   try {
//     // ----------------------------------------------
//     // KYC CHECK
//     // ----------------------------------------------

//     const kyc =
//       await checkSubAdminKYC(req);

//     if (!kyc.allowed) {
//       return res.status(
//         kyc.status || 403
//       ).json({
//         success: false,
//         message: kyc.message,
//       });
//     }

//     const property =
//       await Property.findById(
//         req.params.id
//       );

//     if (!property) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "Property not found",
//       });
//     }

//     // ----------------------------------------------
//     // OWNERSHIP CHECK
//     // ----------------------------------------------

//     if (
//       !checkPropertyOwnership(
//         req,
//         property
//       )
//     ) {
//       return res.status(403).json({
//         success: false,
//         message:
//           "You can only delete your own properties",
//       });
//     }

//     // ==================================================
//     // EMAIL BEFORE DELETE
//     // ==================================================

//     await notifyAdmins({
//       subject:
//         "Modern Real Estate - Property Deleted",

//       message:
//         `A property has been deleted.

// Property:
// ${property.title}

// Category:
// ${property.category}

// Property ID:
// ${property._id}`,

//       type:
//         "property_deleted",

//       propertyId:
//         property._id.toString(),
//     });

//     try {
//       await notifyPreviousBuyersOfProperty({
//         propertyId:
//           property._id.toString(),

//         subject:
//           "Modern Real Estate - Property Removed",

//         message:
//           `Hello,

// A property related to your previous purchase has been removed from the current property listing.

// Property:
// ${property.title}

// Property ID:
// ${property._id}`,

//         type:
//           "purchased_property_deleted",
//       });
//     } catch (buyerEmailError) {
//       console.error(
//         "PREVIOUS BUYER DELETE EMAIL ERROR:",
//         buyerEmailError
//       );
//     }

//     // ----------------------------------------------
//     // DELETE MAIN IMAGE
//     // ----------------------------------------------

//     if (property.mainImage) {
//       deleteImageFile(
//         property.mainImage
//       );
//     }

//     // ----------------------------------------------
//     // DELETE SUB IMAGES
//     // ----------------------------------------------

//     if (
//       property.subImages &&
//       property.subImages.length > 0
//     ) {
//       property.subImages.forEach(
//         (image) => {
//           deleteImageFile(
//             image
//           );
//         }
//       );
//     }

//     // ----------------------------------------------
//     // DELETE PROPERTY
//     // ----------------------------------------------

//     await Property.findByIdAndDelete(
//       req.params.id
//     );

//     res.status(200).json({
//       success: true,

//       message:
//         "Property deleted successfully",
//     });
//   } catch (error) {
//     console.error(
//       "Delete property error:",
//       error
//     );

//     res.status(500).json({
//       success: false,

//       message:
//         "Failed to delete property",

//       error:
//         error.message,
//     });
//   }
// };


// // ======================================================
// // GET MY PROPERTIES — SUB-ADMIN
// // ======================================================

// const getMyProperties = async (req, res) => {
//   try {
//     const userId =
//       req.user?.userId ||
//       req.user?._id ||
//       req.user?.id;

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message:
//           "Authenticated user ID not found",
//       });
//     }

//     const properties =
//       await Property.find({
//         createdBy: userId,
//       })
//         .sort({
//           createdAt: -1,
//         })
//         .populate(
//           "createdBy",
//           "firstName lastName email"
//         );

//     return res.status(200).json({
//       success: true,
//       count: properties.length,
//       properties,
//     });
//   } catch (error) {
//     console.error(
//       "Get my properties error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Failed to fetch your properties",
//       error: error.message,
//     });
//   }
// };

// // ======================================================
// // EXPORTS
// // ======================================================

// module.exports = {
//   getProperties,
//   getMyProperties,
//   getProperty,
//   createProperty,
//   updateProperty,
//   deleteProperty,
// };




const Property = require("../models/Property");
const User = require("../models/userModel");
const fs = require("fs");
const path = require("path");

const {
  notifyUser,
  notifyAdmins,
  notifyPreviousBuyersByOwner,
  notifyPreviousBuyersOfProperty,
} = require("../services/notificationService");

// ======================================================
// HELPER — GET AUTHENTICATED USER ID
// ======================================================

const getUserId = (req) => {
  return (
    req.user?.userId ||
    req.user?._id ||
    req.user?.id
  );
};

// ======================================================
// HELPER — VALIDATE PROPERTY AVAILABILITY
// ======================================================

const validateAvailability = ({
  totalUnits,
  availableUnits,
  bookedUnits,
}) => {
  const total = Number(totalUnits);
  const available = Number(availableUnits);
  const booked = Number(bookedUnits);

  if (
    !Number.isInteger(total) ||
    !Number.isInteger(available) ||
    !Number.isInteger(booked)
  ) {
    return {
      valid: false,
      message: "Availability values must be whole numbers",
    };
  }

  if (total < 0) {
    return {
      valid: false,
      message: "Total units cannot be negative",
    };
  }

  if (available < 0) {
    return {
      valid: false,
      message: "Available units cannot be negative",
    };
  }

  if (booked < 0) {
    return {
      valid: false,
      message: "Booked units cannot be negative",
    };
  }

  if (available > total) {
    return {
      valid: false,
      message:
        "Available units cannot be greater than total units",
    };
  }

  if (booked > total) {
    return {
      valid: false,
      message:
        "Booked units cannot be greater than total units",
    };
  }

  if (available + booked !== total) {
    return {
      valid: false,
      message:
        "Available units + booked units must equal total units",
    };
  }

  return {
    valid: true,
  };
};

// ======================================================
// HELPER — CHECK SUB-ADMIN KYC
// ======================================================

const checkSubAdminKYC = async (req) => {
  if (req.user?.role !== "subAdmin") {
    return {
      allowed: true,
    };
  }

  const userId = getUserId(req);

  if (!userId) {
    return {
      allowed: false,
      status: 401,
      message: "Authenticated user ID not found",
    };
  }

  const SubAdminKYC = require("../models/SubAdminKYC");

  const kyc = await SubAdminKYC.findOne({
    userId,
  }).select("status");

  if (!kyc || kyc.status !== "approved") {
    return {
      allowed: false,
      status: 403,
      message:
        "KYC verification is required before managing properties",
    };
  }

  return {
    allowed: true,
  };
};

// ======================================================
// HELPER — CHECK PROPERTY OWNERSHIP
// ======================================================

const checkPropertyOwnership = (req, property) => {
  if (req.user?.role !== "subAdmin") {
    return true;
  }

  const userId = getUserId(req);

  if (!userId || !property.createdBy) {
    return false;
  }

  return (
    property.createdBy.toString() ===
    userId.toString()
  );
};

// ======================================================
// DELETE IMAGE FILE
// ======================================================

const deleteImageFile = (imagePath) => {
  if (!imagePath) return;

  try {
    const cleanPath =
      imagePath.replace(/^\/+/, "");

    const fullPath = path.join(
      __dirname,
      "..",
      cleanPath
    );

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error) {
    console.log(
      "Image delete error:",
      error.message
    );
  }
};

// ======================================================
// EMAIL → ALL REGISTERED CUSTOMERS
// NEW PROPERTY
// ======================================================

const notifyAllCustomersAboutNewProperty = async (
  property
) => {
  try {
    const customers = await User.find({
      role: "customer",
      email: {
        $exists: true,
        $ne: "",
      },
    }).select(
      "_id firstName lastName email"
    );

    if (!customers.length) {
      console.log(
        "No registered customers found for new property email."
      );

      return {
        success: true,
        message:
          "No registered customers found",
        results: [],
      };
    }

    const results = [];

    for (const customer of customers) {
      try {
        const customerName =
          [
            customer.firstName,
            customer.lastName,
          ]
            .filter(Boolean)
            .join(" ") || "Customer";

        const result = await notifyUser({
          email: customer.email,

          role: "customer",

          subject:
            "Modern Real Estate - New Property Available",

          message: `Hello ${customerName},

A new property has been added to Modern Real Estate.

Property:
${property.title}

Category:
${property.category}

Price:
${property.price}

Property ID:
${property._id}

You can visit Modern Real Estate to view this new property.

Thank you,
Modern Real Estate`,

          type:
            "property_created_for_customer",

          propertyId:
            property._id.toString(),

          userId:
            customer._id.toString(),
        });

        results.push({
          email: customer.email,
          success:
            result?.success === true,
        });
      } catch (customerEmailError) {
        console.error(
          `CUSTOMER PROPERTY EMAIL ERROR (${customer.email}):`,
          customerEmailError
        );

        results.push({
          email: customer.email,
          success: false,
          error:
            customerEmailError.message ||
            "Customer email failed",
        });
      }
    }

    return {
      success: true,
      results,
    };
  } catch (error) {
    console.error(
      "NOTIFY ALL CUSTOMERS ABOUT NEW PROPERTY ERROR:",
      error
    );

    return {
      success: false,
      message:
        error.message ||
        "Failed to notify customers about new property",
    };
  }
};

// ======================================================
// EMAIL → ALL REGISTERED CUSTOMERS
// UPDATED PROPERTY
// ======================================================

const notifyAllCustomersAboutUpdatedProperty =
  async (property) => {
    try {
      const customers = await User.find({
        role: "customer",
        email: {
          $exists: true,
          $ne: "",
        },
      }).select(
        "_id firstName lastName email"
      );

      if (!customers.length) {
        console.log(
          "No registered customers found for updated property email."
        );

        return {
          success: true,
          message:
            "No registered customers found",
          results: [],
        };
      }

      const results = [];

      for (const customer of customers) {
        try {
          const customerName =
            [
              customer.firstName,
              customer.lastName,
            ]
              .filter(Boolean)
              .join(" ") || "Customer";

          const result = await notifyUser({
            email: customer.email,

            role: "customer",

            subject:
              "Modern Real Estate - Property Updated",

            message: `Hello ${customerName},

A property has been updated on Modern Real Estate.

Property:
${property.title}

Category:
${property.category}

Price:
${property.price}

Property ID:
${property._id}

Please visit Modern Real Estate to view the updated property.

Thank you,
Modern Real Estate`,

            type:
              "property_updated_for_customer",

            propertyId:
              property._id.toString(),

            userId:
              customer._id.toString(),
          });

          results.push({
            email: customer.email,
            success:
              result?.success === true,
          });
        } catch (customerEmailError) {
          console.error(
            `CUSTOMER PROPERTY UPDATE EMAIL ERROR (${customer.email}):`,
            customerEmailError
          );

          results.push({
            email: customer.email,
            success: false,
            error:
              customerEmailError.message ||
              "Customer update email failed",
          });
        }
      }

      return {
        success: true,
        results,
      };
    } catch (error) {
      console.error(
        "NOTIFY ALL CUSTOMERS ABOUT UPDATED PROPERTY ERROR:",
        error
      );

      return {
        success: false,
        message:
          error.message ||
          "Failed to notify customers about updated property",
      };
    }
  };

// ======================================================
// GET ALL PROPERTIES
// ======================================================

const getProperties = async (req, res) => {
  try {
    let query = {};

    // Sub-Admin → only own properties
    if (req.user?.role === "subAdmin") {
      const kyc =
        await checkSubAdminKYC(req);

      if (!kyc.allowed) {
        return res.status(
          kyc.status || 403
        ).json({
          success: false,
          message: kyc.message,
        });
      }

      const userId = getUserId(req);

      query.createdBy = userId;
    }

    const properties =
      await Property.find(query)
        .sort({
          createdAt: -1,
        })
        .populate(
          "createdBy",
          "firstName lastName email"
        );

    res.status(200).json(properties);
  } catch (error) {
    console.error(
      "Get properties error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch properties",
      error: error.message,
    });
  }
};

// ======================================================
// GET SINGLE PROPERTY
// ======================================================

const getProperty = async (req, res) => {
  try {
    const property =
      await Property.findById(
        req.params.id
      ).populate(
        "createdBy",
        "firstName lastName email"
      );

    if (!property) {
      return res.status(404).json({
        success: false,
        message:
          "Property not found",
      });
    }

    // Sub-Admin → only own property
    if (
      req.user?.role === "subAdmin"
    ) {
      const kyc =
        await checkSubAdminKYC(req);

      if (!kyc.allowed) {
        return res.status(
          kyc.status || 403
        ).json({
          success: false,
          message: kyc.message,
        });
      }

      if (
        !checkPropertyOwnership(
          req,
          property
        )
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You can only access your own properties",
        });
      }
    }

    res.status(200).json(property);
  } catch (error) {
    console.error(
      "Get property error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch property",
      error: error.message,
    });
  }
};

// ======================================================
// CREATE PROPERTY
// ======================================================

const createProperty = async (req, res) => {
  try {
    console.log(
      "FILES RECEIVED:",
      req.files
    );

    console.log(
      "BODY RECEIVED:",
      req.body
    );

    // ----------------------------------------------
    // KYC CHECK FOR SUB-ADMIN
    // ----------------------------------------------

    const kyc =
      await checkSubAdminKYC(req);

    if (!kyc.allowed) {
      return res.status(
        kyc.status || 403
      ).json({
        success: false,
        message: kyc.message,
      });
    }

    // ----------------------------------------------
    // AUTHENTICATED USER
    // ----------------------------------------------

    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authenticated user ID not found",
      });
    }

    // ----------------------------------------------
    // MAIN IMAGE
    // ----------------------------------------------

    if (
      !req.files ||
      !req.files.mainImage ||
      req.files.mainImage.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Main image is required",
      });
    }

    const mainImage =
      "/uploads/" +
      req.files.mainImage[0].filename;

    // ----------------------------------------------
    // SUB IMAGES
    // ----------------------------------------------

    const subImages =
      req.files.subImages
        ? req.files.subImages
            .slice(0, 4)
            .map(
              (file) =>
                "/uploads/" +
                file.filename
            )
        : [];

    // ----------------------------------------------
    // SIZES
    // ----------------------------------------------

    let sizes = [];

    if (req.body.sizes) {
      sizes = req.body.sizes
        .split(",")
        .map(
          (size) => size.trim()
        )
        .filter(Boolean);
    }

    // ----------------------------------------------
    // AVAILABILITY
    // ----------------------------------------------

    const totalUnits =
      req.body.totalUnits !== undefined &&
      req.body.totalUnits !== ""
        ? Number(req.body.totalUnits)
        : 1;

    const availableUnits =
      req.body.availableUnits !== undefined &&
      req.body.availableUnits !== ""
        ? Number(req.body.availableUnits)
        : totalUnits;

    const bookedUnits =
      req.body.bookedUnits !== undefined &&
      req.body.bookedUnits !== ""
        ? Number(req.body.bookedUnits)
        : 0;

    const availabilityValidation =
      validateAvailability({
        totalUnits,
        availableUnits,
        bookedUnits,
      });

    if (!availabilityValidation.valid) {
      return res.status(400).json({
        success: false,
        message:
          availabilityValidation.message,
      });
    }

    // ----------------------------------------------
    // CREATE PROPERTY
    // ----------------------------------------------

    const property =
      await Property.create({
        title:
          req.body.title || "",

        category:
          req.body.category || "",

        mainImage,

        subImages,

        size:
          req.body.size || "",

        sizes,

        price:
          req.body.price || "",

        oldPrice:
          req.body.oldPrice || "",

        description:
          req.body.description || "",

        // ==============================
        // AVAILABILITY
        // ==============================

        totalUnits,

        availableUnits,

        bookedUnits,

        // ==============================
        // OWNER
        // ==============================

        createdBy: userId,
      });

    // ==================================================
    // EMAIL → ALL ADMINS
    // ==================================================

    await notifyAdmins({
      subject:
        "Modern Real Estate - New Property Added",

      message:
        `A new property has been added to Modern Real Estate.

Property:
${property.title}

Category:
${property.category}

Price:
${property.price}

Property ID:
${property._id}

The property was created successfully.`,

      type:
        "property_created",

      propertyId:
        property._id.toString(),
    });

    // ==================================================
    // EMAIL → PREVIOUS BUYERS OF SAME OWNER
    // ==================================================

    await notifyPreviousBuyersByOwner({
      ownerId: userId,

      subject:
        "Modern Real Estate - New Property Available",

      message:
        `Hello,

A new property has been added by the property owner you previously purchased from.

Property:
${property.title}

Category:
${property.category}

Price:
${property.price}

You can visit Modern Real Estate to view this new property.`,

      type:
        "property_created_for_previous_buyer",

      propertyId:
        property._id.toString(),
    });

    // ==================================================
    // EMAIL → ALL REGISTERED CUSTOMERS
    // ==================================================

    try {
      await notifyAllCustomersAboutNewProperty(
        property
      );
    } catch (customerEmailError) {
      console.error(
        "NEW PROPERTY CUSTOMER EMAIL ERROR:",
        customerEmailError
      );
    }

    // ==================================================
    // RESPONSE
    // ==================================================

    res.status(201).json({
      success: true,

      message:
        "Property created successfully",

      property,
    });
  } catch (error) {
    console.error(
      "Create property error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        "Failed to create property",

      error:
        error.message,
    });
  }
};

// ======================================================
// UPDATE PROPERTY
// ======================================================

const updateProperty = async (req, res) => {
  try {
    console.log(
      "UPDATE FILES:",
      req.files
    );

    console.log(
      "UPDATE BODY:",
      req.body
    );

    // ----------------------------------------------
    // KYC CHECK
    // ----------------------------------------------

    const kyc =
      await checkSubAdminKYC(req);

    if (!kyc.allowed) {
      return res.status(
        kyc.status || 403
      ).json({
        success: false,
        message: kyc.message,
      });
    }

    const property =
      await Property.findById(
        req.params.id
      );

    if (!property) {
      return res.status(404).json({
        success: false,
        message:
          "Property not found",
      });
    }

    // ----------------------------------------------
    // OWNERSHIP CHECK
    // ----------------------------------------------

    if (
      !checkPropertyOwnership(
        req,
        property
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only update your own properties",
      });
    }

    // ----------------------------------------------
    // BASIC DATA
    // ----------------------------------------------

    property.title =
      req.body.title !== undefined
        ? req.body.title
        : property.title;

    property.category =
      req.body.category !== undefined
        ? req.body.category
        : property.category;

    property.size =
      req.body.size !== undefined
        ? req.body.size
        : property.size;

    property.price =
      req.body.price !== undefined
        ? req.body.price
        : property.price;

    property.oldPrice =
      req.body.oldPrice !== undefined
        ? req.body.oldPrice
        : property.oldPrice;

    property.description =
      req.body.description !== undefined
        ? req.body.description
        : property.description;

    // ----------------------------------------------
    // AVAILABILITY
    // ----------------------------------------------

    let totalUnits =
      property.totalUnits ?? 1;

    let availableUnits =
      property.availableUnits ?? 1;

    let bookedUnits =
      property.bookedUnits ?? 0;

    if (
      req.body.totalUnits !== undefined &&
      req.body.totalUnits !== ""
    ) {
      totalUnits =
        Number(req.body.totalUnits);
    }

    if (
      req.body.availableUnits !== undefined &&
      req.body.availableUnits !== ""
    ) {
      availableUnits =
        Number(req.body.availableUnits);
    }

    if (
      req.body.bookedUnits !== undefined &&
      req.body.bookedUnits !== ""
    ) {
      bookedUnits =
        Number(req.body.bookedUnits);
    }

    const availabilityValidation =
      validateAvailability({
        totalUnits,
        availableUnits,
        bookedUnits,
      });

    if (!availabilityValidation.valid) {
      return res.status(400).json({
        success: false,
        message:
          availabilityValidation.message,
      });
    }

    property.totalUnits =
      totalUnits;

    property.availableUnits =
      availableUnits;

    property.bookedUnits =
      bookedUnits;

    // ----------------------------------------------
    // SIZES
    // ----------------------------------------------

    if (
      req.body.sizes !== undefined
    ) {
      property.sizes =
        req.body.sizes
          .split(",")
          .map(
            (size) =>
              size.trim()
          )
          .filter(Boolean);
    }

    // ----------------------------------------------
    // NEW MAIN IMAGE
    // ----------------------------------------------

    if (
      req.files &&
      req.files.mainImage &&
      req.files.mainImage.length > 0
    ) {
      const oldMainImage =
        property.mainImage;

      property.mainImage =
        "/uploads/" +
        req.files.mainImage[0]
          .filename;

      if (oldMainImage) {
        deleteImageFile(
          oldMainImage
        );
      }
    }

    // ----------------------------------------------
    // NEW SUB IMAGES
    // ----------------------------------------------

    if (
      req.files &&
      req.files.subImages &&
      req.files.subImages.length > 0
    ) {
      if (
        property.subImages &&
        property.subImages.length > 0
      ) {
        property.subImages.forEach(
          (image) => {
            deleteImageFile(
              image
            );
          }
        );
      }

      property.subImages =
        req.files.subImages
          .slice(0, 4)
          .map(
            (file) =>
              "/uploads/" +
              file.filename
          );
    }

    // ----------------------------------------------
    // SAVE
    // ----------------------------------------------

    await property.save();

    // ==================================================
    // EMAIL → ADMINS
    // ==================================================

    await notifyAdmins({
      subject:
        "Modern Real Estate - Property Updated",

      message:
        `A property has been updated.

Property:
${property.title}

Category:
${property.category}

Price:
${property.price}

Property ID:
${property._id}`,

      type:
        "property_updated",

      propertyId:
        property._id.toString(),
    });

    // ==================================================
    // EMAIL → PREVIOUS BUYERS
    // ==================================================

    try {
      await notifyPreviousBuyersOfProperty({
        propertyId:
          property._id.toString(),

        subject:
          "Modern Real Estate - Property Updated",

        message:
          `Hello,

A property you previously purchased has been updated.

Property:
${property.title}

Category:
${property.category}

Current Price:
${property.price}

Please visit Modern Real Estate for the latest information.`,

        type:
          "purchased_property_updated",
      });
    } catch (buyerEmailError) {
      console.error(
        "PREVIOUS BUYER UPDATE EMAIL ERROR:",
        buyerEmailError
      );
    }

    // ==================================================
    // EMAIL → ALL CUSTOMERS
    // ==================================================

    try {
      await notifyAllCustomersAboutUpdatedProperty(
        property
      );
    } catch (customerEmailError) {
      console.error(
        "UPDATED PROPERTY CUSTOMER EMAIL ERROR:",
        customerEmailError
      );
    }

    // ==================================================
    // RESPONSE
    // ==================================================

    res.status(200).json({
      success: true,

      message:
        "Property updated successfully",

      property,
    });
  } catch (error) {
    console.error(
      "Update property error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        "Failed to update property",

      error:
        error.message,
    });
  }
};

// ======================================================
// DELETE PROPERTY
// ======================================================

const deleteProperty = async (req, res) => {
  try {
    // ----------------------------------------------
    // KYC CHECK
    // ----------------------------------------------

    const kyc =
      await checkSubAdminKYC(req);

    if (!kyc.allowed) {
      return res.status(
        kyc.status || 403
      ).json({
        success: false,
        message: kyc.message,
      });
    }

    const property =
      await Property.findById(
        req.params.id
      );

    if (!property) {
      return res.status(404).json({
        success: false,
        message:
          "Property not found",
      });
    }

    // ----------------------------------------------
    // OWNERSHIP CHECK
    // ----------------------------------------------

    if (
      !checkPropertyOwnership(
        req,
        property
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only delete your own properties",
      });
    }

    // ==================================================
    // EMAIL BEFORE DELETE
    // ==================================================

    await notifyAdmins({
      subject:
        "Modern Real Estate - Property Deleted",

      message:
        `A property has been deleted.

Property:
${property.title}

Category:
${property.category}

Property ID:
${property._id}`,

      type:
        "property_deleted",

      propertyId:
        property._id.toString(),
    });

    try {
      await notifyPreviousBuyersOfProperty({
        propertyId:
          property._id.toString(),

        subject:
          "Modern Real Estate - Property Removed",

        message:
          `Hello,

A property related to your previous purchase has been removed from the current property listing.

Property:
${property.title}

Property ID:
${property._id}`,

        type:
          "purchased_property_deleted",
      });
    } catch (buyerEmailError) {
      console.error(
        "PREVIOUS BUYER DELETE EMAIL ERROR:",
        buyerEmailError
      );
    }

    // ----------------------------------------------
    // DELETE MAIN IMAGE
    // ----------------------------------------------

    if (property.mainImage) {
      deleteImageFile(
        property.mainImage
      );
    }

    // ----------------------------------------------
    // DELETE SUB IMAGES
    // ----------------------------------------------

    if (
      property.subImages &&
      property.subImages.length > 0
    ) {
      property.subImages.forEach(
        (image) => {
          deleteImageFile(
            image
          );
        }
      );
    }

    // ----------------------------------------------
    // DELETE PROPERTY
    // ----------------------------------------------

    await Property.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,

      message:
        "Property deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete property error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        "Failed to delete property",

      error:
        error.message,
    });
  }
};

// ======================================================
// GET MY PROPERTIES — SUB-ADMIN
// ======================================================

const getMyProperties = async (req, res) => {
  try {
    const userId =
      req.user?.userId ||
      req.user?._id ||
      req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authenticated user ID not found",
      });
    }

    const properties =
      await Property.find({
        createdBy: userId,
      })
        .sort({
          createdAt: -1,
        })
        .populate(
          "createdBy",
          "firstName lastName email"
        );

    return res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    console.error(
      "Get my properties error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch your properties",
      error: error.message,
    });
  }
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  getProperties,
  getMyProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
};