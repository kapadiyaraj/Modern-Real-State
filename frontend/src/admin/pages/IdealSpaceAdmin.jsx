


// import React, { useEffect, useState } from "react";
// import "./IdealSpaceAdmin.css";

// const API_URL = "http://localhost:5000/api/ideal-space";

// const defaultData = {
//   title: "Find your ideal space",

//   description:
//     "Welcome to the epitome of modern living in our tech-integrated homes. Seamlessly blending cutting-edge technology with elegant design, these residences are equipped with state-of-the-art smart home systems that enhance convenience, security, and energy efficiency.",

//   image: "/images/feature-house3.jpg",

//   newsletterTitle:
//     "Subscribe newsletter and get -20% off",

//   newsletterDescription:
//     "Control your home's lighting, temperature, and entertainment systems with a simple touch or voice command. Embrace the future of living as you experience the effortless integration of technology into every aspect of your daily life.",

//   emailPlaceholder: "Enter email address...",

//   buttonText: "Subscription",
// };

// const IdealSpaceAdmin = () => {
//   const [form, setForm] = useState(defaultData);

//   const [imagePreview, setImagePreview] = useState(
//     defaultData.image
//   );

//   // =========================
//   // GET DATA FROM MONGODB
//   // =========================
//   const fetchIdealSpace = async () => {
//     try {
//       const response = await fetch(API_URL);

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           result.message ||
//             "Failed to load Ideal Space data"
//         );
//       }

//       if (result.data) {
//         const updatedData = {
//           ...defaultData,
//           ...result.data,
//         };

//         setForm(updatedData);
//         setImagePreview(updatedData.image);
//       }
//     } catch (error) {
//       console.error(
//         "Unable to load Ideal Space data:",
//         error
//       );
//     }
//   };

//   useEffect(() => {
//     fetchIdealSpace();
//   }, []);

//   // =========================
//   // HANDLE CHANGE
//   // =========================
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // =========================
//   // IMAGE CHANGE
//   // =========================
//   const handleImageChange = (e) => {
//     const file = e.target.files?.[0];

//     if (!file) return;

//     if (!file.type.startsWith("image/")) {
//       alert("Please select an image file.");
//       return;
//     }

//     const reader = new FileReader();

//     reader.onloadend = () => {
//       const image = reader.result;

//       setForm((prev) => ({
//         ...prev,
//         image,
//       }));

//       setImagePreview(image);
//     };

//     reader.readAsDataURL(file);
//   };

//   // =========================
//   // SAVE TO MONGODB
//   // =========================
//   const handleSave = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch(API_URL, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(form),
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           result.message ||
//             "Failed to save Ideal Space data"
//         );
//       }

//       const updatedData = {
//         ...defaultData,
//         ...result.data,
//       };

//       setForm(updatedData);
//       setImagePreview(updatedData.image);

//       window.dispatchEvent(
//         new Event("idealSpaceUpdated")
//       );

//       alert(
//         "Ideal Space section saved successfully."
//       );
//     } catch (error) {
//       console.error(
//         "Save Ideal Space error:",
//         error
//       );

//       alert(
//         error.message ||
//           "Failed to save Ideal Space section."
//       );
//     }
//   };

//   // =========================
//   // RESET
//   // =========================
//   const handleReset = async () => {
//     const confirmReset = window.confirm(
//       "Are you sure you want to reset this section to default?"
//     );

//     if (!confirmReset) return;

//     try {
//       const response = await fetch(API_URL, {
//         method: "DELETE",
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           result.message ||
//             "Failed to reset Ideal Space"
//         );
//       }

//       setForm(defaultData);
//       setImagePreview(defaultData.image);

//       window.dispatchEvent(
//         new Event("idealSpaceUpdated")
//       );

//       alert(
//         "Ideal Space reset successfully."
//       );
//     } catch (error) {
//       console.error(
//         "Reset Ideal Space error:",
//         error
//       );

//       alert(
//         error.message ||
//           "Failed to reset Ideal Space."
//       );
//     }
//   };

//   return (
//     <div className="ideal-admin">

//       {/* HEADER */}
//       <div className="ideal-admin-header">

//         <div>
//           <h1>Find Your Ideal Space</h1>

