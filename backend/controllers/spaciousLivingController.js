



// const SpaciousLiving = require("../models/SpaciousLiving");

// const {
//   notifyAdmins,
//   notifyAllCustomers,
// } = require("../services/notificationService");

// // =========================================================
// // GET USER ID
// // =========================================================

// const getUserId = (req) => {
//   return (
//     req.user?.userId ||
//     req.user?._id ||
//     req.user?.id ||
//     null
//   );
// };

// // =========================================================
// // GET PUBLIC SPACIOUS LIVING
// // =========================================================

// const getSpaciousLiving = async (
//   req,
//   res
// ) => {
//   try {
//     const data =
//       await SpaciousLiving.findOne();

//     return res.json({
//       success: true,
//       data: data || null,
//     });
//   } catch (error) {
//     console.error(
//       "GET SPACIOUS LIVING ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Failed to fetch Spacious Living",
//     });
//   }
// };

// // =========================================================
// // GET MY SPACIOUS LIVING
// // =========================================================
// // ADMIN:
// //   Gets all properties.
// //
// // SUBADMIN:
// //   Gets ONLY properties whose createdBy matches
// //   the logged-in SubAdmin.
// //
// // =========================================================

// const getMySpaciousLiving = async (
//   req,
//   res
// ) => {
//   try {
//     const userId =
//       getUserId(req);

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message:
//           "User ID not found",
//       });
//     }

//     const data =
//       await SpaciousLiving.findOne();

//     // -------------------------------------------------------
//     // NO SPACIOUS LIVING DOCUMENT
//     // -------------------------------------------------------

//     if (!data) {
//       return res.json({
//         success: true,
//         data: null,
//       });
//     }

//     // =======================================================
//     // ADMIN
//     // =======================================================

//     if (
//       req.user?.role === "admin"
//     ) {
//       return res.json({
//         success: true,
//         data,
//       });
//     }

//     // =======================================================
//     // SUBADMIN
//     // =======================================================

//     if (
//       req.user?.role === "subAdmin"
//     ) {
//       const myProperties =
//         data.sliderProperties.filter(
//           (property) => {
//             // No createdBy = NOT owned by SubAdmin
//             if (
//               !property.createdBy
//             ) {
//               return false;
//             }

//             return (
//               property.createdBy.toString() ===
//               userId.toString()
//             );
//           }
//         );

//       // IMPORTANT:
//       // Never return the original complete
//       // sliderProperties array to SubAdmin.

//       const responseData =
//         data.toObject();

//       responseData.sliderProperties =
//         myProperties;

//       return res.json({
//         success: true,
//         data: responseData,
//       });
//     }

//     // =======================================================
//     // OTHER ROLES
//     // =======================================================

//     return res.status(403).json({
//       success: false,
//       message:
//         "Access denied",
//     });
//   } catch (error) {
//     console.error(
//       "GET MY SPACIOUS LIVING ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Failed to fetch your Spacious Living",
//     });
//   }
// };

// // =========================================================
// // SAVE SPACIOUS LIVING
// // =========================================================
// // ADMIN:
// //   Can create/update all properties.
// //
// // SUBADMIN:
// //   Can create new properties.
// //   Can update ONLY own properties.
// //   Cannot update Admin properties.
// //   Cannot update another SubAdmin property.
// // =========================================================

// const saveSpaciousLiving = async (
//   req,
//   res
// ) => {
//   try {
//     // =======================================================
//     // USER
//     // =======================================================

//     const userId =
//       getUserId(req);

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message:
//           "User ID not found",
//       });
//     }

//     // =======================================================
//     // PARSE CONTENT
//     // =======================================================

//     let content = {};

//     try {
//       content = req.body.content
//         ? JSON.parse(
//             req.body.content
//           )
//         : {};
//     } catch (error) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Invalid content data",
//       });
//     }

//     // =======================================================
//     // FIND DOCUMENT
//     // =======================================================

