




// import React, {
//   useEffect,
//   useMemo,
//   useState,
// } from "react";


// const API_URL =
//   "http://localhost:5000/api/spacious-living";

// const SERVER_URL =
//   "http://localhost:5000";

// const ITEMS_PER_PAGE = 4;

// // =========================================================
// // EMPTY CONTENT
// // =========================================================

// const EMPTY_CONTENT = {
//   title: "",
//   topDescription: "",
//   mainImage: "",
//   bottomDescription: "",
//   sliderProperties: [],
// };

// // =========================================================
// // EMPTY PROPERTY
// // =========================================================

// const EMPTY_PROPERTY = {
//   title: "",
//   category: "",
//   mainImage: "",
//   subImages: [],
//   size: "",
//   sizes: [],
//   sizesInput: "",
//   price: "",
//   oldPrice: "",
//   description: "",
// };

// // =========================================================
// // AUTH HEADER
// // =========================================================

// const getAuthHeaders = () => {
//   const token =
//     localStorage.getItem("token") ||
//     localStorage.getItem("adminToken") ||
//     localStorage.getItem("accessToken");

//   return token
//     ? {
//         Authorization: `Bearer ${token}`,
//       }
//     : {};
// };

// // =========================================================
// // REMOVE INDEX AND SHIFT
// // =========================================================

// const removeIndexAndShift = (
//   state,
//   deletedIndex
// ) => {
//   const next = {};

//   Object.entries(state).forEach(
//     ([key, value]) => {
//       const index = Number(key);

//       if (index === deletedIndex) {
//         return;
//       }

//       next[
//         index > deletedIndex
//           ? index - 1
//           : index
//       ] = value;
//     }
//   );

//   return next;
// };

// // =========================================================
// // IMAGE URL
// // =========================================================

// const getImageUrl = (image) => {
//   if (!image) {
//     return "";
//   }

//   if (
//     image.startsWith("http://") ||
//     image.startsWith("https://") ||
//     image.startsWith("data:")
//   ) {
//     return image;
//   }

//   return image.startsWith("/uploads/")
//     ? `${SERVER_URL}${image}`
//     : image;
// };

// // =========================================================
// // NORMALIZE PROPERTY
// // =========================================================

// const normalizeProperty = (
//   property = {}
// ) => {
//   const sizes = Array.isArray(
//     property.sizes
//   )
//     ? property.sizes
//     : property.size
//     ? [property.size]
//     : [];

//   return {
//     _id: property._id,

//     id: property.id,

//     title:
//       property.title || "",

//     category:
//       property.category || "",

//     mainImage:
//       property.mainImage ||
//       property.image ||
//       "",

//     subImages:
//       Array.isArray(
//         property.subImages
//       )
//         ? property.subImages.slice(
//             0,
//             4
//           )
//         : [],

//     size:
//       property.size || "",

//     sizes,

//     // Keep raw input separately.
//     // This allows spaces and commas
//     // while typing.
//     sizesInput:
//       sizes.join(", "),

//     price:
//       property.price || "",

//     oldPrice:
//       property.oldPrice || "",

//     description:
//       property.description || "",
//   };
// };

// // =========================================================
// // COMPONENT
// // =========================================================

// const SpaciousLivingSubAdmin =
//   () => {
//     // =======================================================
//     // STATES
//     // =======================================================

//     const [content, setContent] =
//       useState(EMPTY_CONTENT);

//     const [
//       propertyMainFiles,
//       setPropertyMainFiles,
//     ] = useState({});

//     const [
//       propertyMainPreviews,
//       setPropertyMainPreviews,
//     ] = useState({});

//     const [
//       propertySubFiles,
//       setPropertySubFiles,
//     ] = useState({});

//     const [
//       propertySubPreviews,
//       setPropertySubPreviews,
//     ] = useState({});

//     const [
//       currentPage,
//       setCurrentPage,
//     ] = useState(1);

//     const [loading, setLoading] =
//       useState(true);

//     const [saving, setSaving] =
//       useState(false);

//     const [message, setMessage] =
//       useState("");

//     const [error, setError] =
//       useState("");

//     // =======================================================
//     // FETCH SUBADMIN DATA
//     // =======================================================

//     const fetchContent =
//       async () => {
//         try {
//           setLoading(true);
//           setError("");

//           const response =
//             await fetch(
//               `${API_URL}/my`,
//               {
//                 method: "GET",

//                 headers: {
//                   ...getAuthHeaders(),
//                 },
//               }
//             );

//           const result =
//             await response.json();

//           if (!response.ok) {
//             throw new Error(
//               result.message ||
//                 "Failed to fetch Spacious Living"
//             );
//           }

//           const data =
//             result?.success
//               ? result.data
//               : result;

//           if (!data) {
//             setContent({
//               ...EMPTY_CONTENT,
//             });

//             return;
//           }

//           setContent({
//             title:
//               data.title || "",

//             topDescription:
//               data.topDescription ||
//               "",

//             mainImage:
//               data.mainImage || "",

//             bottomDescription:
//               data.bottomDescription ||
//               "",

//             sliderProperties:
//               Array.isArray(
//                 data.sliderProperties
//               )
//                 ? data.sliderProperties.map(
//                     normalizeProperty
//                   )
//                 : [],
//           });
//         } catch (err) {
//           console.error(err);

//           setError(
//             err.message ||
//               "Failed to load Spacious Living."
//           );
//         } finally {
//           setLoading(false);
//         }
//       };

//     // =======================================================
//     // INITIAL LOAD
//     // =======================================================

//     useEffect(() => {
//       fetchContent();
//     }, []);

//     // =======================================================
//     // PAGINATION
//     // =======================================================

//     const totalPages =
//       Math.max(
//         1,
//         Math.ceil(
//           content.sliderProperties
//             .length /
//             ITEMS_PER_PAGE
//         )
//       );

//     useEffect(() => {
//       if (
//         currentPage >
//         totalPages
//       ) {
//         setCurrentPage(
//           totalPages
//         );
//       }
//     }, [
//       currentPage,
//       totalPages,
//     ]);

//     const startIndex =
//       (currentPage - 1) *
//       ITEMS_PER_PAGE;

//     const currentProperties =
//       useMemo(
//         () =>
//           content.sliderProperties.slice(
//             startIndex,
//             startIndex +
//               ITEMS_PER_PAGE
//           ),
//         [
//           content.sliderProperties,
//           startIndex,
//         ]
//       );

//     // =======================================================
//     // ADD PROPERTY
//     // =======================================================

//     const insertIndexAndShift = (
//       state,
//       insertedIndex
//     ) => {
//       const next = {};

//       Object.entries(state).forEach(
//         ([key, value]) => {
//           const index = Number(key);

//           next[
//             index >= insertedIndex
//               ? index + 1
//               : index
//           ] = value;
//         }
//       );

//       return next;
//     };

//     const addProperty = () => {
//       // New property must ALWAYS become Property 1.
//       // Existing properties shift one position/page forward.

//       setContent((prev) => ({
//         ...prev,

//         sliderProperties: [
//           {
//             ...EMPTY_PROPERTY,
//             sizes: [],
//             sizesInput: "",
//             subImages: [],
//           },

