


// import React, { useEffect, useMemo, useState } from "react";
// import "./SpaciousLivingAdmin.css";

// const API_URL = "http://localhost:5000/api/spacious-living";
// const SERVER_URL = "http://localhost:5000";

// const getAuthHeaders = () => {
//   const token =
//     localStorage.getItem("token") ||
//     localStorage.getItem("adminToken") ||
//     localStorage.getItem("accessToken");

//   return token ? { Authorization: `Bearer ${token}` } : {};
// };

// const ITEMS_PER_PAGE = 4; // Screenshot mutabik ek page par 4 cards

// const EMPTY_CONTENT = {
//   title: "",
//   topDescription: "",
//   mainImage: "",
//   bottomDescription: "",
//   sliderProperties: [],
// };

// const EMPTY_PROPERTY = {
//   title: "",
//   category: "",
//   mainImage: "",
//   subImages: [],
//   size: "",
//   sizes: [],
//   price: "",
//   oldPrice: "",
//   description: "",
// };

// const removeIndexAndShift = (state, deletedIndex) => {
//   const next = {};

//   Object.entries(state).forEach(([key, value]) => {
//     const index = Number(key);

//     if (index === deletedIndex) return;

//     next[index > deletedIndex ? index - 1 : index] = value;
//   });

//   return next;
// };

// const getImageUrl = (image) => {
//   if (!image) return "";
//   if (
//     image.startsWith("http://") ||
//     image.startsWith("https://") ||
//     image.startsWith("data:")
//   ) {
//     return image;
//   }
//   return image.startsWith("/uploads/") ? `${SERVER_URL}${image}` : image;
// };

// const normalizeProperty = (property = {}) => ({
//   _id: property._id,
//   id: property.id,
//   title: property.title || "",
//   category: property.category || "",
//   mainImage: property.mainImage || property.image || "",
//   subImages: Array.isArray(property.subImages)
//     ? property.subImages.slice(0, 4)
//     : [],
//   size: property.size || "",
//   sizes: Array.isArray(property.sizes)
//     ? property.sizes
//     : property.size
//     ? [property.size]
//     : [],
//   price: property.price || "",
//   oldPrice: property.oldPrice || "",
//   description: property.description || "",
  
// });

// const SpaciousLivingAdmin = () => {
//   const [content, setContent] = useState(EMPTY_CONTENT);

//   const [mainImageFile, setMainImageFile] = useState(null);
//   const [mainImagePreview, setMainImagePreview] = useState("");

//   const [propertyMainFiles, setPropertyMainFiles] = useState({});
//   const [propertyMainPreviews, setPropertyMainPreviews] = useState({});

//   const [propertySubFiles, setPropertySubFiles] = useState({});
//   const [propertySubPreviews, setPropertySubPreviews] = useState({});

//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const fetchContent = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await fetch(API_URL, {
//         method: "GET",
//         headers: { ...getAuthHeaders() },
//       });
//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || "Failed to fetch Spacious Living");
//       }

//       const data = result?.success ? result.data : result;

//       if (!data) {
//         setContent({ ...EMPTY_CONTENT });
//         setMainImagePreview("");
//         return;
//       }

//       setContent({
//         title: data.title || "",
//         topDescription: data.topDescription || "",
//         mainImage: data.mainImage || "",
//         bottomDescription: data.bottomDescription || "",
//         sliderProperties: Array.isArray(data.sliderProperties)
//           ? data.sliderProperties.map(normalizeProperty)
//           : [],
//       });

//       setMainImagePreview(getImageUrl(data.mainImage || ""));
//     } catch (err) {
//       console.error(err);
//       setError(err.message || "Failed to load Spacious Living.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchContent();
//   }, []);

//   const totalPages = Math.max(
//     1,
//     Math.ceil(content.sliderProperties.length / ITEMS_PER_PAGE)
//   );

//   useEffect(() => {
//     if (currentPage > totalPages) {
//       setCurrentPage(totalPages);
//     }
//   }, [currentPage, totalPages]);

//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

//   const currentProperties = useMemo(
//     () =>
//       content.sliderProperties.slice(
//         startIndex,
//         startIndex + ITEMS_PER_PAGE
//       ),
//     [content.sliderProperties, startIndex]
//   );

//   const handleContentChange = (field, value) => {
//     setContent((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleMainImage = (event) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     setMainImageFile(file);
//     setMainImagePreview(URL.createObjectURL(file));
//   };

//   const addProperty = () => {
//     // New property must always be Property 1.
//     // Existing properties shift to the right.
//     setContent((prev) => ({
//       ...prev,
//       sliderProperties: [
//         {
//           ...EMPTY_PROPERTY,
//           sizes: [],
//           sizesInput: "",
//           subImages: [],
//         },
//         ...prev.sliderProperties,
//       ],
//     }));

//     // Always open page 1 after adding a new property.
//     setCurrentPage(1);

//     // Existing unsaved files/previews also shift by one index.
//     const shiftIndexes = (state) => {
//       const next = {};

//       Object.entries(state).forEach(([key, value]) => {
//         next[Number(key) + 1] = value;
//       });

//       return next;
//     };

//     setPropertyMainFiles(shiftIndexes);
//     setPropertyMainPreviews(shiftIndexes);
//     setPropertySubFiles(shiftIndexes);
//     setPropertySubPreviews(shiftIndexes);

//     setMessage("");
//     setError("");
//   };

//     const updateProperty = (index, field, value) => {
//     setContent((prev) => {
//       const properties = [...prev.sliderProperties];
//       properties[index] = { ...properties[index], [field]: value };
//       return { ...prev, sliderProperties: properties };
//     });
//   };

//   const handleSizesChange = (index, value) => {
//     const sizes = value
//       .split(",")
//       .map((item) => item.trim())
//       .filter(Boolean);
//     updateProperty(index, "sizes", sizes);
//   };

//   const handlePropertyMainImage = (globalIndex, event) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     setPropertyMainFiles((prev) => ({ ...prev, [globalIndex]: file }));
//     setPropertyMainPreviews((prev) => ({
//       ...prev,
//       [globalIndex]: URL.createObjectURL(file),
//     }));
//   };

//   const handleSubImages = (globalIndex, event) => {
//     const selected = Array.from(event.target.files || []);
//     if (!selected.length) return;

//     setPropertySubFiles((prev) => {
//       const existing = prev[globalIndex] || [];
//       return {
//         ...prev,
//         [globalIndex]: [...existing, ...selected].slice(0, 4),
//       };
//     });

//     setPropertySubPreviews((prev) => {
//       const existing = prev[globalIndex] || [];
//       return {
//         ...prev,
//         [globalIndex]: [
//           ...existing,
//           ...selected.map((file) => URL.createObjectURL(file)),
//         ].slice(0, 4),
//       };
//     });

//     event.target.value = "";
//   };

//   const removeExistingSubImage = (globalIndex, imageIndex) => {
//     setContent((prev) => {
//       const properties = [...prev.sliderProperties];
//       const property = properties[globalIndex];

//       properties[globalIndex] = {
//         ...property,
//         subImages: property.subImages.filter((_, index) => index !== imageIndex),
//       };

//       return { ...prev, sliderProperties: properties };
//     });
//   };

//   const removeNewSubImage = (globalIndex, imageIndex) => {
//     setPropertySubFiles((prev) => ({
//       ...prev,
//       [globalIndex]: (prev[globalIndex] || []).filter(
//         (_, index) => index !== imageIndex
//       ),
//     }));

//     setPropertySubPreviews((prev) => ({
//       ...prev,
//       [globalIndex]: (prev[globalIndex] || []).filter(
//         (_, index) => index !== imageIndex
//       ),
//     }));
//   };

//   const removeProperty = (globalIndex) => {
//     const confirmed = window.confirm(
//       "Are you sure you want to delete this property?"
//     );
//     if (!confirmed) return;

//     setContent((prev) => ({
//       ...prev,
//       sliderProperties: prev.sliderProperties.filter(
//         (_, index) => index !== globalIndex
//       ),
//     }));

//     // The remaining properties shift left after deletion.
//     // Keep all unsaved file/preview state attached to the same property.
//     setPropertyMainFiles((prev) =>
//       removeIndexAndShift(prev, globalIndex)
//     );

//     setPropertyMainPreviews((prev) =>
//       removeIndexAndShift(prev, globalIndex)
//     );

//     setPropertySubFiles((prev) =>
//       removeIndexAndShift(prev, globalIndex)
//     );

//     setPropertySubPreviews((prev) =>
//       removeIndexAndShift(prev, globalIndex)
//     );
//   };

//   const saveContent = async () => {
//     try {
//       setSaving(true);
//       setMessage("");
//       setError("");

//       const formData = new FormData();

//       const properties = content.sliderProperties.map((property) => ({
//         _id: property._id,
//         id: property.id,
//         title: property.title || "",
//         category: property.category || "",
//         mainImage: property.mainImage || "",
//         subImages: Array.isArray(property.subImages)
//           ? property.subImages.slice(0, 4)
//           : [],
//         size: property.size || "",
//         sizes: Array.isArray(property.sizes) ? property.sizes : [],
//         price: property.price || "",
//         oldPrice: property.oldPrice || "",
//         description: property.description || "",
//       }));

//       formData.append(
//         "content",
//         JSON.stringify({
//           title: content.title || "",
//           topDescription: content.topDescription || "",
//           mainImage: content.mainImage || "",
//           bottomDescription: content.bottomDescription || "",
//           sliderProperties: properties,
//         })
//       );

//       if (mainImageFile) {
//         formData.append("mainImage", mainImageFile);
//       }

//       Object.entries(propertyMainFiles).forEach(([index, file]) => {
//         if (file) {
//           formData.append(`sliderMainImage_${index}`, file);
//         }
//       });

