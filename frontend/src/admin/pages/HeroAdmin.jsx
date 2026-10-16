// import React, { useState, useEffect } from 'react';
// import './HeroAdmin.css';

// const defaultSlides = [
//   {
//     id: 1,
//     location: 'Utica, Pensylvania 57867',
//     title: 'A modern home in the comfort of San Francisco',
//     description: 'Enjoy the breathtaking views of the city skyline...',
//     buttonText: 'Show full details',
//     buttonUrl: '#details-1',
//     bgImage: '/images/hero-bg.jpg',
//     bottomCard: {
//       number: '0',
//       title: 'Modern houses for the few',
//       description: 'Discover a haven of refined urban living...',
//     },
//   },
//   {
//     id: 2,
//     location: 'Utica, Pensylvania 57867',
//     title: 'Eco-Friendly Homes for Modern Living',
//     description: 'Experience a harmonious balance between sustainable living...',
//     buttonText: 'Show full details',
//     buttonUrl: '#details-2',
//     bgImage: '/images/farm-vila.jpg',
//     bottomCard: {
//       number: '0',
//       title: 'Luxurious Loft Living in the Heart of the City',
//       description: 'Embrace a serene lifestyle surrounded by lush green spaces...',
//     },
//   },
// ];

// const HeroAdmin = () => {
//   const [slides, setSlides] = useState(defaultSlides);
//   const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
//   const [saveStatus, setSaveStatus] = useState('');

//   useEffect(() => {
//     const saved = localStorage.getItem('hero_slides_data');
//     if (saved) {
//       try {
//         setSlides(JSON.parse(saved));
//       } catch (e) {
//         console.error(e);
//       }
//     }
//   }, []);

//   const currentSlide = slides[selectedSlideIndex];

//   const handleInputChange = (field, value) => {
//     const updated = [...slides];
//     if (field.includes('.')) {
//       const [parent, child] = field.split('.');
//       updated[selectedSlideIndex][parent][child] = value;
//     } else {
//       updated[selectedSlideIndex][field] = value;
//     }
//     setSlides(updated);
//   };

//   const handleSave = (e) => {
//     e.preventDefault();
//     // Admin Panel માંથી ડેટા બ્રાઉઝરની મેમરીમાં સેવ થાય છે
//     localStorage.setItem('hero_slides_data', JSON.stringify(slides));
//     setSaveStatus('All Hero Slides Saved Successfully!');
//     setTimeout(() => setSaveStatus(''), 3000);
//   };

//   const addNewSlide = () => {
//     const newSlide = {
//       id: Date.now(),
//       location: '',
//       title: '',
//       description: '',
//       buttonText: 'Show full details',
//       buttonUrl: '#details',
//       bgImage: '/images/hero-bg.jpg',
//       bottomCard: {
//         number: '0',
//         title: 'New Bottom Overlay Title',
//         description: 'New overlay description text...',
//       },
//     };
//     setSlides([...slides, newSlide]);
//     setSelectedSlideIndex(slides.length);
//   };

//   return (
//     <div className="admin-hero-container">
//       <div className="admin-header">
//         <h2>Hero Slider Management</h2>
//         <p>Edit or add multiple slider items for the homepage banner.</p>
//       </div>

//       {saveStatus && <div className="alert-success">{saveStatus}</div>}

//       {/* Slide Tabs */}
//       <div className="slide-tabs">
//         {slides.map((s, idx) => (
//           <button
//             key={s.id}
//             type="button"
//             className={`tab-btn ${selectedSlideIndex === idx ? 'active' : ''}`}
//             onClick={() => setSelectedSlideIndex(idx)}
//           >
//             Slide #{idx + 1}
//           </button>
//         ))}
//         <button type="button" className="add-tab-btn" onClick={addNewSlide}>
//           + Add New Slide
//         </button>
//       </div>

//       <form className="admin-hero-form" onSubmit={handleSave}>
//         <div className="form-card">
//           <h3>Slide #{selectedSlideIndex + 1} Details</h3>

//           <div className="form-group">
//             <label>Location Tag</label>
//             <input
//               type="text"
//               value={currentSlide.location}
//               onChange={(e) => handleInputChange('location', e.target.value)}
//             />
//           </div>

//           <div className="form-group">
//             <label>Heading Title</label>
//             <input
//               type="text"
//               value={currentSlide.title}
//               onChange={(e) => handleInputChange('title', e.target.value)}
//             />
//           </div>

//           <div className="form-group">
//             <label>Description Paragraph</label>
//             <textarea
//               rows="3"
//               value={currentSlide.description}
//               onChange={(e) => handleInputChange('description', e.target.value)}
//             ></textarea>
//           </div>

//           <div className="form-group">
//             <label>Background Image Path</label>
//             <input
//               type="text"
//               value={currentSlide.bgImage}
//               onChange={(e) => handleInputChange('bgImage', e.target.value)}
//             />
//           </div>
//         </div>

//         <div className="form-card">
//           <h3>Overlay Card Settings</h3>
//           <div className="form-group">
//             <label>Overlay Card Title</label>
//             <input
//               type="text"
//               value={currentSlide.bottomCard.title}
//               onChange={(e) => handleInputChange('bottomCard.title', e.target.value)}
//             />
//           </div>
//           <div className="form-group">
//             <label>Overlay Card Description</label>
//             <textarea
//               rows="2"
//               value={currentSlide.bottomCard.description}
//               onChange={(e) => handleInputChange('bottomCard.description', e.target.value)}
//             ></textarea>
//           </div>
//         </div>

//         <button type="submit" className="save-btn">
//           Save All Slides Changes
//         </button>
//       </form>
//     </div>
//   );
// };

// export default HeroAdmin;


// import React, { useState, useEffect } from 'react';
// import './HeroAdmin.css';

// const API_URL = 'http://localhost:5000/api/hero';

// const HeroAdmin = () => {
//   const [slides, setSlides] = useState([]);
//   const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
//   const [saveStatus, setSaveStatus] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   // ==========================================
//   // GET HERO SLIDES
//   // ==========================================
//   useEffect(() => {
//     fetchHeroSlides();
//   }, []);

//   const fetchHeroSlides = async () => {
//     try {
//       setLoading(true);

//       const response = await fetch(API_URL);
//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || 'Failed to load slides');
//       }

//       if (result.success) {
//         setSlides(result.data);
//       }
//     } catch (error) {
//       console.error(error);
//       setSaveStatus('Failed to load Hero Slides');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==========================================
//   // INPUT CHANGE
//   // ==========================================
//   const handleInputChange = (field, value) => {
//     const updated = [...slides];

//     if (!updated[selectedSlideIndex]) return;

//     if (field.includes('.')) {
//       const [parent, child] = field.split('.');

//       updated[selectedSlideIndex] = {
//         ...updated[selectedSlideIndex],
//         [parent]: {
//           ...updated[selectedSlideIndex][parent],
//           [child]: value,
//         },
//       };
//     } else {
//       updated[selectedSlideIndex] = {
//         ...updated[selectedSlideIndex],
//         [field]: value,
//       };
//     }

//     setSlides(updated);
//   };

//   // ==========================================
//   // IMAGE SELECT
//   // ==========================================
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];

//     if (!file) return;

//     if (!file.type.startsWith('image/')) {
//       setSaveStatus('Please select a valid image file.');
//       return;
//     }

//     const previewUrl = URL.createObjectURL(file);

//     const updated = [...slides];

//     updated[selectedSlideIndex] = {
//       ...updated[selectedSlideIndex],
//       bgImage: previewUrl,
//       selectedImageFile: file,
//     };

//     setSlides(updated);
//     setSaveStatus('');
//   };

//   // ==========================================
//   // SAVE SLIDE
//   // ==========================================
//   const handleSave = async (e) => {
//     e.preventDefault();

//     const currentSlide = slides[selectedSlideIndex];

//     if (!currentSlide) return;

//     try {
//       setSaving(true);
//       setSaveStatus('');

//       const formData = new FormData();

//       formData.append('location', currentSlide.location || '');
//       formData.append('title', currentSlide.title || '');
//       formData.append(
//         'description',
//         currentSlide.description || ''
//       );
//       formData.append(
//         'buttonText',
//         currentSlide.buttonText || ''
//       );
//       formData.append(
//         'buttonUrl',
//         currentSlide.buttonUrl || ''
//       );

//       formData.append(
//         'bottomCard',
//         JSON.stringify(currentSlide.bottomCard || {})
//       );

//       // Only send image if a new image was selected
//       if (currentSlide.selectedImageFile) {
//         formData.append(
//           'bgImage',
//           currentSlide.selectedImageFile
//         );
//       }

//       const response = await fetch(
//         `${API_URL}/${currentSlide._id}`,
//         {
//           method: 'PUT',
//           body: formData,
//         }
//       );

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           result.message || 'Failed to save slide'
//         );
//       }

//       const updatedSlides = [...slides];

//       updatedSlides[selectedSlideIndex] = result.data;

//       setSlides(updatedSlides);

//       setSaveStatus('Slide Saved Successfully!');

//       setTimeout(() => {
//         setSaveStatus('');
//       }, 3000);
//     } catch (error) {
//       console.error(error);

//       setSaveStatus(
//         error.message || 'Failed to save slide'
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ==========================================
//   // ADD NEW SLIDE
//   // ==========================================
//   const addNewSlide = async () => {
//     try {
//       setSaving(true);
//       setSaveStatus('');

//       const formData = new FormData();

//       formData.append('location', '');
//       formData.append('title', '');
//       formData.append('description', '');
//       formData.append(
//         'buttonText',
//         'Show full details'
//       );
//       formData.append(
//         'buttonUrl',
//         '#details'
//       );

//       formData.append(
//         'bottomCard',
//         JSON.stringify({
//           number: '0',
//           title: 'New Bottom Overlay Title',
//           description:
//             'New overlay description text...',
//         })
//       );

//       const response = await fetch(API_URL, {
//         method: 'POST',
//         body: formData,
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           result.message || 'Failed to create slide'
//         );
//       }

//       const updatedSlides = [
//         ...slides,
//         result.data,
//       ];

//       setSlides(updatedSlides);

//       setSelectedSlideIndex(
//         updatedSlides.length - 1
//       );

//       setSaveStatus(
//         'New Slide Added Successfully!'
//       );

//       setTimeout(() => {
//         setSaveStatus('');
//       }, 3000);
//     } catch (error) {
//       console.error(error);

//       setSaveStatus(
//         error.message || 'Failed to add slide'
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ==========================================
//   // DELETE SLIDE
//   // ==========================================
//   const deleteSlide = async () => {
//     const currentSlide = slides[selectedSlideIndex];

//     if (!currentSlide) return;

//     const confirmDelete = window.confirm(
//       `Are you sure you want to delete Slide #${
//         selectedSlideIndex + 1
//       }?`
//     );

//     if (!confirmDelete) return;

//     try {
//       setSaving(true);
//       setSaveStatus('');

//       const response = await fetch(
//         `${API_URL}/${currentSlide._id}`,
//         {
//           method: 'DELETE',
//         }
//       );

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           result.message || 'Failed to delete slide'
//         );
//       }

//       const updatedSlides = slides.filter(
//         (_, index) =>
//           index !== selectedSlideIndex
//       );

//       setSlides(updatedSlides);

//       if (updatedSlides.length === 0) {
//         setSelectedSlideIndex(0);
//       } else if (
//         selectedSlideIndex >= updatedSlides.length
//       ) {
//         setSelectedSlideIndex(
//           updatedSlides.length - 1
//         );
//       }

//       setSaveStatus(
//         'Slide Deleted Successfully!'
//       );

//       setTimeout(() => {
//         setSaveStatus('');
//       }, 3000);
//     } catch (error) {
//       console.error(error);

//       setSaveStatus(
//         error.message || 'Failed to delete slide'
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ==========================================
//   // LOADING
//   // ==========================================
//   if (loading) {
//     return (
//       <div className="admin-hero-container">
//         <div className="admin-header">
//           <h2>Hero Slider Management</h2>
//           <p>Loading Hero Slides...</p>
//         </div>
//       </div>
//     );
//   }

//   // ==========================================
//   // NO SLIDES
//   // ==========================================
//   if (slides.length === 0) {
//     return (
//       <div className="admin-hero-container">

//         <div className="admin-header">
//           <h2>Hero Slider Management</h2>

//           <p>
//             Edit or add multiple slider items for
//             the homepage banner.
//           </p>
//         </div>

//         {saveStatus && (
//           <div className="alert-success">
//             {saveStatus}
//           </div>
//         )}

//         <button
//           type="button"
//           className="add-tab-btn"
//           onClick={addNewSlide}
//           disabled={saving}
//         >
//           {saving
//             ? 'Adding...'
//             : '+ Add New Slide'}
//         </button>

//       </div>
//     );
//   }

//   const currentSlide =
//     slides[selectedSlideIndex];

//   return (
//     <div className="admin-hero-container">

//       {/* HEADER */}
//       <div className="admin-header">
//         <h2>Hero Slider Management</h2>

//         <p>
//           Edit or add multiple slider items for
//           the homepage banner.
//         </p>
//       </div>


//       {/* STATUS */}
//       {saveStatus && (
//         <div className="alert-success">
//           {saveStatus}
//         </div>
//       )}


//       {/* SLIDE TABS */}
//       <div className="slide-tabs">

//         {slides.map((slide, index) => (
//           <button
//             key={slide._id}
//             type="button"
//             className={`tab-btn ${
//               selectedSlideIndex === index
//                 ? 'active'
//                 : ''
//             }`}
//             onClick={() =>
//               setSelectedSlideIndex(index)
//             }
//           >
//             Slide #{index + 1}
//           </button>
//         ))}

//         <button
//           type="button"
//           className="add-tab-btn"
//           onClick={addNewSlide}
//           disabled={saving}
//         >
//           + Add New Slide
//         </button>

//       </div>


//       {/* FORM */}
//       <form
//         className="admin-hero-form"
//         onSubmit={handleSave}
//       >

//         {/* ====================================
//             SLIDE DETAILS
//         ==================================== */}
//         <div className="form-card">

//           <h3>
//             Slide #{selectedSlideIndex + 1}
//             Details
//           </h3>


//           {/* LOCATION */}
//           <div className="form-group">

//             <label>
//               Location Tag
//             </label>

//             <input
//               type="text"
//               value={
//                 currentSlide.location || ''
//               }
//               onChange={(e) =>
//                 handleInputChange(
//                   'location',
//                   e.target.value
//                 )
//               }
//             />

//           </div>


//           {/* TITLE */}
//           <div className="form-group">

//             <label>
//               Heading Title
//             </label>

//             <input
//               type="text"
//               value={
//                 currentSlide.title || ''
//               }
//               onChange={(e) =>
//                 handleInputChange(
//                   'title',
//                   e.target.value
//                 )
//               }
//             />

//           </div>


//           {/* DESCRIPTION */}
//           <div className="form-group">

//             <label>
//               Description Paragraph
//             </label>

//             <textarea
//               rows="3"
//               value={
//                 currentSlide.description || ''
//               }
//               onChange={(e) =>
//                 handleInputChange(
//                   'description',
//                   e.target.value
//                 )
//               }
//             />

//           </div>


//           {/* ====================================
//               IMAGE SELECTOR
//           ==================================== */}
//           <div className="form-group">

//             <label>
//               Background Image
//             </label>

//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//             />

//             {/* IMAGE PREVIEW */}
//             {currentSlide.bgImage && (
//               <div className="hero-image-preview">

//                 <img
//                   src={currentSlide.bgImage}
//                   alt="Hero Preview"
//                 />

//               </div>
//             )}

//           </div>


//           {/* BUTTON TEXT */}
//           <div className="form-group">

//             <label>
//               Button Text
//             </label>

//             <input
//               type="text"
//               value={
//                 currentSlide.buttonText || ''
//               }
//               onChange={(e) =>
//                 handleInputChange(
//                   'buttonText',
//                   e.target.value
//                 )
//               }
//             />

//           </div>


//           {/* BUTTON URL */}
//           <div className="form-group">

//             <label>
//               Button URL
//             </label>

//             <input
//               type="text"
//               value={
//                 currentSlide.buttonUrl || ''
//               }
//               onChange={(e) =>
//                 handleInputChange(
//                   'buttonUrl',
//                   e.target.value
//                 )
//               }
//             />

//           </div>

//         </div>


//         {/* ====================================
//             OVERLAY CARD
//         ==================================== */}
//         <div className="form-card">

//           <h3>
//             Overlay Card Settings
//           </h3>


//           {/* NUMBER */}
//           <div className="form-group">

//             <label>
//               Overlay Card Number
//             </label>

