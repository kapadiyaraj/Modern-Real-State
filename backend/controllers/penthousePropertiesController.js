


// const PenthouseProperties = require("../models/PenthouseProperties");

// const {
//   notifyAdmins,
//   notifyAllCustomers,
// } = require("../services/notificationService");

// // ======================================================
// // HELPER - GET USER ID
// // ======================================================

// const getUserId = (req) => {
//   return (
//     req.user?.userId ||
//     req.user?._id ||
//     req.user?.id ||
//     null
//   );
// };

// // ======================================================
// // GET ALL
// // PUBLIC
// // ======================================================

// const getPenthouseProperties = async (
//   req,
//   res
// ) => {
//   try {
//     const properties =
//       await PenthouseProperties.find().sort({
//         createdAt: -1,
//       });

//     return res.status(200).json({
//       properties,
//     });
//   } catch (error) {
//     console.error(
//       "GET Penthouse Properties Error:",
//       error
//     );

//     return res.status(500).json({
//       message:
//         "Failed to fetch penthouse properties",
//       error: error.message,
//     });
//   }
// };

// // ======================================================
// // GET MY PROPERTIES
// // ADMIN + SUB ADMIN
// // ======================================================

// const getMyPenthouseProperties = async (
//   req,
//   res
// ) => {
//   try {
//     const userId = getUserId(req);

//     // ==================================================
//     // AUTHENTICATION
//     // ==================================================

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message:
//           "Authentication required",
//       });
//     }

//     // ==================================================
//     // ADMIN
//     // ADMIN CAN SEE ALL PROPERTIES
//     // ==================================================

//     if (req.user?.role === "admin") {
//       const properties =
//         await PenthouseProperties.find().sort({
//           createdAt: -1,
//         });

//       return res.status(200).json({
//         success: true,
//         properties,
//       });
//     }

//     // ==================================================
//     // SUB ADMIN
//     // ONLY OWN PROPERTIES
//     // ==================================================

//     if (req.user?.role === "subAdmin") {
//       const properties =
//         await PenthouseProperties.find({
//           createdBy: userId,
//         }).sort({
//           createdAt: -1,
//         });

//       return res.status(200).json({
//         success: true,
//         properties,
//       });
//     }

//     // ==================================================
//     // INVALID ROLE
//     // ==================================================

//     return res.status(403).json({
//       success: false,
//       message: "Access denied",
//     });
//   } catch (error) {
//     console.error(
//       "GET MY Penthouse Properties Error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Failed to fetch my penthouse properties",
//       error: error.message,
//     });
//   }
// };

// // ======================================================
// // GET SINGLE
// // PUBLIC
// // ======================================================

// const getPenthouseProperty = async (
//   req,
//   res
// ) => {
//   try {
//     const property =
//       await PenthouseProperties.findOne({
//         id: Number(req.params.id),
//       });

//     if (!property) {
//       return res.status(404).json({
//         message: "Property not found",
//       });
//     }

//     return res.status(200).json(
//       property
//     );
//   } catch (error) {
//     console.error(
//       "GET Single Penthouse Property Error:",
//       error
//     );

//     return res.status(500).json({
//       message:
//         "Failed to fetch property",
//       error: error.message,
//     });
//   }
// };

// // ======================================================
// // CREATE
// // ADMIN + SUB ADMIN
// // ======================================================

// const createPenthouseProperty = async (
//   req,
//   res
// ) => {
//   try {
//     const {
//       title,
//       category,
//       image,
//       images,
//       size,
//       sizes,
//       price,
//       oldPrice,
//       description,
//     } = req.body;

//     // ==================================================
//     // VALIDATION
//     // ==================================================

//     if (
//       !title ||
//       !image ||
//       !price
//     ) {
//       return res.status(400).json({
//         message:
//           "Title, image and price are required",
//       });
//     }

//     // ==================================================
//     // LOGGED-IN USER
//     // ==================================================

//     const userId =
//       getUserId(req);

