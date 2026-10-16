

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./PenthouseProperties.css";
// import { useWishlist } from "../../context/WishlistContext";
// import { useCart } from "../../context/CartContext";

// const API_URL = "http://localhost:5000/api/penthouse-properties";
// const IMAGE_URL = "http://localhost:5000";

// const PenthouseProperties = () => {
//   const navigate = useNavigate();

//   const { toggleWishlist, isWishlisted } = useWishlist();
//   const { addToCart } = useCart();

//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [currentSlide, setCurrentSlide] = useState(0);

//   const [quickView, setQuickView] = useState(null);
//   const [quickViewImage, setQuickViewImage] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [selectedSize, setSelectedSize] = useState("");

//   const [leftImage, setLeftImage] = useState(
//     () =>
//       localStorage.getItem("penthouseLeftImage") ||
//       "/images/feature-house1.jpg"
//   );

//   // ==========================================
//   // IMAGE URL HELPER
//   // ==========================================
//   const getImageUrl = (image) => {
//     if (!image) return "";
//     if (typeof image !== "string") return "";
//     image = image.trim();
//     if (!image) return "";

//     if (image.startsWith("http://") || image.startsWith("https://")) {
//       return image;
//     }

//     return image.startsWith("/")
//       ? `${IMAGE_URL}${image}`
//       : `${IMAGE_URL}/${image}`;
//   };

//   // ==========================================
//   // FETCH PROPERTIES FROM API
//   // ==========================================
//   useEffect(() => {
//     const fetchProperties = async () => {
//       try {
//         setLoading(true);

//         const response = await fetch(API_URL);
//         const result = await response.json();

//         if (!response.ok) {
//           throw new Error(
//             result?.message || "Failed to fetch penthouse properties"
//           );
//         }

//         const data = Array.isArray(result)
//           ? result
//           : Array.isArray(result?.properties)
//           ? result.properties
//           : Array.isArray(result?.data)
//           ? result.data
//           : [];

//         setProperties(data);
//       } catch (error) {
//         console.error("Penthouse Properties API Error:", error);
//         setProperties([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProperties();
//   }, []);

//   // ==========================================
//   // LEFT IMAGE (site setting, stays in localStorage)
//   // ==========================================
//   useEffect(() => {
//     const loadLeftImage = () => {
//       const savedImage = localStorage.getItem("penthouseLeftImage");
//       setLeftImage(savedImage || "/images/feature-house1.jpg");
//     };

//     loadLeftImage();
//     window.addEventListener("storage", loadLeftImage);

//     return () => window.removeEventListener("storage", loadLeftImage);
//   }, []);

//   const [showSecondCard, setShowSecondCard] = useState(() => {
//     if (typeof window === "undefined") return false;
//     const width = window.innerWidth;
//     return (width >= 601 && width <= 850) || width >= 1800;
//   });

//   useEffect(() => {
//     const handleResize = () => {
//       const width = window.innerWidth;
//       setShowSecondCard(
//         (width >= 601 && width <= 850) || width >= 1800
//       );
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);

//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const nextSlide = () => {
//     if (!properties.length) return;
//     setCurrentSlide((prev) => (prev + 1) % properties.length);
//   };

//   const prevSlide = () => {
//     if (!properties.length) return;
//     setCurrentSlide(
//       (prev) => (prev - 1 + properties.length) % properties.length
//     );
//   };

//   const handleCompare = (property) => {
//     const saved =
//       JSON.parse(localStorage.getItem("compareProducts")) || [];

//     const alreadyExists = saved.some(
//       (item) => String(item._id || item.id) === String(property._id || property.id)
//     );

//     if (!alreadyExists) {
//       localStorage.setItem(
//         "compareProducts",
//         JSON.stringify([...saved, property])
//       );
//     }

//     navigate("/compare");
//   };

//   const openQuickView = (property) => {
//     setQuickView(property);
//     setQuickViewImage(0);
//     setQuantity(1);
//     setSelectedSize(property.size || property.sizes?.[0] || "");
//   };

//   const closeQuickView = () => {
//     setQuickView(null);
//   };

