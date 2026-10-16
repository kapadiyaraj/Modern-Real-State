



// import React, { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./SpaciousLiving.css";
// import { useWishlist } from "../../context/WishlistContext";
// import { useCart } from "../../context/CartContext";
// import { useCompare } from "../../context/CompareContext";

// const API_URL = "http://localhost:5000/api/spacious-living";
// const SERVER_URL = "http://localhost:5000";

// const getImageUrl = (image) => {
//   if (!image) return "";
//   if (
//     image.startsWith("http://") ||
//     image.startsWith("https://") ||
//     image.startsWith("data:")
//   ) {
//     return image;
//   }
//   return image.startsWith("/uploads/")
//     ? `${SERVER_URL}${image}`
//     : `${SERVER_URL}/${image.startsWith("/") ? "" : "/"}${image}`;
// };

// const getPropertyId = (property) =>
//   String(property?._id || property?.id || property?.title || "");

// const SpaciousLiving = () => {
//   const navigate = useNavigate();

//   const { toggleWishlist, isWishlisted } = useWishlist();
//   const { addToCart } = useCart();
//   const { addToCompare, isCompared } = useCompare();

//   const [content, setContent] = useState(null);
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [loading, setLoading] = useState(true);

//   const [quickView, setQuickView] = useState(null);
//   const [modalImageIndex, setModalImageIndex] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [selectedSize, setSelectedSize] = useState("");

//   const fetchContent = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(API_URL);

//       if (!response.ok) {
//         throw new Error("Failed to fetch Spacious Living");
//       }

//       const result = await response.json();
//       const data = result?.success ? result.data : result;

//       if (data && typeof data === "object") {
//         setContent({
//           title: data.title || "",
//           topDescription: data.topDescription || "",
//           mainImage: data.mainImage || "",
//           bottomDescription: data.bottomDescription || "",
//           sliderProperties: Array.isArray(data.sliderProperties)
//             ? data.sliderProperties
//             : [],
//         });
//       } else {
//         setContent(null);
//       }
//     } catch (error) {
//       console.error("Spacious Living API Error:", error);
//       setContent(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchContent();
//   }, []);

//   const slides = useMemo(
//     () =>
//       Array.isArray(content?.sliderProperties)
//         ? content.sliderProperties
//         : [],
//     [content]
//   );

//   useEffect(() => {
//     if (slides.length === 0) {
//       setCurrentSlide(0);
//     } else if (currentSlide >= slides.length) {
//       setCurrentSlide(0);
//     }
//   }, [slides.length, currentSlide]);

//   const currentProperty =
//     slides.length > 0 ? slides[currentSlide] : null;

//   const nextSlide = () => {
//     if (slides.length <= 1) return;
//     setCurrentSlide((prev) => (prev + 1) % slides.length);
//   };

//   const prevSlide = () => {
//     if (slides.length <= 1) return;
//     setCurrentSlide(
//       (prev) => (prev - 1 + slides.length) % slides.length
//     );
//   };

//   const handleWishlist = async (property) => {
//     await toggleWishlist({
//       ...property,
//       wishlistType: "spacious",
//     });
//   };

//   const handleCompare = async (property) => {
//     try {
//       await addToCompare(property);
//       navigate("/compare");
//     } catch (error) {
//       console.error("Compare error:", error);
//       navigate("/compare");
//     }
//   };

//   const openQuickView = (property) => {
//     const propertyId = getPropertyId(property);

//     const mongoProperty =
//       slides.find(
//         (item) => getPropertyId(item) === propertyId
//       ) || property;

//     setQuickView(mongoProperty);
//     setModalImageIndex(0);
//     setQuantity(1);
//     setSelectedSize(
//       mongoProperty.sizes?.[0] ||
//         mongoProperty.size ||
//         ""
//     );

//     document.body.style.overflow = "hidden";
//   };

//   const closeQuickView = () => {
//     setQuickView(null);
//     setModalImageIndex(0);
//     document.body.style.overflow = "";
//   };

//   useEffect(() => {
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, []);

//   const modalImages = quickView
//     ? [
//         ...(quickView.mainImage
//           ? [quickView.mainImage]
//           : quickView.image
//           ? [quickView.image]
//           : []),
//         ...(Array.isArray(quickView.subImages)
//           ? quickView.subImages.slice(0, 3).filter(Boolean)
//           : []),
//       ]
//     : [];

//   const modalNextImage = () => {
//     if (modalImages.length <= 1) return;
//     setModalImageIndex(
//       (prev) => (prev + 1) % modalImages.length
//     );
//   };

//   const modalPrevImage = () => {
//     if (modalImages.length <= 1) return;
//     setModalImageIndex(
//       (prev) =>
//         (prev - 1 + modalImages.length) % modalImages.length
//     );
//   };

//   if (loading || !content) return null;

//   const hasContent =
//     Boolean(content.title) ||
//     Boolean(content.topDescription) ||
//     Boolean(content.mainImage) ||
//     Boolean(content.bottomDescription) ||
//     slides.length > 0;

//   if (!hasContent) return null;

//   const propertyWishlisted = currentProperty
//     ? isWishlisted({
//         ...currentProperty,
//         wishlistType: "spacious",
//       })
//     : false;

//   const propertyCompared = currentProperty
//     ? isCompared(currentProperty)
//     : false;

//   return (
//     <>
//       <section className="spacious-living-section">
//         <div className="spacious-header-container">
//           <div className="spacious-title-area">
//             {content.title && <h2>{content.title}</h2>}
//           </div>

//           <div className="spacious-text-area">
//             {content.topDescription && (
//               <p>{content.topDescription}</p>
//             )}
//           </div>
//         </div>

//         {content.mainImage && (
//           <div className="spacious-hero-image-wrapper">
//             <img 
//               src={getImageUrl(content.mainImage)}
//               alt={content.title || "Spacious living"}
//             />
//           </div>
//         )}

//         <div className="spacious-bottom-overlay-row">
//           {currentProperty && (
//             <div className="spacious-card-box">
//               <div className="spacious-card-inner">
//                 <div className="spacious-card-img">
//                   {currentProperty.mainImage || currentProperty.image ? (
//                     <img onClick={() =>
//   navigate(
//     `/property-details?id=${
//       currentProperty._id ||
//       currentProperty.id
//     }&type=spacious`
//   )
// }
//                       src={getImageUrl(
//                         currentProperty.mainImage ||
//                           currentProperty.image
//                       )}
//                       alt={
//                         currentProperty.title || "Property"
//                       }
//                     />
//                   ) : (
//                     <div className="spacious-no-image">
//                       No image
//                     </div>
//                   )}

//                   <span className="spacious-tag-new">Now</span>

//                   <div className="spacious-property-actions">
//                     {/* WISHLIST BUTTON */}
//                     <button
//                       type="button"
//                       title="Wishlist"
//                       aria-label="Wishlist"
//                       className={
//                         propertyWishlisted
//                           ? "spacious-property-action active"
//                           : "spacious-property-action"
//                       }
//                       onClick={() =>
//                         handleWishlist(currentProperty)
//                       }
//                     >
//                       {propertyWishlisted ? "♥" : "♡"}
//                     </button>

//                     {/* COMPARE BUTTON */}
//                     <button
//                       type="button"
//                       title="Compare"
//                       aria-label="Compare"
//                       className={
//                         propertyCompared
//                           ? "spacious-property-action active"
//                           : "spacious-property-action"
//                       }
//                       onClick={() =>
//                         handleCompare(currentProperty)
//                       }
//                     >
//                       ⇄
//                     </button>

//                     {/* QUICK VIEW BUTTON */}
//                     <button
//                       type="button"
//                       title="Quick View"
//                       aria-label="Quick View"
//                       className="spacious-property-action"
//                       onClick={() =>
//                         openQuickView(currentProperty)
//                       }
//                     >
//                       👁
//                     </button>
//                   </div>
//                 </div>