//       Object.entries(propertySubFiles).forEach(([index, files]) => {
//         files.forEach((file) => {
//           formData.append(`sliderSubImages_${index}`, file);
//         });
//       });

//       const response = await fetch(API_URL, {
//         method: "POST",
//         headers: { ...getAuthHeaders() },
//         body: formData,
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || "Failed to save Spacious Living");
//       }

//       const savedData = result?.data || result;

//       setContent({
//         title: savedData.title || "",
//         topDescription: savedData.topDescription || "",
//         mainImage: savedData.mainImage || "",
//         bottomDescription: savedData.bottomDescription || "",
//         sliderProperties: Array.isArray(savedData.sliderProperties)
//           ? savedData.sliderProperties.map(normalizeProperty)
//           : [],
//       });

//       setMainImageFile(null);
//       setMainImagePreview(getImageUrl(savedData.mainImage || ""));
//       setPropertyMainFiles({});
//       setPropertyMainPreviews({});
//       setPropertySubFiles({});
//       setPropertySubPreviews({});
//       setCurrentPage(1);

//       setMessage("Spacious Living saved successfully.");
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     } catch (err) {
//       console.error(err);
//       setError(err.message || "Failed to save Spacious Living.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const resetContent = async () => {
//     const confirmed = window.confirm(
//       "Reset Spacious Living? This will clear all Spacious Living data."
//     );
//     if (!confirmed) return;

//     try {
//       setSaving(true);
//       setMessage("");
//       setError("");

//       const response = await fetch(API_URL, {
//         method: "DELETE",
//         headers: { ...getAuthHeaders() },
//       });

//       const result = await response.json();
//       if (!response.ok) {
//         throw new Error(result.message || "Failed to reset Spacious Living");
//       }

//       setContent({ ...EMPTY_CONTENT });
//       setMainImageFile(null);
//       setMainImagePreview("");
//       setPropertyMainFiles({});
//       setPropertyMainPreviews({});
//       setPropertySubFiles({});
//       setPropertySubPreviews({});
//       setCurrentPage(1);

//       setMessage("Spacious Living cleared successfully.");
//     } catch (err) {
//       console.error(err);
//       setError(err.message || "Failed to clear Spacious Living.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <main className="spacious-admin-page">
//         <div className="spacious-admin-card">
//           <h2>Loading Spacious Living...</h2>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="spacious-admin-page">
//       <div className="spacious-admin-header">
//         <div>
//           <h1>Spacious Living Management</h1>
//           <p>Manage section content, images and slider properties.</p>
//         </div>

//         <div className="spacious-admin-header-actions">
//           <button
//             type="button"
//             className="spacious-reset-btn"
//             onClick={resetContent}
//             disabled={saving}
//           >
//             Reset
//           </button>
//           <button
//             type="button"
//             className="spacious-save-btn"
//             onClick={saveContent}
//             disabled={saving}
//           >
//             {saving ? "Saving..." : "Save Changes"}
//           </button>
//         </div>
//       </div>

//       {message && <div className="spacious-admin-message">{message}</div>}
//       {error && <div className="spacious-admin-error">{error}</div>}

//       <section className="spacious-admin-card">
//         <div className="spacious-admin-card-header">
//           <div>
//             <h2>Section Content</h2>
//             <p>These values are stored in MongoDB.</p>
//           </div>
//         </div>

//         <div className="spacious-section-fields">
//           <div className="spacious-form-group">
//             <label>Title</label>
//             <input
//               type="text"
//               value={content.title}
//               onChange={(e) => handleContentChange("title", e.target.value)}
//             />
//           </div>

//           <div className="spacious-form-group">
//             <label>Top Description</label>
//             <textarea
//               value={content.topDescription}
//               onChange={(e) =>
//                 handleContentChange("topDescription", e.target.value)
//               }
//               rows="4"
//             />
//           </div>

//           <div className="spacious-form-group">
//             <label>Main Image</label>
//             {mainImagePreview && (
//               <img
//                 src={mainImagePreview}
//                 alt="Main"
//                 className="spacious-main-image-preview"
//               />
//             )}
//             <input
//               id="spacious-main-image-input"
//               type="file"
//               accept="image/*"
//               onChange={handleMainImage}
//             />
//           </div>

//           <div className="spacious-form-group">
//             <label>Bottom Description</label>
//             <textarea
//               value={content.bottomDescription}
//               onChange={(e) =>
//                 handleContentChange("bottomDescription", e.target.value)
//               }
//               rows="4"
//             />
//           </div>
//         </div>
//       </section>

//       <section className="spacious-admin-card">
//         <div className="spacious-admin-card-header">
//           <div>
//             <h2>Slider Properties</h2>
//             <p>Maximum 4 properties are shown on each admin page.</p>
//           </div>

//           <button
//             type="button"
//             className="spacious-add-btn"
//             onClick={addProperty}
//             disabled={saving}
//           >
//             + Add Property
//           </button>
//         </div>

//         {content.sliderProperties.length > 0 && (
//           <div className="spacious-pagination-result">
//             Showing <strong>{startIndex + 1}</strong> -{" "}
//             <strong>
//               {Math.min(
//                 startIndex + ITEMS_PER_PAGE,
//                 content.sliderProperties.length
//               )}
//             </strong>{" "}
//             of <strong>{content.sliderProperties.length}</strong> properties
//           </div>
//         )}

//         <div className="spacious-properties-list">
//           {currentProperties.map((property, localIndex) => {
//             const globalIndex = startIndex + localIndex;
//             const mainPreview =
//               propertyMainPreviews[globalIndex] ||
//               getImageUrl(property.mainImage);
//             const newSubFiles = propertySubFiles[globalIndex] || [];
//             const newSubPreviews = propertySubPreviews[globalIndex] || [];

//             return (
//               <div
//                 className="spacious-property-admin-card"
//                 key={
//                   property._id || property.id || `property-${globalIndex}`
//                 }
//               >
//                 <div className="spacious-property-admin-header">
//                   <h3>Property {globalIndex + 1}</h3>
//                   <button
//                     type="button"
//                     className="spacious-delete-btn"
//                     onClick={() => removeProperty(globalIndex)}
//                     disabled={saving}
//                   >
//                     Delete
//                   </button>
//                 </div>

//                 <div className="spacious-property-admin-body">
//                   <div className="spacious-property-admin-image">
//                     {mainPreview ? (
//                       <img
//                         src={mainPreview}
//                         alt={property.title || "Property"}
//                       />
//                     ) : (
//                       <div>No main image</div>
//                     )}
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) =>
//                         handlePropertyMainImage(globalIndex, e)
//                       }
//                     />
//                   </div>