//     let data =
//       await SpaciousLiving.findOne();

//     const isNewSection =
//       !data;

//     // =======================================================
//     // CREATE SECTION
//     // =======================================================

//     if (!data) {
//       data =
//         new SpaciousLiving();

//       data.createdBy =
//         userId;
//     }

//     // =======================================================
//     // INCOMING PROPERTIES
//     // =======================================================

//     const incomingProperties =
//       Array.isArray(
//         content.sliderProperties
//       )
//         ? content.sliderProperties
//         : [];

//     // =======================================================
//     // ADMIN
//     // =======================================================

//     if (
//       req.user?.role === "admin"
//     ) {
//       // -----------------------------------------------------
//       // ADMIN CAN MANAGE ALL PROPERTIES
//       // -----------------------------------------------------

//       const existingProperties =
//         data.sliderProperties || [];

//       const finalProperties =
//         [];

//       for (
//         let i = 0;
//         i <
//         incomingProperties.length;
//         i++
//       ) {
//         const incoming =
//           incomingProperties[i];

//         let existing =
//           null;

//         // ---------------------------------------------------
//         // FIND EXISTING PROPERTY
//         // ---------------------------------------------------

//         if (
//           incoming._id
//         ) {
//           existing =
//             existingProperties.find(
//               (property) =>
//                 property._id
//                   ?.toString() ===
//                 incoming._id.toString()
//             );
//         }

//         // ---------------------------------------------------
//         // EXISTING PROPERTY
//         // ---------------------------------------------------

//         if (existing) {
//           const existingObject =
//             typeof existing.toObject ===
//             "function"
//               ? existing.toObject()
//               : existing;

//           finalProperties.push({
//             ...existingObject,

//             ...incoming,

//             // NEVER remove existing owner
//             createdBy:
//               existing.createdBy ||
//               userId,
//           });
//         }

//         // ---------------------------------------------------
//         // NEW PROPERTY
//         // ---------------------------------------------------

//         else {
//           finalProperties.push({
//             ...incoming,

//             createdBy:
//               userId,
//           });
//         }
//       }

//       data.sliderProperties =
//         finalProperties;
//     }

//     // =======================================================
//     // SUBADMIN
//     // =======================================================

//     if (
//       req.user?.role === "subAdmin"
//     ) {
//       const existingProperties =
//         data.sliderProperties || [];

//       // -----------------------------------------------------
//       // IMPORTANT:
//       // First collect ONLY this SubAdmin's properties.
//       // -----------------------------------------------------

//       const myExistingProperties =
//         existingProperties.filter(
//           (property) => {
//             return (
//               property.createdBy &&
//               property.createdBy
//                 .toString() ===
//                 userId.toString()
//             );
//           }
//         );

//       // -----------------------------------------------------
//       // KEEP ADMIN + OTHER SUBADMIN PROPERTIES UNTOUCHED
//       // -----------------------------------------------------

//       const otherProperties =
//         existingProperties.filter(
//           (property) => {
//             if (
//               !property.createdBy
//             ) {
//               return true;
//             }

//             return (
//               property.createdBy
//                 .toString() !==
//               userId.toString()
//             );
//           }
//         );

//       // -----------------------------------------------------
//       // BUILD ONLY SUBADMIN OWN PROPERTIES
//       // -----------------------------------------------------

//       const updatedMyProperties =
//         [];

//       for (
//         let i = 0;
//         i <
//         incomingProperties.length;
//         i++
//       ) {
//         const incoming =
//           incomingProperties[i];

//         // =================================================
//         // EXISTING PROPERTY
//         // =================================================

//         if (
//           incoming._id
//         ) {
//           const existing =
//             myExistingProperties.find(
//               (property) =>
//                 property._id
//                   ?.toString() ===
//                 incoming._id.toString()
//             );

