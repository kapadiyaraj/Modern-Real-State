// import React, { useEffect, useMemo, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import "./CollectionProducts.css";

// const API_URL = "http://localhost:5000/api/luxurious-properties";
// const SERVER_URL = "http://localhost:5000";

// const categoryMap = {
//   bestseller: "Bestseller",
//   "farm-vila": "Farm Vila",
//   "luxury-properties": "Luxury Properties",
//   properties: "Properties",
//   "royal-house": "Royal House",
// };

// const CollectionProducts = () => {
//   const { slug } = useParams();
//   const navigate = useNavigate();

//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [selectedSizes, setSelectedSizes] = useState([]);
//   const [selectedAvailability, setSelectedAvailability] =
//     useState([]);

//   const [sortBy, setSortBy] = useState("best-selling");

//   // ==========================================
//   // GET LUXURIOUS PROPERTIES
//   // ==========================================
//   useEffect(() => {
//     const fetchProperties = async () => {
//       try {
//         setLoading(true);

//         const response = await fetch(API_URL);

//         if (!response.ok) {
//           throw new Error(
//             "Failed to fetch luxurious properties"
//           );
//         }

//         const result = await response.json();

//         const data = Array.isArray(result)
//           ? result
//           : Array.isArray(result?.data)
//           ? result.data
//           : Array.isArray(result?.properties)
//           ? result.properties
//           : [];

//         setProperties(data);
//       } catch (error) {
//         console.error(
//           "Collection Products API Error:",
//           error
//         );

//         setProperties([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProperties();
//   }, []);

//   // ==========================================
//   // IMAGE URL
//   // ==========================================
//   const getImageUrl = (image) => {
//     if (!image) return "";

//     if (
//       image.startsWith("http://") ||
//       image.startsWith("https://") ||
//       image.startsWith("data:image")
//     ) {
//       return image;
//     }

//     if (image.startsWith("/uploads/")) {
//       return `${SERVER_URL}${image}`;
//     }

//     if (image.startsWith("uploads/")) {
//       return `${SERVER_URL}/${image}`;
//     }

//     if (image.startsWith("/")) {
//       return image;
//     }

//     return `${SERVER_URL}/${image}`;
//   };

//   // ==========================================
//   // COLLECTION TITLE
//   // ==========================================
//   const collectionTitle =
//     categoryMap[slug] || "Bestseller";

//   // ==========================================
//   // FILTER CATEGORY
//   // ==========================================
//   const collectionProperties = useMemo(() => {
//     if (collectionTitle === "Bestseller") {
//       return properties;
//     }

//     return properties.filter((property) => {
//       const propertyCategory = (
//         property.category || ""
//       )
//         .trim()
//         .toLowerCase();

//       const currentCategory = collectionTitle
//         .trim()
//         .toLowerCase();

//       return propertyCategory === currentCategory;
//     });
//   }, [properties, collectionTitle]);

//   // ==========================================
//   // ALL AVAILABLE SIZES
//   // ==========================================
//   const availableSizes = useMemo(() => {
//     const sizeList = [];

//     collectionProperties.forEach((property) => {
//       if (
//         Array.isArray(property.sizes) &&
//         property.sizes.length > 0
//       ) {
//         property.sizes.forEach((size) => {
//           if (size && !sizeList.includes(size)) {
//             sizeList.push(size);
//           }
//         });
//       } else if (
//         property.size &&
//         !sizeList.includes(property.size)
//       ) {
//         sizeList.push(property.size);
//       }
//     });

//     return sizeList;
//   }, [collectionProperties]);

//   // ==========================================
//   // SIZE FILTER
//   // ==========================================
//   const toggleSize = (size) => {
//     setSelectedSizes((previous) => {
//       if (previous.includes(size)) {
//         return previous.filter(
//           (item) => item !== size
//         );
//       }

//       return [...previous, size];
//     });
//   };

//   // ==========================================
//   // AVAILABILITY FILTER
//   // ==========================================
//   const toggleAvailability = (value) => {
//     setSelectedAvailability((previous) => {
//       if (previous.includes(value)) {
//         return previous.filter(
//           (item) => item !== value
//         );
//       }

//       return [...previous, value];
//     });
//   };

//   // ==========================================
//   // PRICE NUMBER
//   // ==========================================
//   const getPriceNumber = (price) => {
//     if (!price) return 0;

//     return Number(
//       String(price).replace(/[^\d.]/g, "")
//     );
//   };

//   // ==========================================
//   // FINAL FILTER + SORT
//   // ==========================================
//   const filteredProperties = useMemo(() => {
//     let result = [...collectionProperties];

//     // SIZE
//     if (selectedSizes.length > 0) {
//       result = result.filter((property) => {
//         const propertySizes =
//           Array.isArray(property.sizes) &&
//           property.sizes.length > 0
//             ? property.sizes
//             : [property.size];

//         return propertySizes.some((size) =>
//           selectedSizes.includes(size)
//         );
//       });
//     }

//     // AVAILABILITY
//     if (selectedAvailability.length > 0) {
//       result = result.filter((property) => {
//         const isInStock =
//           property.inStock !== false;

//         if (
//           selectedAvailability.includes("in-stock") &&
//           isInStock
//         ) {
//           return true;
//         }

//         if (
//           selectedAvailability.includes("out-of-stock") &&
//           !isInStock
//         ) {
//           return true;
//         }

//         return false;
//       });
//     }

//     // SORT
//     if (sortBy === "price-low") {
//       result.sort(
//         (a, b) =>
//           getPriceNumber(a.price) -
//           getPriceNumber(b.price)
//       );
//     }

//     if (sortBy === "price-high") {
//       result.sort(
//         (a, b) =>
//           getPriceNumber(b.price) -
//           getPriceNumber(a.price)
//       );
//     }

//     if (sortBy === "a-z") {
//       result.sort((a, b) =>
//         (a.title || "").localeCompare(
//           b.title || ""
//         )
//       );
//     }

//     if (sortBy === "z-a") {
//       result.sort((a, b) =>
//         (b.title || "").localeCompare(
//           a.title || ""
//         )
//       );
//     }

//     return result;
//   }, [
//     collectionProperties,
//     selectedSizes,
//     selectedAvailability,
//     sortBy,
//   ]);

//   // ==========================================
//   // OPEN PROPERTY DETAILS
//   // ==========================================
//   const handlePropertyClick = (property) => {
//     const id = property._id || property.id;

//     navigate(`/luxury-properties/${id}`, {
//       state: {
//         property,
//       },
//     });
//   };

