


// const EmailNotification = require("../models/EmailNotification");
// const User = require("../models/userModel");
// const Order = require("../models/orderModel");

// // ======================================================
// // GET ALL ADMIN USERS
// // ======================================================

// const getAdminRecipients = async () => {
//   const admins = await User.find({
//     role: "admin",
//     email: {
//       $exists: true,
//       $ne: "",
//     },
//   }).select(
//     "email firstName lastName"
//   );

//   return admins;
// };

// // ======================================================
// // NOTIFY ONE USER
// // ======================================================

// const notifyUser = async ({
//   email,
//   role = "customer",
//   subject,
//   message,
//   type = "general",
//   propertyId = "",
//   userId = "",
// }) => {
//   const {
//     sendNotificationEmail,
//   } = require("./emailService");

//   if (!email) {
//     return {
//       success: false,
//       message:
//         "Recipient email is required",
//     };
//   }

//   return await sendNotificationEmail({
//     recipient: email,
//     recipientRole: role,
//     subject,
//     message,
//     type,
//     propertyId,
//     userId,
//   });
// };

// // ======================================================
// // NOTIFY ALL ADMINS
// // ======================================================

// const notifyAdmins = async ({
//   subject,
//   message,
//   type = "general",
//   propertyId = "",
// }) => {
//   try {
//     const admins =
//       await getAdminRecipients();

//     if (!admins.length) {
//       return {
//         success: true,
//         message:
//           "No admin users found",
//         results: [],
//       };
//     }

//     const results = [];

//     for (const admin of admins) {
//       const result =
//         await notifyUser({
//           email: admin.email,
//           role: "admin",
//           subject,
//           message,
//           type,
//           propertyId,
//           userId:
//             admin._id.toString(),
//         });

//       results.push({
//         email: admin.email,
//         success: result.success,
//       });
//     }

//     return {
//       success: true,
//       results,
//     };
//   } catch (error) {
//     console.error(
//       "NOTIFY ADMINS ERROR:",
//       error
//     );

//     return {
//       success: false,
//       message:
//         error.message ||
//         "Failed to notify admins",
//     };
//   }
// };

// // ======================================================
// // GET PREVIOUS BUYERS BY OWNER
// // ======================================================

// const getPreviousBuyersByOwner = async (
//   ownerId,
//   productType = "property"
// ) => {
//   try {
//     if (!ownerId) {
//       return [];
//     }

//     const orders =
//       await Order.find({
//         "customer.type":
//           "registered",

//         "customer.userId": {
//           $ne: null,
//         },

//         items: {
//           $elemMatch: {
//             productType,
//             createdBy:
//               ownerId.toString(),
//           },
//         },
//       }).select("customer");

//     const uniqueUsers =
//       new Map();

//     for (const order of orders) {
//       const customer =
//         order.customer;

//       if (
//         !customer ||
//         !customer.userId ||
//         !customer.email
//       ) {
//         continue;
//       }

//       const userId =
//         String(customer.userId);

//       if (
//         !uniqueUsers.has(userId)
//       ) {
//         uniqueUsers.set(
//           userId,
//           {
//             userId,
//             email:
//               customer.email,
//             name:
//               customer.name || "",
//           }
//         );
//       }
//     }

//     return Array.from(
//       uniqueUsers.values()
//     );
//   } catch (error) {
//     console.error(
//       "GET PREVIOUS BUYERS BY OWNER ERROR:",
//       error
//     );

//     return [];
//   }
// };

// // ======================================================
// // NOTIFY PREVIOUS BUYERS BY OWNER
// // ======================================================

// const notifyPreviousBuyersByOwner =
//   async ({
//     ownerId,
//     subject,
//     message,
//     type = "general",
//     propertyId = "",
//     productType = "property",
//   }) => {
//     try {
//       if (!ownerId) {
//         return {
//           success: false,
//           message:
//             "Owner ID is required",
//           results: [],
//         };
//       }

//       const buyers =
//         await getPreviousBuyersByOwner(
//           ownerId,
//           productType
//         );

//       if (!buyers.length) {
//         return {
//           success: true,
//           message:
//             "No previous buyers found for this owner",
//           results: [],
//         };
//       }

//       const results = [];

//       for (const buyer of buyers) {
//         const result =
//           await notifyUser({
//             email: buyer.email,
//             role: "buyer",
//             subject,
//             message,
//             type,
//             propertyId,
//             userId:
//               buyer.userId,
//           });

//         results.push({
//           email: buyer.email,
//           userId: buyer.userId,
//           success:
//             result.success,
//         });
//       }

//       return {
//         success: true,
//         count: buyers.length,
//         results,
//       };
//     } catch (error) {
//       console.error(
//         "NOTIFY PREVIOUS BUYERS BY OWNER ERROR:",
//         error
//       );

//       return {
//         success: false,
//         message:
//           error.message ||
//           "Failed to notify previous buyers",
//         results: [],
//       };
//     }
//   };

// // ======================================================
// // GET PREVIOUS BUYERS OF PROPERTY
// // ======================================================

// const getPreviousBuyersOfProperty =
//   async (
//     propertyId,
//     productType = "property"
//   ) => {
//     try {
//       if (!propertyId) {
//         return [];
//       }

//       const orders =
//         await Order.find({
//           "customer.type":
//             "registered",

//           "customer.userId": {
//             $ne: null,
//           },

//           items: {
//             $elemMatch: {
//               productType,
//               productId:
//                 String(propertyId),
//             },
//           },
//         }).select("customer");

//       const uniqueUsers =
//         new Map();

//       for (const order of orders) {
//         const customer =
//           order.customer;

//         if (
//           !customer ||
//           !customer.userId ||
//           !customer.email
//         ) {
//           continue;
//         }

//         const userId =
//           String(customer.userId);

//         if (
//           !uniqueUsers.has(userId)
//         ) {
//           uniqueUsers.set(
//             userId,
//             {
//               userId,
//               email:
//                 customer.email,
//               name:
//                 customer.name || "",
//             }
//           );
//         }
//       }

//       return Array.from(
//         uniqueUsers.values()
//       );
//     } catch (error) {
//       console.error(
//         "GET PREVIOUS BUYERS OF PROPERTY ERROR:",
//         error
//       );

//       return [];
//     }
//   };

// // ======================================================
// // NOTIFY PREVIOUS BUYERS OF PROPERTY
// // ======================================================

// const notifyPreviousBuyersOfProperty =
//   async ({
//     propertyId,
//     subject,
//     message,
//     type = "general",
//     productType = "property",
//   }) => {
//     try {
//       if (!propertyId) {
//         return {
//           success: false,
//           message:
//             "Property ID is required",
//           results: [],
//         };
//       }

//       const buyers =
//         await getPreviousBuyersOfProperty(
//           propertyId,
//           productType
//         );

//       if (!buyers.length) {
//         return {
//           success: true,
//           message:
//             "No previous buyers found for this property",
//           results: [],
//         };
//       }

//       const results = [];

//       for (const buyer of buyers) {
//         const result =
//           await notifyUser({
//             email: buyer.email,
//             role: "buyer",
//             subject,
//             message,
//             type,
//             propertyId:
//               String(propertyId),
//             userId:
//               buyer.userId,
//           });

//         results.push({
//           email: buyer.email,
//           userId: buyer.userId,
//           success:
//             result.success,
//         });
//       }

//       return {
//         success: true,
//         count: buyers.length,
//         results,
//       };
//     } catch (error) {
//       console.error(
//         "NOTIFY PREVIOUS BUYERS OF PROPERTY ERROR:",
//         error
//       );

//       return {
//         success: false,
//         message:
//           error.message ||
//           "Failed to notify previous property buyers",
//         results: [],
//       };
//     }
//   };

// // ======================================================
// // EXPORT
// // ======================================================

// module.exports = {
//   getAdminRecipients,
//   notifyUser,
//   notifyAdmins,

//   getPreviousBuyersByOwner,
//   notifyPreviousBuyersByOwner,

//   getPreviousBuyersOfProperty,
//   notifyPreviousBuyersOfProperty,
// };




const EmailNotification = require("../models/EmailNotification");
const User = require("../models/userModel");
const Order = require("../models/orderModel");

// ======================================================
// GET ALL ADMINS
// ======================================================

const getAdminRecipients = async () => {
  const admins = await User.find({
    role: "admin",
    email: {
      $exists: true,
      $ne: "",
    },
  }).select("email firstName lastName");

  return admins;
};

// ======================================================
// GET ALL CUSTOMERS
// ======================================================

const getCustomerRecipients = async () => {
  const customers = await User.find({
    role: "customer",
    email: {
      $exists: true,
      $ne: "",
    },
  }).select("email firstName lastName");

  return customers;
};

// ======================================================
// NOTIFY ONE USER
// ======================================================