//                 <div className="spacious-card-info">
//                   {currentProperty.category && (
//                     <div className="spacious-card-cat">
//                       <span>◎</span>
//                       <span>{currentProperty.category}</span>
//                     </div>
//                   )}

//                   {currentProperty.title && (
//                     <h3>{currentProperty.title}</h3>
//                   )}

//                   {(
//                     currentProperty.size ||
//                     (Array.isArray(currentProperty.sizes) &&
//                       currentProperty.sizes.length > 0)
//                   ) ? (
//                     <div className="spacious-select-wrap">
//                       <select
//                         value={currentProperty.size || ""}
//                         onChange={() => {}}
//                         aria-label="Property size"
//                       >
//                         {currentProperty.size && (
//                           <option value={currentProperty.size}>
//                             {currentProperty.size}
//                           </option>
//                         )}

//                         {(currentProperty.sizes || [])
//                           .filter(
//                             (size) =>
//                               size &&
//                               size !== currentProperty.size
//                           )
//                           .map((size, index) => (
//                             <option
//                               key={`${size}-${index}`}
//                               value={size}
//                             >
//                               {size}
//                             </option>
//                           ))}
//                       </select>
//                     </div>
//                   ) : null}

//                   {(currentProperty.price ||
//                     currentProperty.oldPrice) && (
//                     <div className="spacious-price-row">
//                       {currentProperty.price && (
//                         <strong>
//                           {currentProperty.price}
//                         </strong>
//                       )}

//                       {currentProperty.oldPrice && (
//                         <del>
//                           {currentProperty.oldPrice}
//                         </del>
//                       )}
//                     </div>
//                   )}

//                   {/* ADD TO CART BUTTON */}
//                   <button
//                     type="button"
//                     className="spacious-add-cart-btn"
//                     onClick={async () => {
//                       const result = await addToCart(currentProperty);
//                       if (result?.success) {
//                         alert("Added to cart");
//                       }
//                     }}
//                   >
//                     Add to Cart →
//                   </button>
//                 </div>
//               </div>

//               {slides.length > 1 && (
//                 <div className="spacious-slider-arrows-row">
//                   <button
//                     type="button"
//                     onClick={prevSlide}
//                     aria-label="Previous property"
//                   >
//                     ←
//                   </button>

//                   <div className="spacious-line-divider"></div>

//                   <button
//                     type="button"
//                     onClick={nextSlide}
//                     aria-label="Next property"
//                   >
//                     →
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}

//           {content.bottomDescription && (
//             <div className="spacious-side-desc">
//               <p>{content.bottomDescription}</p>
//             </div>
//           )}
//         </div>
//       </section>

//       {quickView && (
//         <div
//           className="spacious-quick-view-overlay"
//           onClick={closeQuickView}
//         >
//           <div
//             className="spacious-quick-view-modal"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               type="button"
//               className="spacious-quick-view-close"
//               onClick={closeQuickView}
//               aria-label="Close"
//             >
//               ×
//             </button>

//             <div className="spacious-quick-view-layout">
//               <div className="spacious-quick-view-gallery">
//                 <div className="spacious-quick-view-main-image">
//                   {modalImages.length > 0 ? (
//                     <img
//                       src={getImageUrl(
//                         modalImages[modalImageIndex]
//                       )}
//                       alt={quickView.title || "Property"}
//                     />
//                   ) : (
//                     <div className="spacious-quick-view-no-image">
//                       No image available
//                     </div>
//                   )}

//                   {modalImages.length > 1 && (
//                     <>
//                       <button
//                         type="button"
//                         className="spacious-quick-view-image-arrow left"
//                         onClick={modalPrevImage}
//                         aria-label="Previous image"
//                       >
//                         ‹
//                       </button>
//                       <button
//                         type="button"
//                         className="spacious-quick-view-image-arrow right"
//                         onClick={modalNextImage}
//                         aria-label="Next image"
//                       >
//                         ›
//                       </button>
//                     </>
//                   )}
//                 </div>