//     if (!userId) {
//       return res.status(401).json({
//         message:
//           "Authentication required",
//       });
//     }

//     // ==================================================
//     // IMAGES
//     // ==================================================

//     const finalImages =
//       Array.isArray(images)
//         ? images.slice(0, 4)
//         : [];

//     // ==================================================
//     // SIZES
//     // ==================================================

//     const finalSizes =
//       Array.isArray(sizes) &&
//       sizes.length > 0
//         ? sizes
//         : size
//         ? [size]
//         : [];

//     // ==================================================
//     // CREATE PROPERTY
//     // ==================================================

//     const property =
//       new PenthouseProperties({
//         id: Date.now(),

//         title:
//           title.trim(),

//         category:
//           category || "Home",

//         image,

//         images:
//           finalImages.length > 0
//             ? finalImages
//             : [image],

//         size:
//           size || "",

//         sizes:
//           finalSizes,

//         price:
//           price.trim(),

//         oldPrice:
//           oldPrice || "",

//         description:
//           description || "",

//         // IMPORTANT
//         // Store logged-in user
//         createdBy: userId,
//       });

//     // ==================================================
//     // SAVE
//     // ==================================================

//     const savedProperty =
//       await property.save();

//     // ==================================================
//     // EMAIL - ALL ADMINS
//     // ==================================================

//     try {
//       await notifyAdmins({
//         subject:
//           "Modern Real Estate - New Penthouse Property",

//         message: `A new penthouse property has been added.

// Property: ${savedProperty.title}
// Category: ${savedProperty.category}
// Size: ${savedProperty.size}
// Price: Rs. ${savedProperty.price}

// Property ID: ${savedProperty.id}

// A new penthouse property is now available on Modern Real Estate.`,

//         type:
//           "penthouse_property_created",

//         propertyId:
//           String(
//             savedProperty.id
//           ),
//       });
//     } catch (emailError) {
//       console.error(
//         "PENTHOUSE CREATE ADMIN EMAIL ERROR:",
//         emailError
//       );
//     }

//     // ==================================================
//     // EMAIL - ALL CUSTOMERS
//     // ==================================================

//     try {
//       await notifyAllCustomers({
//         subject:
//           "Modern Real Estate - New Penthouse Property Available",

//         message: `A new penthouse property has been added to Modern Real Estate.

// Property: ${savedProperty.title}
// Category: ${savedProperty.category}
// Size: ${savedProperty.size}
// Price: Rs. ${savedProperty.price}

// Property ID: ${savedProperty.id}

// A new penthouse property is now available.

// Please visit Modern Real Estate to view the property.`,

//         type:
//           "penthouse_property_created_customer",

//         propertyId:
//           String(
//             savedProperty.id
//           ),
//       });
//     } catch (emailError) {
//       console.error(
//         "PENTHOUSE CREATE CUSTOMER EMAIL ERROR:",
//         emailError
//       );
//     }

//     // ==================================================
//     // RESPONSE
//     // ==================================================

//     return res.status(201).json(
//       savedProperty
//     );
//   } catch (error) {
//     console.error(
//       "CREATE Penthouse Property Error:",
//       error
//     );

//     return res.status(500).json({
//       message:
//         "Failed to create property",
//       error: error.message,
//     });
//   }
// };

// // ======================================================
// // UPDATE
// // ADMIN + SUB ADMIN
// // ======================================================

// const updatePenthouseProperty = async (
//   req,
//   res
// ) => {
//   try {
//     const property =
//       await PenthouseProperties.findOne({
//         id: Number(req.params.id),
//       });

//     // ==================================================
//     // PROPERTY NOT FOUND
//     // ==================================================

//     if (!property) {
//       return res.status(404).json({
//         message: "Property not found",
//       });
//     }

//     // ==================================================
//     // USER ID
//     // ==================================================

//     const userId =
//       getUserId(req);

//     if (!userId) {
//       return res.status(401).json({
//         message:
//           "Authentication required",
//       });
//     }

