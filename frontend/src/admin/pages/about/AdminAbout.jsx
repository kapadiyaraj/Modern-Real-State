// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./AdminAbout.css";

// const API_URL = "http://localhost:5000/api/about";
// const UPLOAD_URL = "http://localhost:5000/api/about/upload";
// const SERVER_URL = "http://localhost:5000";

// const AdminAbout = () => {
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   const [uploading, setUploading] = useState(false);

//   const [heroForm, setHeroForm] = useState({ title: "", description: "" });
//   const [introForm, setIntroForm] = useState({ title: "", leftText: "", rightText: "" });
//   const [mainHeading, setMainHeading] = useState("");

//   const [storyForm, setStoryForm] = useState({
//     title: "",
//     image: "",
//     paragraph1: "",
//     paragraph2: "",
//   });

//   const [serviceForm, setServiceForm] = useState({
//     title: "",
//     icon: "",
//     description: "",
//   });

//   const [storySections, setStorySections] = useState([]);
//   const [services, setServices] = useState([]);

//   const [editingStory, setEditingStory] = useState(null);
//   const [editingService, setEditingService] = useState(null);

//   useEffect(() => {
//     fetchAboutData();
//   }, []);

//   const fetchAboutData = async () => {
//     try {
//       const response = await fetch(API_URL);
//       const result = await response.json();

//       if (result) {
//         if (result.hero) setHeroForm(result.hero);
//         if (result.intro) setIntroForm(result.intro);
//         if (result.mainHeading) setMainHeading(result.mainHeading);
//         if (result.storySections) setStorySections(result.storySections);
//         if (result.services) setServices(result.services);
//       }
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching about data:", error);
//       setLoading(false);
//     }
//   };

//   /* ===============================
//       IMAGE UPLOAD
//   =============================== */
//   const handleStoryImageUpload = async (event) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("image", file);

//     try {
//       setUploading(true);

//       const response = await fetch(UPLOAD_URL, {
//         method: "POST",
//         body: formData,
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result?.message || "Failed to upload image");
//       }

//       setStoryForm((previous) => ({
//         ...previous,
//         image: result.path,
//       }));
//     } catch (error) {
//       console.error("Image upload error:", error);
//       alert(error.message || "Failed to upload image.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const removeStoryImage = () => {
//     setStoryForm((previous) => ({ ...previous, image: "" }));

//     const fileInput = document.getElementById("story-image-input");
//     if (fileInput) fileInput.value = "";
//   };

//   // Resolve a stored path (e.g. "/uploads/about/x.jpg") into a full URL for <img src>.
//   // Paths starting with "/images" (static defaults) or "http" are left untouched.
//   const resolveImageUrl = (imagePath) => {
//     if (!imagePath) return "";
//     if (imagePath.startsWith("http")) return imagePath;
//     if (imagePath.startsWith("/uploads")) return `${SERVER_URL}${imagePath}`;
//     return imagePath; // default static images like /images/feature-house1.jpg
//   };

//   /* ===============================
//       SAVE FULL DATA
//   =============================== */
//   const saveFullDataToApi = async (updatedFields) => {
//     try {
//       const fullPayload = {
//         hero: heroForm,
//         intro: introForm,
//         mainHeading: mainHeading,
//         storySections: storySections,
//         services: services,
//         ...updatedFields,
//       };

//       const response = await fetch(API_URL, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(fullPayload),
//       });

//       const result = await response.json();
//       if (response.ok) {
//         alert("Changes saved successfully!");
//       } else {
//         alert("Failed to save: " + (result.message || "Unknown error"));
//       }
//     } catch (error) {
//       console.error("Error saving data:", error);
//       alert("Network error while saving data.");
//     }
//   };

//   const handleSaveHero = (e) => {
//     e.preventDefault();
//     saveFullDataToApi({ hero: heroForm });
//   };

//   const handleSaveIntro = (e) => {
//     e.preventDefault();
//     saveFullDataToApi({ intro: introForm });
//   };

//   const handleSaveMainHeading = (e) => {
//     e.preventDefault();
//     saveFullDataToApi({ mainHeading: mainHeading });
//   };

//   /* ===============================
//       STORY ACTIONS
//   =============================== */
//   const handleStorySubmit = (e) => {
//     e.preventDefault();

//     if (!storyForm.title.trim()) {
//       alert("Please enter section title.");
//       return;
//     }

//     if (!storyForm.image) {
//       alert("Please upload a section image.");
//       return;
//     }

//     let updatedStorySections;

//     if (editingStory) {
//       updatedStorySections = storySections.map((item) =>
//         item.id === editingStory.id
//           ? {
//               ...item,
//               title: storyForm.title,
//               image: storyForm.image,
//               paragraphs: [storyForm.paragraph1, storyForm.paragraph2],
//             }
//           : item
//       );
//     } else {
//       const newSection = {
//         id: Date.now(),
//         title: storyForm.title,
//         image: storyForm.image,
//         paragraphs: [storyForm.paragraph1, storyForm.paragraph2],
//       };
//       updatedStorySections = [...storySections, newSection];
//     }

//     setStorySections(updatedStorySections);
//     saveFullDataToApi({ storySections: updatedStorySections });
//     resetStoryForm();
//   };

//   const editStory = (item) => {
//     setEditingStory(item);
//     setStoryForm({
//       title: item.title,
//       image: item.image,
//       paragraph1: item.paragraphs?.[0] || "",
//       paragraph2: item.paragraphs?.[1] || "",
//     });
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const deleteStory = (id) => {
//     if (!window.confirm("Delete this section?")) return;

//     const updatedStorySections = storySections.filter((item) => item.id !== id);
//     setStorySections(updatedStorySections);
//     saveFullDataToApi({ storySections: updatedStorySections });
//   };

//   const resetStoryForm = () => {
//     setEditingStory(null);
//     setStoryForm({ title: "", image: "", paragraph1: "", paragraph2: "" });

//     const fileInput = document.getElementById("story-image-input");
//     if (fileInput) fileInput.value = "";
//   };

//   /* ===============================
//       SERVICES ACTIONS
//   =============================== */
//   const handleServiceSubmit = (e) => {
//     e.preventDefault();

//     if (!serviceForm.title.trim()) {
//       alert("Please enter service title.");
//       return;
//     }

//     let updatedServices;

//     if (editingService) {
//       updatedServices = services.map((item) =>
//         item.id === editingService.id
//           ? {
//               ...item,
//               title: serviceForm.title,
//               icon: serviceForm.icon,
//               description: serviceForm.description,
//             }
//           : item
//       );
//     } else {
//       const newService = {
//         id: Date.now(),
//         title: serviceForm.title,
//         icon: serviceForm.icon,
//         description: serviceForm.description,
//       };
//       updatedServices = [...services, newService];
//     }

//     setServices(updatedServices);
//     saveFullDataToApi({ services: updatedServices });
//     resetServiceForm();
//   };

//   const editService = (item) => {
//     setEditingService(item);
//     setServiceForm({
//       title: item.title,
//       icon: item.icon,
//       description: item.description,
//     });
//   };

//   const deleteService = (id) => {
//     if (!window.confirm("Delete this service?")) return;

//     const updatedServices = services.filter((item) => item.id !== id);
//     setServices(updatedServices);
//     saveFullDataToApi({ services: updatedServices });
//   };

//   const resetServiceForm = () => {
//     setEditingService(null);
//     setServiceForm({ title: "", icon: "", description: "" });
//   };

//   if (loading) {
//     return <div className="admin-about-loading">Loading Admin Data...</div>;
//   }

//   return (
//     <div className="admin-about">
//       {/* HEADER */}
//       <div className="admin-about-header">
//         <div>
//           <span className="admin-about-label">PAGE MANAGEMENT</span>
//           <h1>About Us (Section-wise Save)</h1>
//           <p>Manage and save each section individually.</p>
//         </div>

//         <div className="admin-about-header-actions">
//           <button className="admin-about-preview-btn" onClick={() => navigate("/about-us")}>
//             View Page
//           </button>
//           <button className="admin-about-reset-btn" onClick={fetchAboutData}>
//             Reload Data
//           </button>
//         </div>
//       </div>

//       {/* 1. HERO SECTION */}
//       <section className="admin-about-card">
//         <div className="admin-about-section-title">
//           <span>01</span>
//           <div>
//             <h2>Hero Section</h2>
//             <p>Manage About page hero content.</p>
//           </div>
//         </div>

//         <form className="admin-about-form" onSubmit={handleSaveHero}>
//           <label>Title</label>
//           <input
//             type="text"
//             value={heroForm.title}
//             onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
//             placeholder="Enter hero title"
//           />

//           <label>Description</label>
//           <textarea
//             rows="4"
//             value={heroForm.description}
//             onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
//             placeholder="Enter hero description"
//           />

//           <div className="admin-about-form-actions">
//             <button type="submit" className="admin-about-primary-btn">
//               Save Hero Section
//             </button>
//           </div>
//         </form>
//       </section>

//       {/* 2. INTRO SECTION */}
//       <section className="admin-about-card">
//         <div className="admin-about-section-title">
//           <span>02</span>
//           <div>
//             <h2>Introduction</h2>
//             <p>Manage the introductory content.</p>
//           </div>
//         </div>

//         <form className="admin-about-form" onSubmit={handleSaveIntro}>
//           <label>Heading</label>
//           <input
//             type="text"
//             value={introForm.title}
//             onChange={(e) => setIntroForm({ ...introForm, title: e.target.value })}
//             placeholder="Enter intro heading"
//           />

//           <div className="admin-about-two-column">
//             <div>
//               <label>Left Text</label>
//               <textarea
//                 rows="6"
//                 value={introForm.leftText}
//                 onChange={(e) => setIntroForm({ ...introForm, leftText: e.target.value })}
//                 placeholder="Enter left column text"
//               />
//             </div>
//             <div>
//               <label>Right Text</label>
//               <textarea
//                 rows="6"
//                 value={introForm.rightText}
//                 onChange={(e) => setIntroForm({ ...introForm, rightText: e.target.value })}
//                 placeholder="Enter right column text"
//               />
//             </div>
//           </div>

//           <div className="admin-about-form-actions">
//             <button type="submit" className="admin-about-primary-btn">
//               Save Introduction
//             </button>
//           </div>
//         </form>
//       </section>

//       {/* 3. MAIN HEADING SECTION */}
//       <section className="admin-about-card">
//         <div className="admin-about-section-title">
//           <span>03</span>
//           <div>
//             <h2>Main Heading</h2>
//             <p>Manage the large highlight heading.</p>
//           </div>
//         </div>

//         <form className="admin-about-form" onSubmit={handleSaveMainHeading}>
//           <label>Heading</label>
//           <textarea
//             rows="3"
//             value={mainHeading}
//             onChange={(e) => setMainHeading(e.target.value)}
//             placeholder="Enter main heading text"
//           />

//           <div className="admin-about-form-actions">
//             <button type="submit" className="admin-about-primary-btn">
//               Save Main Heading
//             </button>
//           </div>
//         </form>
//       </section>

//       {/* 4. STORY SECTIONS */}
//       <section className="admin-about-card">
//         <div className="admin-about-section-title">
//           <span>04</span>
//           <div>
//             <h2>About Story Sections</h2>
//             <p>Add, edit and save individual story blocks.</p>
//           </div>
//         </div>

//         <form className="admin-about-form" onSubmit={handleStorySubmit}>
//           <label>Section Title</label>
//           <input
//             type="text"
//             placeholder="Enter section title"
//             value={storyForm.title}
//             onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })}
//           />

//           <label>Section Image *</label>
//           <input
//             id="story-image-input"
//             type="file"
//             accept="image/*"
//             onChange={handleStoryImageUpload}
//             disabled={uploading}
//           />
//           {uploading && <small className="admin-about-uploading-text">Uploading image...</small>}

//           {storyForm.image && (
//             <div className="admin-about-image-preview-wrap">
//               <div className="admin-about-image-preview-item">
//                 <img src={resolveImageUrl(storyForm.image)} alt="Story preview" />
//                 <button
//                   type="button"
//                   className="admin-about-remove-image-btn"
//                   onClick={removeStoryImage}
//                   aria-label="Remove image"
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>
//           )}

//           <label>Paragraph 1</label>
//           <textarea
//             rows="4"
//             value={storyForm.paragraph1}
//             onChange={(e) => setStoryForm({ ...storyForm, paragraph1: e.target.value })}
//           />

//           <label>Paragraph 2</label>
//           <textarea
//             rows="4"
//             value={storyForm.paragraph2}
//             onChange={(e) => setStoryForm({ ...storyForm, paragraph2: e.target.value })}
//           />

//           <div className="admin-about-form-actions">
//             <button type="submit" className="admin-about-primary-btn" disabled={uploading}>
//               {editingStory ? "Update Story Block" : "Add & Save Story Block"}
//             </button>
//             {editingStory && (
//               <button type="button" className="admin-about-cancel-btn" onClick={resetStoryForm}>
//                 Cancel
//               </button>
//             )}
//           </div>
//         </form>

//         <div className="admin-about-items">
//           {storySections.map((item, index) => (
//             <div className="admin-about-item" key={item.id || index}>
//               <div className="admin-about-item-number">{index + 1}</div>
//               <div className="admin-about-item-image">
//                 <img src={resolveImageUrl(item.image)} alt={item.title} />
//               </div>
//               <div className="admin-about-item-content">
//                 <h3>{item.title}</h3>
//                 <p>{item.paragraphs?.[0]}</p>
//                 <div className="admin-about-item-actions">
//                   <button className="admin-about-edit-btn" onClick={() => editStory(item)}>
//                     Edit
//                   </button>
//                   <button className="admin-about-delete-btn" onClick={() => deleteStory(item.id)}>
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* 5. SERVICES SECTION */}
//       <section className="admin-about-card">
//         <div className="admin-about-section-title">
//           <span>05</span>
//           <div>
//             <h2>About Our Services</h2>
//             <p>Add, edit and save service cards.</p>
//           </div>
//         </div>