//           // -----------------------------------------------
//           // PROPERTY NOT OWNED BY THIS SUBADMIN
//           // -----------------------------------------------

//           if (!existing) {
//             // IMPORTANT:
//             // If ID belongs to Admin or another SubAdmin,
//             // completely ignore it.

//             continue;
//           }

//           // -----------------------------------------------
//           // UPDATE OWN PROPERTY
//           // -----------------------------------------------

//           const existingObject =
//             typeof existing.toObject ===
//             "function"
//               ? existing.toObject()
//               : existing;

//           updatedMyProperties.push({
//             ...existingObject,

//             ...incoming,

//             // IMPORTANT:
//             // Ownership can NEVER change.
//             createdBy:
//               existing.createdBy,
//           });

//           continue;
//         }

//         // =================================================
//         // NEW PROPERTY
//         // =================================================

//         updatedMyProperties.push({
//           ...incoming,

//           // IMPORTANT:
//           // New property belongs to logged-in SubAdmin.
//           createdBy:
//             userId,
//         });
//       }

//       // =====================================================
//       // FINAL DATA
//       // =====================================================
//       //
//       // Other people's properties remain untouched.
//       // Only this SubAdmin's properties are replaced.
//       //
//       // =====================================================

//       data.sliderProperties = [
//         ...otherProperties,
//         ...updatedMyProperties,
//       ];
//     }

//     // =======================================================
//     // SLIDER IMAGES
//     // =======================================================
//     //
//     // IMPORTANT:
//     // Only modify image files belonging to properties
//     // that the current user is allowed to manage.
//     //
//     // =======================================================

//     if (
//       req.files &&
//       req.files.length > 0
//     ) {
//       for (
//         let i = 0;
//         i <
//         incomingProperties.length;
//         i++
//       ) {
//         const incoming =
//           incomingProperties[i];

//         let targetProperty =
//           null;

//         // ---------------------------------------------------
//         // FIND TARGET PROPERTY
//         // ---------------------------------------------------

//         if (
//           incoming._id
//         ) {
//           targetProperty =
//             data.sliderProperties.find(
//               (property) =>
//                 property._id
//                   ?.toString() ===
//                 incoming._id.toString()
//             );
//         } else {
//           // New property:
//           // Find by the same position/title/category
//           // among properties owned by current user.

//           targetProperty =
//             data.sliderProperties.find(
//               (property) => {
//                 if (
//                   req.user?.role ===
//                   "subAdmin"
//                 ) {
//                   if (
//                     !property.createdBy ||
//                     property.createdBy
//                       .toString() !==
//                       userId.toString()
//                   ) {
//                     return false;
//                   }
//                 }

//                 return (
//                   property.title ===
//                     incoming.title &&
//                   property.category ===
//                     incoming.category
//                 );
//               }
//             );
//         }

//         // ---------------------------------------------------
//         // PROPERTY NOT FOUND
//         // ---------------------------------------------------

//         if (
//           !targetProperty
//         ) {
//           continue;
//         }

//         // ---------------------------------------------------
//         // SUBADMIN OWNERSHIP SECURITY
//         // ---------------------------------------------------

//         if (
//           req.user?.role ===
//           "subAdmin"
//         ) {
//           if (
//             !targetProperty.createdBy ||
//             targetProperty.createdBy
//               .toString() !==
//               userId.toString()
//           ) {
//             continue;
//           }
//         }

//         // ===================================================
//         // MAIN IMAGE
//         // ===================================================

//         const mainFile =
//           req.files.find(
//             (file) =>
//               file.fieldname ===
//               `sliderMainImage_${i}`
//           );

//         if (mainFile) {
//           targetProperty.mainImage =
//             `/uploads/${mainFile.filename}`;
//         }

//         // ===================================================
//         // SUB IMAGES
//         // ===================================================

//         const subFiles =
//           req.files.filter(
//             (file) =>
//               file.fieldname ===
//               `sliderSubImages_${i}`
//           );

