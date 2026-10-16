import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PropertyCard.css";

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();

  const [isWishlist, setIsWishlist] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const handleWishlist = () => {
    setIsWishlist((prev) => !prev);
  };

  const handleCompare = () => {
    const oldCompare =
      JSON.parse(localStorage.getItem("compareProducts")) || [];

    const alreadyExists = oldCompare.some(
      (item) => item.id === property.id
    );

    if (!alreadyExists) {
      localStorage.setItem(
        "compareProducts",
        JSON.stringify([...oldCompare, property])
      );
    }

    navigate("/pages/compare");
  };

  const handleQuickView = () => {
    setShowQuickView(true);
  };

  return (
    <>
      <article className="property-card">

        {/* IMAGE */}
        <div className="property-card-image">

          <img
            src={property.image}
            alt={property.title}
          />

          {/* HOVER ACTION BUTTONS */}
          <div className="property-hover-actions">

            {/* WISHLIST */}
            <button
              type="button"
              className={`property-action-btn wishlist-btn ${
                isWishlist ? "active" : ""
              }`}
              onClick={handleWishlist}
              aria-label="Add to wishlist"
            >
              ♡
            </button>

            {/* COMPARE */}
            <button
              type="button"
              className="property-action-btn"
              onClick={handleCompare}
              aria-label="Compare property"
            >
              ⇄
            </button>

            {/* QUICK VIEW */}
            <button
              type="button"
              className="property-action-btn"
              onClick={handleQuickView}
              aria-label="Quick view"
            >
              ◉
            </button>

          </div>
        </div>

        {/* CONTENT */}
        <div className="property-card-content">

          <div className="property-category">
            <span>◎</span>
            <span>{property.category || "Home"}</span>
          </div>

          <h3>{property.title}</h3>

          <select defaultValue={property.size}>
            <option value={property.size}>
              {property.size}
            </option>
          </select>

          <div className="property-price">
            <strong>{property.price}</strong>

            {property.oldPrice && (
              <del>{property.oldPrice}</del>
            )}
          </div>

          <button
            type="button"
            className="property-add-btn"
          >
            Add to Cart →
          </button>

        </div>
      </article>

      {/* QUICK VIEW MODAL */}
      {showQuickView && (
        <div
          className="quick-view-overlay"
          onClick={() => setShowQuickView(false)}
        >
          <div
            className="quick-view-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="quick-view-close"
              onClick={() => setShowQuickView(false)}
            >
              ×
            </button>

            <div className="quick-view-image">
              <img
                src={property.image}
                alt={property.title}
              />
            </div>

            <div className="quick-view-info">

              <span className="quick-view-category">
                {property.category || "Real Estate"}
              </span>

              <h2>{property.title}</h2>

              <p className="quick-view-size">
                {property.size}
              </p>

              <div className="quick-view-price">
                <strong>{property.price}</strong>

                {property.oldPrice && (
                  <del>{property.oldPrice}</del>
                )}
              </div>

              <button
                type="button"
                className="quick-view-cart"
              >
                Add to Cart →
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyCard;