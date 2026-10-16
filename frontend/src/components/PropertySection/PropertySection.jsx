




import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./PropertySection.css";

import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { useCompare } from "../../context/CompareContext";

const API_URL = "http://localhost:5000/api/properties";
const IMAGE_URL = "http://localhost:5000";

const PropertySection = () => {
  const navigate = useNavigate();

  const {
    toggleWishlist,
    isWishlisted,
  } = useWishlist();

  const {
    addToCart,
  } = useCart();

  const {
    addToCompare,
    isCompared,
  } = useCompare();

  // ==========================================
  // PROPERTIES
  // ==========================================

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // QUICK VIEW
  // ==========================================

  const [quickView, setQuickView] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // ==========================================
  // SLIDER
  // ==========================================

  const [currentSlide, setCurrentSlide] = useState(0);

  // ==========================================
  // IMAGE URL
  // ==========================================

  const getImageUrl = (image) => {
    if (!image) {
      return "";
    }

    if (typeof image !== "string") {
      return "";
    }

    image = image.trim();

    if (!image) {
      return "";
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("data:")
    ) {
      return image;
    }

    if (image.startsWith("/")) {
      return `${IMAGE_URL}${image}`;
    }

    return `${IMAGE_URL}/${image}`;
  };

  // ==========================================
  // GET PROPERTIES FROM MONGODB
  // ==========================================

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(
            `Property API failed: ${response.status}`
          );
        }

        const result = await response.json();

        let items = [];

        if (Array.isArray(result)) {
          items = result;
        } else if (
          result?.success &&
          Array.isArray(result.data)
        ) {
          items = result.data;
        } else if (Array.isArray(result?.data)) {
          items = result.data;
        } else if (
          Array.isArray(result?.properties)
        ) {
          items = result.properties;
        }

        setProperties(items);
      } catch (error) {
        console.error(
          "Property API Error:",
          error
        );

        setError(
          "Unable to load properties."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // ==========================================
  // RESET SLIDER
  // ==========================================

  useEffect(() => {
    if (
      properties.length > 0 &&
      currentSlide >= properties.length
    ) {
      setCurrentSlide(0);
    }
  }, [properties, currentSlide]);

  // ==========================================
  // NEXT SLIDE
  // ==========================================

  const nextSlide = () => {
    if (properties.length === 0) {
      return;
    }

    setCurrentSlide(
      (previous) =>
        (previous + 1) %
        properties.length
    );
  };

  // ==========================================
  // PREVIOUS SLIDE
  // ==========================================

  const prevSlide = () => {
    if (properties.length === 0) {
      return;
    }

    setCurrentSlide(
      (previous) =>
        (
          previous -
          1 +
          properties.length
        ) % properties.length
    );
  };

  // ==========================================
  // VISIBLE PROPERTIES
  // ==========================================

  const visibleProperties =
    properties.length === 1
      ? [properties[0]]
      : properties.length > 1
      ? [
          properties[currentSlide],
          properties[
            (currentSlide + 1) %
              properties.length
          ],
        ]
      : [];

  // ==========================================
  // COMPARE
  // ==========================================

  const handleCompare = async (property) => {
    try {
      const result =
        await addToCompare({
          ...property,
          productType: "property",
          propertyType: "property",
          compareType: "property",
        });

      if (
        result?.success === false
      ) {
        alert(
          result.message ||
            "Unable to add property to compare."
        );

        return;
      }

      navigate("/compare");
    } catch (error) {
      console.error(
        "Compare error:",
        error
      );

      alert(
        error.message ||
          "Failed to add property to compare."
      );
    }
  };

  // ==========================================
  // QUICK VIEW
  // ==========================================

  const handleQuickView = (property) => {
    setQuickView(property);

    setQuantity(1);

    const propertySizes =
      Array.isArray(property?.sizes) &&
      property.sizes.length > 0
        ? property.sizes
        : property?.size
        ? [property.size]
        : [];

    setSelectedSize(
      propertySizes[0] || ""
    );

    setModalImageIndex(0);
  };

  // ==========================================
  // MODAL IMAGES
  // MAIN IMAGE + SUB IMAGES
  // ==========================================

  const modalImages = (() => {
    if (!quickView) {
      return [];
    }

    const imageList = [];

    if (quickView.mainImage) {
      imageList.push(
        quickView.mainImage
      );
    }

    if (
      Array.isArray(
        quickView.subImages
      )
    ) {
      imageList.push(
        ...quickView.subImages
          .filter(Boolean)
          .slice(0, 4)
      );
    }

    return [
      ...new Set(
        imageList
          .map(getImageUrl)
          .filter(Boolean)
      ),
    ];
  })();

  // ==========================================
  // NEXT MODAL IMAGE
  // ==========================================

  const nextModalImage = () => {
    if (
      modalImages.length === 0
    ) {
      return;
    }

    setModalImageIndex(
      (previous) =>
        (previous + 1) %
        modalImages.length
    );
  };

  // ==========================================
  // PREVIOUS MODAL IMAGE
  // ==========================================

  const prevModalImage = () => {
    if (
      modalImages.length === 0
    ) {
      return;
    }

    setModalImageIndex(
      (previous) =>
        (
          previous -
          1 +
          modalImages.length
        ) % modalImages.length
    );
  };

  // ==========================================
  // ADD PROPERTY TO CART
  // ==========================================

  const handleAddToCart = async (
    property,
    customQuantity = 1
  ) => {
    if (!property) {
      return;
    }

    const availableUnits =
      Number(property.availableUnits);

    if (
      Number.isFinite(availableUnits) &&
      availableUnits <= 0
    ) {
      alert(
        "This property is sold out."
      );

      return;
    }

    if (
      Number.isFinite(availableUnits) &&
      customQuantity > availableUnits
    ) {
      alert(
        `Only ${availableUnits} unit${
          availableUnits === 1
            ? ""
            : "s"
        } available.`
      );

      return;
    }

    try {
      const result =
        await addToCart({
          ...property,

          propertyId:
            property._id ||
            property.id,

          productType: "property",

          propertyType: "property",

          wishlistType: "property",

          size:
            selectedSize ||
            property.size ||
            "",

          quantity: customQuantity,
        });

      if (
        result?.success === false
      ) {
        alert(
          result.message ||
            "Failed to add property to cart."
        );

        return;
      }

      alert(
        "Property added to cart."
      );
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );

      alert(
        error.message ||
          "Failed to add property to cart."
      );
    }
  };

  // ==========================================
  // OPEN PROPERTY DETAILS
  // ==========================================

  const openPropertyDetails = (
    property
  ) => {
    const propertyId =
      property?._id ||
      property?.id;

    if (!propertyId) {
      return;
    }

    navigate(
      `/property-details?id=${propertyId}&type=property`
    );
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <section className="property-section">
        <div className="property-section-container">

          <div className="property-section-title">
            <h2>
              Find your home place
            </h2>

            <div className="property-title-line"></div>
          </div>

          <p>
            Loading properties...
          </p>

        </div>
      </section>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <section className="property-section">
        <div className="property-section-container">

          <div className="property-section-title">
            <h2>
              Find your home place
            </h2>

            <div className="property-title-line"></div>
          </div>

          <p>
            {error}
          </p>

        </div>
      </section>
    );
  }

  // ==========================================
  // NO PROPERTIES
  // ==========================================

  if (
    properties.length === 0
  ) {
    return (
      <section className="property-section">
        <div className="property-section-container">

          <div className="property-section-title">
            <h2>
              Find your home place
            </h2>

            <div className="property-title-line"></div>
          </div>

          <p>
            No properties available.
          </p>

        </div>
      </section>
    );
  }

  // ==========================================
  // MAIN
  // ==========================================

  return (
    <>
      <section className="property-section">

        <div className="property-section-container">

          {/* ====================================
              TITLE
          ==================================== */}

          <div className="property-section-title">

            <h2>
              Find your home place
            </h2>

            <div className="property-title-line"></div>

          </div>

          {/* ====================================
              MAIN CONTENT
          ==================================== */}

          <div className="property-section-content">

            {/* ==================================
                LEFT PRODUCTS
            ================================== */}

            <div className="property-products-wrapper">

              <div className="property-products">

                {visibleProperties.map(
                  (
                    property,
                    index
                  ) => {

                    const propertyId =
                      property?._id ||
                      property?.id;

                    const cardImage =
                      getImageUrl(
                        property?.mainImage
                      );

                    const wishlistData = {
                      ...property,
                      wishlistType:
                        "property",
                      propertyType:
                        "property",
                    };

                    const compared =
                      isCompared
                        ? isCompared({
                            ...property,
                            productType:
                              "property",
                            propertyType:
                              "property",
                          })
                        : false;

                    const sizes =
                      Array.isArray(
                        property?.sizes
                      ) &&
                      property.sizes.length >
                        0
                        ? property.sizes
                        : property?.size
                        ? [property.size]
                        : [];

                    const availableUnits =
                      Number(
                        property?.availableUnits
                      );

                    const hasAvailability =
                      Number.isFinite(
                        availableUnits
                      );

                    const soldOut =
                      hasAvailability &&
                      availableUnits <= 0;

                    return (
                      <article
                        className="property-item"
                        key={
                          `${propertyId}-${index}`
                        }
                      >

                        {/* IMAGE */}

                        <div className="property-item-image">

                          <img
                            onClick={() =>
                              openPropertyDetails(
                                property
                              )
                            }
                            src={cardImage}
                            alt={
                              property.title ||
                              "Property"
                            }
                          />

                          {/* NEW */}

                          <span className="property-new">
                            New
                          </span>

                          {/* ACTIONS */}

                          <div className="property-actions">

                            {/* WISHLIST */}

                            <button
                              type="button"
                              className={
                                isWishlisted(
                                  wishlistData
                                )
                                  ? "property-action wishlist-selected"
                                  : "property-action"
                              }
                              onClick={() =>
                                toggleWishlist(
                                  wishlistData
                                )
                              }
                              aria-label="Wishlist"
                            >
                              {isWishlisted(
                                wishlistData
                              )
                                ? "♥"
                                : "♡"}
                            </button>

                            {/* COMPARE */}

                            <button
                              type="button"
                              className={
                                compared
                                  ? "property-action wishlist-selected"
                                  : "property-action"
                              }
                              onClick={() =>
                                handleCompare(
                                  property
                                )
                              }
                              aria-label="Compare"
                            >
                              ⇄
                            </button>

                            {/* QUICK VIEW */}

                            <button
                              type="button"
                              className="property-action"
                              onClick={() =>
                                handleQuickView(
                                  property
                                )
                              }
                              aria-label="Quick View"
                            >
                              ◉
                            </button>

                          </div>

                        </div>

                        {/* ==================================
                            CARD BODY
                        ================================== */}

                        <div className="property-item-body">

                          <div className="property-category">

                            <span>
                              ◎
                            </span>

                            <span>
                              {property.category ||
                                "Home"}
                            </span>

                          </div>

                          <h3>
                            {property.title}
                          </h3>

                          {/* SIZE */}

                          {sizes.length > 0 && (
                            <select
                              defaultValue={
                                sizes[0]
                              }
                              className="property-size"
                            >
                              {sizes.map(
                                (size) => (
                                  <option
                                    key={size}
                                    value={size}
                                  >
                                    {size}
                                  </option>
                                )
                              )}
                            </select>
                          )}

                          <div className="property-price">

                            <strong>
                              {property.price}
                            </strong>

                            {property.oldPrice && (
                              <del>
                                {
                                  property.oldPrice
                                }
                              </del>
                            )}

                          </div>

                          {/* AVAILABILITY */}

                          {hasAvailability && (
                            <div
                              style={{
                                marginBottom:
                                  "8px",
                                fontSize:
                                  "13px",
                              }}
                            >
                              {soldOut ? (
                                <strong>
                                  Sold Out
                                </strong>
                              ) : (
                                <>
                                  <strong>
                                    {
                                      availableUnits
                                    }
                                  </strong>{" "}
                                  unit
                                  {availableUnits ===
                                  1
                                    ? ""
                                    : "s"}{" "}
                                  available
                                </>
                              )}
                            </div>
                          )}

                          <button
                            type="button"
                            className="property-cart-button"
                            disabled={
                              soldOut
                            }
                            onClick={() =>
                              handleAddToCart(
                                property,
                                1
                              )
                            }
                          >
                            {soldOut
                              ? "Sold Out"
                              : "Add to Cart →"}
                          </button>

                        </div>

                      </article>
                    );
                  }
                )}

              </div>

              {/* ==================================
                  SLIDER CONTROLS
              ================================== */}

              {properties.length > 1 && (
                <div className="property-slider-controls">

                  <button
                    type="button"
                    className="property-slider-arrow"
                    onClick={
                      prevSlide
                    }
                  >
                    ←
                  </button>

                  <div className="property-slider-line"></div>

                  <button
                    type="button"
                    className="property-slider-arrow"
                    onClick={
                      nextSlide
                    }
                  >
                    →
                  </button>

                </div>
              )}

            </div>

            {/* ==================================
                MAP
            ================================== */}

            <div className="property-map">

              <img
                src="/images/home-map.jpg"
                alt="Property location map"
              />

            </div>

          </div>

        </div>

      </section>

      {/* ======================================
          QUICK VIEW MODAL
      ====================================== */}

      {quickView && (
        <div
          className="quick-view-overlay"
          onClick={() =>
            setQuickView(null)
          }
        >

          <div
            className="quick-view-box"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* CLOSE */}

            <button
              type="button"
              className="quick-view-close"
              onClick={() =>
                setQuickView(null)
              }
              aria-label="Close"
            >
              ×
            </button>

            {/* =================================
                IMAGE GALLERY
            ================================= */}

            <div className="quick-view-gallery">

              <div className="quick-view-main-image">

                {modalImages.length >
                0 ? (
                  <img
                    src={
                      modalImages[
                        modalImageIndex
                      ]
                    }
                    alt={
                      quickView.title ||
                      "Property"
                    }
                  />
                ) : (
                  <div className="quick-view-no-images">
                    No images available
                  </div>
                )}

                {modalImages.length >
                  1 && (
                  <>
                    <button
                      type="button"
                      className="quick-view-image-arrow quick-view-image-arrow-left"
                      onClick={
                        prevModalImage
                      }
                    >
                      ‹
                    </button>

                    <button
                      type="button"
                      className="quick-view-image-arrow quick-view-image-arrow-right"
                      onClick={
                        nextModalImage
                      }
                    >
                      ›
                    </button>
                  </>
                )}

              </div>

              {/* THUMBNAILS */}

              {modalImages.length >
                0 && (
                <div className="quick-view-thumbnails">

                  {modalImages.map(
                    (
                      image,
                      index
                    ) => (
                      <button
                        type="button"
                        key={`${image}-${index}`}
                        className={`quick-view-thumbnail ${
                          modalImageIndex ===
                          index
                            ? "quick-view-thumbnail-active"
                            : ""
                        }`}
                        onClick={() =>
                          setModalImageIndex(
                            index
                          )
                        }
                      >

                        <img
                          src={image}
                          alt={`${quickView.title || "Property"} ${
                            index + 1
                          }`}
                        />

                      </button>
                    )
                  )}

                </div>
              )}

            </div>

            {/* =================================
                DETAILS
            ================================= */}

            <div className="quick-view-details">

              <div className="quick-view-category">

                <span>
                  ◎
                </span>

                {quickView.category ||
                  "Home"}

              </div>

              <h2>
                {quickView.title}
              </h2>

              <p className="quick-view-description">
                {quickView.description ||
                  "Beautiful modern property designed for comfortable and spacious living."}
              </p>

              {/* SIZE */}

              <p className="quick-view-size-text">

                Size:{" "}

                <strong>
                  {selectedSize ||
                    "N/A"}
                </strong>

              </p>

              {/* SIZE OPTIONS */}

              <div className="quick-view-sizes">

                {(
                  Array.isArray(
                    quickView.sizes
                  ) &&
                  quickView.sizes.length >
                    0
                    ? quickView.sizes
                    : quickView.size
                    ? [quickView.size]
                    : []
                ).map(
                  (size) => (
                    <button
                      type="button"
                      key={size}
                      className={
                        selectedSize ===
                        size
                          ? "selected-size"
                          : ""
                      }
                      onClick={() =>
                        setSelectedSize(
                          size
                        )
                      }
                    >
                      {size}
                    </button>
                  )
                )}

              </div>

              {/* PRICE */}

              <div className="quick-view-price">

                <strong>
                  {quickView.price}
                </strong>

                {quickView.oldPrice && (
                  <del>
                    {
                      quickView.oldPrice
                    }
                  </del>
                )}

              </div>

              {/* AVAILABILITY */}

              {Number.isFinite(
                Number(
                  quickView.availableUnits
                )
              ) && (
                <div
                  style={{
                    marginBottom:
                      "12px",
                  }}
                >
                  {Number(
                    quickView.availableUnits
                  ) <= 0 ? (
                    <strong>
                      Sold Out
                    </strong>
                  ) : (
                    <>
                      <strong>
                        {
                          quickView.availableUnits
                        }
                      </strong>{" "}
                      units available
                    </>
                  )}
                </div>
              )}

              {/* CART */}

              <div className="quick-view-cart-row">

                <button
                  type="button"
                  className="quick-view-cart"
                  disabled={
                    Number.isFinite(
                      Number(
                        quickView.availableUnits
                      )
                    ) &&
                    Number(
                      quickView.availableUnits
                    ) <= 0
                  }
                  onClick={() =>
                    handleAddToCart(
                      quickView,
                      quantity
                    )
                  }
                >
                  {Number.isFinite(
                    Number(
                      quickView.availableUnits
                    )
                  ) &&
                  Number(
                    quickView.availableUnits
                  ) <= 0
                    ? "Sold Out"
                    : "Add to Cart 🛒"}
                </button>

                {/* QUANTITY */}

                <div className="quantity-control">

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(
                        (previous) =>
                          previous > 1
                            ? previous -
                              1
                            : 1
                      )
                    }
                    disabled={
                      quantity <= 1
                    }
                  >
                    −
                  </button>

                  <span>
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(
                        (previous) => {
                          const available =
                            Number(
                              quickView.availableUnits
                            );

                          if (
                            Number.isFinite(
                              available
                            ) &&
                            available > 0
                          ) {
                            return Math.min(
                              previous +
                                1,
                              available
                            );
                          }

                          return (
                            previous + 1
                          );
                        }
                      )
                    }
                    disabled={
                      Number.isFinite(
                        Number(
                          quickView.availableUnits
                        )
                      ) &&
                      quantity >=
                        Number(
                          quickView.availableUnits
                        )
                    }
                  >
                    +
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>
      )}
    </>
  );
};

export default PropertySection;