//         <form className="admin-about-form" onSubmit={handleServiceSubmit}>
//           <label>Service Title</label>
//           <input
//             type="text"
//             placeholder="Fast delivery"
//             value={serviceForm.title}
//             onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
//           />

//           <label>Icon</label>
//           <input
//             type="text"
//             placeholder="⚒"
//             value={serviceForm.icon}
//             onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
//           />

//           <label>Description</label>
//           <textarea
//             rows="4"
//             value={serviceForm.description}
//             onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
//           />

//           <div className="admin-about-form-actions">
//             <button type="submit" className="admin-about-primary-btn">
//               {editingService ? "Update Service" : "Add & Save Service"}
//             </button>
//             {editingService && (
//               <button type="button" className="admin-about-cancel-btn" onClick={resetServiceForm}>
//                 Cancel
//               </button>
//             )}
//           </div>
//         </form>

//         <div className="admin-about-service-grid">
//           {services.map((service, index) => (
//             <div className="admin-about-service-item" key={service.id || index}>
//               <div className="admin-about-service-top">
//                 <h3>{service.title}</h3>
//                 <span>{service.icon}</span>
//               </div>
//               <p>{service.description}</p>
//               <div className="admin-about-item-actions">
//                 <button className="admin-about-edit-btn" onClick={() => editService(service)}>
//                   Edit
//                 </button>
//                 <button className="admin-about-delete-btn" onClick={() => deleteService(service.id)}>
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default AdminAbout;