//           <p>
//             Manage the Find Your Ideal Space section
//             content.
//           </p>
//         </div>

//         <button
//           type="button"
//           className="ideal-reset-btn"
//           onClick={handleReset}
//         >
//           Reset
//         </button>

//       </div>

//       {/* MAIN CARD */}
//       <div className="ideal-admin-card">

//         <form onSubmit={handleSave}>

//           {/* SECTION CONTENT */}
//           <div className="ideal-admin-block">

//             <h2>Section Content</h2>

//             <div className="ideal-admin-grid">

//               {/* TITLE */}
//               <div className="ideal-admin-group">

//                 <label>
//                   Section Heading
//                 </label>

//                 <input
//                   type="text"
//                   name="title"
//                   value={form.title}
//                   onChange={handleChange}
//                   placeholder="Find your ideal space"
//                 />

//               </div>

//               {/* IMAGE */}
//               <div className="ideal-admin-group">

//                 <label>
//                   Main Image
//                 </label>

//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageChange}
//                 />

//               </div>

//             </div>

//             {/* DESCRIPTION */}
//             <div className="ideal-admin-group full">

//               <label>
//                 Section Description
//               </label>

//               <textarea
//                 name="description"
//                 value={form.description}
//                 onChange={handleChange}
//                 rows="5"
//                 placeholder="Enter section description..."
//               />

//             </div>

//             {/* IMAGE PREVIEW */}
//             {imagePreview && (
//               <div className="ideal-image-preview-wrapper">

//                 <label>
//                   Image Preview
//                 </label>

//                 <div className="ideal-image-preview">

//                   <img
//                     src={imagePreview}
//                     alt="Ideal Space Preview"
//                   />

//                 </div>

//               </div>
//             )}

//           </div>

//           {/* NEWSLETTER */}
//           <div className="ideal-admin-block">

//             <h2>Newsletter Card</h2>

//             <div className="ideal-admin-grid">

//               {/* NEWSLETTER TITLE */}
//               <div className="ideal-admin-group">

//                 <label>
//                   Newsletter Heading
//                 </label>

//                 <input
//                   type="text"
//                   name="newsletterTitle"
//                   value={form.newsletterTitle}
//                   onChange={handleChange}
//                   placeholder="Subscribe newsletter and get -20% off"
//                 />

//               </div>

//               {/* EMAIL PLACEHOLDER */}
//               <div className="ideal-admin-group">

//                 <label>
//                   Email Placeholder
//                 </label>

//                 <input
//                   type="text"
//                   name="emailPlaceholder"
//                   value={form.emailPlaceholder}
//                   onChange={handleChange}
//                   placeholder="Enter email address..."
//                 />

//               </div>

//             </div>

//             {/* NEWSLETTER DESCRIPTION */}
//             <div className="ideal-admin-group full">

//               <label>
//                 Newsletter Description
//               </label>

//               <textarea
//                 name="newsletterDescription"
//                 value={form.newsletterDescription}
//                 onChange={handleChange}
//                 rows="5"
//                 placeholder="Enter newsletter description..."
//               />

//             </div>

//             {/* BUTTON */}
//             <div className="ideal-admin-group">

//               <label>
//                 Button Text
//               </label>

//               <input
//                 type="text"
//                 name="buttonText"
//                 value={form.buttonText}
//                 onChange={handleChange}
//                 placeholder="Subscription"
//               />

//             </div>

//           </div>

//           {/* SAVE */}
//           <div className="ideal-admin-actions">

//             <button
//               type="submit"
//               className="ideal-save-btn"
//             >
//               Save Changes
//             </button>

//             <button
//               type="button"
//               className="ideal-cancel-btn"
//               onClick={fetchIdealSpace}
//             >
//               Cancel
//             </button>

//           </div>

//         </form>

//       </div>

//       {/* LIVE PREVIEW */}
//       <div className="ideal-admin-preview-card">

//         <div className="ideal-preview-header">
//           <h2>Content Preview</h2>

//           <span>
//             Preview
//           </span>
//         </div>

//         <div className="ideal-preview">

//           <div className="ideal-preview-top">

//             <div className="ideal-preview-title">
//               <h3>
//                 {form.title}
//               </h3>
//             </div>

