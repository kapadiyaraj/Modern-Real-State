// import React, {
//   useEffect,
//   useState,
// } from "react";

// import {
//   useLocation,
//   useNavigate,
// } from "react-router-dom";

// import "./LuxuryPropertiessubAdmin.css";

// const API_URL =
//   "http://localhost:5000/api/luxurious-properties";

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

// const categories = [
//   "Bestseller",
//   "Farm Vila",
//   "Luxury Properties",
//   "Royal House",
// ];

// const EMPTY_FORM = {
//   title: "",
//   category: "Luxury Properties",
//   type: "Home",
//   size: "",
//   sizes: "",
//   price: "",
//   oldPrice: "",
//   description: "",
//   mainImage: "",
//   sliderImages: [],
//   isNew: false,
// };

// const getResponseData = (result) => {
//   if (Array.isArray(result)) {
//     return result;
//   }

//   if (Array.isArray(result?.data)) {
//     return result.data;
//   }

//   return result;
// };

// const LuxuryPropertiesSubAdmin = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [properties, setProperties] = useState([]);

//   const [form, setForm] =
//     useState(EMPTY_FORM);

//   const [editingId, setEditingId] =
//     useState(null);

//   const [loading, setLoading] =
//     useState(false);


//   // ======================================================
//   // FETCH MY LUXURY PROPERTIES
//   // ======================================================

//   const fetchProperties = async () => {
//     try {
//       setLoading(true);

//       const response = await fetch(
//         `${API_URL}/my`,
//         {
//           method: "GET",
//           headers: {
//             ...getAuthHeaders(),
//           },
//         }
//       );

//       const result =
//         await response.json();

//       if (!response.ok) {
//         throw new Error(
//           result?.message ||
//             "Failed to fetch properties."
//         );
//       }

//       const data =
//         getResponseData(result);

//       setProperties(
//         Array.isArray(data)
//           ? data
//           : []
//       );
//     } catch (error) {
//       console.error(
//         "Luxury SubAdmin GET Error:",
//         error
//       );

//       setProperties([]);

//       alert(
//         error.message ||
//           "Failed to load properties."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };


//   useEffect(() => {
//     fetchProperties();
//   }, []);


//   // ======================================================
//   // RECEIVE EDIT PROPERTY
//   // ======================================================

//   useEffect(() => {
//     const property =
//       location.state?.editProperty;

//     if (!property) {
//       return;
//     }

//     editProperty(property);

//     navigate(
//       location.pathname,
//       {
//         replace: true,
//         state: {},
//       }
//     );
//   }, [
//     location.state,
//   ]);


//   // ======================================================
//   // INPUT CHANGE
//   // ======================================================

//   const handleChange = (event) => {
//     const {
//       name,
//       value,
//       type,
//       checked,
//     } = event.target;

//     setForm((previous) => ({
//       ...previous,

//       [name]:
//         type === "checkbox"
//           ? checked
//           : value,
//     }));
//   };


//   // ======================================================
//   // FILE TO BASE64
//   // ======================================================

//   const fileToBase64 = (file) => {
//     return new Promise(
//       (
//         resolve,
//         reject
//       ) => {
//         const reader =
//           new FileReader();

//         reader.onload = () =>
//           resolve(
//             reader.result
//           );

//         reader.onerror = () =>
//           reject(
//             new Error(
//               "Image could not be read."
//             )
//           );

//         reader.readAsDataURL(
//           file
//         );
//       }
//     );
//   };


//   // ======================================================
//   // MAIN IMAGE
//   // ======================================================

//   const handleMainImageUpload =
//     async (event) => {
//       const file =
//         event.target.files?.[0];

//       if (!file) {
//         return;
//       }

//       try {
//         const image =
//           await fileToBase64(
//             file
//           );

//         setForm((previous) => ({
//           ...previous,

//           mainImage:
//             image,
//         }));
//       } catch (error) {
//         console.error(error);

//         alert(
//           "Failed to load main image."
//         );
//       }
//     };


//   // ======================================================
//   // SLIDER IMAGES
//   // ======================================================

//   const handleSliderImagesUpload =
//     async (event) => {
//       const files =
//         Array.from(
//           event.target.files || []
//         ).slice(0, 4);

//       if (
//         files.length === 0
//       ) {
//         return;
//       }

//       try {
//         const images =
//           await Promise.all(
//             files.map(
//               fileToBase64
//             )
//           );

//         setForm((previous) => ({
//           ...previous,