//         if (
//           subFiles.length > 0
//         ) {
//           targetProperty.subImages =
//             [
//               ...(targetProperty.subImages ||
//                 []),

//               ...subFiles.map(
//                 (file) =>
//                   `/uploads/${file.filename}`
//               ),
//             ].slice(0, 4);
//         }
//       }
//     }

//     // =======================================================
//     // SAVE
//     // =======================================================

//     const savedData =
//       await data.save();

//     // =======================================================
//     // NOTIFICATION
//     // =======================================================

//     const hasNewProperty =
//       incomingProperties.some(
//         (property) =>
//           !property._id
//       );

//     // =======================================================
//     // ADMIN EMAIL
//     // =======================================================

//     try {
//       await notifyAdmins({
//         subject:
//           hasNewProperty
//             ? "Modern Real Estate - New Spacious Living Property Added"
//             : "Modern Real Estate - Spacious Living Property Updated",

//         message:
//           hasNewProperty
//             ? `A new Spacious Living property has been added.

// Spacious Living ID:
// ${savedData._id}

// Please visit the Admin Panel to view the details.`
//             : `A Spacious Living property has been updated.

// Spacious Living ID:
// ${savedData._id}

// Please visit the Admin Panel to view the latest changes.`,

//         type:
//           hasNewProperty
//             ? "spacious-living-property-created"
//             : "spacious-living-property-updated",

//         propertyId:
//           savedData._id.toString(),
//       });
//     } catch (emailError) {
//       console.error(
//         "SPACIOUS LIVING ADMIN EMAIL ERROR:",
//         emailError
//       );
//     }

//     // =======================================================
//     // CUSTOMER EMAIL
//     // =======================================================

//     try {
//       await notifyAllCustomers({
//         subject:
//           hasNewProperty
//             ? "Modern Real Estate - New Spacious Living Property Available"
//             : "Modern Real Estate - Spacious Living Property Updated",

//         message:
//           hasNewProperty
//             ? `A new property is now available in Spacious Living.

// Spacious Living ID:
// ${savedData._id}

// Visit Modern Real Estate to view the latest property.`
//             : `A Spacious Living property has been updated.

// Spacious Living ID:
// ${savedData._id}

// Visit Modern Real Estate to view the latest update.`,

//         type:
//           hasNewProperty
//             ? "spacious-living-property-created-customer"
//             : "spacious-living-property-updated-customer",

//         propertyId:
//           savedData._id.toString(),
//       });
//     } catch (emailError) {
//       console.error(
//         "SPACIOUS LIVING CUSTOMER EMAIL ERROR:",
//         emailError
//       );
//     }

//     // =======================================================
//     // RESPONSE
//     // =======================================================

//     return res.json({
//       success: true,

//       message:
//         "Properties saved successfully.",

//       data: savedData,
//     });
//   } catch (error) {
//     console.error(
//       "SAVE SPACIOUS LIVING ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,

//       message:
//         error.message ||
//         "Failed to save Spacious Living",
//     });
//   }
// };

// // =========================================================
// // DELETE
// // =========================================================
// // ADMIN:
// //   Deletes complete Spacious Living.
// //
// // SUBADMIN:
// //   Deletes ONLY their own properties.
// //
// // =========================================================

// const deleteSpaciousLiving = async (
//   req,
//   res
// ) => {
//   try {
//     const userId =
//       getUserId(req);

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message:
//           "User ID not found",
//       });
//     }

//     const data =
//       await SpaciousLiving.findOne();

//     if (!data) {
//       return res.status(404).json({
//         success: false,
//         message:
//           "Spacious Living not found",
//       });
//     }

//     // =======================================================
//     // ADMIN
//     // =======================================================

//     if (
//       req.user?.role === "admin"
//     ) {
//       await SpaciousLiving.deleteMany(
//         {}
//       );

