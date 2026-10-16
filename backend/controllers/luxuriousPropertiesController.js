



// const LuxuriousProperties = require("../models/LuxuriousProperties");

// const {
//   notifyAdmins,
//   notifyAllCustomers,
//   notifyPreviousBuyersByOwner,
//   notifyPreviousBuyersOfProperty,
// } = require("../services/notificationService");


// // ======================================================
// // GET ALL
// // PUBLIC
// // ======================================================

// const getLuxuriousProperties = async (req, res) => {
//   try {
//     const properties =
//       await LuxuriousProperties.find().sort({
//         createdAt: -1,
//       });

//     res.status(200).json(properties);
//   } catch (error) {
//     console.error(
//       "GET Luxurious Properties Error:",
//       error
//     );

//     res.status(500).json({
//       message: "Failed to fetch luxurious properties",
//       error: error.message,
//     });
//   }
// };


// // ======================================================
// // GET MY LUXURY PROPERTIES
// //
// // ADMIN    -> ALL PROPERTIES
// // SUBADMIN -> ONLY OWN PROPERTIES
// // ======================================================

// const getMyLuxuriousProperties = async (req, res) => {
//   try {
//     const userId =
//       req.user?.userId ||
//       req.user?._id ||
//       req.user?.id ||
//       null;

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "User ID not found",
//       });
//     }

//     // ==================================================
//     // ADMIN
//     // ==================================================

//     if (req.user.role === "admin") {
//       const properties =
//         await LuxuriousProperties.find().sort({
//           createdAt: -1,
//         });

//       return res.status(200).json(properties);
//     }

//     // ==================================================
//     // SUBADMIN
//     // ==================================================

//     const properties =
//       await LuxuriousProperties.find({
//         createdBy: userId,
//       }).sort({
//         createdAt: -1,
//       });

//     return res.status(200).json(properties);

//   } catch (error) {
//     console.error(
//       "GET MY Luxury Properties Error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch your luxury properties",
//       error: error.message,
//     });
//   }
// };


// // ======================================================
// // GET SINGLE
// // PUBLIC
// // ======================================================

// const getLuxuriousProperty = async (req, res) => {
//   try {
//     const property =
//       await LuxuriousProperties.findOne({
//         id: Number(req.params.id),
//       });

//     if (!property) {
//       return res.status(404).json({
//         message: "Property not found",
//       });
//     }

//     res.status(200).json(property);
//   } catch (error) {
//     console.error(
//       "GET Single Luxury Property Error:",
//       error
//     );

//     res.status(500).json({
//       message: "Failed to fetch property",
//       error: error.message,
//     });
//   }
// };


// // ======================================================
// // CREATE
// // ADMIN + SUBADMIN
// // ======================================================

// const createLuxuriousProperty = async (
//   req,
//   res
// ) => {
//   try {
//     const {
//       title,
//       category,
//       type,
//       mainImage,
//       sliderImages,
//       size,
//       sizes,
//       price,
//       oldPrice,
//       description,
//       isNew,
//     } = req.body;


//     // ==================================================
//     // VALIDATION
//     // ==================================================

//     if (!title || !size || !price) {
//       return res.status(400).json({
//         message:
//           "Title, size and price are required",
//       });
//     }


//     // ==================================================
//     // GET LOGGED-IN USER
//     // ==================================================

//     const userId =
//       req.user?.userId ||
//       req.user?._id ||
//       req.user?.id ||
//       null;


//     // ==================================================
//     // PREPARE DATA
//     // ==================================================

//     const finalMainImage =
//       mainImage || "";

//     const finalSliderImages =
//       Array.isArray(sliderImages)
//         ? sliderImages.slice(0, 4)
//         : [];

//     const finalSizes =
//       Array.isArray(sizes) &&
//       sizes.length > 0
//         ? sizes
//         : [size];


//     // ==================================================
//     // CREATE PROPERTY
//     // ==================================================

//     const property =
//       new LuxuriousProperties({
//         id: Date.now(),

//         title: title.trim(),

//         category:
//           category ||
//           "Luxury Properties",

//         type:
//           type || "Home",

