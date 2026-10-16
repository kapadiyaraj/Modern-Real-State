




const mongoose = require("mongoose");

const Order = require("../models/orderModel");
const Property = require("../models/Property");
const LuxuriousProperties = require("../models/LuxuriousProperties");
const SpaciousLiving = require("../models/SpaciousLiving");
const PenthouseProperties = require("../models/PenthouseProperties");

const {
  notifyUser,
  notifyAdmins,
} = require("../services/notificationService");

// =====================================================
// PRICE PARSER
// =====================================================

const parsePrice = (value) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (!value) return 0;

  const cleaned = String(value)
    .replace(/₹/g, "")
    .replace(/Rs\.?/gi, "")
    .replace(/,/g, "")
    .replace(/[^\d.-]/g, "")
    .trim();

  const number = Number(cleaned);

  return Number.isFinite(number) ? number : 0;
};

// =====================================================
// VALIDATE QUANTITY
// =====================================================

const validateQuantity = (value) => {
  const quantity = Number(value);

  if (!Number.isInteger(quantity) || quantity < 1) {
    return null;
  }

  return quantity;
};

// =====================================================
// UPDATE PROPERTY AVAILABILITY
// ONLY AFTER PAYMENT = PAID
// =====================================================

const decreasePropertyAvailability = async (item) => {
  const quantity = validateQuantity(item.quantity);

  if (!quantity) {
    throw new Error("Invalid property quantity");
  }

  // ===================================================
  // REGULAR PROPERTY
  // ===================================================

  if (item.productType === "property") {
    const property = await Property.findById(
      item.productId
    );

    if (!property) {
      throw new Error(
        `Property not found: ${item.productId}`
      );
    }

    const available = Number(
      property.availableUnits ?? 1
    );

    const booked = Number(
      property.bookedUnits ?? 0
    );

    if (available <= 0) {
      throw new Error(
        `${property.title} is sold out`
      );
    }

    if (quantity > available) {
      throw new Error(
        `Only ${available} unit(s) are available for ${property.title}`
      );
    }

    property.availableUnits =
      available - quantity;

    property.bookedUnits =
      booked + quantity;

    await property.save();

    return;
  }

  // ===================================================
  // LUXURY PROPERTY
  // ===================================================

  if (item.productType === "luxury") {
    const property =
      await LuxuriousProperties.findOne({
        id: Number(item.productId),
      });

    if (!property) {
      throw new Error(
        `Luxury property not found: ${item.productId}`
      );
    }

    const available = Number(
      property.availableUnits ?? 1
    );

    const booked = Number(
      property.bookedUnits ?? 0
    );

    if (available <= 0) {
      throw new Error(
        `${property.title} is sold out`
      );
    }

    if (quantity > available) {
      throw new Error(
        `Only ${available} unit(s) are available for ${property.title}`
      );
    }

    property.availableUnits =
      available - quantity;

    property.bookedUnits =
      booked + quantity;

    await property.save();

    return;
  }

  // ===================================================
  // PENTHOUSE PROPERTY
  // ===================================================

  if (item.productType === "penthouse") {
    const productId = String(
      item.productId || ""
    ).trim();

    let property = null;

    const numericId = Number(productId);

    // Numeric ID
    if (Number.isFinite(numericId)) {
      property =
        await PenthouseProperties.findOne({
          id: numericId,
        });
    }

    // MongoDB ObjectId
    if (
      !property &&
      mongoose.Types.ObjectId.isValid(productId)
    ) {
      property =
        await PenthouseProperties.findById(
          productId
        );
    }

    if (!property) {
      throw new Error(
        `Penthouse property not found: ${productId}`
      );
    }

    const available = Number(
      property.availableUnits ?? 1
    );

    const booked = Number(
      property.bookedUnits ?? 0
    );

    if (available <= 0) {
      throw new Error(
        `${property.title} is sold out`
      );
    }

    if (quantity > available) {
      throw new Error(
        `Only ${available} unit(s) are available for ${property.title}`
      );
    }

    property.availableUnits =
      available - quantity;

    property.bookedUnits =
      booked + quantity;

    await property.save();

    return;
  }

  // ===================================================
  // SPACIOUS LIVING
  // ===================================================

  if (item.productType === "spacious") {
    const spaciousLiving =
      await SpaciousLiving.findOne();

    if (!spaciousLiving) {
      throw new Error(
        "Spacious Living data not found"
      );
    }

    const property =
      spaciousLiving.sliderProperties.id(
        item.productId
      );

    if (!property) {
      throw new Error(
        `Spacious Living property not found: ${item.productId}`
      );
    }

    const available = Number(
      property.availableUnits ?? 1
    );

    const booked = Number(
      property.bookedUnits ?? 0
    );

    if (available <= 0) {
      throw new Error(
        `${property.title} is sold out`
      );
    }

    if (quantity > available) {
      throw new Error(
        `Only ${available} unit(s) are available for ${property.title}`
      );
    }

    property.availableUnits =
      available - quantity;

    property.bookedUnits =
      booked + quantity;

    await spaciousLiving.save();

    return;
  }

  throw new Error(
    `Unsupported product type: ${item.productType}`
  );
};

