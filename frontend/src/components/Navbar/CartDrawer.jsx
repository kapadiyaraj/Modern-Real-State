import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./CartDrawer.css";

const SERVER_URL = "http://localhost:5000";

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
    return `${SERVER_URL}${image}`;
  }

  if (image.startsWith("uploads/")) {
    return `${SERVER_URL}/${image}`;
  }

  if (image.startsWith("/")) {
    return image;
  }

  return `${SERVER_URL}/${image}`;
};

const formatPrice = (value) => {
  return `Rs. ${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} INR`;
};

const CartDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const {
    items,
    cartCount,
    cartSubtotal,
    loading,
    increaseQty,
    decreaseQty,
    removeFromCart,
  } = useCart();

  const FREE_SHIPPING_THRESHOLD = 50000;
  const isEligibleForFreeShipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD;
  const progressPercent = Math.min(
    100,
    (cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100
  );

  const handleViewCart = () => {
    onClose();
    navigate("/cart");
  };

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    onClose();
    navigate("/");
  };

  if (!isOpen) return null;

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <div
        className="cart-drawer"
        onClick={(event) => event.stopPropagation()}
      >
        {/* HEADER */}
        <div className="cart-drawer-header">
          <h2>My Cart</h2>
          <span className="cart-drawer-count">
            {cartCount} {cartCount === 1 ? "ITEM" : "ITEMS"}
          </span>
          <button
            type="button"
            className="cart-drawer-close"
            onClick={onClose}
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className="cart-drawer-empty">
            <h3>Loading cart...</h3>
          </div>
        ) : items.length === 0 ? (
          /* ===================================
              EMPTY CART
          =================================== */
          <div className="cart-drawer-empty">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
              <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" />
            </svg>

            <h3>Your cart is empty</h3>

            <button
              type="button"
              className="cart-drawer-continue-btn"
              onClick={handleContinueShopping}
            >
              <span>←</span> Continue shopping
            </button>
          </div>
        ) : (
          <>
            {/* FREE SHIPPING PROGRESS */}
            <div className="cart-drawer-shipping">
              {isEligibleForFreeShipping ? (
                <p>
                  <strong>Congrats!</strong> You are eligible for{" "}
                  <strong>FREE Shipping</strong>
                </p>
              ) : (
                <p>
                  Add{" "}
                  <strong>
                    {formatPrice(FREE_SHIPPING_THRESHOLD - cartSubtotal)}
                  </strong>{" "}
                  more for <strong>FREE Shipping</strong>
                </p>
              )}

              <div className="cart-drawer-progress-row">
                <div className="cart-drawer-progress-track">
                  <div
                    className="cart-drawer-progress-fill"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="cart-drawer-truck-icon">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect x="1" y="6" width="14" height="10" rx="1"></rect>
                    <path d="M15 10h4l3 3v3h-7z"></path>
                    <circle cx="6" cy="18" r="1.5"></circle>
                    <circle cx="17.5" cy="18" r="1.5"></circle>
                  </svg>
                </div>
              </div>
            </div>

            {/* CART ITEMS */}
            <div className="cart-drawer-items">
              {items.map((item) => {
                const image = getImageUrl(item.image);
                const qty = item.quantity || 1;
                const price = item.price || 0;

                return (
                  <div className="cart-drawer-item" key={item.productId}>
                    <img
                      src={image}
                      alt={item.title}
                      className="cart-drawer-item-image"
                    />

                    <div className="cart-drawer-item-details">
                      <h4>{item.title}</h4>

                      <div className="cart-drawer-qty-row">
                        <div className="cart-drawer-qty-control">
                          <button
                            type="button"
                            onClick={() => decreaseQty(item.productId)}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span>{qty}</span>
                          <button
                            type="button"
                            onClick={() => increaseQty(item.productId)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          className="cart-drawer-remove-btn"
                          onClick={() => removeFromCart(item.productId)}
                          aria-label="Remove item"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                            <path d="M10 11v6"></path>
                            <path d="M14 11v6"></path>
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
                          </svg>
                        </button>
                      </div>

                      <p className="cart-drawer-item-price">
                        {formatPrice(price * qty)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* FOOTER */}
            <div className="cart-drawer-footer">
              <div className="cart-drawer-totals">
                <div>
                  <span>Total Item</span>
                  <strong>{cartCount}</strong>
                </div>

                <div className="cart-drawer-subtotal">
                  <span>Subtotal</span>
                  <strong>{formatPrice(cartSubtotal)}</strong>
                </div>
              </div>

              <div className="cart-drawer-buttons">
                <button
                  type="button"
                  className="cart-drawer-view-btn"
                  onClick={handleViewCart}
                >
                  View Cart
                </button>

                <button
                  type="button"
                  className="cart-drawer-checkout-btn"
                  onClick={handleCheckout}
                >
                  Proceed to checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;