//           ...prev.sliderProperties,
//         ],
//       }));

//       // Shift temporary image/file states because every
//       // existing property moves from index N to N + 1.

//       setPropertyMainFiles((prev) =>
//         insertIndexAndShift(prev, 0)
//       );

//       setPropertyMainPreviews((prev) =>
//         insertIndexAndShift(prev, 0)
//       );

//       setPropertySubFiles((prev) =>
//         insertIndexAndShift(prev, 0)
//       );

//       setPropertySubPreviews((prev) =>
//         insertIndexAndShift(prev, 0)
//       );

//       // Always show the newly added Property 1.
//       setCurrentPage(1);

//       setMessage("");
//       setError("");
//     };

//     // =======================================================
//     // UPDATE PROPERTY
//     // =======================================================

//     const updateProperty = (
//       index,
//       field,
//       value
//     ) => {
//       setContent((prev) => {
//         const properties = [
//           ...prev.sliderProperties,
//         ];

//         properties[index] = {
//           ...properties[index],
//           [field]: value,
//         };

//         return {
//           ...prev,

//           sliderProperties:
//             properties,
//         };
//       });
//     };

//     // =======================================================
//     // AVAILABLE SIZES
//     // =======================================================

//     const handleSizesChange = (
//       index,
//       value
//     ) => {
//       // IMPORTANT:
//       // Do NOT split / trim here.
//       // Keep exact text while typing.
//       updateProperty(
//         index,
//         "sizesInput",
//         value
//       );
//     };

//     // =======================================================
//     // CONVERT SIZES ON BLUR
//     // =======================================================

//     const handleSizesBlur = (
//       index
//     ) => {
//       setContent((prev) => {
//         const properties = [
//           ...prev.sliderProperties,
//         ];

//         const property =
//           properties[index];

//         const rawValue =
//           property.sizesInput ??
//           "";

//         const sizes =
//           rawValue
//             .split(",")
//             .map((item) =>
//               item.trim()
//             )
//             .filter(Boolean);

//         properties[index] = {
//           ...property,

//           sizes,
//         };

//         return {
//           ...prev,

//           sliderProperties:
//             properties,
//         };
//       });
//     };

//     // =======================================================
//     // PROPERTY MAIN IMAGE
//     // =======================================================

//     const handlePropertyMainImage =
//       (
//         globalIndex,
//         event
//       ) => {
//         const file =
//           event.target.files?.[0];

//         if (!file) {
//           return;
//         }

//         setPropertyMainFiles(
//           (prev) => ({
//             ...prev,

//             [globalIndex]:
//               file,
//           })
//         );

//         setPropertyMainPreviews(
//           (prev) => ({
//             ...prev,

//             [globalIndex]:
//               URL.createObjectURL(
//                 file
//               ),
//           })
//         );
//       };

//     // =======================================================
//     // SUB IMAGES
//     // =======================================================

//     const handleSubImages = (
//       globalIndex,
//       event
//     ) => {
//       const selected =
//         Array.from(
//           event.target.files || []
//         );

//       if (
//         !selected.length
//       ) {
//         return;
//       }

//       setPropertySubFiles(
//         (prev) => {
//           const existing =
//             prev[globalIndex] ||
//             [];

//           return {
//             ...prev,

//             [globalIndex]: [
//               ...existing,
//               ...selected,
//             ].slice(0, 4),
//           };
//         }
//       );

//       setPropertySubPreviews(
//         (prev) => {
//           const existing =
//             prev[globalIndex] ||
//             [];

//           return {
//             ...prev,

//             [globalIndex]: [
//               ...existing,

//               ...selected.map(
//                 (file) =>
//                   URL.createObjectURL(
//                     file
//                   )
//               ),
//             ].slice(0, 4),
//           };
//         }
//       );

//       event.target.value = "";
//     };

//     // =======================================================
//     // REMOVE EXISTING SUB IMAGE
//     // =======================================================

//     const removeExistingSubImage =
//       (
//         globalIndex,
//         imageIndex
//       ) => {
//         setContent((prev) => {
//           const properties = [
//             ...prev.sliderProperties,
//           ];

//           const property =
//             properties[
//               globalIndex
//             ];

//           if (!property) {
//             return prev;
//           }

//           properties[
//             globalIndex
//           ] = {
//             ...property,

//             subImages:
//               property.subImages.filter(
//                 (_, index) =>
//                   index !==
//                   imageIndex
//               ),
//           };

//           return {
//             ...prev,

//             sliderProperties:
//               properties,
//           };
//         });
//       };

//     // =======================================================
//     // REMOVE NEW SUB IMAGE
//     // =======================================================

//     const removeNewSubImage =
//       (
//         globalIndex,
//         imageIndex
//       ) => {
//         setPropertySubFiles(
//           (prev) => ({
//             ...prev,

//             [globalIndex]:
//               (
//                 prev[
//                   globalIndex
//                 ] || []
//               ).filter(
//                 (_, index) =>
//                   index !==
//                   imageIndex
//               ),
//           })
//         );

//         setPropertySubPreviews(
//           (prev) => ({
//             ...prev,

//             [globalIndex]:
//               (
//                 prev[
//                   globalIndex
//                 ] || []
//               ).filter(
//                 (_, index) =>
//                   index !==
//                   imageIndex
//               ),
//           })
//         );
//       };

//     // =======================================================
//     // DELETE PROPERTY
//     // =======================================================

//     const removeProperty = (
//       globalIndex
//     ) => {
//       const confirmed =
//         window.confirm(
//           "Are you sure you want to delete this property?"
//         );

//       if (!confirmed) {
//         return;
//       }

//       setContent((prev) => ({
//         ...prev,

//         sliderProperties:
//           prev.sliderProperties.filter(
//             (_, index) =>
//               index !==
//               globalIndex
//           ),
//       }));

//       // Shift image state indexes
//       // so remaining properties
//       // keep correct files/previews.

//       setPropertyMainFiles(
//         (prev) =>
//           removeIndexAndShift(
//             prev,
//             globalIndex
//           )
//       );

//       setPropertyMainPreviews(
//         (prev) =>
//           removeIndexAndShift(
//             prev,
//             globalIndex
//           )
//       );

//       setPropertySubFiles(
//         (prev) =>
//           removeIndexAndShift(
//             prev,
//             globalIndex
//           )
//       );

//       setPropertySubPreviews(
//         (prev) =>
//           removeIndexAndShift(
//             prev,
//             globalIndex
//           )
//       );

//       // If current page becomes
//       // empty after delete,
//       // move to previous page.

//       setTimeout(() => {
//         setCurrentPage(
//           (page) => {
//             const newTotal =
//               content
//                 .sliderProperties
//                 .length - 1;

//             const newTotalPages =
//               Math.max(
//                 1,
//                 Math.ceil(
//                   newTotal /
//                     ITEMS_PER_PAGE
//                 )
//               );

//             return Math.min(
//               page,
//               newTotalPages
//             );
//           }
//         );
//       }, 0);
//     };

//     // =======================================================
//     // SAVE PROPERTIES
//     // =======================================================

//     const saveProperties =
//       async () => {
//         try {
//           setSaving(true);
//           setMessage("");
//           setError("");

