// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import "./LuxuryPropertiesAll.css";

// const LuxuryPropertiesAll = () => {
//   const [properties, setProperties] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);

//   const itemsPerPage = 12;

//   useEffect(() => {
//     const loadProperties = () => {
//       try {
//         const saved = JSON.parse(
//           localStorage.getItem("luxuryProperties") || "[]"
//         );

//         setProperties(Array.isArray(saved) ? saved : []);
//       } catch (error) {
//         console.error("Luxury properties load error:", error);
//         setProperties([]);
//       }
//     };

//     loadProperties();

//     window.addEventListener(
//       "luxuryPropertiesUpdated",
//       loadProperties
//     );

//     window.addEventListener("storage", loadProperties);

//     return () => {
//       window.removeEventListener(
//         "luxuryPropertiesUpdated",
//         loadProperties
//       );

//       window.removeEventListener("storage", loadProperties);
//     };
//   }, []);

//   const totalPages = Math.ceil(
//     properties.length / itemsPerPage
//   );

//   const startIndex =
//     (currentPage - 1) * itemsPerPage;

//   const currentProperties = properties.slice(
//     startIndex,
//     startIndex + itemsPerPage
//   );

//   const goToPage = (page) => {
//     setCurrentPage(page);

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   return (
//     <div className="luxury-all-page">

//       {/* HEADER */}
//       <div className="luxury-all-header">

//         <div>
//           <Link
//             to="/"
//             className="luxury-back-link"
//           >
//             ← Back to Home
//           </Link>

//           <h1>Luxury Properties</h1>

//           <p>
//             Discover our complete collection of
//             luxury properties.
//           </p>
//         </div>

//         <div className="luxury-total">
//           <strong>{properties.length}</strong>
//           <span>Properties</span>
//         </div>

//       </div>

//       {/* PROPERTY GRID */}
//       {currentProperties.length > 0 ? (
//         <div className="luxury-all-grid">

//           {currentProperties.map((property) => (
//             <article
//               className="luxury-all-card"
//               key={property.id}
//             >

//               <div className="luxury-all-image">

//                 <img
//                   src={property.image}
//                   alt={property.title}
//                 />

//                 {property.category && (
//                   <span>
//                     {property.category}
//                   </span>
//                 )}

//               </div>

//               <div className="luxury-all-content">

//                 <h2>{property.title}</h2>

//                 {property.size && (
//                   <p className="luxury-size">
//                     {property.size}
//                   </p>
//                 )}

//                 <p className="luxury-description">
//                   {property.description ||
//                     "Premium luxury property with modern design and comfortable living spaces."}
//                 </p>

//                 <div className="luxury-price-row">

//                   <strong>
//                     {property.price || "Price on request"}
//                   </strong>

//                   {property.oldPrice && (
//                     <del>
//                       {property.oldPrice}
//                     </del>
//                   )}

//                 </div>

//                 <button
//                   type="button"
//                   className="luxury-view-btn"
//                 >
//                   View Details
//                   <span>→</span>
//                 </button>

//               </div>

//             </article>
//           ))}

//         </div>
//       ) : (
//         <div className="luxury-empty">
//           <h2>No Luxury Properties Found</h2>
//           <p>
//             Please add properties from the admin panel.
//           </p>
//         </div>
//       )}

//       {/* PAGINATION */}
//       {totalPages > 1 && (
//         <div className="luxury-pagination">

//           <button
//             type="button"
//             disabled={currentPage === 1}
//             onClick={() =>
//               goToPage(currentPage - 1)
//             }
//           >
//             ←
//           </button>

//           {Array.from(
//             { length: totalPages },
//             (_, index) => index + 1
//           ).map((page) => (
//             <button
//               type="button"
//               key={page}
//               className={
//                 currentPage === page
//                   ? "active"
//                   : ""
//               }
//               onClick={() => goToPage(page)}
//             >
//               {page}
//             </button>
//           ))}

//           <button
//             type="button"
//             disabled={
//               currentPage === totalPages
//             }
//             onClick={() =>
//               goToPage(currentPage + 1)
//             }
//           >
//             →
//           </button>

//         </div>
//       )}

//     </div>
//   );
// };

// export default LuxuryPropertiesAll;