//             <div className="ideal-preview-description">
//               <p>
//                 {form.description}
//               </p>
//             </div>

//           </div>

//           <div className="ideal-preview-image">

//             <img
//               src={imagePreview}
//               alt="Preview"
//             />

//           </div>

//           <div className="ideal-preview-newsletter">

//             <h3>
//               {form.newsletterTitle}
//             </h3>

//             <p>
//               {form.newsletterDescription}
//             </p>

//             <div className="ideal-preview-form">

//               <input
//                 type="text"
//                 value=""
//                 placeholder={
//                   form.emailPlaceholder
//                 }
//                 readOnly
//               />

//               <button type="button">
//                 {form.buttonText}

//                 <span>↗</span>
//               </button>

//             </div>

//           </div>

//         </div>

//       </div>

//     </div>
//   );
// };

// export default IdealSpaceAdmin;






import React, { useEffect, useState } from "react";
import "./IdealSpaceAdmin.css";

const API_URL = "http://localhost:5000/api/ideal-space";
const getAuthHeaders = () => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("adminToken") ||
    localStorage.getItem("accessToken");

  return token ? { Authorization: `Bearer ${token}` } : {};
};


const defaultData = {
  title: "Find your ideal space",

  description:
    "Welcome to the epitome of modern living in our tech-integrated homes. Seamlessly blending cutting-edge technology with elegant design, these residences are equipped with state-of-the-art smart home systems that enhance convenience, security, and energy efficiency.",

  image: "/images/feature-house3.jpg",

  newsletterTitle:
    "Subscribe newsletter and get -20% off",

  newsletterDescription:
    "Control your home's lighting, temperature, and entertainment systems with a simple touch or voice command. Embrace the future of living as you experience the effortless integration of technology into every aspect of your daily life.",

  emailPlaceholder: "Enter email address...",

  buttonText: "Subscription",
};