// =====================================================
// CREATE ORDER
// =====================================================

exports.createOrder = async (req, res) => {
  try {
    const {
      userId,
      customerType,
      name,
      email,
      phone,
      shippingAddress,
      items,
    } = req.body;

    // =================================================
    // BASIC VALIDATION
    // =================================================

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message:
          "Customer name and email are required",
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message:
          "Shipping address is required",
      });
    }

    if (!shippingAddress.address) {
      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    }

    if (!shippingAddress.city) {
      return res.status(400).json({
        success: false,
        message: "City is required",
      });
    }

    if (!shippingAddress.pincode) {
      return res.status(400).json({
        success: false,
        message: "Pincode is required",
      });
    }

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "At least one item is required",
      });
    }

    // =================================================
    // PREPARE ITEMS
    // =================================================

    const processedItems = [];

    for (const item of items) {
      const productType =
        item.productType || "property";

      const quantity =
        validateQuantity(item.quantity);

      if (!quantity) {
        return res.status(400).json({
          success: false,
          message:
            "Quantity must be a positive whole number.",
        });
      }

      let createdBy =
        item.createdBy || null;

      let finalItemPrice =
        parsePrice(item.price);

      let finalTitle =
        item.title || "";

      let finalImage =
        item.image || "";

      // =================================================
      // REGULAR PROPERTY
      // =================================================

      if (productType === "property") {
        try {
          if (
            !item.productId ||
            !mongoose.Types.ObjectId.isValid(
              String(item.productId)
            )
          ) {
            return res.status(400).json({
              success: false,
              message:
                `Invalid property ID: ${item.productId}`,
            });
          }

          const property =
            await Property.findById(
              item.productId
            ).select(
              "_id title mainImage price createdBy availableUnits bookedUnits totalUnits"
            );

          if (!property) {
            return res.status(404).json({
              success: false,
              message:
                `Property not found: ${item.productId}`,
            });
          }

          finalItemPrice =
            parsePrice(property.price);

          finalTitle =
            property.title || finalTitle;

          finalImage =
            property.mainImage || finalImage;

          createdBy =
            property.createdBy
              ? property.createdBy.toString()
              : null;

          if (finalItemPrice <= 0) {
            return res.status(400).json({
              success: false,
              message:
                "Property price is invalid. Please update the property price before placing the order.",
            });
          }

          // ---------------------------------------------
          // AVAILABILITY VALIDATION
          // ---------------------------------------------

          const available =
            Number(
              property.availableUnits ?? 1
            );

          if (available <= 0) {
            return res.status(400).json({
              success: false,
              message:
                `${property.title} is sold out.`,
            });
          }

          if (quantity > available) {
            return res.status(400).json({
              success: false,
              message:
                `Only ${available} unit(s) available for ${property.title}`,
            });
          }
        } catch (error) {
          console.error(
            "PROPERTY LOOKUP ERROR:",
            error
          );

          return res.status(500).json({
            success: false,
            message:
              "Failed to load property price.",
          });
        }
      }

      // =================================================
      // SPACIOUS LIVING
      // =================================================

      if (productType === "spacious") {
        try {
          const spaciousLiving =
            await SpaciousLiving.findOne();

          if (!spaciousLiving) {
            return res.status(404).json({
              success: false,
              message:
                "Spacious Living data not found.",
            });
          }

          const spaciousProperty =
            spaciousLiving.sliderProperties.id(
              item.productId
            );

          if (!spaciousProperty) {
            return res.status(404).json({
              success: false,
              message:
                `Spacious Living property not found: ${item.productId}`,
            });
          }

          finalItemPrice =
            parsePrice(
              spaciousProperty.price
            );

          finalTitle =
            spaciousProperty.title ||
            finalTitle;

          finalImage =
            spaciousProperty.mainImage ||
            finalImage;

          createdBy =
            spaciousProperty.createdBy
              ? spaciousProperty.createdBy.toString()
              : spaciousLiving.createdBy
              ? spaciousLiving.createdBy.toString()
              : null;

          if (finalItemPrice <= 0) {
            return res.status(400).json({
              success: false,
              message:
                "Spacious Living property price is invalid. Please update the property price before placing the order.",
            });
          }

          // ---------------------------------------------
          // AVAILABILITY VALIDATION
          // ---------------------------------------------

          const available =
            Number(
              spaciousProperty.availableUnits ?? 1
            );

          if (available <= 0) {
            return res.status(400).json({
              success: false,
              message:
                `${spaciousProperty.title} is sold out.`,
            });
          }

          if (quantity > available) {
            return res.status(400).json({
              success: false,
              message:
                `Only ${available} unit(s) available for ${spaciousProperty.title}`,
            });
          }
        } catch (error) {
          console.error(
            "SPACIOUS LIVING LOOKUP ERROR:",
            error
          );

          return res.status(500).json({
            success: false,
            message:
              "Failed to load Spacious Living property price.",
          });
        }
      }

      // =================================================
      // LUXURY PROPERTY
      // =================================================

      if (productType === "luxury") {
        try {
          const numericId =
            Number(item.productId);

          if (!Number.isFinite(numericId)) {
            return res.status(400).json({
              success: false,
              message:
                `Invalid luxury property ID: ${item.productId}`,
            });
          }

          const luxuryProperty =
            await LuxuriousProperties.findOne({
              id: numericId,
            }).select(
              "id title mainImage price createdBy availableUnits bookedUnits totalUnits"
            );

          if (!luxuryProperty) {
            return res.status(404).json({
              success: false,
              message:
                `Luxury property not found: ${item.productId}`,
            });
          }

          finalItemPrice =
            parsePrice(
              luxuryProperty.price
            );

          finalTitle =
            luxuryProperty.title ||
            finalTitle;

          finalImage =
            luxuryProperty.mainImage ||
            finalImage;

          createdBy =
            luxuryProperty.createdBy
              ? luxuryProperty.createdBy.toString()
              : null;

          if (finalItemPrice <= 0) {
            return res.status(400).json({
              success: false,
              message:
                "Luxury property price is invalid. Please update the property price before placing the order.",
            });
          }

          // ---------------------------------------------
          // AVAILABILITY VALIDATION
          // ---------------------------------------------

          const available =
            Number(
              luxuryProperty.availableUnits ?? 1
            );

          if (available <= 0) {
            return res.status(400).json({
              success: false,
              message:
                `${luxuryProperty.title} is sold out.`,
            });
          }

          if (quantity > available) {
            return res.status(400).json({
              success: false,
              message:
                `Only ${available} unit(s) available for ${luxuryProperty.title}`,
            });
          }
        } catch (error) {
          console.error(
            "LUXURY PROPERTY LOOKUP ERROR:",
            error
          );

          return res.status(500).json({
            success: false,
            message:
              "Failed to load luxury property price.",
          });
        }
      }

      // =================================================
      // PENTHOUSE PROPERTY
      // =================================================

      if (productType === "penthouse") {
        try {
          const productId =
            String(
              item.productId || ""
            ).trim();

          if (!productId) {
            return res.status(400).json({
              success: false,
              message:
                "Penthouse product ID is missing.",
            });
          }

          let penthouseProperty = null;

          const numericId =
            Number(productId);

          // ---------------------------------------------
          // NUMERIC ID
          // ---------------------------------------------

          if (
            Number.isFinite(numericId)
          ) {
            penthouseProperty =
              await PenthouseProperties.findOne({
                id: numericId,
              }).select(
                "id _id title image images price createdBy availableUnits bookedUnits totalUnits"
              );
          }

          // ---------------------------------------------
          // MONGODB OBJECT ID
          // ---------------------------------------------

          if (!penthouseProperty) {
            if (
              mongoose.Types.ObjectId.isValid(
                productId
              )
            ) {
              penthouseProperty =
                await PenthouseProperties.findById(
                  productId
                ).select(
                  "id _id title image images price createdBy availableUnits bookedUnits totalUnits"
                );
            }
          }

          if (!penthouseProperty) {
            return res.status(404).json({
              success: false,
              message:
                `Penthouse property not found: ${productId}`,
            });
          }

          finalItemPrice =
            parsePrice(
              penthouseProperty.price
            );

          finalTitle =
            penthouseProperty.title ||
            finalTitle;

          finalImage =
            penthouseProperty.image ||
            finalImage;

          createdBy =
            penthouseProperty.createdBy
              ? penthouseProperty.createdBy.toString()
              : null;

          if (finalItemPrice <= 0) {
            return res.status(400).json({
              success: false,
              message:
                "Penthouse property price is invalid. Please update the penthouse property price before placing the order.",
            });
          }

          // ---------------------------------------------
          // AVAILABILITY VALIDATION
          // ---------------------------------------------

          const available =
            Number(
              penthouseProperty.availableUnits ?? 1
            );

          if (available <= 0) {
            return res.status(400).json({
              success: false,
              message:
                `${penthouseProperty.title} is sold out.`,
            });
          }

          if (quantity > available) {
            return res.status(400).json({
              success: false,
              message:
                `Only ${available} unit(s) available for ${penthouseProperty.title}`,
            });
          }

          console.log(
            "PENTHOUSE ORDER DATA:",
            {
              productId,
              databaseId:
                penthouseProperty.id,
              mongoId:
                penthouseProperty._id,
              title:
                penthouseProperty.title,
              price:
                penthouseProperty.price,
              finalPrice:
                finalItemPrice,
              availableUnits:
                available,
            }
          );
        } catch (error) {
          console.error(
            "PENTHOUSE PROPERTY LOOKUP ERROR:",
            error
          );

          return res.status(500).json({
            success: false,
            message:
              "Failed to load penthouse property price.",
            error:
              process.env.NODE_ENV ===
              "development"
                ? error.message
                : undefined,
          });
        }
      }

      // =================================================
      // FINAL ITEM
      // =================================================

      processedItems.push({
        productId: String(
          item.productId
        ),

        productType,

        title: finalTitle,

        image: finalImage,

        price: finalItemPrice,

        quantity,

        createdBy,
      });
    }

    // =================================================
    // CALCULATE TOTAL
    // =================================================

    const calculatedSubtotal =
      processedItems.reduce(
        (sum, item) => {
          return (
            sum +
            Number(item.price || 0) *
              Number(item.quantity || 1)
          );
        },
        0
      );

    const calculatedShipping = 0;

    const calculatedTaxes = 0;

    const calculatedTotal =
      calculatedSubtotal +
      calculatedShipping +
      calculatedTaxes;

    if (calculatedTotal <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "Order total must be greater than Rs. 0.",
      });
    }

    // =================================================
    // CREATE ORDER
    // =================================================

    const order =
      await Order.create({
        customer: {
          type:
            customerType === "registered"
              ? "registered"
              : "guest",

          userId:
            userId || null,

          name,

          email:
            email.toLowerCase().trim(),

          phone: phone || "",
        },

        shippingAddress,

        items:
          processedItems,

        subtotal:
          calculatedSubtotal,

        shipping:
          calculatedShipping,

        taxes:
          calculatedTaxes,

        total:
          calculatedTotal,

        paymentStatus:
          "pending",

        orderStatus:
          "placed",

        availabilityUpdated:
          false,
      });

    // =================================================
    // CUSTOMER ORDER EMAIL
    // =================================================

    try {
      const customerRole =
        customerType === "registered"
          ? "buyer"
          : "customer";

      const itemText =
        processedItems
          .map(
            (item) =>
              `- ${item.title} (${item.productType}) x ${item.quantity}`
          )
          .join("\n");

      const propertyItem =
        processedItems.find(
          (item) =>
            item.productType ===
              "property" ||
            item.productType ===
              "luxury" ||
            item.productType ===
              "spacious" ||
            item.productType ===
              "penthouse"
        );

      await notifyUser({
        email:
          email.toLowerCase().trim(),

        role:
          customerRole,

        subject:
          "Modern Real Estate - Property Order Placed",

        message: `Hello ${name},

Your property order has been placed successfully.

Order ID: ${order._id}

Customer: ${name}
Email: ${email}

Items:
${itemText}

Total: Rs. ${calculatedTotal.toLocaleString(
          "en-IN"
        )}

Payment Status: Pending
Order Status: Placed

Your order has been successfully received by Modern Real Estate.

Thank you for choosing Modern Real Estate.`,

        type:
          "property_order_placed",

        propertyId:
          propertyItem?.productId || "",

        userId:
          userId || "",
      });
    } catch (error) {
      console.error(
        "CUSTOMER ORDER EMAIL ERROR:",
        error
      );
    }

    // =================================================
    // ADMIN ORDER EMAIL
    // =================================================

    try {
      const itemText =
        processedItems
          .map(
            (item) =>
              `- ${item.title} (${item.productType}) x ${item.quantity}`
          )
          .join("\n");

      const propertyItem =
        processedItems.find(
          (item) =>
            item.productType ===
              "property" ||
            item.productType ===
              "luxury" ||
            item.productType ===
              "spacious" ||
            item.productType ===
              "penthouse"
        );

      await notifyAdmins({
        subject:
          "Modern Real Estate - New Property Order",

        message: `A new property order has been placed.

Customer: ${name}
Email: ${email}
Phone: ${phone || "N/A"}

Order ID: ${order._id}

Items:
${itemText}

Total: Rs. ${calculatedTotal.toLocaleString(
          "en-IN"
        )}

Payment Status: Pending
Order Status: Placed`,

        type:
          "property_order_placed",

        propertyId:
          propertyItem?.productId || "",
      });
    } catch (error) {
      console.error(
        "ADMIN ORDER EMAIL ERROR:",
        error
      );
    }

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(201).json({
      success: true,
      message:
        "Order placed successfully",
      data: order,
    });
  } catch (error) {
    console.error(
      "CREATE ORDER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to create order",
    });
  }
};