//           const formData =
//             new FormData();

//           // -------------------------------------------------
//           // PREPARE PROPERTIES
//           // -------------------------------------------------

//           const properties =
//             content.sliderProperties.map(
//               (property) => {
//                 // Convert the text input
//                 // into MongoDB array only
//                 // during save.

//                 const sizes =
//                   (
//                     property.sizesInput ??
//                     ""
//                   )
//                     .split(",")
//                     .map((item) =>
//                       item.trim()
//                     )
//                     .filter(Boolean);

//                 return {
//                   _id:
//                     property._id,

//                   id: property.id,

//                   title:
//                     property.title ||
//                     "",

//                   category:
//                     property.category ||
//                     "",

//                   mainImage:
//                     property.mainImage ||
//                     "",

//                   subImages:
//                     Array.isArray(
//                       property.subImages
//                     )
//                       ? property.subImages.slice(
//                           0,
//                           4
//                         )
//                       : [],

//                   size:
//                     property.size ||
//                     "",

//                   sizes,

//                   price:
//                     property.price ||
//                     "",

//                   oldPrice:
//                     property.oldPrice ||
//                     "",

//                   description:
//                     property.description ||
//                     "",
//                 };
//               }
//             );

//           // -------------------------------------------------
//           // KEEP EXISTING SECTION DATA
//           // -------------------------------------------------

//           formData.append(
//             "content",
//             JSON.stringify({
//               title:
//                 content.title ||
//                 "",

//               topDescription:
//                 content.topDescription ||
//                 "",

//               mainImage:
//                 content.mainImage ||
//                 "",

//               bottomDescription:
//                 content.bottomDescription ||
//                 "",

//               sliderProperties:
//                 properties,
//             })
//           );

//           // -------------------------------------------------
//           // PROPERTY MAIN IMAGES
//           // -------------------------------------------------

//           Object.entries(
//             propertyMainFiles
//           ).forEach(
//             ([index, file]) => {
//               if (file) {
//                 formData.append(
//                   `sliderMainImage_${index}`,
//                   file
//                 );
//               }
//             }
//           );

//           // -------------------------------------------------
//           // PROPERTY SUB IMAGES
//           // -------------------------------------------------

//           Object.entries(
//             propertySubFiles
//           ).forEach(
//             ([index, files]) => {
//               files.forEach(
//                 (file) => {
//                   formData.append(
//                     `sliderSubImages_${index}`,
//                     file
//                   );
//                 }
//               );
//             }
//           );

//           // -------------------------------------------------
//           // API REQUEST
//           // -------------------------------------------------

//           const response =
//             await fetch(
//               API_URL,
//               {
//                 method: "POST",

//                 headers: {
//                   ...getAuthHeaders(),
//                 },

//                 body: formData,
//               }
//             );

//           const result =
//             await response.json();

//           if (!response.ok) {
//             throw new Error(
//               result.message ||
//                 "Failed to save Spacious Living properties"
//             );
//           }

//           // -------------------------------------------------
//           // IMPORTANT: RE-FETCH /my AFTER SAVE
//           // This guarantees that a SubAdmin only receives
//           // properties owned by the logged-in SubAdmin.
//           // Never put the complete POST response directly
//           // into the SubAdmin state.
//           // -------------------------------------------------

//           await fetchContent();

//           // -------------------------------------------------
//           // CLEAR TEMP FILE STATES
//           // -------------------------------------------------

//           setPropertyMainFiles(
//             {}
//           );

//           setPropertyMainPreviews(
//             {}
//           );

//           setPropertySubFiles(
//             {}
//           );

//           setPropertySubPreviews(
//             {}
//           );

//           setCurrentPage(1);

//           setMessage(
//             "Properties saved successfully."
//           );

//           window.scrollTo({
//             top: 0,

//             behavior: "smooth",
//           });
//         } catch (err) {
//           console.error(err);

//           setError(
//             err.message ||
//               "Failed to save Spacious Living properties."
//           );
//         } finally {
//           setSaving(false);
//         }
//       };

//     // =======================================================
//     // LOADING
//     // =======================================================

//     if (loading) {
//       return (
//         <main className="spacious-admin-page">
//           <div className="spacious-admin-card">
//             <h2>
//               Loading Properties...
//             </h2>
//           </div>
//         </main>
//       );
//     }

//     // =======================================================
//     // JSX
//     // =======================================================

//     return (
//       <main className="spacious-admin-page">

//         {/* =================================================
//             HEADER
//         ================================================= */}

//         <div className="spacious-admin-header">

//           <div>
//             <h1>
//               Spacious Living Properties
//             </h1>

//             <p>
//               Add and manage properties
//               only.
//             </p>
//           </div>

//           <button
//             type="button"
//             className="spacious-save-btn"
//             onClick={
//               saveProperties
//             }
//             disabled={saving}
//           >
//             {saving
//               ? "Saving..."
//               : "Save Properties"}
//           </button>

//         </div>

//         {/* =================================================
//             MESSAGE
//         ================================================= */}

//         {message && (
//           <div className="spacious-admin-message">
//             {message}
//           </div>
//         )}

//         {error && (
//           <div className="spacious-admin-error">
//             {error}
//           </div>
//         )}

//         {/* =================================================
//             PROPERTIES
//         ================================================= */}

//         <section className="spacious-admin-card">

//           {/* HEADER */}

//           <div className="spacious-admin-card-header">

//             <div>
//               <h2>
//                 Properties
//               </h2>

//               <p>
//                 Add property details,
//                 pricing and images.
//               </p>
//             </div>

//             <button
//               type="button"
//               className="spacious-add-btn"
//               onClick={
//                 addProperty
//               }
//               disabled={saving}
//             >
//               + Add Property
//             </button>

//           </div>

//           {/* =================================================
//               PAGINATION RESULT
//           ================================================= */}

//           {content
//             .sliderProperties
//             .length > 0 && (
//             <div className="spacious-pagination-result">

//               Showing{" "}

//               <strong>
//                 {startIndex + 1}
//               </strong>

//               {" - "}

//               <strong>
//                 {Math.min(
//                   startIndex +
//                     ITEMS_PER_PAGE,
//                   content
//                     .sliderProperties
//                     .length
//                 )}
//               </strong>

//               {" of "}

//               <strong>
//                 {
//                   content
//                     .sliderProperties
//                     .length
//                 }
//               </strong>

//               {" properties"}

//             </div>
//           )}

//           {/* =================================================
//               PROPERTY LIST
//           ================================================= */}

//           <div className="spacious-properties-list">

//             {currentProperties.map(
//               (
//                 property,
//                 localIndex
//               ) => {
//                 const globalIndex =
//                   startIndex +
//                   localIndex;

//                 const mainPreview =
//                   propertyMainPreviews[
//                     globalIndex
//                   ] ||
//                   getImageUrl(
//                     property.mainImage
//                   );

//                 const newSubFiles =
//                   propertySubFiles[
//                     globalIndex
//                   ] || [];

//                 const newSubPreviews =
//                   propertySubPreviews[
//                     globalIndex
//                   ] || [];

//                 return (
//                   <div
//                     className="spacious-property-admin-card"
//                     key={
//                       property._id ||
//                       property.id ||
//                       `property-${globalIndex}`
//                     }
//                   >