//     // ==================================================
//     // SUB ADMIN OWNERSHIP CHECK
//     // ==================================================

//     if (
//       req.user?.role === "subAdmin"
//     ) {
//       if (
//         !property.createdBy ||
//         property.createdBy.toString() !==
//           userId.toString()
//       ) {
//         return res.status(403).json({
//           message:
//             "You can only manage your own properties",
//         });
//       }
//     }

//     // ==================================================
//     // REQUEST DATA
//     // ==================================================

//     const {
//       title,
//       category,
//       image,
//       images,
//       size,
//       sizes,
//       price,
//       oldPrice,
//       description,
//     } = req.body;

//     // ==================================================
//     // UPDATE FIELDS
//     // ==================================================

//     if (
//       title !== undefined
//     ) {
//       property.title =
//         title.trim();
//     }

//     if (
//       category !== undefined
//     ) {
//       property.category =
//         category;
//     }

//     if (
//       image !== undefined
//     ) {
//       property.image =
//         image;
//     }

//     if (
//       Array.isArray(images)
//     ) {
//       property.images =
//         images.slice(0, 4);
//     }

//     if (
//       size !== undefined
//     ) {
//       property.size =
//         size;
//     }

//     if (
//       Array.isArray(sizes)
//     ) {
//       property.sizes =
//         sizes;
//     }

//     if (
//       price !== undefined
//     ) {
//       property.price =
//         price.trim();
//     }

//     if (
//       oldPrice !== undefined
//     ) {
//       property.oldPrice =
//         oldPrice;
//     }

//     if (
//       description !== undefined
//     ) {
//       property.description =
//         description;
//     }

//     // ==================================================
//     // SAVE
//     // ==================================================

//     const updatedProperty =
//       await property.save();

//     // ==================================================
//     // EMAIL - ALL ADMINS
//     // ==================================================

//     try {
//       await notifyAdmins({
//         subject:
//           "Modern Real Estate - Penthouse Property Updated",

//         message: `A penthouse property has been updated.

// Property: ${updatedProperty.title}
// Category: ${updatedProperty.category}
// Size: ${updatedProperty.size}
// Price: Rs. ${updatedProperty.price}

// Property ID: ${updatedProperty.id}

// Please check the updated penthouse property details.`,

//         type:
//           "penthouse_property_updated",

//         propertyId:
//           String(
//             updatedProperty.id
//           ),
//       });
//     } catch (emailError) {
//       console.error(
//         "PENTHOUSE UPDATE ADMIN EMAIL ERROR:",
//         emailError
//       );
//     }

//     // ==================================================
//     // EMAIL - ALL CUSTOMERS
//     // ==================================================

//     try {
//       await notifyAllCustomers({
//         subject:
//           "Modern Real Estate - Penthouse Property Updated",

//         message: `A penthouse property has been updated on Modern Real Estate.

// Property: ${updatedProperty.title}
// Category: ${updatedProperty.category}
// Size: ${updatedProperty.size}
// Price: Rs. ${updatedProperty.price}

// Property ID: ${updatedProperty.id}

// The property details have been updated.

// Please visit Modern Real Estate to view the latest property details.`,

//         type:
//           "penthouse_property_updated_customer",

//         propertyId:
//           String(
//             updatedProperty.id
//           ),
//       });
//     } catch (emailError) {
//       console.error(
//         "PENTHOUSE UPDATE CUSTOMER EMAIL ERROR:",
//         emailError
//       );
//     }

//     // ==================================================
//     // RESPONSE
//     // ==================================================

//     return res.status(200).json(
//       updatedProperty
//     );
//   } catch (error) {
//     console.error(
//       "UPDATE Penthouse Property Error:",
//       error
//     );

//     return res.status(500).json({
//       message:
//         "Failed to update property",
//       error: error.message,
//     });
//   }
// };

// // ======================================================
// // DELETE
// // ADMIN + SUB ADMIN
// // ======================================================