//   const modalImages = quickView
//     ? quickView.images?.length > 0
//       ? quickView.images.map(getImageUrl)
//       : quickView.image
//       ? [getImageUrl(quickView.image)]
//       : []
//     : [];

//   const nextQuickViewImage = () => {
//     if (!modalImages.length) return;
//     setQuickViewImage((prev) => (prev + 1) % modalImages.length);
//   };

//   const prevQuickViewImage = () => {
//     if (!modalImages.length) return;
//     setQuickViewImage(
//       (prev) => (prev - 1 + modalImages.length) % modalImages.length
//     );
//   };

//   const increaseQuantity = () => setQuantity((prev) => prev + 1);
//   const decreaseQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

//   const firstProperty = properties[currentSlide];
//   const secondProperty = properties.length
//     ? properties[(currentSlide + 1) % properties.length]
//     : null;

//   if (loading) {
//     return (
//       <section className="penthouse-section">
//         <div className="penthouse-wrapper">
//           <p style={{ padding: "40px" }}>Loading penthouse properties...</p>
//         </div>
//       </section>
//     );
//   }

//   if (!properties.length) {
//     return (
//       <section className="penthouse-section">
//         <div className="penthouse-wrapper">
//           <p style={{ padding: "40px" }}>
//             No penthouse properties available right now.
//           </p>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <>
//       <section className="penthouse-section">
//         <div className="penthouse-wrapper">

//           {/* LEFT IMAGE - FIXED WITH getImageUrl */}
//           <div className="penthouse-main-image">
//             <img 
//               src={getImageUrl(leftImage)}
//               alt="Penthouse interior"
//               onError={(e) => {
//                 // Fallback if image fails to load
//                 e.target.src = "/images/feature-house1.jpg";
//               }}
//             />

//             <button
//               className="penthouse-plus"
//               type="button"
//             >
//               +
//             </button>
//           </div>

//           {/* RIGHT CONTENT */}
//           <div className="penthouse-content">
//             <p className="penthouse-description">
//               Elevate your living experience to new heights in
//               our exclusive penthouse apartments. Perched atop
//               towering skyscrapers, these magnificent residences
//               offer unparalleled panoramic views that stretch as
//               far as the eye can see.
//             </p>

//             <div className="penthouse-cards">
//               <PropertyCard
//                 property={firstProperty}
//                 isWishlisted={isWishlisted}
//                 toggleWishlist={toggleWishlist}
//                 handleCompare={handleCompare}
//                 openQuickView={openQuickView}
//                 addToCart={addToCart}
//                 getImageUrl={getImageUrl}
//                 navigate={navigate}
//               />

//               {showSecondCard && secondProperty && (
//                 <PropertyCard
//                   property={secondProperty}
//                   isWishlisted={isWishlisted}
//                   toggleWishlist={toggleWishlist}
//                   handleCompare={handleCompare}
//                   openQuickView={openQuickView}
//                   addToCart={addToCart}
//                   getImageUrl={getImageUrl}
//                 />
//               )}
//             </div>

//             {/* SLIDER CONTROLS */}
//             <div className="penthouse-controls">
//               <button
//                 type="button"
//                 className="penthouse-arrow"
//                 onClick={prevSlide}
//                 aria-label="Previous property"
//               >
//                 ←
//               </button>

//               <div className="penthouse-line"></div>

//               <button
//                 type="button"
//                 className="penthouse-arrow"
//                 onClick={nextSlide}
//                 aria-label="Next property"
//               >
//                 →
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ================= QUICK VIEW POPUP ================= */}
//       {quickView && (
//         <div className="penthouse-modal-overlay" onClick={closeQuickView}>
//           <div className="penthouse-modal" onClick={(e) => e.stopPropagation()}>
//             <button
//               type="button"
//               className="penthouse-modal-close"
//               onClick={closeQuickView}
//               aria-label="Close"
//             >
//               ×
//             </button>

//             <div className="penthouse-modal-gallery">
//               <div className="penthouse-modal-main-image">
//                 <img 
//                   src={
//                     modalImages[quickViewImage] ||
//                     getImageUrl(quickView.image)
//                   }
//                   alt={quickView.title}
//                 />