//                 {modalImages.length > 0 && (
//                   <div className="spacious-quick-view-thumbnails">
//                     {modalImages.map((image, index) => (
//                       <button
//                         type="button"
//                         key={`${image}-${index}`}
//                         className={
//                           index === modalImageIndex
//                             ? "spacious-quick-view-thumbnail active"
//                             : "spacious-quick-view-thumbnail"
//                         }
//                         onClick={() => setModalImageIndex(index)}
//                       >
//                         <img
//                           src={getImageUrl(image)}
//                           alt={`View ${index + 1}`}
//                         />
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <div className="spacious-quick-view-info">
//                 {quickView.category && (
//                   <div className="spacious-quick-view-category">
//                     <span>◎</span>
//                     <span>{quickView.category}</span>
//                   </div>
//                 )}

//                 <h2>{quickView.title || "Property"}</h2>

//                 <p className="spacious-quick-view-description">
//                   {quickView.description ||
//                     "Beautiful modern property designed for comfortable and spacious living."}
//                 </p>

//                 {(quickView.size ||
//                   (Array.isArray(quickView.sizes) &&
//                     quickView.sizes.length > 0)) && (
//                   <div className="spacious-quick-view-size-area">
//                     <p>
//                       <strong>Size:</strong>{" "}
//                       {selectedSize ||
//                         quickView.size ||
//                         quickView.sizes?.[0]}
//                     </p>

//                     {Array.isArray(quickView.sizes) &&
//                       quickView.sizes.length > 0 && (
//                         <div className="spacious-quick-view-sizes">
//                           {quickView.sizes.map((size, index) => (
//                             <button
//                               type="button"
//                               key={`${size}-${index}`}
//                               className={
//                                 selectedSize === size
//                                   ? "spacious-size-chip selected"
//                                   : "spacious-size-chip"
//                               }
//                               onClick={() => setSelectedSize(size)}
//                             >
//                               {size}
//                             </button>
//                           ))}
//                         </div>
//                       )}
//                   </div>
//                 )}

//                 {(quickView.price || quickView.oldPrice) && (
//                   <div className="spacious-quick-view-price">
//                     {quickView.price && (
//                       <strong>{quickView.price}</strong>
//                     )}
//                     {quickView.oldPrice && (
//                       <del>{quickView.oldPrice}</del>
//                     )}
//                   </div>
//                 )}

//                 <div className="spacious-quick-view-cart-row">
//                   <button
//                     type="button"
//                     className="spacious-quick-view-cart"
//                     onClick={async () => {
//                       const result = await addToCart({
//                         ...quickView,
//                         size: selectedSize || quickView.size,
//                         quantity: quantity,
//                       });

//                       if (result?.success) {
//                         alert("Added to cart");
//                         closeQuickView();
//                       }
//                     }}
//                   >
//                     Add to Cart 🛒
//                   </button>

//                   <div className="spacious-quantity-control">
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setQuantity((previous) =>
//                           previous > 1 ? previous - 1 : 1
//                         )
//                       }
//                       aria-label="Decrease quantity"
//                     >
//                       −
//                     </button>

//                     <span>{quantity}</span>

//                     <button
//                       type="button"
//                       onClick={() =>
//                         setQuantity((previous) => previous + 1)
//                       }
//                       aria-label="Increase quantity"
//                     >
//                       +
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default SpaciousLiving;








import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SpaciousLiving.css";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { useCompare } from "../../context/CompareContext";

const API_URL = "http://localhost:5000/api/spacious-living";
const SERVER_URL = "http://localhost:5000";

const getImageUrl = (image) => {
  if (!image) return "";
  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:")
  ) {
    return image;
  }
  return image.startsWith("/uploads/")
    ? `${SERVER_URL}${image}`
    : `${SERVER_URL}/${image.startsWith("/") ? "" : "/"}${image}`;
};

const getPropertyId = (property) =>
  String(property?._id || property?.id || property?.title || "");

const SpaciousLiving = () => {
  const navigate = useNavigate();

  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addToCart } = useCart();
  const { addToCompare, isCompared } = useCompare();

  const [content, setContent] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  const [quickView, setQuickView] = useState(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch Spacious Living");
      }

      const result = await response.json();
      const data = result?.success ? result.data : result;

      if (data && typeof data === "object") {
        setContent({
          title: data.title || "",
          topDescription: data.topDescription || "",
          mainImage: data.mainImage || "",
          bottomDescription: data.bottomDescription || "",
          sliderProperties: Array.isArray(data.sliderProperties)
            ? data.sliderProperties
            : [],
        });
      } else {
        setContent(null);
      }
    } catch (error) {
      console.error("Spacious Living API Error:", error);
      setContent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const slides = useMemo(
    () =>
      Array.isArray(content?.sliderProperties)
        ? content.sliderProperties
        : [],
    [content]
  );

  useEffect(() => {
    if (slides.length === 0) {
      setCurrentSlide(0);
    } else if (currentSlide >= slides.length) {
      setCurrentSlide(0);
    }
  }, [slides.length, currentSlide]);

  const currentProperty =
    slides.length > 0 ? slides[currentSlide] : null;

  const nextSlide = () => {
    if (slides.length <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    if (slides.length <= 1) return;
    setCurrentSlide(
      (prev) => (prev - 1 + slides.length) % slides.length
    );
  };

  const handleWishlist = async (property) => {
    await toggleWishlist({
      ...property,
      wishlistType: "spacious",
    });
  };

  const handleCompare = async (property) => {
    try {
      await addToCompare(property);
      navigate("/compare");
    } catch (error) {
      console.error("Compare error:", error);
      navigate("/compare");
    }
  };

  const openQuickView = (property) => {
    const propertyId = getPropertyId(property);

    const mongoProperty =
      slides.find(
        (item) => getPropertyId(item) === propertyId
      ) || property;

    setQuickView(mongoProperty);
    setModalImageIndex(0);
    setQuantity(1);
    setSelectedSize(
      mongoProperty.sizes?.[0] ||
        mongoProperty.size ||
        ""
    );

    document.body.style.overflow = "hidden";
  };

  const closeQuickView = () => {
    setQuickView(null);
    setModalImageIndex(0);
    document.body.style.overflow = "";
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const modalImages = quickView
    ? [
        ...(quickView.mainImage
          ? [quickView.mainImage]
          : quickView.image
          ? [quickView.image]
          : []),
        ...(Array.isArray(quickView.subImages)
          ? quickView.subImages.slice(0, 3).filter(Boolean)
          : []),
      ]
    : [];

  const modalNextImage = () => {
    if (modalImages.length <= 1) return;
    setModalImageIndex(
      (prev) => (prev + 1) % modalImages.length
    );
  };

  const modalPrevImage = () => {
    if (modalImages.length <= 1) return;
    setModalImageIndex(
      (prev) =>
        (prev - 1 + modalImages.length) % modalImages.length
    );
  };

  if (loading || !content) return null;

  const hasContent =
    Boolean(content.title) ||
    Boolean(content.topDescription) ||
    Boolean(content.mainImage) ||
    Boolean(content.bottomDescription) ||
    slides.length > 0;

  if (!hasContent) return null;

  const propertyWishlisted = currentProperty
    ? isWishlisted({
        ...currentProperty,
        wishlistType: "spacious",
      })
    : false;

  const propertyCompared = currentProperty
    ? isCompared(currentProperty)
    : false;

  return (
    <>
      <section className="spacious-living-section">
        <div className="spacious-header-container">
          <div className="spacious-title-area">
            {content.title && <h2>{content.title}</h2>}
          </div>

          <div className="spacious-text-area">
            {content.topDescription && (
              <p>{content.topDescription}</p>
            )}
          </div>
        </div>

        {content.mainImage && (
          <div className="spacious-hero-image-wrapper">
            <img 
              src={getImageUrl(content.mainImage)}
              alt={content.title || "Spacious living"}
            />
          </div>
        )}

        <div className="spacious-bottom-overlay-row">
          {currentProperty && (
            <div className="spacious-card-box">
              <div className="spacious-card-inner">
                <div className="spacious-card-img">
                  {currentProperty.mainImage || currentProperty.image ? (
                    <img onClick={() =>
  navigate(
    `/property-details?id=${
      currentProperty._id ||
      currentProperty.id
    }&type=spacious`
  )
}
                      src={getImageUrl(
                        currentProperty.mainImage ||
                          currentProperty.image
                      )}
                      alt={
                        currentProperty.title || "Property"
                      }
                    />
                  ) : (
                    <div className="spacious-no-image">
                      No image
                    </div>
                  )}

                  <span className="spacious-tag-new">Now</span>

                  <div className="spacious-property-actions">
                    {/* WISHLIST BUTTON */}
                    <button
                      type="button"
                      title="Wishlist"
                      aria-label="Wishlist"
                      className={
                        propertyWishlisted
                          ? "spacious-property-action active"
                          : "spacious-property-action"
                      }
                      onClick={() =>
                        handleWishlist(currentProperty)
                      }
                    >
                      {propertyWishlisted ? "♥" : "♡"}
                    </button>

                    {/* COMPARE BUTTON */}
                    <button
                      type="button"
                      title="Compare"
                      aria-label="Compare"
                      className={
                        propertyCompared
                          ? "spacious-property-action active"
                          : "spacious-property-action"
                      }
                      onClick={() =>
                        handleCompare(currentProperty)
                      }
                    >
                      ⇄
                    </button>

                    {/* QUICK VIEW BUTTON */}
                    <button
                      type="button"
                      title="Quick View"
                      aria-label="Quick View"
                      className="spacious-property-action"
                      onClick={() =>
                        openQuickView(currentProperty)
                      }
                    >
                      👁
                    </button>
                  </div>
                </div>

                <div className="spacious-card-info">
                  {currentProperty.category && (
                    <div className="spacious-card-cat">
                      <span>◎</span>
                      <span>{currentProperty.category}</span>
                    </div>
                  )}

                  {currentProperty.title && (
                    <h3>{currentProperty.title}</h3>
                  )}

                  {(
                    currentProperty.size ||
                    (Array.isArray(currentProperty.sizes) &&
                      currentProperty.sizes.length > 0)
                  ) ? (
                    <div className="spacious-select-wrap">
                      <select
                        value={currentProperty.size || ""}
                        onChange={() => {}}
                        aria-label="Property size"
                      >
                        {currentProperty.size && (
                          <option value={currentProperty.size}>
                            {currentProperty.size}
                          </option>
                        )}

                        {(currentProperty.sizes || [])
                          .filter(
                            (size) =>
                              size &&
                              size !== currentProperty.size
                          )
                          .map((size, index) => (
                            <option
                              key={`${size}-${index}`}
                              value={size}
                            >
                              {size}
                            </option>
                          ))}
                      </select>
                    </div>
                  ) : null}

                  {(currentProperty.price ||
                    currentProperty.oldPrice) && (
                    <div className="spacious-price-row">
                      {currentProperty.price && (
                        <strong>
                          {currentProperty.price}
                        </strong>
                      )}

                      {currentProperty.oldPrice && (
                        <del>
                          {currentProperty.oldPrice}
                        </del>
                      )}
                    </div>
                  )}

                  {/* ADD TO CART BUTTON */}
                  <button
                    type="button"
                    className="spacious-add-cart-btn"
                    onClick={async () => {
                      const result = await addToCart({
                        ...currentProperty,
                        productId: getPropertyId(currentProperty),
                        productType: "spacious",
                      });
                      if (result?.success) {
                        alert("Added to cart");
                      }
                    }}
                  >
                    Add to Cart →
                  </button>
                </div>
              </div>

              {slides.length > 1 && (
                <div className="spacious-slider-arrows-row">
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Previous property"
                  >
                    ←
                  </button>

                  <div className="spacious-line-divider"></div>

                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next property"
                  >
                    →
                  </button>
                </div>
              )}
            </div>
          )}

          {content.bottomDescription && (
            <div className="spacious-side-desc">
              <p>{content.bottomDescription}</p>
            </div>
          )}
        </div>
      </section>

      {quickView && (
        <div
          className="spacious-quick-view-overlay"
          onClick={closeQuickView}
        >
          <div
            className="spacious-quick-view-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="spacious-quick-view-close"
              onClick={closeQuickView}
              aria-label="Close"
            >
              ×
            </button>

            <div className="spacious-quick-view-layout">
              <div className="spacious-quick-view-gallery">
                <div className="spacious-quick-view-main-image">
                  {modalImages.length > 0 ? (
                    <img
                      src={getImageUrl(
                        modalImages[modalImageIndex]
                      )}
                      alt={quickView.title || "Property"}
                    />
                  ) : (
                    <div className="spacious-quick-view-no-image">
                      No image available
                    </div>
                  )}

                  {modalImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        className="spacious-quick-view-image-arrow left"
                        onClick={modalPrevImage}
                        aria-label="Previous image"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        className="spacious-quick-view-image-arrow right"
                        onClick={modalNextImage}
                        aria-label="Next image"
                      >
                        ›
                      </button>
                    </>
                  )}
                </div>

                {modalImages.length > 0 && (
                  <div className="spacious-quick-view-thumbnails">
                    {modalImages.map((image, index) => (
                      <button
                        type="button"
                        key={`${image}-${index}`}
                        className={
                          index === modalImageIndex
                            ? "spacious-quick-view-thumbnail active"
                            : "spacious-quick-view-thumbnail"
                        }
                        onClick={() => setModalImageIndex(index)}
                      >
                        <img
                          src={getImageUrl(image)}
                          alt={`View ${index + 1}`}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="spacious-quick-view-info">
                {quickView.category && (
                  <div className="spacious-quick-view-category">
                    <span>◎</span>
                    <span>{quickView.category}</span>
                  </div>
                )}

                <h2>{quickView.title || "Property"}</h2>

                <p className="spacious-quick-view-description">
                  {quickView.description ||
                    "Beautiful modern property designed for comfortable and spacious living."}
                </p>

                {(quickView.size ||
                  (Array.isArray(quickView.sizes) &&
                    quickView.sizes.length > 0)) && (
                  <div className="spacious-quick-view-size-area">
                    <p>
                      <strong>Size:</strong>{" "}
                      {selectedSize ||
                        quickView.size ||
                        quickView.sizes?.[0]}
                    </p>

                    {Array.isArray(quickView.sizes) &&
                      quickView.sizes.length > 0 && (
                        <div className="spacious-quick-view-sizes">
                          {quickView.sizes.map((size, index) => (
                            <button
                              type="button"
                              key={`${size}-${index}`}
                              className={
                                selectedSize === size
                                  ? "spacious-size-chip selected"
                                  : "spacious-size-chip"
                              }
                              onClick={() => setSelectedSize(size)}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                )}

                {(quickView.price || quickView.oldPrice) && (
                  <div className="spacious-quick-view-price">
                    {quickView.price && (
                      <strong>{quickView.price}</strong>
                    )}
                    {quickView.oldPrice && (
                      <del>{quickView.oldPrice}</del>
                    )}
                  </div>
                )}

                <div className="spacious-quick-view-cart-row">
                  <button
                    type="button"
                    className="spacious-quick-view-cart"
                    onClick={async () => {
                      const result = await addToCart({
                        ...quickView,
                        productId: getPropertyId(quickView),
                        productType: "spacious",
                        size: selectedSize || quickView.size,
                        quantity: quantity,
                      });

                      if (result?.success) {
                        alert("Added to cart");
                        closeQuickView();
                      }
                    }}
                  >
                    Add to Cart 🛒
                  </button>

                  <div className="spacious-quantity-control">
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((previous) =>
                          previous > 1 ? previous - 1 : 1
                        )
                      }
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>

                    <span>{quantity}</span>

                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((previous) => previous + 1)
                      }
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SpaciousLiving;