//       try {
//         await notifyAdmins({
//           subject:
//             "Modern Real Estate - Spacious Living Deleted",

//           message: `The Spacious Living section has been deleted.

// Spacious Living ID:
// ${data._id}

// Title:
// ${data.title || "Spacious Living"}`,

//           type:
//             "spacious-living-deleted",

//           propertyId:
//             data._id.toString(),
//         });
//       } catch (emailError) {
//         console.error(
//           "SPACIOUS LIVING DELETE EMAIL ERROR:",
//           emailError
//         );
//       }

//       return res.json({
//         success: true,
//         message:
//           "Spacious Living deleted successfully",
//       });
//     }

//     // =======================================================
//     // SUBADMIN
//     // =======================================================

//     if (
//       req.user?.role === "subAdmin"
//     ) {
//       const myProperties =
//         data.sliderProperties.filter(
//           (property) => {
//             return (
//               property.createdBy &&
//               property.createdBy
//                 .toString() ===
//               userId.toString()
//             );
//           }
//         );

//       if (
//         myProperties.length ===
//         0
//       ) {
//         return res.status(403).json({
//           success: false,
//           message:
//             "You do not have any properties to delete",
//         });
//       }

//       // -----------------------------------------------------
//       // REMOVE ONLY OWN PROPERTIES
//       // -----------------------------------------------------

//       data.sliderProperties =
//         data.sliderProperties.filter(
//           (property) => {
//             if (
//               !property.createdBy
//             ) {
//               return true;
//             }

//             return (
//               property.createdBy
//                 .toString() !==
//               userId.toString()
//             );
//           }
//         );

//       await data.save();

//       try {
//         await notifyAdmins({
//           subject:
//             "Modern Real Estate - Spacious Living Property Deleted",

//           message: `A SubAdmin deleted their Spacious Living properties.

// Spacious Living ID:
// ${data._id}

// Deleted properties:
// ${myProperties.length}`,

//           type:
//             "spacious-living-property-deleted",

//           propertyId:
//             data._id.toString(),
//         });
//       } catch (emailError) {
//         console.error(
//           "SPACIOUS LIVING SUBADMIN DELETE EMAIL ERROR:",
//           emailError
//         );
//       }

//       return res.json({
//         success: true,

//         message:
//           `${myProperties.length} property(s) deleted successfully`,
//       });
//     }

//     // =======================================================
//     // OTHER ROLE
//     // =======================================================

//     return res.status(403).json({
//       success: false,
//       message:
//         "Access denied",
//     });
//   } catch (error) {
//     console.error(
//       "DELETE SPACIOUS LIVING ERROR:",
//       error
//     );

//     return res.status(500).json({
//       success: false,

//       message:
//         error.message ||
//         "Failed to delete Spacious Living",
//     });
//   }
// };

// // =========================================================
// // EXPORTS
// // =========================================================

// module.exports = {
//   getSpaciousLiving,
//   getMySpaciousLiving,
//   saveSpaciousLiving,
//   deleteSpaciousLiving,
// };




const SpaciousLiving = require("../models/SpaciousLiving");

const {
  notifyAdmins,
  notifyAllCustomers,
} = require("../services/notificationService");

// =========================================================
// GET USER ID
// =========================================================

const getUserId = (req) => {
  return (
    req.user?.userId ||
    req.user?._id ||
    req.user?.id ||
    null
  );
};

// =========================================================
// AVAILABILITY HELPERS
// =========================================================

const normalizeAvailability = (property) => ({
  ...property,
  totalUnits: Number(property.totalUnits ?? 1),
  availableUnits: Number(property.availableUnits ?? 1),
  bookedUnits: Number(property.bookedUnits ?? 0),
});