//         mainImage:
//           finalMainImage,

//         sliderImages:
//           finalSliderImages,

//         size:
//           size.trim(),

//         sizes:
//           finalSizes,

//         price:
//           price.trim(),

//         oldPrice:
//           oldPrice || "",

//         description:
//           description || "",

//         isNew:
//           Boolean(isNew),

//         // IMPORTANT
//         // Admin/SubAdmin who created it
//         createdBy:
//           userId,
//       });


//     const savedProperty =
//       await property.save();


//     // ==================================================
//     // EMAIL - ALL ADMINS
//     // ==================================================

//     try {
//       await notifyAdmins({
//         subject:
//           "Modern Real Estate - New Luxury Property",

//         message: `A new luxury property has been added.

// Property: ${savedProperty.title}
// Category: ${savedProperty.category}
// Type: ${savedProperty.type}
// Size: ${savedProperty.size}
// Price: Rs. ${savedProperty.price}

// Property ID: ${savedProperty.id}

// A new luxury property is now available on Modern Real Estate.`,

//         type:
//           "luxury_property_created",

//         propertyId:
//           String(savedProperty.id),
//       });
//     } catch (emailError) {
//       console.error(
//         "LUXURY CREATE ADMIN EMAIL ERROR:",
//         emailError
//       );
//     }


//     // ==================================================
//     // EMAIL - PREVIOUS BUYERS OF SAME OWNER
//     // ==================================================

//     try {
//       if (userId) {
//         await notifyPreviousBuyersByOwner({
//           ownerId:
//             String(userId),

//           subject:
//             "Modern Real Estate - New Luxury Property",

//           message: `Hello,

// A new luxury property has been added by an owner whose property you previously purchased.

// Property: ${savedProperty.title}
// Category: ${savedProperty.category}
// Type: ${savedProperty.type}
// Size: ${savedProperty.size}
// Price: Rs. ${savedProperty.price}

// Please visit Modern Real Estate to view the new luxury property.`,

//           type:
//             "luxury_property_created",

//           propertyId:
//             String(savedProperty.id),

//           productType:
//             "luxury",
//         });
//       }
//     } catch (emailError) {
//       console.error(
//         "LUXURY CREATE BUYER EMAIL ERROR:",
//         emailError
//       );
//     }


//     // ==================================================
//     // EMAIL - ALL REGISTERED CUSTOMERS
//     // ==================================================

//     try {
//       await notifyAllCustomers({
//         subject:
//           "Modern Real Estate - New Luxury Property Available",

//         message: `A new luxury property has been added to Modern Real Estate.

// Property: ${savedProperty.title}
// Category: ${savedProperty.category}
// Type: ${savedProperty.type}
// Size: ${savedProperty.size}
// Price: Rs. ${savedProperty.price}

// Property ID: ${savedProperty.id}

// A new luxury property is now available.

// Please visit Modern Real Estate to view this new property.`,

//         type:
//           "luxury_property_created_customer",

//         propertyId:
//           String(savedProperty.id),
//       });
//     } catch (emailError) {
//       console.error(
//         "LUXURY CREATE CUSTOMER EMAIL ERROR:",
//         emailError
//       );
//     }


//     // ==================================================
//     // RESPONSE
//     // ==================================================

//     res.status(201).json(
//       savedProperty
//     );

//   } catch (error) {
//     console.error(
//       "CREATE Luxury Property Error:",
//       error
//     );

//     res.status(500).json({
//       message: "Failed to create property",
//       error: error.message,
//     });
//   }
// };


// // ======================================================
// // UPDATE
// // ADMIN + SUBADMIN
// // ======================================================

// const updateLuxuriousProperty = async (
//   req,
//   res
// ) => {
//   try {
//     const property =
//       await LuxuriousProperties.findOne({
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
//     // SUBADMIN OWNERSHIP CHECK
//     // ==================================================

//     if (req.user.role === "subAdmin") {
//       const userId =
//         req.user?.userId ||
//         req.user?._id ||
//         req.user?.id;

//       if (
//         !property.createdBy ||
//         !userId ||
//         property.createdBy.toString() !==
//           userId.toString()
//       ) {
//         return res.status(403).json({
//           success: false,
//           message:
//             "You can only manage your own luxury properties",
//         });
//       }
//     }


//     // ==================================================
//     // GET BODY
//     // ==================================================

//     const {
//       title,
//       category,
//       type,
//       mainImage,
//       sliderImages,
//       size,
//       sizes,
//       price,
//       oldPrice,
//       description,
//       isNew,
//     } = req.body;


//     // ==================================================
//     // UPDATE FIELDS
//     // ==================================================

//     if (title !== undefined) {
//       property.title =
//         title.trim();
//     }


//     if (category !== undefined) {
//       property.category =
//         category;
//     }


//     if (type !== undefined) {
//       property.type =
//         type;
//     }


//     if (mainImage !== undefined) {
//       property.mainImage =
//         mainImage;
//     }


//     if (Array.isArray(sliderImages)) {
//       property.sliderImages =
//         sliderImages.slice(0, 4);
//     }


//     if (size !== undefined) {
//       property.size =
//         size.trim();
//     }


//     if (Array.isArray(sizes)) {
//       property.sizes =
//         sizes;
//     }


//     if (price !== undefined) {
//       property.price =
//         price.trim();
//     }


//     if (oldPrice !== undefined) {
//       property.oldPrice =
//         oldPrice;
//     }


//     if (description !== undefined) {
//       property.description =
//         description;
//     }


//     if (typeof isNew === "boolean") {
//       property.isNew =
//         isNew;
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
//           "Modern Real Estate - Luxury Property Updated",

//         message: `A luxury property has been updated.

// Property: ${updatedProperty.title}
// Category: ${updatedProperty.category}
// Type: ${updatedProperty.type}
// Size: ${updatedProperty.size}
// Price: Rs. ${updatedProperty.price}

// Property ID: ${updatedProperty.id}

// Please check the updated luxury property details.`,

//         type:
//           "luxury_property_updated",

//         propertyId:
//           String(updatedProperty.id),
//       });
//     } catch (emailError) {
//       console.error(
//         "LUXURY UPDATE ADMIN EMAIL ERROR:",
//         emailError
//       );
//     }


//     // ==================================================
//     // EMAIL - PREVIOUS BUYERS
//     // ==================================================

//     try {
//       await notifyPreviousBuyersOfProperty({
//         propertyId:
//           String(updatedProperty.id),

//         subject:
//           "Modern Real Estate - Luxury Property Updated",

//         message: `Hello,

// A luxury property you previously purchased has been updated.

// Property: ${updatedProperty.title}
// Category: ${updatedProperty.category}
// Type: ${updatedProperty.type}
// Size: ${updatedProperty.size}
// Price: Rs. ${updatedProperty.price}

// Please check the updated property details.`,

//         type:
//           "luxury_property_updated",

//         productType:
//           "luxury",
//       });
//     } catch (emailError) {
//       console.error(
//         "LUXURY UPDATE BUYER EMAIL ERROR:",
//         emailError
//       );
//     }


//     // ==================================================
//     // EMAIL - ALL REGISTERED CUSTOMERS
//     // ==================================================

//     try {
//       await notifyAllCustomers({
//         subject:
//           "Modern Real Estate - Luxury Property Updated",

//         message: `A luxury property has been updated on Modern Real Estate.

// Property: ${updatedProperty.title}
// Category: ${updatedProperty.category}
// Type: ${updatedProperty.type}
// Size: ${updatedProperty.size}
// Price: Rs. ${updatedProperty.price}

// Property ID: ${updatedProperty.id}

// The property details have been updated.

// Please visit Modern Real Estate to view the latest property details.`,

//         type:
//           "luxury_property_updated_customer",

//         propertyId:
//           String(updatedProperty.id),
//       });
//     } catch (emailError) {
//       console.error(
//         "LUXURY UPDATE CUSTOMER EMAIL ERROR:",
//         emailError
//       );
//     }


//     // ==================================================
//     // RESPONSE
//     // ==================================================

//     res.status(200).json(
//       updatedProperty
//     );