//             <input
//               type="text"
//               value={
//                 currentSlide.bottomCard
//                   ?.number || ''
//               }
//               onChange={(e) =>
//                 handleInputChange(
//                   'bottomCard.number',
//                   e.target.value
//                 )
//               }
//             />

//           </div>


//           {/* TITLE */}
//           <div className="form-group">

//             <label>
//               Overlay Card Title
//             </label>

//             <input
//               type="text"
//               value={
//                 currentSlide.bottomCard
//                   ?.title || ''
//               }
//               onChange={(e) =>
//                 handleInputChange(
//                   'bottomCard.title',
//                   e.target.value
//                 )
//               }
//             />

//           </div>


//           {/* DESCRIPTION */}
//           <div className="form-group">

//             <label>
//               Overlay Card Description
//             </label>

//             <textarea
//               rows="2"
//               value={
//                 currentSlide.bottomCard
//                   ?.description || ''
//               }
//               onChange={(e) =>
//                 handleInputChange(
//                   'bottomCard.description',
//                   e.target.value
//                 )
//               }
//             />

//           </div>

//         </div>


//         {/* ====================================
//             ACTIONS
//         ==================================== */}
//         <div className="hero-admin-actions">

//           <button
//             type="submit"
//             className="save-btn"
//             disabled={saving}
//           >
//             {saving
//               ? 'Saving...'
//               : 'Save Slide Changes'}
//           </button>


//           <button
//             type="button"
//             className="delete-btn"
//             onClick={deleteSlide}
//             disabled={saving}
//           >
//             Delete This Slide
//           </button>

//         </div>

//       </form>

//     </div>
//   );
// };

// export default HeroAdmin;




import React, { useState, useEffect } from 'react';
import './HeroAdmin.css';

const API_URL = 'http://localhost:5000/api/hero';