//                 {modalImages.length > 1 && (
//                   <>
//                     <button
//                       type="button"
//                       className="penthouse-modal-image-arrow left"
//                       onClick={prevQuickViewImage}
//                       aria-label="Previous image"
//                     >
//                       ‹
//                     </button>
//                     <button
//                       type="button"
//                       className="penthouse-modal-image-arrow right"
//                       onClick={nextQuickViewImage}
//                       aria-label="Next image"
//                     >
//                       ›
//                     </button>
//                   </>
//                 )}
//               </div>

//               {modalImages.length > 0 && (
//                 <div className="penthouse-modal-thumbnails">
//                   {modalImages.map((image, index) => (
//                     <button
//                       key={image + index}
//                       type="button"
//                       className={`penthouse-modal-thumbnail ${
//                         quickViewImage === index ? "active" : ""
//                       }`}
//                       onClick={() => setQuickViewImage(index)}
//                     >
//                       <img src={image} alt={`${quickView.title} ${index + 1}`} />
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="penthouse-modal-details">
//               <span className="penthouse-modal-category">
//                 {quickView.category || "Penthouse"}
//               </span>

//               <h2>{quickView.title}</h2>

//               <p className="penthouse-modal-description">
//                 {quickView.description || "Experience the epitome of luxury and comfortable living with this exclusive penthouse property."}
//               </p>

//               <div className="penthouse-modal-size-section">
//                 <div className="penthouse-modal-size-title">
//                   <strong>Size:</strong> {selectedSize}
//                 </div>

//                 <div className="penthouse-size-options">
//                   {(quickView.sizes || [quickView.size]).map((size) => (
//                     <button
//                       type="button"
//                       key={size}
//                       className={selectedSize === size ? "selected" : ""}
//                       onClick={() => setSelectedSize(size)}
//                     >
//                       {size}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className="penthouse-modal-price">
//                 <strong>{quickView.price}</strong>
//                 {quickView.oldPrice && <del>{quickView.oldPrice}</del>}
//               </div>

//               <div className="penthouse-modal-cart-row">
//                 <button
//                   type="button"
//                   className="penthouse-modal-cart"
//                   onClick={async () => {
//                     const result = await addToCart({
//                       ...quickView,
//                       size: selectedSize || quickView.size,
//                       quantity: quantity
//                     });

//                     if (result?.success) {
//                       alert("Added to cart");
//                       closeQuickView();
//                     }
//                   }}
//                 >
//                   Add to Cart 🛒
//                 </button>

//                 <div className="penthouse-quantity">
//                   <button type="button" onClick={decreaseQuantity}>−</button>
//                   <span>{quantity}</span>
//                   <button type="button" onClick={increaseQuantity}>+</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// /* ================= PROPERTY CARD ================= */
// const PropertyCard = ({
//   property,
//   isWishlisted,
//   toggleWishlist,
//   handleCompare,
//   openQuickView,
//   addToCart,
//   getImageUrl,
//   navigate
// }) => {
//   const propertyWishlisted = isWishlisted({
//     ...property,
//     wishlistType: "penthouse",
//   });

//   const cardImage = getImageUrl(property.image);

//   return (
//     <article className="penthouse-card">
//       <div className="penthouse-card-image">
//         {/* <img src={cardImage} alt={property.title} /> */}
//                 {/* <img src={property.image} alt={property.title} /> */}
//                 <img
//   src={property.image}
//   alt={property.title}
//   onClick={() =>
//     navigate(
//       `/property-details?id=${
//         property._id || property.id
//       }&type=penthouse`
//     )
//   }
// />


//         <div className="penthouse-actions">
//           <button
//             type="button"
//             className={propertyWishlisted ? "wishlist-active" : ""}
//             onClick={() =>
//               toggleWishlist({
//                 ...property,
//                 wishlistType: "penthouse",
//               })
//             }
//             aria-label="Wishlist"
//           >
//             {propertyWishlisted ? "♥" : "♡"}
//           </button>

//           <button
//             type="button"
//             onClick={() => handleCompare(property)}
//             aria-label="Compare"
//           >
//             ⇄
//           </button>

//           <button
//             type="button"
//             onClick={() => openQuickView(property)}
//             aria-label="Quick view"
//           >
//             ◉
//           </button>
//         </div>

//         <span className="penthouse-new">New</span>
//       </div>

//       <div className="penthouse-card-info">
//         <div className="penthouse-category">
//           <span>◎</span>
//           <span>{property.category || "Penthouse"}</span>
//         </div>

//         <h3>{property.title}</h3>

//         <select className="penthouse-size" defaultValue={property.size}>
//           {(property.sizes?.length ? property.sizes : [property.size]).map(
//             (size) => (
//               <option key={size} value={size}>
//                 {size}
//               </option>
//             )
//           )}
//         </select>

//         <div className="penthouse-price">
//           <strong>{property.price}</strong>
//           {property.oldPrice && <del>{property.oldPrice}</del>}
//         </div>

//         <button
//           type="button"
//           className="penthouse-cart"
//           onClick={async () => {
//             const result = await addToCart(property);
//             if (result?.success) {
//               alert("Added to cart");
//             }
//           }}
//         >
//           Add to Cart →
//         </button>
//       </div>
//     </article>
//   );
// };

// export default PenthouseProperties;





import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PenthouseProperties.css";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

const API_URL = "http://localhost:5000/api/penthouse-properties";
const IMAGE_URL = "http://localhost:5000";