//   } catch (error) {
//     console.error(
//       "UPDATE Luxury Property Error:",
//       error
//     );

//     res.status(500).json({
//       message:
//         "Failed to update property",
//       error: error.message,
//     });
//   }
// };


// // ======================================================
// // DELETE
// // ADMIN + SUBADMIN
// // ======================================================

// const deleteLuxuriousProperty = async (
//   req,
//   res
// ) => {
//   try {
//     const property =
//       await LuxuriousProperties.findOne({
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
//     // SUBADMIN OWNERSHIP CHECK
//     // ==================================================

//     if (req.user.role === "subAdmin") {
//       const userId =
//         req.user?.userId ||
//         req.user?._id ||
//         req.user?.id;

//       if (
//         !property.createdBy ||
//         !userId ||
//         property.createdBy.toString() !==
//           userId.toString()
//       ) {
//         return res.status(403).json({
//           success: false,
//           message:
//             "You can only manage your own luxury properties",
//         });
//       }
//     }


//     // ==================================================
//     // STORE PROPERTY INFO
//     // ==================================================

//     const propertyId =
//       String(property.id);

//     const propertyTitle =
//       property.title;

//     const propertyPrice =
//       property.price;


//     // ==================================================
//     // EMAIL - ALL ADMINS
//     // ==================================================

//     try {
//       await notifyAdmins({
//         subject:
//           "Modern Real Estate - Luxury Property Deleted",

//         message: `A luxury property has been deleted.

// Property: ${propertyTitle}
// Price: Rs. ${propertyPrice}
// Property ID: ${propertyId}

// The property is no longer available.`,

//         type:
//           "luxury_property_deleted",

//         propertyId,
//       });
//     } catch (emailError) {
//       console.error(
//         "LUXURY DELETE ADMIN EMAIL ERROR:",
//         emailError
//       );
//     }


//     // ==================================================
//     // EMAIL - PREVIOUS BUYERS
//     // ==================================================

//     try {
//       await notifyPreviousBuyersOfProperty({
//         propertyId,

//         subject:
//           "Modern Real Estate - Luxury Property Deleted",

//         message: `Hello,

// A luxury property you previously purchased has been removed from Modern Real Estate.

// Property: ${propertyTitle}
// Property ID: ${propertyId}

// Please contact Modern Real Estate if you need any information about this property.`,

//         type:
//           "luxury_property_deleted",

//         productType:
//           "luxury",
//       });
//     } catch (emailError) {
//       console.error(
//         "LUXURY DELETE BUYER EMAIL ERROR:",
//         emailError
//       );
//     }


//     // ==================================================
//     // DELETE PROPERTY
//     // ==================================================

//     await LuxuriousProperties.findOneAndDelete({
//       id: Number(req.params.id),
//     });


//     // ==================================================
//     // RESPONSE
//     // ==================================================

//     res.status(200).json({
//       message:
//         "Property deleted successfully",

//       property,
//     });

//   } catch (error) {
//     console.error(
//       "DELETE Luxury Property Error:",
//       error
//     );

//     res.status(500).json({
//       message:
//         "Failed to delete property",

//       error: error.message,
//     });
//   }
// };


// // ======================================================
// // EXPORT
// // ======================================================

// module.exports = {
//   getLuxuriousProperties,
//   getLuxuriousProperty,
//   getMyLuxuriousProperties,
//   createLuxuriousProperty,
//   updateLuxuriousProperty,
//   deleteLuxuriousProperty,
// };



const LuxuriousProperties = require("../models/LuxuriousProperties");

const {
  notifyAdmins,
  notifyAllCustomers,
  notifyPreviousBuyersByOwner,
  notifyPreviousBuyersOfProperty,
} = require("../services/notificationService");

// ======================================================
// AVAILABILITY VALIDATION
// ======================================================

