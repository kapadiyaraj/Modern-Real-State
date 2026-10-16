// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useCart } from "../../context/CartContext";
// import "./Cart.css";

// const SERVER = "http://localhost:5000";

// const Cart = () => {
//   const navigate = useNavigate();

//   const {
//     cartItems = [],
//     cartSubtotal = 0,
//     updateQuantity,
//     removeFromCart,
//     loading,
//   } = useCart();

//   const getImageUrl = (image) => {
//     if (!image) return "";

//     if (
//       image.startsWith("http://") ||
//       image.startsWith("https://") ||
//       image.startsWith("data:image")
//     ) {
//       return image;
//     }

//     if (image.startsWith("/uploads/")) {
//       return `${SERVER}${image}`;
//     }

//     if (image.startsWith("uploads/")) {
//       return `${SERVER}/${image}`;
//     }

//     if (image.startsWith("/")) {
//       return image;
//     }

//     return `${SERVER}/${image}`;
//   };

//   const formatPrice = (price) => {
//     const numericPrice = Number(price || 0);

//     return numericPrice.toLocaleString("en-IN", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     });
//   };

//   /*
//    * IMPORTANT:
//    * cartSubtotal is numeric value from CartContext.
//    * Do NOT use formatted cartTotal for calculation.
//    */
//   const subtotal = Number(cartSubtotal) || 0;

//   const handleQuantity = (item, type) => {
//     if (type === "increase") {
//       updateQuantity(
//         item.productId,
//         Number(item.quantity || 1) + 1
//       );
//     }

//     if (
//       type === "decrease" &&
//       Number(item.quantity || 1) > 1
//     ) {
//       updateQuantity(
//         item.productId,
//         Number(item.quantity) - 1
//       );
//     }
//   };

//   const handleRemove = (productId) => {
//     removeFromCart(productId);
//   };

//   if (loading) {
//     return (
//       <div className="cart-page">
//         <div className="cart-container">
//           <p className="cart-loading">
//             Loading cart...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="cart-page">
//       <div className="cart-container">

//         {/* Continue Shopping */}
//         <button
//           className="continue-shopping"
//           onClick={() => navigate("/")}
//           type="button"
//         >
//           <span className="continue-arrow">←</span>
//           <span>Continue shopping</span>
//         </button>

//         {/* Heading */}
//         <h1 className="cart-page-title">
//           Your cart
//         </h1>

//         {cartItems.length === 0 ? (
//           <div className="empty-cart">
//             <h2>Your cart is empty</h2>

//             <p>
//               Add some properties to your cart to continue.
//             </p>

//             <Link
//               to="/"
//               className="empty-cart-btn"
//             >
//               Continue Shopping
//             </Link>
//           </div>
//         ) : (
//           <div className="cart-layout">

//             {/* ======================================
//                 LEFT SIDE
//             ====================================== */}
//             <div className="cart-left">

//               {/* Table Header */}
//               <div className="cart-table-header">
//                 <span>IMAGE</span>
//                 <span>NAME</span>
//                 <span>PRICE</span>
//                 <span>QUANTITY</span>
//                 <span>TOTAL</span>
//                 <span></span>
//               </div>

//               {/* Products */}
//               <div className="cart-items">

//                 {cartItems.map((item) => (

//                   <div
//                     className="cart-item"
//                     key={item.productId}
//                   >

//                     {/* Image */}
//                     <div className="cart-item-image-box">

//                       {item.image ? (
//                         <img
//                           src={getImageUrl(item.image)}
//                           alt={item.title || "Property"}
//                           className="cart-item-image"
//                         />
//                       ) : (
//                         <div className="cart-no-image">
//                           No Image
//                         </div>
//                       )}

//                     </div>

//                     {/* Name */}
//                     <div className="cart-item-info">

//                       <div className="cart-product-type">
//                         Real Estate
//                       </div>

//                       <h3>
//                         {item.title}
//                       </h3>

//                       {item.size && (
//                         <p>
//                           <strong>Size:</strong>{" "}
//                           {item.size}
//                         </p>
//                       )}

//                       {item.color && (
//                         <p>
//                           <strong>Color:</strong>{" "}
//                           {item.color}
//                         </p>
//                       )}

//                     </div>

//                     {/* Price */}
//                     <div className="cart-item-price">
//                       Rs.{" "}
//                       {formatPrice(item.price)}{" "}
//                       INR
//                     </div>

//                     {/* Quantity */}
//                     <div className="cart-quantity-wrapper">

//                       <button
//                         type="button"
//                         onClick={() =>
//                           handleQuantity(
//                             item,
//                             "decrease"
//                           )
//                         }
//                         disabled={
//                           Number(item.quantity || 1) <= 1
//                         }
//                       >
//                         −
//                       </button>

//                       <span>
//                         {item.quantity}
//                       </span>

//                       <button
//                         type="button"
//                         onClick={() =>
//                           handleQuantity(
//                             item,
//                             "increase"
//                           )
//                         }
//                       >
//                         +
//                       </button>

//                     </div>

//                     {/* Total */}
//                     <div className="cart-item-total">

//                       Rs.{" "}
//                       {formatPrice(
//                         Number(item.price || 0) *
//                         Number(item.quantity || 1)
//                       )}{" "}
//                       INR

//                     </div>

//                     {/* Delete */}
//                     <button
//                       type="button"
//                       className="cart-remove-btn"
//                       onClick={() =>
//                         handleRemove(
//                           item.productId
//                         )
//                       }
//                       aria-label="Remove product"
//                     >

//                       <svg
//                         width="18"
//                         height="18"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="1.8"
//                       >
//                         <path d="M3 6h18" />
//                         <path d="M8 6V4h8v2" />
//                         <path d="M19 6l-1 14H6L5 6" />
//                         <path d="M10 11v5" />
//                         <path d="M14 11v5" />
//                       </svg>

//                     </button>

//                   </div>

//                 ))}

//               </div>

//               {/* Gift Wrap */}
//               <div className="gift-wrap-box">

//                 <div className="gift-wrap-left">

//                   <span className="gift-icon">
//                     ♧
//                   </span>

//                   <span>
//                     Add a Gift Wrap to your order,
//                     For Rs.
//                     <br />
//                     <strong>500.00</strong>
//                   </span>

//                 </div>

//                 <button
//                   type="button"
//                   className="gift-wrap-btn"
//                 >
//                   Add a Gift Wrap
//                 </button>

//               </div>

//             </div>

//             {/* ======================================
//                 RIGHT SIDE
//             ====================================== */}
//             <aside className="cart-sidebar">

//               {/* Instructions */}
//               <div className="special-instructions">

//                 <label>
//                   ORDER SPECIAL INSTRUCTIONS
//                 </label>

//                 <textarea
//                   placeholder="Order special instructions"
//                 />

//               </div>

//               {/* Summary */}
//               <div className="cart-summary">

//                 <h2>
//                   Subtotal
//                 </h2>

//                 {/* FIXED SUBTOTAL */}
//                 <div className="cart-subtotal">
//                   Rs.{" "}
//                   {formatPrice(subtotal)}{" "}
//                   INR
//                 </div>

//                 <p>
//                   Taxes and shipping calculated at
//                   checkout
//                 </p>

//                 <button
//                   type="button"
//                   className="checkout-btn"
//                   onClick={() =>
//                     navigate("/checkout")
//                   }
//                 >
//                   Proceed to checkout
//                 </button>

//               </div>

//             </aside>

//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// export default Cart;



import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./Cart.css";

const SERVER = "http://localhost:5000";

