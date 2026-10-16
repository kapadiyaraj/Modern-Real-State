// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   useCallback,
// } from "react";
// import { useAuth } from "./AuthContext";

// const CartContext = createContext(null);

// const API_URL = "http://localhost:5000/api/cart";

// const getPrice = (price) => {
//   if (price === null || price === undefined) {
//     return 0;
//   }

//   if (typeof price === "number") {
//     return price;
//   }

//   const value = String(price);

//   const cleaned = value
//     .replace(/Rs\.?/gi, "")
//     .replace(/INR/gi, "")
//     .replace(/₹/g, "")
//     .replace(/,/g, "")
//     .trim();

//   const number = parseFloat(cleaned);

//   return Number.isFinite(number) ? number : 0;
// };

// export const CartProvider = ({ children }) => {
//   const { user, isAuthenticated } = useAuth();

//   const [items, setItems] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(true);

//   /*
//    * Logged-in user MongoDB ID
//    */
//   const userId = user?._id || user?.id || null;

//   /*
//    * JWT token
//    */
//   const token = localStorage.getItem("token");

//   /*
//    * ==========================================
//    * FETCH CART
//    * ==========================================
//    */
//   const fetchCart = useCallback(async () => {
//     /*
//      * User login વગર cart API protected છે,
//      * તેથી request ના મોકલવી.
//      */
//     if (!isAuthenticated || !userId || !token) {
//       setItems([]);
//       setTotal(0);
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);

//       const response = await fetch(`${API_URL}/${userId}`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(
//           result.message || "Failed to fetch cart"
//         );
//       }

//       setItems(result.data?.items || []);
//       setTotal(result.data?.total || 0);
//     } catch (error) {
//       console.error("Fetch Cart Error:", error);

//       setItems([]);
//       setTotal(0);
//     } finally {
//       setLoading(false);
//     }
//   }, [isAuthenticated, userId, token]);

//   /*
//    * Fetch whenever login/user changes
//    */
//   useEffect(() => {
//     fetchCart();
//   }, [fetchCart]);

//   /*
//    * ==========================================
//    * ADD TO CART
//    * ==========================================
//    */
//   const addToCart = async (product, quantity = 1) => {
//     if (!isAuthenticated || !userId || !token) {
//       alert("Please login to add products to cart.");
//       return {
//         success: false,
//         message: "Please login first",
//       };
//     }

//     try {
//       const productId = product?._id || product?.id;

//       if (!productId) {
//         throw new Error("Product ID is missing");
//       }

//       const priceNumber = getPrice(product.price);

//       const response = await fetch(API_URL, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           userId,
//           productId,

//            productType: product.productType || "property",



//           title: product.title || "",
//           image:
//             product.mainImage ||
//             product.image ||
//             product.sliderImage ||
//             "",
//           price: priceNumber,
//           quantity: Number(quantity) || 1,
//         }),
//       });

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(
//           result.message || "Failed to add to cart"
//         );
//       }

//       /*
//        * Update cart immediately
//        */
//       setItems(result.data?.items || []);
//       setTotal(result.data?.total || 0);

//       return {
//         success: true,
//         message: "Product added to cart",
//         data: result.data,
//       };
//     } catch (error) {
//       console.error("Add To Cart Error:", error);

//       alert(
//         error.message || "Failed to add product to cart"
//       );

//       return {
//         success: false,
//         message: error.message,
//       };
//     }
//   };

//   /*
//    * ==========================================
//    * UPDATE QUANTITY
//    * ==========================================
//    */
//   const updateQuantity = async (
//     productId,
//     quantity
//   ) => {
//     if (!isAuthenticated || !userId || !token) {
//       alert("Please login first.");
//       return;
//     }

//     if (quantity < 1) {
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${API_URL}/${userId}/${productId}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             quantity,
//           }),
//         }
//       );

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(
//           result.message ||
//             "Failed to update cart"
//         );
//       }

//       setItems(result.data?.items || []);
//       setTotal(result.data?.total || 0);
//     } catch (error) {
//       console.error(
//         "Update Cart Error:",
//         error
//       );

//       alert(
//         error.message ||
//           "Failed to update cart"
//       );
//     }
//   };

//   /*
//    * ==========================================
//    * INCREASE QUANTITY
//    * ==========================================
//    */
//   const increaseQty = (productId) => {
//     const item = items.find(
//       (item) =>
//         String(item.productId) ===
//         String(productId)
//     );

//     if (!item) {
//       return;
//     }

//     updateQuantity(
//       productId,
//       Number(item.quantity || 1) + 1
//     );
//   };

//   /*
//    * ==========================================
//    * DECREASE QUANTITY
//    * ==========================================
//    */
//   const decreaseQty = (productId) => {
//     const item = items.find(
//       (item) =>
//         String(item.productId) ===
//         String(productId)
//     );

//     if (!item) {
//       return;
//     }

//     if (Number(item.quantity || 1) <= 1) {
//       return;
//     }

//     updateQuantity(
//       productId,
//       Number(item.quantity) - 1
//     );
//   };

//   /*
//    * ==========================================
//    * REMOVE ITEM
//    * ==========================================
//    */
//   const removeFromCart = async (productId) => {
//     if (!isAuthenticated || !userId || !token) {
//       alert("Please login first.");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${API_URL}/${userId}/${productId}`,
//         {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(
//           result.message ||
//             "Failed to remove item"
//         );
//       }

//       setItems(result.data?.items || []);
//       setTotal(result.data?.total || 0);
//     } catch (error) {
//       console.error(
//         "Remove Cart Item Error:",
//         error
//       );

//       alert(
//         error.message ||
//           "Failed to remove item"
//       );
//     }
//   };

//   /*
//    * ==========================================
//    * CLEAR CART
//    * ==========================================
//    */
//   const clearCart = async () => {
//     if (!isAuthenticated || !userId || !token) {
//       setItems([]);
//       setTotal(0);
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${API_URL}/${userId}`,
//         {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(
//           result.message ||
//             "Failed to clear cart"
//         );
//       }

//       setItems([]);
//       setTotal(0);
//     } catch (error) {
//       console.error(
//         "Clear Cart Error:",
//         error
//       );

//       alert(
//         error.message ||
//           "Failed to clear cart"
//       );
//     }
//   };

//   /*
//    * ==========================================
//    * DERIVED VALUES
//    * ==========================================
//    */

//   const cartCount = items.reduce(
//     (sum, item) =>
//       sum + Number(item.quantity || 1),
//     0
//   );

//   const cartTotal = Number(
//     total || 0
//   ).toLocaleString("en-IN", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });

//   /*
//    * ==========================================
//    * CONTEXT VALUE
//    * ==========================================
//    */

//   const value = {
//     userId,
//     items,

//     /*
//      * Keep both names so existing components
//      * using either one continue to work.
//      */
//     cartItems: items,

//     cartCount,

//     cartSubtotal: Number(total || 0),

//     cartTotal,

//     /*
//      * Numeric total also available
//      */
//     cartTotalNumber: Number(total || 0),

//     loading,

//     addToCart,
//     updateQuantity,
//     increaseQty,
//     decreaseQty,
//     removeFromCart,
//     clearCart,

//     refreshCart: fetchCart,
//     fetchCart,
//   };

//   return (
//     <CartContext.Provider value={value}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);

//   if (!context) {
//     throw new Error(
//       "useCart must be used within CartProvider"
//     );
//   }

//   return context;
// };




import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

const API_URL = "http://localhost:5000/api/cart";

const getPrice = (price) => {
  if (price === null || price === undefined) {
    return 0;
  }

  if (typeof price === "number") {
    return price;
  }

  const value = String(price);

  const cleaned = value
    .replace(/Rs\.?/gi, "")
    .replace(/INR/gi, "")
    .replace(/₹/g, "")
    .replace(/,/g, "")
    .trim();

  const number = parseFloat(cleaned);

  return Number.isFinite(number) ? number : 0;
};

// ==========================================
// PRODUCT ID RESOLUTION
// ==========================================
// Standard properties are looked up on the backend by their Mongo _id
// (Property.findById), so _id must be sent.
//
// Luxury properties are looked up by a custom numeric "id" field
// (LuxuriousProperties.findOne({ id })), NOT the Mongo _id. Sending _id
// for a luxury item makes the backend lookup fail (Number(_id) = NaN),
// which is why price/image/title couldn't be resolved for luxury orders.
const resolveProductId = (product) => {
  const productType = product?.productType || "property";

  if (productType === "luxury") {
    // Prefer the custom numeric id; fall back to _id only if it's missing.
    return product?.id ?? product?._id;
  }

  // Standard property (and any other type): prefer the Mongo _id.
  return product?._id ?? product?.id;
};

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  /*
   * Logged-in user MongoDB ID
   */
  const userId = user?._id || user?.id || null;

  /*
   * JWT token
   */
  const token = localStorage.getItem("token");

  /*
   * ==========================================
   * FETCH CART
   * ==========================================
   */
  const fetchCart = useCallback(async () => {
    /*
     * User login વગર cart API protected છે,
     * તેથી request ના મોકલવી.
     */
    if (!isAuthenticated || !userId || !token) {
      setItems([]);
      setTotal(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to fetch cart"
        );
      }

      setItems(result.data?.items || []);
      setTotal(result.data?.total || 0);
    } catch (error) {
      console.error("Fetch Cart Error:", error);

      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, userId, token]);

  /*
   * Fetch whenever login/user changes
   */
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  /*
   * ==========================================
   * ADD TO CART
   * ==========================================
   */
  const addToCart = async (product, quantity = 1) => {
    if (!isAuthenticated || !userId || !token) {
      alert("Please login to add products to cart.");
      return {
        success: false,
        message: "Please login first",
      };
    }

    try {
      const productType = product.productType || "property";

      // IMPORTANT: id resolution depends on productType.
      // - "property" -> Mongo _id (Property.findById on the backend)
      // - "luxury"   -> custom numeric id (LuxuriousProperties.findOne({ id }))
      const productId = resolveProductId(product);

      if (!productId && productId !== 0) {
        throw new Error("Product ID is missing");
      }

      const priceNumber = getPrice(product.price);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          productId,

          productType,

          title: product.title || "",
          image:
            product.mainImage ||
            product.image ||
            product.sliderImage ||
            "",
          price: priceNumber,
          quantity: Number(quantity) || 1,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to add to cart"
        );
      }

      /*
       * Update cart immediately
       */
      setItems(result.data?.items || []);
      setTotal(result.data?.total || 0);

      return {
        success: true,
        message: "Product added to cart",
        data: result.data,
      };
    } catch (error) {
      console.error("Add To Cart Error:", error);

      alert(
        error.message || "Failed to add product to cart"
      );

      return {
        success: false,
        message: error.message,
      };
    }
  };

  /*
   * ==========================================
   * UPDATE QUANTITY
   * ==========================================
   */
  const updateQuantity = async (
    productId,
    quantity
  ) => {
    if (!isAuthenticated || !userId || !token) {
      alert("Please login first.");
      return;
    }

    if (quantity < 1) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/${userId}/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quantity,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to update cart"
        );
      }

      setItems(result.data?.items || []);
      setTotal(result.data?.total || 0);
    } catch (error) {
      console.error(
        "Update Cart Error:",
        error
      );

      alert(
        error.message ||
          "Failed to update cart"
      );
    }
  };

  /*
   * ==========================================
   * INCREASE QUANTITY
   * ==========================================
   */
  const increaseQty = (productId) => {
    const item = items.find(
      (item) =>
        String(item.productId) ===
        String(productId)
    );

    if (!item) {
      return;
    }

    updateQuantity(
      productId,
      Number(item.quantity || 1) + 1
    );
  };

  /*
   * ==========================================
   * DECREASE QUANTITY
   * ==========================================
   */
  const decreaseQty = (productId) => {
    const item = items.find(
      (item) =>
        String(item.productId) ===
        String(productId)
    );

    if (!item) {
      return;
    }

    if (Number(item.quantity || 1) <= 1) {
      return;
    }

    updateQuantity(
      productId,
      Number(item.quantity) - 1
    );
  };

  /*
   * ==========================================
   * REMOVE ITEM
   * ==========================================
   */
  const removeFromCart = async (productId) => {
    if (!isAuthenticated || !userId || !token) {
      alert("Please login first.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/${userId}/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to remove item"
        );
      }

      setItems(result.data?.items || []);
      setTotal(result.data?.total || 0);
    } catch (error) {
      console.error(
        "Remove Cart Item Error:",
        error
      );

      alert(
        error.message ||
          "Failed to remove item"
      );
    }
  };

  /*
   * ==========================================
   * CLEAR CART
   * ==========================================
   */
  const clearCart = async () => {
    if (!isAuthenticated || !userId || !token) {
      setItems([]);
      setTotal(0);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to clear cart"
        );
      }

      setItems([]);
      setTotal(0);
    } catch (error) {
      console.error(
        "Clear Cart Error:",
        error
      );

      alert(
        error.message ||
          "Failed to clear cart"
      );
    }
  };

  /*
   * ==========================================
   * DERIVED VALUES
   * ==========================================
   */

  const cartCount = items.reduce(
    (sum, item) =>
      sum + Number(item.quantity || 1),
    0
  );

  const cartTotal = Number(
    total || 0
  ).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  /*
   * ==========================================
   * CONTEXT VALUE
   * ==========================================
   */

  const value = {
    userId,
    items,

    /*
     * Keep both names so existing components
     * using either one continue to work.
     */
    cartItems: items,

    cartCount,

    cartSubtotal: Number(total || 0),

    cartTotal,

    /*
     * Numeric total also available
     */
    cartTotalNumber: Number(total || 0),

    loading,

    addToCart,
    updateQuantity,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart,

    refreshCart: fetchCart,
    fetchCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used within CartProvider"
    );
  }

  return context;
};