//                     {/* ======================================
//                         PROPERTY HEADER
//                     ====================================== */}

//                     <div className="spacious-property-admin-header">

//                       <h3>
//                         Property{" "}
//                         {globalIndex +
//                           1}
//                       </h3>

//                       <button
//                         type="button"
//                         className="spacious-delete-btn"
//                         onClick={() =>
//                           removeProperty(
//                             globalIndex
//                           )
//                         }
//                         disabled={
//                           saving
//                         }
//                       >
//                         Delete
//                       </button>

//                     </div>

//                     {/* ======================================
//                         PROPERTY BODY
//                     ====================================== */}

//                     <div className="spacious-property-admin-body">

//                       {/* ====================================
//                           MAIN IMAGE
//                       ==================================== */}

//                       <div className="spacious-property-admin-image">

//                         {mainPreview ? (
//                           <img
//                             src={
//                               mainPreview
//                             }
//                             alt={
//                               property.title ||
//                               "Property"
//                             }
//                           />
//                         ) : (
//                           <div>
//                             No main image
//                           </div>
//                         )}

//                         <input
//                           type="file"
//                           accept="image/*"
//                           onChange={(
//                             e
//                           ) =>
//                             handlePropertyMainImage(
//                               globalIndex,
//                               e
//                             )
//                           }
//                         />

//                       </div>

//                       {/* ====================================
//                           FIELDS
//                       ==================================== */}

//                       <div className="spacious-property-admin-fields">

//                         {/* PROPERTY TITLE */}

//                         <div className="spacious-form-group">

//                           <label>
//                             Property Title
//                           </label>

//                           <input
//                             type="text"
//                             value={
//                               property.title
//                             }
//                             onChange={(
//                               e
//                             ) =>
//                               updateProperty(
//                                 globalIndex,
//                                 "title",
//                                 e
//                                   .target
//                                   .value
//                               )
//                             }
//                             placeholder="Enter property title"
//                           />

//                         </div>

//                         {/* CATEGORY */}

//                         <div className="spacious-form-group">

//                           <label>
//                             Category
//                           </label>

//                           <input
//                             type="text"
//                             value={
//                               property.category
//                             }
//                             onChange={(
//                               e
//                             ) =>
//                               updateProperty(
//                                 globalIndex,
//                                 "category",
//                                 e
//                                   .target
//                                   .value
//                               )
//                             }
//                             placeholder="Villa / Apartment / House"
//                           />

//                         </div>

//                         {/* DEFAULT SIZE */}

//                         <div className="spacious-form-group">

//                           <label>
//                             Default Size
//                           </label>

//                           <input
//                             type="text"
//                             value={
//                               property.size
//                             }
//                             onChange={(
//                               e
//                             ) =>
//                               updateProperty(
//                                 globalIndex,
//                                 "size",
//                                 e
//                                   .target
//                                   .value
//                               )
//                             }
//                             placeholder="1200 sq ft"
//                           />

//                         </div>

//                         {/* AVAILABLE SIZES */}

//                         <div className="spacious-form-group">

//                           <label>
//                             Available Sizes
//                           </label>

//                           <input
//                             type="text"
//                             value={
//                               property.sizesInput ??
//                               property.sizes.join(
//                                 ", "
//                               )
//                             }
//                             onChange={(
//                               e
//                             ) =>
//                               handleSizesChange(
//                                 globalIndex,
//                                 e
//                                   .target
//                                   .value
//                               )
//                             }
//                             placeholder="1200 sq ft, 1400 sq ft"
//                           />

//                           <small>
//                             Separate sizes
//                             with comma.
//                           </small>

//                         </div>

//                         {/* PRICE */}

//                         <div className="spacious-form-group">

//                           <label>
//                             Price
//                           </label>

//                           <input
//                             type="text"
//                             value={
//                               property.price
//                             }
//                             onChange={(
//                               e
//                             ) =>
//                               updateProperty(
//                                 globalIndex,
//                                 "price",
//                                 e
//                                   .target
//                                   .value
//                               )
//                             }
//                             placeholder="₹ 25,00,000"
//                           />

//                         </div>

//                         {/* OLD PRICE */}

//                         <div className="spacious-form-group">

//                           <label>
//                             Old Price
//                           </label>

//                           <input
//                             type="text"
//                             value={
//                               property.oldPrice
//                             }
//                             onChange={(
//                               e
//                             ) =>
//                               updateProperty(
//                                 globalIndex,
//                                 "oldPrice",
//                                 e
//                                   .target
//                                   .value
//                               )
//                             }
//                             placeholder="₹ 28,00,000"
//                           />

//                         </div>

//                         {/* DESCRIPTION */}

//                         <div className="spacious-form-group spacious-full-width">

//                           <label>
//                             Description
//                           </label>

//                           <textarea
//                             rows="4"
//                             value={
//                               property.description
//                             }
//                             onChange={(
//                               e
//                             ) =>
//                               updateProperty(
//                                 globalIndex,
//                                 "description",
//                                 e
//                                   .target
//                                   .value
//                               )
//                             }
//                             placeholder="Enter property description"
//                           />

//                         </div>

//                         {/* ==================================
//                             SUB IMAGES
//                         ================================== */}

//                         <div className="spacious-form-group spacious-full-width">

//                           <label>
//                             Sub Images —
//                             Maximum 4
//                           </label>

//                           {/* EXISTING SUB IMAGES */}

//                           {property
//                             .subImages
//                             .length >
//                             0 && (
//                             <div className="spacious-subimage-grid">

//                               {property.subImages
//                                 .slice(
//                                   0,
//                                   4
//                                 )
//                                 .map(
//                                   (
//                                     image,
//                                     imageIndex
//                                   ) => (
//                                     <div
//                                       className="spacious-subimage-item"
//                                       key={`${image}-${imageIndex}`}
//                                     >

//                                       <img
//                                         src={getImageUrl(
//                                           image
//                                         )}
//                                         alt={`Sub ${
//                                           imageIndex +
//                                           1
//                                         }`}
//                                       />

//                                       <button
//                                         type="button"
//                                         onClick={() =>
//                                           removeExistingSubImage(
//                                             globalIndex,
//                                             imageIndex
//                                           )
//                                         }
//                                       >
//                                         ×
//                                       </button>

//                                     </div>
//                                   )
//                                 )}

//                             </div>
//                           )}

//                           {/* NEW SUB IMAGES */}

//                           {newSubPreviews
//                             .length >
//                             0 && (
//                             <div className="spacious-subimage-grid">

//                               {newSubPreviews.map(
//                                 (
//                                   preview,
//                                   imageIndex
//                                 ) => (
//                                   <div
//                                     className="spacious-subimage-item"
//                                     key={`${preview}-${imageIndex}`}
//                                   >

//                                     <img
//                                       src={
//                                         preview
//                                       }
//                                       alt={`New ${
//                                         imageIndex +
//                                         1
//                                       }`}
//                                     />

//                                     <button
//                                       type="button"
//                                       onClick={() =>
//                                         removeNewSubImage(
//                                           globalIndex,
//                                           imageIndex
//                                         )
//                                       }
//                                     >
//                                       ×
//                                     </button>