//   // ==========================================
//   // LOADING
//   // ==========================================
//   if (loading) {
//     return (
//       <div className="collection-products-page">
//         <div className="collection-products-loading">
//           Loading properties...
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="collection-products-page">

//       {/* =====================================
//           COLLECTION HERO
//       ===================================== */}
//       <section className="collection-products-hero">

//         <div className="collection-products-hero-inner">

//           <button
//             type="button"
//             className="collection-back-button"
//             onClick={() => navigate("/collections")}
//           >
//             <span>←</span>
//             Back to home
//           </button>

//           <div className="collection-title-row">
//             <h1>{collectionTitle}</h1>

//             <span>
//               ({collectionProperties.length})
//             </span>
//           </div>

//           <p>
//             Discover beautiful modern properties
//             from our {collectionTitle} collection.
//           </p>

//         </div>

//       </section>

//       {/* =====================================
//           MAIN
//       ===================================== */}
//       <section className="collection-products-main">

//         {/* =================================
//             FILTER SIDEBAR
//         ================================= */}
//         <aside className="collection-filter-sidebar">

//           <h2>Filters</h2>

//           {/* AVAILABILITY */}
//           <div className="collection-filter-section">

//             <div className="collection-filter-heading">
//               <strong>AVAILABILITY</strong>
//               <span>−</span>
//             </div>

//             <div className="collection-filter-selected">
//               <span>
//                 {selectedAvailability.length} selected
//               </span>

//               <button
//                 type="button"
//                 onClick={() =>
//                   setSelectedAvailability([])
//                 }
//               >
//                 Reset
//               </button>
//             </div>

//             <label className="collection-checkbox">

//               <input
//                 type="checkbox"
//                 checked={selectedAvailability.includes(
//                   "in-stock"
//                 )}
//                 onChange={() =>
//                   toggleAvailability("in-stock")
//                 }
//               />

//               <span>In stock</span>

//               <small>
//                 ({collectionProperties.length})
//               </small>

//             </label>

//             <label className="collection-checkbox">

//               <input
//                 type="checkbox"
//                 checked={selectedAvailability.includes(
//                   "out-of-stock"
//                 )}
//                 onChange={() =>
//                   toggleAvailability("out-of-stock")
//                 }
//               />

//               <span>Out of stock</span>

//             </label>

//           </div>

//           {/* SIZE */}
//           <div className="collection-filter-section">

//             <div className="collection-filter-heading">
//               <strong>SIZE</strong>
//               <span>−</span>
//             </div>

//             <div className="collection-filter-selected">

//               <span>
//                 {selectedSizes.length} selected
//               </span>

//               <button
//                 type="button"
//                 onClick={() =>
//                   setSelectedSizes([])
//                 }
//               >
//                 Reset
//               </button>

//             </div>

//             {availableSizes.map((size) => (
//               <label
//                 className="collection-checkbox"
//                 key={size}
//               >

//                 <input
//                   type="checkbox"
//                   checked={selectedSizes.includes(size)}
//                   onChange={() =>
//                     toggleSize(size)
//                   }
//                 />

//                 <span>{size}</span>

//               </label>
//             ))}

//           </div>

//           {/* PRODUCT TYPE */}
//           <div className="collection-filter-section">

//             <div className="collection-filter-heading">
//               <strong>PRODUCT TYPE</strong>
//               <span>−</span>
//             </div>

//             <label className="collection-checkbox">

//               <input
//                 type="checkbox"
//                 defaultChecked
//               />

//               <span>Home</span>

//               <small>
//                 ({collectionProperties.length})
//               </small>

//             </label>

//           </div>

//           {/* BRAND */}
//           <div className="collection-filter-section">

//             <div className="collection-filter-heading">
//               <strong>BRAND</strong>
//               <span>−</span>
//             </div>

//             <label className="collection-checkbox">

//               <input
//                 type="checkbox"
//                 defaultChecked
//               />

//               <span>Real Estate</span>

//             </label>

//           </div>

//         </aside>

//         {/* =================================
//             PRODUCTS CONTENT
//         ================================= */}
//         <div className="collection-products-content">

//           {/* TOOLBAR */}
//           <div className="collection-products-toolbar">

//             <div className="collection-breadcrumb">
//               Home&nbsp; / &nbsp;
//               {collectionTitle}
//             </div>

//             <div className="collection-sort">

//               <label htmlFor="collection-sort">
//                 Sort by:
//               </label>

//               <select
//                 id="collection-sort"
//                 value={sortBy}
//                 onChange={(event) =>
//                   setSortBy(event.target.value)
//                 }
//               >

//                 <option value="best-selling">
//                   Best selling
//                 </option>

//                 <option value="price-low">
//                   Price, low to high
//                 </option>

//                 <option value="price-high">
//                   Price, high to low
//                 </option>

//                 <option value="a-z">
//                   Alphabetically, A-Z
//                 </option>

//                 <option value="z-a">
//                   Alphabetically, Z-A
//                 </option>

//               </select>

//             </div>

//           </div>

//           {/* PRODUCTS */}
//           {filteredProperties.length === 0 ? (

//             <div className="collection-no-products">
//               <h3>No properties found</h3>

//               <p>
//                 There are no properties available
//                 in this collection.
//               </p>
//             </div>

//           ) : (

//             <div className="collection-property-grid">

//               {filteredProperties.map((property) => (

//                 <article
//                   className="collection-property-card"
//                   key={
//                     property._id ||
//                     property.id
//                   }
//                 >

//                   {/* IMAGE */}
//                   <div
//                     className="collection-property-image-wrapper"
//                     onClick={() =>
//                       handlePropertyClick(property)
//                     }
//                   >

//                     <img
//                       src={getImageUrl(
//                         property.mainImage
//                       )}
//                       alt={property.title}
//                       className="collection-property-image"
//                     />

//                     {property.isNew && (
//                       <span className="collection-new-badge">
//                         New
//                       </span>
//                     )}

//                   </div>

//                   {/* CONTENT */}
//                   <div className="collection-property-content">

//                     <div className="collection-property-type">
//                       <span>◎</span>

//                       {property.type ||
//                         property.category ||
//                         "Home"}
//                     </div>

//                     <h3
//                       onClick={() =>
//                         handlePropertyClick(property)
//                       }
//                     >
//                       {property.title}
//                     </h3>

//                     <select
//                       defaultValue={
//                         property.size ||
//                         property.sizes?.[0] ||
//                         ""
//                       }
//                     >