//                   <div className="spacious-property-admin-fields">
//                     <div className="spacious-form-group">
//                       <label>Property Title</label>
//                       <input
//                         type="text"
//                         value={property.title}
//                         onChange={(e) =>
//                           updateProperty(globalIndex, "title", e.target.value)
//                         }
//                       />
//                     </div>

//                     <div className="spacious-form-group">
//                       <label>Category</label>
//                       <input
//                         type="text"
//                         value={property.category}
//                         onChange={(e) =>
//                           updateProperty(globalIndex, "category", e.target.value)
//                         }
//                       />
//                     </div>

//                     <div className="spacious-form-group">
//                       <label>Default Size</label>
//                       <input
//                         type="text"
//                         value={property.size}
//                         onChange={(e) =>
//                           updateProperty(globalIndex, "size", e.target.value)
//                         }
//                         placeholder="1200 sq ft"
//                       />
//                     </div>

//                     <div className="spacious-form-group">
//                       <label>Price</label>
//                       <input
//                         type="text"
//                         value={property.price}
//                         onChange={(e) =>
//                           updateProperty(globalIndex, "price", e.target.value)
//                         }
//                       />
//                     </div>

//                     <div className="spacious-form-group spacious-full-width">
//                       <label>Sub Images (Max 4)</label>

//                       {property.subImages.length > 0 && (
//                         <div className="spacious-subimage-grid">
//                           {property.subImages.slice(0, 4).map((image, imageIndex) => (
//                             <div
//                               className="spacious-subimage-item"
//                               key={`${image}-${imageIndex}`}
//                             >
//                               <img
//                                 src={getImageUrl(image)}
//                                 alt={`Sub ${imageIndex + 1}`}
//                               />
//                               <button
//                                 type="button"
//                                 onClick={() =>
//                                   removeExistingSubImage(globalIndex, imageIndex)
//                                 }
//                               >
//                                 ×
//                               </button>
//                             </div>
//                           ))}
//                         </div>
//                       )}

//                       {newSubPreviews.length > 0 && (
//                         <div className="spacious-subimage-grid">
//                           {newSubPreviews.map((preview, imageIndex) => (
//                             <div
//                               className="spacious-subimage-item"
//                               key={`${preview}-${imageIndex}`}
//                             >
//                               <img src={preview} alt={`New ${imageIndex + 1}`} />
//                               <button
//                                 type="button"
//                                 onClick={() =>
//                                   removeNewSubImage(globalIndex, imageIndex)
//                                 }
//                               >
//                                 ×
//                               </button>
//                             </div>
//                           ))}
//                         </div>
//                       )}