//           sliderImages:
//             images.slice(
//               0,
//               4
//             ),
//         }));
//       } catch (error) {
//         console.error(error);

//         alert(
//           "Failed to load slider images."
//         );
//       }
//     };


//   // ======================================================
//   // ADD / UPDATE
//   // ======================================================

//   const handleSubmit =
//     async (event) => {
//       event.preventDefault();

//       if (
//         !form.title.trim() ||
//         !form.size.trim() ||
//         !form.price.trim()
//       ) {
//         alert(
//           "Please fill in Title, Size, and Price."
//         );

//         return;
//       }

//       const sizes =
//         form.sizes
//           .split(",")
//           .map(
//             (item) =>
//               item.trim()
//           )
//           .filter(Boolean);

//       const finalSizes =
//         sizes.length
//           ? sizes
//           : [
//               form.size.trim(),
//             ];

//       const propertyData = {
//         title:
//           form.title.trim(),

//         category:
//           form.category,

//         type:
//           form.type.trim() ||
//           "Home",

//         mainImage:
//           form.mainImage ||
//           "",

//         sliderImages:
//           Array.isArray(
//             form.sliderImages
//           )
//             ? form.sliderImages.slice(
//                 0,
//                 4
//               )
//             : [],

//         size:
//           form.size.trim(),

//         sizes:
//           finalSizes,

//         price:
//           form.price.trim(),

//         oldPrice:
//           form.oldPrice.trim(),

//         description:
//           form.description.trim(),

//         isNew:
//           Boolean(
//             form.isNew
//           ),
//       };

//       const isEditing =
//         editingId !== null;

//       const url =
//         isEditing
//           ? `${API_URL}/${encodeURIComponent(
//               String(editingId)
//             )}`
//           : API_URL;

//       const method =
//         isEditing
//           ? "PUT"
//           : "POST";

//       try {
//         setLoading(true);

//         const response =
//           await fetch(url, {
//             method,

//             headers: {
//               "Content-Type":
//                 "application/json",

//               ...getAuthHeaders(),
//             },

//             body: JSON.stringify(
//               propertyData
//             ),
//           });

//         const result =
//           await response.json();

//         if (!response.ok) {
//           throw new Error(
//             result?.message ||
//               `Request failed with status ${response.status}`
//           );
//         }

//         await fetchProperties();

//         alert(
//           isEditing
//             ? "Luxury property updated successfully."
//             : "Luxury property added successfully."
//         );

//         resetForm();

//       } catch (error) {
//         console.error(
//           "Luxury SubAdmin Save Error:",
//           error
//         );

//         alert(
//           error.message ||
//             "Failed to save property."
//         );

//       } finally {
//         setLoading(false);
//       }
//     };


//   // ======================================================
//   // EDIT
//   // ======================================================

//   const editProperty = (
//     property
//   ) => {
//     const propId =
//       property.id ??
//       property._id;

//     if (
//       propId === undefined ||
//       propId === null
//     ) {
//       alert(
//         "Property ID not found."
//       );

//       return;
//     }

//     setEditingId(propId);

//     const sliderImages =
//       Array.isArray(
//         property.sliderImages
//       )
//         ? property.sliderImages
//         : Array.isArray(
//             property.images
//           )
//         ? property.images
//         : [];

//     const mainImage =
//       property.mainImage ||
//       property.image ||
//       "";

//     setForm({
//       title:
//         property.title ||
//         "",

//       category:
//         property.category ||
//         "Luxury Properties",

//       type:
//         property.type ||
//         "Home",

//       size:
//         property.size ||
//         "",

//       sizes:
//         Array.isArray(
//           property.sizes
//         )
//           ? property.sizes.join(
//               ", "
//             )
//           : property.size ||
//             "",

//       price:
//         property.price ||
//         "",

//       oldPrice:
//         property.oldPrice ||
//         "",

//       description:
//         property.description ||
//         "",

//       mainImage,

//       sliderImages:
//         sliderImages.slice(
//           0,
//           4
//         ),

//       isNew:
//         Boolean(
//           property.isNew
//         ),
//     });

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };


//   // ======================================================
//   // DELETE
//   // ======================================================

//   const deleteProperty =
//     async (id) => {
//       if (
//         id === undefined ||
//         id === null
//       ) {
//         alert(
//           "Property ID not found."
//         );

//         return;
//       }

//       const property =
//         properties.find(
//           (item) =>
//             Number(
//               item.id
//             ) ===
//             Number(id)
//         );