// =====================================================
// GET ALL ORDERS
// =====================================================

exports.getOrders = async (
  req,
  res
) => {
  try {
    const orders =
      await Order.find().sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error(
      "GET ORDERS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch orders",
    });
  }
};

// =====================================================
// GET SINGLE ORDER
// =====================================================

exports.getOrderById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const order =
      await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(
      "GET ORDER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch order",
    });
  }
};

// =====================================================
// DELETE ORDER
// =====================================================

exports.deleteOrder = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const order =
      await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found",
      });
    }

    await Order.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message:
        "Order deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE ORDER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to delete order",
    });
  }
};

// =====================================================
// UPDATE PAYMENT STATUS
// =====================================================

// exports.updatePaymentStatus =
//   async (req, res) => {
//     try {
//       const { id } =
//         req.params;

//       const { paymentStatus } =
//         req.body;

//       const allowedPaymentStatuses = [
//         "pending",
//         "paid",
//         "failed",
//       ];

//       if (!paymentStatus) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "Payment status is required",
//         });
//       }

//       if (
//         !allowedPaymentStatuses.includes(
//           paymentStatus
//         )
//       ) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "Invalid payment status. Allowed values: pending, paid, failed",
//         });
//       }

//       const order =
//         await Order.findById(id);

//       if (!order) {
//         return res.status(404).json({
//           success: false,
//           message:
//             "Order not found",
//         });
//       }