//                       {property.subImages.length + newSubFiles.length < 4 && (
//                         <input
//                           type="file"
//                           multiple
//                           accept="image/*"
//                           onChange={(e) => handleSubImages(globalIndex, e)}
//                         />
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {content.sliderProperties.length === 0 && (
//           <div className="spacious-empty-property">
//             No slider properties. Click "+ Add Property" to add one.
//           </div>
//         )}

//         {totalPages > 1 && (
//           <div className="spacious-pagination">
//             <button
//               type="button"
//               disabled={currentPage === 1}
//               onClick={() => setCurrentPage((page) => page - 1)}
//             >
//               ← Prev
//             </button>

//             {Array.from({ length: totalPages }, (_, index) => index + 1).map(
//               (page) => (
//                 <button
//                   type="button"
//                   key={page}
//                   className={currentPage === page ? "active" : ""}
//                   onClick={() => setCurrentPage(page)}
//                 >
//                   {page}
//                 </button>
//               )
//             )}

//             <button
//               type="button"
//               disabled={currentPage === totalPages}
//               onClick={() => setCurrentPage((page) => page + 1)}
//             >
//               Next →
//             </button>
//           </div>
//         )}
//       </section>

//       <div className="spacious-admin-bottom-actions">
//         <button
//           type="button"
//           className="spacious-reset-btn"
//           onClick={resetContent}
//           disabled={saving}
//         >
//           Reset
//         </button>
//         <button
//           type="button"
//           className="spacious-save-btn"
//           onClick={saveContent}
//           disabled={saving}
//         >
//           {saving ? "Saving..." : "Save Changes"}
//         </button>
//       </div>
//     </main>
//   );
// };

// export default SpaciousLivingAdmin;


import React, { useEffect, useMemo, useState } from "react";
import "./SpaciousLivingAdmin.css";

const API_URL = "http://localhost:5000/api/spacious-living";
const SERVER_URL = "http://localhost:5000";

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("adminToken") ||
    localStorage.getItem("accessToken");

  return token ? { Authorization: `Bearer ${token}` } : {};
};

const ITEMS_PER_PAGE = 4;

const EMPTY_CONTENT = {
  title: "",
  topDescription: "",
  mainImage: "",
  bottomDescription: "",
  sliderProperties: [],
};

const EMPTY_PROPERTY = {
  title: "",
  category: "",
  mainImage: "",
  subImages: [],
  size: "",
  sizes: [],
  price: "",
  oldPrice: "",
  description: "",
  totalUnits: 1,
  availableUnits: 1,
  bookedUnits: 0,
};

const removeIndexAndShift = (state, deletedIndex) => {
  const next = {};

  Object.entries(state).forEach(([key, value]) => {
    const index = Number(key);

    if (index === deletedIndex) return;

    next[index > deletedIndex ? index - 1 : index] = value;
  });

  return next;
};

const getImageUrl = (image) => {
  if (!image) return "";
  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:")
  ) {
    return image;
  }
  return image.startsWith("/uploads/") ? `${SERVER_URL}${image}` : image;
};

const normalizeProperty = (property = {}) => ({
  _id: property._id,
  id: property.id,
  title: property.title || "",
  category: property.category || "",
  mainImage: property.mainImage || property.image || "",
  subImages: Array.isArray(property.subImages)
    ? property.subImages.slice(0, 4)
    : [],
  size: property.size || "",
  sizes: Array.isArray(property.sizes)
    ? property.sizes
    : property.size
    ? [property.size]
    : [],
  price: property.price || "",
  oldPrice: property.oldPrice || "",
  description: property.description || "",
  totalUnits: Number(property.totalUnits ?? 1),
  availableUnits: Number(property.availableUnits ?? 1),
  bookedUnits: Number(property.bookedUnits ?? 0),
});