const validateAvailability = (property) => {
  const { totalUnits, availableUnits, bookedUnits } = property;

  if (
    ![totalUnits, availableUnits, bookedUnits].every(
      Number.isInteger
    ) ||
    totalUnits < 0 ||
    availableUnits < 0 ||
    bookedUnits < 0
  ) {
    return "Availability values must be non-negative whole numbers.";
  }

  if (availableUnits + bookedUnits !== totalUnits) {
    return "Available Units + Booked Units must equal Total Units.";
  }

  return null;
};

// =========================================================
// GET PUBLIC SPACIOUS LIVING
// =========================================================

const getSpaciousLiving = async (req, res) => {
  try {
    const data = await SpaciousLiving.findOne();

    return res.json({
      success: true,
      data: data || null,
    });
  } catch (error) {
    console.error("GET SPACIOUS LIVING ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch Spacious Living",
    });
  }
};

// =========================================================
// GET MY SPACIOUS LIVING
// ADMIN: Gets all properties.
// SUBADMIN: Gets only properties owned by the logged-in SubAdmin.
// =========================================================

const getMySpaciousLiving = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found",
      });
    }

    const data = await SpaciousLiving.findOne();

    if (!data) {
      return res.json({
        success: true,
        data: null,
      });
    }

    if (req.user?.role === "admin") {
      return res.json({
        success: true,
        data,
      });
    }

    if (req.user?.role === "subAdmin") {
      const myProperties = data.sliderProperties.filter(
        (property) =>
          property.createdBy &&
          property.createdBy.toString() === userId.toString()
      );

      const responseData = data.toObject();
      responseData.sliderProperties = myProperties;

      return res.json({
        success: true,
        data: responseData,
      });
    }

    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  } catch (error) {
    console.error("GET MY SPACIOUS LIVING ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your Spacious Living",
    });
  }
};

// =========================================================
// SAVE SPACIOUS LIVING
// ADMIN: Can create and update all properties.
// SUBADMIN: Can create and update only their own properties.
// =========================================================