const IdealSpaceAdmin = () => {
  const [form, setForm] = useState(defaultData);

  const [imagePreview, setImagePreview] = useState(
    defaultData.image
  );

  // =========================
  // GET DATA FROM MONGODB
  // =========================
  const fetchIdealSpace = async () => {
    try {
     const response = await fetch(API_URL, {
  headers: {
    ...getAuthHeaders(),
  },
});
      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to load Ideal Space data"
        );
      }

      if (result.data) {
        const updatedData = {
          ...defaultData,
          ...result.data,
        };

        setForm(updatedData);
        setImagePreview(updatedData.image);
      }
    } catch (error) {
      console.error(
        "Unable to load Ideal Space data:",
        error
      );
    }
  };

  useEffect(() => {
    fetchIdealSpace();
  }, []);

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // IMAGE CHANGE
  // =========================
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const image = reader.result;

      setForm((prev) => ({
        ...prev,
        image,
      }));

      setImagePreview(image);
    };

    reader.readAsDataURL(file);
  };

  // =========================
  // SAVE TO MONGODB
  // =========================
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to save Ideal Space data"
        );
      }

      const updatedData = {
        ...defaultData,
        ...result.data,
      };

      setForm(updatedData);
      setImagePreview(updatedData.image);

      window.dispatchEvent(
        new Event("idealSpaceUpdated")
      );

      alert(
        "Ideal Space section saved successfully."
      );
    } catch (error) {
      console.error(
        "Save Ideal Space error:",
        error
      );

      alert(
        error.message ||
          "Failed to save Ideal Space section."
      );
    }
  };

  // =========================
  // RESET
  // =========================
  const handleReset = async () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset this section to default?"
    );

    if (!confirmReset) return;

    try {
      const response = await fetch(API_URL, {
        method: "DELETE",
        headers: {
          ...getAuthHeaders(),
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to reset Ideal Space"
        );
      }

      setForm(defaultData);
      setImagePreview(defaultData.image);

      window.dispatchEvent(
        new Event("idealSpaceUpdated")
      );

      alert(
        "Ideal Space reset successfully."
      );
    } catch (error) {
      console.error(
        "Reset Ideal Space error:",
        error
      );

      alert(
        error.message ||
          "Failed to reset Ideal Space."
      );
    }
  };

  return (
    <div className="ideal-admin">

      {/* HEADER */}
      <div className="ideal-admin-header">

        <div>
          <h1>Find Your Ideal Space</h1>

          <p>
            Manage the Find Your Ideal Space section
            content.
          </p>
        </div>

        <button
          type="button"
          className="ideal-reset-btn"
          onClick={handleReset}
        >
          Reset
        </button>

      </div>

      {/* MAIN CARD */}
      <div className="ideal-admin-card">

        <form onSubmit={handleSave}>

          {/* SECTION CONTENT */}
          <div className="ideal-admin-block">

            <h2>Section Content</h2>

            <div className="ideal-admin-grid">

              {/* TITLE */}
              <div className="ideal-admin-group">

                <label>
                  Section Heading
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Find your ideal space"
                />

              </div>

              {/* IMAGE */}
              <div className="ideal-admin-group">

                <label>
                  Main Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />

              </div>

            </div>

            {/* DESCRIPTION */}
            <div className="ideal-admin-group full">

              <label>
                Section Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="5"
                placeholder="Enter section description..."
              />

            </div>

            {/* IMAGE PREVIEW */}
            {imagePreview && (
              <div className="ideal-image-preview-wrapper">

                <label>
                  Image Preview
                </label>

                <div className="ideal-image-preview">

                  <img
                    src={imagePreview}
                    alt="Ideal Space Preview"
                  />

                </div>

              </div>
            )}

          </div>

          {/* NEWSLETTER */}
          <div className="ideal-admin-block">

            <h2>Newsletter Card</h2>

            <div className="ideal-admin-grid">

              {/* NEWSLETTER TITLE */}
              <div className="ideal-admin-group">

                <label>
                  Newsletter Heading
                </label>

                <input
                  type="text"
                  name="newsletterTitle"
                  value={form.newsletterTitle}
                  onChange={handleChange}
                  placeholder="Subscribe newsletter and get -20% off"
                />

              </div>

              {/* EMAIL PLACEHOLDER */}
              <div className="ideal-admin-group">

                <label>
                  Email Placeholder
                </label>

                <input
                  type="text"
                  name="emailPlaceholder"
                  value={form.emailPlaceholder}
                  onChange={handleChange}
                  placeholder="Enter email address..."
                />

              </div>

            </div>

            {/* NEWSLETTER DESCRIPTION */}
            <div className="ideal-admin-group full">

              <label>
                Newsletter Description
              </label>

              <textarea
                name="newsletterDescription"
                value={form.newsletterDescription}
                onChange={handleChange}
                rows="5"
                placeholder="Enter newsletter description..."
              />

            </div>

            {/* BUTTON */}
            <div className="ideal-admin-group">

              <label>
                Button Text
              </label>

              <input
                type="text"
                name="buttonText"
                value={form.buttonText}
                onChange={handleChange}
                placeholder="Subscription"
              />

            </div>

          </div>

          {/* SAVE */}
          <div className="ideal-admin-actions">

            <button
              type="submit"
              className="ideal-save-btn"
            >
              Save Changes
            </button>

            <button
              type="button"
              className="ideal-cancel-btn"
              onClick={fetchIdealSpace}
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

      {/* LIVE PREVIEW */}
      <div className="ideal-admin-preview-card">

        <div className="ideal-preview-header">
          <h2>Content Preview</h2>

          <span>
            Preview
          </span>
        </div>

        <div className="ideal-preview">

          <div className="ideal-preview-top">

            <div className="ideal-preview-title">
              <h3>
                {form.title}
              </h3>
            </div>

            <div className="ideal-preview-description">
              <p>
                {form.description}
              </p>
            </div>

          </div>

          <div className="ideal-preview-image">

            <img
              src={imagePreview}
              alt="Preview"
            />

          </div>

          <div className="ideal-preview-newsletter">

            <h3>
              {form.newsletterTitle}
            </h3>

            <p>
              {form.newsletterDescription}
            </p>

            <div className="ideal-preview-form">

              <input
                type="text"
                value=""
                placeholder={
                  form.emailPlaceholder
                }
                readOnly
              />

              <button type="button">
                {form.buttonText}

                <span>↗</span>
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default IdealSpaceAdmin;