//       const oldPaymentStatus =
//         order.paymentStatus;

//       if (
//         oldPaymentStatus ===
//         paymentStatus
//       ) {
//         return res.status(200).json({
//           success: true,
//           message:
//             `Payment is already ${paymentStatus}`,
//           data: order,
//         });
//       }

//       const paymentToOrderStatus = {
//         pending: "pending",
//         paid: "confirmed",
//         failed: "rejected",
//       };

//       const newOrderStatus =
//         paymentToOrderStatus[
//           paymentStatus
//         ];

//       // =================================================
//       // UPDATE AVAILABILITY ONLY WHEN PAYMENT IS PAID
//       // =================================================

//       if (
//         paymentStatus === "paid" &&
//         oldPaymentStatus !== "paid" &&
//         !order.availabilityUpdated
//       ) {
//         try {
//           for (
//             const item of order.items || []
//           ) {
//             await decreasePropertyAvailability(
//               item
//             );
//           }

//           order.availabilityUpdated =
//             true;

//           console.log(
//             "PROPERTY AVAILABILITY UPDATED:",
//             order._id.toString()
//           );
//         } catch (
//           availabilityError
//         ) {
//           console.error(
//             "AVAILABILITY UPDATE ERROR:",
//             availabilityError
//           );

//           return res.status(400).json({
//             success: false,
//             message:
//               availabilityError.message ||
//               "Property availability update failed",
//           });
//         }
//       }