const saveSpaciousLiving = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found",
      });
    }

    // -------------------------------------------------------
    // PARSE CONTENT
    // -------------------------------------------------------

    let content = {};

    try {
      content = req.body.content
        ? JSON.parse(req.body.content)
        : {};
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid content data",
      });
    }

    // -------------------------------------------------------
    // FIND OR CREATE DOCUMENT
    // -------------------------------------------------------

    let data = await SpaciousLiving.findOne();

    if (!data) {
      data = new SpaciousLiving();
      data.createdBy = userId;
    }

    // -------------------------------------------------------
    // NORMALIZE AND VALIDATE AVAILABILITY
    // -------------------------------------------------------

    const incomingProperties = (
      Array.isArray(content.sliderProperties)
        ? content.sliderProperties
        : []
    ).map(normalizeAvailability);

    for (const property of incomingProperties) {
      const validationError = validateAvailability(property);

      if (validationError) {
        return res.status(400).json({
          success: false,
          message: validationError,
          property: property.title || "",
        });
      }
    }

    // -------------------------------------------------------
    // ADMIN PROPERTY MANAGEMENT
    // -------------------------------------------------------

    if (req.user?.role === "admin") {
      const existingProperties = data.sliderProperties || [];
      const finalProperties = [];

      for (const incoming of incomingProperties) {
        let existing = null;

        if (incoming._id) {
          existing = existingProperties.find(
            (property) =>
              property._id?.toString() === incoming._id.toString()
          );
        }

        if (existing) {
          const existingObject =
            typeof existing.toObject === "function"
              ? existing.toObject()
              : existing;

          finalProperties.push({
            ...existingObject,
            ...incoming,
            createdBy: existing.createdBy || userId,
          });
        } else {
          finalProperties.push({
            ...incoming,
            createdBy: userId,
          });
        }
      }

      data.sliderProperties = finalProperties;
    }

    // -------------------------------------------------------
    // SUBADMIN PROPERTY MANAGEMENT
    // -------------------------------------------------------

    if (req.user?.role === "subAdmin") {
      const existingProperties = data.sliderProperties || [];

      const myExistingProperties = existingProperties.filter(
        (property) =>
          property.createdBy &&
          property.createdBy.toString() === userId.toString()
      );

      const otherProperties = existingProperties.filter(
        (property) => {
          if (!property.createdBy) {
            return true;
          }

          return (
            property.createdBy.toString() !== userId.toString()
          );
        }
      );

      const updatedMyProperties = [];

      for (const incoming of incomingProperties) {
        if (incoming._id) {
          const existing = myExistingProperties.find(
            (property) =>
              property._id?.toString() === incoming._id.toString()
          );

          // Do not allow editing another user's property.
          if (!existing) {
            continue;
          }

          const existingObject =
            typeof existing.toObject === "function"
              ? existing.toObject()
              : existing;

          updatedMyProperties.push({
            ...existingObject,
            ...incoming,
            createdBy: existing.createdBy,
          });

          continue;
        }

        // New properties belong to the logged-in SubAdmin.
        updatedMyProperties.push({
          ...incoming,
          createdBy: userId,
        });
      }

      // Preserve Admin and other SubAdmin properties.
      data.sliderProperties = [
        ...otherProperties,
        ...updatedMyProperties,
      ];
    }

    // -------------------------------------------------------
    // SLIDER IMAGES
    // -------------------------------------------------------

    if (req.files && req.files.length > 0) {
      for (let i = 0; i < incomingProperties.length; i++) {
        const incoming = incomingProperties[i];
        let targetProperty = null;

        if (incoming._id) {
          targetProperty = data.sliderProperties.find(
            (property) =>
              property._id?.toString() === incoming._id.toString()
          );
        } else {
          targetProperty = data.sliderProperties.find(
            (property) => {
              if (
                req.user?.role === "subAdmin" &&
                (
                  !property.createdBy ||
                  property.createdBy.toString() !== userId.toString()
                )
              ) {
                return false;
              }

              return (
                property.title === incoming.title &&
                property.category === incoming.category
              );
            }
          );
        }

        if (!targetProperty) {
          continue;
        }

        // SubAdmin can upload images only for their own properties.
        if (
          req.user?.role === "subAdmin" &&
          (
            !targetProperty.createdBy ||
            targetProperty.createdBy.toString() !== userId.toString()
          )
        ) {
          continue;
        }

        const mainFile = req.files.find(
          (file) => file.fieldname === `sliderMainImage_${i}`
        );

        if (mainFile) {
          targetProperty.mainImage = `/uploads/${mainFile.filename}`;
        }

        const subFiles = req.files.filter(
          (file) => file.fieldname === `sliderSubImages_${i}`
        );

        if (subFiles.length > 0) {
          targetProperty.subImages = [
            ...(targetProperty.subImages || []),
            ...subFiles.map(
              (file) => `/uploads/${file.filename}`
            ),
          ].slice(0, 4);
        }
      }
    }

    // -------------------------------------------------------
    // SAVE TO DATABASE
    // -------------------------------------------------------

    const savedData = await data.save();

    // -------------------------------------------------------
    // NOTIFICATIONS
    // -------------------------------------------------------

    const hasNewProperty = incomingProperties.some(
      (property) => !property._id
    );

    try {
      await notifyAdmins({
        subject: hasNewProperty
          ? "Modern Real Estate - New Spacious Living Property Added"
          : "Modern Real Estate - Spacious Living Property Updated",

        message: hasNewProperty
          ? `A new Spacious Living property has been added.

Spacious Living ID:
${savedData._id}

Please visit the Admin Panel to view the details.`
          : `A Spacious Living property has been updated.

Spacious Living ID:
${savedData._id}

Please visit the Admin Panel to view the latest changes.`,

        type: hasNewProperty
          ? "spacious-living-property-created"
          : "spacious-living-property-updated",

        propertyId: savedData._id.toString(),
      });
    } catch (emailError) {
      console.error("SPACIOUS LIVING ADMIN EMAIL ERROR:", emailError);
    }

    try {
      await notifyAllCustomers({
        subject: hasNewProperty
          ? "Modern Real Estate - New Spacious Living Property Available"
          : "Modern Real Estate - Spacious Living Property Updated",

        message: hasNewProperty
          ? `A new property is now available in Spacious Living.

Spacious Living ID:
${savedData._id}

Visit Modern Real Estate to view the latest property.`
          : `A Spacious Living property has been updated.

Spacious Living ID:
${savedData._id}

Visit Modern Real Estate to view the latest update.`,

        type: hasNewProperty
          ? "spacious-living-property-created-customer"
          : "spacious-living-property-updated-customer",

        propertyId: savedData._id.toString(),
      });
    } catch (emailError) {
      console.error("SPACIOUS LIVING CUSTOMER EMAIL ERROR:", emailError);
    }

    return res.json({
      success: true,
      message: "Properties saved successfully.",
      data: savedData,
    });
  } catch (error) {
    console.error("SAVE SPACIOUS LIVING ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to save Spacious Living",
    });
  }
};

