

// const express = require("express");

// const router = express.Router();

// const {
//   createOrder,
//   getOrders,
//   getOrderById,
//   deleteOrder,
//   updateOrderStatus,
//   updatePaymentStatus,
// } = require("../controllers/orderController");

// const {
//   protect,
//   authorize,
// } = require("../middleware/authMiddleware");

// router.post("/", createOrder);

// router.get(
//   "/",
//   protect,
//   authorize("admin"),
//   getOrders
// );

// router.get(
//   "/:id",
//   protect,
//   authorize("admin"),
//   getOrderById
// );

// router.put(
//   "/:id/status",
//   protect,
//   authorize("admin"),
//   updateOrderStatus
// );

// router.put(
//   "/:id/payment-status",
//   protect,
//   authorize("admin"),
//   updatePaymentStatus
// );

// router.delete(
//   "/:id",
//   protect,
//   authorize("admin"),
//   deleteOrder
// );

// module.exports = router;



const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrders,
  getOrderById,
  deleteOrder,
  updateOrderStatus,
  updatePaymentStatus,
} = require("../controllers/orderController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// Debug code — imports પછી જ
console.log("ORDER ROUTE HANDLERS:", {
  createOrder: typeof createOrder,
  getOrders: typeof getOrders,
  getOrderById: typeof getOrderById,
  updateOrderStatus: typeof updateOrderStatus,
  updatePaymentStatus: typeof updatePaymentStatus,
  deleteOrder: typeof deleteOrder,
  protect: typeof protect,
  authorize: typeof authorize,
  adminAuthorize:
    typeof authorize === "function"
      ? typeof authorize("admin")
      : "authorize is not a function",
});

// Routes
router.post("/", createOrder);

router.get(
  "/",
  protect,
  authorize("admin"),
  getOrders
);

router.get(
  "/:id",
  protect,
  authorize("admin"),
  getOrderById
);

router.put(
  "/:id/status",
  protect,
  authorize("admin"),
  updateOrderStatus
);

router.put(
  "/:id/payment-status",
  protect,
  authorize("admin"),
  updatePaymentStatus
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteOrder
);

module.exports = router;