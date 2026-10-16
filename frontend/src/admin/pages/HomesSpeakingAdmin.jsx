


// import React, {
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import {
//   useLocation,
//   useNavigate,
// } from "react-router-dom";

// import "./HomesSpeakingAdmin.css";

// const API_URL =
//   "http://localhost:5000/api/homes-speaking";

// const IMAGE_BASE_URL =
//   "http://localhost:5000";

// const emptyForm = {
//   category: "realestate",
//   image: "",
//   date: "",
//   author: "",
//   title: "",
//   description: "",
// };

// const HomesSpeakingAdmin = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [homes, setHomes] = useState([]);

//   const [form, setForm] =
//     useState(emptyForm);

//   const [selectedImage, setSelectedImage] =
//     useState(null);

//   const [imagePreview, setImagePreview] =
//     useState("");

//   const [editingId, setEditingId] =
//     useState(null);

//   const [loading, setLoading] =
//     useState(false);

//   // =========================================================
//   // RECENT HOMES
//   // =========================================================

//   const recentHomes = useMemo(() => {
//     return [...homes]
//       .sort(
//         (a, b) =>
//           Number(b.id) - Number(a.id)
//       )
//       .slice(0, 4);
//   }, [homes]);

//   // =========================================================
//   // LOAD HOMES
//   // =========================================================

//   const loadHomes = async () => {
//     try {
//       const response =
//         await fetch(API_URL);

//       const result =
//         await response.json();

//       if (!response.ok) {
//         throw new Error(
//           result.message ||
//             "Failed to load Homes Speaking data"
//         );
//       }

//       if (
//         result.success &&
//         Array.isArray(result.data)
//       ) {
//         setHomes(result.data);
//       } else {
//         setHomes([]);
//       }
//     } catch (error) {
//       console.error(
//         "Homes Speaking API Error:",
//         error
//       );

//       setHomes([]);
//     }
//   };

//   // =========================================================
//   // INITIAL LOAD
//   // =========================================================

//   useEffect(() => {
//     loadHomes();
//   }, []);

//   // =========================================================
//   // EDIT HOME FROM ALL PAGE
//   // =========================================================

//   useEffect(() => {
//     const editHome =
//       location.state?.editHome;

//     if (editHome) {
//       handleEdit(editHome);

//       window.history.replaceState(
//         {},
//         document.title
//       );
//     }
//   }, [location.state]);

//   // =========================================================
//   // INPUT CHANGE
//   // =========================================================

//   const handleChange = (e) => {
//     const {
//       name,
//       value,
//     } = e.target;

//     setForm((previous) => ({
//       ...previous,
//       [name]: value,
//     }));
//   };

//   // =========================================================
//   // IMAGE SELECT
//   // =========================================================

//   const handleImageChange = (e) => {
//     const file =
//       e.target.files?.[0];

//     if (!file) return;

//     const allowedTypes = [
//       "image/jpeg",
//       "image/jpg",
//       "image/png",
//       "image/webp",
//       "image/avif",
//     ];

//     if (
//       !allowedTypes.includes(
//         file.type
//       )
//     ) {
//       alert(
//         "Please select JPG, JPEG, PNG, WEBP or AVIF image."
//       );

//       e.target.value = "";
//       return;
//     }

//     if (
//       file.size >
//       5 * 1024 * 1024
//     ) {
//       alert(
//         "Image size must be less than 5MB."
//       );

//       e.target.value = "";
//       return;
//     }

//     setSelectedImage(file);

//     const previewURL =
//       URL.createObjectURL(file);

//     setImagePreview(previewURL);
//   };

//   // =========================================================
//   // ADD / UPDATE
//   // =========================================================

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (
//       !form.title.trim() ||
//       !form.description.trim()
//     ) {
//       alert(
//         "Please fill Title and Description."
//       );

//       return;
//     }

//     // New home must have image
//     if (
//       editingId === null &&
//       !selectedImage
//     ) {
//       alert(
//         "Please select an image."
//       );

//       return;
//     }

//     setLoading(true);

//     try {
//       const formData =
//         new FormData();

//       formData.append(
//         "category",
//         form.category
//       );

//       formData.append(
//         "date",
//         form.date
//       );

//       formData.append(
//         "author",
//         form.author
//       );

//       formData.append(
//         "title",
//         form.title.trim()
//       );

//       formData.append(
//         "description",
//         form.description.trim()
//       );

//       // New image only if selected
//       if (selectedImage) {
//         formData.append(
//           "image",
//           selectedImage
//         );
//       }

//       let response;

//       // =====================================================
//       // UPDATE
//       // =====================================================

//       if (editingId !== null) {
//         response = await fetch(
//           `${API_URL}/${editingId}`,
//           {
//             method: "PUT",
//             body: formData,
//           }
//         );
//       }

//       // =====================================================
//       // CREATE
//       // =====================================================

//       else {
//         response = await fetch(
//           API_URL,
//           {
//             method: "POST",
//             body: formData,
//           }
//         );
//       }

//       const result =
//         await response.json();

//       if (!response.ok) {
//         throw new Error(
//           result.message ||
//             "Failed to save home"
//         );
//       }

//       await loadHomes();

//       if (editingId !== null) {
//         alert(
//           "Home updated successfully."
//         );
//       } else {
//         alert(
//           "Home added successfully."
//         );
//       }

//       setEditingId(null);

//       setForm(emptyForm);

//       setSelectedImage(null);

//       setImagePreview("");

//       window.dispatchEvent(
//         new Event(
//           "homesSpeakingUpdated"
//         )
//       );
//     } catch (error) {
//       console.error(
//         "Homes Speaking Save Error:",
//         error
//       );

//       alert(
//         error.message ||
//           "Failed to save home."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========================================================
//   // EDIT
//   // =========================================================

//   const handleEdit = (home) => {
//     setEditingId(home.id);

//     setForm({
//       category:
//         home.category ||
//         "realestate",

//       image:
//         home.image || "",

//       date:
//         home.date || "",

//       author:
//         home.author || "",

//       title:
//         home.title || "",

//       description:
//         home.description || "",
//     });

//     setSelectedImage(null);

//     if (home.image) {
//       setImagePreview(
//         home.image.startsWith("http")
//           ? home.image
//           : `${IMAGE_BASE_URL}${home.image}`
//       );
//     } else {
//       setImagePreview("");
//     }

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   // =========================================================
//   // DELETE
//   // =========================================================

//   const handleDelete = async (id) => {
//     const home =
//       homes.find(
//         (item) =>
//           Number(item.id) ===
//           Number(id)
//       );

//     const confirmed =
//       window.confirm(
//         `Delete "${
//           home?.title ||
//           "this home"
//         }"?`
//       );

//     if (!confirmed) return;

//     try {
//       const response =
//         await fetch(
//           `${API_URL}/${id}`,
//           {
//             method: "DELETE",
//           }
//         );

//       const result =
//         await response.json();

//       if (!response.ok) {
//         throw new Error(
//           result.message ||
//             "Failed to delete home"
//         );
//       }

//       await loadHomes();

//       if (
//         Number(editingId) ===
//         Number(id)
//       ) {
//         cancelEdit();
//       }

//       window.dispatchEvent(
//         new Event(
//           "homesSpeakingUpdated"
//         )
//       );

//       alert(
//         "Home deleted successfully."
//       );
//     } catch (error) {
//       console.error(
//         "Homes Speaking Delete Error:",
//         error
//       );

//       alert(
//         error.message ||
//           "Failed to delete home."
//       );
//     }
//   };

//   // =========================================================
//   // CANCEL
//   // =========================================================

//   const cancelEdit = () => {
//     setEditingId(null);

//     setForm(emptyForm);

//     setSelectedImage(null);

//     setImagePreview("");
//   };

//   // =========================================================
//   // IMAGE URL
//   // =========================================================

//   const getImageUrl = (image) => {
//     if (!image) {
//       return "/images/home-place-1.jpg";
//     }

//     if (image.startsWith("http")) {
//       return image;
//     }

//     return `${IMAGE_BASE_URL}${image}`;
//   };

//   // =========================================================
//   // JSX
//   // =========================================================

//   return (
//     <div className="homes-admin-page">

//       <div className="homes-admin-container">

//         {/* HEADER */}

//         <div className="homes-admin-header">

//           <div>

//             <p className="homes-admin-small-title">
//               ADMIN PANEL
//             </p>

//             <h1>
//               Homes Speaking
//             </h1>

//             <p className="homes-admin-subtitle">
//               Manage Homes Speaking content with complete CRUD operations.
//             </p>

//           </div>

//           <div className="homes-admin-count">

//             <strong>
//               {homes.length}
//             </strong>

//             <span>
//               Total Homes
//             </span>

//           </div>

//         </div>

//         {/* FORM */}

//         <div className="homes-admin-form-card">

//           <div className="homes-admin-card-heading">

//             <div>

//               <h2>
//                 {editingId !== null
//                   ? "Edit Home"
//                   : "Add New Home"}
//               </h2>

//               <p>
//                 {editingId !== null
//                   ? "Update existing Homes Speaking content."
//                   : "Create a new Homes Speaking card."}
//               </p>

//             </div>

//             {editingId !== null && (
//               <button
//                 type="button"
//                 className="homes-admin-cancel-top"
//                 onClick={cancelEdit}
//               >
//                 Cancel Edit
//               </button>
//             )}

//           </div>

//           <form
//             className="homes-admin-form"
//             onSubmit={handleSubmit}
//           >

//             <div className="homes-admin-form-grid">

//               {/* CATEGORY */}

//               <div className="homes-admin-field">

//                 <label>
//                   Category
//                 </label>

//                 <input
//                   type="text"
//                   name="category"
//                   value={form.category}
//                   onChange={handleChange}
//                   placeholder="realestate"
//                 />

//               </div>

//               {/* DATE */}

//               <div className="homes-admin-field">

//                 <label>
//                   Date
//                 </label>

//                 <input
//                   type="text"
//                   name="date"
//                   value={form.date}
//                   onChange={handleChange}
//                   placeholder="25 May 2023"
//                 />

//               </div>

//               {/* AUTHOR */}

//               <div className="homes-admin-field">

//                 <label>
//                   Author
//                 </label>

//                 <input
//                   type="text"
//                   name="author"
//                   value={form.author}
//                   onChange={handleChange}
//                   placeholder="WorkDo"
//                 />

//               </div>

//               {/* SELECT IMAGE */}

//               <div className="homes-admin-field">

//                 <label>
//                   Select Image
//                 </label>

//                 <input
//                   type="file"
//                   name="image"
//                   accept="image/*"
//                   onChange={
//                     handleImageChange
//                   }
//                 />

//               </div>

//               {/* TITLE */}

//               <div className="homes-admin-field full-width">

//                 <label>
//                   Title
//                 </label>

//                 <input
//                   type="text"
//                   name="title"
//                   value={form.title}
//                   onChange={handleChange}
//                   placeholder="Enter home title"
//                 />

//               </div>

//               {/* DESCRIPTION */}

//               <div className="homes-admin-field full-width">

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
//                   placeholder="Enter home description"
//                   rows="5"
//                 />

//               </div>

//             </div>

//             {/* IMAGE PREVIEW */}

//             {(imagePreview ||
//               form.image) && (

//               <div className="homes-admin-preview">

//                 <p>
//                   Image Preview
//                 </p>

//                 <img
//                   src={
//                     imagePreview ||
//                     getImageUrl(
//                       form.image
//                     )
//                   }
//                   alt="Preview"
//                   onError={(e) => {
//                     e.currentTarget.style.display =
//                       "none";
//                   }}
//                 />

//               </div>
//             )}

//             {/* ACTIONS */}

//             <div className="homes-admin-form-actions">

//               <button
//                 type="submit"
//                 className="homes-admin-save-btn"
//                 disabled={loading}
//               >
//                 {loading
//                   ? "Saving..."
//                   : editingId !== null
//                   ? "Update Home"
//                   : "Add Home"}
//               </button>

//               {editingId !== null && (
//                 <button
//                   type="button"
//                   className="homes-admin-cancel-btn"
//                   onClick={cancelEdit}
//                   disabled={loading}
//                 >
//                   Cancel
//                 </button>
//               )}

//             </div>

//           </form>

//         </div>

//         {/* RECENT HOMES */}

//         <div className="homes-admin-list-header">

//           <div>

//             <h2>
//               Recent Homes
//             </h2>

//             <p>
//               Latest 4 Homes Speaking properties
//             </p>

//           </div>

//           <button
//             type="button"
//             className="homes-admin-view-all-btn"
//             onClick={() =>
//               navigate(
//                 "/admin/homes-speaking/all"
//               )
//             }
//           >
//             View All{" "}
//             <span>→</span>
//           </button>

//         </div>

//         <div className="homes-admin-table-card">

//           {recentHomes.length > 0 ? (

//             <div className="homes-admin-table-wrapper">

//               <table className="homes-admin-table">

//                 <thead>

//                   <tr>
//                     <th>Image</th>
//                     <th>Title</th>
//                     <th>Category</th>
//                     <th>Date</th>
//                     <th>Author</th>
//                     <th>Actions</th>
//                   </tr>

//                 </thead>

//                 <tbody>

//                   {recentHomes.map(
//                     (home) => (

//                       <tr
//                         key={home.id}
//                       >

//                         <td>

//                           <img
//                             className="homes-admin-table-image"
//                             src={getImageUrl(
//                               home.image
//                             )}
//                             alt={
//                               home.title ||
//                               "Home"
//                             }
//                             onError={(
//                               e
//                             ) => {
//                               e.currentTarget.src =
//                                 "/images/home-place-1.jpg";
//                             }}
//                           />

//                         </td>

//                         <td>

//                           <div className="homes-admin-title-cell">

//                             <strong>
//                               {home.title ||
//                                 "Untitled Home"}
//                             </strong>

//                             <span>
//                               {home.description ||
//                                 "No description available."}
//                             </span>

//                           </div>

//                         </td>

//                         <td>

//                           <span className="homes-admin-category">

//                             {home.category ||
//                               "realestate"}

//                           </span>

//                         </td>

//                         <td>
//                           {home.date ||
//                             "N/A"}
//                         </td>

//                         <td>
//                           {home.author ||
//                             "N/A"}
//                         </td>

//                         <td>

//                           <div className="homes-admin-actions">

//                             <button
//                               type="button"
//                               className="homes-admin-edit"
//                               onClick={() =>
//                                 handleEdit(
//                                   home
//                                 )
//                               }
//                             >
//                               Edit
//                             </button>

//                             <button
//                               type="button"
//                               className="homes-admin-delete"
//                               onClick={() =>
//                                 handleDelete(
//                                   home.id
//                                 )
//                               }
//                             >
//                               Delete
//                             </button>

//                           </div>

//                         </td>

//                       </tr>

//                     )
//                   )}

//                 </tbody>

//               </table>

//             </div>

//           ) : (

//             <div className="homes-admin-empty">

//               <h3>
//                 No homes found
//               </h3>

//               <p>
//                 Add a new home using the form above.
//               </p>

//             </div>

//           )}

//         </div>

//       </div>

//     </div>
//   );
// };

// export default HomesSpeakingAdmin;








import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import "./HomesSpeakingAdmin.css";

const API_URL =
  "http://localhost:5000/api/homes-speaking";

const IMAGE_BASE_URL =
  "http://localhost:5000";

const emptyForm = {
  category: "realestate",
  image: "",
  date: "",
  author: "",
  title: "",
  description: "",
  detailedDescription: "",
  additionalDescription: "",
  quote: "",
  tags: [],
};

const HomesSpeakingAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [homes, setHomes] = useState([]);

  const [form, setForm] =
    useState(emptyForm);

  const [selectedImage, setSelectedImage] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [editingId, setEditingId] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  // =========================================================
  // RECENT HOMES
  // =========================================================

  const recentHomes = useMemo(() => {
    return [...homes]
      .sort(
        (a, b) =>
          Number(b.id) - Number(a.id)
      )
      .slice(0, 4);
  }, [homes]);

  // =========================================================
  // LOAD HOMES
  // =========================================================

  const loadHomes = async () => {
    try {
      const response =
        await fetch(API_URL);

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to load Homes Speaking data"
        );
      }

      if (
        result.success &&
        Array.isArray(result.data)
      ) {
        setHomes(result.data);
      } else {
        setHomes([]);
      }
    } catch (error) {
      console.error(
        "Homes Speaking API Error:",
        error
      );

      setHomes([]);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    loadHomes();
  }, []);

  // =========================================================
  // EDIT HOME FROM ALL PAGE
  // =========================================================

  useEffect(() => {
    const editHome =
      location.state?.editHome;

    if (editHome) {
      handleEdit(editHome);

      window.history.replaceState(
        {},
        document.title
      );
    }
  }, [location.state]);

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // IMAGE SELECT
  // =========================================================

  const handleImageChange = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/avif",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      alert(
        "Please select JPG, JPEG, PNG, WEBP or AVIF image."
      );

      e.target.value = "";
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      alert(
        "Image size must be less than 5MB."
      );

      e.target.value = "";
      return;
    }

    setSelectedImage(file);

    const previewURL =
      URL.createObjectURL(file);

    setImagePreview(previewURL);
  };

  // =========================================================
  // ADD / UPDATE
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login as admin first.");
      return;
    }

    if (
      !form.title.trim() ||
      !form.description.trim()
    ) {
      alert(
        "Please fill Title and Description."
      );

      return;
    }

    // New home must have image
    if (
      editingId === null &&
      !selectedImage
    ) {
      alert(
        "Please select an image."
      );

      return;
    }

    setLoading(true);

    try {
      const formData =
        new FormData();

      formData.append(
        "category",
        form.category
      );

      formData.append(
        "date",
        form.date
      );

      formData.append(
        "author",
        form.author
      );

      formData.append(
        "title",
        form.title.trim()
      );

      formData.append(
        "description",
        form.description.trim()
      );

      formData.append(
        "detailedDescription",
        form.detailedDescription.trim()
      );

      formData.append(
        "additionalDescription",
        form.additionalDescription.trim()
      );

      formData.append(
        "quote",
        form.quote.trim()
      );

      formData.append(
        "tags",
        JSON.stringify(
          Array.isArray(form.tags)
            ? form.tags
            : String(form.tags || "")
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean)
        )
      );

      // New image only if selected
      if (selectedImage) {
        formData.append(
          "image",
          selectedImage
        );
      }

      let response;

      // =====================================================
      // UPDATE
      // =====================================================

      if (editingId !== null) {
        response = await fetch(
          `${API_URL}/${editingId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );
      }

      // =====================================================
      // CREATE
      // =====================================================

      else {
        response = await fetch(
          API_URL,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );
      }

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to save home"
        );
      }

      await loadHomes();

      if (editingId !== null) {
        alert(
          "Home updated successfully."
        );
      } else {
        alert(
          "Home added successfully."
        );
      }

      setEditingId(null);

      setForm(emptyForm);

      setSelectedImage(null);

      setImagePreview("");

      window.dispatchEvent(
        new Event(
          "homesSpeakingUpdated"
        )
      );
    } catch (error) {
      console.error(
        "Homes Speaking Save Error:",
        error
      );

      alert(
        error.message ||
          "Failed to save home."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // EDIT
  // =========================================================

  const handleEdit = (home) => {
    setEditingId(home.id);

    setForm({
      category:
        home.category ||
        "realestate",

      image:
        home.image || "",

      date:
        home.date || "",

      author:
        home.author || "",

      title:
        home.title || "",

      description:
        home.description || "",

      detailedDescription:
        home.detailedDescription || "",

      additionalDescription:
        home.additionalDescription || "",

      quote:
        home.quote || "",

      tags: Array.isArray(home.tags)
        ? home.tags
        : [],
    });

    setSelectedImage(null);

    if (home.image) {
      setImagePreview(
        home.image.startsWith("http")
          ? home.image
          : `${IMAGE_BASE_URL}${home.image}`
      );
    } else {
      setImagePreview("");
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (id) => {
    const home =
      homes.find(
        (item) =>
          Number(item.id) ===
          Number(id)
      );

    const confirmed =
      window.confirm(
        `Delete "${
          home?.title ||
          "this home"
        }"?`
      );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login as admin first.");
        return;
      }

      const response =
        await fetch(
          `${API_URL}/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to delete home"
        );
      }

      await loadHomes();

      if (
        Number(editingId) ===
        Number(id)
      ) {
        cancelEdit();
      }

      window.dispatchEvent(
        new Event(
          "homesSpeakingUpdated"
        )
      );

      alert(
        "Home deleted successfully."
      );
    } catch (error) {
      console.error(
        "Homes Speaking Delete Error:",
        error
      );

      alert(
        error.message ||
          "Failed to delete home."
      );
    }
  };

  // =========================================================
  // CANCEL
  // =========================================================

  const cancelEdit = () => {
    setEditingId(null);

    setForm(emptyForm);

    setSelectedImage(null);

    setImagePreview("");
  };

  // =========================================================
  // IMAGE URL
  // =========================================================

  const getImageUrl = (image) => {
    if (!image) {
      return "/images/home-place-1.jpg";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `${IMAGE_BASE_URL}${image}`;
  };

  // =========================================================
  // JSX
  // =========================================================

  return (
    <div className="homes-admin-page">

      <div className="homes-admin-container">

        {/* HEADER */}

        <div className="homes-admin-header">

          <div>

            <p className="homes-admin-small-title">
              ADMIN PANEL
            </p>

            <h1>
              Homes Speaking
            </h1>

            <p className="homes-admin-subtitle">
              Manage Homes Speaking content with complete CRUD operations.
            </p>

          </div>

          <div className="homes-admin-count">

            <strong>
              {homes.length}
            </strong>

            <span>
              Total Homes
            </span>

          </div>

        </div>

        {/* FORM */}

        <div className="homes-admin-form-card">

          <div className="homes-admin-card-heading">

            <div>

              <h2>
                {editingId !== null
                  ? "Edit Home"
                  : "Add New Home"}
              </h2>

              <p>
                {editingId !== null
                  ? "Update existing Homes Speaking content."
                  : "Create a new Homes Speaking card."}
              </p>

            </div>

            {editingId !== null && (
              <button
                type="button"
                className="homes-admin-cancel-top"
                onClick={cancelEdit}
              >
                Cancel Edit
              </button>
            )}

          </div>

          <form
            className="homes-admin-form"
            onSubmit={handleSubmit}
          >

            <div className="homes-admin-form-grid">

              {/* CATEGORY */}

              <div className="homes-admin-field">

                <label>
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="realestate"
                />

              </div>

              {/* DATE */}

              <div className="homes-admin-field">

                <label>
                  Date
                </label>

                <input
                  type="text"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  placeholder="25 May 2023"
                />

              </div>

              {/* AUTHOR */}

              <div className="homes-admin-field">

                <label>
                  Author
                </label>

                <input
                  type="text"
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  placeholder="WorkDo"
                />

              </div>

              {/* SELECT IMAGE */}

              <div className="homes-admin-field">

                <label>
                  Select Image
                </label>

                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={
                    handleImageChange
                  }
                />

              </div>

              {/* TITLE */}

              <div className="homes-admin-field full-width">

                <label>
                  Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter home title"
                />

              </div>

              {/* DESCRIPTION */}

              <div className="homes-admin-field full-width">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    form.description
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter home description"
                  rows="5"
                />

              </div>

              {/* DETAILED DESCRIPTION */}

              <div className="homes-admin-field full-width">

                <label>
                  Detailed Description
                </label>

                <textarea
                  name="detailedDescription"
                  value={
                    form.detailedDescription
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter detailed property content"
                  rows="7"
                />

              </div>

              {/* ADDITIONAL DESCRIPTION */}

              <div className="homes-admin-field full-width">

                <label>
                  Additional Description
                </label>

                <textarea
                  name="additionalDescription"
                  value={
                    form.additionalDescription
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter additional property content"
                  rows="6"
                />

              </div>

              {/* QUOTE */}

              <div className="homes-admin-field full-width">

                <label>
                  Quote
                </label>

                <textarea
                  name="quote"
                  value={
                    form.quote
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter quote for the details page"
                  rows="4"
                />

              </div>

              {/* TAGS */}

              <div className="homes-admin-field full-width">

                <label>
                  Tags
                </label>

                <input
                  type="text"
                  name="tags"
                  value={
                    Array.isArray(form.tags)
                      ? form.tags.join(", ")
                      : form.tags
                  }
                  onChange={(e) =>
                    setForm((previous) => ({
                      ...previous,
                      tags: e.target.value
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean),
                    }))
                  }
                  placeholder="News, Realestate, Luxury"
                />

              </div>

            </div>

            {/* IMAGE PREVIEW */}

            {(imagePreview ||
              form.image) && (

              <div className="homes-admin-preview">

                <p>
                  Image Preview
                </p>

                <img
                  src={
                    imagePreview ||
                    getImageUrl(
                      form.image
                    )
                  }
                  alt="Preview"
                  onError={(e) => {
                    e.currentTarget.style.display =
                      "none";
                  }}
                />

              </div>
            )}

            {/* ACTIONS */}

            <div className="homes-admin-form-actions">

              <button
                type="submit"
                className="homes-admin-save-btn"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : editingId !== null
                  ? "Update Home"
                  : "Add Home"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  className="homes-admin-cancel-btn"
                  onClick={cancelEdit}
                  disabled={loading}
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

        </div>

        {/* RECENT HOMES */}

        <div className="homes-admin-list-header">

          <div>

            <h2>
              Recent Homes
            </h2>

            <p>
              Latest 4 Homes Speaking properties
            </p>

          </div>

          <button
            type="button"
            className="homes-admin-view-all-btn"
            onClick={() =>
              navigate(
                "/admin/homes-speaking/all"
              )
            }
          >
            View All{" "}
            <span>→</span>
          </button>

        </div>

        <div className="homes-admin-table-card">

          {recentHomes.length > 0 ? (

            <div className="homes-admin-table-wrapper">

              <table className="homes-admin-table">

                <thead>

                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Author</th>
                    <th>Actions</th>
                  </tr>

                </thead>

                <tbody>

                  {recentHomes.map(
                    (home) => (

                      <tr
                        key={home.id}
                      >

                        <td>

                          <img
                            className="homes-admin-table-image"
                            src={getImageUrl(
                              home.image
                            )}
                            alt={
                              home.title ||
                              "Home"
                            }
                            onError={(
                              e
                            ) => {
                              e.currentTarget.src =
                                "/images/home-place-1.jpg";
                            }}
                          />

                        </td>

                        <td>

                          <div className="homes-admin-title-cell">

                            <strong>
                              {home.title ||
                                "Untitled Home"}
                            </strong>

                            <span>
                              {home.description ||
                                "No description available."}
                            </span>

                          </div>

                        </td>

                        <td>

                          <span className="homes-admin-category">

                            {home.category ||
                              "realestate"}

                          </span>

                        </td>

                        <td>
                          {home.date ||
                            "N/A"}
                        </td>

                        <td>
                          {home.author ||
                            "N/A"}
                        </td>

                        <td>

                          <div className="homes-admin-actions">

                            <button
                              type="button"
                              className="homes-admin-edit"
                              onClick={() =>
                                handleEdit(
                                  home
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="homes-admin-delete"
                              onClick={() =>
                                handleDelete(
                                  home.id
                                )
                              }
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          ) : (

            <div className="homes-admin-empty">

              <h3>
                No homes found
              </h3>

              <p>
                Add a new home using the form above.
              </p>

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default HomesSpeakingAdmin;