//       const confirmed =
//         window.confirm(
//           `Are you sure you want to delete "${
//             property?.title ||
//             "this property"
//           }"?`
//         );

//       if (!confirmed) {
//         return;
//       }

//       try {
//         setLoading(true);

//         const response =
//           await fetch(
//             `${API_URL}/${encodeURIComponent(
//               String(id)
//             )}`,
//             {
//               method:
//                 "DELETE",

//               headers: {
//                 ...getAuthHeaders(),
//               },
//             }
//           );

//         const result =
//           await response.json();

//         if (!response.ok) {
//           throw new Error(
//             result?.message ||
//               "Failed to delete property."
//           );
//         }

//         setProperties(
//           (previous) =>
//             previous.filter(
//               (item) =>
//                 Number(
//                   item.id
//                 ) !==
//                 Number(id)
//             )
//         );

//         if (
//           editingId !== null &&
//           Number(
//             editingId
//           ) === Number(id)
//         ) {
//           resetForm();
//         }

//         alert(
//           "Luxury property deleted successfully."
//         );

//       } catch (error) {
//         console.error(
//           "Luxury SubAdmin DELETE Error:",
//           error
//         );

//         alert(
//           error.message ||
//             "Failed to delete property."
//         );

//       } finally {
//         setLoading(false);
//       }
//     };


//   // ======================================================
//   // RESET FORM
//   // ======================================================

//   const resetForm = () => {
//     setForm({
//       ...EMPTY_FORM,
//       sliderImages: [],
//     });

//     setEditingId(null);

//     const mainInput =
//       document.getElementById(
//         "luxury-subadmin-main-image"
//       );

//     const sliderInput =
//       document.getElementById(
//         "luxury-subadmin-slider-images"
//       );

//     if (mainInput) {
//       mainInput.value = "";
//     }

//     if (sliderInput) {
//       sliderInput.value = "";
//     }
//   };


//   // ======================================================
//   // RECENT PROPERTIES
//   // ======================================================

//   const recentProperties =
//     properties
//       .slice()
//       .sort(
//         (a, b) =>
//           Number(
//             b.id
//           ) -
//           Number(
//             a.id
//           )
//       )
//       .slice(0, 5);


//   // ======================================================
//   // UI
//   // ======================================================

//   return (
//     <main className="luxury-admin-page">

//       <div className="luxury-admin-container">

//         {/* HEADER */}

//         <div className="luxury-admin-header">

//           <div>

//             <p className="luxury-admin-label">
//               SUB ADMIN PANEL
//             </p>

//             <h1>
//               My Luxury Properties
//             </h1>

//             <p>
//               Add and manage your luxury properties.
//             </p>

//           </div>

//           <button
//             type="button"
//             className="luxury-view-all-redirect-btn"
//             onClick={() =>
//               navigate(
//                 "/sub-admin/luxury-properties/all"
//               )
//             }
//           >
//             View All Properties (
//             {properties.length}
//             )
//           </button>

//         </div>


//         {/* FORM */}

//         <section className="luxury-admin-form-card">

//           <div className="luxury-form-title">

//             <h2>
//               {editingId !== null
//                 ? "Edit Luxury Property"
//                 : "Add New Luxury Property"}
//             </h2>

//           </div>


//           <form
//             onSubmit={
//               handleSubmit
//             }
//           >

//             <div className="luxury-form-grid">

//               {/* TITLE */}

//               <div className="luxury-form-group">

//                 <label>
//                   Property Title *
//                 </label>

//                 <input
//                   type="text"
//                   name="title"
//                   value={
//                     form.title
//                   }
//                   onChange={
//                     handleChange
//                   }
//                   placeholder="The Emerald Alpine Chalet"
//                 />

//               </div>


//               {/* CATEGORY */}

//               <div className="luxury-form-group">

//                 <label>
//                   Category *
//                 </label>

//                 <select
//                   name="category"
//                   value={
//                     form.category
//                   }
//                   onChange={
//                     handleChange
//                   }
//                 >

//                   {categories.map(
//                     (category) => (
//                       <option
//                         key={
//                           category
//                         }
//                         value={
//                           category
//                         }
//                       >
//                         {
//                           category
//                         }
//                       </option>
//                     )
//                   )}

//                 </select>

//               </div>


//               {/* TYPE */}

//               <div className="luxury-form-group">

//                 <label>
//                   Property Type
//                 </label>

//                 <input
//                   type="text"
//                   name="type"
//                   value={
//                     form.type
//                   }
//                   onChange={
//                     handleChange
//                   }
//                   placeholder="Villa / Chalet / Penthouse"
//                 />

