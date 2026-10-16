import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import "./Checkout.css";

const SERVER = "http://localhost:5000";

const Checkout = () => {
  const navigate = useNavigate();

  const {
    cartItems = [],
    cartTotal = 0,
    clearCart,
  } = useCart();

  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    country: "India",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "Gujarat",
    pincode: "",
    phone: "",
    cardNumber: "",
    expiry: "",
    securityCode: "",
    cardName: "",
  });

  const [sameBilling, setSameBilling] = useState(true);

  // Duplicate-submit / double-click protection
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitLock = useRef(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
  // PRICE PARSING
  // ==========================================
  // Converts values like:
  // "8700989"
  // "8,700,989"
  // "Rs. 8,700,989"
  // "₹ 8,700,989"
  // into a proper number instead of silently
  // collapsing to 0 via Number(item.price).
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

  // Calculate directly from cart items instead of relying only on cartTotal,
  // since cartTotal may itself be a formatted string.
  const calculatedSubtotal = cartItems.reduce((sum, item) => {
    const price = parsePrice(item.price);
    const quantity = Number(item.quantity) || 1;

    return sum + price * quantity;
  }, 0);

  const total = calculatedSubtotal;

  const shipping = 0;

  const taxes = 0;

  const finalTotal = total + shipping + taxes;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent multiple clicks / duplicate orders
    if (isSubmitting || submitLock.current) {
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    submitLock.current = true;
    setIsSubmitting(true);

    try {
      // =========================
      // CUSTOMER DETAILS
      // =========================

      const checkoutName =
        `${formData.firstName} ${formData.lastName}`.trim();

      // Get actual logged-in user's ID
      const loggedInUserId =
        user?._id || user?.id || null;

      // ==========================================
      // REGISTERED vs GUEST
      // ==========================================

      const customerType =
        isAuthenticated && loggedInUserId
          ? "registered"
          : "guest";

      // Registered user -> account name
      // Guest -> checkout form name
      const loggedInUserName =
        customerType === "registered"
          ? user?.name ||
            user?.userName ||
            checkoutName ||
            "Guest"
          : checkoutName || "Guest";

      // Registered user -> account email
      // Guest -> ONLY checkout form email
      const loggedInUserEmail =
        customerType === "registered"
          ? user?.email || formData.email
          : formData.email;

      // =========================
      // ORDER DATA
      // =========================

      const orderData = {
        // Registered user -> actual MongoDB user ID
        // Guest -> null
        userId:
          customerType === "registered"
            ? loggedInUserId
            : null,

        // "registered" OR "guest"
        customerType,

        // Registered user -> account name
        // Guest -> checkout name
        name:
          customerType === "registered"
            ? loggedInUserName
            : checkoutName || "Guest",

        // Registered user -> account email
        // Guest -> checkout email
        email: loggedInUserEmail,

        phone: formData.phone,

        // =========================
        // SHIPPING ADDRESS
        // =========================

        shippingAddress: {
          country: formData.country,

          firstName: formData.firstName,

          lastName: formData.lastName,

          address: formData.address,

          apartment: formData.apartment,

          city: formData.city,

          state: formData.state,

          pincode: formData.pincode,
        },

        // =========================
        // CART ITEMS
        // =========================

        items: cartItems.map((item) => ({
          productId: item.productId,

          productType: item.productType || "property",

          title: item.title,

          image: item.image || "",

          price: parsePrice(item.price),

          quantity: Number(item.quantity) || 1,
        })),

        // =========================
        // PRICE
        // =========================
        // Sent for reference only — the backend
        // recalculates and verifies these values
        // against MongoDB before saving the order.

        subtotal: calculatedSubtotal,

        shipping: 0,

        taxes: 0,

        total: finalTotal,

        // NOTE:
        // cardNumber
        // expiry
        // securityCode
        // cardName
        //
        // are intentionally NOT sent
        // to MongoDB.
      };

      console.log("ORDER DATA:", orderData);

      // =========================
      // CREATE ORDER
      // =========================

      const response = await fetch(
        `${SERVER}/api/orders`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(orderData),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to place order"
        );
      }

      console.log(
        "ORDER SAVED IN MONGODB:",
        result.data
      );

      // =========================
      // CLEAR MONGODB CART
      // =========================

      if (clearCart) {
        await clearCart();
      }

      alert(
        `Order placed successfully!\n\nOrder ID: ${
          result.data?._id || "N/A"
        }\nTotal: Rs. ${Number(
          result.data?.total || finalTotal
        ).toLocaleString("en-IN")}`
      );

      navigate("/");
    } catch (error) {
      console.error(
        "PLACE ORDER ERROR:",
        error
      );

      alert(
        error.message ||
          "Something went wrong while placing order."
      );

      // Allow retry only when the order failed.
      submitLock.current = false;
      setIsSubmitting(false);
    }
  };

  // =========================
  // EMPTY CART
  // =========================

  if (cartItems.length === 0) {
    return (
      <div className="checkout-empty">
        <div className="checkout-empty-inner">
          <h1>Your cart is empty</h1>

          <p>
            Add some properties to your cart before proceeding to checkout.
          </p>

          <Link
            to="/"
            className="checkout-shop-btn"
          >
            ← Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">

      {/* HEADER */}

      <header className="checkout-header">
        <Link
          to="/"
          className="checkout-logo"
        >
          <span>modernreal</span>
          <small>estate</small>
        </Link>
      </header>

      <form
        className="checkout-layout"
        onSubmit={handleSubmit}
      >

        {/* LEFT SIDE */}

        <div className="checkout-left">

          {/* CONTACT */}

          <section className="checkout-section">

            <div className="checkout-section-title-row">
              <h2>Contact</h2>

              <Link to="/account/login">
                Sign in
              </Link>
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email or mobile phone number"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label className="checkout-checkbox">
              <input type="checkbox" />

              <span>
                Email me with news and offers
              </span>
            </label>

          </section>


          {/* DELIVERY */}

          <section className="checkout-section">

            <h2>Delivery</h2>

            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
            >
              <option value="India">
                India
              </option>

              <option value="Australia">
                Australia
              </option>

              <option value="United States">
                United States
              </option>
            </select>

            <div className="checkout-two-columns">

              <input
                type="text"
                name="firstName"
                placeholder="First name (optional)"
                value={formData.firstName}
                onChange={handleChange}
              />

              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />

            </div>

            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="apartment"
              placeholder="Apartment, suite, etc. (optional)"
              value={formData.apartment}
              onChange={handleChange}
            />

            <div className="checkout-three-columns">

              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
              />

              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
              >
                <option value="Gujarat">
                  Gujarat
                </option>

                <option value="Maharashtra">
                  Maharashtra
                </option>

                <option value="Rajasthan">
                  Rajasthan
                </option>

                <option value="Delhi">
                  Delhi
                </option>
              </select>

              <input
                type="text"
                name="pincode"
                placeholder="PIN code"
                value={formData.pincode}
                onChange={handleChange}
                required
              />

            </div>

            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <label className="checkout-checkbox">

              <input
                type="checkbox"
              />

              <span>
                Save this information for next time
              </span>

            </label>

          </section>


          {/* SHIPPING METHOD */}

          <section className="checkout-section">

            <h2>Shipping method</h2>

            <div className="shipping-placeholder">
              Enter your shipping address to view available
              shipping methods.
            </div>

          </section>


          {/* PAYMENT */}

          <section className="checkout-section">

            <h2>Payment</h2>

            <p className="payment-subtitle">
              All transactions are secure and encrypted.
            </p>

            <div className="payment-box">

              <div className="payment-method-header">

                <span>Credit card</span>

                <span className="card-icon">
                  ▭
                </span>

              </div>

              <div className="testing-info">

                <strong>
                  Testing instruction
                </strong>

                <p>
                  Use these values to test your checkout:
                </p>

                <ul>

                  <li>
                    1 to simulate an approved transaction
                  </li>

                  <li>
                    2 to simulate a declined transaction
                  </li>

                  <li>
                    3 to simulate a gateway failure
                  </li>

                </ul>

                <small>
                  Use any future expiration date and any 3-digit
                  security code.
                </small>

              </div>

              <input
                type="text"
                name="cardNumber"
                placeholder="Card number"
                value={formData.cardNumber}
                onChange={handleChange}
                required
              />

              <div className="checkout-two-columns">

                <input
                  type="text"
                  name="expiry"
                  placeholder="Expiration date (MM / YY)"
                  value={formData.expiry}
                  onChange={handleChange}
                  required
                />

                <input
                  type="text"
                  name="securityCode"
                  placeholder="Security code"
                  value={formData.securityCode}
                  onChange={handleChange}
                  required
                />

              </div>

              <input
                type="text"
                name="cardName"
                placeholder="Name on card"
                value={formData.cardName}
                onChange={handleChange}
                required
              />

              <label className="checkout-checkbox">

                <input
                  type="checkbox"
                  checked={sameBilling}
                  onChange={(e) =>
                    setSameBilling(e.target.checked)
                  }
                />

                <span>
                  Use shipping address as billing address
                </span>

              </label>

            </div>

          </section>


          <button
            type="submit"
            className="pay-now-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Pay now"}
          </button>

        </div>


        {/* RIGHT SIDE */}

        <aside className="checkout-right">

          <div className="checkout-order-summary">

            {/* PRODUCTS */}

            <div className="checkout-products">

              {cartItems.map((item) => {

                const itemPrice =
                  parsePrice(item.price);

                const quantity =
                  Number(item.quantity) || 1;

                const itemTotal =
                  itemPrice * quantity;

                return (
                  <div
                    className="checkout-product"
                    key={item.productId}
                  >

                    <div className="checkout-product-image">

                      <img
                        src={getImageUrl(item.image)}
                        alt={item.title}
                      />

                      <span className="checkout-quantity">
                        {quantity}
                      </span>

                    </div>

                    <div className="checkout-product-info">

                      <h3>
                        {item.title}
                      </h3>

                      {item.size && (
                        <p>
                          {item.size}
                        </p>
                      )}

                    </div>

                    <div className="checkout-product-price">

                      Rs.{" "}
                      {itemTotal.toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                        }
                      )}

                    </div>

                  </div>
                );
              })}

            </div>


            {/* SUMMARY */}

            <div className="checkout-summary">

              <div>

                <span>Subtotal</span>

                <strong>
                  Rs.{" "}
                  {total.toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                    }
                  )}
                </strong>

              </div>

              <div>

                <span>Shipping</span>

                <span className="summary-muted">
                  Enter shipping address
                </span>

              </div>

              <div>

                <span>Estimated taxes</span>

                <strong>
                  Rs.{" "}
                  {taxes.toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                    }
                  )}
                </strong>

              </div>

              <div className="checkout-total">

                <span>Total</span>

                <strong>
                  <small>INR</small>{" "}
                  Rs.{" "}
                  {finalTotal.toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                    }
                  )}
                </strong>

              </div>

            </div>

          </div>

        </aside>

      </form>

    </div>
  );
};

export default Checkout;