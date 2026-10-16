// import React, {
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import {
//   useLocation,
//   useNavigate,
// } from "react-router-dom";

// import "./AdminOrders.css";

// const API_URL =
//   "http://localhost:5000/api/orders";

// const getAuthHeaders = () => {
//   const token =
//     localStorage.getItem("token") ||
//     localStorage.getItem("adminToken") ||
//     localStorage.getItem("accessToken");

//   return token
//     ? {
//         Authorization: `Bearer ${token}`,
//       }
//     : {};
// };

// const isPenthouseItem = (item) =>
//   String(
//     item?.productType || ""
//   ).toLowerCase() === "penthouse";

// const getPenthouseItems = (order) =>
//   (order?.items || []).filter(
//     isPenthouseItem
//   );

// const getPenthouseTotal = (order) =>
//   getPenthouseItems(order).reduce(
//     (sum, item) =>
//       sum +
//       Number(item?.price || 0) *
//         Number(item?.quantity || 1),
//     0
//   );

// const formatCurrency = (value) =>
//   `Rs. ${Number(
//     value || 0
//   ).toLocaleString("en-IN")}`;

// const formatDate = (value) => {
//   if (!value) return "N/A";

//   return new Date(value).toLocaleString(
//     "en-IN"
//   );
// };

// const AdminPenthouseOrders = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] =
//     useState(true);

//   const [error, setError] =
//     useState("");

//   const [success, setSuccess] =
//     useState("");

//   const [search, setSearch] =
//     useState("");

//   const [statusFilter, setStatusFilter] =
//     useState("all");

//   const [currentPage, setCurrentPage] =
//     useState(1);

//   const [selectedOrder, setSelectedOrder] =
//     useState(null);

//   const [updating, setUpdating] =
//     useState(false);

//   const itemsPerPage = 10;

//   // ======================================================
//   // ORDER TYPE DROPDOWN
//   // ======================================================

//   const orderTypeOptions = [
//     {
//       label: "Regular Property",
//       path: "/admin/orders",
//     },
//     {
//       label: "Luxury Property",
//       path: "/admin/luxury-orders",
//     },
//     {
//       label: "Spacious Living",
//       path: "/admin/spacious-orders",
//     },
//     {
//       label: "Penthouse",
//       path: "/admin/penthouse-orders",
//     },
//   ];

//   // ======================================================
//   // FETCH
//   // ======================================================

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await fetch(
//         API_URL,
//         {
//           headers: {
//             ...getAuthHeaders(),
//           },
//         }
//       );

//       const result =
//         await response.json();

//       if (!response.ok) {
//         throw new Error(
//           result?.message ||
//             "Failed to fetch orders"
//         );
//       }

//       const allOrders =
//         Array.isArray(result)
//           ? result
//           : result?.data || [];

//       const penthouseOrders =
//         allOrders.filter(
//           (order) =>
//             getPenthouseItems(order)
//               .length > 0
//         );

//       setOrders(penthouseOrders);
//     } catch (err) {
//       console.error(
//         "PENTHOUSE ORDERS ERROR:",
//         err
//       );

//       setError(
//         err.message ||
//           "Failed to fetch orders"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   // ======================================================
//   // UPDATE ORDER STATUS
//   // ======================================================

//   const updateOrderStatus = async (
//     orderId,
//     orderStatus
//   ) => {
//     try {
//       setUpdating(true);
//       setError("");
//       setSuccess("");

//       const response =
//         await fetch(
//           `${API_URL}/${orderId}/status`,
//           {
//             method: "PUT",

//             headers: {
//               "Content-Type":
//                 "application/json",
//               ...getAuthHeaders(),
//             },

//             body: JSON.stringify({
//               orderStatus,
//             }),
//           }
//         );

//       const result =
//         await response.json();

//       if (!response.ok) {
//         throw new Error(
//           result?.message ||
//             "Failed to update order status"
//         );
//       }

//       setSuccess(
//         "Penthouse order status updated successfully."
//       );

//       setSelectedOrder(
//         result.data ||
//           selectedOrder
//       );

//       await fetchOrders();
//     } catch (err) {
//       console.error(
//         "UPDATE PENTHOUSE STATUS ERROR:",
//         err
//       );

//       setError(
//         err.message ||
//           "Failed to update order status"
//       );
//     } finally {
//       setUpdating(false);
//     }
//   };

//   // ======================================================
//   // UPDATE PAYMENT STATUS
//   // ======================================================

//   const updatePaymentStatus = async (
//     orderId,
//     paymentStatus
//   ) => {
//     try {
//       setUpdating(true);
//       setError("");
//       setSuccess("");

//       const response =
//         await fetch(
//           `${API_URL}/${orderId}/payment`,
//           {
//             method: "PUT",

//             headers: {
//               "Content-Type":
//                 "application/json",
//               ...getAuthHeaders(),
//             },

//             body: JSON.stringify({
//               paymentStatus,
//             }),
//           }
//         );

//       const result =
//         await response.json();

//       if (!response.ok) {
//         throw new Error(
//           result?.message ||
//             "Failed to update payment status"
//         );
//       }

//       setSuccess(
//         "Penthouse payment status updated successfully."
//       );

//       setSelectedOrder(
//         result.data ||
//           selectedOrder
//       );

//       await fetchOrders();
//     } catch (err) {
//       console.error(
//         "UPDATE PENTHOUSE PAYMENT ERROR:",
//         err
//       );

//       setError(
//         err.message ||
//           "Failed to update payment status"
//       );
//     } finally {
//       setUpdating(false);
//     }
//   };

//   // ======================================================
//   // SEARCH + FILTER
//   // ======================================================

//   const filteredOrders =
//     useMemo(() => {
//       const term =
//         search.trim().toLowerCase();

//       return orders.filter(
//         (order) => {
//           const matchesStatus =
//             statusFilter === "all" ||
//             String(
//               order.orderStatus || ""
//             ).toLowerCase() ===
//               statusFilter.toLowerCase();

//           if (!matchesStatus) {
//             return false;
//           }

//           if (!term) {
//             return true;
//           }

//           const items =
//             getPenthouseItems(order);

//           return (
//             String(
//               order._id || ""
//             )
//               .toLowerCase()
//               .includes(term) ||

//             String(
//               order.customer?.name ||
//                 ""
//             )
//               .toLowerCase()
//               .includes(term) ||

//             String(
//               order.customer?.email ||
//                 ""
//             )
//               .toLowerCase()
//               .includes(term) ||

//             items.some((item) =>
//               String(
//                 item.title || ""
//               )
//                 .toLowerCase()
//                 .includes(term)
//             )
//           );
//         }
//       );
//     }, [
//       orders,
//       search,
//       statusFilter,
//     ]);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [search, statusFilter]);

//   const totalPages = Math.max(
//     1,
//     Math.ceil(
//       filteredOrders.length /
//         itemsPerPage
//     )
//   );

//   const visibleOrders =
//     filteredOrders.slice(
//       (currentPage - 1) *
//         itemsPerPage,

//       currentPage *
//         itemsPerPage
//     );

//   // ======================================================
//   // STATS
//   // ======================================================

//   const stats = useMemo(() => {
//     return {
//       total: orders.length,

//       placed: orders.filter(
//         (o) =>
//           o.orderStatus === "placed"
//       ).length,

//       confirmed: orders.filter(
//         (o) =>
//           o.orderStatus === "confirmed"
//       ).length,

//       delivered: orders.filter(
//         (o) =>
//           o.orderStatus === "delivered"
//       ).length,

//       revenue: orders.reduce(
//         (sum, order) =>
//           sum +
//           getPenthouseTotal(order),
//         0
//       ),
//     };
//   }, [orders]);

//   return (
//     <div className="admin-orders-page">

//       {/* ==================================================
//           HEADER
//       ================================================== */}

//       <div className="admin-orders-header">

//         <div>
//           <h1>
//             Penthouse Orders
//           </h1>

//           <p>
//             Manage all Penthouse
//             property orders.
//           </p>
//         </div>

//         <div className="orders-controls">

//           <select
//             className="orders-status-filter"
//             value={location.pathname}
//             onChange={(e) =>
//               navigate(
//                 e.target.value
//               )
//             }
//           >
//             {orderTypeOptions.map(
//               (option) => (
//                 <option
//                   key={option.path}
//                   value={option.path}
//                 >
//                   {option.label}
//                 </option>
//               )
//             )}
//           </select>

//           <select
//             className="orders-status-filter"
//             value={statusFilter}
//             onChange={(e) =>
//               setStatusFilter(
//                 e.target.value
//               )
//             }
//           >
//             <option value="all">
//               All Status
//             </option>

//             <option value="placed">
//               Placed
//             </option>

//             <option value="pending">
//               Pending
//             </option>

//             <option value="confirmed">
//               Confirmed
//             </option>

//             <option value="processing">
//               Processing
//             </option>

//             <option value="shipped">
//               Shipped
//             </option>

//             <option value="delivered">
//               Delivered
//             </option>

//             <option value="cancelled">
//               Cancelled
//             </option>

//             <option value="rejected">
//               Rejected
//             </option>
//           </select>

//           <input
//             className="orders-search"
//             type="text"
//             placeholder="Search orders..."
//             value={search}
//             onChange={(e) =>
//               setSearch(
//                 e.target.value
//               )
//             }
//           />

//         </div>
//       </div>

//       {success && (
//         <div className="orders-success-message">
//           {success}
//         </div>
//       )}

//       {error && (
//         <div className="orders-error-message">
//           {error}
//         </div>
//       )}

//       {/* ==================================================
//           STATS
//       ================================================== */}

//       <div className="orders-stats">

//         <div className="order-stat-card">
//           <span>
//             Total Orders
//           </span>

//           <strong>
//             {stats.total}
//           </strong>
//         </div>

//         <div className="order-stat-card">
//           <span>
//             Placed
//           </span>

//           <strong>
//             {stats.placed}
//           </strong>
//         </div>

//         <div className="order-stat-card">
//           <span>
//             Confirmed
//           </span>

//           <strong>
//             {stats.confirmed}
//           </strong>
//         </div>

//         <div className="order-stat-card">
//           <span>
//             Delivered
//           </span>

//           <strong>
//             {stats.delivered}
//           </strong>
//         </div>

//         <div className="order-stat-card">
//           <span>
//             Revenue
//           </span>

//           <strong>
//             {formatCurrency(
//               stats.revenue
//             )}
//           </strong>
//         </div>

//       </div>

//       {/* ==================================================
//           TABLE
//       ================================================== */}

//       {loading ? (
//         <div className="orders-empty">
//           Loading orders...
//         </div>
//       ) : visibleOrders.length ===
//         0 ? (
//         <div className="orders-empty">
//           No Penthouse orders found.
//         </div>
//       ) : (
//         <>
//           <div className="orders-table-wrapper">

//             <table className="orders-table">

//               <thead>
//                 <tr>
//                   <th>
//                     Order ID
//                   </th>

//                   <th>
//                     Customer
//                   </th>

//                   <th>
//                     Property
//                   </th>

//                   <th>
//                     Total
//                   </th>

//                   <th>
//                     Payment
//                   </th>

//                   <th>
//                     Order Status
//                   </th>

//                   <th>
//                     Date
//                   </th>

//                   <th>
//                     Action
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>

//                 {visibleOrders.map(
//                   (order) => {
//                     const items =
//                       getPenthouseItems(
//                         order
//                       );

//                     return (
//                       <tr
//                         key={order._id}
//                       >

//                         <td>
//                           <span className="order-id">
//                             #
//                             {String(
//                               order._id
//                             ).slice(-8)}
//                           </span>
//                         </td>

//                         <td>
//                           <div className="customer-info">

//                             <strong>
//                               {
//                                 order
//                                   .customer
//                                   ?.name ||
//                                 "N/A"
//                               }
//                             </strong>

//                             <span>
//                               {
//                                 order
//                                   .customer
//                                   ?.email ||
//                                 "N/A"
//                               }
//                             </span>

//                             <span>
//                               {
//                                 order
//                                   .customer
//                                   ?.phone ||
//                                 ""
//                               }
//                             </span>

//                           </div>
//                         </td>

//                         <td>
//                           <div className="property-info">

//                             {items.map(
//                               (item) => (
//                                 <div
//                                   key={`${order._id}-${item.productId}`}
//                                 >
//                                   <strong>
//                                     {
//                                       item.title
//                                     }
//                                   </strong>

//                                   <span>
//                                     {
//                                       item.quantity
//                                     }{" "}
//                                     ×{" "}
//                                     {formatCurrency(
//                                       item.price
//                                     )}
//                                   </span>
//                                 </div>
//                               )
//                             )}

//                           </div>
//                         </td>

//                         <td>
//                           <strong className="order-total">
//                             {formatCurrency(
//                               getPenthouseTotal(
//                                 order
//                               )
//                             )}
//                           </strong>
//                         </td>

//                         <td>
//                           <span className="payment-table-status">
//                             {
//                               order.paymentStatus ||
//                               "pending"
//                             }
//                           </span>
//                         </td>

//                         <td>
//                           <span className="order-status">
//                             {
//                               order.orderStatus ||
//                               "placed"
//                             }
//                           </span>
//                         </td>

//                         <td>
//                           <span className="order-date">
//                             {formatDate(
//                               order.createdAt
//                             )}
//                           </span>
//                         </td>

//                         <td>
//                           <button
//                             type="button"
//                             className="view-order-btn"
//                             onClick={() =>
//                               setSelectedOrder(
//                                 order
//                               )
//                             }
//                           >
//                             View
//                           </button>
//                         </td>

//                       </tr>
//                     );
//                   }
//                 )}

//               </tbody>

//             </table>

//           </div>

//           {/* PAGINATION */}

//           <div className="orders-pagination">

//             <button
//               type="button"
//               className="pagination-arrow"
//               disabled={
//                 currentPage === 1
//               }
//               onClick={() =>
//                 setCurrentPage(
//                   (page) =>
//                     Math.max(
//                       1,
//                       page - 1
//                     )
//                 )
//               }
//             >
//               ←
//             </button>

//             {Array.from(
//               {
//                 length:
//                   totalPages,
//               },
//               (_, index) =>
//                 index + 1
//             ).map((page) => (
//               <button
//                 key={page}
//                 type="button"
//                 className={`pagination-number ${
//                   currentPage ===
//                   page
//                     ? "active"
//                     : ""
//                 }`}
//                 onClick={() =>
//                   setCurrentPage(
//                     page
//                   )
//                 }
//               >
//                 {page}
//               </button>
//             ))}

//             <button
//               type="button"
//               className="pagination-arrow"
//               disabled={
//                 currentPage ===
//                 totalPages
//               }
//               onClick={() =>
//                 setCurrentPage(
//                   (page) =>
//                     Math.min(
//                       totalPages,
//                       page + 1
//                     )
//                 )
//               }
//             >
//               →
//             </button>

//           </div>
//         </>
//       )}

//       {/* ==================================================
//           MODAL
//       ================================================== */}

//       {selectedOrder && (
//         <div
//           className="order-modal-overlay"
//           onClick={() =>
//             setSelectedOrder(null)
//           }
//         >

//           <div
//             className="order-modal"
//             onClick={(e) =>
//               e.stopPropagation()
//             }
//           >

//             <div className="order-modal-header">

//               <h2>
//                 Penthouse Order Details
//               </h2>

//               <button
//                 type="button"
//                 className="order-modal-close"
//                 onClick={() =>
//                   setSelectedOrder(null)
//                 }
//               >
//                 ×
//               </button>

//             </div>

//             {/* CUSTOMER */}

//             <div className="order-detail-section">

//               <h3>
//                 Customer
//               </h3>

//               <div className="order-detail-grid">

//                 <p>
//                   <strong>
//                     Name:
//                   </strong>{" "}
//                   {
//                     selectedOrder
//                       .customer?.name ||
//                     "N/A"
//                   }
//                 </p>

//                 <p>
//                   <strong>
//                     Email:
//                   </strong>{" "}
//                   {
//                     selectedOrder
//                       .customer?.email ||
//                     "N/A"
//                   }
//                 </p>

//                 <p>
//                   <strong>
//                     Phone:
//                   </strong>{" "}
//                   {
//                     selectedOrder
//                       .customer?.phone ||
//                     "N/A"
//                   }
//                 </p>

//                 <p>
//                   <strong>
//                     Order ID:
//                   </strong>{" "}
//                   {
//                     selectedOrder._id
//                   }
//                 </p>

//               </div>

//             </div>

//             {/* ITEMS */}

//             <div className="order-detail-section">

//               <h3>
//                 Penthouse Items
//               </h3>

//               <div className="modal-order-items">

//                 {getPenthouseItems(
//                   selectedOrder
//                 ).map((item) => {

//                   let imageUrl =
//                     item.image || "";

//                   if (
//                     imageUrl &&
//                     !imageUrl.startsWith(
//                       "http"
//                     )
//                   ) {
//                     imageUrl =
//                       `http://localhost:5000${
//                         imageUrl.startsWith(
//                           "/"
//                         )
//                           ? imageUrl
//                           : `/${imageUrl}`
//                       }`;
//                   }

//                   return (
//                     <div
//                       className="modal-order-item"
//                       key={`${selectedOrder._id}-${item.productId}`}
//                     >

//                       <div className="modal-item-placeholder">

//                         {imageUrl ? (
//                           <img
//                             src={imageUrl}
//                             alt={
//                               item.title
//                             }
//                           />
//                         ) : null}

//                       </div>

//                       <div className="modal-item-info">

//                         <strong>
//                           {item.title}
//                         </strong>

//                         <span>
//                           Quantity:{" "}
//                           {
//                             item.quantity
//                           }
//                         </span>

//                         <span>
//                           Price:{" "}
//                           {formatCurrency(
//                             item.price
//                           )}
//                         </span>

//                       </div>

//                     </div>
//                   );
//                 })}

//               </div>

//             </div>

//             {/* SHIPPING */}

//             <div className="order-detail-section">

//               <h3>
//                 Shipping Address
//               </h3>

//               <div className="shipping-address">

//                 <p>
//                   {
//                     selectedOrder
//                       .shippingAddress
//                       ?.address
//                   }
//                 </p>

//                 <p>
//                   {
//                     selectedOrder
//                       .shippingAddress
//                       ?.city
//                   }
//                   ,{" "}
//                   {
//                     selectedOrder
//                       .shippingAddress
//                       ?.state
//                   }
//                 </p>

//                 <p>
//                   {
//                     selectedOrder
//                       .shippingAddress
//                       ?.pincode
//                   }
//                 </p>

//               </div>

//             </div>

//             {/* PAYMENT */}

//             <div className="order-detail-section">

//               <h3>
//                 Payment Status
//               </h3>

//               <div className="current-payment-status">
//                 Current:{" "}
//                 {
//                   selectedOrder
//                     .paymentStatus ||
//                   "pending"
//                 }
//               </div>

//               <div className="payment-status-buttons">

//                 {[
//                   "pending",
//                   "paid",
//                   "failed",
//                 ].map(
//                   (status) => (
//                     <button
//                       key={status}
//                       type="button"
//                       className="payment-change-btn"
//                       disabled={
//                         updating ||
//                         selectedOrder.paymentStatus ===
//                           status
//                       }
//                       onClick={() =>
//                         updatePaymentStatus(
//                           selectedOrder._id,
//                           status
//                         )
//                       }
//                     >
//                       {status}
//                     </button>
//                   )
//                 )}

//               </div>

//             </div>

//             {/* ORDER STATUS */}

//             <div className="order-detail-section">

//               <h3>
//                 Order Status
//               </h3>

//               <div className="status-buttons">

//                 {[
//                   "placed",
//                   "pending",
//                   "confirmed",
//                   "processing",
//                   "shipped",
//                   "delivered",
//                   "cancelled",
//                   "rejected",
//                 ].map(
//                   (status) => (
//                     <button
//                       key={status}
//                       type="button"
//                       className="status-change-btn"
//                       disabled={
//                         updating ||
//                         selectedOrder.orderStatus ===
//                           status
//                       }
//                       onClick={() =>
//                         updateOrderStatus(
//                           selectedOrder._id,
//                           status
//                         )
//                       }
//                     >
//                       {status}
//                     </button>
//                   )
//                 )}

//               </div>

//             </div>

//             {/* TOTAL */}

//             <div className="order-summary">

//               <strong>
//                 Total
//               </strong>

//               <strong>
//                 {formatCurrency(
//                   getPenthouseTotal(
//                     selectedOrder
//                   )
//                 )}
//               </strong>

//             </div>

//           </div>

//         </div>
//       )}

//     </div>
//   );
// };

// export default AdminPenthouseOrders;


import React, {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import "./AdminOrders.css";

const API_URL =
  "http://localhost:5000/api/orders";

const SERVER_URL =
  "http://localhost:5000";

// ======================================================
// AUTH HEADERS
// ======================================================

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("adminToken") ||
    localStorage.getItem("accessToken");

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

// ======================================================
// STATUS OPTIONS
// ======================================================

const statusOptions = [
  "placed",
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "rejected",
];

const paymentOptions = [
  "pending",
  "paid",
  "failed",
];

// ======================================================
// FORMAT STATUS
// ======================================================

const formatStatus = (status) => {
  if (!status) return "Unknown";

  return (
    status.charAt(0).toUpperCase() +
    status.slice(1)
  );
};

// ======================================================
// FORMAT DATE
// ======================================================

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};

// ======================================================
// STATUS CLASS
// ======================================================

const getStatusClass = (status) => {
  switch (status) {
    case "placed":
      return "status-placed";

    case "pending":
      return "status-pending";

    case "confirmed":
      return "status-confirmed";

    case "processing":
      return "status-processing";

    case "shipped":
      return "status-shipped";

    case "delivered":
      return "status-delivered";

    case "cancelled":
      return "status-cancelled";

    case "rejected":
      return "status-rejected";

    default:
      return "status-default";
  }
};

// ======================================================
// IMAGE URL HELPER
// ======================================================

const getImageUrl = (image) => {
  if (!image) return "";

  const imageString =
    String(image).trim();

  if (!imageString) return "";

  // Full URL
  if (
    imageString.startsWith(
      "http://"
    ) ||
    imageString.startsWith(
      "https://"
    )
  ) {
    return imageString;
  }

  // Base64
  if (
    imageString.startsWith(
      "data:image/"
    )
  ) {
    return imageString;
  }

  // /uploads/filename
  if (
    imageString.startsWith(
      "/uploads/"
    )
  ) {
    return `${SERVER_URL}${imageString}`;
  }

  // uploads/filename
  if (
    imageString.startsWith(
      "uploads/"
    )
  ) {
    return `${SERVER_URL}/${imageString}`;
  }

  // Other absolute path
  if (imageString.startsWith("/")) {
    return imageString;
  }

  // Normal filename/path
  return `${SERVER_URL}/${imageString}`;
};

// ======================================================
// PENTHOUSE ITEM HELPER
// ======================================================

const isPenthouseItem = (item) => {
  return (
    String(
      item?.productType || ""
    ).toLowerCase() === "penthouse"
  );
};

// ======================================================
// GET ONLY PENTHOUSE ITEMS
// ======================================================

const getPenthouseItems = (order) => {
  return (order?.items || []).filter(
    isPenthouseItem
  );
};

// ======================================================
// GET PENTHOUSE TOTAL
// ======================================================

const getPenthouseTotal = (order) => {
  const penthouseItems =
    getPenthouseItems(order);

  return penthouseItems.reduce(
    (sum, item) =>
      sum +
      Number(item?.price || 0) *
        Number(item?.quantity || 1),
    0
  );
};

// ======================================================
// COMPONENT
// ======================================================

const AdminPenthouseOrders = () => {
  const navigate = useNavigate();

  const location = useLocation();

  // ====================================================
  // STATES
  // ====================================================

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [updatingId, setUpdatingId] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  // ====================================================
  // PAGINATION
  // ====================================================

  const [currentPage, setCurrentPage] =
    useState(1);

  const ordersPerPage = 10;

  // ====================================================
  // FETCH ORDERS
  // ====================================================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        API_URL,
        {
          method: "GET",
          headers: {
            ...getAuthHeaders(),
          },
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to load orders"
        );
      }

      // ONLY PENTHOUSE ORDERS
      const penthouseOrders =
        (result.data || []).filter(
          (order) =>
            getPenthouseItems(order)
              .length > 0
        );

      setOrders(penthouseOrders);
    } catch (err) {
      console.error(
        "ADMIN PENTHOUSE ORDERS ERROR:",
        err
      );

      setError(
        err.message ||
          "Failed to load Penthouse orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ====================================================
  // RESET PAGE
  // ====================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    statusFilter,
  ]);

  // ====================================================
  // UPDATE ORDER STATUS
  // ====================================================

  const handleStatusChange = async (
    orderId,
    newStatus
  ) => {
    try {
      setUpdatingId(orderId);

      setMessage("");
      setError("");

      const response = await fetch(
        `${API_URL}/${orderId}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
            ...getAuthHeaders(),
          },

          body: JSON.stringify({
            orderStatus: newStatus,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to update order status"
        );
      }

      // UPDATE TABLE
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                orderStatus:
                  newStatus,
              }
            : order
        )
      );

      // UPDATE MODAL
      setSelectedOrder((prev) =>
        prev &&
        prev._id === orderId
          ? {
              ...prev,
              orderStatus:
                newStatus,
            }
          : prev
      );

      setMessage(
        `Order status changed to ${formatStatus(
          newStatus
        )}. Customer notification email has been triggered.`
      );
    } catch (err) {
      console.error(
        "UPDATE PENTHOUSE ORDER STATUS ERROR:",
        err
      );

      setError(
        err.message ||
          "Failed to update order status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ====================================================
  // UPDATE PAYMENT STATUS
  // ====================================================

  const handlePaymentStatusChange =
    async (
      orderId,
      newPaymentStatus
    ) => {
      try {
        setUpdatingId(orderId);

        setMessage("");
        setError("");

        const response = await fetch(
          `${API_URL}/${orderId}/payment-status`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
              ...getAuthHeaders(),
            },

            body: JSON.stringify({
              paymentStatus:
                newPaymentStatus,
            }),
          }
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to update payment status"
          );
        }

        // PAYMENT → ORDER STATUS
        const paymentToOrderStatus =
          {
            pending: "pending",
            paid: "confirmed",
            failed: "rejected",
          };

        const newOrderStatus =
          paymentToOrderStatus[
            newPaymentStatus
          ];

        // UPDATE TABLE
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  paymentStatus:
                    newPaymentStatus,
                  orderStatus:
                    newOrderStatus,
                }
              : order
          )
        );

        // UPDATE MODAL
        setSelectedOrder((prev) =>
          prev &&
          prev._id === orderId
            ? {
                ...prev,
                paymentStatus:
                  newPaymentStatus,
                orderStatus:
                  newOrderStatus,
              }
            : prev
        );

        setMessage(
          `Payment status changed to ${formatStatus(
            newPaymentStatus
          )}. Order status automatically changed to ${formatStatus(
            newOrderStatus
          )}. Customer notification email has been sent.`
        );
      } catch (err) {
        console.error(
          "UPDATE PENTHOUSE PAYMENT STATUS ERROR:",
          err
        );

        setError(
          err.message ||
            "Failed to update payment status"
        );
      } finally {
        setUpdatingId(null);
      }
    };

  // ====================================================
  // SEARCH + FILTER
  // ====================================================

  const filteredOrders =
    orders.filter((order) => {
      const customer =
        order.customer || {};

      const items =
        getPenthouseItems(order);

      const itemText =
        items
          .map(
            (item) =>
              `${item.title || ""} ${
                item.productType || ""
              }`
          )
          .join(" ");

      const searchText = `
        ${order._id || ""}
        ${customer.name || ""}
        ${customer.email || ""}
        ${customer.phone || ""}
        ${itemText}
        ${order.orderStatus || ""}
        ${order.paymentStatus || ""}
      `.toLowerCase();

      const matchesSearch =
        searchText.includes(
          search.toLowerCase()
        );

      const matchesStatus =
        statusFilter === "all" ||
        order.orderStatus ===
          statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  // ====================================================
  // PAGINATION
  // ====================================================

  const totalPages =
    Math.ceil(
      filteredOrders.length /
        ordersPerPage
    );

  const startIndex =
    (currentPage - 1) *
    ordersPerPage;

  const endIndex =
    startIndex + ordersPerPage;

  const currentOrders =
    filteredOrders.slice(
      startIndex,
      endIndex
    );

  // ====================================================
  // PAGINATION HANDLER
  // ====================================================

  const goToPage = (page) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ====================================================
  // STATS
  // ====================================================

  const totalOrders =
    orders.length;

  const pendingOrders =
    orders.filter(
      (order) =>
        order.orderStatus ===
        "pending"
    ).length;

  const confirmedOrders =
    orders.filter(
      (order) =>
        order.orderStatus ===
        "confirmed"
    ).length;

  const rejectedOrders =
    orders.filter(
      (order) =>
        order.orderStatus ===
        "rejected"
    ).length;

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div className="admin-orders-page">
        <div className="admin-orders-loading">
          Loading Penthouse orders...
        </div>
      </div>
    );
  }

  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="admin-orders-page">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="admin-orders-header">

        <div>

          <h1>
            Penthouse Orders
          </h1>

          <p>
            Manage Penthouse
            orders, payments and
            order status.
          </p>

        </div>

      </div>

      {/* =====================================================
          ORDER TYPE DROPDOWN
      ====================================================== */}

      <div
        className="orders-controls"
        style={{
          marginBottom: "20px",
        }}
      >

        <div>

          <label
            htmlFor="penthouse-order-type"
            style={{
              display: "block",
              marginBottom: "7px",
              fontSize: "13px",
              fontWeight: 600,
              color: "#374151",
            }}
          >
            Order Type
          </label>

          <select
            id="penthouse-order-type"
            className="orders-status-filter"
            value={location.pathname}
            onChange={(e) => {
              if (e.target.value) {
                navigate(
                  e.target.value
                );
              }
            }}
            style={{
              width: "240px",
            }}
          >

            <option value="/admin/orders">
              Regular Property
            </option>

            <option value="/admin/luxury-orders">
              Luxury Property
            </option>

            <option value="/admin/penthouse-orders">
              Penthouse
            </option>

            <option value="/admin/penthouse-orders">
              Penthouse
            </option>

          </select>

        </div>

      </div>

      {/* =====================================================
          STATS
      ====================================================== */}

      <div className="orders-stats">

        <div className="order-stat-card">

          <span>
            Total Penthouse Orders
          </span>

          <strong>
            {totalOrders}
          </strong>

        </div>

        <div className="order-stat-card">

          <span>
            Pending
          </span>

          <strong>
            {pendingOrders}
          </strong>

        </div>

        <div className="order-stat-card">

          <span>
            Confirmed
          </span>

          <strong>
            {confirmedOrders}
          </strong>

        </div>

        <div className="order-stat-card">

          <span>
            Rejected
          </span>

          <strong>
            {rejectedOrders}
          </strong>

        </div>

      </div>

      {/* =====================================================
          SUCCESS
      ====================================================== */}

      {message && (
        <div className="orders-success-message">
          {message}
        </div>
      )}

      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="orders-error-message">
          {error}
        </div>
      )}

      {/* =====================================================
          SEARCH + FILTER
      ====================================================== */}

      <div className="orders-controls">

        <div className="orders-search">

          <input
            type="text"
            placeholder="Search customer, email, order..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
          className="orders-status-filter"
        >

          <option value="all">
            All Status
          </option>

          {statusOptions.map(
            (status) => (
              <option
                key={status}
                value={status}
              >
                {formatStatus(
                  status
                )}
              </option>
            )
          )}

        </select>

      </div>

      {/* =====================================================
          ORDERS CARD
      ====================================================== */}

      <div className="orders-card">

        <div className="orders-card-header">

          <div>

            <h2>
              Penthouse Orders
            </h2>

            <span className="orders-page-info">

              Showing{" "}

              {filteredOrders.length ===
              0
                ? 0
                : startIndex + 1}

              -

              {Math.min(
                endIndex,
                filteredOrders.length
              )}

              {" "}of{" "}

              {filteredOrders.length}

            </span>

          </div>

          <span>

            Page{" "}

            {totalPages === 0
              ? 0
              : currentPage}

            {" "}of{" "}

            {totalPages}

          </span>

        </div>

        {/* =====================================================
            TABLE
        ====================================================== */}

        {currentOrders.length ===
        0 ? (

          <div className="orders-empty">
            No Penthouse
            orders found.
          </div>

        ) : (

          <div className="orders-table-wrapper">

            <table className="orders-table">

              <thead>

                <tr>

                  <th>
                    Order
                  </th>

                  <th>
                    Customer
                  </th>

                  <th>
                    Penthouse
                  </th>

                  <th>
                    Total
                  </th>

                  <th>
                    Payment
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {currentOrders.map(
                  (order) => {

                    const customer =
                      order.customer ||
                      {};

                    const penthouseItems =
                      getPenthouseItems(
                        order
                      );

                    const firstItem =
                      penthouseItems[0];

                    return (

                      <tr
                        key={
                          order._id
                        }
                      >

                        {/* ORDER */}

                        <td>

                          <div className="order-id">

                            #

                            {order._id?.slice(
                              -8
                            )}

                          </div>

                        </td>

                        {/* CUSTOMER */}

                        <td>

                          <div className="customer-info">

                            <strong>
                              {customer.name ||
                                "Guest"}
                            </strong>

                            <span>
                              {customer.email ||
                                "-"}
                            </span>

                          </div>

                        </td>

                        {/* PENTHOUSE PROPERTY */}

                        <td>

                          <div className="property-info">

                            {firstItem?.image ? (

                              <img
                                src={getImageUrl(
                                  firstItem.image
                                )}
                                alt={
                                  firstItem.title ||
                                  "Penthouse"
                                }
                                onError={(
                                  event
                                ) => {
                                  event.currentTarget.style.display =
                                    "none";
                                }}
                              />

                            ) : (

                              <div className="property-no-image">
                                N/A
                              </div>

                            )}

                            <div>

                              <strong>
                                {firstItem?.title ||
                                  "Penthouse Property"}
                              </strong>

                              {penthouseItems.length >
                                1 && (

                                <span>
                                  +
                                  {penthouseItems.length -
                                    1}{" "}
                                  more Penthouse
                                </span>

                              )}

                            </div>

                          </div>

                        </td>

                        {/* TOTAL */}

                        <td>

                          <strong className="order-total">

                            Rs.{" "}

                            {Number(
                              getPenthouseTotal(
                                order
                              )
                            ).toLocaleString(
                              "en-IN"
                            )}

                          </strong>

                        </td>

                        {/* PAYMENT */}

                        <td>

                          <span
                            className={`payment-table-status payment-${order.paymentStatus}`}
                          >
                            {formatStatus(
                              order.paymentStatus
                            )}
                          </span>

                        </td>

                        {/* STATUS */}

                        <td>

                          <span
                            className={`order-status ${getStatusClass(
                              order.orderStatus
                            )}`}
                          >
                            {formatStatus(
                              order.orderStatus
                            )}
                          </span>

                        </td>

                        {/* DATE */}

                        <td>

                          <span className="order-date">

                            {formatDate(
                              order.createdAt
                            )}

                          </span>

                        </td>

                        {/* ACTION */}

                        <td>

                          <button
                            className="view-order-btn"
                            onClick={() =>
                              setSelectedOrder(
                                order
                              )
                            }
                          >
                            Manage
                          </button>

                        </td>

                      </tr>

                    );

                  }
                )}

              </tbody>

            </table>

          </div>

        )}

        {/* =====================================================
            PAGINATION
        ====================================================== */}

        {totalPages > 1 && (

          <div className="orders-pagination">

            <button
              className="pagination-arrow"
              disabled={
                currentPage === 1
              }
              onClick={() =>
                goToPage(
                  currentPage - 1
                )
              }
            >
              ←
            </button>

            {Array.from(
              {
                length: totalPages,
              },
              (_, index) =>
                index + 1
            ).map((page) => (

              <button
                key={page}
                className={`pagination-number ${
                  currentPage ===
                  page
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  goToPage(page)
                }
              >
                {page}
              </button>

            ))}

            <button
              className="pagination-arrow"
              disabled={
                currentPage ===
                totalPages
              }
              onClick={() =>
                goToPage(
                  currentPage + 1
                )
              }
            >
              →
            </button>

          </div>

        )}

      </div>

      {/* =====================================================
          ORDER MODAL
      ====================================================== */}

      {selectedOrder && (

        <div
          className="order-modal-overlay"
          onClick={() =>
            setSelectedOrder(
              null
            )
          }
        >

          <div
            className="order-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="order-modal-close"
              onClick={() =>
                setSelectedOrder(
                  null
                )
              }
            >
              ×
            </button>

            {/* MODAL HEADER */}

            <div className="order-modal-header">

              <div>

                <span>
                  Penthouse Order
                </span>

                <h2>
                  #
                  {
                    selectedOrder._id
                  }
                </h2>

              </div>

              <span
                className={`order-status ${getStatusClass(
                  selectedOrder.orderStatus
                )}`}
              >
                {formatStatus(
                  selectedOrder.orderStatus
                )}
              </span>

            </div>

            {/* CUSTOMER DETAILS */}

            <div className="order-detail-section">

              <h3>
                Customer Details
              </h3>

              <div className="order-detail-grid">

                <div>

                  <label>
                    Name
                  </label>

                  <p>
                    {selectedOrder
                      .customer
                      ?.name ||
                      "-"}
                  </p>

                </div>

                <div>

                  <label>
                    Email
                  </label>

                  <p>
                    {selectedOrder
                      .customer
                      ?.email ||
                      "-"}
                  </p>

                </div>

                <div>

                  <label>
                    Phone
                  </label>

                  <p>
                    {selectedOrder
                      .customer
                      ?.phone ||
                      "-"}
                  </p>

                </div>

                <div>

                  <label>
                    Customer Type
                  </label>

                  <p>
                    {formatStatus(
                      selectedOrder
                        .customer
                        ?.type
                    )}
                  </p>

                </div>

              </div>

            </div>

            {/* ORDERED PENTHOUSE PROPERTY */}

            <div className="order-detail-section">

              <h3>
                Ordered Penthouse Property
              </h3>

              <div className="modal-order-items">

                {getPenthouseItems(
                  selectedOrder
                ).map(
                  (
                    item,
                    index
                  ) => (

                    <div
                      className="modal-order-item"
                      key={`${item.productId}-${index}`}
                    >

                      {item.image ? (

                        <img
                          src={getImageUrl(
                            item.image
                          )}
                          alt={
                            item.title ||
                            "Penthouse"
                          }
                          onError={(
                            event
                          ) => {
                            event.currentTarget.style.display =
                              "none";
                          }}
                        />

                      ) : (

                        <div className="modal-item-placeholder">
                          No Image
                        </div>

                      )}

                      <div className="modal-item-info">

                        <strong>
                          {item.title}
                        </strong>

                        <span>
                          Type: Penthouse
                        </span>

                        <span>
                          Quantity:{" "}
                          {
                            item.quantity
                          }
                        </span>

                        <span>
                          Price: Rs.{" "}
                          {Number(
                            item.price ||
                              0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </span>

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

            {/* SHIPPING ADDRESS */}

            <div className="order-detail-section">

              <h3>
                Shipping Address
              </h3>

              <p className="shipping-address">

                {
                  selectedOrder
                    .shippingAddress
                    ?.firstName
                }{" "}

                {
                  selectedOrder
                    .shippingAddress
                    ?.lastName
                }

                <br />

                {
                  selectedOrder
                    .shippingAddress
                    ?.address
                }

                <br />

                {
                  selectedOrder
                    .shippingAddress
                    ?.city
                }

                ,{" "}

                {
                  selectedOrder
                    .shippingAddress
                    ?.state
                }

                <br />

                PIN:{" "}

                {
                  selectedOrder
                    .shippingAddress
                    ?.pincode
                }

              </p>

            </div>

            {/* VERIFY PAYMENT */}

            <div className="order-detail-section">

              <h3>
                Verify Payment
              </h3>

              <p className="status-help-text">

                Manually verify the
                payment. Order status
                will update
                automatically.

              </p>

              <div className="current-payment-status">

                <span>
                  Current Payment:
                </span>

                <strong
                  className={`payment-table-status payment-${selectedOrder.paymentStatus}`}
                >
                  {formatStatus(
                    selectedOrder.paymentStatus
                  )}
                </strong>

              </div>

              <div className="payment-status-buttons">

                {paymentOptions.map(
                  (status) => {

                    const isCurrent =
                      selectedOrder.paymentStatus ===
                      status;

                    const isUpdating =
                      updatingId ===
                      selectedOrder._id;

                    return (

                      <button
                        key={status}
                        disabled={
                          isCurrent ||
                          isUpdating
                        }
                        className={`payment-change-btn payment-${status} ${
                          isCurrent
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          handlePaymentStatusChange(
                            selectedOrder._id,
                            status
                          )
                        }
                      >

                        {isUpdating &&
                        !isCurrent
                          ? "Updating..."
                          : formatStatus(
                              status
                            )}

                      </button>

                    );

                  }
                )}

              </div>

              <div className="payment-order-mapping">

                <span>
                  Pending → Order Pending
                </span>

                <span>
                  Paid → Order Confirmed
                </span>

                <span>
                  Failed → Order Rejected
                </span>

              </div>

            </div>

            {/* UPDATE ORDER STATUS */}

            <div className="order-detail-section">

              <h3>
                Update Order Status
              </h3>

              <p className="status-help-text">

                You can manually update
                the order progress after
                payment verification.

              </p>

              <div className="status-buttons">

                {statusOptions.map(
                  (status) => {

                    const isCurrent =
                      selectedOrder.orderStatus ===
                      status;

                    const isUpdating =
                      updatingId ===
                      selectedOrder._id;

                    return (

                      <button
                        key={status}
                        disabled={
                          isCurrent ||
                          isUpdating
                        }
                        className={`status-change-btn ${
                          isCurrent
                            ? "active"
                            : ""
                        } ${getStatusClass(
                          status
                        )}`}
                        onClick={() =>
                          handleStatusChange(
                            selectedOrder._id,
                            status
                          )
                        }
                      >

                        {isUpdating &&
                        !isCurrent
                          ? "Updating..."
                          : formatStatus(
                              status
                            )}

                      </button>

                    );

                  }
                )}

              </div>

            </div>

            {/* ORDER SUMMARY */}

            <div className="order-summary">

              <div>

                <span>
                  Subtotal
                </span>

                <strong>
                  Rs.{" "}
                  {Number(
                    selectedOrder
                      .subtotal ||
                      0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

              <div>

                <span>
                  Shipping
                </span>

                <strong>
                  Rs.{" "}
                  {Number(
                    selectedOrder
                      .shipping ||
                      0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

              <div>

                <span>
                  Taxes
                </span>

                <strong>
                  Rs.{" "}
                  {Number(
                    selectedOrder
                      .taxes ||
                      0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

              <div>

                <span>
                  Payment Status
                </span>

                <strong
                  className={`payment-summary-${selectedOrder.paymentStatus}`}
                >
                  {formatStatus(
                    selectedOrder.paymentStatus
                  )}
                </strong>

              </div>

              <div>

                <span>
                  Order Status
                </span>

                <strong>
                  {formatStatus(
                    selectedOrder.orderStatus
                  )}
                </strong>

              </div>

              <div className="order-summary-total">

                <span>
                  Penthouse Total
                </span>

                <strong>
                  Rs.{" "}
                  {Number(
                    getPenthouseTotal(
                      selectedOrder
                    )
                  ).toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminPenthouseOrders;