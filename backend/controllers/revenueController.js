
// const Order = require("../models/orderModel");

// // GET /api/revenue/dashboard
// exports.getRevenueDashboard = async (req, res) => {
//   try {
//     const user = req.user;

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Authentication required",
//       });
//     }

//     const role = String(user.role || "").toLowerCase();

//     const isAdmin = role === "admin";
//     const isSubAdmin =
//       role === "subadmin" || role === "sub-admin";

//     if (!isAdmin && !isSubAdmin) {
//       return res.status(403).json({
//         success: false,
//         message: "Access denied",
//       });
//     }

//     // Revenue is calculated only from paid orders.
//     const paidOrders = await Order.find({
//       paymentStatus: "paid",
//     }).lean();

//     const propertyMap = new Map();

//     let totalSales = 0;
//     let adminRevenue = 0;
//     let subAdminRevenue = 0;
//     let propertiesSold = 0;

//     for (const order of paidOrders) {
//       for (const item of order.items || []) {
//         const productType = item.productType || "property";
//         const productId = String(item.productId || "");

//         if (!productId) continue;

//         const ownerId = item.createdBy
//           ? String(item.createdBy)
//           : "";

//         // Sub Admin can only see their own property revenue.
//         if (
//           isSubAdmin &&
//           (!ownerId || ownerId !== String(user._id))
//         ) {
//           continue;
//         }

//         const price = Number(item.price);
//         const quantity = Number(item.quantity);

//         if (
//           !Number.isFinite(price) ||
//           price <= 0 ||
//           !Number.isFinite(quantity) ||
//           quantity <= 0
//         ) {
//           continue;
//         }

//         const sales = price * quantity;
//         const adminShare = sales * 0.20;
//         const subAdminShare = sales * 0.80;

//         const key = `${productType}:${productId}`;

//         if (!propertyMap.has(key)) {
//           propertyMap.set(key, {
//             productId,
//             productType,
//             title: item.title || "Property",
//             image: item.image || "",
//             ownerId,
//             totalSales: 0,
//             adminRevenue: 0,
//             subAdminRevenue: 0,
//             ordersCount: 0,
//           });
//         }

//         const property = propertyMap.get(key);

//         property.totalSales += sales;
//         property.adminRevenue += adminShare;
//         property.subAdminRevenue += subAdminShare;
//         property.ordersCount += 1;

//         totalSales += sales;
//         adminRevenue += adminShare;
//         subAdminRevenue += subAdminShare;
//       }
//     }

//     const properties = Array.from(propertyMap.values());

//     propertiesSold = properties.reduce(
//       (sum, property) => sum + property.ordersCount,
//       0
//     );

//     return res.status(200).json({
//       success: true,
//       data: {
//         role: isAdmin ? "admin" : "subAdmin",
//         totalSales,
//         adminRevenue: isAdmin ? adminRevenue : 0,
//         subAdminRevenue: isAdmin
//           ? subAdminRevenue
//           : properties.reduce(
//               (sum, property) =>
//                 sum + property.subAdminRevenue,
//               0
//             ),
//         propertiesSold,
//         properties: properties.map((property) => ({
//           ...property,
//           myRevenue: property.subAdminRevenue,
//           ownerName: isAdmin
//             ? property.ownerId || "Unknown owner"
//             : "My property",
//         })),
//       },
//     });
//   } catch (error) {
//     console.error("REVENUE DASHBOARD ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to load revenue dashboard",
//     });
//   }
// };



const Order = require("../models/orderModel");
const Property = require("../models/Property");
const LuxuriousProperties = require("../models/LuxuriousProperties");
const PenthouseProperties = require("../models/PenthouseProperties");
const SpaciousLiving = require("../models/SpaciousLiving");
const User = require("../models/userModel");

const isObjectId = (id) =>
  /^[a-f\d]{24}$/i.test(String(id || ""));