// =========================================================
// DELETE SPACIOUS LIVING
// ADMIN: Deletes the complete section.
// SUBADMIN: Deletes only their own properties.
// =========================================================

const deleteSpaciousLiving = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found",
      });
    }

    const data = await SpaciousLiving.findOne();

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Spacious Living not found",
      });
    }

    // -------------------------------------------------------
    // ADMIN DELETE
    // -------------------------------------------------------

    if (req.user?.role === "admin") {
      await SpaciousLiving.deleteMany({});

      try {
        await notifyAdmins({
          subject: "Modern Real Estate - Spacious Living Deleted",

          message: `The Spacious Living section has been deleted.

Spacious Living ID:
${data._id}

Title:
${data.title || "Spacious Living"}`,

          type: "spacious-living-deleted",
          propertyId: data._id.toString(),
        });
      } catch (emailError) {
        console.error("SPACIOUS LIVING DELETE EMAIL ERROR:", emailError);
      }

      return res.json({
        success: true,
        message: "Spacious Living deleted successfully",
      });
    }

    // -------------------------------------------------------
    // SUBADMIN DELETE
    // -------------------------------------------------------

    if (req.user?.role === "subAdmin") {
      const myProperties = data.sliderProperties.filter(
        (property) =>
          property.createdBy &&
          property.createdBy.toString() === userId.toString()
      );

      if (myProperties.length === 0) {
        return res.status(403).json({
          success: false,
          message: "You do not have any properties to delete",
        });
      }

      data.sliderProperties = data.sliderProperties.filter(
        (property) => {
          if (!property.createdBy) {
            return true;
          }

          return (
            property.createdBy.toString() !== userId.toString()
          );
        }
      );

      await data.save();

      try {
        await notifyAdmins({
          subject:
            "Modern Real Estate - Spacious Living Property Deleted",

          message: `A SubAdmin deleted their Spacious Living properties.

Spacious Living ID:
${data._id}

Deleted properties:
${myProperties.length}`,

          type: "spacious-living-property-deleted",
          propertyId: data._id.toString(),
        });
      } catch (emailError) {
        console.error(
          "SPACIOUS LIVING SUBADMIN DELETE EMAIL ERROR:",
          emailError
        );
      }

      return res.json({
        success: true,
        message: `${myProperties.length} property(s) deleted successfully`,
      });
    }

    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  } catch (error) {
    console.error("DELETE SPACIOUS LIVING ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete Spacious Living",
    });
  }
};

// =========================================================
// EXPORTS
// =========================================================

module.exports = {
  getSpaciousLiving,
  getMySpaciousLiving,
  saveSpaciousLiving,
  deleteSpaciousLiving,
};