import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminAbout.css";

const API_URL = "http://localhost:5000/api/about";
const UPLOAD_URL = "http://localhost:5000/api/about/upload";
const SERVER_URL = "http://localhost:5000";
const getAuthHeaders = () => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("adminToken") ||
    localStorage.getItem("accessToken");

  return token ? { Authorization: `Bearer ${token}` } : {};
};


const AdminAbout = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [heroForm, setHeroForm] = useState({ title: "", description: "" });
  const [introForm, setIntroForm] = useState({ title: "", leftText: "", rightText: "" });
  const [mainHeading, setMainHeading] = useState("");

  const [storyForm, setStoryForm] = useState({
    title: "",
    image: "",
    paragraph1: "",
    paragraph2: "",
  });

  const [serviceForm, setServiceForm] = useState({
    title: "",
    icon: "",
    description: "",
  });

  const [storySections, setStorySections] = useState([]);
  const [services, setServices] = useState([]);

  const [editingStory, setEditingStory] = useState(null);
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await fetch(API_URL, {
  headers: {
    ...getAuthHeaders(),
  },
});
      const result = await response.json();

      if (result) {
        if (result.hero) setHeroForm(result.hero);
        if (result.intro) setIntroForm(result.intro);
        if (result.mainHeading) setMainHeading(result.mainHeading);
        if (result.storySections) setStorySections(result.storySections);
        if (result.services) setServices(result.services);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching about data:", error);
      setLoading(false);
    }
  };

  /* ===============================
      IMAGE UPLOAD
  =============================== */
  const handleStoryImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);

      const response = await fetch(UPLOAD_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Failed to upload image");
      }

      setStoryForm((previous) => ({
        ...previous,
        image: result.path,
      }));
    } catch (error) {
      console.error("Image upload error:", error);
      alert(error.message || "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const removeStoryImage = () => {
    setStoryForm((previous) => ({ ...previous, image: "" }));

    const fileInput = document.getElementById("story-image-input");
    if (fileInput) fileInput.value = "";
  };

  // Resolve a stored path (e.g. "/uploads/about/x.jpg") into a full URL for <img src>.
  // Paths starting with "/images" (static defaults) or "http" are left untouched.
  const resolveImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/uploads")) return `${SERVER_URL}${imagePath}`;
    return imagePath; // default static images like /images/feature-house1.jpg
  };

  /* ===============================
      SAVE FULL DATA
  =============================== */
  const saveFullDataToApi = async (updatedFields) => {
    try {
      const fullPayload = {
        hero: heroForm,
        intro: introForm,
        mainHeading: mainHeading,
        storySections: storySections,
        services: services,
        ...updatedFields,
      };

      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(fullPayload),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Changes saved successfully!");
      } else {
        alert("Failed to save: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Network error while saving data.");
    }
  };

  const handleSaveHero = (e) => {
    e.preventDefault();
    saveFullDataToApi({ hero: heroForm });
  };

  const handleSaveIntro = (e) => {
    e.preventDefault();
    saveFullDataToApi({ intro: introForm });
  };

  const handleSaveMainHeading = (e) => {
    e.preventDefault();
    saveFullDataToApi({ mainHeading: mainHeading });
  };

  /* ===============================
      STORY ACTIONS
  =============================== */
  const handleStorySubmit = (e) => {
    e.preventDefault();

    if (!storyForm.title.trim()) {
      alert("Please enter section title.");
      return;
    }

    if (!storyForm.image) {
      alert("Please upload a section image.");
      return;
    }

    let updatedStorySections;

    if (editingStory) {
      updatedStorySections = storySections.map((item) =>
        item.id === editingStory.id
          ? {
              ...item,
              title: storyForm.title,
              image: storyForm.image,
              paragraphs: [storyForm.paragraph1, storyForm.paragraph2],
            }
          : item
      );
    } else {
      const newSection = {
        id: Date.now(),
        title: storyForm.title,
        image: storyForm.image,
        paragraphs: [storyForm.paragraph1, storyForm.paragraph2],
      };
      updatedStorySections = [...storySections, newSection];
    }

    setStorySections(updatedStorySections);
    saveFullDataToApi({ storySections: updatedStorySections });
    resetStoryForm();
  };

  const editStory = (item) => {
    setEditingStory(item);
    setStoryForm({
      title: item.title,
      image: item.image,
      paragraph1: item.paragraphs?.[0] || "",
      paragraph2: item.paragraphs?.[1] || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteStory = (id) => {
    if (!window.confirm("Delete this section?")) return;

    const updatedStorySections = storySections.filter((item) => item.id !== id);
    setStorySections(updatedStorySections);
    saveFullDataToApi({ storySections: updatedStorySections });
  };

  const resetStoryForm = () => {
    setEditingStory(null);
    setStoryForm({ title: "", image: "", paragraph1: "", paragraph2: "" });

    const fileInput = document.getElementById("story-image-input");
    if (fileInput) fileInput.value = "";
  };

  /* ===============================
      SERVICES ACTIONS
  =============================== */
  const handleServiceSubmit = (e) => {
    e.preventDefault();

    if (!serviceForm.title.trim()) {
      alert("Please enter service title.");
      return;
    }

    let updatedServices;

    if (editingService) {
      updatedServices = services.map((item) =>
        item.id === editingService.id
          ? {
              ...item,
              title: serviceForm.title,
              icon: serviceForm.icon,
              description: serviceForm.description,
            }
          : item
      );
    } else {
      const newService = {
        id: Date.now(),
        title: serviceForm.title,
        icon: serviceForm.icon,
        description: serviceForm.description,
      };
      updatedServices = [...services, newService];
    }

    setServices(updatedServices);
    saveFullDataToApi({ services: updatedServices });
    resetServiceForm();
  };

  const editService = (item) => {
    setEditingService(item);
    setServiceForm({
      title: item.title,
      icon: item.icon,
      description: item.description,
    });
  };

  const deleteService = (id) => {
    if (!window.confirm("Delete this service?")) return;

    const updatedServices = services.filter((item) => item.id !== id);
    setServices(updatedServices);
    saveFullDataToApi({ services: updatedServices });
  };

  const resetServiceForm = () => {
    setEditingService(null);
    setServiceForm({ title: "", icon: "", description: "" });
  };

  if (loading) {
    return <div className="admin-about-loading">Loading Admin Data...</div>;
  }

  return (
    <div className="admin-about">
      {/* HEADER */}
      <div className="admin-about-header">
        <div>
          <span className="admin-about-label">PAGE MANAGEMENT</span>
          <h1>About Us (Section-wise Save)</h1>
          <p>Manage and save each section individually.</p>
        </div>

        <div className="admin-about-header-actions">
          <button className="admin-about-preview-btn" onClick={() => navigate("/about-us")}>
            View Page
          </button>
          <button className="admin-about-reset-btn" onClick={fetchAboutData}>
            Reload Data
          </button>
        </div>
      </div>

      {/* 1. HERO SECTION */}
      <section className="admin-about-card">
        <div className="admin-about-section-title">
          <span>01</span>
          <div>
            <h2>Hero Section</h2>
            <p>Manage About page hero content.</p>
          </div>
        </div>

        <form className="admin-about-form" onSubmit={handleSaveHero}>
          <label>Title</label>
          <input
            type="text"
            value={heroForm.title}
            onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
            placeholder="Enter hero title"
          />

          <label>Description</label>
          <textarea
            rows="4"
            value={heroForm.description}
            onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
            placeholder="Enter hero description"
          />

          <div className="admin-about-form-actions">
            <button type="submit" className="admin-about-primary-btn">
              Save Hero Section
            </button>
          </div>
        </form>
      </section>

      {/* 2. INTRO SECTION */}
      <section className="admin-about-card">
        <div className="admin-about-section-title">
          <span>02</span>
          <div>
            <h2>Introduction</h2>
            <p>Manage the introductory content.</p>
          </div>
        </div>

        <form className="admin-about-form" onSubmit={handleSaveIntro}>
          <label>Heading</label>
          <input
            type="text"
            value={introForm.title}
            onChange={(e) => setIntroForm({ ...introForm, title: e.target.value })}
            placeholder="Enter intro heading"
          />

          <div className="admin-about-two-column">
            <div>
              <label>Left Text</label>
              <textarea
                rows="6"
                value={introForm.leftText}
                onChange={(e) => setIntroForm({ ...introForm, leftText: e.target.value })}
                placeholder="Enter left column text"
              />
            </div>
            <div>
              <label>Right Text</label>
              <textarea
                rows="6"
                value={introForm.rightText}
                onChange={(e) => setIntroForm({ ...introForm, rightText: e.target.value })}
                placeholder="Enter right column text"
              />
            </div>
          </div>

          <div className="admin-about-form-actions">
            <button type="submit" className="admin-about-primary-btn">
              Save Introduction
            </button>
          </div>
        </form>
      </section>

      {/* 3. MAIN HEADING SECTION */}
      <section className="admin-about-card">
        <div className="admin-about-section-title">
          <span>03</span>
          <div>
            <h2>Main Heading</h2>
            <p>Manage the large highlight heading.</p>
          </div>
        </div>

        <form className="admin-about-form" onSubmit={handleSaveMainHeading}>
          <label>Heading</label>
          <textarea
            rows="3"
            value={mainHeading}
            onChange={(e) => setMainHeading(e.target.value)}
            placeholder="Enter main heading text"
          />

          <div className="admin-about-form-actions">
            <button type="submit" className="admin-about-primary-btn">
              Save Main Heading
            </button>
          </div>
        </form>
      </section>

      {/* 4. STORY SECTIONS */}
      <section className="admin-about-card">
        <div className="admin-about-section-title">
          <span>04</span>
          <div>
            <h2>About Story Sections</h2>
            <p>Add, edit and save individual story blocks.</p>
          </div>
        </div>

        <form className="admin-about-form" onSubmit={handleStorySubmit}>
          <label>Section Title</label>
          <input
            type="text"
            placeholder="Enter section title"
            value={storyForm.title}
            onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })}
          />

          <label>Section Image *</label>
          <input
            id="story-image-input"
            type="file"
            accept="image/*"
            onChange={handleStoryImageUpload}
            disabled={uploading}
          />
          {uploading && <small className="admin-about-uploading-text">Uploading image...</small>}

          {storyForm.image && (
            <div className="admin-about-image-preview-wrap">
              <div className="admin-about-image-preview-item">
                <img src={resolveImageUrl(storyForm.image)} alt="Story preview" />
                <button
                  type="button"
                  className="admin-about-remove-image-btn"
                  onClick={removeStoryImage}
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <label>Paragraph 1</label>
          <textarea
            rows="4"
            value={storyForm.paragraph1}
            onChange={(e) => setStoryForm({ ...storyForm, paragraph1: e.target.value })}
          />

          <label>Paragraph 2</label>
          <textarea
            rows="4"
            value={storyForm.paragraph2}
            onChange={(e) => setStoryForm({ ...storyForm, paragraph2: e.target.value })}
          />

          <div className="admin-about-form-actions">
            <button type="submit" className="admin-about-primary-btn" disabled={uploading}>
              {editingStory ? "Update Story Block" : "Add & Save Story Block"}
            </button>
            {editingStory && (
              <button type="button" className="admin-about-cancel-btn" onClick={resetStoryForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="admin-about-items">
          {storySections.map((item, index) => (
            <div className="admin-about-item" key={item.id || index}>
              <div className="admin-about-item-number">{index + 1}</div>
              <div className="admin-about-item-image">
                <img src={resolveImageUrl(item.image)} alt={item.title} />
              </div>
              <div className="admin-about-item-content">
                <h3>{item.title}</h3>
                <p>{item.paragraphs?.[0]}</p>
                <div className="admin-about-item-actions">
                  <button className="admin-about-edit-btn" onClick={() => editStory(item)}>
                    Edit
                  </button>
                  <button className="admin-about-delete-btn" onClick={() => deleteStory(item.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SERVICES SECTION */}
      <section className="admin-about-card">
        <div className="admin-about-section-title">
          <span>05</span>
          <div>
            <h2>About Our Services</h2>
            <p>Add, edit and save service cards.</p>
          </div>
        </div>

        <form className="admin-about-form" onSubmit={handleServiceSubmit}>
          <label>Service Title</label>
          <input
            type="text"
            placeholder="Fast delivery"
            value={serviceForm.title}
            onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
          />

          <label>Icon</label>
          <input
            type="text"
            placeholder="⚒"
            value={serviceForm.icon}
            onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
          />

          <label>Description</label>
          <textarea
            rows="4"
            value={serviceForm.description}
            onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
          />

          <div className="admin-about-form-actions">
            <button type="submit" className="admin-about-primary-btn">
              {editingService ? "Update Service" : "Add & Save Service"}
            </button>
            {editingService && (
              <button type="button" className="admin-about-cancel-btn" onClick={resetServiceForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="admin-about-service-grid">
          {services.map((service, index) => (
            <div className="admin-about-service-item" key={service.id || index}>
              <div className="admin-about-service-top">
                <h3>{service.title}</h3>
                <span>{service.icon}</span>
              </div>
              <p>{service.description}</p>
              <div className="admin-about-item-actions">
                <button className="admin-about-edit-btn" onClick={() => editService(service)}>
                  Edit
                </button>
                <button className="admin-about-delete-btn" onClick={() => deleteService(service.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminAbout;