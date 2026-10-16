




import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import "./PropertyDetails.css";

import {
  useWishlist,
} from "../../context/WishlistContext";

import {
  useCart,
} from "../../context/CartContext";

import {
  useAuth,
} from "../../context/AuthContext";

const SERVER_URL =
  "http://localhost:5000";

const PROPERTY_API =
  "http://localhost:5000/api/properties";

const LUXURY_API =
  "http://localhost:5000/api/luxurious-properties";

const SPACIOUS_API =
  "http://localhost:5000/api/spacious-living";

const PENTHOUSE_API =
  "http://localhost:5000/api/penthouse-properties";

const REVIEW_API =
  "http://localhost:5000/api/property-reviews";

const getImageUrl = (image) => {
  if (!image) return "";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  if (
    image.startsWith("/uploads/")
  ) {
    return `${SERVER_URL}${image}`;
  }

  return image;
};

// =====================================================
// PROPERTY ID
// =====================================================
// Luxury properties use numeric `id`.
// Regular properties use MongoDB `_id`.
// =====================================================

const getPropertyId = (
  property,
  type
) => {
  if (!property) return "";

  if (
    String(type).toLowerCase() ===
    "luxury"
  ) {
    return String(
      property?.id || ""
    );
  }

  return String(
    property?._id ||
      property?.id ||
      ""
  );
};

const getItemsFromResponse = (
  result
) => {
  if (Array.isArray(result)) {
    return result;
  }

  if (Array.isArray(result?.data)) {
    return result.data;
  }

  if (
    Array.isArray(
      result?.properties
    )
  ) {
    return result.properties;
  }

  if (
    Array.isArray(
      result?.data?.properties
    )
  ) {
    return result.data.properties;
  }

  return [];
};