// ==========================================
// AUTHORIZATION TOKEN
// ==========================================
const getAuthHeaders = () => {
  const token =
    localStorage.getItem('token') ||
    localStorage.getItem('authToken') ||
    localStorage.getItem('adminToken');

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

const HeroAdmin = () => {
  const [slides, setSlides] = useState([]);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [saveStatus, setSaveStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ==========================================
  // GET HERO SLIDES
  // ==========================================
  useEffect(() => {
    fetchHeroSlides();
  }, []);

  const fetchHeroSlides = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL, {
        headers: {
          ...getAuthHeaders(),
        },
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to load slides');
      }

      if (result.success) {
        setSlides(result.data);
      }
    } catch (error) {
      console.error(error);
      setSaveStatus('Failed to load Hero Slides');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INPUT CHANGE
  // ==========================================
  const handleInputChange = (field, value) => {
    const updated = [...slides];

    if (!updated[selectedSlideIndex]) return;

    if (field.includes('.')) {
      const [parent, child] = field.split('.');

      updated[selectedSlideIndex] = {
        ...updated[selectedSlideIndex],
        [parent]: {
          ...updated[selectedSlideIndex][parent],
          [child]: value,
        },
      };
    } else {
      updated[selectedSlideIndex] = {
        ...updated[selectedSlideIndex],
        [field]: value,
      };
    }

    setSlides(updated);
  };

  // ==========================================
  // IMAGE SELECT
  // ==========================================
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setSaveStatus('Please select a valid image file.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    const updated = [...slides];

    updated[selectedSlideIndex] = {
      ...updated[selectedSlideIndex],
      bgImage: previewUrl,
      selectedImageFile: file,
    };

    setSlides(updated);
    setSaveStatus('');
  };

  // ==========================================
  // SAVE SLIDE
  // ==========================================
  const handleSave = async (e) => {
    e.preventDefault();

    const currentSlide = slides[selectedSlideIndex];

    if (!currentSlide) return;

    try {
      setSaving(true);
      setSaveStatus('');

      const formData = new FormData();

      formData.append('location', currentSlide.location || '');
      formData.append('title', currentSlide.title || '');
      formData.append(
        'description',
        currentSlide.description || ''
      );
      formData.append(
        'buttonText',
        currentSlide.buttonText || ''
      );
      formData.append(
        'buttonUrl',
        currentSlide.buttonUrl || ''
      );

      formData.append(
        'bottomCard',
        JSON.stringify(currentSlide.bottomCard || {})
      );

      // Only send image if a new image was selected
      if (currentSlide.selectedImageFile) {
        formData.append(
          'bgImage',
          currentSlide.selectedImageFile
        );
      }

      const response = await fetch(
        `${API_URL}/${currentSlide._id}`,
        {
          method: 'PUT',
          headers: {
            ...getAuthHeaders(),
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || 'Failed to save slide'
        );
      }

      const updatedSlides = [...slides];

      updatedSlides[selectedSlideIndex] = result.data;

      setSlides(updatedSlides);

      setSaveStatus('Slide Saved Successfully!');

      setTimeout(() => {
        setSaveStatus('');
      }, 3000);
    } catch (error) {
      console.error(error);

      setSaveStatus(
        error.message || 'Failed to save slide'
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // ADD NEW SLIDE
  // ==========================================
  const addNewSlide = async () => {
    try {
      setSaving(true);
      setSaveStatus('');

      const formData = new FormData();

      formData.append('location', '');
      formData.append('title', '');
      formData.append('description', '');
      formData.append(
        'buttonText',
        'Show full details'
      );
      formData.append(
        'buttonUrl',
        '#details'
      );

      formData.append(
        'bottomCard',
        JSON.stringify({
          number: '0',
          title: 'New Bottom Overlay Title',
          description:
            'New overlay description text...',
        })
      );

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || 'Failed to create slide'
        );
      }

      const updatedSlides = [
        ...slides,
        result.data,
      ];

      setSlides(updatedSlides);

      setSelectedSlideIndex(
        updatedSlides.length - 1
      );

      setSaveStatus(
        'New Slide Added Successfully!'
      );

      setTimeout(() => {
        setSaveStatus('');
      }, 3000);
    } catch (error) {
      console.error(error);

      setSaveStatus(
        error.message || 'Failed to add slide'
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE SLIDE
  // ==========================================
  const deleteSlide = async () => {
    const currentSlide = slides[selectedSlideIndex];

    if (!currentSlide) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete Slide #${
        selectedSlideIndex + 1
      }?`
    );

    if (!confirmDelete) return;

    try {
      setSaving(true);
      setSaveStatus('');

      const response = await fetch(
        `${API_URL}/${currentSlide._id}`,
        {
          method: 'DELETE',
          headers: {
            ...getAuthHeaders(),
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || 'Failed to delete slide'
        );
      }

      const updatedSlides = slides.filter(
        (_, index) =>
          index !== selectedSlideIndex
      );

      setSlides(updatedSlides);

      if (updatedSlides.length === 0) {
        setSelectedSlideIndex(0);
      } else if (
        selectedSlideIndex >= updatedSlides.length
      ) {
        setSelectedSlideIndex(
          updatedSlides.length - 1
        );
      }

      setSaveStatus(
        'Slide Deleted Successfully!'
      );

      setTimeout(() => {
        setSaveStatus('');
      }, 3000);
    } catch (error) {
      console.error(error);

      setSaveStatus(
        error.message || 'Failed to delete slide'
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="admin-hero-container">
        <div className="admin-header">
          <h2>Hero Slider Management</h2>
          <p>Loading Hero Slides...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // NO SLIDES
  // ==========================================
  if (slides.length === 0) {
    return (
      <div className="admin-hero-container">

        <div className="admin-header">
          <h2>Hero Slider Management</h2>

          <p>
            Edit or add multiple slider items for
            the homepage banner.
          </p>
        </div>

        {saveStatus && (
          <div className="alert-success">
            {saveStatus}
          </div>
        )}

        <button
          type="button"
          className="add-tab-btn"
          onClick={addNewSlide}
          disabled={saving}
        >
          {saving
            ? 'Adding...'
            : '+ Add New Slide'}
        </button>

      </div>
    );
  }

  const currentSlide =
    slides[selectedSlideIndex];

  return (
    <div className="admin-hero-container">

      {/* HEADER */}
      <div className="admin-header">
        <h2>Hero Slider Management</h2>

        <p>
          Edit or add multiple slider items for
          the homepage banner.
        </p>
      </div>


      {/* STATUS */}
      {saveStatus && (
        <div className="alert-success">
          {saveStatus}
        </div>
      )}


      {/* SLIDE TABS */}
      <div className="slide-tabs">

        {slides.map((slide, index) => (
          <button
            key={slide._id}
            type="button"
            className={`tab-btn ${
              selectedSlideIndex === index
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setSelectedSlideIndex(index)
            }
          >
            Slide #{index + 1}
          </button>
        ))}

        <button
          type="button"
          className="add-tab-btn"
          onClick={addNewSlide}
          disabled={saving}
        >
          + Add New Slide
        </button>

      </div>


      {/* FORM */}
      <form
        className="admin-hero-form"
        onSubmit={handleSave}
      >

        {/* ====================================
            SLIDE DETAILS
        ==================================== */}
        <div className="form-card">

          <h3>
            Slide #{selectedSlideIndex + 1}
            Details
          </h3>


          {/* LOCATION */}
          <div className="form-group">

            <label>
              Location Tag
            </label>

            <input
              type="text"
              value={
                currentSlide.location || ''
              }
              onChange={(e) =>
                handleInputChange(
                  'location',
                  e.target.value
                )
              }
            />

          </div>


          {/* TITLE */}
          <div className="form-group">

            <label>
              Heading Title
            </label>

            <input
              type="text"
              value={
                currentSlide.title || ''
              }
              onChange={(e) =>
                handleInputChange(
                  'title',
                  e.target.value
                )
              }
            />

          </div>


          {/* DESCRIPTION */}
          <div className="form-group">

            <label>
              Description Paragraph
            </label>

            <textarea
              rows="3"
              value={
                currentSlide.description || ''
              }
              onChange={(e) =>
                handleInputChange(
                  'description',
                  e.target.value
                )
              }
            />

          </div>


          {/* ====================================
              IMAGE SELECTOR
          ==================================== */}
          <div className="form-group">

            <label>
              Background Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

            {/* IMAGE PREVIEW */}
            {currentSlide.bgImage && (
              <div className="hero-image-preview">

                <img
                  src={currentSlide.bgImage}
                  alt="Hero Preview"
                />

              </div>
            )}

          </div>


          {/* BUTTON TEXT */}
          <div className="form-group">

            <label>
              Button Text
            </label>

            <input
              type="text"
              value={
                currentSlide.buttonText || ''
              }
              onChange={(e) =>
                handleInputChange(
                  'buttonText',
                  e.target.value
                )
              }
            />

          </div>


          {/* BUTTON URL */}
          <div className="form-group">

            <label>
              Button URL
            </label>

            <input
              type="text"
              value={
                currentSlide.buttonUrl || ''
              }
              onChange={(e) =>
                handleInputChange(
                  'buttonUrl',
                  e.target.value
                )
              }
            />

          </div>

        </div>


        {/* ====================================
            OVERLAY CARD
        ==================================== */}
        <div className="form-card">

          <h3>
            Overlay Card Settings
          </h3>


          {/* NUMBER */}
          <div className="form-group">

            <label>
              Overlay Card Number
            </label>

            <input
              type="text"
              value={
                currentSlide.bottomCard
                  ?.number || ''
              }
              onChange={(e) =>
                handleInputChange(
                  'bottomCard.number',
                  e.target.value
                )
              }
            />

          </div>


          {/* TITLE */}
          <div className="form-group">

            <label>
              Overlay Card Title
            </label>

            <input
              type="text"
              value={
                currentSlide.bottomCard
                  ?.title || ''
              }
              onChange={(e) =>
                handleInputChange(
                  'bottomCard.title',
                  e.target.value
                )
              }
            />

          </div>


          {/* DESCRIPTION */}
          <div className="form-group">

            <label>
              Overlay Card Description
            </label>

            <textarea
              rows="2"
              value={
                currentSlide.bottomCard
                  ?.description || ''
              }
              onChange={(e) =>
                handleInputChange(
                  'bottomCard.description',
                  e.target.value
                )
              }
            />

          </div>

        </div>


        {/* ====================================
            ACTIONS
        ==================================== */}
        <div className="hero-admin-actions">

          <button
            type="submit"
            className="save-btn"
            disabled={saving}
          >
            {saving
              ? 'Saving...'
              : 'Save Slide Changes'}
          </button>


          <button
            type="button"
            className="delete-btn"
            onClick={deleteSlide}
            disabled={saving}
          >
            Delete This Slide
          </button>

        </div>

      </form>

    </div>
  );
};

export default HeroAdmin;