const notifyUser = async ({
  email,
  role = "customer",
  subject,
  message,
  type = "general",
  propertyId = "",
  userId = "",
}) => {
  const { sendNotificationEmail } = require("./emailService");

  if (!email) {
    return {
      success: false,
      message: "Recipient email is required",
    };
  }

  return await sendNotificationEmail({
    recipient: email,
    recipientRole: role,
    subject,
    message,
    type,
    propertyId,
    userId,
  });
};

// ======================================================
// NOTIFY ALL ADMINS
// ======================================================

const notifyAdmins = async ({
  subject,
  message,
  type = "general",
  propertyId = "",
}) => {
  try {
    const admins = await getAdminRecipients();

    if (!admins.length) {
      console.log("No admin recipients found.");

      return {
        success: true,
        count: 0,
        results: [],
      };
    }

    const results = [];

    for (const admin of admins) {
      try {
        const adminName =
          [admin.firstName, admin.lastName]
            .filter(Boolean)
            .join(" ") || "Admin";

        const personalizedMessage = `Hello ${adminName},

${message}

Thank you,
Modern Real Estate`;

        const result = await notifyUser({
          email: admin.email,
          role: "admin",
          subject,
          message: personalizedMessage,
          type,
          propertyId,
          userId: admin._id.toString(),
        });

        results.push({
          email: admin.email,
          userId: admin._id.toString(),
          success: result?.success === true,
        });
      } catch (adminError) {
        console.error(
          `ADMIN EMAIL ERROR (${admin.email}):`,
          adminError
        );

        results.push({
          email: admin.email,
          success: false,
          error:
            adminError.message ||
            "Admin email failed",
        });
      }
    }

    return {
      success: true,
      count: admins.length,
      results,
    };
  } catch (error) {
    console.error(
      "NOTIFY ADMINS ERROR:",
      error
    );

    return {
      success: false,
      message:
        error.message ||
        "Failed to notify admins",
      results: [],
    };
  }
};

// ======================================================
// NOTIFY ALL CUSTOMERS
// ======================================================

const notifyAllCustomers = async ({
  subject,
  message,
  type = "general",
  propertyId = "",
}) => {
  try {
    const customers =
      await getCustomerRecipients();

    if (!customers.length) {
      console.log(
        "No registered customers found for email notification."
      );

      return {
        success: true,
        count: 0,
        results: [],
      };
    }

    const results = [];

    for (const customer of customers) {
      try {
        const customerName =
          [customer.firstName, customer.lastName]
            .filter(Boolean)
            .join(" ") || "Customer";

        const personalizedMessage = `Hello ${customerName},

${message}

Thank you,
Modern Real Estate`;

        const result = await notifyUser({
          email: customer.email,
          role: "customer",
          subject,
          message: personalizedMessage,
          type,
          propertyId,
          userId: customer._id.toString(),
        });

        results.push({
          email: customer.email,
          userId: customer._id.toString(),
          success: result?.success === true,
        });
      } catch (customerError) {
        console.error(
          `CUSTOMER EMAIL ERROR (${customer.email}):`,
          customerError
        );

        results.push({
          email: customer.email,
          success: false,
          error:
            customerError.message ||
            "Customer email failed",
        });
      }
    }

    return {
      success: true,
      count: customers.length,
      results,
    };
  } catch (error) {
    console.error(
      "NOTIFY ALL CUSTOMERS ERROR:",
      error
    );

    return {
      success: false,
      message:
        error.message ||
        "Failed to notify all customers",
      results: [],
    };
  }
};

// ======================================================
// GET PREVIOUS BUYERS BY OWNER
// ======================================================

const getPreviousBuyersByOwner = async ({
  ownerId,
  productType = "property",
}) => {
  try {
    if (!ownerId) {
      return [];
    }

    const orders = await Order.find({
      "customer.type": "registered",
      "items.productType": productType,
      "items.createdBy": ownerId,
    }).select("customer");

    const buyersMap = new Map();

    for (const order of orders) {
      const customer = order.customer;

      if (
        customer?.email &&
        !buyersMap.has(customer.email.toLowerCase())
      ) {
        buyersMap.set(
          customer.email.toLowerCase(),
          {
            email: customer.email,
            userId: customer.userId || "",
            firstName:
              customer.firstName || "",
            lastName:
              customer.lastName || "",
          }
        );
      }
    }

    return Array.from(buyersMap.values());
  } catch (error) {
    console.error(
      "GET PREVIOUS BUYERS BY OWNER ERROR:",
      error
    );

    return [];
  }
};

// ======================================================
// NOTIFY PREVIOUS BUYERS BY OWNER
// ======================================================

