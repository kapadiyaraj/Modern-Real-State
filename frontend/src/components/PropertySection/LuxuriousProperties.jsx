



// import React, {
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import { useNavigate } from "react-router-dom";

// import "./LuxuriousProperties.css";

// import { useCart } from "../../context/CartContext";

// import {
//   useWishlist,
// } from "../../context/WishlistContext";

// import {
//   useCompare,
// } from "../../context/CompareContext";

// const API_URL =
//   "http://localhost:5000/api/luxurious-properties";

// const categories = [
//   "Bestseller",
//   "Farm Vila",
//   "Luxury Properties",
//   "Royal House",
// ];

// const LuxuriousProperties = ({ data }) => {
//   const navigate = useNavigate();

//   const { addToCart } = useCart();

//   // ==========================================
//   // WISHLIST FROM MONGODB
//   // ==========================================
//   const {
//     wishlist,
//     toggleWishlist,
//     isWishlisted,
//   } = useWishlist();

//   // ==========================================
//   // COMPARE FROM MONGODB/CONTEXT
//   // ==========================================
//   const { addToCompare } = useCompare();

//   // ==========================================
//   // WISHLIST PAYLOAD HELPER
//   // ==========================================
//   const buildWishlistPayload = (property) => ({
//     ...property,
//     wishlistType: "luxury",
//   });

//   // ==========================================
//   // LUXURY CART PAYLOAD HELPER
//   // ==========================================
//   const buildLuxuryCartPayload = (property) => ({
//     ...property,
//     productType: "luxury",
//   });

//   // ==========================================
//   // PROPERTIES
//   // ==========================================
//   const [properties, setProperties] =
//     useState([]);

//   const [activeCategory, setActiveCategory] =
//     useState("Bestseller");

//   // ==========================================
//   // SLIDER
//   // ==========================================
//   const [centerIndex, setCenterIndex] =
//     useState(2);

//   // ==========================================
//   // QUICK VIEW
//   // ==========================================
//   const [quickView, setQuickView] =
//     useState(null);

//   const [modalImageIndex, setModalImageIndex] =
//     useState(0);

//   const [quantity, setQuantity] =
//     useState(1);

//   // ==========================================
//   // GET PROPERTIES
//   // ==========================================
//   useEffect(() => {
//     if (Array.isArray(data) && data.length) {
//       setProperties(data);
//       return;
//     }

//     const fetchProperties = async () => {
//       try {
//         const response = await fetch(
//           API_URL
//         );

//         if (!response.ok) {
//           throw new Error(
//             "Failed to fetch luxurious properties"
//           );
//         }

//         const result =
//           await response.json();

//         const propertyData =
//           Array.isArray(result)
//             ? result
//             : Array.isArray(
//                 result?.data
//               )
//             ? result.data
//             : Array.isArray(
//                 result?.properties
//               )
//             ? result.properties
//             : [];

//         setProperties(propertyData);
//       } catch (error) {
//         console.error(
//           "Luxurious Properties API Error:",
//           error
//         );

//         setProperties([]);
//       }
//     };

//     fetchProperties();
//   }, [data]);

//   // ==========================================
//   // FILTER PROPERTIES
//   // ==========================================
//   const filteredProperties = useMemo(() => {
//     if (!properties.length) {
//       return [];
//     }

//     if (
//       activeCategory ===
//       "Bestseller"
//     ) {
//       return properties;
//     }

//     return properties.filter(
//       (property) => {
//         const propCategory =
//           (
//             property.category || ""
//           )
//             .trim()
//             .toLowerCase();

//         const targetCategory =
//           activeCategory
//             .trim()
//             .toLowerCase();

//         return (
//           propCategory ===
//           targetCategory
//         );
//       }
//     );
//   }, [
//     properties,
//     activeCategory,
//   ]);

//   // ==========================================
//   // RESET SLIDER
//   // ==========================================
//   useEffect(() => {
//     setCenterIndex(2);
//   }, [activeCategory]);

//   // ==========================================
//   // CIRCULAR INDEX
//   // ==========================================
//   const getCircularIndex = (
//     index
//   ) => {
//     if (
//       !filteredProperties.length
//     ) {
//       return 0;
//     }

//     return (
//       ((index %
//         filteredProperties.length) +
//         filteredProperties.length) %
//       filteredProperties.length
//     );
//   };

//   // ==========================================
//   // VISIBLE CARDS
//   // ==========================================
//   const visibleCards = useMemo(() => {
//     if (
//       !filteredProperties.length
//     ) {
//       return [];
//     }

//     const result = [];

//     const totalCards =
//       filteredProperties.length;

//     const range =
//       totalCards < 7
//         ? Math.floor(
//             totalCards / 2
//           )
//         : 3;

//     for (
//       let offset = -range;
//       offset <= range;
//       offset++
//     ) {
//       const actualIndex =
//         getCircularIndex(
//           centerIndex + offset
//         );

//       result.push({
//         property:
//           filteredProperties[
//             actualIndex
//           ],

//         actualIndex,

//         offset,
//       });
//     }

//     return result;
//   }, [
//     filteredProperties,
//     centerIndex,
//   ]);

//   // ==========================================
//   // NEXT SLIDE
//   // ==========================================
//   const handleNext = () => {
//     if (
//       !filteredProperties.length
//     ) {
//       return;
//     }

//     setCenterIndex(
//       (previous) =>
//         getCircularIndex(
//           previous + 1
//         )
//     );
//   };

//   // ==========================================
//   // PREVIOUS SLIDE
//   // ==========================================
//   const handlePrevious = () => {
//     if (
//       !filteredProperties.length
//     ) {
//       return;
//     }

//     setCenterIndex(
//       (previous) =>
//         getCircularIndex(
//           previous - 1
//         )
//     );
//   };

//   // ==========================================
//   // WISHLIST
//   // ==========================================
//   const handleWishlist = async (
//     property
//   ) => {
//     await toggleWishlist(
//       buildWishlistPayload(property)
//     );
//   };

//   // ==========================================
//   // COMPARE
//   // ==========================================
//   const handleCompare = async (property) => {
//     try {
//       await addToCompare(property);
//       navigate("/compare");
//     } catch (error) {
//       console.error(
//         "Compare error:",
//         error
//       );
//     }
//   };

//   // ==========================================
//   // QUICK VIEW
//   // ==========================================
//   const openQuickView = (
//     property
//   ) => {
//     setQuickView(property);

//     setModalImageIndex(0);

//     setQuantity(1);
//   };

//   const closeQuickView = () => {
//     setQuickView(null);

//     setModalImageIndex(0);

//     setQuantity(1);
//   };

//   // ==========================================
//   // MODAL IMAGES
//   // ==========================================
//   const modalImages = quickView
//     ? quickView.sliderImages
//         ?.length
//       ? quickView.sliderImages.slice(
//           0,
//           4
//         )
//       : quickView.mainImage
//       ? [quickView.mainImage]
//       : []
//     : [];

//   // ==========================================
//   // NEXT MODAL IMAGE
//   // ==========================================
//   const nextModalImage = () => {
//     if (
//       !modalImages.length
//     ) {
//       return;
//     }

//     setModalImageIndex(
//       (previous) =>
//         (previous + 1) %
//         modalImages.length
//     );
//   };

//   // ==========================================
//   // PREVIOUS MODAL IMAGE
//   // ==========================================
//   const previousModalImage = () => {
//     if (
//       !modalImages.length
//     ) {
//       return;
//     }

//     setModalImageIndex(
//       (previous) =>
//         (previous -
//           1 +
//           modalImages.length) %
//         modalImages.length
//     );
//   };

//   // ==========================================
//   // RENDER
//   // ==========================================
//   return (
//     <>
//       <section className="luxurious-properties-section">
//         <div className="luxurious-properties-container">

//           {/* HEADER */}
//           <div className="luxurious-properties-header">

//             <h2>
//               Luxurious properties
//             </h2>

//             <div className="luxury-filter-buttons">

//               {categories.map(
//                 (category) => (
//                   <button
//                     type="button"
//                     key={category}
//                     className={
//                       activeCategory ===
//                       category
//                         ? "luxury-filter-active"
//                         : ""
//                     }
//                     onClick={() => {
//                       setActiveCategory(
//                         category
//                       );

//                       setCenterIndex(
//                         0
//                       );
//                     }}
//                   >
//                     {category}
//                   </button>
//                 )
//               )}

//             </div>

//           </div>

//           <div className="luxury-divider" />

//           {/* SLIDER */}
//           <div className="luxury-slider-viewport">

//             {filteredProperties.length ===
//             0 ? (
//               <div
//                 style={{
//                   textAlign:
//                     "center",
//                   padding:
//                     "40px",
//                   color: "#777",
//                 }}
//               >
//                 <p>
//                   No properties found
//                   in this category.
//                 </p>
//               </div>
//             ) : (
//               <div className="luxury-slider-track">

//                 {visibleCards.map(
//                   ({
//                     property,
//                     offset,
//                     actualIndex,
//                   }, index) => {

//                     if (!property) {
//                       return null;
//                     }

//                     const isCenter =
//                       offset === 0;

//                     const propertyWishlisted =
//                       isWishlisted(
//                         buildWishlistPayload(property)
//                       );

//                     return (
//                       <article
//                         key={`${property.id || property._id}-${index}-${actualIndex}`}
//                         className={`
//                           luxury-property-card
//                           ${
//                             isCenter
//                               ? "luxury-property-card-active"
//                               : ""
//                           }
//                           ${
//                             offset ===
//                             -3
//                               ? "luxury-side-card-left"
//                               : ""
//                           }
//                           ${
//                             offset ===
//                             3
//                               ? "luxury-side-card-right"
//                               : ""
//                           }
//                         `}
//                       >

//                         {/* IMAGE */}
//                         <div className="luxury-property-image-wrapper">

//                           <img
//                             onClick={(event) => {
//                               event.stopPropagation();
//                               navigate(
//                                 `/property-details?id=${
//                                   property._id || property.id
//                                 }&type=luxury`
//                               );
//                             }}
//                             src={
//                               property.mainImage
//                             }
//                             alt={
//                               property.title
//                             }
//                             className="luxury-property-image"
//                           />

//                           {/* NEW */}
//                           {property.isNew && (
//                             <span className="luxury-new-badge">
//                               New
//                             </span>
//                           )}

//                           {/* ACTIONS */}
//                           <div className="luxury-property-actions">

//                             {/* WISHLIST */}
//                             <button
//                               type="button"
//                               className={
//                                 propertyWishlisted
//                                   ? "luxury-action-btn luxury-wishlist-active"
//                                   : "luxury-action-btn"
//                               }
//                               onClick={() =>
//                                 handleWishlist(
//                                   property
//                                 )
//                               }
//                               aria-label="Wishlist"
//                             >
//                               {propertyWishlisted
//                                 ? "♥"
//                                 : "♡"}
//                             </button>

//                             {/* COMPARE */}
//                             <button
//                               type="button"
//                               className="luxury-action-btn"
//                               onClick={() =>
//                                 handleCompare(
//                                   property
//                                 )
//                               }
//                               aria-label="Compare"
//                             >
//                               ⇄
//                             </button>

//                             {/* QUICK VIEW */}
//                             <button
//                               type="button"
//                               className="luxury-action-btn"
//                               onClick={() =>
//                                 openQuickView(
//                                   property
//                                 )
//                               }
//                               aria-label="Quick view"
//                             >
//                               ◉
//                             </button>

//                           </div>
//                         </div>

//                         {/* CONTENT */}
//                         <div className="luxury-property-content">

//                           <div className="luxury-property-type">

//                             <span className="luxury-location-icon">
//                               ◎
//                             </span>

//                             {property.type ||
//                               property.category ||
//                               "Home"}

//                           </div>

//                           <h3>
//                             {property.title}
//                           </h3>

//                           <select
//                             defaultValue={
//                               property.size ||
//                               property
//                                 .sizes?.[0]
//                             }
//                           >
//                             {(
//                               property.sizes ||
//                               [
//                                 property.size,
//                               ]
//                             ).map(
//                               (size) => (
//                                 <option
//                                   key={
//                                     size
//                                   }
//                                   value={
//                                     size
//                                   }
//                                 >
//                                   {size}
//                                 </option>
//                               )
//                             )}
//                           </select>

//                           <div className="luxury-property-price">

//                             <strong>
//                               {
//                                 property.price
//                               }
//                             </strong>

//                             {property.oldPrice && (
//                               <del>
//                                 {
//                                   property.oldPrice
//                                 }
//                               </del>
//                             )}