//                       {(
//                         property.sizes || [
//                           property.size,
//                         ]
//                       )
//                         .filter(Boolean)
//                         .map((size) => (
//                           <option
//                             key={size}
//                             value={size}
//                           >
//                             {size}
//                           </option>
//                         ))}

//                     </select>

//                     <div className="collection-property-price">

//                       <strong>
//                         {property.price}
//                       </strong>

//                       {property.oldPrice && (
//                         <del>
//                           {property.oldPrice}
//                         </del>
//                       )}

//                     </div>

//                     <button
//                       type="button"
//                       className="collection-add-cart"
//                     >
//                       Add to Cart →
//                     </button>

//                   </div>

//                 </article>

//               ))}

//             </div>

//           )}

//         </div>

//       </section>

//     </div>
//   );
// };

// export default CollectionProducts;




// import React, { useEffect, useMemo, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import "./CollectionProducts.css";
// import LuxuriousProperties from "../../PropertySection/LuxuriousProperties";
// import Navbar from "../../Navbar/Navbar";
// import Footer from "../../Footer/Footer";
// const API_URL = "http://localhost:5000/api/luxurious-properties";
// const SERVER_URL = "http://localhost:5000";

// const categoryMap = {
//   bestseller: "Bestseller",
//   "farm-vila": "Farm Vila",
//   "luxury-properties": "Luxury Properties",
//   properties: "Properties",
//   "royal-house": "Royal House",
// };

// const CollectionProducts = () => {
//   const { slug } = useParams();
//   const navigate = useNavigate();

//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [selectedSizes, setSelectedSizes] = useState([]);
//   const [selectedAvailability, setSelectedAvailability] =
//     useState([]);

//   const [sortBy, setSortBy] = useState("best-selling");

//   // ==========================================
//   // GET LUXURIOUS PROPERTIES
//   // ==========================================
//   useEffect(() => {
//     const fetchProperties = async () => {
//       try {
//         setLoading(true);

//         const response = await fetch(API_URL);

//         if (!response.ok) {
//           throw new Error(
//             "Failed to fetch luxurious properties"
//           );
//         }

//         const result = await response.json();

//         const data = Array.isArray(result)
//           ? result
//           : Array.isArray(result?.data)
//           ? result.data
//           : Array.isArray(result?.properties)
//           ? result.properties
//           : [];

//         setProperties(data);
//       } catch (error) {
//         console.error(
//           "Collection Products API Error:",
//           error
//         );

//         setProperties([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProperties();
//   }, []);

//   // ==========================================
//   // IMAGE URL
//   // ==========================================
//   const getImageUrl = (image) => {
//     if (!image) return "";

//     if (
//       image.startsWith("http://") ||
//       image.startsWith("https://") ||
//       image.startsWith("data:image")
//     ) {
//       return image;
//     }

//     if (image.startsWith("/uploads/")) {
//       return `${SERVER_URL}${image}`;
//     }

//     if (image.startsWith("uploads/")) {
//       return `${SERVER_URL}/${image}`;
//     }

//     if (image.startsWith("/")) {
//       return image;
//     }

//     return `${SERVER_URL}/${image}`;
//   };

//   // ==========================================
//   // COLLECTION TITLE
//   // ==========================================
//   const collectionTitle =
//     categoryMap[slug] || "Bestseller";

//   // ==========================================
//   // FILTER CATEGORY
//   // ==========================================
//   const collectionProperties = useMemo(() => {
//     if (collectionTitle === "Bestseller") {
//       return properties;
//     }

//     return properties.filter((property) => {
//       const propertyCategory = (
//         property.category || ""
//       )
//         .trim()
//         .toLowerCase();

//       const currentCategory = collectionTitle
//         .trim()
//         .toLowerCase();

//       return propertyCategory === currentCategory;
//     });
//   }, [properties, collectionTitle]);

//   // ==========================================
//   // ALL AVAILABLE SIZES
//   // ==========================================
//   const availableSizes = useMemo(() => {
//     const sizeList = [];

//     collectionProperties.forEach((property) => {
//       if (
//         Array.isArray(property.sizes) &&
//         property.sizes.length > 0
//       ) {
//         property.sizes.forEach((size) => {
//           if (size && !sizeList.includes(size)) {
//             sizeList.push(size);
//           }
//         });
//       } else if (
//         property.size &&
//         !sizeList.includes(property.size)
//       ) {
//         sizeList.push(property.size);
//       }
//     });

//     return sizeList;
//   }, [collectionProperties]);

//   // ==========================================
//   // SIZE FILTER
//   // ==========================================
//   const toggleSize = (size) => {
//     setSelectedSizes((previous) => {
//       if (previous.includes(size)) {
//         return previous.filter(
//           (item) => item !== size
//         );
//       }

//       return [...previous, size];
//     });
//   };

//   // ==========================================
//   // AVAILABILITY FILTER
//   // ==========================================
//   const toggleAvailability = (value) => {
//     setSelectedAvailability((previous) => {
//       if (previous.includes(value)) {
//         return previous.filter(
//           (item) => item !== value
//         );
//       }

//       return [...previous, value];
//     });
//   };

//   // ==========================================
//   // PRICE NUMBER
//   // ==========================================
//  const getPriceNumber = (price) => {
//   if (price === null || price === undefined) {
//     return 0;
//   }

//   const cleanedPrice = String(price)
//     .replace(/,/g, "")
//     .replace(/[^\d.]/g, "");

//   return parseFloat(cleanedPrice) || 0;
// };

//   // ==========================================
//   // FINAL FILTER + SORT
//   // ==========================================
//   const filteredProperties = useMemo(() => {
//     let result = [...collectionProperties];

//     // SIZE
//     if (selectedSizes.length > 0) {
//       result = result.filter((property) => {
//         const propertySizes =
//           Array.isArray(property.sizes) &&
//           property.sizes.length > 0
//             ? property.sizes
//             : [property.size];

//         return propertySizes.some((size) =>
//           selectedSizes.includes(size)
//         );
//       });
//     }

//     // AVAILABILITY
//     if (selectedAvailability.length > 0) {
//       result = result.filter((property) => {
//         const isInStock =
//           property.inStock !== false;

//         if (
//           selectedAvailability.includes("in-stock") &&
//           isInStock
//         ) {
//           return true;
//         }

//         if (
//           selectedAvailability.includes("out-of-stock") &&
//           !isInStock
//         ) {
//           return true;
//         }

//         return false;
//       });
//     }

//     // SORT
//     if (sortBy === "price-low") {
//       result.sort(
//         (a, b) =>
//           getPriceNumber(a.price) -
//           getPriceNumber(b.price)
//       );
//     }

//     if (sortBy === "price-high") {
//       result.sort(
//         (a, b) =>
//           getPriceNumber(b.price) -
//           getPriceNumber(a.price)
//       );
//     }

//     if (sortBy === "a-z") {
//       result.sort((a, b) =>
//         (a.title || "").localeCompare(
//           b.title || ""
//         )
//       );
//     }

//     if (sortBy === "z-a") {
//       result.sort((a, b) =>
//         (b.title || "").localeCompare(
//           a.title || ""
//         )
//       );
//     }

//     return result;
//   }, [
//     collectionProperties,
//     selectedSizes,
//     selectedAvailability,
//     sortBy,
//   ]);

//   // ==========================================
//   // OPEN PROPERTY DETAILS
//   // ==========================================
//   const handlePropertyClick = (property) => {
//     const id = property._id || property.id;

//     navigate(`/luxury-properties/${id}`, {
//       state: {
//         property,
//       },
//     });
//   };

//   // ==========================================
//   // LOADING
//   // ==========================================
//   if (loading) {
//     return (
//       <div className="collection-products-page">
//         <div className="collection-products-loading">
//           Loading properties...
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//   <Navbar/>
//     <div className="collection-products-page">

//       {/* =====================================
//           COLLECTION HERO
//       ===================================== */}
//       <section className="collection-products-hero">

//         <div className="collection-products-hero-inner">

//           <button
//             type="button"
//             className="collection-back-button"
//             onClick={() => navigate("/collections")}
//           >
//             <span>←</span>
//             Back to home
//           </button>

//           <div className="collection-title-row">
//             <h1>{collectionTitle}</h1>

//             <span>
//               ({collectionProperties.length})
//             </span>
//           </div>

//           <p>
//             Discover beautiful modern properties
//             from our {collectionTitle} collection.
//           </p>

//         </div>

//       </section>

//       {/* =====================================
//           MAIN
//       ===================================== */}
//       <section className="collection-products-main">

//         {/* =================================
//             FILTER SIDEBAR
//         ================================= */}
//         <aside className="collection-filter-sidebar">

//           <h2>Filters</h2>

//           {/* AVAILABILITY */}
//    {/* AVAILABILITY / SQUARE FEET */}
// <div className="collection-filter-section">

//   <div className="collection-filter-heading">
//     <strong>AVAILABILITY</strong>
//     <span>−</span>
//   </div>

//   <div className="collection-filter-selected">
//     <span>
//       {selectedSizes.length} selected
//     </span>

//     <button
//       type="button"
//       onClick={() => setSelectedSizes([])}
//     >
//       Reset
//     </button>
//   </div>

//   {availableSizes.map((size) => {

//     const count = collectionProperties.filter(
//       (property) => {

//         const propertySizes =
//           Array.isArray(property.sizes) &&
//           property.sizes.length > 0
//             ? property.sizes
//             : [property.size];

//         return propertySizes.includes(size);
//       }
//     ).length;

//     return (
//       <label
//         className="collection-checkbox"
//         key={size}
//       >

//         <input
//           type="checkbox"
//           checked={selectedSizes.includes(size)}
//           onChange={() => toggleSize(size)}
//         />

//         <span>{size}</span>

//         <small>
//           ({count})
//         </small>

//       </label>
//     );
//   })}

// </div>

//           {/* SIZE */}
//           <div className="collection-filter-section">

//             <div className="collection-filter-heading">
//               <strong>SIZE</strong>
//               <span>−</span>
//             </div>

//             <div className="collection-filter-selected">

//               <span>
//                 {selectedSizes.length} selected
//               </span>

//               <button
//                 type="button"
//                 onClick={() =>
//                   setSelectedSizes([])
//                 }
//               >
//                 Reset
//               </button>

//             </div>

//             {availableSizes.map((size) => (
//               <label
//                 className="collection-checkbox"
//                 key={size}
//               >

//                 <input
//                   type="checkbox"
//                   checked={selectedSizes.includes(size)}
//                   onChange={() =>
//                     toggleSize(size)
//                   }
//                 />

//                 <span>{size}</span>

//               </label>
//             ))}

//           </div>

//           {/* PRODUCT TYPE */}
//           <div className="collection-filter-section">

//             <div className="collection-filter-heading">
//               <strong>PRODUCT TYPE</strong>
//               <span>−</span>
//             </div>

//             <label className="collection-checkbox">

//               <input
//                 type="checkbox"
//                 defaultChecked
//               />

//               <span>Home</span>

//               <small>
//                 ({collectionProperties.length})
//               </small>

//             </label>

//           </div>

//           {/* BRAND */}
//           <div className="collection-filter-section">

//             <div className="collection-filter-heading">
//               <strong>BRAND</strong>
//               <span>−</span>
//             </div>

//             <label className="collection-checkbox">

//               <input
//                 type="checkbox"
//                 defaultChecked
//               />

//               <span>Real Estate</span>

//             </label>

//           </div>

//         </aside>

//         {/* =================================
//             PRODUCTS CONTENT
//         ================================= */}
//         <div className="collection-products-content">

//           {/* TOOLBAR */}
//           <div className="collection-products-toolbar">

//             <div className="collection-breadcrumb">
//               Home&nbsp; / &nbsp;
//               {collectionTitle}
//             </div>

//             <div className="collection-sort">

//               <label htmlFor="collection-sort">
//                 Sort by:
//               </label>

//               <button
//   className="collection-filter-mobile-btn"
//   onClick={() => setMobileFilterOpen(true)}
// >
//   Filters
// </button>




//               <select
//                 id="collection-sort"
//                 value={sortBy}
//                 onChange={(event) =>
//                   setSortBy(event.target.value)
//                 }
//               >

//                 <option value="best-selling">
//                   Best selling
//                 </option>

//                 <option value="price-low">
//                   Price, low to high
//                 </option>

//                 <option value="price-high">
//                   Price, high to low
//                 </option>

//                 <option value="a-z">
//                   Alphabetically, A-Z
//                 </option>

//                 <option value="z-a">
//                   Alphabetically, Z-A
//                 </option>

//               </select>

//             </div>

//           </div>

//           {/* PRODUCTS */}
//           {filteredProperties.length === 0 ? (

//             <div className="collection-no-products">
//               <h3>No properties found</h3>

//               <p>
//                 There are no properties available
//                 in this collection.
//               </p>
//             </div>

//           ) : (

//             <div className="collection-property-grid">

//               {filteredProperties.map((property) => (

//                 <article
//                   className="collection-property-card"
//                   key={
//                     property._id ||
//                     property.id
//                   }
//                 >

//                   {/* IMAGE */}
//                   <div
//                     className="collection-property-image-wrapper"
//                     onClick={() =>
//                       handlePropertyClick(property)
//                     }
//                   >

//                     <img
//                       src={getImageUrl(
//                         property.mainImage
//                       )}
//                       alt={property.title}
//                       className="collection-property-image"
//                     />

//                     {property.isNew && (
//                       <span className="collection-new-badge">
//                         New
//                       </span>
//                     )}

//                   </div>

//                   {/* CONTENT */}
//                   <div className="collection-property-content">

//                     <div className="collection-property-type">
//                       <span>◎</span>

//                       {property.type ||
//                         property.category ||
//                         "Home"}
//                     </div>

//                     <h3
//                       onClick={() =>
//                         handlePropertyClick(property)
//                       }
//                     >
//                       {property.title}
//                     </h3>

//                     <select
//                       defaultValue={
//                         property.size ||
//                         property.sizes?.[0] ||
//                         ""
//                       }
//                     >

//                       {(
//                         property.sizes || [
//                           property.size,
//                         ]
//                       )
//                         .filter(Boolean)
//                         .map((size) => (
//                           <option
//                             key={size}
//                             value={size}
//                           >
//                             {size}
//                           </option>
//                         ))}

//                     </select>

//                     <div className="collection-property-price">

//                       <strong>
//                         {property.price}
//                       </strong>

//                       {property.oldPrice && (
//                         <del>
//                           {property.oldPrice}
//                         </del>
//                       )}

//                     </div>

//                     <button
//                       type="button"
//                       className="collection-add-cart"
//                     >
//                       Add to Cart →
//                     </button>

//                   </div>

//                 </article>

//               ))}

//             </div>

//           )}

//         </div>

//       </section>

//     </div>
//     <div style={{ backgroundColor: "red" }}>
//      <LuxuriousProperties />
// </div>



// <Footer/>
   
//     </>
    
//   );
// };

// export default CollectionProducts;



import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CollectionProducts.css";

import LuxuriousProperties from "../../PropertySection/LuxuriousProperties";
import Navbar from "../../Navbar/Navbar";
import Footer from "../../Footer/Footer";

const API_URL =
  "http://localhost:5000/api/luxurious-properties";

const SERVER_URL = "http://localhost:5000";

const categoryMap = {
  bestseller: "Bestseller",
  "farm-vila": "Farm Vila",
  "luxury-properties": "Luxury Properties",
  properties: "Properties",
  "royal-house": "Royal House",
};