//               </div>


//               {/* SIZE */}

//               <div className="luxury-form-group">

//                 <label>
//                   Default Size *
//                 </label>

//                 <input
//                   type="text"
//                   name="size"
//                   value={
//                     form.size
//                   }
//                   onChange={
//                     handleChange
//                   }
//                   placeholder="3400 sq ft"
//                 />

//               </div>


//               {/* SIZES */}

//               <div className="luxury-form-group luxury-form-full">

//                 <label>
//                   Available Sizes
//                   (Comma separated)
//                 </label>

//                 <input
//                   type="text"
//                   name="sizes"
//                   value={
//                     form.sizes
//                   }
//                   onChange={
//                     handleChange
//                   }
//                   placeholder="3400 sq ft, 4000 sq ft"
//                 />

//               </div>


//               {/* PRICE */}

//               <div className="luxury-form-group">

//                 <label>
//                   Price *
//                 </label>

//                 <input
//                   type="text"
//                   name="price"
//                   value={
//                     form.price
//                   }
//                   onChange={
//                     handleChange
//                   }
//                   placeholder="Rs. 2,400,000.00 INR"
//                 />

//               </div>


//               {/* OLD PRICE */}

//               <div className="luxury-form-group">

//                 <label>
//                   Old Price
//                 </label>

//                 <input
//                   type="text"
//                   name="oldPrice"
//                   value={
//                     form.oldPrice
//                   }
//                   onChange={
//                     handleChange
//                   }
//                   placeholder="Rs. 2,650,000.00 INR"
//                 />

//               </div>


//               {/* DESCRIPTION */}

//               <div className="luxury-form-group luxury-form-full">

//                 <label>
//                   Description
//                 </label>

//                 <textarea
//                   name="description"
//                   value={
//                     form.description
//                   }
//                   onChange={
//                     handleChange
//                   }
//                   rows="3"
//                   placeholder="Property description..."
//                 />

//               </div>


//               {/* MAIN IMAGE */}

//               <div className="luxury-form-group luxury-form-full">

//                 <label>
//                   Main Property Image
//                 </label>

//                 <input
//                   id="luxury-subadmin-main-image"
//                   type="file"
//                   accept="image/*"
//                   onChange={
//                     handleMainImageUpload
//                   }
//                 />


//                 {form.mainImage && (
//                   <div className="luxury-upload-preview">

//                     <div className="luxury-upload-image main-upload-image">

//                       <img
//                         src={
//                           form.mainImage
//                         }
//                         alt="Main property"
//                       />

//                       <span>
//                         Main
//                       </span>

//                     </div>

//                   </div>
//                 )}

//               </div>


//               {/* SLIDER IMAGES */}

//               <div className="luxury-form-group luxury-form-full">

//                 <label>
//                   Slider Images (Max 4)
//                 </label>

//                 <input
//                   id="luxury-subadmin-slider-images"
//                   type="file"
//                   accept="image/*"
//                   multiple
//                   onChange={
//                     handleSliderImagesUpload
//                   }
//                 />


//                 {form.sliderImages
//                   .length > 0 && (
//                   <div className="luxury-upload-preview">

//                     {form.sliderImages
//                       .slice(
//                         0,
//                         4
//                       )
//                       .map(
//                         (
//                           image,
//                           index
//                         ) => (
//                           <div
//                             className="luxury-upload-image"
//                             key={`${image}-${index}`}
//                           >

//                             <img
//                               src={
//                                 image
//                               }
//                               alt={`Slider ${
//                                 index +
//                                 1
//                               }`}
//                             />

//                             <span>
//                               Slide{" "}
//                               {index +
//                                 1}
//                             </span>

//                           </div>
//                         )
//                       )}

//                   </div>
//                 )}

//               </div>


//               {/* NEW BADGE */}

//               <div className="luxury-new-checkbox">

//                 <label>

//                   <input
//                     type="checkbox"
//                     name="isNew"
//                     checked={
//                       form.isNew
//                     }
//                     onChange={
//                       handleChange
//                     }
//                   />

//                   <span>
//                     Show "New" badge
//                   </span>

//                 </label>

//               </div>

//             </div>


//             {/* ACTIONS */}

//             <div className="luxury-form-actions">

//               <button
//                 type="submit"
//                 className="luxury-save-btn"
//                 disabled={
//                   loading
//                 }
//               >
//                 {loading
//                   ? "Saving..."
//                   : editingId !== null
//                   ? "Update Property"
//                   : "Add Property"}
//               </button>