//                           </div>

//                           {/* ADD TO CART */}
//                           <button
//                             className="luxury-cart-button"
//                             onClick={async () => {
//                               const result =
//                                 await addToCart(
//                                   buildLuxuryCartPayload(
//                                     property
//                                   )
//                                 );

//                               if (
//                                 result?.success
//                               ) {
//                                 alert(
//                                   "Added to cart"
//                                 );
//                               }
//                             }}
//                           >
//                             Add to Cart
//                           </button>

//                         </div>

//                       </article>
//                     );
//                   }
//                 )}

//               </div>
//             )}

//           </div>

//           {/* SLIDER CONTROLS */}
//           <div className="luxury-slider-controls">

//             <button
//               type="button"
//               className="luxury-slider-arrow"
//               onClick={
//                 handlePrevious
//               }
//               aria-label="Previous properties"
//             >
//               ←
//             </button>

//             <div className="luxury-control-line" />

//             <button
//               type="button"
//               className="luxury-slider-arrow"
//               onClick={
//                 handleNext
//               }
//               aria-label="Next properties"
//             >
//               →
//             </button>

//           </div>

//         </div>
//       </section>

//       {/* ==========================================
//           QUICK VIEW MODAL
//       ========================================== */}

//       {quickView && (
//         <div
//           className="luxury-modal-overlay"
//           onClick={
//             closeQuickView
//           }
//         >

//           <div
//             className="luxury-modal"
//             onClick={(event) =>
//               event.stopPropagation()
//             }
//           >

//             {/* CLOSE */}
//             <button
//               type="button"
//               className="luxury-modal-close"
//               onClick={
//                 closeQuickView
//               }
//               aria-label="Close"
//             >
//               ×
//             </button>

//             {/* GALLERY */}
//             <div className="luxury-modal-gallery">

//               {modalImages.length >
//                 0 && (
//                 <img
//                   src={
//                     modalImages[
//                       modalImageIndex
//                     ]
//                   }
//                   alt={
//                     quickView.title
//                   }
//                   className="luxury-modal-main-image"
//                 />
//               )}

//               {/* PREVIOUS */}
//               <button
//                 type="button"
//                 className="luxury-modal-image-arrow luxury-modal-prev"
//                 onClick={
//                   previousModalImage
//                 }
//               >
//                 ‹
//               </button>

//               {/* NEXT */}
//               <button
//                 type="button"
//                 className="luxury-modal-image-arrow luxury-modal-next"
//                 onClick={
//                   nextModalImage
//                 }
//               >
//                 ›
//               </button>

//               {/* THUMBNAILS */}
//               <div className="luxury-modal-thumbnails">

//                 {modalImages.map(
//                   (
//                     image,
//                     index
//                   ) => (
//                     <button
//                       type="button"
//                       key={`${image}-${index}`}
//                       className={
//                         modalImageIndex ===
//                         index
//                           ? "luxury-thumbnail luxury-thumbnail-active"
//                           : "luxury-thumbnail"
//                       }
//                       onClick={() =>
//                         setModalImageIndex(
//                           index
//                         )
//                       }
//                     >
//                       <img
//                         src={image}
//                         alt={`View ${
//                           index + 1
//                         }`}
//                       />
//                     </button>
//                   )
//                 )}

//               </div>

//             </div>

//             {/* MODAL CONTENT */}
//             <div className="luxury-modal-content">

//               <span className="luxury-modal-category">
//                 {quickView.type ||
//                   quickView.category ||
//                   "Home"}
//               </span>

//               <h2>
//                 {quickView.title}
//               </h2>

//               <p className="luxury-modal-description">
//                 Experience the
//                 epitome of luxury
//                 and comfortable
//                 living with this
//                 beautiful property.
//                 Explore the property
//                 images and choose
//                 the perfect size for
//                 your needs.
//               </p>

//               <div className="luxury-modal-size">
//                 <strong>
//                   Size:
//                 </strong>{" "}
//                 {quickView.size}
//               </div>

//               <div className="luxury-modal-sizes">

//                 {(
//                   quickView.sizes ||
//                   [quickView.size]
//                 ).map(
//                   (
//                     size,
//                     index
//                   ) => (
//                     <button
//                       type="button"
//                       key={size}
//                       className={
//                         index === 0
//                           ? "luxury-size-active"
//                           : ""
//                       }
//                     >
//                       {size}
//                     </button>
//                   )
//                 )}

//               </div>

//               <div className="luxury-modal-price">

//                 <strong>
//                   {
//                     quickView.price
//                   }
//                 </strong>

//                 {quickView.oldPrice && (
//                   <del>
//                     {
//                       quickView.oldPrice
//                     }
//                   </del>
//                 )}

//               </div>

//               <div className="luxury-modal-cart-row">

//                 <button
//                   type="button"
//                   className="luxury-modal-cart"
//                   onClick={async () => {
//                     const result =
//                       await addToCart(
//                         buildLuxuryCartPayload(
//                           quickView
//                         )
//                       );

//                     if (
//                       result?.success
//                     ) {
//                       alert(
//                         "Added to cart"
//                       );
//                     }
//                   }}
//                 >
//                   Add to Cart 🛒
//                 </button>

//                 <div className="luxury-quantity">

//                   <button
//                     type="button"
//                     onClick={() =>
//                       setQuantity(
//                         (previous) =>
//                           Math.max(
//                             1,
//                             previous -
//                               1
//                           )
//                       )
//                     }
//                   >
//                     −
//                   </button>

//                   <span>
//                     {quantity}
//                   </span>

//                   <button
//                     type="button"
//                     onClick={() =>
//                       setQuantity(
//                         (previous) =>
//                           previous +
//                           1
//                       )
//                     }
//                   >
//                     +
//                   </button>

//                 </div>

//               </div>

//             </div>

//           </div>

//         </div>
//       )}
//     </>
//   );
// };

// export default LuxuriousProperties;



import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import "./LuxuriousProperties.css";

import { useCart } from "../../context/CartContext";

import {
  useWishlist,
} from "../../context/WishlistContext";

import {
  useCompare,
} from "../../context/CompareContext";

const API_URL =
  "http://localhost:5000/api/luxurious-properties";

const categories = [
  "Bestseller",
  "Farm Vila",
  "Luxury Properties",
  "Royal House",
];

const LuxuriousProperties = ({ data }) => {
  const navigate = useNavigate();

  const { addToCart } = useCart();

  // ==========================================
  // WISHLIST FROM MONGODB
  // ==========================================
  const {
    wishlist,
    toggleWishlist,
    isWishlisted,
  } = useWishlist();

  // ==========================================
  // COMPARE FROM MONGODB/CONTEXT
  // ==========================================
  const { addToCompare } = useCompare();

  // ==========================================
  // WISHLIST PAYLOAD HELPER
  // ==========================================
  const buildWishlistPayload = (property) => ({
    ...property,
    wishlistType: "luxury",
  });

  // ==========================================
  // LUXURY CART PAYLOAD HELPER
  // ==========================================
  const buildLuxuryCartPayload = (property) => ({
    ...property,
    productType: "luxury",
  });

  // ==========================================
  // PROPERTIES
  // ==========================================
  const [properties, setProperties] = useState([]);

  const [activeCategory, setActiveCategory] =
    useState("Bestseller");

  // ==========================================
  // SLIDER
  // ==========================================
  const [centerIndex, setCenterIndex] =
    useState(2);

  // ==========================================
  // QUICK VIEW
  // ==========================================
  const [quickView, setQuickView] =
    useState(null);

  const [modalImageIndex, setModalImageIndex] =
    useState(0);

  const [quantity, setQuantity] =
    useState(1);

  // ==========================================
  // GET PROPERTIES
  // ==========================================
  useEffect(() => {
    if (Array.isArray(data) && data.length) {
      setProperties(data);
      return;
    }

    const fetchProperties = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(
            "Failed to fetch luxurious properties"
          );
        }

        const result = await response.json();

        const propertyData =
          Array.isArray(result)
            ? result
            : Array.isArray(result?.data)
            ? result.data
            : Array.isArray(result?.properties)
            ? result.properties
            : [];

        setProperties(propertyData);
      } catch (error) {
        console.error(
          "Luxurious Properties API Error:",
          error
        );

        setProperties([]);
      }
    };

    fetchProperties();
  }, [data]);

  // ==========================================
  // FILTER PROPERTIES
  // ==========================================
  const filteredProperties = useMemo(() => {
    if (!properties.length) {
      return [];
    }

    if (activeCategory === "Bestseller") {
      return properties;
    }

    return properties.filter((property) => {
      const propCategory = (
        property.category || ""
      )
        .trim()
        .toLowerCase();

      const targetCategory = activeCategory
        .trim()
        .toLowerCase();

      return propCategory === targetCategory;
    });
  }, [
    properties,
    activeCategory,
  ]);

  // ==========================================
  // RESET SLIDER
  // ==========================================
  useEffect(() => {
    setCenterIndex(2);
  }, [activeCategory]);

  // ==========================================
  // CIRCULAR INDEX
  // ==========================================
  const getCircularIndex = (index) => {
    if (!filteredProperties.length) {
      return 0;
    }

    return (
      ((index % filteredProperties.length) +
        filteredProperties.length) %
      filteredProperties.length
    );
  };

  // ==========================================
  // VISIBLE CARDS
  // ==========================================
  const visibleCards = useMemo(() => {
    if (!filteredProperties.length) {
      return [];
    }

    const result = [];

    const totalCards =
      filteredProperties.length;

    const range =
      totalCards < 7
        ? Math.floor(totalCards / 2)
        : 3;

    for (
      let offset = -range;
      offset <= range;
      offset++
    ) {
      const actualIndex =
        getCircularIndex(
          centerIndex + offset
        );

      result.push({
        property:
          filteredProperties[actualIndex],

        actualIndex,

        offset,
      });
    }

    return result;
  }, [
    filteredProperties,
    centerIndex,
  ]);

  // ==========================================
  // NEXT SLIDE
  // ==========================================
  const handleNext = () => {
    if (!filteredProperties.length) {
      return;
    }

    setCenterIndex(
      (previous) =>
        getCircularIndex(
          previous + 1
        )
    );
  };

  // ==========================================
  // PREVIOUS SLIDE
  // ==========================================
  const handlePrevious = () => {
    if (!filteredProperties.length) {
      return;
    }

    setCenterIndex(
      (previous) =>
        getCircularIndex(
          previous - 1
        )
    );
  };

  // ==========================================
  // WISHLIST
  // ==========================================
  const handleWishlist = async (
    property
  ) => {
    await toggleWishlist(
      buildWishlistPayload(property)
    );
  };

  // ==========================================
  // COMPARE
  // ==========================================
  const handleCompare = async (property) => {
    try {
      await addToCompare(property);

      navigate("/compare");
    } catch (error) {
      console.error(
        "Compare error:",
        error
      );
    }
  };

  // ==========================================
  // QUICK VIEW
  // ==========================================
  const openQuickView = (property) => {
    setQuickView(property);

    setModalImageIndex(0);

    setQuantity(1);
  };

  const closeQuickView = () => {
    setQuickView(null);

    setModalImageIndex(0);

    setQuantity(1);
  };

  // ==========================================
  // MODAL IMAGES
  // ==========================================
  const modalImages = quickView
    ? quickView.sliderImages?.length
      ? quickView.sliderImages.slice(0, 4)
      : quickView.mainImage
      ? [quickView.mainImage]
      : []
    : [];

  // ==========================================
  // NEXT MODAL IMAGE
  // ==========================================
  const nextModalImage = () => {
    if (!modalImages.length) {
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
  const previousModalImage = () => {
    if (!modalImages.length) {
      return;
    }

    setModalImageIndex(
      (previous) =>
        (previous - 1 + modalImages.length) %
        modalImages.length
    );
  };

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <>
      <section className="luxurious-properties-section">
        <div className="luxurious-properties-container">

          {/* HEADER */}
          <div className="luxurious-properties-header">

            <h2>
              Luxurious properties
            </h2>

            <div className="luxury-filter-buttons">

              {categories.map(
                (category) => (
                  <button
                    type="button"
                    key={category}
                    className={
                      activeCategory ===
                      category
                        ? "luxury-filter-active"
                        : ""
                    }
                    onClick={() => {
                      setActiveCategory(
                        category
                      );

                      setCenterIndex(0);
                    }}
                  >
                    {category}
                  </button>
                )
              )}

            </div>

          </div>

          <div className="luxury-divider" />

          {/* SLIDER */}
          <div className="luxury-slider-viewport">

            {filteredProperties.length ===
            0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "#777",
                }}
              >
                <p>
                  No properties found
                  in this category.
                </p>
              </div>
            ) : (
              <div className="luxury-slider-track">

                {visibleCards.map(
                  (
                    {
                      property,
                      offset,
                      actualIndex,
                    },
                    index
                  ) => {

                    if (!property) {
                      return null;
                    }

                    const isCenter =
                      offset === 0;

                    const propertyWishlisted =
                      isWishlisted(
                        buildWishlistPayload(
                          property
                        )
                      );

                    return (
                      <article
                        key={`${property.id || property._id}-${index}-${actualIndex}`}
                        className={`
                          luxury-property-card
                          ${
                            isCenter
                              ? "luxury-property-card-active"
                              : ""
                          }
                          ${
                            offset === -3
                              ? "luxury-side-card-left"
                              : ""
                          }
                          ${
                            offset === 3
                              ? "luxury-side-card-right"
                              : ""
                          }
                        `}
                      >

                        {/* IMAGE */}
                        <div className="luxury-property-image-wrapper">

                          <img
                            onClick={(event) => {
                              event.stopPropagation();

                              /*
                               * IMPORTANT FIX:
                               * Luxury properties use the
                               * numeric custom `id`.
                               *
                               * Do NOT use `_id` here because
                               * the order stores productId
                               * using property.id.
                               */
                              navigate(
                                `/property-details?id=${property.id}&type=luxury`
                              );
                            }}
                            src={
                              property.mainImage
                            }
                            alt={
                              property.title
                            }
                            className="luxury-property-image"
                          />

                          {/* NEW */}
                          {property.isNew && (
                            <span className="luxury-new-badge">
                              New
                            </span>
                          )}

                          {/* ACTIONS */}
                          <div className="luxury-property-actions">

                            {/* WISHLIST */}
                            <button
                              type="button"
                              className={
                                propertyWishlisted
                                  ? "luxury-action-btn luxury-wishlist-active"
                                  : "luxury-action-btn"
                              }
                              onClick={() =>
                                handleWishlist(
                                  property
                                )
                              }
                              aria-label="Wishlist"
                            >
                              {propertyWishlisted
                                ? "♥"
                                : "♡"}
                            </button>

                            {/* COMPARE */}
                            <button
                              type="button"
                              className="luxury-action-btn"
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
                              className="luxury-action-btn"
                              onClick={() =>
                                openQuickView(
                                  property
                                )
                              }
                              aria-label="Quick view"
                            >
                              ◉
                            </button>

                          </div>
                        </div>

                        {/* CONTENT */}
                        <div className="luxury-property-content">

                          <div className="luxury-property-type">

                            <span className="luxury-location-icon">
                              ◎
                            </span>

                            {property.type ||
                              property.category ||
                              "Home"}

                          </div>

                          <h3>
                            {property.title}
                          </h3>

                          <select
                            defaultValue={
                              property.size ||
                              property.sizes?.[0]
                            }
                          >
                            {(
                              property.sizes ||
                              [property.size]
                            ).map(
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

                          <div className="luxury-property-price">

                            <strong>
                              {
                                property.price
                              }
                            </strong>

                            {property.oldPrice && (
                              <del>
                                {
                                  property.oldPrice
                                }
                              </del>
                            )}

                          </div>

                          {/* ADD TO CART */}
                          <button
                            className="luxury-cart-button"
                            onClick={async () => {

                              const result =
                                await addToCart(
                                  buildLuxuryCartPayload(
                                    property
                                  )
                                );

                              if (
                                result?.success
                              ) {
                                alert(
                                  "Added to cart"
                                );
                              }

                            }}
                          >
                            Add to Cart
                          </button>

                        </div>

                      </article>
                    );
                  }
                )}

              </div>
            )}

          </div>

          {/* SLIDER CONTROLS */}
          <div className="luxury-slider-controls">

            <button
              type="button"
              className="luxury-slider-arrow"
              onClick={
                handlePrevious
              }
              aria-label="Previous properties"
            >
              ←
            </button>

            <div className="luxury-control-line" />

            <button
              type="button"
              className="luxury-slider-arrow"
              onClick={
                handleNext
              }
              aria-label="Next properties"
            >
              →
            </button>

          </div>

        </div>
      </section>

      {/* ==========================================
          QUICK VIEW MODAL
      ========================================== */}

      {quickView && (
        <div
          className="luxury-modal-overlay"
          onClick={
            closeQuickView
          }
        >

          <div
            className="luxury-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* CLOSE */}
            <button
              type="button"
              className="luxury-modal-close"
              onClick={
                closeQuickView
              }
              aria-label="Close"
            >
              ×
            </button>

            {/* GALLERY */}
            <div className="luxury-modal-gallery">

              {modalImages.length >
                0 && (
                <img
                  src={
                    modalImages[
                      modalImageIndex
                    ]
                  }
                  alt={
                    quickView.title
                  }
                  className="luxury-modal-main-image"
                />
              )}

              {/* PREVIOUS */}
              <button
                type="button"
                className="luxury-modal-image-arrow luxury-modal-prev"
                onClick={
                  previousModalImage
                }
              >
                ‹
              </button>

              {/* NEXT */}
              <button
                type="button"
                className="luxury-modal-image-arrow luxury-modal-next"
                onClick={
                  nextModalImage
                }
              >
                ›
              </button>

              {/* THUMBNAILS */}
              <div className="luxury-modal-thumbnails">

                {modalImages.map(
                  (
                    image,
                    index
                  ) => (
                    <button
                      type="button"
                      key={`${image}-${index}`}
                      className={
                        modalImageIndex ===
                        index
                          ? "luxury-thumbnail luxury-thumbnail-active"
                          : "luxury-thumbnail"
                      }
                      onClick={() =>
                        setModalImageIndex(
                          index
                        )
                      }
                    >
                      <img
                        src={image}
                        alt={`View ${
                          index + 1
                        }`}
                      />
                    </button>
                  )
                )}

              </div>

            </div>

            {/* MODAL CONTENT */}
            <div className="luxury-modal-content">

              <span className="luxury-modal-category">
                {quickView.type ||
                  quickView.category ||
                  "Home"}
              </span>

              <h2>
                {quickView.title}
              </h2>

              <p className="luxury-modal-description">
                Experience the
                epitome of luxury
                and comfortable
                living with this
                beautiful property.
                Explore the property
                images and choose
                the perfect size for
                your needs.
              </p>

              <div className="luxury-modal-size">
                <strong>
                  Size:
                </strong>{" "}
                {quickView.size}
              </div>

              <div className="luxury-modal-sizes">

                {(
                  quickView.sizes ||
                  [quickView.size]
                ).map(
                  (
                    size,
                    index
                  ) => (
                    <span
                      key={`${size}-${index}`}
                    >
                      {size}
                    </span>
                  )
                )}

              </div>

              <div className="luxury-modal-price">
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

              <div className="luxury-modal-quantity">

                <span>
                  Quantity
                </span>

                <div className="luxury-quantity-controls">

                  <button
                    type="button"
                    disabled={
                      quantity <= 1
                    }
                    onClick={() =>
                      setQuantity(
                        (previous) =>
                          Math.max(
                            1,
                            previous - 1
                          )
                      )
                    }
                  >
                    -
                  </button>

                  <span>
                    {quantity}
                  </span>

                  <button
                    type="button"
                    disabled={
                      quantity >=
                      Number(
                        quickView.availableUnits ??
                          Infinity
                      )
                    }
                    onClick={() =>
                      setQuantity(
                        (previous) =>
                          Math.min(
                            Number(
                              quickView.availableUnits ??
                                Infinity
                            ),
                            previous + 1
                          )
                      )
                    }
                  >
                    +
                  </button>

                </div>

              </div>

              <button
                type="button"
                className="luxury-modal-cart-button"
                onClick={async () => {

                  const result =
                    await addToCart(
                      {
                        ...buildLuxuryCartPayload(
                          quickView
                        ),
                        quantity,
                      }
                    );

                  if (
                    result?.success
                  ) {
                    alert(
                      "Added to cart"
                    );

                    closeQuickView();
                  }

                }}
              >
                Add to Cart
              </button>

            </div>

          </div>

        </div>
      )}

    </>
  );
};

export default LuxuriousProperties;