const CollectionProducts = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedAvailability, setSelectedAvailability] =
    useState([]);
  const [selectedProductTypes, setSelectedProductTypes] =
    useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  // Sort
  const [sortBy, setSortBy] =
    useState("best-selling");

  // Mobile filter
  const [mobileFilterOpen, setMobileFilterOpen] =
    useState(false);

  const [mobileFilterSection, setMobileFilterSection] =
    useState(null);

  // ==========================================
  // GET LUXURIOUS PROPERTIES
  // ==========================================

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(
            "Failed to fetch luxurious properties"
          );
        }

        const result = await response.json();

        const data = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result?.properties)
          ? result.properties
          : [];

        setProperties(data);
      } catch (error) {
        console.error(
          "Collection Products API Error:",
          error
        );

        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // ==========================================
  // IMAGE URL
  // ==========================================

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

  // ==========================================
  // COLLECTION TITLE
  // ==========================================

  const collectionTitle =
    categoryMap[slug] || "Bestseller";

  // ==========================================
  // COLLECTION FILTER
  // ==========================================

  const collectionProperties = useMemo(() => {
    // Bestseller = all properties
    if (collectionTitle === "Bestseller") {
      return properties;
    }

    return properties.filter((property) => {
      const propertyCategory = String(
        property.category || ""
      )
        .trim()
        .toLowerCase();

      const currentCategory = String(
        collectionTitle
      )
        .trim()
        .toLowerCase();

      return propertyCategory === currentCategory;
    });
  }, [properties, collectionTitle]);

  // ==========================================
  // AVAILABLE SIZES
  // ==========================================

  const availableSizes = useMemo(() => {
    const sizeList = [];

    collectionProperties.forEach((property) => {
      if (
        Array.isArray(property.sizes) &&
        property.sizes.length > 0
      ) {
        property.sizes.forEach((size) => {
          if (
            size &&
            !sizeList.includes(size)
          ) {
            sizeList.push(size);
          }
        });
      } else if (
        property.size &&
        !sizeList.includes(property.size)
      ) {
        sizeList.push(property.size);
      }
    });

    return sizeList;
  }, [collectionProperties]);

  // ==========================================
  // AVAILABLE PRODUCT TYPES
  // ==========================================

  const availableProductTypes = useMemo(() => {
    const types = [];

    collectionProperties.forEach((property) => {
      const type =
        property.type ||
        property.category ||
        "Home";

      if (!types.includes(type)) {
        types.push(type);
      }
    });

    return types;
  }, [collectionProperties]);

  // ==========================================
  // AVAILABLE BRANDS
  // ==========================================

  const availableBrands = useMemo(() => {
    const brands = [];

    collectionProperties.forEach((property) => {
      const brand =
        property.brand || "Real Estate";

      if (!brands.includes(brand)) {
        brands.push(brand);
      }
    });

    return brands;
  }, [collectionProperties]);

  // ==========================================
  // SIZE FILTER
  // ==========================================

  const toggleSize = (size) => {
    setSelectedSizes((previous) => {
      if (previous.includes(size)) {
        return previous.filter(
          (item) => item !== size
        );
      }

      return [...previous, size];
    });
  };

  // ==========================================
  // AVAILABILITY FILTER
  // ==========================================

  const toggleAvailability = (value) => {
    setSelectedAvailability((previous) => {
      if (previous.includes(value)) {
        return previous.filter(
          (item) => item !== value
        );
      }

      return [...previous, value];
    });
  };

  // ==========================================
  // PRODUCT TYPE FILTER
  // ==========================================

  const toggleProductType = (type) => {
    setSelectedProductTypes((previous) => {
      if (previous.includes(type)) {
        return previous.filter(
          (item) => item !== type
        );
      }

      return [...previous, type];
    });
  };

  // ==========================================
  // BRAND FILTER
  // ==========================================

  const toggleBrand = (brand) => {
    setSelectedBrands((previous) => {
      if (previous.includes(brand)) {
        return previous.filter(
          (item) => item !== brand
        );
      }

      return [...previous, brand];
    });
  };

  // ==========================================
  // PRICE NUMBER
  // ==========================================

  const getPriceNumber = (price) => {
    if (
      price === null ||
      price === undefined
    ) {
      return 0;
    }

    const cleanedPrice = String(price)
      .replace(/,/g, "")
      .replace(/[^\d.]/g, "");

    return parseFloat(cleanedPrice) || 0;
  };

  // ==========================================
  // AVAILABILITY COUNTS
  // ==========================================

  const inStockCount =
    collectionProperties.filter(
      (property) =>
        property.inStock !== false
    ).length;

  const outOfStockCount =
    collectionProperties.filter(
      (property) =>
        property.inStock === false
    ).length;

  // ==========================================
  // SIZE COUNT
  // ==========================================

  const getSizeCount = (size) => {
    return collectionProperties.filter(
      (property) => {
        const propertySizes =
          Array.isArray(property.sizes) &&
          property.sizes.length > 0
            ? property.sizes
            : [property.size];

        return propertySizes.includes(size);
      }
    ).length;
  };

  // ==========================================
  // PRODUCT TYPE COUNT
  // ==========================================

  const getProductTypeCount = (type) => {
    return collectionProperties.filter(
      (property) =>
        (property.type ||
          property.category ||
          "Home") === type
    ).length;
  };

  // ==========================================
  // BRAND COUNT
  // ==========================================

  const getBrandCount = (brand) => {
    return collectionProperties.filter(
      (property) =>
        (property.brand ||
          "Real Estate") === brand
    ).length;
  };

  // ==========================================
  // FINAL FILTER + SORT
  // ==========================================

  const filteredProperties = useMemo(() => {
    let result = [...collectionProperties];

    // SIZE
    if (selectedSizes.length > 0) {
      result = result.filter((property) => {
        const propertySizes =
          Array.isArray(property.sizes) &&
          property.sizes.length > 0
            ? property.sizes
            : [property.size];

        return propertySizes.some((size) =>
          selectedSizes.includes(size)
        );
      });
    }

    // AVAILABILITY
    if (selectedAvailability.length > 0) {
      result = result.filter((property) => {
        const isInStock =
          property.inStock !== false;

        if (
          selectedAvailability.includes(
            "in-stock"
          ) &&
          isInStock
        ) {
          return true;
        }

        if (
          selectedAvailability.includes(
            "out-of-stock"
          ) &&
          !isInStock
        ) {
          return true;
        }

        return false;
      });
    }

    // PRODUCT TYPE
    if (selectedProductTypes.length > 0) {
      result = result.filter((property) => {
        const type =
          property.type ||
          property.category ||
          "Home";

        return selectedProductTypes.includes(
          type
        );
      });
    }

    // BRAND
    if (selectedBrands.length > 0) {
      result = result.filter((property) => {
        const brand =
          property.brand ||
          "Real Estate";

        return selectedBrands.includes(
          brand
        );
      });
    }

    // SORT
    if (sortBy === "price-low") {
      result.sort(
        (a, b) =>
          getPriceNumber(a.price) -
          getPriceNumber(b.price)
      );
    }

    if (sortBy === "price-high") {
      result.sort(
        (a, b) =>
          getPriceNumber(b.price) -
          getPriceNumber(a.price)
      );
    }

    if (sortBy === "a-z") {
      result.sort((a, b) =>
        (a.title || "").localeCompare(
          b.title || ""
        )
      );
    }

    if (sortBy === "z-a") {
      result.sort((a, b) =>
        (b.title || "").localeCompare(
          a.title || ""
        )
      );
    }

    return result;
  }, [
    collectionProperties,
    selectedSizes,
    selectedAvailability,
    selectedProductTypes,
    selectedBrands,
    sortBy,
  ]);

  // ==========================================
  // CLEAR ALL FILTERS
  // ==========================================

  const clearAllFilters = () => {
    setSelectedSizes([]);
    setSelectedAvailability([]);
    setSelectedProductTypes([]);
    setSelectedBrands([]);
  };

  // ==========================================
  // OPEN PROPERTY DETAILS
  // ==========================================

  const handlePropertyClick = (property) => {
    const id =
      property._id || property.id;

    navigate(`/luxury-properties/${id}`, {
      state: {
        property,
      },
    });
  };

  // ==========================================
  // MOBILE FILTER SECTION
  // ==========================================

  const openMobileFilter = (section) => {
    setMobileFilterSection(section);
  };

  const closeMobileFilterSection = () => {
    setMobileFilterSection(null);
  };

  // ==========================================
  // MOBILE FILTER COUNT
  // ==========================================

  const selectedFilterCount =
    selectedSizes.length +
    selectedAvailability.length +
    selectedProductTypes.length +
    selectedBrands.length;

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="collection-products-page">
        <div className="collection-products-loading">
          Loading properties...
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="collection-products-page">

        {/* =====================================
            COLLECTION HERO
        ===================================== */}

        <section className="collection-products-hero">

          <div className="collection-products-hero-inner">

            <button
              type="button"
              className="collection-back-button"
              onClick={() =>
                navigate("/collections")
              }
            >
              <span>←</span>
              Back to home
            </button>

            <div className="collection-title-row">

              <h1>
                {collectionTitle}
              </h1>

              <span>
                ({collectionProperties.length})
              </span>

            </div>

            <p>
              Discover beautiful modern
              properties from our{" "}
              {collectionTitle} collection.
            </p>

          </div>

        </section>


        {/* =====================================
            MAIN
        ===================================== */}

        <section className="collection-products-main">

          {/* =================================
              FILTER SIDEBAR
          ================================= */}

          <aside className="collection-filter-sidebar">

            <h2>Filters</h2>

            {/* AVAILABILITY */}

            <div className="collection-filter-section">

              <div className="collection-filter-heading">
                <strong>
                  AVAILABILITY
                </strong>

                <span>−</span>
              </div>

              <div className="collection-filter-selected">

                <span>
                  {selectedAvailability.length}{" "}
                  selected
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedAvailability([])
                  }
                >
                  Reset
                </button>

              </div>

              <label className="collection-checkbox">

                <input
                  type="checkbox"
                  checked={selectedAvailability.includes(
                    "in-stock"
                  )}
                  onChange={() =>
                    toggleAvailability(
                      "in-stock"
                    )
                  }
                />

                <span>
                  In stock
                </span>

                <small>
                  ({inStockCount})
                </small>

              </label>

              <label className="collection-checkbox">

                <input
                  type="checkbox"
                  checked={selectedAvailability.includes(
                    "out-of-stock"
                  )}
                  onChange={() =>
                    toggleAvailability(
                      "out-of-stock"
                    )
                  }
                />

                <span>
                  Out of stock
                </span>

                <small>
                  ({outOfStockCount})
                </small>

              </label>

            </div>


            {/* SIZE */}

            <div className="collection-filter-section">

              <div className="collection-filter-heading">
                <strong>
                  SIZE
                </strong>

                <span>−</span>
              </div>

              <div className="collection-filter-selected">

                <span>
                  {selectedSizes.length} selected
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedSizes([])
                  }
                >
                  Reset
                </button>

              </div>

              {availableSizes.map(
                (size) => (
                  <label
                    className="collection-checkbox"
                    key={size}
                  >

                    <input
                      type="checkbox"
                      checked={selectedSizes.includes(
                        size
                      )}
                      onChange={() =>
                        toggleSize(size)
                      }
                    />

                    <span>
                      {size}
                    </span>

                    <small>
                      ({getSizeCount(size)})
                    </small>

                  </label>
                )
              )}

            </div>


            {/* PRODUCT TYPE */}

            <div className="collection-filter-section">

              <div className="collection-filter-heading">

                <strong>
                  PRODUCT TYPE
                </strong>

                <span>−</span>

              </div>

              <div className="collection-filter-selected">

                <span>
                  {selectedProductTypes.length}{" "}
                  selected
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedProductTypes([])
                  }
                >
                  Reset
                </button>

              </div>

              {availableProductTypes.map(
                (type) => (
                  <label
                    className="collection-checkbox"
                    key={type}
                  >

                    <input
                      type="checkbox"
                      checked={selectedProductTypes.includes(
                        type
                      )}
                      onChange={() =>
                        toggleProductType(
                          type
                        )
                      }
                    />

                    <span>
                      {type}
                    </span>

                    <small>
                      (
                      {getProductTypeCount(
                        type
                      )}
                      )
                    </small>

                  </label>
                )
              )}

            </div>


            {/* BRAND */}

            <div className="collection-filter-section">

              <div className="collection-filter-heading">

                <strong>
                  BRAND
                </strong>

                <span>−</span>

              </div>

              <div className="collection-filter-selected">

                <span>
                  {selectedBrands.length} selected
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedBrands([])
                  }
                >
                  Reset
                </button>

              </div>

              {availableBrands.map(
                (brand) => (
                  <label
                    className="collection-checkbox"
                    key={brand}
                  >

                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(
                        brand
                      )}
                      onChange={() =>
                        toggleBrand(brand)
                      }
                    />

                    <span>
                      {brand}
                    </span>

                    <small>
                      (
                      {getBrandCount(
                        brand
                      )}
                      )
                    </small>

                  </label>
                )
              )}

            </div>

          </aside>


          {/* =================================
              PRODUCTS CONTENT
          ================================= */}

          <div className="collection-products-content">

            {/* TOOLBAR */}

            <div className="collection-products-toolbar">

              <div className="collection-breadcrumb">
                Home&nbsp; / &nbsp;
                {collectionTitle}
              </div>

              <div className="collection-sort">

                {/* MOBILE FILTER BUTTON */}

                <button
                  type="button"
                  className="collection-filter-mobile-btn"
                  onClick={() =>
                    setMobileFilterOpen(true)
                  }
                >
                  Filters

                  {selectedFilterCount > 0 && (
                    <span className="mobile-filter-count">
                      {selectedFilterCount}
                    </span>
                  )}
                </button>

                <label htmlFor="collection-sort">
                  Sort by:
                </label>

                <select
                  id="collection-sort"
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(
                      event.target.value
                    )
                  }
                >

                  <option value="best-selling">
                    Best selling
                  </option>

                  <option value="price-low">
                    Price, low to high
                  </option>

                  <option value="price-high">
                    Price, high to low
                  </option>

                  <option value="a-z">
                    Alphabetically, A-Z
                  </option>

                  <option value="z-a">
                    Alphabetically, Z-A
                  </option>

                </select>

              </div>

            </div>


            {/* PRODUCTS */}

            {filteredProperties.length ===
            0 ? (

              <div className="collection-no-products">

                <h3>
                  No properties found
                </h3>

                <p>
                  There are no properties
                  available in this collection.
                </p>

              </div>

            ) : (

              <div className="collection-property-grid">

                {filteredProperties.map(
                  (property) => (

                    <article
                      className="collection-property-card"
                      key={
                        property._id ||
                        property.id
                      }
                    >

                      {/* IMAGE */}

                      <div
                        className="collection-property-image-wrapper"
                        onClick={() =>
                          handlePropertyClick(
                            property
                          )
                        }
                      >

                        <img
                          src={getImageUrl(
                            property.mainImage
                          )}
                          alt={
                            property.title ||
                            "Property"
                          }
                          className="collection-property-image"
                        />

                        {property.isNew && (
                          <span className="collection-new-badge">
                            New
                          </span>
                        )}

                      </div>


                      {/* CONTENT */}

                      <div className="collection-property-content">

                        <div className="collection-property-type">

                          <span>◎</span>

                          {property.type ||
                            property.category ||
                            "Home"}

                        </div>

                        <h3
                          onClick={() =>
                            handlePropertyClick(
                              property
                            )
                          }
                        >
                          {property.title}
                        </h3>

                        <select
                          defaultValue={
                            property.size ||
                            property.sizes?.[0] ||
                            ""
                          }
                        >

                          {(
                            property.sizes ||
                            [
                              property.size,
                            ]
                          )
                            .filter(Boolean)
                            .map(
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

                        <div className="collection-property-price">

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

                        <button
                          type="button"
                          className="collection-add-cart"
                        >
                          Add to Cart →
                        </button>

                      </div>

                    </article>

                  )
                )}

              </div>

            )}

          </div>

        </section>


        {/* =====================================
            MOBILE FILTER DRAWER
        ===================================== */}

        {mobileFilterOpen && (

          <div
            className="mobile-filter-overlay"
            onClick={(event) => {

              if (
                event.target.classList.contains(
                  "mobile-filter-overlay"
                )
              ) {
                setMobileFilterOpen(false);
                setMobileFilterSection(null);
              }

            }}
          >

            <div className="mobile-filter-drawer">

              {/* CLOSE */}

              <button
                type="button"
                className="mobile-filter-close"
                onClick={() => {
                  setMobileFilterOpen(false);
                  setMobileFilterSection(null);
                }}
              >
                ×
              </button>


              {/* =================================
                  MAIN FILTER MENU
              ================================= */}

              {mobileFilterSection === null ? (

                <>

                  <div className="mobile-filter-list">

                    <button
                      type="button"
                      className="mobile-filter-row"
                      onClick={() =>
                        openMobileFilter(
                          "availability"
                        )
                      }
                    >
                      <span>
                        Availability
                      </span>

                      <span>→</span>
                    </button>


                    <button
                      type="button"
                      className="mobile-filter-row"
                      onClick={() =>
                        openMobileFilter(
                          "size"
                        )
                      }
                    >
                      <span>
                        Size
                      </span>

                      <span>→</span>
                    </button>


                    <button
                      type="button"
                      className="mobile-filter-row"
                      onClick={() =>
                        openMobileFilter(
                          "product-type"
                        )
                      }
                    >
                      <span>
                        Product type
                      </span>

                      <span>→</span>
                    </button>


                    <button
                      type="button"
                      className="mobile-filter-row"
                      onClick={() =>
                        openMobileFilter(
                          "brand"
                        )
                      }
                    >
                      <span>
                        Brand
                      </span>

                      <span>→</span>
                    </button>

                  </div>


                  <div className="mobile-filter-actions">

                    <button
                      type="button"
                      className="mobile-remove-btn"
                      onClick={
                        clearAllFilters
                      }
                    >
                      Remove all
                    </button>

                    <button
                      type="button"
                      className="mobile-apply-btn"
                      onClick={() =>
                        setMobileFilterOpen(
                          false
                        )
                      }
                    >
                      Apply
                    </button>

                  </div>

                </>

              ) : (

                <>
                  {/* =================================
                      MOBILE SUB FILTER HEADER
                  ================================= */}

                  <button
                    type="button"
                    className="mobile-filter-back"
                    onClick={
                      closeMobileFilterSection
                    }
                  >
                    <span>←</span>

                    <span>

                      {mobileFilterSection ===
                        "availability" &&
                        "Availability"}

                      {mobileFilterSection ===
                        "size" &&
                        "Size"}

                      {mobileFilterSection ===
                        "product-type" &&
                        "Product type"}

                      {mobileFilterSection ===
                        "brand" &&
                        "Brand"}

                    </span>

                  </button>


                  {/* =================================
                      AVAILABILITY
                  ================================= */}

                  {mobileFilterSection ===
                    "availability" && (

                    <div className="mobile-filter-options">

                      <label className="mobile-option">

                        <input
                          type="checkbox"
                          checked={selectedAvailability.includes(
                            "in-stock"
                          )}
                          onChange={() =>
                            toggleAvailability(
                              "in-stock"
                            )
                          }
                        />

                        <span>
                          In stock
                        </span>

                        <small>
                          {inStockCount}
                        </small>

                      </label>


                      <label className="mobile-option">

                        <input
                          type="checkbox"
                          checked={selectedAvailability.includes(
                            "out-of-stock"
                          )}
                          onChange={() =>
                            toggleAvailability(
                              "out-of-stock"
                            )
                          }
                        />

                        <span>
                          Out of stock
                        </span>

                        <small>
                          {outOfStockCount}
                        </small>

                      </label>

                    </div>
                  )}


                  {/* =================================
                      SIZE
                  ================================= */}

                  {mobileFilterSection ===
                    "size" && (

                    <div className="mobile-filter-options">

                      {availableSizes.map(
                        (size) => (

                          <label
                            className="mobile-option"
                            key={size}
                          >

                            <input
                              type="checkbox"
                              checked={selectedSizes.includes(
                                size
                              )}
                              onChange={() =>
                                toggleSize(
                                  size
                                )
                              }
                            />

                            <span>
                              {size}
                            </span>

                            <small>
                              {getSizeCount(
                                size
                              )}
                            </small>

                          </label>

                        )
                      )}

                    </div>
                  )}


                  {/* =================================
                      PRODUCT TYPE
                  ================================= */}

                  {mobileFilterSection ===
                    "product-type" && (

                    <div className="mobile-filter-options">

                      {availableProductTypes.map(
                        (type) => (

                          <label
                            className="mobile-option"
                            key={type}
                          >

                            <input
                              type="checkbox"
                              checked={selectedProductTypes.includes(
                                type
                              )}
                              onChange={() =>
                                toggleProductType(
                                  type
                                )
                              }
                            />

                            <span>
                              {type}
                            </span>

                            <small>
                              {getProductTypeCount(
                                type
                              )}
                            </small>

                          </label>

                        )
                      )}

                    </div>
                  )}


                  {/* =================================
                      BRAND
                  ================================= */}

                  {mobileFilterSection ===
                    "brand" && (

                    <div className="mobile-filter-options">

                      {availableBrands.map(
                        (brand) => (

                          <label
                            className="mobile-option"
                            key={brand}
                          >

                            <input
                              type="checkbox"
                              checked={selectedBrands.includes(
                                brand
                              )}
                              onChange={() =>
                                toggleBrand(
                                  brand
                                )
                              }
                            />

                            <span>
                              {brand}
                            </span>

                            <small>
                              {getBrandCount(
                                brand
                              )}
                            </small>

                          </label>

                        )
                      )}

                    </div>
                  )}


                  {/* =================================
                      SUB FILTER ACTIONS
                  ================================= */}

                  <div className="mobile-filter-actions">

                    <button
                      type="button"
                      className="mobile-remove-btn"
                      onClick={() => {

                        if (
                          mobileFilterSection ===
                          "availability"
                        ) {
                          setSelectedAvailability(
                            []
                          );
                        }

                        if (
                          mobileFilterSection ===
                          "size"
                        ) {
                          setSelectedSizes([]);
                        }

                        if (
                          mobileFilterSection ===
                          "product-type"
                        ) {
                          setSelectedProductTypes(
                            []
                          );
                        }

                        if (
                          mobileFilterSection ===
                          "brand"
                        ) {
                          setSelectedBrands([]);
                        }

                      }}
                    >
                      Clear
                    </button>

                    <button
                      type="button"
                      className="mobile-apply-btn"
                      onClick={
                        closeMobileFilterSection
                      }
                    >
                      Apply
                    </button>

                  </div>

                </>

              )}

            </div>

          </div>

        )}

      </div>


      {/* Existing component */}

      <LuxuriousProperties />

      <Footer />

    </>
  );
};

export default CollectionProducts;