const PropertyDetails = () => {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const {
    toggleWishlist,
    isWishlisted,
  } = useWishlist();

  const {
    addToCart: addCartItem,
  } = useCart();

  const {
    user,
    isAuthenticated,
  } = useAuth();

  const id =
    searchParams.get("id");

  const requestedType =
    searchParams.get("type") ||
    "property";

  const [property, setProperty] =
    useState(null);

  const [
    detectedPropertyType,
    setDetectedPropertyType,
  ] = useState(requestedType);

  const [
    allProperties,
    setAllProperties,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [
    selectedImage,
    setSelectedImage,
  ] = useState(0);

  const [
    selectedSize,
    setSelectedSize,
  ] = useState("");

  const [
    quantity,
    setQuantity,
  ] = useState(1);

  const [
    reviewImagePreview,
    setReviewImagePreview,
  ] = useState(null);

  const [
    reviewImageIndex,
    setReviewImageIndex,
  ] = useState(0);

  const wishlistItem = property
    ? {
        ...property,
        wishlistType:
          detectedPropertyType,
      }
    : null;

  const wishlisted =
    wishlistItem
      ? isWishlisted(
          wishlistItem
        )
      : false;

  const [
    reviews,
    setReviews,
  ] = useState([]);

  const [
    reviewSummary,
    setReviewSummary,
  ] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    },
  });

  const [
    showReviewForm,
    setShowReviewForm,
  ] = useState(false);

  const [
    submittingReview,
    setSubmittingReview,
  ] = useState(false);

  const [
    reviewForm,
    setReviewForm,
  ] = useState({
    rating: 0,
    reviewTitle: "",
    reviewContent: "",
    displayName: "",
    email: "",
    media: [],
  });

  // =====================================================
  // AVAILABILITY
  // =====================================================

  const hasAvailability =
    useMemo(() => {
      if (!property) {
        return false;
      }

      return (
        Object.prototype.hasOwnProperty.call(
          property,
          "availableUnits"
        ) ||
        Object.prototype.hasOwnProperty.call(
          property,
          "totalUnits"
        ) ||
        Object.prototype.hasOwnProperty.call(
          property,
          "bookedUnits"
        )
      );
    }, [property]);

  const availableUnits =
    useMemo(() => {
      if (!hasAvailability) {
        return Infinity;
      }

      const value = Number(
        property?.availableUnits ??
          0
      );

      if (!Number.isFinite(value)) {
        return 0;
      }

      return Math.max(0, value);
    }, [
      property,
      hasAvailability,
    ]);

  const isSoldOut =
    hasAvailability &&
    availableUnits <= 0;

  // =====================================================
  // FIND PROPERTY BY ID
  // =====================================================

  const findById = (
    items,
    type = requestedType
  ) => {
    if (!Array.isArray(items)) {
      return null;
    }

    const normalizedType =
      String(type).toLowerCase();

    return (
      items.find((item) => {
        /*
         * IMPORTANT:
         * Luxury has its own numeric `id`.
         *
         * We support both:
         * - property.id
         * - property._id
         *
         * This also allows an old URL containing
         * MongoDB _id to continue working.
         */
        if (
          normalizedType ===
          "luxury"
        ) {
          return (
            String(
              item?.id || ""
            ) === String(id) ||
            String(
              item?._id || ""
            ) === String(id)
          );
        }

        return (
          String(
            item?._id ||
              item?.id ||
              ""
          ) === String(id)
        );
      }) || null
    );
  };

  // =====================================================
  // LOAD REGULAR PROPERTY
  // =====================================================

  const loadRegularProperty =
    async () => {
      const response =
        await fetch(
          PROPERTY_API
        );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch regular properties"
        );
      }

      const result =
        await response.json();

      const items =
        getItemsFromResponse(
          result
        );

      return findById(
        items,
        "property"
      );
    };

  // =====================================================
  // LOAD LUXURY PROPERTY
  // =====================================================

  const loadLuxuryProperty =
    async () => {
      const response =
        await fetch(
          LUXURY_API
        );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch luxury properties"
        );
      }

      const result =
        await response.json();

      const items =
        getItemsFromResponse(
          result
        );

      return findById(
        items,
        "luxury"
      );
    };

  // =====================================================
  // LOAD SPACIOUS PROPERTY
  // =====================================================

  const loadSpaciousProperty =
    async () => {
      const response =
        await fetch(
          SPACIOUS_API
        );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch Spacious Living"
        );
      }

      const result =
        await response.json();

      const spaciousData =
        result?.data ||
        result;

      const items =
        Array.isArray(
          spaciousData
            ?.sliderProperties
        )
          ? spaciousData
              .sliderProperties
          : [];

      return findById(
        items,
        "spacious"
      );
    };

  // =====================================================
  // LOAD PENTHOUSE PROPERTY
  // =====================================================

  const loadPenthouseProperty =
    async () => {
      const response =
        await fetch(
          PENTHOUSE_API
        );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch penthouse properties"
        );
      }

      const result =
        await response.json();

      const items =
        getItemsFromResponse(
          result
        );

      return findById(
        items,
        "penthouse"
      );
    };

  // =====================================================
  // FETCH PROPERTY
  // =====================================================

  const fetchProperty =
    async () => {
      try {
        setLoading(true);

        let foundProperty =
          null;

        let foundType =
          requestedType;

        // First try the type from URL.

        if (
          requestedType ===
          "property"
        ) {
          try {
            foundProperty =
              await loadRegularProperty();
          } catch (error) {
            console.error(
              "Regular property API error:",
              error
            );
          }
        }

        if (
          requestedType ===
          "luxury"
        ) {
          try {
            foundProperty =
              await loadLuxuryProperty();
          } catch (error) {
            console.error(
              "Luxury property API error:",
              error
            );
          }
        }

        if (
          requestedType ===
          "spacious"
        ) {
          try {
            foundProperty =
              await loadSpaciousProperty();
          } catch (error) {
            console.error(
              "Spacious property API error:",
              error
            );
          }
        }

        if (
          requestedType ===
          "penthouse"
        ) {
          try {
            foundProperty =
              await loadPenthouseProperty();
          } catch (error) {
            console.error(
              "Penthouse property API error:",
              error
            );
          }
        }

        // Fallback

        if (!foundProperty) {
          try {
            foundProperty =
              await loadRegularProperty();

            if (foundProperty) {
              foundType =
                "property";
            }
          } catch (error) {
            console.error(
              "Fallback regular property error:",
              error
            );
          }
        }

        if (!foundProperty) {
          try {
            foundProperty =
              await loadLuxuryProperty();

            if (foundProperty) {
              foundType =
                "luxury";
            }
          } catch (error) {
            console.error(
              "Fallback luxury property error:",
              error
            );
          }
        }

        if (!foundProperty) {
          try {
            foundProperty =
              await loadSpaciousProperty();

            if (foundProperty) {
              foundType =
                "spacious";
            }
          } catch (error) {
            console.error(
              "Fallback Spacious property error:",
              error
            );
          }
        }

        if (!foundProperty) {
          try {
            foundProperty =
              await loadPenthouseProperty();

            if (foundProperty) {
              foundType =
                "penthouse";
            }
          } catch (error) {
            console.error(
              "Fallback Penthouse property error:",
              error
            );
          }
        }

        if (!foundProperty) {
          console.error(
            "PROPERTY NOT FOUND",
            {
              id,
              requestedType,
            }
          );

          throw new Error(
            "Property not found"
          );
        }

        console.log(
          "PROPERTY FOUND:",
          foundProperty
        );

        console.log(
          "PROPERTY TYPE:",
          foundType
        );

        setProperty(
          foundProperty
        );

        setDetectedPropertyType(
          foundType
        );

        setSelectedImage(0);

        setQuantity(1);

        const propertySizes =
          Array.isArray(
            foundProperty.sizes
          )
            ? foundProperty.sizes
            : foundProperty.size
            ? [foundProperty.size]
            : [];

        setSelectedSize(
          propertySizes[0] || ""
        );
      } catch (error) {
        console.error(
          "Property details error:",
          error
        );

        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setProperty(null);
      return;
    }

    fetchProperty();
  }, [
    id,
    requestedType,
  ]);

  // =====================================================
  // KEEP QUANTITY VALID
  // =====================================================

  useEffect(() => {
    if (!property) {
      return;
    }

    const currentAvailable =
      Number(
        property?.availableUnits
      );

    if (
      Number.isFinite(
        currentAvailable
      ) &&
      currentAvailable >= 0
    ) {
      setQuantity(
        (currentQuantity) => {
          if (
            currentAvailable <=
            0
          ) {
            return 1;
          }

          return Math.min(
            currentQuantity,
            currentAvailable
          );
        }
      );
    }
  }, [property]);

  // =====================================================
  // QUANTITY
  // =====================================================

  const decreaseQuantity =
    () => {
      setQuantity(
        (current) =>
          Math.max(
            current - 1,
            1
          )
      );
    };

  const increaseQuantity =
    () => {
      setQuantity(
        (current) => {
          if (!hasAvailability) {
            return current + 1;
          }

          if (
            availableUnits <= 0
          ) {
            return current;
          }

          return Math.min(
            current + 1,
            availableUnits
          );
        }
      );
    };

  // =====================================================
  // FETCH REVIEWS
  // =====================================================

  const fetchReviews =
    async (
      type = detectedPropertyType,
      propertyId =
        getPropertyId(
          property,
          type
        )
    ) => {
      if (
        !propertyId ||
        !type
      ) {
        return;
      }

      try {
        const response =
          await fetch(
            `${REVIEW_API}/${type}/${propertyId}`
          );

        if (!response.ok) {
          setReviews([]);

          setReviewSummary({
            totalReviews: 0,
            averageRating: 0,
            ratingDistribution: {
              5: 0,
              4: 0,
              3: 0,
              2: 0,
              1: 0,
            },
          });

          return;
        }

        const result =
          await response.json();

        if (!result.success) {
          setReviews([]);
          return;
        }

        const rawReviews =
          Array.isArray(
            result.data
          )
            ? result.data
            : Array.isArray(
                result.reviews
              )
            ? result.reviews
            : [];

        const loadedReviews =
          rawReviews.map(
            (review) => ({
              ...review,

              media:
                Array.isArray(
                  review.media
                )
                  ? review.media.filter(
                      Boolean
                    )
                  : review.media
                  ? [review.media]
                  : [],
            })
          );

        setReviews(
          loadedReviews
        );

        if (result.summary) {
          setReviewSummary({
            totalReviews:
              Number(
                result.summary
                  .totalReviews ||
                  0
              ),

            averageRating:
              Number(
                result.summary
                  .averageRating ||
                  0
              ),

            ratingDistribution:
              result.summary
                .ratingDistribution ||
              result.summary
                .ratingCounts || {
                5: 0,
                4: 0,
                3: 0,
                2: 0,
                1: 0,
              },
          });
        } else {
          const ratingDistribution =
            {
              5: 0,
              4: 0,
              3: 0,
              2: 0,
              1: 0,
            };

          let totalRating = 0;

          loadedReviews.forEach(
            (review) => {
              const rating =
                Number(
                  review.rating
                );

              if (
                rating >= 1 &&
                rating <= 5
              ) {
                ratingDistribution[
                  rating
                ] += 1;

                totalRating +=
                  rating;
              }
            }
          );

          setReviewSummary({
            totalReviews:
              loadedReviews.length,

            averageRating:
              loadedReviews.length
                ? totalRating /
                  loadedReviews.length
                : 0,

            ratingDistribution,
          });
        }
      } catch (error) {
        console.error(
          "Reviews error:",
          error
        );

        setReviews([]);

        setReviewSummary({
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0,
          },
        });
      }
    };

  useEffect(() => {
    if (property) {
      fetchReviews(
        detectedPropertyType,
        getPropertyId(
          property,
          detectedPropertyType
        )
      );
    }
  }, [
    property,
    detectedPropertyType,
    id,
  ]);

  // =====================================================
  // FETCH RECENT PROPERTIES
  // =====================================================

  const fetchAllProperties =
    async () => {
      try {
        let items = [];

        if (
          detectedPropertyType ===
          "spacious"
        ) {
          const response =
            await fetch(
              SPACIOUS_API
            );

          if (!response.ok) {
            return;
          }

          const result =
            await response.json();

          const data =
            result?.data ||
            result;

          items =
            Array.isArray(
              data?.sliderProperties
            )
              ? data.sliderProperties
              : [];
        } else if (
          detectedPropertyType ===
          "penthouse"
        ) {
          const response =
            await fetch(
              PENTHOUSE_API
            );

          if (!response.ok) {
            return;
          }

          const result =
            await response.json();

          items =
            getItemsFromResponse(
              result
            );
        } else if (
          detectedPropertyType ===
          "luxury"
        ) {
          const response =
            await fetch(
              LUXURY_API
            );

          if (!response.ok) {
            return;
          }

          const result =
            await response.json();

          items =
            getItemsFromResponse(
              result
            );
        } else {
          const response =
            await fetch(
              PROPERTY_API
            );

          if (!response.ok) {
            return;
          }

          const result =
            await response.json();

          items =
            getItemsFromResponse(
              result
            );
        }

        setAllProperties(
          items
        );
      } catch (error) {
        console.error(
          "Recent properties error:",
          error
        );

        setAllProperties([]);
      }
    };

  useEffect(() => {
    if (property) {
      fetchAllProperties();
    }
  }, [
    property,
    detectedPropertyType,
  ]);

  // =====================================================
  // IMAGES
  // =====================================================

  const images = useMemo(
    () => {
      if (!property) {
        return [];
      }

      const result = [];

      if (property.mainImage) {
        result.push(
          property.mainImage
        );
      }

      if (
        Array.isArray(
          property.sliderImages
        )
      ) {
        result.push(
          ...property.sliderImages
            .filter(Boolean)
            .slice(0, 4)
        );
      }

      if (
        Array.isArray(
          property.subImages
        )
      ) {
        result.push(
          ...property.subImages
            .filter(Boolean)
            .slice(0, 4)
        );
      }

      if (
        property.image &&
        result.length === 0
      ) {
        result.push(
          property.image
        );
      }

      return [
        ...new Set(result),
      ];
    },
    [property]
  );

  // =====================================================
  // SIZES
  // =====================================================

  const sizes = useMemo(
    () => {
      if (!property) {
        return [];
      }

      if (
        Array.isArray(
          property.sizes
        ) &&
        property.sizes.length
      ) {
        return property.sizes;
      }

      if (property.size) {
        return [
          property.size,
        ];
      }

      return [];
    },
    [property]
  );

  // =====================================================
  // RECENTLY VIEWED
  // =====================================================

  const recentlyViewed =
    useMemo(
      () => {
        if (!property) {
          return [];
        }

        return allProperties
          .filter(
            (item) =>
              getPropertyId(
                item,
                detectedPropertyType
              ) !==
              getPropertyId(
                property,
                detectedPropertyType
              )
          )
          .slice(0, 4);
      },
      [
        allProperties,
        property,
        detectedPropertyType,
      ]
    );

  // =====================================================
  // REVIEW FORM
  // =====================================================

  const handleReviewChange =
    (event) => {
      const {
        name,
        value,
        files,
      } = event.target;

      if (
        name === "media"
      ) {
        const selectedFiles =
          Array.from(
            files || []
          ).slice(0, 3);

        if (
          files &&
          files.length > 3
        ) {
          alert(
            "You can upload maximum 3 images."
          );
        }

        setReviewForm(
          (previous) => ({
            ...previous,
            media:
              selectedFiles,
          })
        );

        return;
      }

      setReviewForm(
        (previous) => ({
          ...previous,
          [name]: value,
        })
      );
    };

  const selectRating =
    (rating) => {
      setReviewForm(
        (previous) => ({
          ...previous,
          rating,
        })
      );
    };

  // =====================================================
  // SUBMIT REVIEW
  // =====================================================

  const submitReview =
    async (event) => {
      event.preventDefault();

      if (
        !isAuthenticated ||
        !user
      ) {
        alert(
          "Please login to write a review."
        );

        return;
      }

      // if (
      //   detectedPropertyType !==
      //     "property" &&
      //   detectedPropertyType !==
      //     "luxury"
      // ) {
      //   alert(
      //     "Review system for this property is not enabled yet."
      //   );

      //   return;
      // }

      if (
  !["property", "luxury", "spacious","penthouse"].includes(
    detectedPropertyType
  )
) {
  alert(
    "Review system for this property is not enabled yet."
  );

  return;
}

      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {
        alert(
          "Please login again."
        );

        return;
      }

      if (!reviewForm.rating) {
        alert(
          "Please select a rating."
        );

        return;
      }

      if (
        !reviewForm.reviewTitle.trim()
      ) {
        alert(
          "Please enter review title."
        );

        return;
      }

      if (
        !reviewForm.reviewContent.trim()
      ) {
        alert(
          "Please enter review content."
        );

        return;
      }

      if (
        !reviewForm.displayName.trim()
      ) {
        alert(
          "Please enter display name."
        );

        return;
      }

      if (
        !reviewForm.email.trim()
      ) {
        alert(
          "Please enter email."
        );

        return;
      }

      try {
        setSubmittingReview(
          true
        );

        const formData =
          new FormData();

        // =================================================
        // IMPORTANT FIX:
        // Luxury -> property.id
        // Property -> property._id
        // =================================================

        formData.append(
          "propertyId",
          getPropertyId(
            property,
            detectedPropertyType
          )
        );

        formData.append(
          "propertyType",
          detectedPropertyType
        );

        formData.append(
          "propertyTitle",
          property?.title || ""
        );

        formData.append(
          "rating",
          String(
            reviewForm.rating
          )
        );

        formData.append(
          "reviewTitle",
          reviewForm.reviewTitle
        );

        formData.append(
          "reviewContent",
          reviewForm.reviewContent
        );

        formData.append(
          "displayName",
          reviewForm.displayName
        );

        formData.append(
          "email",
          reviewForm.email
        );

        if (
          Array.isArray(
            reviewForm.media
          )
        ) {
          reviewForm.media.forEach(
            (file) => {
              formData.append(
                "media",
                file
              );
            }
          );
        }

        const response =
          await fetch(
            REVIEW_API,
            {
              method: "POST",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },

              body: formData,
            }
          );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Review submission failed"
          );
        }

        alert(
          "Review submitted successfully!"
        );

        setReviewForm({
          rating: 0,
          reviewTitle: "",
          reviewContent: "",
          displayName: "",
          email: "",
          media: [],
        });

        setShowReviewForm(
          false
        );

        await fetchReviews(
          detectedPropertyType,
          getPropertyId(
            property,
            detectedPropertyType
          )
        );
      } catch (error) {
        console.error(
          "Submit review error:",
          error
        );

        alert(
          error.message ||
            "Failed to submit review"
        );
      } finally {
        setSubmittingReview(
          false
        );
      }
    };

  // =====================================================
  // WISHLIST
  // =====================================================

  const handleWishlist =
    async () => {
      if (!property) {
        return;
      }

      try {
        await toggleWishlist({
          ...property,

          wishlistType:
            detectedPropertyType,

          propertyType:
            detectedPropertyType,
        });
      } catch (error) {
        console.error(
          "Wishlist error:",
          error
        );
      }
    };

  // =====================================================
  // ADD TO CART
  // =====================================================

  const handleAddToCart =
    async () => {
      if (!property) {
        return;
      }

      if (
        hasAvailability &&
        availableUnits <= 0
      ) {
        alert(
          "This property is sold out."
        );

        return;
      }

      if (
        hasAvailability &&
        quantity >
          availableUnits
      ) {
        alert(
          `Only ${availableUnits} unit(s) available.`
        );

        setQuantity(
          availableUnits
        );

        return;
      }

      try {
        const cartProperty = {
          ...property,

          quantity,

          selectedSize,

          productType:
            detectedPropertyType,

          propertyType:
            detectedPropertyType,
        };

        const result =
          await addCartItem(
            cartProperty
          );

        if (
          result?.success
        ) {
          alert(
            "Added to cart"
          );
        }
      } catch (error) {
        console.error(
          "Add to cart error:",
          error
        );

        alert(
          error.message ||
            "Failed to add to cart."
        );
      }
    };

  // =====================================================
  // REVIEW FORM IMAGE PREVIEW
  // =====================================================

  const openReviewImagePreview =
    (media, index = 0) => {
      if (!media) {
        return;
      }

      const previewList =
        Array.isArray(media)
          ? media
          : [media];

      if (
        !previewList.length
      ) {
        return;
      }

      setReviewImagePreview(
        previewList
      );

      setReviewImageIndex(
        index
      );
    };

  const closeReviewImagePreview =
    () => {
      setReviewImagePreview(
        null
      );

      setReviewImageIndex(
        0
      );
    };

  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="property-details-loading">Loading property...</div>
    );
  }

  // =====================================================
  // NOT FOUND
  // =====================================================

  if (!property) {
    return (
      <div className="property-details-not-found">
        <h2>Property Not Found</h2>

        <p>
          ID: {id || "Missing"} | Type: {requestedType}
        </p>

        <button onClick={() => navigate(-1)}>Back</button>
      </div>
    );
  }

  // =====================================================
  // MAIN
  // =====================================================

  return (
    <main className="property-details-page">
      <div className="property-details-container">
        {/* TOP */}

        <div className="property-details-topbar">
          <button className="details-back-btn" onClick={() => navigate(-1)}>
            ←<span>Back to category</span>
          </button>

          <button
            className={
              wishlisted ? "details-wishlist active" : "details-wishlist"
            }
            onClick={handleWishlist}
          >
            {wishlisted ? "♥" : "♡"}

            <span>Add to wishlist</span>
          </button>
        </div>

        {/* MAIN PRODUCT */}

        <section className="property-details-main">
          {/* LEFT */}

          <div className="property-details-info">
            <div className="details-review-link">
              <div className="details-stars">
                {Array.from({ length: 5 }, (_, index) =>
                  index < Math.round(reviewSummary.averageRating)
                    ? "★"
                    : "☆"
                ).join("")}
              </div>

              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    alert("Please login to write a review.");
                    return;
                  }

                  if ((detectedPropertyType !== "property" && detectedPropertyType !== "luxury")) {
                    alert(
                      "Review system for this property is not enabled yet."
                    );
                    return;
                  }

                  setShowReviewForm(true);
                }}
              >
                ✎ Write a Review
              </button>
            </div>

            <h1>{property.title}</h1>

            <p className="details-description">
              {property.description || "No description available."}
            </p>

            {/* SIZE */}

            <div className="details-size">
              <strong>Size:</strong>

              <span>{selectedSize || "N/A"}</span>

              {sizes.length > 0 && (
                <div className="details-size-buttons">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      className={selectedSize === size ? "active" : ""}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* AVAILABILITY */}

            {hasAvailability && (
              <div
                className="details-availability"
                style={{
                  marginTop: "12px",
                  marginBottom: "8px",
                }}
              >
                {isSoldOut ? (
                  <strong>Sold Out</strong>
                ) : (
                  <span>
                    <strong>{availableUnits}</strong>{" "}
                    unit{availableUnits === 1 ? "" : "s"} available
                  </span>
                )}
              </div>
            )}

            {/* PRICE */}

            <div className="details-price-row">
              <div className="details-quantity">
                <button onClick={decreaseQuantity} disabled={quantity <= 1}>
                  −
                </button>

                <span>{quantity}</span>

                <button
                  onClick={increaseQuantity}
                  disabled={
                    hasAvailability &&
                    (availableUnits <= 0 || quantity >= availableUnits)
                  }
                >
                  +
                </button>
              </div>

              <div>
                <strong>{property.price}</strong>

                {property.oldPrice && <del>{property.oldPrice}</del>}
              </div>
            </div>

            {/* CART */}

            <div className="details-cart-actions">
              <button
                className="details-add-cart"
                onClick={handleAddToCart}
                disabled={hasAvailability && availableUnits <= 0}
              >
                {hasAvailability && availableUnits <= 0
                  ? "Sold Out"
                  : "Add to Cart →"}
              </button>

              <button className="details-buy-now">Buy it now</button>
            </div>
          </div>

          {/* RIGHT */}

          <div className="details-gallery">
            <div className="details-main-image">
              {images.length > 0 ? (
                <img
                  src={getImageUrl(images[selectedImage])}
                  alt={property.title || "Property"}
                />
              ) : (
                <div>No Image</div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    className="details-arrow left"
                    onClick={() =>
                      setSelectedImage((previous) =>
                        previous === 0 ? images.length - 1 : previous - 1
                      )
                    }
                  >
                    ‹
                  </button>

                  <button
                    className="details-arrow right"
                    onClick={() =>
                      setSelectedImage(
                        (previous) => (previous + 1) % images.length
                      )
                    }
                  >
                    ›
                  </button>
                </>
              )}

              <div className="details-dots">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={selectedImage === index ? "active" : ""}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* RECENTLY VIEWED */}

        {recentlyViewed.length > 0 && (
          <section className="recently-viewed">
            <h2>Recently Viewed Products</h2>

            <div className="recent-grid">
              {recentlyViewed.map((item) => (
                <div
                  key={getPropertyId(item, detectedPropertyType)}
                  className="recent-card"
                  onClick={() => openProperty(item)}
                >
                  <div className="recent-image">
                    <img
                      src={getImageUrl(item.mainImage || item.image)}
                      alt={item.title || "Property"}
                    />
                  </div>

                  <div className="recent-content">
                    <h3>{item.title}</h3>

                    <strong>{item.price}</strong>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* REVIEWS */}

        <section className="property-reviews">
          <h2>Customer Reviews</h2>

          <div className="reviews-summary">
            <div>
              <div className="average-stars">
                {Array.from({ length: 5 }, (_, index) =>
                  index < Math.round(reviewSummary.averageRating)
                    ? "★"
                    : "☆"
                ).join("")}
              </div>

              <strong>
                {Number(reviewSummary.averageRating || 0).toFixed(1)} out of 5
              </strong>

              <p>
                Based on {reviewSummary.totalReviews} review
                {reviewSummary.totalReviews !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="rating-bars">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count =
                  reviewSummary.ratingDistribution?.[rating] || 0;

                const percentage = reviewSummary.totalReviews
                  ? (count / reviewSummary.totalReviews) * 100
                  : 0;

                return (
                  <div key={rating} className="rating-row">
                    <span>{"★".repeat(rating)}</span>

                    <div>
                      <i style={{ width: `${percentage}%` }} />
                    </div>

                    <small>{count}</small>
                  </div>
                );
              })}
            </div>

            <button
              className="write-review-btn"
              onClick={() => {
                if (!isAuthenticated) {
                  alert("Please login to write a review.");
                  return;
                }

                // if ((detectedPropertyType !== "property" && detectedPropertyType !== "luxury")) {
                //   alert(
                //     "Review system for this property is not enabled yet."
                //   );
                //   return;
                // }


                if (
  !["property", "luxury", "spacious","penthouse"].includes(
    detectedPropertyType
  )
) {
  alert(
    "Review system for this property is not enabled yet."
  );

  return;
}

                setShowReviewForm(true);
              }}
            >
              Write a review
            </button>
          </div>

          {/* REVIEW FORM */}

          {showReviewForm && (
            <form className="property-review-form" onSubmit={submitReview}>
              <div className="review-form-title">
                <h3>Write a review</h3>

                <button type="button" onClick={() => setShowReviewForm(false)}>
                  ×
                </button>
              </div>

              <label>Rating</label>

              <div className="review-rating">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    type="button"
                    key={rating}
                    className={reviewForm.rating >= rating ? "selected" : ""}
                    onClick={() => selectRating(rating)}
                  >
                    ★
                  </button>
                ))}
              </div>

              <label>Review Title</label>

              <input
                name="reviewTitle"
                value={reviewForm.reviewTitle}
                onChange={handleReviewChange}
                placeholder="Give your review a title"
                maxLength={100}
              />

              <label>Review content</label>

              <textarea
                name="reviewContent"
                value={reviewForm.reviewContent}
                onChange={handleReviewChange}
                placeholder="Start writing here..."
              />

              <label>Pictures (optional, maximum 3)</label>

              <input
                type="file"
                name="media"
                accept="image/*"
                multiple
                onChange={handleReviewChange}
              />

              <label>Display name</label>

              <input
                name="displayName"
                value={reviewForm.displayName}
                onChange={handleReviewChange}
                placeholder="Display name"
              />

              <label>Email address</label>

              <input
                type="email"
                name="email"
                value={reviewForm.email}
                onChange={handleReviewChange}
                placeholder="Your email address"
              />

              <p className="review-privacy">
                Your information will only be used for your review.
              </p>

              <div className="review-form-buttons">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                >
                  Cancel review
                </button>

                <button type="submit" disabled={submittingReview}>
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          )}

          {/* REVIEW LIST */}

          <div className="review-list">
            {reviews.length === 0 ? (
              <div className="no-reviews">No reviews yet.</div>
            ) : (
              reviews.map((review) => (
                <article key={review._id} className="review-card">
                  <div className="review-card-top">
                    <div>
                      {"★".repeat(review.rating)}

                      {"☆".repeat(5 - review.rating)}
                    </div>

                    <small>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </small>
                  </div>

                  <div className="review-user">
                    <div className="review-avatar">
                      {review.displayName?.charAt(0)?.toUpperCase()}
                    </div>

                    <strong>{review.displayName}</strong>
                  </div>

                  <h4>{review.reviewTitle}</h4>

                  <p>{review.reviewContent}</p>

                  {Array.isArray(review.media) && review.media.length > 0 && (
                    <div className="review-media-gallery">
                      {review.media.map((image, imageIndex) => (
                        <img
                          key={`${review._id}-media-${imageIndex}`}
                          className="review-media-thumb"
                          src={getImageUrl(image)}
                          alt={`Review ${imageIndex + 1}`}
                          onClick={() => {
                            setReviewImagePreview(review.media);

                            setReviewImageIndex(imageIndex);
                          }}
                        />
                      ))}
                    </div>
                  )}
                </article>
              ))
            )}
          </div>
        </section>
      </div>

      {/* REVIEW IMAGE LIGHTBOX */}

      {reviewImagePreview && (
        <div
          className="review-image-lightbox"
          onClick={() => setReviewImagePreview(null)}
        >
          <div
            className="review-image-lightbox-content"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="review-image-lightbox-close"
              onClick={() => setReviewImagePreview(null)}
            >
              ×
            </button>

            {reviewImagePreview.length > 1 && (
              <button
                type="button"
                className="review-image-lightbox-arrow left"
                onClick={() =>
                  setReviewImageIndex((previous) =>
                    previous === 0
                      ? reviewImagePreview.length - 1
                      : previous - 1
                  )
                }
              >
                ‹
              </button>
            )}

            <img
              className="review-image-lightbox-image"
              src={getImageUrl(reviewImagePreview[reviewImageIndex])}
              alt="Review"
            />

            {reviewImagePreview.length > 1 && (
              <button
                type="button"
                className="review-image-lightbox-arrow right"
                onClick={() =>
                  setReviewImageIndex(
                    (previous) => (previous + 1) % reviewImagePreview.length
                  )
                }
              >
                ›
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default PropertyDetails;