// const deletePenthouseProperty = async (
//   req,
//   res
// ) => {
//   try {
//     const property =
//       await PenthouseProperties.findOne({
//         id: Number(req.params.id),
//       });

//     // ==================================================
//     // PROPERTY NOT FOUND
//     // ==================================================

//     if (!property) {
//       return res.status(404).json({
//         message: "Property not found",
//       });
//     }

//     // ==================================================
//     // USER ID
//     // ==================================================

//     const userId =
//       getUserId(req);

//     if (!userId) {
//       return res.status(401).json({
//         message:
//           "Authentication required",
//       });
//     }

//     // ==================================================
//     // SUB ADMIN OWNERSHIP CHECK
//     // ==================================================

//     if (
//       req.user?.role === "subAdmin"
//     ) {
//       if (
//         !property.createdBy ||
//         property.createdBy.toString() !==
//           userId.toString()
//       ) {
//         return res.status(403).json({
//           message:
//             "You can only manage your own properties",
//         });
//       }
//     }

//     // ==================================================
//     // EMAIL - ALL ADMINS
//     // ==================================================

//     try {
//       await notifyAdmins({
//         subject:
//           "Modern Real Estate - Penthouse Property Deleted",

//         message: `A penthouse property has been deleted.

// Property: ${property.title}
// Price: Rs. ${property.price}
// Property ID: ${property.id}

// The property is no longer available.`,

//         type:
//           "penthouse_property_deleted",

//         propertyId:
//           String(
//             property.id
//           ),
//       });
//     } catch (emailError) {
//       console.error(
//         "PENTHOUSE DELETE ADMIN EMAIL ERROR:",
//         emailError
//       );
//     }

//     // ==================================================
//     // DELETE PROPERTY
//     // ==================================================

//     await PenthouseProperties.findOneAndDelete(
//       {
//         id: Number(req.params.id),
//       }
//     );

//     // ==================================================
//     // RESPONSE
//     // ==================================================

//     return res.status(200).json({
//       message:
//         "Property deleted successfully",

//       property,
//     });
//   } catch (error) {
//     console.error(
//       "DELETE Penthouse Property Error:",
//       error
//     );

//     return res.status(500).json({
//       message:
//         "Failed to delete property",

//       error: error.message,
//     });
//   }
// };

// // ======================================================
// // EXPORTS
// // ======================================================

// module.exports = {
//   getPenthouseProperties,
//   getPenthouseProperty,
//   getMyPenthouseProperties,
//   createPenthouseProperty,
//   updatePenthouseProperty,
//   deletePenthouseProperty,
// };


const PenthouseProperties = require("../models/PenthouseProperties");

const {
  notifyAdmins,
  notifyAllCustomers,
} = require("../services/notificationService");

// ======================================================
// HELPER - GET USER ID
// ======================================================

const getUserId = (req) => {
  return (
    req.user?.userId ||
    req.user?._id ||
    req.user?.id ||
    null
  );
};

// ======================================================
// GET ALL
// PUBLIC
// ======================================================

const getPenthouseProperties = async (
  req,
  res
) => {
  try {
    const properties =
      await PenthouseProperties.find().sort({
        createdAt: -1,
      });

    return res.status(200).json({
      properties,
    });
  } catch (error) {
    console.error(
      "GET Penthouse Properties Error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch penthouse properties",
      error: error.message,
    });
  }
};

// ======================================================
// GET MY PROPERTIES
// ADMIN + SUB ADMIN
// ======================================================

const getMyPenthouseProperties = async (
  req,
  res
) => {
  try {
    const userId = getUserId(req);

    // ==================================================
    // AUTHENTICATION
    // ==================================================

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    // ==================================================
    // ADMIN
    // ADMIN CAN SEE ALL PROPERTIES
    // ==================================================

    if (req.user?.role === "admin") {
      const properties =
        await PenthouseProperties.find().sort({
          createdAt: -1,
        });

      return res.status(200).json({
        success: true,
        properties,
      });
    }

    // ==================================================
    // SUB ADMIN
    // ONLY OWN PROPERTIES
    // ==================================================

    if (req.user?.role === "subAdmin") {
      const properties =
        await PenthouseProperties.find({
          createdBy: userId,
        }).sort({
          createdAt: -1,
        });

      return res.status(200).json({
        success: true,
        properties,
      });
    }

    // ==================================================
    // INVALID ROLE
    // ==================================================

    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  } catch (error) {
    console.error(
      "GET MY Penthouse Properties Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch my penthouse properties",
      error: error.message,
    });
  }
};

// ======================================================
// GET SINGLE
// PUBLIC
// ======================================================

const getPenthouseProperty = async (
  req,
  res
) => {
  try {
    const property =
      await PenthouseProperties.findOne({
        id: Number(req.params.id),
      });

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    return res.status(200).json(
      property
    );
  } catch (error) {
    console.error(
      "GET Single Penthouse Property Error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch property",
      error: error.message,
    });
  }
};

// ======================================================
// CREATE
// ADMIN + SUB ADMIN
// ======================================================

const createPenthouseProperty = async (
  req,
  res
) => {
  try {
    const {
      title,
      category,
      image,
      images,
      size,
      sizes,
      price,
      oldPrice,
      description,
      totalUnits = 1,
      availableUnits = 1,
      bookedUnits = 0,
    } = req.body;

    // ==================================================
    // VALIDATION
    // ==================================================

    if (
      !title ||
      !image ||
      !price
    ) {
      return res.status(400).json({
        message:
          "Title, image and price are required",
      });
    }

    const total = Number(totalUnits);
    const available = Number(availableUnits);
    const booked = Number(bookedUnits);

    if (
      !Number.isInteger(total) ||
      !Number.isInteger(available) ||
      !Number.isInteger(booked) ||
      total < 0 ||
      available < 0 ||
      booked < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Availability values must be non-negative whole numbers.",
      });
    }

    if (available + booked !== total) {
      return res.status(400).json({
        success: false,
        message:
          "Available Units + Booked Units must equal Total Units.",
      });
    }

    // ==================================================
    // LOGGED-IN USER
    // ==================================================

    const userId =
      getUserId(req);

    if (!userId) {
      return res.status(401).json({
        message:
          "Authentication required",
      });
    }

    // ==================================================
    // IMAGES
    // ==================================================

    const finalImages =
      Array.isArray(images)
        ? images.slice(0, 4)
        : [];

    // ==================================================
    // SIZES
    // ==================================================

    const finalSizes =
      Array.isArray(sizes) &&
      sizes.length > 0
        ? sizes
        : size
        ? [size]
        : [];

    // ==================================================
    // CREATE PROPERTY
    // ==================================================

    const property =
      new PenthouseProperties({
        id: Date.now(),

        title:
          title.trim(),

        category:
          category || "Home",

        image,

        images:
          finalImages.length > 0
            ? finalImages
            : [image],

        size:
          size || "",

        sizes:
          finalSizes,

        price:
          price.trim(),

        oldPrice:
          oldPrice || "",

        description:
          description || "",

        totalUnits: total,
        availableUnits: available,
        bookedUnits: booked,

        // IMPORTANT
        // Store logged-in user
        createdBy: userId,
      });

    // ==================================================
    // SAVE
    // ==================================================

    const savedProperty =
      await property.save();

    // ==================================================
    // EMAIL - ALL ADMINS
    // ==================================================

    try {
      await notifyAdmins({
        subject:
          "Modern Real Estate - New Penthouse Property",

        message: `A new penthouse property has been added.

Property: ${savedProperty.title}
Category: ${savedProperty.category}
Size: ${savedProperty.size}
Price: Rs. ${savedProperty.price}

Property ID: ${savedProperty.id}

A new penthouse property is now available on Modern Real Estate.`,

        type:
          "penthouse_property_created",

        propertyId:
          String(
            savedProperty.id
          ),
      });
    } catch (emailError) {
      console.error(
        "PENTHOUSE CREATE ADMIN EMAIL ERROR:",
        emailError
      );
    }

    // ==================================================
    // EMAIL - ALL CUSTOMERS
    // ==================================================

    try {
      await notifyAllCustomers({
        subject:
          "Modern Real Estate - New Penthouse Property Available",

        message: `A new penthouse property has been added to Modern Real Estate.

Property: ${savedProperty.title}
Category: ${savedProperty.category}
Size: ${savedProperty.size}
Price: Rs. ${savedProperty.price}

Property ID: ${savedProperty.id}

A new penthouse property is now available.

Please visit Modern Real Estate to view the property.`,

        type:
          "penthouse_property_created_customer",

        propertyId:
          String(
            savedProperty.id
          ),
      });
    } catch (emailError) {
      console.error(
        "PENTHOUSE CREATE CUSTOMER EMAIL ERROR:",
        emailError
      );
    }

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(201).json(
      savedProperty
    );
  } catch (error) {
    console.error(
      "CREATE Penthouse Property Error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to create property",
      error: error.message,
    });
  }
};

// ======================================================
// UPDATE
// ADMIN + SUB ADMIN
// ======================================================

const updatePenthouseProperty = async (
  req,
  res
) => {
  try {
    const property =
      await PenthouseProperties.findOne({
        id: Number(req.params.id),
      });

    // ==================================================
    // PROPERTY NOT FOUND
    // ==================================================

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    // ==================================================
    // USER ID
    // ==================================================

    const userId =
      getUserId(req);

    if (!userId) {
      return res.status(401).json({
        message:
          "Authentication required",
      });
    }

    // ==================================================
    // SUB ADMIN OWNERSHIP CHECK
    // ==================================================

    if (
      req.user?.role === "subAdmin"
    ) {
      if (
        !property.createdBy ||
        property.createdBy.toString() !==
          userId.toString()
      ) {
        return res.status(403).json({
          message:
            "You can only manage your own properties",
        });
      }
    }

    // ==================================================
    // REQUEST DATA
    // ==================================================

    const {
      title,
      category,
      image,
      images,
      size,
      sizes,
      price,
      oldPrice,
      description,
      totalUnits,
      availableUnits,
      bookedUnits,
    } = req.body;

    // ==================================================
    // UPDATE FIELDS
    // ==================================================

    if (
      title !== undefined
    ) {
      property.title =
        title.trim();
    }

    if (
      category !== undefined
    ) {
      property.category =
        category;
    }

    if (
      image !== undefined
    ) {
      property.image =
        image;
    }

    if (
      Array.isArray(images)
    ) {
      property.images =
        images.slice(0, 4);
    }

    if (
      size !== undefined
    ) {
      property.size =
        size;
    }

    if (
      Array.isArray(sizes)
    ) {
      property.sizes =
        sizes;
    }

    if (
      price !== undefined
    ) {
      property.price =
        price.trim();
    }

    if (
      oldPrice !== undefined
    ) {
      property.oldPrice =
        oldPrice;
    }

    if (
      description !== undefined
    ) {
      property.description =
        description;
    }

    const nextTotal =
      totalUnits !== undefined
        ? Number(totalUnits)
        : property.totalUnits;

    const nextAvailable =
      availableUnits !== undefined
        ? Number(availableUnits)
        : property.availableUnits;

    const nextBooked =
      bookedUnits !== undefined
        ? Number(bookedUnits)
        : property.bookedUnits;

    if (
      !Number.isInteger(nextTotal) ||
      !Number.isInteger(nextAvailable) ||
      !Number.isInteger(nextBooked) ||
      nextTotal < 0 ||
      nextAvailable < 0 ||
      nextBooked < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Availability values must be non-negative whole numbers.",
      });
    }

    if (nextAvailable + nextBooked !== nextTotal) {
      return res.status(400).json({
        success: false,
        message:
          "Available Units + Booked Units must equal Total Units.",
      });
    }

    property.totalUnits = nextTotal;
    property.availableUnits = nextAvailable;
    property.bookedUnits = nextBooked;

    // ==================================================
    // SAVE
    // ==================================================

    const updatedProperty =
      await property.save();

    // ==================================================
    // EMAIL - ALL ADMINS
    // ==================================================

    try {
      await notifyAdmins({
        subject:
          "Modern Real Estate - Penthouse Property Updated",

        message: `A penthouse property has been updated.

Property: ${updatedProperty.title}
Category: ${updatedProperty.category}
Size: ${updatedProperty.size}
Price: Rs. ${updatedProperty.price}

Property ID: ${updatedProperty.id}

Please check the updated penthouse property details.`,

        type:
          "penthouse_property_updated",

        propertyId:
          String(
            updatedProperty.id
          ),
      });
    } catch (emailError) {
      console.error(
        "PENTHOUSE UPDATE ADMIN EMAIL ERROR:",
        emailError
      );
    }

    // ==================================================
    // EMAIL - ALL CUSTOMERS
    // ==================================================

    try {
      await notifyAllCustomers({
        subject:
          "Modern Real Estate - Penthouse Property Updated",

        message: `A penthouse property has been updated on Modern Real Estate.

Property: ${updatedProperty.title}
Category: ${updatedProperty.category}
Size: ${updatedProperty.size}
Price: Rs. ${updatedProperty.price}

Property ID: ${updatedProperty.id}

The property details have been updated.

Please visit Modern Real Estate to view the latest property details.`,

        type:
          "penthouse_property_updated_customer",

        propertyId:
          String(
            updatedProperty.id
          ),
      });
    } catch (emailError) {
      console.error(
        "PENTHOUSE UPDATE CUSTOMER EMAIL ERROR:",
        emailError
      );
    }

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json(
      updatedProperty
    );
  } catch (error) {
    console.error(
      "UPDATE Penthouse Property Error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to update property",
      error: error.message,
    });
  }
};

