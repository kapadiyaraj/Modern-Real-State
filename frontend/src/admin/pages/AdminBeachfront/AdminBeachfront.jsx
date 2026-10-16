// import React, { useEffect, useState } from "react";
// import "./AdminBeachfront.css";

// const API = "http://localhost:5000/api/beachfront";
// const SERVER = "http://localhost:5000";

// const emptyForm = {
//   titleTop: "",
//   title: "",
//   description: "",
//   featureImage: "",
//   featureDescription: "",
//   cards: [],
// };

// const AdminBeachfront = () => {
//   const [items, setItems] = useState([]);
//   const [formData, setFormData] = useState(emptyForm);

//   const [editingId, setEditingId] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [pageSaving, setPageSaving] = useState(false);

//   const [cardSaving, setCardSaving] = useState({});
//   const [featureUploading, setFeatureUploading] = useState(false);
//   const [cardUploading, setCardUploading] = useState({});

//   // =========================
//   // GET ALL BEACHFRONT DATA
//   // =========================

//   const fetchData = async () => {
//   try {
//     setLoading(true);

//     const response = await fetch(API);
//     const result = await response.json();

//     if (!response.ok || !result.success) {
//       throw new Error(
//         result.message || "Failed to fetch beachfront data"
//       );
//     }

//     const data = result.data || [];

//     setItems(data);

//     // MongoDB ma data hoy to form ma show karo
//     if (data.length > 0) {
//       const latest = data[0];

//       setEditingId(latest._id);

//       setFormData({
//         titleTop: latest.titleTop || "",
//         title: latest.title || "",
//         description: latest.description || "",
//         featureImage: latest.featureImage || "",
//         featureDescription: latest.featureDescription || "",
//         cards: Array.isArray(latest.cards)
//           ? latest.cards
//           : [],
//       });
//     }
//   } catch (error) {
//     console.error(
//       "GET BEACHFRONT ERROR:",
//       error
//     );
//   } finally {
//     setLoading(false);
//   }
// };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // =========================
//   // IMAGE URL
//   // =========================

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
//       return `${SERVER}${image}`;
//     }

//     if (image.startsWith("uploads/")) {
//       return `${SERVER}/${image}`;
//     }

//     if (image.startsWith("/")) {
//       return image;
//     }

//     return `${SERVER}/${image}`;
//   };

//   // =========================
//   // PAGE INPUT
//   // =========================

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // =========================
//   // CARD INPUT
//   // =========================

//   const handleCardChange = (index, field, value) => {
//     setFormData((prev) => {
//       const updatedCards = [...prev.cards];

//       updatedCards[index] = {
//         ...updatedCards[index],
//         [field]: value,
//       };

//       return {
//         ...prev,
//         cards: updatedCards,
//       };
//     });
//   };

//   // =========================
//   // UPLOAD IMAGE
//   // =========================

//   const uploadImage = async (file) => {
//     if (!file) return "";

//     const form = new FormData();

//     form.append("image", file);

//     const response = await fetch(`${API}/upload`, {
//       method: "POST",
//       body: form,
//     });

//     const result = await response.json();

//     if (!response.ok || !result.success) {
//       throw new Error(
//         result.message || "Image upload failed"
//       );
//     }

//     return result.path;
//   };

//   // =========================
//   // FEATURE IMAGE
//   // =========================

//   const handleFeatureImage = async (e) => {
//     const file = e.target.files[0];

//     if (!file) return;

//     try {
//       setFeatureUploading(true);

//       const imagePath = await uploadImage(file);

//       setFormData((prev) => ({
//         ...prev,
//         featureImage: imagePath,
//       }));
//     } catch (error) {
//       console.error("FEATURE IMAGE ERROR:", error);
//       alert(error.message);
//     } finally {
//       setFeatureUploading(false);
//     }
//   };

//   // =========================
//   // CARD IMAGE
//   // =========================

//   const handleCardImage = async (index, e) => {
//     const file = e.target.files[0];

//     if (!file) return;

//     try {
//       setCardUploading((prev) => ({
//         ...prev,
//         [index]: true,
//       }));

//       const imagePath = await uploadImage(file);

//       handleCardChange(
//         index,
//         "image",
//         imagePath
//       );
//     } catch (error) {
//       console.error("CARD IMAGE ERROR:", error);
//       alert(error.message);
//     } finally {
//       setCardUploading((prev) => ({
//         ...prev,
//         [index]: false,
//       }));
//     }
//   };

//   // =========================
//   // ADD NEW CARD
//   // =========================

//   const addCard = () => {
//     setFormData((prev) => ({
//       ...prev,
//       cards: [
//         ...prev.cards,
//         {
//           title: "",
//           image: "",
//         },
//       ],
//     }));
//   };

//   // =========================
//   // REMOVE CARD
//   // =========================

//   const removeCard = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       cards: prev.cards.filter(
//         (_, i) => i !== index
//       ),
//     }));
//   };

//   // =========================
//   // SAVE PAGE
//   // =========================

//   const savePage = async () => {
//     if (!formData.title.trim()) {
//       alert("Title is required");
//       return;
//     }

//     try {
//       setPageSaving(true);

//       let response;

//       // UPDATE
//       if (editingId) {
//         response = await fetch(
//           `${API}/${editingId}`,
//           {
//             method: "PUT",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               titleTop: formData.titleTop,
//               title: formData.title,
//               description: formData.description,
//               featureImage: formData.featureImage,
//               featureDescription:
//                 formData.featureDescription,
//             }),
//           }
//         );
//       }

//       // CREATE
//       else {
//         response = await fetch(API, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             titleTop: formData.titleTop,
//             title: formData.title,
//             description: formData.description,
//             cards: [],
//             featureImage: formData.featureImage,
//             featureDescription:
//               formData.featureDescription,
//           }),
//         });
//       }

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(
//           result.message || "Failed to save page"
//         );
//       }

//       // ID maintain
//       setEditingId(result.data._id);

//       // Form empty nahi thase
//       setFormData((prev) => ({
//         ...prev,
//         titleTop:
//           result.data.titleTop || "",
//         title:
//           result.data.title || "",
//         description:
//           result.data.description || "",
//         featureImage:
//           result.data.featureImage || "",
//         featureDescription:
//           result.data.featureDescription || "",
//         cards:
//           result.data.cards || prev.cards,
//       }));

//       await fetchData();

//       alert("Beachfront page saved successfully");
//     } catch (error) {
//       console.error("SAVE PAGE ERROR:", error);
//       alert(error.message);
//     } finally {
//       setPageSaving(false);
//     }
//   };

//   // =========================
//   // SAVE INDIVIDUAL CARD
//   // =========================

//   const saveCard = async (index) => {
//     const card = formData.cards[index];

//     if (!card) {
//       alert("Card not found");
//       return;
//     }

//     if (!card.title || !card.title.trim()) {
//       alert(
//         `Card ${index + 1} title is required`
//       );
//       return;
//     }

//     try {
//       setCardSaving((prev) => ({
//         ...prev,
//         [index]: true,
//       }));

//       let beachfrontId = editingId;

//       // =========================
//       // IF PAGE DOES NOT EXIST
//       // =========================

//       if (!beachfrontId) {
//         const createResponse = await fetch(API, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             titleTop: formData.titleTop,
//             title:
//               formData.title ||
//               "Beachfront Properties",
//             description: formData.description,
//             cards: [],
//             featureImage:
//               formData.featureImage,
//             featureDescription:
//               formData.featureDescription,
//           }),
//         });

//         const createResult =
//           await createResponse.json();

//         if (
//           !createResponse.ok ||
//           !createResult.success
//         ) {
//           throw new Error(
//             createResult.message ||
//               "Failed to create beachfront"
//           );
//         }

//         beachfrontId =
//           createResult.data._id;

//         setEditingId(beachfrontId);
//       }

//       // =========================
//       // SAVE / UPDATE CARD
//       // =========================

//       const response = await fetch(
//         `${API}/${beachfrontId}/cards/${index}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             title: card.title,
//             image: card.image || "",
//           }),
//         }
//       );

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(
//           result.message ||
//             "Failed to save card"
//         );
//       }

//       // Backend mathi complete cards update
//       setFormData((prev) => ({
//         ...prev,
//         cards:
//           result.data.cards ||
//           prev.cards,
//       }));

//       await fetchData();

//       alert(
//         `Card ${index + 1} saved successfully`
//       );
//     } catch (error) {
//       console.error(
//         "SAVE CARD ERROR:",
//         error
//       );

//       alert(error.message);
//     } finally {
//       setCardSaving((prev) => ({
//         ...prev,
//         [index]: false,
//       }));
//     }
//   };

//   // =========================
//   // EDIT EXISTING DATA
//   // =========================

//   const editItem = (item) => {
//     setEditingId(item._id);

//     setFormData({
//       titleTop: item.titleTop || "",
//       title: item.title || "",
//       description:
//         item.description || "",
//       featureImage:
//         item.featureImage || "",
//       featureDescription:
//         item.featureDescription || "",
//       cards: item.cards || [],
//     });

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   // =========================
//   // DELETE
//   // =========================

//   const deleteItem = async (id) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this beachfront?"
//     );

//     if (!confirmDelete) return;

//     try {
//       const response = await fetch(
//         `${API}/${id}`,
//         {
//           method: "DELETE",
//         }
//       );

//       const result =
//         await response.json();

//       if (
//         !response.ok ||
//         !result.success
//       ) {
//         throw new Error(
//           result.message ||
//             "Failed to delete beachfront"
//         );
//       }

//       await fetchData();

//       if (editingId === id) {
//         setEditingId(null);
//         setFormData(emptyForm);
//       }

//       alert(
//         "Beachfront deleted successfully"
//       );
//     } catch (error) {
//       console.error(
//         "DELETE BEACHFRONT ERROR:",
//         error
//       );

//       alert(error.message);
//     }
//   };

//   // =========================
//   // ADD NEW FORM
//   // =========================

//   const resetForm = () => {
//     setEditingId(null);
//     setFormData(emptyForm);
//   };

//   return (
//     <div className="admin-beachfront">
//       <div className="admin-beachfront-container">

//         {/* ================= HEADER ================= */}

//         <div className="admin-beachfront-header">
//           <div>
//             <h1>
//               Beachfront Properties
//             </h1>

//             <p>
//               Manage page details,
//               feature section and
//               property cards.
//             </p>
//           </div>

//           {editingId && (
//             <button
//               type="button"
//               className="new-beachfront-btn"
//               onClick={resetForm}
//             >
//               + Add New
//             </button>
//           )}
//         </div>

//         {/* ================= PAGE DETAILS ================= */}

//         <div className="admin-form-section">

//           <h2>Page Details</h2>

//           <div className="form-grid">

//             <div className="form-group">
//               <label>
//                 Top Title
//               </label>

//               <input
//                 type="text"
//                 name="titleTop"
//                 value={formData.titleTop}
//                 onChange={handleChange}
//                 placeholder="Contemporary"
//               />
//             </div>

//             <div className="form-group">
//               <label>
//                 Title *
//               </label>

//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 placeholder="Beachfront Properties"
//               />
//             </div>

//           </div>

//           <div className="form-group">
//             <label>
//               Description
//             </label>

//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               placeholder="Enter description"
//               rows="5"
//             />
//           </div>

//           <div className="form-grid">

//             {/* FEATURE IMAGE */}

//             <div className="form-group">

//               <label>
//                 Feature Image
//               </label>

//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={
//                   handleFeatureImage
//                 }
//               />

//               {featureUploading && (
//                 <p className="upload-status">
//                   Uploading image...
//                 </p>
//               )}

//               {formData.featureImage && (
//                 <div className="image-preview">

//                   <img
//                     src={getImageUrl(
//                       formData.featureImage
//                     )}
//                     alt="Feature"
//                   />

//                 </div>
//               )}

//             </div>

//             {/* FEATURE DESCRIPTION */}

//             <div className="form-group">

//               <label>
//                 Feature Description
//               </label>

//               <textarea
//                 name="featureDescription"
//                 value={
//                   formData.featureDescription
//                 }
//                 onChange={handleChange}
//                 placeholder="Enter feature description"
//                 rows="5"
//               />

//             </div>

//           </div>

//           {/* PAGE SAVE */}

//           <div className="save-section">

//             <button
//               type="button"
//               className="save-btn"
//               onClick={savePage}
//               disabled={pageSaving}
//             >
//               {pageSaving
//                 ? "Saving..."
//                 : editingId
//                 ? "Update Page"
//                 : "Save Page"}
//             </button>

//           </div>

//         </div>

//         {/* ================= PROPERTY CARDS ================= */}

//         <div className="admin-form-section">

//           <div className="section-title-row">

//             <div>
//               <h2>
//                 Property Cards
//               </h2>

//               <p>
//                 Add and manage individual
//                 property cards.
//               </p>
//             </div>

//             <button
//               type="button"
//               className="add-card-btn"
//               onClick={addCard}
//             >
//               + Add Card
//             </button>

//           </div>

//           {formData.cards.length === 0 ? (

//             <div className="no-card-message">
//               No property cards added yet.
//             </div>

//           ) : (

//             <div className="cards-admin-grid">

//               {formData.cards.map(
//                 (card, index) => (

//                   <div
//                     className="property-card-form"
//                     key={
//                       card._id ||
//                       `card-${index}`
//                     }
//                   >

//                     {/* CARD HEADER */}

//                     <div className="card-form-header">

//                       <h3>
//                         Card {index + 1}
//                       </h3>

//                       <button
//                         type="button"
//                         className="delete-card-btn"
//                         onClick={() =>
//                           removeCard(index)
//                         }
//                       >
//                         Delete
//                       </button>

//                     </div>

//                     {/* CARD TITLE */}

//                     <div className="form-group">

//                       <label>
//                         Card Title *
//                       </label>

//                       <input
//                         type="text"
//                         value={
//                           card.title || ""
//                         }
//                         onChange={(e) =>
//                           handleCardChange(
//                             index,
//                             "title",
//                             e.target.value
//                           )
//                         }
//                         placeholder="Royal House"
//                       />

//                     </div>

//                     {/* CARD IMAGE */}

//                     <div className="form-group">

//                       <label>
//                         Card Image
//                       </label>

//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) =>
//                           handleCardImage(
//                             index,
//                             e
//                           )
//                         }
//                       />

//                       {cardUploading[
//                         index
//                       ] && (
//                         <p className="upload-status">
//                           Uploading image...
//                         </p>
//                       )}

//                       {card.image && (
//                         <div className="image-preview card-preview">

//                           <img
//                             src={getImageUrl(
//                               card.image
//                             )}
//                             alt={
//                               card.title ||
//                               `Card ${
//                                 index + 1
//                               }`
//                             }
//                           />

//                         </div>
//                       )}

//                     </div>

//                     {/* INDIVIDUAL SAVE */}

//                     <button
//                       type="button"
//                       className="save-card-btn"
//                       onClick={() =>
//                         saveCard(index)
//                       }
//                       disabled={
//                         cardSaving[index]
//                       }
//                     >
//                       {cardSaving[index]
//                         ? "Saving..."
//                         : `Save Card ${
//                             index + 1
//                           }`}
//                     </button>

//                   </div>

//                 )
//               )}

//             </div>

//           )}

//         </div>

//         {/* ================= EXISTING DATA ================= */}

//         <div className="existing-data-section">

//           <div className="existing-header">

//             <div>
//               <h2>
//                 Existing Beachfront Data
//               </h2>

//               <p>
//                 Saved data from MongoDB.
//               </p>
//             </div>

//           </div>

//           {loading ? (

//             <div className="loading-message">
//               Loading...
//             </div>

//           ) : items.length === 0 ? (

//             <div className="empty-message">
//               No beachfront data available.
//             </div>

//           ) : (

//             <div className="existing-data-list">

//               {items.map((item) => (

//                 <div
//                   className="existing-beachfront-item"
//                   key={item._id}
//                 >

//                   <div className="existing-content">

//                     {item.featureImage && (
//                       <img
//                         src={getImageUrl(
//                           item.featureImage
//                         )}
//                         alt={item.title}
//                         className="existing-feature-image"
//                       />
//                     )}

//                     <div>

//                       <span className="existing-top-title">
//                         {item.titleTop}
//                       </span>

//                       <h3>
//                         {item.title}
//                       </h3>

//                       <p>
//                         {item.description}
//                       </p>

//                       <span className="card-count">
//                         {item.cards?.length ||
//                           0}{" "}
//                         Property Cards
//                       </span>

//                     </div>

//                   </div>

//                   <div className="existing-actions">

//                     <button
//                       type="button"
//                       className="edit-btn"
//                       onClick={() =>
//                         editItem(item)
//                       }
//                     >
//                       Edit
//                     </button>

//                     <button
//                       type="button"
//                       className="delete-btn"
//                       onClick={() =>
//                         deleteItem(
//                           item._id
//                         )
//                       }
//                     >
//                       Delete
//                     </button>

//                   </div>

//                 </div>

//               ))}

//             </div>

//           )}

//         </div>

//       </div>
//     </div>
//   );
// };

// export default AdminBeachfront;



import React, { useEffect, useState } from "react";
import "./AdminBeachfront.css";

const API = "http://localhost:5000/api/beachfront";
const SERVER = "http://localhost:5000";
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


const emptyForm = {
  titleTop: "",
  title: "",
  description: "",
  featureImage: "",
  featureDescription: "",
  cards: [],
};

const AdminBeachfront = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [pageSaving, setPageSaving] = useState(false);

  const [cardSaving, setCardSaving] = useState({});
  const [featureUploading, setFeatureUploading] = useState(false);
  const [cardUploading, setCardUploading] = useState({});

  // =========================
  // GET ALL BEACHFRONT DATA
  // =========================

  const fetchData = async () => {
  try {
    setLoading(true);

    const response = await fetch(API, {
      headers: getAuthHeaders(),
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message || "Failed to fetch beachfront data"
      );
    }

    const data = result.data || [];

    setItems(data);

    // MongoDB ma data hoy to form ma show karo
    if (data.length > 0) {
      const latest = data[0];

      setEditingId(latest._id);

      setFormData({
        titleTop: latest.titleTop || "",
        title: latest.title || "",
        description: latest.description || "",
        featureImage: latest.featureImage || "",
        featureDescription: latest.featureDescription || "",
        cards: Array.isArray(latest.cards)
          ? latest.cards
          : [],
      });
    }
  } catch (error) {
    console.error(
      "GET BEACHFRONT ERROR:",
      error
    );
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchData();
  }, []);

  // =========================
  // IMAGE URL
  // =========================

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
      return `${SERVER}${image}`;
    }

    if (image.startsWith("uploads/")) {
      return `${SERVER}/${image}`;
    }

    if (image.startsWith("/")) {
      return image;
    }

    return `${SERVER}/${image}`;
  };

  // =========================
  // PAGE INPUT
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // CARD INPUT
  // =========================

  const handleCardChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedCards = [...prev.cards];

      updatedCards[index] = {
        ...updatedCards[index],
        [field]: value,
      };

      return {
        ...prev,
        cards: updatedCards,
      };
    });
  };

  // =========================
  // UPLOAD IMAGE
  // =========================

  const uploadImage = async (file) => {
    if (!file) return "";

    const form = new FormData();

    form.append("image", file);

    const response = await fetch(`${API}/upload`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: form,
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message || "Image upload failed"
      );
    }

    return result.path;
  };

  // =========================
  // FEATURE IMAGE
  // =========================

  const handleFeatureImage = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      setFeatureUploading(true);

      const imagePath = await uploadImage(file);

      setFormData((prev) => ({
        ...prev,
        featureImage: imagePath,
      }));
    } catch (error) {
      console.error("FEATURE IMAGE ERROR:", error);
      alert(error.message);
    } finally {
      setFeatureUploading(false);
    }
  };

  // =========================
  // CARD IMAGE
  // =========================

  const handleCardImage = async (index, e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      setCardUploading((prev) => ({
        ...prev,
        [index]: true,
      }));

      const imagePath = await uploadImage(file);

      handleCardChange(
        index,
        "image",
        imagePath
      );
    } catch (error) {
      console.error("CARD IMAGE ERROR:", error);
      alert(error.message);
    } finally {
      setCardUploading((prev) => ({
        ...prev,
        [index]: false,
      }));
    }
  };

  // =========================
  // ADD NEW CARD
  // =========================

  const addCard = () => {
    setFormData((prev) => ({
      ...prev,
      cards: [
        ...prev.cards,
        {
          title: "",
          image: "",
        },
      ],
    }));
  };

  // =========================
  // REMOVE CARD
  // =========================

  const removeCard = (index) => {
    setFormData((prev) => ({
      ...prev,
      cards: prev.cards.filter(
        (_, i) => i !== index
      ),
    }));
  };

  // =========================
  // SAVE PAGE
  // =========================

  const savePage = async () => {
    if (!formData.title.trim()) {
      alert("Title is required");
      return;
    }

    try {
      setPageSaving(true);

      let response;

      // UPDATE
      if (editingId) {
        response = await fetch(
          `${API}/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              ...getAuthHeaders(),
            },
            body: JSON.stringify({
              titleTop: formData.titleTop,
              title: formData.title,
              description: formData.description,
              featureImage: formData.featureImage,
              featureDescription:
                formData.featureDescription,
            }),
          }
        );
      }

      // CREATE
      else {
        response = await fetch(API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            titleTop: formData.titleTop,
            title: formData.title,
            description: formData.description,
            cards: [],
            featureImage: formData.featureImage,
            featureDescription:
              formData.featureDescription,
          }),
        });
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to save page"
        );
      }

      // ID maintain
      setEditingId(result.data._id);

      // Form empty nahi thase
      setFormData((prev) => ({
        ...prev,
        titleTop:
          result.data.titleTop || "",
        title:
          result.data.title || "",
        description:
          result.data.description || "",
        featureImage:
          result.data.featureImage || "",
        featureDescription:
          result.data.featureDescription || "",
        cards:
          result.data.cards || prev.cards,
      }));

      await fetchData();

      alert("Beachfront page saved successfully");
    } catch (error) {
      console.error("SAVE PAGE ERROR:", error);
      alert(error.message);
    } finally {
      setPageSaving(false);
    }
  };

  // =========================
  // SAVE INDIVIDUAL CARD
  // =========================

  const saveCard = async (index) => {
    const card = formData.cards[index];

    if (!card) {
      alert("Card not found");
      return;
    }

    if (!card.title || !card.title.trim()) {
      alert(
        `Card ${index + 1} title is required`
      );
      return;
    }

    try {
      setCardSaving((prev) => ({
        ...prev,
        [index]: true,
      }));

      let beachfrontId = editingId;

      // =========================
      // IF PAGE DOES NOT EXIST
      // =========================

      if (!beachfrontId) {
        const createResponse = await fetch(API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            titleTop: formData.titleTop,
            title:
              formData.title ||
              "Beachfront Properties",
            description: formData.description,
            cards: [],
            featureImage:
              formData.featureImage,
            featureDescription:
              formData.featureDescription,
          }),
        });

        const createResult =
          await createResponse.json();

        if (
          !createResponse.ok ||
          !createResult.success
        ) {
          throw new Error(
            createResult.message ||
              "Failed to create beachfront"
          );
        }

        beachfrontId =
          createResult.data._id;

        setEditingId(beachfrontId);
      }

      // =========================
      // SAVE / UPDATE CARD
      // =========================

      const response = await fetch(
        `${API}/${beachfrontId}/cards/${index}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            title: card.title,
            image: card.image || "",
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to save card"
        );
      }

      // Backend mathi complete cards update
      setFormData((prev) => ({
        ...prev,
        cards:
          result.data.cards ||
          prev.cards,
      }));

      await fetchData();

      alert(
        `Card ${index + 1} saved successfully`
      );
    } catch (error) {
      console.error(
        "SAVE CARD ERROR:",
        error
      );

      alert(error.message);
    } finally {
      setCardSaving((prev) => ({
        ...prev,
        [index]: false,
      }));
    }
  };

  // =========================
  // EDIT EXISTING DATA
  // =========================

  const editItem = (item) => {
    setEditingId(item._id);

    setFormData({
      titleTop: item.titleTop || "",
      title: item.title || "",
      description:
        item.description || "",
      featureImage:
        item.featureImage || "",
      featureDescription:
        item.featureDescription || "",
      cards: item.cards || [],
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // DELETE
  // =========================

  const deleteItem = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this beachfront?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API}/${id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to delete beachfront"
        );
      }

      await fetchData();

      if (editingId === id) {
        setEditingId(null);
        setFormData(emptyForm);
      }

      alert(
        "Beachfront deleted successfully"
      );
    } catch (error) {
      console.error(
        "DELETE BEACHFRONT ERROR:",
        error
      );

      alert(error.message);
    }
  };

  // =========================
  // ADD NEW FORM
  // =========================

  const resetForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
  };

  return (
    <div className="admin-beachfront">
      <div className="admin-beachfront-container">

        {/* ================= HEADER ================= */}

        <div className="admin-beachfront-header">
          <div>
            <h1>
              Beachfront Properties
            </h1>

            <p>
              Manage page details,
              feature section and
              property cards.
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              className="new-beachfront-btn"
              onClick={resetForm}
            >
              + Add New
            </button>
          )}
        </div>

        {/* ================= PAGE DETAILS ================= */}

        <div className="admin-form-section">

          <h2>Page Details</h2>

          <div className="form-grid">

            <div className="form-group">
              <label>
                Top Title
              </label>

              <input
                type="text"
                name="titleTop"
                value={formData.titleTop}
                onChange={handleChange}
                placeholder="Contemporary"
              />
            </div>

            <div className="form-group">
              <label>
                Title *
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Beachfront Properties"
              />
            </div>

          </div>

          <div className="form-group">
            <label>
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              rows="5"
            />
          </div>

          <div className="form-grid">

            {/* FEATURE IMAGE */}

            <div className="form-group">

              <label>
                Feature Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={
                  handleFeatureImage
                }
              />

              {featureUploading && (
                <p className="upload-status">
                  Uploading image...
                </p>
              )}

              {formData.featureImage && (
                <div className="image-preview">

                  <img
                    src={getImageUrl(
                      formData.featureImage
                    )}
                    alt="Feature"
                  />

                </div>
              )}

            </div>

            {/* FEATURE DESCRIPTION */}

            <div className="form-group">

              <label>
                Feature Description
              </label>

              <textarea
                name="featureDescription"
                value={
                  formData.featureDescription
                }
                onChange={handleChange}
                placeholder="Enter feature description"
                rows="5"
              />

            </div>

          </div>

          {/* PAGE SAVE */}

          <div className="save-section">

            <button
              type="button"
              className="save-btn"
              onClick={savePage}
              disabled={pageSaving}
            >
              {pageSaving
                ? "Saving..."
                : editingId
                ? "Update Page"
                : "Save Page"}
            </button>

          </div>

        </div>

        {/* ================= PROPERTY CARDS ================= */}

        <div className="admin-form-section">

          <div className="section-title-row">

            <div>
              <h2>
                Property Cards
              </h2>

              <p>
                Add and manage individual
                property cards.
              </p>
            </div>

            <button
              type="button"
              className="add-card-btn"
              onClick={addCard}
            >
              + Add Card
            </button>

          </div>

          {formData.cards.length === 0 ? (

            <div className="no-card-message">
              No property cards added yet.
            </div>

          ) : (

            <div className="cards-admin-grid">

              {formData.cards.map(
                (card, index) => (

                  <div
                    className="property-card-form"
                    key={
                      card._id ||
                      `card-${index}`
                    }
                  >

                    {/* CARD HEADER */}

                    <div className="card-form-header">

                      <h3>
                        Card {index + 1}
                      </h3>

                      <button
                        type="button"
                        className="delete-card-btn"
                        onClick={() =>
                          removeCard(index)
                        }
                      >
                        Delete
                      </button>

                    </div>

                    {/* CARD TITLE */}

                    <div className="form-group">

                      <label>
                        Card Title *
                      </label>

                      <input
                        type="text"
                        value={
                          card.title || ""
                        }
                        onChange={(e) =>
                          handleCardChange(
                            index,
                            "title",
                            e.target.value
                          )
                        }
                        placeholder="Royal House"
                      />

                    </div>

                    {/* CARD IMAGE */}

                    <div className="form-group">

                      <label>
                        Card Image
                      </label>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleCardImage(
                            index,
                            e
                          )
                        }
                      />

                      {cardUploading[
                        index
                      ] && (
                        <p className="upload-status">
                          Uploading image...
                        </p>
                      )}

                      {card.image && (
                        <div className="image-preview card-preview">

                          <img
                            src={getImageUrl(
                              card.image
                            )}
                            alt={
                              card.title ||
                              `Card ${
                                index + 1
                              }`
                            }
                          />

                        </div>
                      )}

                    </div>

                    {/* INDIVIDUAL SAVE */}

                    <button
                      type="button"
                      className="save-card-btn"
                      onClick={() =>
                        saveCard(index)
                      }
                      disabled={
                        cardSaving[index]
                      }
                    >
                      {cardSaving[index]
                        ? "Saving..."
                        : `Save Card ${
                            index + 1
                          }`}
                    </button>

                  </div>

                )
              )}

            </div>

          )}

        </div>

        {/* ================= EXISTING DATA ================= */}

        <div className="existing-data-section">

          <div className="existing-header">

            <div>
              <h2>
                Existing Beachfront Data
              </h2>

              <p>
                Saved data from MongoDB.
              </p>
            </div>

          </div>

          {loading ? (

            <div className="loading-message">
              Loading...
            </div>

          ) : items.length === 0 ? (

            <div className="empty-message">
              No beachfront data available.
            </div>

          ) : (

            <div className="existing-data-list">

              {items.map((item) => (

                <div
                  className="existing-beachfront-item"
                  key={item._id}
                >

                  <div className="existing-content">

                    {item.featureImage && (
                      <img
                        src={getImageUrl(
                          item.featureImage
                        )}
                        alt={item.title}
                        className="existing-feature-image"
                      />
                    )}

                    <div>

                      <span className="existing-top-title">
                        {item.titleTop}
                      </span>

                      <h3>
                        {item.title}
                      </h3>

                      <p>
                        {item.description}
                      </p>

                      <span className="card-count">
                        {item.cards?.length ||
                          0}{" "}
                        Property Cards
                      </span>

                    </div>

                  </div>

                  <div className="existing-actions">

                    <button
                      type="button"
                      className="edit-btn"
                      onClick={() =>
                        editItem(item)
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() =>
                        deleteItem(
                          item._id
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>
    </div>
  );
};

export default AdminBeachfront;