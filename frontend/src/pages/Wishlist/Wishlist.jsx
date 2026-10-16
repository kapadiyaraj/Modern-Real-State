import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import "./Wishlist.css";

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

const resolveMainImage = (item) => {
  const raw =
    item.image ||
    item.mainImage ||
    item.gallery?.[0] ||
    item.sliderImages?.[0] ||
    item.subImages?.[0] ||
    item.images?.[0] ||
    "";
  return getImageUrl(raw);
};

const formatPrice = (price) => {
  const number = typeof price === "number" ? price : parseFloat(price) || 0;
  if (number === 0) return "";
  return `Rs. ${number.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} INR`;
};

const Wishlist = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    wishlist,
    wishlistCount,
    loading,
    removeFromWishlist,
    clearWishlist,
  } = useWishlist();

  const { addToCart } = useCart();
  const [removingId, setRemovingId] = useState(null);

  const getDetailPath = (item) => {
    const type = item.wishlistType || item.type || "";
    const rawId = String(item.productId || "").includes(":")
      ? String(item.productId).split(":").slice(1).join(":")
      : item.productId;

    if (type === "luxury") {
      return `/luxury-properties/${rawId}`;
    }
    if (type === "penthouse") {
      return `/penthouse-properties/${rawId}`;
    }
    return `/property/${rawId}`;
  };

  const handleViewProperty = (item) => {
    navigate(getDetailPath(item));
  };

  const handleRemove = async (item) => {
    try {
      setRemovingId(item.productId);
      await removeFromWishlist(item.productId);
    } finally {
      setRemovingId(null);
    }
  };

  const handleClearAll = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear your entire wishlist?"
    );
    if (!confirmed) return;
    await clearWishlist();
  };

  const handleAddToCart = (item) => {
    addToCart(
      {
        _id: item.productId,
        title: item.title,
        price: item.price,
        mainImage: resolveMainImage(item) ? item.image || item.mainImage : "",
        image: item.image || item.mainImage,
      },
      1
    );
  };

  const normalizedItems = useMemo(() => {
    return wishlist.map((item) => ({
      ...item,
      resolvedImage: resolveMainImage(item),
    }));
  }, [wishlist]);

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <div className="wishlist-page">
          <div className="wishlist-empty-state">
            <h2>Please log in to view your wishlist</h2>
            <p>Sign in to save and manage your favorite properties.</p>
            <button
              type="button"
              className="wishlist-login-btn"
              onClick={() => navigate("/account/login")}
            >
              Log In
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* Top Black Hero Banner */}
      <div className="wishlist-hero-banner">
        <div className="wishlist-hero-container">
          <button
            type="button"
            className="wishlist-back-btn"
            onClick={() => navigate("/")}
          >
            <div className="back-circle-icon">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </div>
            Back to Home
          </button>
          <h1>Wishlist</h1>
          <p>
            We are driven by a passion for learning, discovery, and connection.
            We constantly strive to enhance our platform, incorporate emerging
            technologies, and adapt to the evolving needs of our users.
          </p>
        </div>
      </div>

      <div className="wishlist-page-content">
        {loading ? (
          <div className="wishlist-loading">Loading your wishlist...</div>
        ) : normalizedItems.length === 0 ? (
          <div className="wishlist-empty-state">
            <h2>Your wishlist is empty</h2>
            <p>
              Browse our properties and tap the heart icon to save your
              favorites here.
            </p>
            <button
              type="button"
              className="wishlist-continue-btn"
              onClick={() => navigate("/")}
            >
              Browse Properties
            </button>
          </div>
        ) : (
          <>
            {/* Wishlist Count Header */}
            <div className="wishlist-count-heading">
              Wishlist({wishlistCount})
            </div>

            {/* Main Table */}
            <div className="wishlist-table-wrapper">
              <table className="wishlist-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Details</th>
                    <th>Cart Button</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {normalizedItems.map((item) => (
                    <tr key={item._id || item.productId}>
                      <td
                        className="wishlist-col-product"
                        onClick={() => handleViewProperty(item)}
                      >
                        {item.resolvedImage ? (
                          <img
                            src={item.resolvedImage}
                            alt={item.title}
                            className="wishlist-thumb"
                          />
                        ) : (
                          <div className="wishlist-no-image">No Image</div>
                        )}
                      </td>

                      <td
                        className="wishlist-col-details"
                        onClick={() => handleViewProperty(item)}
                      >
                        <span className="wishlist-item-category">
                          {item.category || "Real Estate"}
                        </span>
                        <h4 className="wishlist-item-title">{item.title}</h4>
                        {item.size && (
                          <p className="wishlist-item-size">{item.size}</p>
                        )}
                        <div className="wishlist-item-price">
                          {formatPrice(item.price) && (
                            <strong>{formatPrice(item.price)}</strong>
                          )}
                          {formatPrice(item.oldPrice) && (
                            <del>{formatPrice(item.oldPrice)}</del>
                          )}
                        </div>
                      </td>

                      <td className="wishlist-col-cart">
                        <button
                          type="button"
                          className="wishlist-add-cart-btn"
                          onClick={() => handleAddToCart(item)}
                        >
                          Add to Cart
                        </button>
                      </td>

                      <td className="wishlist-col-delete">
                        <button
                          type="button"
                          className="wishlist-delete-icon-btn"
                          onClick={() => handleRemove(item)}
                          disabled={removingId === item.productId}
                        >
                          {removingId === item.productId ? (
                            "..."
                          ) : (
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#ff6b6b"
                              strokeWidth="2"
                            >
                              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Clear All Button Below Table */}
            <div className="wishlist-bottom-actions">
              <button
                type="button"
                className="wishlist-clear-all-btn"
                onClick={handleClearAll}
              >
                Clear All
              </button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Wishlist;