const validateAvailability = ({
  totalUnits,
  availableUnits,
  bookedUnits,
}) => {
  if (
    !Number.isInteger(totalUnits) ||
    !Number.isInteger(availableUnits) ||
    !Number.isInteger(bookedUnits)
  ) {
    return {
      valid: false,
      message: "Availability values must be whole numbers.",
    };
  }

  if (
    totalUnits < 0 ||
    availableUnits < 0 ||
    bookedUnits < 0
  ) {
    return {
      valid: false,
      message: "Availability values cannot be negative.",
    };
  }

  if (availableUnits + bookedUnits !== totalUnits) {
    return {
      valid: false,
      message:
        "Available Units + Booked Units must equal Total Units.",
    };
  }

  return {
    valid: true,
  };
};

// ======================================================
// GET ALL
// ======================================================

const getLuxuriousProperties = async (req, res) => {
  try {
    const properties =
      await LuxuriousProperties.find().sort({
        createdAt: -1,
      });

    res.status(200).json(properties);
  } catch (error) {
    console.error(
      "GET Luxurious Properties Error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch luxurious properties",
      error: error.message,
    });
  }
};

// ======================================================
// GET MY LUXURY PROPERTIES
// ADMIN -> ALL
// SUBADMIN -> OWN
// ======================================================

const getMyLuxuriousProperties = async (req, res) => {
  try {
    const userId =
      req.user?.userId ||
      req.user?._id ||
      req.user?.id ||
      null;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found",
      });
    }

    // ADMIN
    if (req.user.role === "admin") {
      const properties =
        await LuxuriousProperties.find().sort({
          createdAt: -1,
        });

      return res.status(200).json(properties);
    }

    // SUBADMIN
    const properties =
      await LuxuriousProperties.find({
        createdBy: userId,
      }).sort({
        createdAt: -1,
      });

    return res.status(200).json(properties);
  } catch (error) {
    console.error(
      "GET MY Luxury Properties Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch your luxury properties",
      error: error.message,
    });
  }
};

// ======================================================
// GET SINGLE
// ======================================================

const getLuxuriousProperty = async (req, res) => {
  try {
    const property =
      await LuxuriousProperties.findOne({
        id: Number(req.params.id),
      });

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    res.status(200).json(property);
  } catch (error) {
    console.error(
      "GET Single Luxury Property Error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch property",
      error: error.message,
    });
  }
};

// ======================================================
// CREATE
// ======================================================

const createLuxuriousProperty = async (
  req,
  res
) => {
  try {
    const {
      title,
      category,
      type,
      mainImage,
      sliderImages,
      size,
      sizes,
      price,
      oldPrice,
      description,
      isNew,

      // AVAILABILITY
      totalUnits,
      availableUnits,
      bookedUnits,
    } = req.body;

    // ==================================================
    // BASIC VALIDATION
    // ==================================================

    if (!title || !size || !price) {
      return res.status(400).json({
        message:
          "Title, size and price are required",
      });
    }

    // ==================================================
    // ADMIN / SUBADMIN ID
    // ==================================================

    const userId =
      req.user?.userId ||
      req.user?._id ||
      req.user?.id ||
      null;

    // ==================================================
    // IMAGES
    // ==================================================

    const finalMainImage =
      mainImage || "";

    const finalSliderImages =
      Array.isArray(sliderImages)
        ? sliderImages.slice(0, 4)
        : [];

    // ==================================================
    // SIZES
    // ==================================================

    const finalSizes =
      Array.isArray(sizes) &&
      sizes.length > 0
        ? sizes
        : [size];

    // ==================================================
    // AVAILABILITY
    // ==================================================

    const finalTotalUnits =
      totalUnits !== undefined &&
      totalUnits !== ""
        ? Number(totalUnits)
        : 1;

    const finalBookedUnits =
      bookedUnits !== undefined &&
      bookedUnits !== ""
        ? Number(bookedUnits)
        : 0;

    const finalAvailableUnits =
      availableUnits !== undefined &&
      availableUnits !== ""
        ? Number(availableUnits)
        : finalTotalUnits - finalBookedUnits;

    const availabilityCheck =
      validateAvailability({
        totalUnits: finalTotalUnits,
        availableUnits: finalAvailableUnits,
        bookedUnits: finalBookedUnits,
      });

    if (!availabilityCheck.valid) {
      return res.status(400).json({
        success: false,
        message: availabilityCheck.message,
      });
    }

    // ==================================================
    // CREATE PROPERTY
    // ==================================================

    const property =
      new LuxuriousProperties({
        id: Date.now(),

        title: title.trim(),

        category:
          category ||
          "Luxury Properties",

        type:
          type ||
          "Home",

        mainImage:
          finalMainImage,

        sliderImages:
          finalSliderImages,

        size:
          size.trim(),

        sizes:
          finalSizes,

        price:
          price.trim(),

        oldPrice:
          oldPrice || "",

        description:
          description || "",

        isNew:
          Boolean(isNew),

        // AVAILABILITY
        totalUnits:
          finalTotalUnits,

        availableUnits:
          finalAvailableUnits,

        bookedUnits:
          finalBookedUnits,

        createdBy:
          userId,
      });

    const savedProperty =
      await property.save();

    // ==================================================
    // EMAIL - ALL ADMINS
    // ==================================================

    try {
      await notifyAdmins({
        subject:
          "Modern Real Estate - New Luxury Property",

        message: `A new luxury property has been added.

Property: ${savedProperty.title}
Category: ${savedProperty.category}
Type: ${savedProperty.type}
Size: ${savedProperty.size}
Price: Rs. ${savedProperty.price}

Total Units: ${savedProperty.totalUnits}
Available Units: ${savedProperty.availableUnits}
Booked Units: ${savedProperty.bookedUnits}

Property ID: ${savedProperty.id}

A new luxury property is now available on Modern Real Estate.`,

        type:
          "luxury_property_created",

        propertyId:
          String(savedProperty.id),
      });
    } catch (emailError) {
      console.error(
        "LUXURY CREATE ADMIN EMAIL ERROR:",
        emailError
      );
    }

    // ==================================================
    // EMAIL - PREVIOUS BUYERS OF SAME OWNER
    // ==================================================

    try {
      if (userId) {
        await notifyPreviousBuyersByOwner({
          ownerId:
            String(userId),

          subject:
            "Modern Real Estate - New Luxury Property",

          message: `Hello,

A new luxury property has been added by an owner whose property you previously purchased.

Property: ${savedProperty.title}
Category: ${savedProperty.category}
Type: ${savedProperty.type}
Size: ${savedProperty.size}
Price: Rs. ${savedProperty.price}

Please visit Modern Real Estate to view the new luxury property.`,

          type:
            "luxury_property_created",

          propertyId:
            String(savedProperty.id),

          productType:
            "luxury",
        });
      }
    } catch (emailError) {
      console.error(
        "LUXURY CREATE BUYER EMAIL ERROR:",
        emailError
      );
    }

    // ==================================================
    // EMAIL - ALL CUSTOMERS
    // ==================================================

    try {
      await notifyAllCustomers({
        subject:
          "Modern Real Estate - New Luxury Property Available",

        message: `A new luxury property has been added to Modern Real Estate.

Property: ${savedProperty.title}
Category: ${savedProperty.category}
Type: ${savedProperty.type}
Size: ${savedProperty.size}
Price: Rs. ${savedProperty.price}

Property ID: ${savedProperty.id}

A new luxury property is now available.

Please visit Modern Real Estate to view this new property.`,

        type:
          "luxury_property_created_customer",

        propertyId:
          String(savedProperty.id),
      });
    } catch (emailError) {
      console.error(
        "LUXURY CREATE CUSTOMER EMAIL ERROR:",
        emailError
      );
    }

    // ==================================================
    // RESPONSE
    // ==================================================

    res.status(201).json(
      savedProperty
    );
  } catch (error) {
    console.error(
      "CREATE Luxury Property Error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to create property",
      error: error.message,
    });
  }
};

// ======================================================
// UPDATE
// ======================================================

const updateLuxuriousProperty = async (
  req,
  res
) => {
  try {
    const property =
      await LuxuriousProperties.findOne({
        id: Number(req.params.id),
      });

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    // ==================================================
    // SUBADMIN OWNERSHIP CHECK
    // ==================================================

    if (req.user.role === "subAdmin") {
      const userId =
        req.user?.userId ||
        req.user?._id ||
        req.user?.id;

      if (
        !property.createdBy ||
        !userId ||
        property.createdBy.toString() !==
          userId.toString()
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You can only manage your own luxury properties",
        });
      }
    }

    // ==================================================
    // BODY
    // ==================================================

    const {
      title,
      category,
      type,
      mainImage,
      sliderImages,
      size,
      sizes,
      price,
      oldPrice,
      description,
      isNew,

      // AVAILABILITY
      totalUnits,
      availableUnits,
      bookedUnits,
    } = req.body;

    // ==================================================
    // NORMAL FIELDS
    // ==================================================

    if (title !== undefined) {
      property.title =
        title.trim();
    }

    if (category !== undefined) {
      property.category =
        category;
    }

    if (type !== undefined) {
      property.type =
        type;
    }

    if (mainImage !== undefined) {
      property.mainImage =
        mainImage;
    }

    if (Array.isArray(sliderImages)) {
      property.sliderImages =
        sliderImages.slice(0, 4);
    }

    if (size !== undefined) {
      property.size =
        size.trim();
    }

    if (Array.isArray(sizes)) {
      property.sizes =
        sizes;
    }

    if (price !== undefined) {
      property.price =
        price.trim();
    }

    if (oldPrice !== undefined) {
      property.oldPrice =
        oldPrice;
    }

    if (description !== undefined) {
      property.description =
        description;
    }

    if (typeof isNew === "boolean") {
      property.isNew =
        isNew;
    }

    // ==================================================
    // AVAILABILITY
    // ==================================================

    let finalTotalUnits =
      Number(
        property.totalUnits ?? 1
      );

    let finalAvailableUnits =
      Number(
        property.availableUnits ??
          finalTotalUnits
      );

    let finalBookedUnits =
      Number(
        property.bookedUnits ?? 0
      );

    if (
      totalUnits !== undefined &&
      totalUnits !== ""
    ) {
      finalTotalUnits =
        Number(totalUnits);
    }

    if (
      availableUnits !== undefined &&
      availableUnits !== ""
    ) {
      finalAvailableUnits =
        Number(availableUnits);
    }

    if (
      bookedUnits !== undefined &&
      bookedUnits !== ""
    ) {
      finalBookedUnits =
        Number(bookedUnits);
    }

    const availabilityCheck =
      validateAvailability({
        totalUnits:
          finalTotalUnits,

        availableUnits:
          finalAvailableUnits,

        bookedUnits:
          finalBookedUnits,
      });

    if (!availabilityCheck.valid) {
      return res.status(400).json({
        success: false,
        message:
          availabilityCheck.message,
      });
    }

    property.totalUnits =
      finalTotalUnits;

    property.availableUnits =
      finalAvailableUnits;

    property.bookedUnits =
      finalBookedUnits;

    // ==================================================
    // SAVE
    // ==================================================

    const updatedProperty =
      await property.save();

    // ==================================================
    // EMAIL - ADMINS
    // ==================================================

    try {
      await notifyAdmins({
        subject:
          "Modern Real Estate - Luxury Property Updated",

        message: `A luxury property has been updated.

Property: ${updatedProperty.title}
Category: ${updatedProperty.category}
Type: ${updatedProperty.type}
Size: ${updatedProperty.size}
Price: Rs. ${updatedProperty.price}

Total Units: ${updatedProperty.totalUnits}
Available Units: ${updatedProperty.availableUnits}
Booked Units: ${updatedProperty.bookedUnits}

Property ID: ${updatedProperty.id}

Please check the updated luxury property details.`,

        type:
          "luxury_property_updated",

        propertyId:
          String(updatedProperty.id),
      });
    } catch (emailError) {
      console.error(
        "LUXURY UPDATE ADMIN EMAIL ERROR:",
        emailError
      );
    }

    // ==================================================
    // EMAIL - PREVIOUS BUYERS
    // ==================================================

    try {
      await notifyPreviousBuyersOfProperty({
        propertyId:
          String(updatedProperty.id),

        subject:
          "Modern Real Estate - Luxury Property Updated",

        message: `Hello,

A luxury property you previously purchased has been updated.

Property: ${updatedProperty.title}
Category: ${updatedProperty.category}
Type: ${updatedProperty.type}
Size: ${updatedProperty.size}
Price: Rs. ${updatedProperty.price}

Please check the updated property details.`,

        type:
          "luxury_property_updated",

        productType:
          "luxury",
      });
    } catch (emailError) {
      console.error(
        "LUXURY UPDATE BUYER EMAIL ERROR:",
        emailError
      );
    }

    // ==================================================
    // EMAIL - ALL CUSTOMERS
    // ==================================================

    try {
      await notifyAllCustomers({
        subject:
          "Modern Real Estate - Luxury Property Updated",

        message: `A luxury property has been updated on Modern Real Estate.

Property: ${updatedProperty.title}
Category: ${updatedProperty.category}
Type: ${updatedProperty.type}
Size: ${updatedProperty.size}
Price: Rs. ${updatedProperty.price}

Property ID: ${updatedProperty.id}

The property details have been updated.`,

        type:
          "luxury_property_updated_customer",

        propertyId:
          String(updatedProperty.id),
      });
    } catch (emailError) {
      console.error(
        "LUXURY UPDATE CUSTOMER EMAIL ERROR:",
        emailError
      );
    }

    // ==================================================
    // RESPONSE
    // ==================================================

    res.status(200).json(
      updatedProperty
    );
  } catch (error) {
    console.error(
      "UPDATE Luxury Property Error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to update property",
      error: error.message,
    });
  }
};