//       // =================================================
//       // UPDATE ORDER
//       // =================================================

//       order.paymentStatus =
//         paymentStatus;

//       order.orderStatus =
//         newOrderStatus;

//       await order.save();

//       // =================================================
//       // PROPERTY ID
//       // =================================================

//       const propertyItem =
//         order.items?.find(
//           (item) =>
//             item.productType ===
//               "property" ||
//             item.productType ===
//               "luxury" ||
//             item.productType ===
//               "spacious" ||
//             item.productType ===
//               "penthouse"
//         );

//       const propertyId =
//         propertyItem?.productId ||
//         "";

//       // =================================================
//       // ITEMS
//       // =================================================

//       const itemText =
//         order.items
//           ?.map(
//             (item) =>
//               `- ${item.title} (${item.productType}) x ${item.quantity}`
//           )
//           .join("\n") ||
//         "No items";

//       // =================================================
//       // PAYMENT EMAIL SUBJECTS
//       // =================================================

//       const paymentSubjects = {
//         pending:
//           "Modern Real Estate - Payment Pending",

//         paid:
//           "Modern Real Estate - Payment Confirmed",

//         failed:
//           "Modern Real Estate - Payment Failed",
//       };

//       const paymentMessages = {
//         pending:
//           "Your payment is currently pending.",

//         paid:
//           "Your payment has been received successfully and your order has been confirmed.",

//         failed:
//           "Your payment could not be verified and your order has been rejected.",
//       };

//       // =================================================
//       // CUSTOMER PAYMENT EMAIL
//       // =================================================

//       try {
//         if (
//           order.customer?.email
//         ) {
//           await notifyUser({
//             email:
//               order.customer.email,

//             role:
//               order.customer.type ===
//               "registered"
//                 ? "buyer"
//                 : "customer",

//             subject:
//               paymentSubjects[
//                 paymentStatus
//               ],

//             message: `Hello ${order.customer.name},

// ${paymentMessages[paymentStatus]}

// Order ID: ${order._id}

// Items:
// ${itemText}

// Total: Rs. ${Number(
//               order.total || 0
//             ).toLocaleString("en-IN")}

// Payment Status: ${
//               paymentStatus
//                 .charAt(0)
//                 .toUpperCase() +
//               paymentStatus.slice(1)
//             }

// Order Status: ${
//               newOrderStatus
//                 .charAt(0)
//                 .toUpperCase() +
//               newOrderStatus.slice(1)
//             }

// Thank you for choosing Modern Real Estate.`,

//             type:
//               `property_payment_${paymentStatus}`,

//             propertyId,

//             userId:
//               order.customer.userId ||
//               "",
//           });
//         }
//       } catch (error) {
//         console.error(
//           "CUSTOMER PAYMENT EMAIL ERROR:",
//           error
//         );
//       }

//       // =================================================
//       // ADMIN PAYMENT EMAIL
//       // =================================================

//       try {
//         await notifyAdmins({
//           subject:
//             `Modern Real Estate - Payment ${
//               paymentStatus
//                 .charAt(0)
//                 .toUpperCase() +
//               paymentStatus.slice(1)
//             }`,

//           message: `Payment status has been updated.

// Customer: ${
//             order.customer?.name ||
//             "N/A"
//           }

// Email: ${
//             order.customer?.email ||
//             "N/A"
//           }

// Order ID: ${order._id}

// Items:
// ${itemText}

// Total: Rs. ${Number(
//             order.total || 0
//           ).toLocaleString("en-IN")}

// Previous Payment Status: ${
//             oldPaymentStatus
//               ? oldPaymentStatus
//                   .charAt(0)
//                   .toUpperCase() +
//                 oldPaymentStatus.slice(1)
//               : "N/A"
//           }

// New Payment Status: ${
//             paymentStatus
//               .charAt(0)
//               .toUpperCase() +
//             paymentStatus.slice(1)
//           }

// Order Status: ${
//             newOrderStatus
//               .charAt(0)
//               .toUpperCase() +
//             newOrderStatus.slice(1)
//           }`,

//           type:
//             `property_payment_${paymentStatus}`,

//           propertyId,
//         });
//       } catch (error) {
//         console.error(
//           "ADMIN PAYMENT EMAIL ERROR:",
//           error
//         );
//       }

//       // =================================================
//       // RESPONSE
//       // =================================================

//       return res.status(200).json({
//         success: true,

//         message:
//           `Payment status updated from ${oldPaymentStatus} to ${paymentStatus}. ` +
//           `Order status automatically changed to ${newOrderStatus}.`,

//         data: order,
//       });
//     } catch (error) {
//       console.error(
//         "UPDATE PAYMENT STATUS ERROR:",
//         error
//       );

//       return res.status(500).json({
//         success: false,

//         message:
//           error.message ||
//           "Failed to update payment status",
//       });
//     }
//   };


// =====================================================
// UPDATE PAYMENT STATUS
// =====================================================


exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    const allowedPaymentStatuses = [
      "pending",
      "paid",
      "failed",
    ];

    if (!paymentStatus) {
      return res.status(400).json({
        success: false,
        message: "Payment status is required",
      });
    }

    if (!allowedPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid payment status. Allowed values: pending, paid, failed",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const oldPaymentStatus = order.paymentStatus;

    if (oldPaymentStatus === paymentStatus) {
      return res.status(200).json({
        success: true,
        message: `Payment is already ${paymentStatus}`,
        data: order,
      });
    }

    // Do not distribute revenue for cancelled or rejected orders.
    if (
      paymentStatus === "paid" &&
      ["cancelled", "rejected"].includes(order.orderStatus)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Cancelled or rejected orders cannot be marked as paid.",
      });
    }

    const paymentToOrderStatus = {
      pending: "pending",
      paid: "confirmed",
      failed: "rejected",
    };

    const newOrderStatus = paymentToOrderStatus[paymentStatus];

    // ================================================
    // UPDATE PROPERTY AVAILABILITY ON PAID PAYMENT
    // ================================================

    if (
      paymentStatus === "paid" &&
      oldPaymentStatus !== "paid" &&
      !order.availabilityUpdated
    ) {
      try {
        for (const item of order.items || []) {
          await decreasePropertyAvailability(item);
        }

        order.availabilityUpdated = true;

        console.log(
          "PROPERTY AVAILABILITY UPDATED:",
          order._id.toString()
        );
      } catch (availabilityError) {
        console.error(
          "AVAILABILITY UPDATE ERROR:",
          availabilityError
        );

        return res.status(400).json({
          success: false,
          message:
            availabilityError.message ||
            "Property availability update failed",
        });
      }
    }

    // ================================================
    // REVENUE DISTRIBUTION — ONLY ON PAID PAYMENT
    // ================================================

    if (
      paymentStatus === "paid" &&
      !order.revenueDistributed
    ) {
      if (!order.items || order.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Order contains no items.",
        });
      }

      let totalAdminAmount = 0;
      let totalSubAdminAmount = 0;

      for (const item of order.items) {
        const price = Number(item.price);
        const quantity = Number(item.quantity);

        if (
          !Number.isFinite(price) ||
          price < 0 ||
          !Number.isInteger(quantity) ||
          quantity < 1
        ) {
          return res.status(400).json({
            success: false,
            message: `Invalid price or quantity for ${item.title}.`,
          });
        }

        const itemTotal = price * quantity;

        // Admin receives 20% of this item
        const adminAmount = Number(
          (itemTotal * 0.20).toFixed(2)
        );

        // The property's Sub Admin receives 80%
        const subAdminAmount = Number(
          (itemTotal - adminAmount).toFixed(2)
        );

        // Save the split on the individual order item
        item.adminAmount = adminAmount;
        item.subAdminAmount = subAdminAmount;

        totalAdminAmount += adminAmount;
        totalSubAdminAmount += subAdminAmount;
      }

      totalAdminAmount = Number(totalAdminAmount.toFixed(2));
      totalSubAdminAmount = Number(totalSubAdminAmount.toFixed(2));

      // Save order-level summary
      order.revenueDistribution = {
        adminPercentage: 20,
        adminAmount: totalAdminAmount,

        subAdminPercentage: 80,
        subAdminAmount: totalSubAdminAmount,

        distributedAt: new Date(),
      };

      order.revenueDistributed = true;
    }

    // ================================================
    // SAVE PAYMENT AND ORDER STATUS
    // ================================================

    order.paymentStatus = paymentStatus;
    order.orderStatus = newOrderStatus;

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("UPDATE PAYMENT STATUS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// =====================================================
// UPDATE ORDER STATUS
// =====================================================

exports.updateOrderStatus =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const { orderStatus } =
        req.body;

      const allowedStatuses = [
        "placed",
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "rejected",
      ];

      if (!orderStatus) {
        return res.status(400).json({
          success: false,
          message:
            "Order status is required",
        });
      }

      if (
        !allowedStatuses.includes(
          orderStatus
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid order status",
        });
      }

      const order =
        await Order.findById(id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message:
            "Order not found",
        });
      }

      const oldStatus =
        order.orderStatus;

      if (
        oldStatus === orderStatus
      ) {
        return res.status(200).json({
          success: true,
          message:
            `Order is already ${orderStatus}`,
          data: order,
        });
      }

      order.orderStatus =
        orderStatus;

      await order.save();

      // =================================================
      // PROPERTY ID
      // =================================================

      const propertyItem =
        order.items?.find(
          (item) =>
            item.productType ===
              "property" ||
            item.productType ===
              "luxury" ||
            item.productType ===
              "spacious" ||
            item.productType ===
              "penthouse"
        );

      const propertyId =
        propertyItem?.productId ||
        "";

      // =================================================
      // ITEMS
      // =================================================

      const itemText =
        order.items
          ?.map(
            (item) =>
              `- ${item.title} (${item.productType}) x ${item.quantity}`
          )
          .join("\n") ||
        "No items";

      // =================================================
      // STATUS SUBJECTS
      // =================================================

      const statusSubjects = {
        placed:
          "Modern Real Estate - Property Order Placed",

        pending:
          "Modern Real Estate - Property Order Pending",

        confirmed:
          "Modern Real Estate - Property Order Confirmed",

        processing:
          "Modern Real Estate - Property Order Processing",

        shipped:
          "Modern Real Estate - Property Order Shipped",

        delivered:
          "Modern Real Estate - Property Order Delivered",

        cancelled:
          "Modern Real Estate - Property Order Cancelled",

        rejected:
          "Modern Real Estate - Property Order Rejected",
      };

      const statusMessages = {
        placed:
          "Your property order has been placed successfully.",

        pending:
          "Your property order is currently pending.",

        confirmed:
          "Your property order has been confirmed successfully.",

        processing:
          "Your property order is now being processed.",

        shipped:
          "Your property order has been shipped.",

        delivered:
          "Your property order has been delivered successfully.",

        cancelled:
          "Your property order has been cancelled.",

        rejected:
          "We regret to inform you that your property order has been rejected.",
      };

      // =================================================
      // CUSTOMER STATUS EMAIL
      // =================================================

      try {
        if (
          order.customer?.email
        ) {
          await notifyUser({
            email:
              order.customer.email,

            role:
              order.customer.type ===
              "registered"
                ? "buyer"
                : "customer",

            subject:
              statusSubjects[
                orderStatus
              ],

            message: `Hello ${order.customer.name},

${statusMessages[orderStatus]}

Order ID: ${order._id}

Items:
${itemText}

Total: Rs. ${Number(
              order.total || 0
            ).toLocaleString("en-IN")}

Payment Status: ${
              order.paymentStatus
                ? order.paymentStatus
                    .charAt(0)
                    .toUpperCase() +
                  order.paymentStatus.slice(
                    1
                  )
                : "Pending"
            }

Order Status: ${
              orderStatus
                .charAt(0)
                .toUpperCase() +
              orderStatus.slice(1)
            }

Thank you for choosing Modern Real Estate.`,

            type:
              `property_order_${orderStatus}`,

            propertyId,

            userId:
              order.customer.userId ||
              "",
          });
        }
      } catch (error) {
        console.error(
          "CUSTOMER STATUS EMAIL ERROR:",
          error
        );
      }

      // =================================================
      // ADMIN STATUS EMAIL
      // =================================================

      try {
        await notifyAdmins({
          subject:
            `Modern Real Estate - Order ${
              orderStatus
                .charAt(0)
                .toUpperCase() +
              orderStatus.slice(1)
            }`,

          message: `Property order status has been updated.

Customer: ${
            order.customer?.name ||
            "N/A"
          }

Email: ${
            order.customer?.email ||
            "N/A"
          }

Order ID: ${order._id}

Items:
${itemText}

Total: Rs. ${Number(
            order.total || 0
          ).toLocaleString("en-IN")}

Previous Status: ${
            oldStatus
              ? oldStatus
                  .charAt(0)
                  .toUpperCase() +
                oldStatus.slice(1)
              : "N/A"
          }

New Status: ${
            orderStatus
              .charAt(0)
              .toUpperCase() +
            orderStatus.slice(1)
          }

Payment Status: ${
            order.paymentStatus
              ? order.paymentStatus
                  .charAt(0)
                  .toUpperCase() +
                order.paymentStatus.slice(
                  1
                )
              : "Pending"
          }`,

          type:
            `property_order_${orderStatus}`,

          propertyId,
        });
      } catch (error) {
        console.error(
          "ADMIN STATUS EMAIL ERROR:",
          error
        );
      }

      // =================================================
      // RESPONSE
      // =================================================

      return res.status(200).json({
        success: true,

        message:
          `Order status updated from ${oldStatus} to ${orderStatus}`,

        data: order,
      });
    } catch (error) {
      console.error(
        "UPDATE ORDER STATUS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          error.message ||
          "Failed to update order status",
      });
    }
  };