//                                   </div>
//                                 )
//                               )}

//                             </div>
//                           )}

//                           {/* UPLOAD */}

//                           {property
//                             .subImages
//                             .length +
//                             newSubFiles.length <
//                             4 && (
//                             <input
//                               type="file"
//                               multiple
//                               accept="image/*"
//                               onChange={(
//                                 e
//                               ) =>
//                                 handleSubImages(
//                                   globalIndex,
//                                   e
//                                 )
//                               }
//                             />
//                           )}

//                           <small>
//                             You can upload
//                             up to 4 sub
//                             images total.
//                           </small>

//                         </div>

//                       </div>

//                     </div>

//                   </div>
//                 );
//               }
//             )}

//           </div>

//           {/* =================================================
//               EMPTY STATE
//           ================================================= */}

//           {content
//             .sliderProperties
//             .length === 0 && (
//             <div className="spacious-empty-property">
//               No properties yet.
//               Click "+ Add Property"
//               to add one.
//             </div>
//           )}

//           {/* =================================================
//               PAGINATION
//           ================================================= */}

//           {totalPages > 1 && (
//             <div className="spacious-pagination">

//               {/* PREVIOUS */}

//               <button
//                 type="button"
//                 disabled={
//                   currentPage === 1
//                 }
//                 onClick={() =>
//                   setCurrentPage(
//                     (page) =>
//                       page - 1
//                   )
//                 }
//               >
//                 ← Prev
//               </button>

//               {/* PAGE NUMBERS */}

//               {Array.from(
//                 {
//                   length:
//                     totalPages,
//                 },
//                 (_, index) =>
//                   index + 1
//               ).map(
//                 (page) => (
//                   <button
//                     type="button"
//                     key={page}
//                     className={
//                       currentPage ===
//                       page
//                         ? "active"
//                         : ""
//                     }
//                     onClick={() =>
//                       setCurrentPage(
//                         page
//                       )
//                     }
//                   >
//                     {page}
//                   </button>
//                 )
//               )}

//               {/* NEXT */}

//               <button
//                 type="button"
//                 disabled={
//                   currentPage ===
//                   totalPages
//                 }
//                 onClick={() =>
//                   setCurrentPage(
//                     (page) =>
//                       page + 1
//                   )
//                 }
//               >
//                 Next →
//               </button>

//             </div>
//           )}

//         </section>

//         {/* =================================================
//             BOTTOM SAVE
//         ================================================= */}

//         <div className="spacious-admin-bottom-actions">

//           <button
//             type="button"
//             className="spacious-save-btn"
//             onClick={
//               saveProperties
//             }
//             disabled={saving}
//           >
//             {saving
//               ? "Saving..."
//               : "Save Properties"}
//           </button>

//         </div>

//       </main>
//     );
//   };

// export default SpaciousLivingSubAdmin;




import React, {
  useEffect,
  useMemo,
  useState,
} from "react";


const API_URL =
  "http://localhost:5000/api/spacious-living";

const SERVER_URL =
  "http://localhost:5000";

const ITEMS_PER_PAGE = 4;

// =========================================================
// EMPTY CONTENT
// =========================================================

const EMPTY_CONTENT = {
  title: "",
  topDescription: "",
  mainImage: "",
  bottomDescription: "",
  sliderProperties: [],
};

// =========================================================
// EMPTY PROPERTY
// =========================================================

const EMPTY_PROPERTY = {
  title: "",
  category: "",
  mainImage: "",
  subImages: [],
  size: "",
  sizes: [],
  sizesInput: "",
  price: "",
  oldPrice: "",
  description: "",
  totalUnits: 1,
  availableUnits: 1,
  bookedUnits: 0,
};

// =========================================================
// AUTH HEADER
// =========================================================

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("adminToken") ||
    localStorage.getItem("accessToken");

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

// =========================================================
// REMOVE INDEX AND SHIFT
// =========================================================

const removeIndexAndShift = (
  state,
  deletedIndex
) => {
  const next = {};

  Object.entries(state).forEach(
    ([key, value]) => {
      const index = Number(key);

      if (index === deletedIndex) {
        return;
      }

      next[
        index > deletedIndex
          ? index - 1
          : index
      ] = value;
    }
  );

  return next;
};

// =========================================================
// IMAGE URL
// =========================================================

const getImageUrl = (image) => {
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

  return image.startsWith("/uploads/")
    ? `${SERVER_URL}${image}`
    : image;
};

// =========================================================
// NORMALIZE PROPERTY
// =========================================================

const normalizeProperty = (
  property = {}
) => {
  const sizes = Array.isArray(
    property.sizes
  )
    ? property.sizes
    : property.size
    ? [property.size]
    : [];

  return {
    _id: property._id,

    id: property.id,

    title:
      property.title || "",

    category:
      property.category || "",

    mainImage:
      property.mainImage ||
      property.image ||
      "",

    subImages:
      Array.isArray(
        property.subImages
      )
        ? property.subImages.slice(
            0,
            4
          )
        : [],

    size:
      property.size || "",

    sizes,

    // Keep raw input separately.
    // This allows spaces and commas
    // while typing.
    sizesInput:
      sizes.join(", "),

    price:
      property.price || "",

    oldPrice:
      property.oldPrice || "",

    description:
      property.description || "",

    totalUnits:
      Number(property.totalUnits ?? 1),

    availableUnits:
      Number(property.availableUnits ?? 1),

    bookedUnits:
      Number(property.bookedUnits ?? 0),
  };
};

// =========================================================
// COMPONENT
// =========================================================