//               <button
//                 type="button"
//                 className="luxury-cancel-btn"
//                 onClick={
//                   resetForm
//                 }
//                 disabled={
//                   loading
//                 }
//               >
//                 {editingId !== null
//                   ? "Cancel"
//                   : "Clear"}
//               </button>

//             </div>

//           </form>

//         </section>


//         {/* RECENT PROPERTIES */}

//         <section className="luxury-list-section">

//           <div className="luxury-list-header">

//             <h2>
//               My Recent Luxury Properties
//             </h2>

//             <button
//               type="button"
//               className="luxury-link-btn"
//               onClick={() =>
//                 navigate(
//                   "/sub-admin/luxury-properties/all"
//                 )
//               }
//             >
//               View All in Detail →
//             </button>

//           </div>


//           <div className="luxury-table-wrapper">

//             <table className="luxury-property-table">

//               <thead>

//                 <tr>

//                   <th>
//                     Image
//                   </th>

//                   <th>
//                     Title
//                   </th>

//                   <th>
//                     Category
//                   </th>

//                   <th>
//                     Size
//                   </th>

//                   <th>
//                     Price
//                   </th>

//                   <th>
//                     Actions
//                   </th>

//                 </tr>

//               </thead>


//               <tbody>

//                 {recentProperties.map(
//                   (property) => {

//                     const id =
//                       property.id ??
//                       property._id;

//                     return (
//                       <tr
//                         key={
//                           id
//                         }
//                       >

//                         <td>

//                           <div className="luxury-table-image">

//                             <img
//                               src={
//                                 property.mainImage ||
//                                 property.image ||
//                                 "https://via.placeholder.com/50"
//                               }
//                               alt=""
//                             />

//                           </div>

//                         </td>


//                         <td>

//                           <strong>
//                             {
//                               property.title
//                             }
//                           </strong>

//                           {property.isNew && (
//                             <span className="table-new">
//                               New
//                             </span>
//                           )}

//                         </td>


//                         <td>

//                           <span className="table-category">
//                             {
//                               property.category
//                             }
//                           </span>

//                         </td>


//                         <td>
//                           {
//                             property.size
//                           }
//                         </td>


//                         <td>

//                           <strong>
//                             {
//                               property.price
//                             }
//                           </strong>

//                         </td>


//                         <td>

//                           <div className="luxury-table-actions">

//                             <button
//                               type="button"
//                               className="edit-property-btn"
//                               onClick={() =>
//                                 editProperty(
//                                   property
//                                 )
//                               }
//                             >
//                               Edit
//                             </button>


//                             <button
//                               type="button"
//                               className="delete-property-btn"
//                               onClick={() =>
//                                 deleteProperty(
//                                   id
//                                 )
//                               }
//                             >
//                               Delete
//                             </button>

//                           </div>

//                         </td>

//                       </tr>
//                     );
//                   }
//                 )}

//               </tbody>

//             </table>


//             {recentProperties.length ===
//               0 && (
//               <p className="luxury-empty">
//                 {loading
//                   ? "Loading your properties..."
//                   : "No luxury properties found."}
//               </p>
//             )}

//           </div>

//         </section>

//       </div>

//     </main>
//   );
// };

// export default LuxuryPropertiesSubAdmin;