// ======================================================
// DELETE
// ADMIN + SUB ADMIN
// ======================================================

const deletePenthouseProperty = async (
  req,
  res
) => {
  try {
    const property =
      await PenthouseProperties.findOne({
        id: Number(req.params.id),
      });

    // ==================================================
    // PROPERTY NOT FOUND
    // ==================================================

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    // ==================================================
    // USER ID
    // ==================================================

    const userId =
      getUserId(req);

    if (!userId) {
      return res.status(401).json({
        message:
          "Authentication required",
      });
    }

    // ==================================================
    // SUB ADMIN OWNERSHIP CHECK
    // ==================================================

    if (
      req.user?.role === "subAdmin"
    ) {
      if (
        !property.createdBy ||
        property.createdBy.toString() !==
          userId.toString()
      ) {
        return res.status(403).json({
          message:
            "You can only manage your own properties",
        });
      }
    }

    // ==================================================
    // EMAIL - ALL ADMINS
    // ==================================================

    try {
      await notifyAdmins({
        subject:
          "Modern Real Estate - Penthouse Property Deleted",

        message: `A penthouse property has been deleted.

Property: ${property.title}
Price: Rs. ${property.price}
Property ID: ${property.id}

The property is no longer available.`,

        type:
          "penthouse_property_deleted",

        propertyId:
          String(
            property.id
          ),
      });
    } catch (emailError) {
      console.error(
        "PENTHOUSE DELETE ADMIN EMAIL ERROR:",
        emailError
      );
    }

    // ==================================================
    // DELETE PROPERTY
    // ==================================================

    await PenthouseProperties.findOneAndDelete(
      {
        id: Number(req.params.id),
      }
    );

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({
      message:
        "Property deleted successfully",

      property,
    });
  } catch (error) {
    console.error(
      "DELETE Penthouse Property Error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to delete property",

      error: error.message,
    });
  }
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  getPenthouseProperties,
  getPenthouseProperty,
  getMyPenthouseProperties,
  createPenthouseProperty,
  updatePenthouseProperty,
  deletePenthouseProperty,
};