const PenthouseProperties = () => {
  const navigate = useNavigate();

  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addToCart } = useCart();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentSlide, setCurrentSlide] = useState(0);

  const [quickView, setQuickView] = useState(null);
  const [quickViewImage, setQuickViewImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");

  const [leftImage, setLeftImage] = useState(
    () =>
      localStorage.getItem("penthouseLeftImage") ||
      "/images/feature-house1.jpg"
  );

  // ==========================================
  // IMAGE URL HELPER
  // ==========================================
  const getImageUrl = (image) => {
    if (!image) return "";
    if (typeof image !== "string") return "";
    image = image.trim();
    if (!image) return "";

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    return image.startsWith("/")
      ? `${IMAGE_URL}${image}`
      : `${IMAGE_URL}/${image}`;
  };

  // ==========================================
  // FETCH PROPERTIES FROM API
  // ==========================================
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);

        const response = await fetch(API_URL);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message || "Failed to fetch penthouse properties"
          );
        }

        const data = Array.isArray(result)
          ? result
          : Array.isArray(result?.properties)
          ? result.properties
          : Array.isArray(result?.data)
          ? result.data
          : [];

        setProperties(data);
      } catch (error) {
        console.error("Penthouse Properties API Error:", error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // ==========================================
  // LEFT IMAGE (site setting, stays in localStorage)
  // ==========================================
  useEffect(() => {
    const loadLeftImage = () => {
      const savedImage = localStorage.getItem("penthouseLeftImage");
      setLeftImage(savedImage || "/images/feature-house1.jpg");
    };

    loadLeftImage();
    window.addEventListener("storage", loadLeftImage);

    return () => window.removeEventListener("storage", loadLeftImage);
  }, []);

  const [showSecondCard, setShowSecondCard] = useState(() => {
    if (typeof window === "undefined") return false;
    const width = window.innerWidth;
    return (width >= 601 && width <= 850) || width >= 1800;
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setShowSecondCard(
        (width >= 601 && width <= 850) || width >= 1800
      );
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    if (!properties.length) return;
    setCurrentSlide((prev) => (prev + 1) % properties.length);
  };

  const prevSlide = () => {
    if (!properties.length) return;
    setCurrentSlide(
      (prev) => (prev - 1 + properties.length) % properties.length
    );
  };

  const handleCompare = (property) => {
    const saved =
      JSON.parse(localStorage.getItem("compareProducts")) || [];

    const alreadyExists = saved.some(
      (item) => String(item._id || item.id) === String(property._id || property.id)
    );

    if (!alreadyExists) {
      localStorage.setItem(
        "compareProducts",
        JSON.stringify([...saved, property])
      );
    }

    navigate("/compare");
  };

  const openQuickView = (property) => {
    setQuickView(property);
    setQuickViewImage(0);
    setQuantity(1);
    setSelectedSize(property.size || property.sizes?.[0] || "");
  };

  const closeQuickView = () => {
    setQuickView(null);
  };

  const modalImages = quickView
    ? quickView.images?.length > 0
      ? quickView.images.map(getImageUrl)
      : quickView.image
      ? [getImageUrl(quickView.image)]
      : []
    : [];

  const nextQuickViewImage = () => {
    if (!modalImages.length) return;
    setQuickViewImage((prev) => (prev + 1) % modalImages.length);
  };

  const prevQuickViewImage = () => {
    if (!modalImages.length) return;
    setQuickViewImage(
      (prev) => (prev - 1 + modalImages.length) % modalImages.length
    );
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  const firstProperty = properties[currentSlide];
  const secondProperty = properties.length
    ? properties[(currentSlide + 1) % properties.length]
    : null;

  if (loading) {
    return (
      <section className="penthouse-section">
        <div className="penthouse-wrapper">
          <p style={{ padding: "40px" }}>Loading penthouse properties...</p>
        </div>
      </section>
    );
  }

  if (!properties.length) {
    return (
      <section className="penthouse-section">
        <div className="penthouse-wrapper">
          <p style={{ padding: "40px" }}>
            No penthouse properties available right now.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="penthouse-section">
        <div className="penthouse-wrapper">

          {/* LEFT IMAGE - FIXED WITH getImageUrl */}
          <div className="penthouse-main-image">
            <img 
              src={getImageUrl(leftImage)}
              alt="Penthouse interior"
              onError={(e) => {
                // Fallback if image fails to load
                e.target.src = "/images/feature-house1.jpg";
              }}
            />

            <button
              className="penthouse-plus"
              type="button"
            >
              +
            </button>
          </div>

          {/* RIGHT CONTENT */}
          <div className="penthouse-content">
            <p className="penthouse-description">
              Elevate your living experience to new heights in
              our exclusive penthouse apartments. Perched atop
              towering skyscrapers, these magnificent residences
              offer unparalleled panoramic views that stretch as
              far as the eye can see.
            </p>

            <div className="penthouse-cards">
              <PropertyCard
                property={firstProperty}
                isWishlisted={isWishlisted}
                toggleWishlist={toggleWishlist}
                handleCompare={handleCompare}
                openQuickView={openQuickView}
                addToCart={addToCart}
                getImageUrl={getImageUrl}
                navigate={navigate}
              />

              {showSecondCard && secondProperty && (
                <PropertyCard
                  property={secondProperty}
                  isWishlisted={isWishlisted}
                  toggleWishlist={toggleWishlist}
                  handleCompare={handleCompare}
                  openQuickView={openQuickView}
                  addToCart={addToCart}
                  getImageUrl={getImageUrl}
                />
              )}
            </div>

            {/* SLIDER CONTROLS */}
            <div className="penthouse-controls">
              <button
                type="button"
                className="penthouse-arrow"
                onClick={prevSlide}
                aria-label="Previous property"
              >
                ←
              </button>

              <div className="penthouse-line"></div>

              <button
                type="button"
                className="penthouse-arrow"
                onClick={nextSlide}
                aria-label="Next property"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= QUICK VIEW POPUP ================= */}
      {quickView && (
        <div className="penthouse-modal-overlay" onClick={closeQuickView}>
          <div className="penthouse-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="penthouse-modal-close"
              onClick={closeQuickView}
              aria-label="Close"
            >
              ×
            </button>

            <div className="penthouse-modal-gallery">
              <div className="penthouse-modal-main-image">
                <img 
                  src={
                    modalImages[quickViewImage] ||
                    getImageUrl(quickView.image)
                  }
                  alt={quickView.title}
                />

                {modalImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="penthouse-modal-image-arrow left"
                      onClick={prevQuickViewImage}
                      aria-label="Previous image"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className="penthouse-modal-image-arrow right"
                      onClick={nextQuickViewImage}
                      aria-label="Next image"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              {modalImages.length > 0 && (
                <div className="penthouse-modal-thumbnails">
                  {modalImages.map((image, index) => (
                    <button
                      key={image + index}
                      type="button"
                      className={`penthouse-modal-thumbnail ${
                        quickViewImage === index ? "active" : ""
                      }`}
                      onClick={() => setQuickViewImage(index)}
                    >
                      <img src={image} alt={`${quickView.title} ${index + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="penthouse-modal-details">
              <span className="penthouse-modal-category">
                {quickView.category || "Penthouse"}
              </span>

              <h2>{quickView.title}</h2>

              <p className="penthouse-modal-description">
                {quickView.description || "Experience the epitome of luxury and comfortable living with this exclusive penthouse property."}
              </p>

              <div className="penthouse-modal-size-section">
                <div className="penthouse-modal-size-title">
                  <strong>Size:</strong> {selectedSize}
                </div>

                <div className="penthouse-size-options">
                  {(quickView.sizes || [quickView.size]).map((size) => (
                    <button
                      type="button"
                      key={size}
                      className={selectedSize === size ? "selected" : ""}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="penthouse-modal-price">
                <strong>{quickView.price}</strong>
                {quickView.oldPrice && <del>{quickView.oldPrice}</del>}
              </div>

              <div className="penthouse-modal-cart-row">
                <button
                  type="button"
                  className="penthouse-modal-cart"
                  onClick={async () => {
               const result = await addToCart({
  ...property,
  productId: String(
    property?.id || property?._id || ""
  ),
  productType: "penthouse",
});

                    if (result?.success) {
                      alert("Added to cart");
                      closeQuickView();
                    }
                  }}
                >
                  Add to Cart 🛒
                </button>

                <div className="penthouse-quantity">
                  <button type="button" onClick={decreaseQuantity}>−</button>
                  <span>{quantity}</span>
                  <button type="button" onClick={increaseQuantity}>+</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* ================= PROPERTY CARD ================= */
const PropertyCard = ({
  property,
  isWishlisted,
  toggleWishlist,
  handleCompare,
  openQuickView,
  addToCart,
  getImageUrl,
  navigate
}) => {
  const propertyWishlisted = isWishlisted({
    ...property,
    wishlistType: "penthouse",
  });

  const cardImage = getImageUrl(property.image);

  return (
    <article className="penthouse-card">
      <div className="penthouse-card-image">
        {/* <img src={cardImage} alt={property.title} /> */}
                {/* <img src={property.image} alt={property.title} /> */}
                <img
  src={property.image}
  alt={property.title}
  onClick={() =>
    navigate(
      `/property-details?id=${
        property._id || property.id
      }&type=penthouse`
    )
  }
/>


        <div className="penthouse-actions">
          <button
            type="button"
            className={propertyWishlisted ? "wishlist-active" : ""}
            onClick={() =>
              toggleWishlist({
                ...property,
                wishlistType: "penthouse",
              })
            }
            aria-label="Wishlist"
          >
            {propertyWishlisted ? "♥" : "♡"}
          </button>

          <button
            type="button"
            onClick={() => handleCompare(property)}
            aria-label="Compare"
          >
            ⇄
          </button>

          <button
            type="button"
            onClick={() => openQuickView(property)}
            aria-label="Quick view"
          >
            ◉
          </button>
        </div>

        <span className="penthouse-new">New</span>
      </div>

      <div className="penthouse-card-info">
        <div className="penthouse-category">
          <span>◎</span>
          <span>{property.category || "Penthouse"}</span>
        </div>

        <h3>{property.title}</h3>

        <select className="penthouse-size" defaultValue={property.size}>
          {(property.sizes?.length ? property.sizes : [property.size]).map(
            (size) => (
              <option key={size} value={size}>
                {size}
              </option>
            )
          )}
        </select>

        <div className="penthouse-price">
          <strong>{property.price}</strong>
          {property.oldPrice && <del>{property.oldPrice}</del>}
        </div>

        <button
          type="button"
          className="penthouse-cart"
          onClick={async () => {
            const result = await addToCart({
              ...property,
              productId: String(
                property?._id || property?.id || ""
              ),
              productType: "penthouse"
            });
            if (result?.success) {
              alert("Added to cart");
            }
          }}
        >
          Add to Cart →
        </button>
      </div>
    </article>
  );
};

export default PenthouseProperties;