import React, {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import "./LuxuryPropertiessubAdmin.css";

const API_URL =
  "http://localhost:5000/api/luxurious-properties";

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

const categories = [
  "Bestseller",
  "Farm Vila",
  "Luxury Properties",
  "Royal House",
];

const EMPTY_FORM = {
  title: "",
  category: "Luxury Properties",
  type: "Home",
  size: "",
  sizes: "",
  price: "",
  oldPrice: "",
  description: "",
  mainImage: "",
  sliderImages: [],
  isNew: false,

  // Availability
  totalUnits: 1,
  availableUnits: 1,
  bookedUnits: 0,
};

const getResponseData = (result) => {
  if (Array.isArray(result)) {
    return result;
  }

  if (Array.isArray(result?.data)) {
    return result.data;
  }

  return result;
};

const LuxuryPropertiesSubAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [properties, setProperties] = useState([]);

  const [form, setForm] = useState(EMPTY_FORM);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);

  // ======================================================
  // FETCH MY LUXURY PROPERTIES
  // ======================================================

  const fetchProperties = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/my`, {
        method: "GET",
        headers: {
          ...getAuthHeaders(),
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Failed to fetch properties."
        );
      }

      const data = getResponseData(result);

      setProperties(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Luxury SubAdmin GET Error:", error);

      setProperties([]);

      alert(error.message || "Failed to load properties.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // ======================================================
  // RECEIVE EDIT PROPERTY
  // ======================================================

  useEffect(() => {
    const property = location.state?.editProperty;

    if (!property) {
      return;
    }

    editProperty(property);

    navigate(location.pathname, {
      replace: true,
      state: {},
    });
  }, [location.state]);

  // ======================================================
  // INPUT CHANGE
  // ======================================================

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ======================================================
  // FILE TO BASE64
  // ======================================================

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);

      reader.onerror = () =>
        reject(new Error("Image could not be read."));

      reader.readAsDataURL(file);
    });
  };

  // ======================================================
  // MAIN IMAGE
  // ======================================================

  const handleMainImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const image = await fileToBase64(file);

      setForm((previous) => ({
        ...previous,
        mainImage: image,
      }));
    } catch (error) {
      console.error(error);

      alert("Failed to load main image.");
    }
  };

  // ======================================================
  // SLIDER IMAGES
  // ======================================================

  const handleSliderImagesUpload = async (event) => {
    const files = Array.from(event.target.files || []).slice(0, 4);

    if (files.length === 0) {
      return;
    }

    try {
      const images = await Promise.all(files.map(fileToBase64));

      setForm((previous) => ({
        ...previous,
        sliderImages: images.slice(0, 4),
      }));
    } catch (error) {
      console.error(error);

      alert("Failed to load slider images.");
    }
  };

  // ======================================================
  // ADD / UPDATE
  // ======================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.title.trim() ||
      !form.size.trim() ||
      !form.price.trim()
    ) {
      alert("Please fill in Title, Size, and Price.");
      return;
    }

    const sizes = form.sizes
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const finalSizes = sizes.length ? sizes : [form.size.trim()];

    // Validate availability values, matching the Admin form.
    const totalUnits = Number(form.totalUnits);
    const availableUnits = Number(form.availableUnits);
    const bookedUnits = Number(form.bookedUnits);

    if (
      !Number.isInteger(totalUnits) ||
      !Number.isInteger(availableUnits) ||
      !Number.isInteger(bookedUnits) ||
      totalUnits < 0 ||
      availableUnits < 0 ||
      bookedUnits < 0
    ) {
      alert(
        "Availability values must be whole numbers and cannot be negative."
      );
      return;
    }

    if (availableUnits + bookedUnits !== totalUnits) {
      alert("Available Units + Booked Units must equal Total Units.");
      return;
    }

    const propertyData = {
      title: form.title.trim(),
      category: form.category,
      type: form.type.trim() || "Home",
      mainImage: form.mainImage || "",
      sliderImages: Array.isArray(form.sliderImages)
        ? form.sliderImages.slice(0, 4)
        : [],
      size: form.size.trim(),
      sizes: finalSizes,
      price: form.price.trim(),
      oldPrice: form.oldPrice.trim(),
      description: form.description.trim(),
      isNew: Boolean(form.isNew),

      // Availability
      totalUnits,
      availableUnits,
      bookedUnits,
    };

    const isEditing = editingId !== null;

    const url = isEditing
      ? `${API_URL}/${encodeURIComponent(String(editingId))}`
      : API_URL;

    const method = isEditing ? "PUT" : "POST";

    try {
      setLoading(true);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(propertyData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            `Request failed with status ${response.status}`
        );
      }

      await fetchProperties();

      alert(
        isEditing
          ? "Luxury property updated successfully."
          : "Luxury property added successfully."
      );

      resetForm();
    } catch (error) {
      console.error("Luxury SubAdmin Save Error:", error);

      alert(error.message || "Failed to save property.");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // EDIT
  // ======================================================

  const editProperty = (property) => {
    const propId = property.id ?? property._id;

    if (propId === undefined || propId === null) {
      alert("Property ID not found.");
      return;
    }

    setEditingId(propId);

    const sliderImages = Array.isArray(property.sliderImages)
      ? property.sliderImages
      : Array.isArray(property.images)
      ? property.images
      : [];

    const mainImage = property.mainImage || property.image || "";

    setForm({
      title: property.title || "",
      category: property.category || "Luxury Properties",
      type: property.type || "Home",
      size: property.size || "",
      sizes: Array.isArray(property.sizes)
        ? property.sizes.join(", ")
        : property.size || "",
      price: property.price || "",
      oldPrice: property.oldPrice || "",
      description: property.description || "",
      mainImage,
      sliderImages: sliderImages.slice(0, 4),
      isNew: Boolean(property.isNew),

      // Availability (defaults for older records)
      totalUnits: Number.isFinite(Number(property.totalUnits))
        ? Number(property.totalUnits)
        : 1,
      availableUnits: Number.isFinite(Number(property.availableUnits))
        ? Number(property.availableUnits)
        : 1,
      bookedUnits: Number.isFinite(Number(property.bookedUnits))
        ? Number(property.bookedUnits)
        : 0,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ======================================================
  // DELETE
  // ======================================================

  const deleteProperty = async (id) => {
    if (id === undefined || id === null) {
      alert("Property ID not found.");
      return;
    }

    const property = properties.find(
      (item) => Number(item.id) === Number(id)
    );

    const confirmed = window.confirm(
      `Are you sure you want to delete "${
        property?.title || "this property"
      }"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/${encodeURIComponent(String(id))}`,
        {
          method: "DELETE",
          headers: {
            ...getAuthHeaders(),
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Failed to delete property."
        );
      }

      setProperties((previous) =>
        previous.filter((item) => Number(item.id) !== Number(id))
      );

      if (editingId !== null && Number(editingId) === Number(id)) {
        resetForm();
      }

      alert("Luxury property deleted successfully.");
    } catch (error) {
      console.error("Luxury SubAdmin DELETE Error:", error);

      alert(error.message || "Failed to delete property.");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // RESET FORM
  // ======================================================

  const resetForm = () => {
    setForm({
      ...EMPTY_FORM,
      sliderImages: [],
    });

    setEditingId(null);

    const mainInput = document.getElementById(
      "luxury-subadmin-main-image"
    );

    const sliderInput = document.getElementById(
      "luxury-subadmin-slider-images"
    );

    if (mainInput) {
      mainInput.value = "";
    }

    if (sliderInput) {
      sliderInput.value = "";
    }
  };

  // ======================================================
  // RECENT PROPERTIES
  // ======================================================

  const recentProperties = properties
    .slice()
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, 5);

  // ======================================================
  // UI
  // ======================================================

  return (
    <main className="luxury-admin-page">
      <div className="luxury-admin-container">
        {/* HEADER */}

        <div className="luxury-admin-header">
          <div>
            <p className="luxury-admin-label">SUB ADMIN PANEL</p>

            <h1>My Luxury Properties</h1>

            <p>Add and manage your luxury properties.</p>
          </div>

          <button
            type="button"
            className="luxury-view-all-redirect-btn"
            onClick={() =>
              navigate("/sub-admin/luxury-properties/all")
            }
          >
            View All Properties ({properties.length})
          </button>
        </div>

        {/* FORM */}

        <section className="luxury-admin-form-card">
          <div className="luxury-form-title">
            <h2>
              {editingId !== null
                ? "Edit Luxury Property"
                : "Add New Luxury Property"}
            </h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="luxury-form-grid">
              {/* TITLE */}

              <div className="luxury-form-group">
                <label>Property Title *</label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="The Emerald Alpine Chalet"
                />
              </div>

              {/* CATEGORY */}

              <div className="luxury-form-group">
                <label>Category *</label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* TYPE */}

              <div className="luxury-form-group">
                <label>Property Type</label>

                <input
                  type="text"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  placeholder="Villa / Chalet / Penthouse"
                />
              </div>

              {/* SIZE */}

              <div className="luxury-form-group">
                <label>Default Size *</label>

                <input
                  type="text"
                  name="size"
                  value={form.size}
                  onChange={handleChange}
                  placeholder="3400 sq ft"
                />
              </div>

              {/* SIZES */}

              <div className="luxury-form-group luxury-form-full">
                <label>Available Sizes (Comma separated)</label>

                <input
                  type="text"
                  name="sizes"
                  value={form.sizes}
                  onChange={handleChange}
                  placeholder="3400 sq ft, 4000 sq ft"
                />
              </div>

              {/* PRICE */}

              <div className="luxury-form-group">
                <label>Price *</label>

                <input
                  type="text"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Rs. 2,400,000.00 INR"
                />
              </div>

              {/* OLD PRICE */}

              <div className="luxury-form-group">
                <label>Old Price</label>

                <input
                  type="text"
                  name="oldPrice"
                  value={form.oldPrice}
                  onChange={handleChange}
                  placeholder="Rs. 2,650,000.00 INR"
                />
              </div>

              {/* AVAILABILITY */}

              <div className="luxury-form-group">
                <label>Total Units *</label>
                <input
                  type="number"
                  name="totalUnits"
                  min="0"
                  step="1"
                  value={form.totalUnits}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="luxury-form-group">
                <label>Available Units *</label>
                <input
                  type="number"
                  name="availableUnits"
                  min="0"
                  step="1"
                  value={form.availableUnits}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="luxury-form-group">
                <label>Booked Units *</label>
                <input
                  type="number"
                  name="bookedUnits"
                  min="0"
                  step="1"
                  value={form.bookedUnits}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* DESCRIPTION */}

              <div className="luxury-form-group luxury-form-full">
                <label>Description</label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Property description..."
                />
              </div>

              {/* MAIN IMAGE */}

              <div className="luxury-form-group luxury-form-full">
                <label>Main Property Image</label>

                <input
                  id="luxury-subadmin-main-image"
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageUpload}
                />

                {form.mainImage && (
                  <div className="luxury-upload-preview">
                    <div className="luxury-upload-image main-upload-image">
                      <img src={form.mainImage} alt="Main property" />

                      <span>Main</span>
                    </div>
                  </div>
                )}
              </div>

              {/* SLIDER IMAGES */}

              <div className="luxury-form-group luxury-form-full">
                <label>Slider Images (Max 4)</label>

                <input
                  id="luxury-subadmin-slider-images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleSliderImagesUpload}
                />

                {form.sliderImages.length > 0 && (
                  <div className="luxury-upload-preview">
                    {form.sliderImages.slice(0, 4).map((image, index) => (
                      <div
                        className="luxury-upload-image"
                        key={`${image}-${index}`}
                      >
                        <img
                          src={image}
                          alt={`Slider ${index + 1}`}
                        />

                        <span>Slide {index + 1}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* NEW BADGE */}

              <div className="luxury-new-checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="isNew"
                    checked={form.isNew}
                    onChange={handleChange}
                  />

                  <span>Show "New" badge</span>
                </label>
              </div>
            </div>

            {/* ACTIONS */}

            <div className="luxury-form-actions">
              <button
                type="submit"
                className="luxury-save-btn"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : editingId !== null
                  ? "Update Property"
                  : "Add Property"}
              </button>

              <button
                type="button"
                className="luxury-cancel-btn"
                onClick={resetForm}
                disabled={loading}
              >
                {editingId !== null ? "Cancel" : "Clear"}
              </button>
            </div>
          </form>
        </section>

        {/* RECENT PROPERTIES */}

        <section className="luxury-list-section">
          <div className="luxury-list-header">
            <h2>My Recent Luxury Properties</h2>

            <button
              type="button"
              className="luxury-link-btn"
              onClick={() =>
                navigate("/sub-admin/luxury-properties/all")
              }
            >
              View All in Detail →
            </button>
          </div>

          <div className="luxury-table-wrapper">
            <table className="luxury-property-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Size</th>
                  <th>Price</th>
                  <th>Total Units</th>
                  <th>Available Units</th>
                  <th>Booked Units</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {recentProperties.map((property) => {
                  const id = property.id ?? property._id;

                  return (
                    <tr key={id}>
                      <td>
                        <div className="luxury-table-image">
                          <img
                            src={
                              property.mainImage ||
                              property.image ||
                              "https://via.placeholder.com/50"
                            }
                            alt=""
                          />
                        </div>
                      </td>

                      <td>
                        <strong>{property.title}</strong>

                        {property.isNew && (
                          <span className="table-new">New</span>
                        )}
                      </td>

                      <td>
                        <span className="table-category">
                          {typeof property.category === "object"
                            ? property.category?.label ||
                              property.category?.name ||
                              ""
                            : property.category || ""}
                        </span>
                      </td>

                      <td>{property.size}</td>

                      <td>
                        <strong>{property.price}</strong>
                      </td>

                      <td>{Number(property.totalUnits ?? 1)}</td>
                      <td>{Number(property.availableUnits ?? 1)}</td>
                      <td>{Number(property.bookedUnits ?? 0)}</td>

                      <td>
                        <div className="luxury-table-actions">
                          <button
                            type="button"
                            className="edit-property-btn"
                            onClick={() => editProperty(property)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="delete-property-btn"
                            onClick={() => deleteProperty(id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {recentProperties.length === 0 && (
              <p className="luxury-empty">
                {loading
                  ? "Loading your properties..."
                  : "No luxury properties found."}
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default LuxuryPropertiesSubAdmin;