const SpaciousLivingAdmin = () => {
  const [content, setContent] = useState(EMPTY_CONTENT);

  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState("");

  const [propertyMainFiles, setPropertyMainFiles] = useState({});
  const [propertyMainPreviews, setPropertyMainPreviews] = useState({});

  const [propertySubFiles, setPropertySubFiles] = useState({});
  const [propertySubPreviews, setPropertySubPreviews] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL, {
        method: "GET",
        headers: { ...getAuthHeaders() },
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch Spacious Living");
      }

      const data = result?.success ? result.data : result;

      if (!data) {
        setContent({ ...EMPTY_CONTENT });
        setMainImagePreview("");
        return;
      }

      setContent({
        title: data.title || "",
        topDescription: data.topDescription || "",
        mainImage: data.mainImage || "",
        bottomDescription: data.bottomDescription || "",
        sliderProperties: Array.isArray(data.sliderProperties)
          ? data.sliderProperties.map(normalizeProperty)
          : [],
      });

      setMainImagePreview(getImageUrl(data.mainImage || ""));
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load Spacious Living.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const totalPages = Math.max(
    1,
    Math.ceil(content.sliderProperties.length / ITEMS_PER_PAGE)
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const currentProperties = useMemo(
    () =>
      content.sliderProperties.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE
      ),
    [content.sliderProperties, startIndex]
  );

  const handleContentChange = (field, value) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  const handleMainImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setMainImageFile(file);
    setMainImagePreview(URL.createObjectURL(file));
  };

  const addProperty = () => {
    // New property must always be Property 1.
    // Existing properties shift to the right.
    setContent((prev) => ({
      ...prev,
      sliderProperties: [
        {
          ...EMPTY_PROPERTY,
          sizes: [],
          subImages: [],
        },
        ...prev.sliderProperties,
      ],
    }));

    // Always open page 1 after adding a new property.
    setCurrentPage(1);

    // Existing unsaved files/previews also shift by one index.
    const shiftIndexes = (state) => {
      const next = {};

      Object.entries(state).forEach(([key, value]) => {
        next[Number(key) + 1] = value;
      });

      return next;
    };

    setPropertyMainFiles(shiftIndexes);
    setPropertyMainPreviews(shiftIndexes);
    setPropertySubFiles(shiftIndexes);
    setPropertySubPreviews(shiftIndexes);

    setMessage("");
    setError("");
  };

  const updateProperty = (index, field, value) => {
    setContent((prev) => {
      const properties = [...prev.sliderProperties];
      properties[index] = { ...properties[index], [field]: value };
      return { ...prev, sliderProperties: properties };
    });
  };

  const handleSizesChange = (index, value) => {
    const sizes = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    updateProperty(index, "sizes", sizes);
  };

  const handlePropertyMainImage = (globalIndex, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPropertyMainFiles((prev) => ({ ...prev, [globalIndex]: file }));
    setPropertyMainPreviews((prev) => ({
      ...prev,
      [globalIndex]: URL.createObjectURL(file),
    }));
  };

  const handleSubImages = (globalIndex, event) => {
    const selected = Array.from(event.target.files || []);
    if (!selected.length) return;

    setPropertySubFiles((prev) => {
      const existing = prev[globalIndex] || [];
      return {
        ...prev,
        [globalIndex]: [...existing, ...selected].slice(0, 4),
      };
    });

    setPropertySubPreviews((prev) => {
      const existing = prev[globalIndex] || [];
      return {
        ...prev,
        [globalIndex]: [
          ...existing,
          ...selected.map((file) => URL.createObjectURL(file)),
        ].slice(0, 4),
      };
    });

    event.target.value = "";
  };

  const removeExistingSubImage = (globalIndex, imageIndex) => {
    setContent((prev) => {
      const properties = [...prev.sliderProperties];
      const property = properties[globalIndex];

      properties[globalIndex] = {
        ...property,
        subImages: property.subImages.filter((_, index) => index !== imageIndex),
      };

      return { ...prev, sliderProperties: properties };
    });
  };

  const removeNewSubImage = (globalIndex, imageIndex) => {
    setPropertySubFiles((prev) => ({
      ...prev,
      [globalIndex]: (prev[globalIndex] || []).filter(
        (_, index) => index !== imageIndex
      ),
    }));

    setPropertySubPreviews((prev) => ({
      ...prev,
      [globalIndex]: (prev[globalIndex] || []).filter(
        (_, index) => index !== imageIndex
      ),
    }));
  };

  const removeProperty = (globalIndex) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property?"
    );
    if (!confirmed) return;

    setContent((prev) => ({
      ...prev,
      sliderProperties: prev.sliderProperties.filter(
        (_, index) => index !== globalIndex
      ),
    }));

    setPropertyMainFiles((prev) =>
      removeIndexAndShift(prev, globalIndex)
    );

    setPropertyMainPreviews((prev) =>
      removeIndexAndShift(prev, globalIndex)
    );

    setPropertySubFiles((prev) =>
      removeIndexAndShift(prev, globalIndex)
    );

    setPropertySubPreviews((prev) =>
      removeIndexAndShift(prev, globalIndex)
    );
  };

  const saveContent = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const formData = new FormData();

      const properties = content.sliderProperties.map((property) => ({
        _id: property._id,
        id: property.id,
        title: property.title || "",
        category: property.category || "",
        mainImage: property.mainImage || "",
        subImages: Array.isArray(property.subImages)
          ? property.subImages.slice(0, 4)
          : [],
        size: property.size || "",
        sizes: Array.isArray(property.sizes) ? property.sizes : [],
        price: property.price || "",
        oldPrice: property.oldPrice || "",
        description: property.description || "",
        totalUnits: Number(property.totalUnits ?? 1),
        availableUnits: Number(property.availableUnits ?? 1),
        bookedUnits: Number(property.bookedUnits ?? 0),
      }));

      formData.append(
        "content",
        JSON.stringify({
          title: content.title || "",
          topDescription: content.topDescription || "",
          mainImage: content.mainImage || "",
          bottomDescription: content.bottomDescription || "",
          sliderProperties: properties,
        })
      );

      if (mainImageFile) {
        formData.append("mainImage", mainImageFile);
      }

      Object.entries(propertyMainFiles).forEach(([index, file]) => {
        if (file) {
          formData.append(`sliderMainImage_${index}`, file);
        }
      });

      Object.entries(propertySubFiles).forEach(([index, files]) => {
        files.forEach((file) => {
          formData.append(`sliderSubImages_${index}`, file);
        });
      });

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { ...getAuthHeaders() },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save Spacious Living");
      }

      const savedData = result?.data || result;

      setContent({
        title: savedData.title || "",
        topDescription: savedData.topDescription || "",
        mainImage: savedData.mainImage || "",
        bottomDescription: savedData.bottomDescription || "",
        sliderProperties: Array.isArray(savedData.sliderProperties)
          ? savedData.sliderProperties.map(normalizeProperty)
          : [],
      });

      setMainImageFile(null);
      setMainImagePreview(getImageUrl(savedData.mainImage || ""));
      setPropertyMainFiles({});
      setPropertyMainPreviews({});
      setPropertySubFiles({});
      setPropertySubPreviews({});
      setCurrentPage(1);

      setMessage("Spacious Living saved successfully.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save Spacious Living.");
    } finally {
      setSaving(false);
    }
  };

  const resetContent = async () => {
    const confirmed = window.confirm(
      "Reset Spacious Living? This will clear all Spacious Living data."
    );
    if (!confirmed) return;

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch(API_URL, {
        method: "DELETE",
        headers: { ...getAuthHeaders() },
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to reset Spacious Living");
      }

      setContent({ ...EMPTY_CONTENT });
      setMainImageFile(null);
      setMainImagePreview("");
      setPropertyMainFiles({});
      setPropertyMainPreviews({});
      setPropertySubFiles({});
      setPropertySubPreviews({});
      setCurrentPage(1);

      setMessage("Spacious Living cleared successfully.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to clear Spacious Living.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="spacious-admin-page">
        <div className="spacious-admin-card">
          <h2>Loading Spacious Living...</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="spacious-admin-page">
      <div className="spacious-admin-header">
        <div>
          <h1>Spacious Living Management</h1>
          <p>Manage section content, images and slider properties.</p>
        </div>

        <div className="spacious-admin-header-actions">
          <button
            type="button"
            className="spacious-reset-btn"
            onClick={resetContent}
            disabled={saving}
          >
            Reset
          </button>
          <button
            type="button"
            className="spacious-save-btn"
            onClick={saveContent}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {message && <div className="spacious-admin-message">{message}</div>}
      {error && <div className="spacious-admin-error">{error}</div>}

      <section className="spacious-admin-card">
        <div className="spacious-admin-card-header">
          <div>
            <h2>Section Content</h2>
            <p>These values are stored in MongoDB.</p>
          </div>
        </div>

        <div className="spacious-section-fields">
          <div className="spacious-form-group">
            <label>Title</label>
            <input
              type="text"
              value={content.title}
              onChange={(e) => handleContentChange("title", e.target.value)}
            />
          </div>

          <div className="spacious-form-group">
            <label>Top Description</label>
            <textarea
              value={content.topDescription}
              onChange={(e) =>
                handleContentChange("topDescription", e.target.value)
              }
              rows="4"
            />
          </div>

          <div className="spacious-form-group">
            <label>Main Image</label>
            {mainImagePreview && (
              <img
                src={mainImagePreview}
                alt="Main"
                className="spacious-main-image-preview"
              />
            )}
            <input
              id="spacious-main-image-input"
              type="file"
              accept="image/*"
              onChange={handleMainImage}
            />
          </div>

          <div className="spacious-form-group">
            <label>Bottom Description</label>
            <textarea
              value={content.bottomDescription}
              onChange={(e) =>
                handleContentChange("bottomDescription", e.target.value)
              }
              rows="4"
            />
          </div>
        </div>
      </section>

      <section className="spacious-admin-card">
        <div className="spacious-admin-card-header">
          <div>
            <h2>Slider Properties</h2>
            <p>Maximum 4 properties are shown on each admin page.</p>
          </div>

          <button
            type="button"
            className="spacious-add-btn"
            onClick={addProperty}
            disabled={saving}
          >
            + Add Property
          </button>
        </div>

        {content.sliderProperties.length > 0 && (
          <div className="spacious-pagination-result">
            Showing <strong>{startIndex + 1}</strong> -{" "}
            <strong>
              {Math.min(
                startIndex + ITEMS_PER_PAGE,
                content.sliderProperties.length
              )}
            </strong>{" "}
            of <strong>{content.sliderProperties.length}</strong> properties
          </div>
        )}

        <div className="spacious-properties-list">
          {currentProperties.map((property, localIndex) => {
            const globalIndex = startIndex + localIndex;
            const mainPreview =
              propertyMainPreviews[globalIndex] ||
              getImageUrl(property.mainImage);
            const newSubFiles = propertySubFiles[globalIndex] || [];
            const newSubPreviews = propertySubPreviews[globalIndex] || [];

            return (
              <div
                className="spacious-property-admin-card"
                key={
                  property._id || property.id || `property-${globalIndex}`
                }
              >
                <div className="spacious-property-admin-header">
                  <h3>Property {globalIndex + 1}</h3>
                  <button
                    type="button"
                    className="spacious-delete-btn"
                    onClick={() => removeProperty(globalIndex)}
                    disabled={saving}
                  >
                    Delete
                  </button>
                </div>

                <div className="spacious-property-admin-body">
                  <div className="spacious-property-admin-image">
                    {mainPreview ? (
                      <img
                        src={mainPreview}
                        alt={property.title || "Property"}
                      />
                    ) : (
                      <div>No main image</div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handlePropertyMainImage(globalIndex, e)
                      }
                    />
                  </div>

                  <div className="spacious-property-admin-fields">
                    <div className="spacious-form-group">
                      <label>Property Title</label>
                      <input
                        type="text"
                        value={property.title}
                        onChange={(e) =>
                          updateProperty(globalIndex, "title", e.target.value)
                        }
                      />
                    </div>

                    <div className="spacious-form-group">
                      <label>Category</label>
                      <input
                        type="text"
                        value={property.category}
                        onChange={(e) =>
                          updateProperty(globalIndex, "category", e.target.value)
                        }
                      />
                    </div>

                    <div className="spacious-form-group">
                      <label>Default Size</label>
                      <input
                        type="text"
                        value={property.size}
                        onChange={(e) =>
                          updateProperty(globalIndex, "size", e.target.value)
                        }
                        placeholder="1200 sq ft"
                      />
                    </div>

                    {/* FIX: Available Sizes field was missing from the UI */}
                    <div className="spacious-form-group">
                      <label>Available Sizes</label>
                      <input
                        type="text"
                        value={(property.sizes || []).join(", ")}
                        onChange={(e) =>
                          handleSizesChange(globalIndex, e.target.value)
                        }
                        placeholder="1200 sq ft, 1400 sq ft"
                      />
                      <small>Separate sizes with comma.</small>
                    </div>

                    <div className="spacious-form-group">
                      <label>Price</label>
                      <input
                        type="text"
                        value={property.price}
                        onChange={(e) =>
                          updateProperty(globalIndex, "price", e.target.value)
                        }
                      />
                    </div>

                    {/* FIX: Old Price field was missing from the UI */}
                    <div className="spacious-form-group">
                      <label>Old Price</label>
                      <input
                        type="text"
                        value={property.oldPrice}
                        onChange={(e) =>
                          updateProperty(globalIndex, "oldPrice", e.target.value)
                        }
                      />
                    </div>

                    {/* FIX: Description field was missing from the UI */}
                    <div className="spacious-form-group spacious-full-width">
                      <label>Description</label>
                      <textarea
                        rows="4"
                        value={property.description}
                        onChange={(e) =>
                          updateProperty(
                            globalIndex,
                            "description",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    {/* FIX: Units fields moved INSIDE the map, where
                        `property` and `globalIndex` actually exist.
                        Previously these sat outside the loop at the top
                        level of the component and crashed on render. */}
                    <div className="spacious-form-group">
                      <label>Total Units</label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={property.totalUnits ?? 1}
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
                      <label>Available Units</label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={property.availableUnits ?? 1}
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
                      <label>Booked Units</label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={property.bookedUnits ?? 0}
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
                      <label>Sub Images (Max 4)</label>

                      {property.subImages.length > 0 && (
                        <div className="spacious-subimage-grid">
                          {property.subImages.slice(0, 4).map((image, imageIndex) => (
                            <div
                              className="spacious-subimage-item"
                              key={`${image}-${imageIndex}`}
                            >
                              <img
                                src={getImageUrl(image)}
                                alt={`Sub ${imageIndex + 1}`}
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  removeExistingSubImage(globalIndex, imageIndex)
                                }
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {newSubPreviews.length > 0 && (
                        <div className="spacious-subimage-grid">
                          {newSubPreviews.map((preview, imageIndex) => (
                            <div
                              className="spacious-subimage-item"
                              key={`${preview}-${imageIndex}`}
                            >
                              <img src={preview} alt={`New ${imageIndex + 1}`} />
                              <button
                                type="button"
                                onClick={() =>
                                  removeNewSubImage(globalIndex, imageIndex)
                                }
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {property.subImages.length + newSubFiles.length < 4 && (
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleSubImages(globalIndex, e)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {content.sliderProperties.length === 0 && (
          <div className="spacious-empty-property">
            No slider properties. Click "+ Add Property" to add one.
          </div>
        )}

        {totalPages > 1 && (
          <div className="spacious-pagination">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => page - 1)}
            >
              ← Prev
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  type="button"
                  key={page}
                  className={currentPage === page ? "active" : ""}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              )
            )}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((page) => page + 1)}
            >
              Next →
            </button>
          </div>
        )}
      </section>

      <div className="spacious-admin-bottom-actions">
        <button
          type="button"
          className="spacious-reset-btn"
          onClick={resetContent}
          disabled={saving}
        >
          Reset
        </button>
        <button
          type="button"
          className="spacious-save-btn"
          onClick={saveContent}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </main>
  );
};

export default SpaciousLivingAdmin;