const notifyPreviousBuyersByOwner = async ({
  ownerId,
  subject,
  message,
  type = "general",
  productType = "property",
  propertyId = "",
}) => {
  try {
    const buyers =
      await getPreviousBuyersByOwner({
        ownerId,
        productType,
      });

    if (!buyers.length) {
      return {
        success: true,
        count: 0,
        results: [],
      };
    }

    const results = [];

    for (const buyer of buyers) {
      try {
        const buyerName =
          [buyer.firstName, buyer.lastName]
            .filter(Boolean)
            .join(" ") || "Customer";

        const personalizedMessage = `Hello ${buyerName},

${message}

Thank you,
Modern Real Estate`;

        const result = await notifyUser({
          email: buyer.email,
          role: "buyer",
          subject,
          message: personalizedMessage,
          type,
          propertyId,
          userId: buyer.userId || "",
        });

        results.push({
          email: buyer.email,
          success: result?.success === true,
        });
      } catch (buyerError) {
        console.error(
          `PREVIOUS BUYER EMAIL ERROR (${buyer.email}):`,
          buyerError
        );

        results.push({
          email: buyer.email,
          success: false,
          error:
            buyerError.message ||
            "Previous buyer email failed",
        });
      }
    }

    return {
      success: true,
      count: buyers.length,
      results,
    };
  } catch (error) {
    console.error(
      "NOTIFY PREVIOUS BUYERS BY OWNER ERROR:",
      error
    );

    return {
      success: false,
      message:
        error.message ||
        "Failed to notify previous buyers",
      results: [],
    };
  }
};

// ======================================================
// GET PREVIOUS BUYERS OF PROPERTY
// ======================================================

const getPreviousBuyersOfProperty = async ({
  propertyId,
  productType = "property",
}) => {
  try {
    if (!propertyId) {
      return [];
    }

    const orders = await Order.find({
      "customer.type": "registered",
      items: {
        $elemMatch: {
          productType,
          productId: String(propertyId),
        },
      },
    }).select("customer");

    const buyersMap = new Map();

    for (const order of orders) {
      const customer = order.customer;

      if (
        customer?.email &&
        !buyersMap.has(customer.email.toLowerCase())
      ) {
        buyersMap.set(
          customer.email.toLowerCase(),
          {
            email: customer.email,
            userId: customer.userId || "",
            firstName:
              customer.firstName || "",
            lastName:
              customer.lastName || "",
          }
        );
      }
    }

    return Array.from(buyersMap.values());
  } catch (error) {
    console.error(
      "GET PREVIOUS BUYERS OF PROPERTY ERROR:",
      error
    );

    return [];
  }
};

// ======================================================
// NOTIFY PREVIOUS BUYERS OF PROPERTY
// ======================================================

const notifyPreviousBuyersOfProperty = async ({
  propertyId,
  subject,
  message,
  type = "general",
  productType = "property",
}) => {
  try {
    const buyers =
      await getPreviousBuyersOfProperty({
        propertyId,
        productType,
      });

    if (!buyers.length) {
      return {
        success: true,
        count: 0,
        results: [],
      };
    }

    const results = [];

    for (const buyer of buyers) {
      try {
        const buyerName =
          [buyer.firstName, buyer.lastName]
            .filter(Boolean)
            .join(" ") || "Customer";

        const personalizedMessage = `Hello ${buyerName},

${message}

Thank you,
Modern Real Estate`;

        const result = await notifyUser({
          email: buyer.email,
          role: "buyer",
          subject,
          message: personalizedMessage,
          type,
          propertyId: String(propertyId),
          userId: buyer.userId || "",
        });

        results.push({
          email: buyer.email,
          success: result?.success === true,
        });
      } catch (buyerError) {
        console.error(
          `PREVIOUS BUYER PROPERTY EMAIL ERROR (${buyer.email}):`,
          buyerError
        );

        results.push({
          email: buyer.email,
          success: false,
          error:
            buyerError.message ||
            "Previous buyer email failed",
        });
      }
    }

    return {
      success: true,
      count: buyers.length,
      results,
    };
  } catch (error) {
    console.error(
      "NOTIFY PREVIOUS BUYERS OF PROPERTY ERROR:",
      error
    );

    return {
      success: false,
      message:
        error.message ||
        "Failed to notify previous buyers",
      results: [],
    };
  }
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  getAdminRecipients,
  getCustomerRecipients,

  notifyUser,
  notifyAdmins,
  notifyAllCustomers,

  getPreviousBuyersByOwner,
  notifyPreviousBuyersByOwner,

  getPreviousBuyersOfProperty,
  notifyPreviousBuyersOfProperty,
};  