const Cart = () => {
  const navigate = useNavigate();

  const {
    cartItems = [],
    cartSubtotal = 0,
    updateQuantity,
    removeFromCart,
    loading,
  } = useCart();

  // ==========================================
  // AVAILABLE UNITS
  // ==========================================

  const [availableUnits, setAvailableUnits] = useState({});

  const [checkingAvailability, setCheckingAvailability] =
    useState(false);

  // ==========================================
  // IMAGE URL
  // ==========================================

  const getImageUrl = (image) => {
    if (!image) return "";

    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("data:image")
    ) {
      return image;
    }

    if (image.startsWith("/uploads/")) {
      return `${SERVER}${image}`;
    }

    if (image.startsWith("uploads/")) {
      return `${SERVER}/${image}`;
    }

    if (image.startsWith("/")) {
      return image;
    }

    return `${SERVER}/${image}`;
  };

  // ==========================================
  // FORMAT PRICE
  // ==========================================

  const formatPrice = (price) => {
    const numericPrice = Number(price || 0);

    return numericPrice.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // ==========================================
  // FETCH CURRENT PROPERTY AVAILABILITY
  // ==========================================

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!cartItems.length) {
        setAvailableUnits({});
        return;
      }

      try {
        setCheckingAvailability(true);

        const availabilityData = {};

        await Promise.all(
          cartItems.map(async (item) => {
            /*
             * Only normal Property availability
             * is handled here.
             *
             * Other product types can continue using
             * backend validation.
             */
            if (
              item.productType &&
              item.productType !== "property"
            ) {
              return;
            }

            const productId = item.productId;

            if (!productId) {
              return;
            }

            try {
              const response = await fetch(
                `${SERVER}/api/properties/${productId}`
              );

              if (!response.ok) {
                return;
              }

              const result = await response.json();

              /*
               * Backend response can be:
               *
               * { data: {...} }
               * OR
               * { property: {...} }
               * OR
               * direct object
               */

              const property =
                result?.data ||
                result?.property ||
                result;

              const value = Number(
                property?.availableUnits
              );

              if (Number.isFinite(value)) {
                availabilityData[productId] = Math.max(
                  0,
                  value
                );
              }
            } catch (error) {
              console.error(
                `Availability error for ${productId}:`,
                error
              );
            }
          })
        );

        setAvailableUnits(availabilityData);
      } catch (error) {
        console.error(
          "Cart availability error:",
          error
        );
      } finally {
        setCheckingAvailability(false);
      }
    };

    fetchAvailability();
  }, [cartItems]);

  // ==========================================
  // AUTO FIX OLD INVALID QUANTITY
  // ==========================================

  useEffect(() => {
    if (!cartItems.length) {
      return;
    }

    Object.entries(availableUnits).forEach(
      ([productId, available]) => {
        const item = cartItems.find(
          (cartItem) =>
            String(cartItem.productId) ===
            String(productId)
        );

        if (!item) {
          return;
        }

        const currentQuantity = Number(
          item.quantity || 1
        );

        /*
         * If old cart contains quantity 36
         * but only 10 are available,
         * automatically reduce it to 10.
         */
        if (
          available > 0 &&
          currentQuantity > available
        ) {
          updateQuantity(
            productId,
            available
          );
        }
      }
    );
  }, [
    availableUnits,
    cartItems,
    updateQuantity,
  ]);

  // ==========================================
  // SUBTOTAL
  // ==========================================

  /*
   * IMPORTANT:
   * cartSubtotal is numeric value from CartContext.
   * Do NOT use formatted cartTotal for calculation.
   */

  const subtotal =
    Number(cartSubtotal) || 0;

  // ==========================================
  // HANDLE QUANTITY
  // ==========================================

  const handleQuantity = (item, type) => {
    const currentQuantity = Number(
      item.quantity || 1
    );

    const productId = item.productId;

    const available =
      availableUnits[productId];

    // ========================================
    // INCREASE
    // ========================================

    if (type === "increase") {
      /*
       * If availability is known,
       * do not allow quantity above it.
       */

      if (
        Number.isFinite(available)
      ) {
        if (available <= 0) {
          alert(
            "This property is sold out."
          );

          return;
        }

        if (
          currentQuantity >= available
        ) {
          alert(
            `Only ${available} ${
              available === 1
                ? "unit"
                : "units"
            } available.`
          );

          return;
        }
      }

      updateQuantity(
        productId,
        currentQuantity + 1
      );

      return;
    }

    // ========================================
    // DECREASE
    // ========================================

    if (
      type === "decrease" &&
      currentQuantity > 1
    ) {
      updateQuantity(
        productId,
        currentQuantity - 1
      );
    }
  };

  // ==========================================
  // REMOVE
  // ==========================================

  const handleRemove = (productId) => {
    removeFromCart(productId);
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <p className="cart-loading">
            Loading cart...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN
  // ==========================================

  return (
    <div className="cart-page">
      <div className="cart-container">

        {/* Continue Shopping */}
        <button
          className="continue-shopping"
          onClick={() => navigate("/")}
          type="button"
        >
          <span className="continue-arrow">
            ←
          </span>

          <span>
            Continue shopping
          </span>
        </button>

        {/* Heading */}
        <h1 className="cart-page-title">
          Your cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="empty-cart">

            <h2>
              Your cart is empty
            </h2>

            <p>
              Add some properties to your
              cart to continue.
            </p>

            <Link
              to="/"
              className="empty-cart-btn"
            >
              Continue Shopping
            </Link>

          </div>
        ) : (
          <div className="cart-layout">

            {/* ======================================
                LEFT SIDE
            ====================================== */}

            <div className="cart-left">

              {/* Table Header */}
              <div className="cart-table-header">

                <span>
                  IMAGE
                </span>

                <span>
                  NAME
                </span>

                <span>
                  PRICE
                </span>

                <span>
                  QUANTITY
                </span>

                <span>
                  TOTAL
                </span>

                <span></span>

              </div>

              {/* Products */}
              <div className="cart-items">

                {cartItems.map((item) => {

                  const currentQuantity =
                    Number(
                      item.quantity || 1
                    );

                  const available =
                    availableUnits[
                      item.productId
                    ];

                  const hasAvailability =
                    Number.isFinite(
                      available
                    );

                  const soldOut =
                    hasAvailability &&
                    available <= 0;

                  const maxReached =
                    hasAvailability &&
                    currentQuantity >=
                      available;

                  return (
                    <div
                      className="cart-item"
                      key={item.productId}
                    >

                      {/* Image */}
                      <div className="cart-item-image-box">

                        {item.image ? (
                          <img
                            src={getImageUrl(
                              item.image
                            )}
                            alt={
                              item.title ||
                              "Property"
                            }
                            className="cart-item-image"
                          />
                        ) : (
                          <div className="cart-no-image">
                            No Image
                          </div>
                        )}

                      </div>

                      {/* Name */}
                      <div className="cart-item-info">

                        <div className="cart-product-type">
                          Real Estate
                        </div>

                        <h3>
                          {item.title}
                        </h3>

                        {item.size && (
                          <p>
                            <strong>
                              Size:
                            </strong>{" "}
                            {item.size}
                          </p>
                        )}

                        {item.color && (
                          <p>
                            <strong>
                              Color:
                            </strong>{" "}
                            {item.color}
                          </p>
                        )}

                        {/* Availability */}
                        {hasAvailability && (
                          <p
                            style={{
                              fontSize:
                                "12px",
                              marginTop:
                                "5px",
                            }}
                          >
                            {soldOut ? (
                              <strong>
                                Sold Out
                              </strong>
                            ) : (
                              <>
                                <strong>
                                  {available}
                                </strong>{" "}
                                {available === 1
                                  ? "unit"
                                  : "units"}{" "}
                                available
                              </>
                            )}
                          </p>
                        )}

                      </div>

                      {/* Price */}
                      <div className="cart-item-price">

                        Rs.{" "}

                        {formatPrice(
                          item.price
                        )}{" "}

                        INR

                      </div>

                      {/* Quantity */}
                      <div className="cart-quantity-wrapper">

                        {/* Minus */}
                        <button
                          type="button"
                          onClick={() =>
                            handleQuantity(
                              item,
                              "decrease"
                            )
                          }
                          disabled={
                            currentQuantity <=
                            1
                          }
                        >
                          −
                        </button>

                        {/* Quantity */}
                        <span>
                          {currentQuantity}
                        </span>

                        {/* Plus */}
                        <button
                          type="button"
                          onClick={() =>
                            handleQuantity(
                              item,
                              "increase"
                            )
                          }
                          disabled={
                            soldOut ||
                            maxReached
                          }
                          title={
                            maxReached
                              ? `Only ${available} ${
                                  available ===
                                  1
                                    ? "unit"
                                    : "units"
                                } available`
                              : "Increase quantity"
                          }
                        >
                          +
                        </button>

                      </div>

                      {/* Total */}
                      <div className="cart-item-total">

                        Rs.{" "}

                        {formatPrice(
                          Number(
                            item.price || 0
                          ) *
                            currentQuantity
                        )}{" "}

                        INR

                      </div>

                      {/* Delete */}
                      <button
                        type="button"
                        className="cart-remove-btn"
                        onClick={() =>
                          handleRemove(
                            item.productId
                          )
                        }
                        aria-label="Remove product"
                      >

                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M3 6h18" />
                          <path d="M8 6V4h8v2" />
                          <path d="M19 6l-1 14H6L5 6" />
                          <path d="M10 11v5" />
                          <path d="M14 11v5" />
                        </svg>

                      </button>

                    </div>
                  );
                })}

              </div>

              {/* Gift Wrap */}
              <div className="gift-wrap-box">

                <div className="gift-wrap-left">

                  <span className="gift-icon">
                    ♧
                  </span>

                  <span>
                    Add a Gift Wrap to your
                    order, For Rs.
                    <br />

                    <strong>
                      500.00
                    </strong>
                  </span>

                </div>

                <button
                  type="button"
                  className="gift-wrap-btn"
                >
                  Add a Gift Wrap
                </button>

              </div>

            </div>

            {/* ======================================
                RIGHT SIDE
            ====================================== */}

            <aside className="cart-sidebar">

              {/* Instructions */}
              <div className="special-instructions">

                <label>
                  ORDER SPECIAL INSTRUCTIONS
                </label>

                <textarea
                  placeholder="Order special instructions"
                />

              </div>

              {/* Summary */}
              <div className="cart-summary">

                <h2>
                  Subtotal
                </h2>

                <div className="cart-subtotal">

                  Rs.{" "}

                  {formatPrice(
                    subtotal
                  )}{" "}

                  INR

                </div>

                <p>
                  Taxes and shipping
                  calculated at checkout
                </p>

                <button
                  type="button"
                  className="checkout-btn"
                  onClick={() =>
                    navigate(
                      "/checkout"
                    )
                  }
                  disabled={
                    cartItems.some(
                      (item) => {
                        const available =
                          availableUnits[
                            item.productId
                          ];

                        return (
                          Number.isFinite(
                            available
                          ) &&
                          (
                            available <= 0 ||
                            Number(
                              item.quantity ||
                                1
                            ) > available
                          )
                        );
                      }
                    )
                  }
                >
                  Proceed to checkout
                </button>

              </div>

            </aside>

          </div>
        )}

      </div>
    </div>
  );
};

export default Cart;