const getProduct = async (type, id) => {
  try {
    if (type === "property") {
      return isObjectId(id)
        ? await Property.findById(id).lean()
        : null;
    }

    if (type === "luxury") {
      return await LuxuriousProperties.findOne({
        id: Number(id),
      }).lean();
    }

    if (type === "penthouse") {
      const conditions = [];

      if (Number.isSafeInteger(Number(id))) {
        conditions.push({ id: Number(id) });
      }

      if (isObjectId(id)) {
        conditions.push({ _id: id });
      }

      return conditions.length
        ? await PenthouseProperties.findOne({
            $or: conditions,
          }).lean()
        : null;
    }

    if (type === "spacious") {
      if (!isObjectId(id)) return null;

      const parent = await SpaciousLiving.findOne({
        "sliderProperties._id": id,
      }).lean();

      return (
        parent?.sliderProperties?.find(
          (p) => String(p._id) === String(id)
        ) || null
      );
    }

    return null;
  } catch (error) {
    console.error("REVENUE PRODUCT LOOKUP:", error.message);
    return null;
  }
};

const getUserName = (user) =>
  user?.name ||
  user?.fullName ||
  user?.username ||
  user?.email ||
  "Unknown owner";

exports.getRevenueDashboard = async (req, res) => {
  try {
    const currentUser = req.user;

    if (!currentUser?._id) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const role = String(currentUser.role || "").toLowerCase();
    const isAdmin = role === "admin";
    const isSubAdmin =
      role === "subadmin" || role === "sub-admin";

    if (!isAdmin && !isSubAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view revenue",
      });
    }

    const orders = await Order.find({
      paymentStatus: "paid",
    }).lean();

    const productCache = new Map();
    const userCache = new Map();
    const rows = new Map();

    let totalSales = 0;
    let adminRevenue = 0;
    let subAdminRevenue = 0;

    const loadUser = async (id) => {
      if (!id) return null;

      if (!userCache.has(String(id))) {
        const found = isObjectId(id)
          ? await User.findById(id)
              .select("name fullName username email role")
              .lean()
          : null;

        userCache.set(String(id), found);
      }

      return userCache.get(String(id));
    };

    for (const order of orders) {
      for (const item of order.items || []) {
        const productType = item.productType || "property";
        const productId = String(item.productId || "");

        if (!productId) continue;

        const key = `${productType}:${productId}`;

        if (!productCache.has(key)) {
          productCache.set(
            key,
            await getProduct(productType, productId)
          );
        }

        const product = productCache.get(key);

        // Prefer the current product's owner. Use the saved
        // order owner only if the product record no longer exists.
        const ownerId = String(
          product?.createdBy || item.createdBy || ""
        );

        const owner = await loadUser(ownerId);

        // Only show this Sub Admin's own properties.
        if (
          isSubAdmin &&
          ownerId !== String(currentUser._id)
        ) {
          continue;
        }

        const ownerRole = String(
          owner?.role || ""
        ).toLowerCase();

        const ownerIsAdmin = ownerRole === "admin";

        const price = Number(item.price);
        const quantity = Number(item.quantity);

        if (
          !Number.isFinite(price) ||
          price <= 0 ||
          !Number.isFinite(quantity) ||
          quantity <= 0
        ) {
          continue;
        }

        const sales = price * quantity;
        const adminShare = sales * 0.2;
        const ownerShare = ownerIsAdmin
          ? 0
          : sales * 0.8;

        if (!rows.has(key)) {
          rows.set(key, {
            productId,
            productType,
            title: product?.title || item.title || "Property",
            image:
              product?.mainImage ||
              product?.image ||
              item.image ||
              "",
            ownerId,
            ownerName: ownerIsAdmin
              ? "Admin"
              : getUserName(owner),
            totalSales: 0,
            adminRevenue: 0,
            subAdminRevenue: 0,
            ordersCount: 0,
          });
        }

        const row = rows.get(key);

        row.totalSales += sales;
        row.adminRevenue += adminShare;
        row.subAdminRevenue += ownerShare;
        row.ordersCount += 1;

        totalSales += sales;
        adminRevenue += adminShare;
        subAdminRevenue += ownerShare;
      }
    }

    const properties = Array.from(rows.values());

    return res.status(200).json({
      success: true,
      data: {
        role: isAdmin ? "admin" : "subAdmin",
        totalSales,
        adminRevenue: isAdmin ? adminRevenue : 0,
        subAdminRevenue: subAdminRevenue,
        propertiesSold: properties.reduce(
          (sum, p) => sum + p.ordersCount,
          0
        ),
        properties,
      },
    });
  } catch (error) {
    console.error("REVENUE DASHBOARD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load revenue dashboard",
    });
  }
};