const SpaciousLivingSubAdmin =
  () => {
    // =======================================================
    // STATES
    // =======================================================

    const [content, setContent] =
      useState(EMPTY_CONTENT);

    const [
      propertyMainFiles,
      setPropertyMainFiles,
    ] = useState({});

    const [
      propertyMainPreviews,
      setPropertyMainPreviews,
    ] = useState({});

    const [
      propertySubFiles,
      setPropertySubFiles,
    ] = useState({});

    const [
      propertySubPreviews,
      setPropertySubPreviews,
    ] = useState({});

    const [
      currentPage,
      setCurrentPage,
    ] = useState(1);

    const [loading, setLoading] =
      useState(true);

    const [saving, setSaving] =
      useState(false);

    const [message, setMessage] =
      useState("");

    const [error, setError] =
      useState("");

    // =======================================================
    // FETCH SUBADMIN DATA
    // =======================================================

    const fetchContent =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await fetch(
              `${API_URL}/my`,
              {
                method: "GET",

                headers: {
                  ...getAuthHeaders(),
                },
              }
            );

          const result =
            await response.json();

          if (!response.ok) {
            throw new Error(
              result.message ||
                "Failed to fetch Spacious Living"
            );
          }

          const data =
            result?.success
              ? result.data
              : result;

          if (!data) {
            setContent({
              ...EMPTY_CONTENT,
            });

            return;
          }

          setContent({
            title:
              data.title || "",

            topDescription:
              data.topDescription ||
              "",

            mainImage:
              data.mainImage || "",

            bottomDescription:
              data.bottomDescription ||
              "",

            sliderProperties:
              Array.isArray(
                data.sliderProperties
              )
                ? data.sliderProperties.map(
                    normalizeProperty
                  )
                : [],
          });
        } catch (err) {
          console.error(err);

          setError(
            err.message ||
              "Failed to load Spacious Living."
          );
        } finally {
          setLoading(false);
        }
      };

    // =======================================================
    // INITIAL LOAD
    // =======================================================

    useEffect(() => {
      fetchContent();
    }, []);

    // =======================================================
    // PAGINATION
    // =======================================================

    const totalPages =
      Math.max(
        1,
        Math.ceil(
          content.sliderProperties
            .length /
            ITEMS_PER_PAGE
        )
      );

    useEffect(() => {
      if (
        currentPage >
        totalPages
      ) {
        setCurrentPage(
          totalPages
        );
      }
    }, [
      currentPage,
      totalPages,
    ]);

    const startIndex =
      (currentPage - 1) *
      ITEMS_PER_PAGE;

    const currentProperties =
      useMemo(
        () =>
          content.sliderProperties.slice(
            startIndex,
            startIndex +
              ITEMS_PER_PAGE
          ),
        [
          content.sliderProperties,
          startIndex,
        ]
      );

    // =======================================================
    // ADD PROPERTY
    // =======================================================

    const insertIndexAndShift = (
      state,
      insertedIndex
    ) => {
      const next = {};

      Object.entries(state).forEach(
        ([key, value]) => {
          const index = Number(key);

          next[
            index >= insertedIndex
              ? index + 1
              : index
          ] = value;
        }
      );

      return next;
    };

    const addProperty = () => {
      // New property must ALWAYS become Property 1.
      // Existing properties shift one position/page forward.

      setContent((prev) => ({
        ...prev,

        sliderProperties: [
          {
            ...EMPTY_PROPERTY,
            sizes: [],
            sizesInput: "",
            subImages: [],
          },

          ...prev.sliderProperties,
        ],
      }));

      // Shift temporary image/file states because every
      // existing property moves from index N to N + 1.

      setPropertyMainFiles((prev) =>
        insertIndexAndShift(prev, 0)
      );

      setPropertyMainPreviews((prev) =>
        insertIndexAndShift(prev, 0)
      );

      setPropertySubFiles((prev) =>
        insertIndexAndShift(prev, 0)
      );

      setPropertySubPreviews((prev) =>
        insertIndexAndShift(prev, 0)
      );

      // Always show the newly added Property 1.
      setCurrentPage(1);

      setMessage("");
      setError("");
    };

    // =======================================================
    // UPDATE PROPERTY
    // =======================================================

    const updateProperty = (
      index,
      field,
      value
    ) => {
      setContent((prev) => {
        const properties = [
          ...prev.sliderProperties,
        ];

        properties[index] = {
          ...properties[index],
          [field]: value,
        };

        return {
          ...prev,

          sliderProperties:
            properties,
        };
      });
    };

    // =======================================================
    // AVAILABLE SIZES
    // =======================================================

    const handleSizesChange = (
      index,
      value
    ) => {
      // IMPORTANT:
      // Do NOT split / trim here.
      // Keep exact text while typing.
      updateProperty(
        index,
        "sizesInput",
        value
      );
    };

    // =======================================================
    // CONVERT SIZES ON BLUR
    // =======================================================

    const handleSizesBlur = (
      index
    ) => {
      setContent((prev) => {
        const properties = [
          ...prev.sliderProperties,
        ];

        const property =
          properties[index];

        const rawValue =
          property.sizesInput ??
          "";

        const sizes =
          rawValue
            .split(",")
            .map((item) =>
              item.trim()
            )
            .filter(Boolean);

        properties[index] = {
          ...property,

          sizes,
        };

        return {
          ...prev,

          sliderProperties:
            properties,
        };
      });
    };

    // =======================================================
    // PROPERTY MAIN IMAGE
    // =======================================================

    const handlePropertyMainImage =
      (
        globalIndex,
        event
      ) => {
        const file =
          event.target.files?.[0];

        if (!file) {
          return;
        }

        setPropertyMainFiles(
          (prev) => ({
            ...prev,

            [globalIndex]:
              file,
          })
        );

        setPropertyMainPreviews(
          (prev) => ({
            ...prev,

            [globalIndex]:
              URL.createObjectURL(
                file
              ),
          })
        );
      };

    // =======================================================
    // SUB IMAGES
    // =======================================================

    const handleSubImages = (
      globalIndex,
      event
    ) => {
      const selected =
        Array.from(
          event.target.files || []
        );

      if (
        !selected.length
      ) {
        return;
      }

      setPropertySubFiles(
        (prev) => {
          const existing =
            prev[globalIndex] ||
            [];

          return {
            ...prev,

            [globalIndex]: [
              ...existing,
              ...selected,
            ].slice(0, 4),
          };
        }
      );

      setPropertySubPreviews(
        (prev) => {
          const existing =
            prev[globalIndex] ||
            [];

          return {
            ...prev,

            [globalIndex]: [
              ...existing,

              ...selected.map(
                (file) =>
                  URL.createObjectURL(
                    file
                  )
              ),
            ].slice(0, 4),
          };
        }
      );

      event.target.value = "";
    };

    // =======================================================
    // REMOVE EXISTING SUB IMAGE
    // =======================================================

    const removeExistingSubImage =
      (
        globalIndex,
        imageIndex
      ) => {
        setContent((prev) => {
          const properties = [
            ...prev.sliderProperties,
          ];

          const property =
            properties[
              globalIndex
            ];

          if (!property) {
            return prev;
          }

          properties[
            globalIndex
          ] = {
            ...property,

            subImages:
              property.subImages.filter(
                (_, index) =>
                  index !==
                  imageIndex
              ),
          };

          return {
            ...prev,

            sliderProperties:
              properties,
          };
        });
      };

    // =======================================================
    // REMOVE NEW SUB IMAGE
    // =======================================================

    const removeNewSubImage =
      (
        globalIndex,
        imageIndex
      ) => {
        setPropertySubFiles(
          (prev) => ({
            ...prev,

            [globalIndex]:
              (
                prev[
                  globalIndex
                ] || []
              ).filter(
                (_, index) =>
                  index !==
                  imageIndex
              ),
          })
        );

        setPropertySubPreviews(
          (prev) => ({
            ...prev,

            [globalIndex]:
              (
                prev[
                  globalIndex
                ] || []
              ).filter(
                (_, index) =>
                  index !==
                  imageIndex
              ),
          })
        );
      };

    // =======================================================
    // DELETE PROPERTY
    // =======================================================

    const removeProperty = (
      globalIndex
    ) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to delete this property?"
        );

      if (!confirmed) {
        return;
      }

      setContent((prev) => ({
        ...prev,

        sliderProperties:
          prev.sliderProperties.filter(
            (_, index) =>
              index !==
              globalIndex
          ),
      }));

      setPropertyMainFiles(
        (prev) =>
          removeIndexAndShift(
            prev,
            globalIndex
          )
      );

      setPropertyMainPreviews(
        (prev) =>
          removeIndexAndShift(
            prev,
            globalIndex
          )
      );

      setPropertySubFiles(
        (prev) =>
          removeIndexAndShift(
            prev,
            globalIndex
          )
      );

      setPropertySubPreviews(
        (prev) =>
          removeIndexAndShift(
            prev,
            globalIndex
          )
      );

      setTimeout(() => {
        setCurrentPage(
          (page) => {
            const newTotal =
              content
                .sliderProperties
                .length - 1;

            const newTotalPages =
              Math.max(
                1,
                Math.ceil(
                  newTotal /
                    ITEMS_PER_PAGE
                )
              );

            return Math.min(
              page,
              newTotalPages
            );
          }
        );
      }, 0);
    };

    // =======================================================
    // SAVE PROPERTIES
    // =======================================================

    const saveProperties =
      async () => {
        try {
          setSaving(true);
          setMessage("");
          setError("");

          const formData =
            new FormData();

          const properties =
            content.sliderProperties.map(
              (property) => {
                const sizes =
                  (
                    property.sizesInput ??
                    ""
                  )
                    .split(",")
                    .map((item) =>
                      item.trim()
                    )
                    .filter(Boolean);

                return {
                  _id:
                    property._id,

                  id: property.id,

                  title:
                    property.title ||
                    "",

                  category:
                    property.category ||
                    "",

                  mainImage:
                    property.mainImage ||
                    "",

                  subImages:
                    Array.isArray(
                      property.subImages
                    )
                      ? property.subImages.slice(
                          0,
                          4
                        )
                      : [],

                  size:
                    property.size ||
                    "",

                  sizes,

                  price:
                    property.price ||
                    "",

                  oldPrice:
                    property.oldPrice ||
                    "",

                  description:
                    property.description ||
                    "",

                  totalUnits:
                    Number(
                      property.totalUnits ?? 1
                    ),

                  availableUnits:
                    Number(
                      property.availableUnits ?? 1
                    ),

                  bookedUnits:
                    Number(
                      property.bookedUnits ?? 0
                    ),
                };
              }
            );

          formData.append(
            "content",
            JSON.stringify({
              title:
                content.title ||
                "",

              topDescription:
                content.topDescription ||
                "",

              mainImage:
                content.mainImage ||
                "",

              bottomDescription:
                content.bottomDescription ||
                "",

              sliderProperties:
                properties,
            })
          );

          Object.entries(
            propertyMainFiles
          ).forEach(
            ([index, file]) => {
              if (file) {
                formData.append(
                  `sliderMainImage_${index}`,
                  file
                );
              }
            }
          );

          Object.entries(
            propertySubFiles
          ).forEach(
            ([index, files]) => {
              files.forEach(
                (file) => {
                  formData.append(
                    `sliderSubImages_${index}`,
                    file
                  );
                }
              );
            }
          );

          const response =
            await fetch(
              API_URL,
              {
                method: "POST",

                headers: {
                  ...getAuthHeaders(),
                },

                body: formData,
              }
            );

          const result =
            await response.json();

          if (!response.ok) {
            throw new Error(
              result.message ||
                "Failed to save Spacious Living properties"
            );
          }

          // IMPORTANT: Re-fetch /my after save — guarantees that
          // a SubAdmin only sees properties owned by themself.
          await fetchContent();

          setPropertyMainFiles(
            {}
          );

          setPropertyMainPreviews(
            {}
          );

          setPropertySubFiles(
            {}
          );

          setPropertySubPreviews(
            {}
          );

          setCurrentPage(1);

          setMessage(
            "Properties saved successfully."
          );

          window.scrollTo({
            top: 0,

            behavior: "smooth",
          });
        } catch (err) {
          console.error(err);

          setError(
            err.message ||
              "Failed to save Spacious Living properties."
          );
        } finally {
          setSaving(false);
        }
      };

    // =======================================================
    // LOADING
    // =======================================================

    if (loading) {
      return (
        <main className="spacious-admin-page">
          <div className="spacious-admin-card">
            <h2>
              Loading Properties...
            </h2>
          </div>
        </main>
      );
    }

    // =======================================================
    // JSX
    // =======================================================

    return (
      <main className="spacious-admin-page">

        <div className="spacious-admin-header">

          <div>
            <h1>
              Spacious Living Properties
            </h1>

            <p>
              Add and manage properties
              only.
            </p>
          </div>

          <button
            type="button"
            className="spacious-save-btn"
            onClick={
              saveProperties
            }
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Properties"}
          </button>

        </div>

        {message && (
          <div className="spacious-admin-message">
            {message}
          </div>
        )}

        {error && (
          <div className="spacious-admin-error">
            {error}
          </div>
        )}

        <section className="spacious-admin-card">

          <div className="spacious-admin-card-header">

            <div>
              <h2>
                Properties
              </h2>

              <p>
                Add property details,
                pricing and images.
              </p>
            </div>

            <button
              type="button"
              className="spacious-add-btn"
              onClick={
                addProperty
              }
              disabled={saving}
            >
              + Add Property
            </button>

          </div>

          {content
            .sliderProperties
            .length > 0 && (
            <div className="spacious-pagination-result">

              Showing{" "}

              <strong>
                {startIndex + 1}
              </strong>

              {" - "}

              <strong>
                {Math.min(
                  startIndex +
                    ITEMS_PER_PAGE,
                  content
                    .sliderProperties
                    .length
                )}
              </strong>

              {" of "}

              <strong>
                {
                  content
                    .sliderProperties
                    .length
                }
              </strong>

              {" properties"}

            </div>
          )}

          <div className="spacious-properties-list">

            {currentProperties.map(
              (
                property,
                localIndex
              ) => {
                const globalIndex =
                  startIndex +
                  localIndex;

                const mainPreview =
                  propertyMainPreviews[
                    globalIndex
                  ] ||
                  getImageUrl(
                    property.mainImage
                  );

                const newSubFiles =
                  propertySubFiles[
                    globalIndex
                  ] || [];

                const newSubPreviews =
                  propertySubPreviews[
                    globalIndex
                  ] || [];

                return (
                  <div
                    className="spacious-property-admin-card"
                    key={
                      property._id ||
                      property.id ||
                      `property-${globalIndex}`
                    }
                  >

                    <div className="spacious-property-admin-header">

                      <h3>
                        Property{" "}
                        {globalIndex +
                          1}
                      </h3>

                      <button
                        type="button"
                        className="spacious-delete-btn"
                        onClick={() =>
                          removeProperty(
                            globalIndex
                          )
                        }
                        disabled={
                          saving
                        }
                      >
                        Delete
                      </button>

                    </div>

                    <div className="spacious-property-admin-body">

                      <div className="spacious-property-admin-image">

                        {mainPreview ? (
                          <img
                            src={
                              mainPreview
                            }
                            alt={
                              property.title ||
                              "Property"
                            }
                          />
                        ) : (
                          <div>
                            No main image
                          </div>
                        )}

                        <input
                          type="file"
                          accept="image/*"
                          onChange={(
                            e
                          ) =>
                            handlePropertyMainImage(
                              globalIndex,
                              e
                            )
                          }
                        />

                      </div>

                      <div className="spacious-property-admin-fields">

                        <div className="spacious-form-group">

                          <label>
                            Property Title
                          </label>

                          <input
                            type="text"
                            value={
                              property.title
                            }
                            onChange={(
                              e
                            ) =>
                              updateProperty(
                                globalIndex,
                                "title",
                                e
                                  .target
                                  .value
                              )
                            }
                            placeholder="Enter property title"
                          />

                        </div>

                        <div className="spacious-form-group">

                          <label>
                            Category
                          </label>

                          <input
                            type="text"
                            value={
                              property.category
                            }
                            onChange={(
                              e
                            ) =>
                              updateProperty(
                                globalIndex,
                                "category",
                                e
                                  .target
                                  .value
                              )
                            }
                            placeholder="Villa / Apartment / House"
                          />

                        </div>

                        <div className="spacious-form-group">

                          <label>
                            Default Size
                          </label>

                          <input
                            type="text"
                            value={
                              property.size
                            }
                            onChange={(
                              e
                            ) =>
                              updateProperty(
                                globalIndex,
                                "size",
                                e
                                  .target
                                  .value
                              )
                            }
                            placeholder="1200 sq ft"
                          />

                        </div>

                        <div className="spacious-form-group">

                          <label>
                            Available Sizes
                          </label>

                          <input
                            type="text"
                            value={
                              property.sizesInput ??
                              property.sizes.join(
                                ", "
                              )
                            }
                            onChange={(
                              e
                            ) =>
                              handleSizesChange(
                                globalIndex,
                                e
                                  .target
                                  .value
                              )
                            }
                            onBlur={() =>
                              handleSizesBlur(
                                globalIndex
                              )
                            }
                            placeholder="1200 sq ft, 1400 sq ft"
                          />

                          <small>
                            Separate sizes
                            with comma.
                          </small>

                        </div>

                        <div className="spacious-form-group">

                          <label>
                            Price
                          </label>

                          <input
                            type="text"
                            value={
                              property.price
                            }
                            onChange={(
                              e
                            ) =>
                              updateProperty(
                                globalIndex,
                                "price",
                                e
                                  .target
                                  .value
                              )
                            }
                            placeholder="₹ 25,00,000"
                          />

                        </div>

                        <div className="spacious-form-group">

                          <label>
                            Old Price
                          </label>

                          <input
                            type="text"
                            value={
                              property.oldPrice
                            }
                            onChange={(
                              e
                            ) =>
                              updateProperty(
                                globalIndex,
                                "oldPrice",
                                e
                                  .target
                                  .value
                              )
                            }
                            placeholder="₹ 28,00,000"
                          />

                        </div>

                        {/* FIX: Units fields added, matching schema */}

                        <div className="spacious-form-group">

                          <label>
                            Total Units
                          </label>

                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={
                              property.totalUnits ?? 1
                            }
                            onChange={(e) =>
                              updateProperty(
                                globalIndex,
                                "totalUnits",
                                Number(e.target.value)
                              )
                            }
                          />

                        </div>

                        <div className="spacious-form-group">

                          <label>
                            Available Units
                          </label>

                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={
                              property.availableUnits ?? 1
                            }
                            onChange={(e) =>
                              updateProperty(
                                globalIndex,
                                "availableUnits",
                                Number(e.target.value)
                              )
                            }
                          />

                        </div>

                        <div className="spacious-form-group">

                          <label>
                            Booked Units
                          </label>

                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={
                              property.bookedUnits ?? 0
                            }
                            onChange={(e) =>
                              updateProperty(
                                globalIndex,
                                "bookedUnits",
                                Number(e.target.value)
                              )
                            }
                          />

                        </div>

                        <div className="spacious-form-group spacious-full-width">

                          <label>
                            Description
                          </label>

                          <textarea
                            rows="4"
                            value={
                              property.description
                            }
                            onChange={(
                              e
                            ) =>
                              updateProperty(
                                globalIndex,
                                "description",
                                e
                                  .target
                                  .value
                              )
                            }
                            placeholder="Enter property description"
                          />

                        </div>

                        <div className="spacious-form-group spacious-full-width">

                          <label>
                            Sub Images —
                            Maximum 4
                          </label>

                          {property
                            .subImages
                            .length >
                            0 && (
                            <div className="spacious-subimage-grid">

                              {property.subImages
                                .slice(
                                  0,
                                  4
                                )
                                .map(
                                  (
                                    image,
                                    imageIndex
                                  ) => (
                                    <div
                                      className="spacious-subimage-item"
                                      key={`${image}-${imageIndex}`}
                                    >

                                      <img
                                        src={getImageUrl(
                                          image
                                        )}
                                        alt={`Sub ${
                                          imageIndex +
                                          1
                                        }`}
                                      />

                                      <button
                                        type="button"
                                        onClick={() =>
                                          removeExistingSubImage(
                                            globalIndex,
                                            imageIndex
                                          )
                                        }
                                      >
                                        ×
                                      </button>

                                    </div>
                                  )
                                )}

                            </div>
                          )}

                          {newSubPreviews
                            .length >
                            0 && (
                            <div className="spacious-subimage-grid">

                              {newSubPreviews.map(
                                (
                                  preview,
                                  imageIndex
                                ) => (
                                  <div
                                    className="spacious-subimage-item"
                                    key={`${preview}-${imageIndex}`}
                                  >

                                    <img
                                      src={
                                        preview
                                      }
                                      alt={`New ${
                                        imageIndex +
                                        1
                                      }`}
                                    />

                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeNewSubImage(
                                          globalIndex,
                                          imageIndex
                                        )
                                      }
                                    >
                                      ×
                                    </button>

                                  </div>
                                )
                              )}

                            </div>
                          )}

                          {property
                            .subImages
                            .length +
                            newSubFiles.length <
                            4 && (
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(
                                e
                              ) =>
                                handleSubImages(
                                  globalIndex,
                                  e
                                )
                              }
                            />
                          )}

                          <small>
                            You can upload
                            up to 4 sub
                            images total.
                          </small>

                        </div>

                      </div>

                    </div>

                  </div>
                );
              }
            )}

          </div>

          {content
            .sliderProperties
            .length === 0 && (
            <div className="spacious-empty-property">
              No properties yet.
              Click "+ Add Property"
              to add one.
            </div>
          )}

          {totalPages > 1 && (
            <div className="spacious-pagination">

              <button
                type="button"
                disabled={
                  currentPage === 1
                }
                onClick={() =>
                  setCurrentPage(
                    (page) =>
                      page - 1
                  )
                }
              >
                ← Prev
              </button>

              {Array.from(
                {
                  length:
                    totalPages,
                },
                (_, index) =>
                  index + 1
              ).map(
                (page) => (
                  <button
                    type="button"
                    key={page}
                    className={
                      currentPage ===
                      page
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setCurrentPage(
                        page
                      )
                    }
                  >
                    {page}
                  </button>
                )
              )}

              <button
                type="button"
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (page) =>
                      page + 1
                  )
                }
              >
                Next →
              </button>

            </div>
          )}

        </section>

        <div className="spacious-admin-bottom-actions">

          <button
            type="button"
            className="spacious-save-btn"
            onClick={
              saveProperties
            }
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Properties"}
          </button>

        </div>

      </main>
    );
  };

export default SpaciousLivingSubAdmin;