// ======================================================
// DELETE
// ======================================================

const deleteLuxuriousProperty = async (
  req,
  res
) => {
  try {
    const property =
      await LuxuriousProperties.findOne({
        id: Number(req.params.id),
      });

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    // ==================================================
    // SUBADMIN OWNERSHIP CHECK
    // ==================================================

    if (req.user.role === "subAdmin") {
      const userId =
        req.user?.userId ||
        req.user?._id ||
        req.user?.id;

      if (
        !property.createdBy ||
        !userId ||
        property.createdBy.toString() !==
          userId.toString()
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You can only manage your own luxury properties",
        });
      }
    }

    const propertyId =
      String(property.id);

    const propertyTitle =
      property.title;

    const propertyPrice =
      property.price;

    // ==================================================
    // EMAIL - ADMINS
    // ==================================================

    try {
      await notifyAdmins({
        subject:
          "Modern Real Estate - Luxury Property Deleted",

        message: `A luxury property has been deleted.

Property: ${propertyTitle}
Price: Rs. ${propertyPrice}
Property ID: ${propertyId}

The property is no longer available.`,

        type:
          "luxury_property_deleted",

        propertyId,
      });
    } catch (emailError) {
      console.error(
        "LUXURY DELETE ADMIN EMAIL ERROR:",
        emailError
      );
    }

    // ==================================================
    // EMAIL - PREVIOUS BUYERS
    // ==================================================

    try {
      await notifyPreviousBuyersOfProperty({
        propertyId,

        subject:
          "Modern Real Estate - Luxury Property Deleted",

        message: `Hello,

A luxury property you previously purchased has been removed from Modern Real Estate.

Property: ${propertyTitle}
Property ID: ${propertyId}

Please contact Modern Real Estate if you need any information about this property.`,

        type:
          "luxury_property_deleted",

        productType:
          "luxury",
      });
    } catch (emailError) {
      console.error(
        "LUXURY DELETE BUYER EMAIL ERROR:",
        emailError
      );
    }

    // ==================================================
    // DELETE
    // ==================================================

    await LuxuriousProperties.findOneAndDelete({
      id: Number(req.params.id),
    });

    res.status(200).json({
      message:
        "Property deleted successfully",

      property,
    });
  } catch (error) {
    console.error(
      "DELETE Luxury Property Error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to delete property",

      error: error.message,
    });
  }
};

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  getLuxuriousProperties,
  getLuxuriousProperty,
  getMyLuxuriousProperties,
  createLuxuriousProperty,
  updateLuxuriousProperty,
  deleteLuxuriousProperty,
};