// import React, { useEffect, useState } from "react";
// import "./AdminFaq.css";

// const AdminFAQ = () => {
//   const API_URL = "http://localhost:5000/api/faq";

//   const [faqs, setFaqs] = useState([]);

//   const [formData, setFormData] = useState({
//     question: "",
//     answer: "",
//   });

//   const [editingId, setEditingId] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchFAQs();
//   }, []);

//   const fetchFAQs = async () => {
//     try {
//       const response = await fetch(API_URL);
//       const result = await response.json();

//       if (result.success) {
//         setFaqs(result.data || []);
//       }
//     } catch (error) {
//       console.error("Fetch FAQ error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.question || !formData.answer) {
//       alert("Please enter question and answer");
//       return;
//     }

//     try {
//       const url = editingId
//         ? `${API_URL}/${editingId}`
//         : API_URL;

//       const response = await fetch(url, {
//         method: editingId ? "PUT" : "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       const result = await response.json();

//       if (result.success) {
//         if (editingId) {
//           setFaqs((prev) =>
//             prev.map((faq) =>
//               faq._id === editingId
//                 ? result.data
//                 : faq
//             )
//           );
//         } else {
//           setFaqs((prev) => [result.data, ...prev]);
//         }

//         resetForm();

//         alert(
//           editingId
//             ? "FAQ updated successfully"
//             : "FAQ added successfully"
//         );
//       } else {
//         alert(result.message || "Something went wrong");
//       }
//     } catch (error) {
//       console.error("FAQ submit error:", error);
//       alert("Server error");
//     }
//   };

//   const handleEdit = (faq) => {
//     setEditingId(faq._id);

//     setFormData({
//       question: faq.question,
//       answer: faq.answer,
//     });

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this FAQ?"
//     );

//     if (!confirmDelete) return;

//     try {
//       const response = await fetch(
//         `${API_URL}/${id}`,
//         {
//           method: "DELETE",
//         }
//       );

//       const result = await response.json();

//       if (result.success) {
//         setFaqs((prev) =>
//           prev.filter((faq) => faq._id !== id)
//         );

//         if (editingId === id) {
//           resetForm();
//         }

//         alert("FAQ deleted successfully");
//       } else {
//         alert(result.message || "Delete failed");
//       }
//     } catch (error) {
//       console.error("Delete FAQ error:", error);
//       alert("Server error");
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       question: "",
//       answer: "",
//     });

//     setEditingId(null);
//   };

//   return (
//     <div className="admin-faq-page">

//       <div className="admin-faq-header">
//         <h1>FAQ Management</h1>

//         <span>
//           Total FAQs: {faqs.length}
//         </span>
//       </div>

//       {/* FORM */}

//       <div className="admin-faq-card">

//         <h2>
//           {editingId ? "Edit FAQ" : "Add FAQ"}
//         </h2>

//         <form onSubmit={handleSubmit}>

//           <div className="admin-faq-form-group">
//             <label>Question</label>

//             <input
//               type="text"
//               name="question"
//               placeholder="Enter question"
//               value={formData.question}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="admin-faq-form-group">
//             <label>Answer</label>

//             <textarea
//               name="answer"
//               placeholder="Enter answer"
//               value={formData.answer}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="admin-faq-form-actions">

//             <button
//               type="submit"
//               className="admin-faq-save-btn"
//             >
//               {editingId ? "Update FAQ" : "Add FAQ"}
//             </button>

//             {editingId && (
//               <button
//                 type="button"
//                 className="admin-faq-cancel-btn"
//                 onClick={resetForm}
//               >
//                 Cancel
//               </button>
//             )}

//           </div>

//         </form>
//       </div>

//       {/* LIST */}

//       <div className="admin-faq-card">

//         <h2>All FAQs</h2>

//         {loading ? (
//           <div className="admin-faq-empty">
//             Loading...
//           </div>
//         ) : faqs.length === 0 ? (
//           <div className="admin-faq-empty">
//             No FAQs found.
//           </div>
//         ) : (
//           <div className="admin-faq-list">

//             {faqs.map((faq, index) => (
//               <div
//                 className="admin-faq-item"
//                 key={faq._id}
//               >

//                 <div className="admin-faq-number">
//                   {index + 1}
//                 </div>

//                 <div className="admin-faq-content">

//                   <h3>{faq.question}</h3>

//                   <p>{faq.answer}</p>

//                 </div>

//                 <div className="admin-faq-actions">

//                   <button
//                     type="button"
//                     className="admin-faq-edit-btn"
//                     onClick={() => handleEdit(faq)}
//                   >
//                     Edit
//                   </button>

//                   <button
//                     type="button"
//                     className="admin-faq-delete-btn"
//                     onClick={() =>
//                       handleDelete(faq._id)
//                     }
//                   >
//                     Delete
//                   </button>

//                 </div>

//               </div>
//             ))}

//           </div>
//         )}

//       </div>

//     </div>
//   );
// };

// export default AdminFAQ;


import React, { useEffect, useState } from "react";
import "./AdminFaq.css";

const API_URL = "http://localhost:5000/api/faq";

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

const AdminFAQ = () => {
  const [faqs, setFaqs] = useState([]);

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const response = await fetch(API_URL, {
        headers: getAuthHeaders(),
      });

      const result = await response.json();

      if (result.success) {
        setFaqs(result.data || []);
      }
    } catch (error) {
      console.error("Fetch FAQ error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.question || !formData.answer) {
      alert("Please enter question and answer");
      return;
    }

    try {
      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        if (editingId) {
          setFaqs((prev) =>
            prev.map((faq) =>
              faq._id === editingId ? result.data : faq
            )
          );
        } else {
          setFaqs((prev) => [result.data, ...prev]);
        }

        resetForm();

        alert(
          editingId
            ? "FAQ updated successfully"
            : "FAQ added successfully"
        );
      } else {
        alert(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error("FAQ submit error:", error);
      alert("Server error");
    }
  };

  const handleEdit = (faq) => {
    setEditingId(faq._id);

    setFormData({
      question: faq.question,
      answer: faq.answer,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this FAQ?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const result = await response.json();

      if (result.success) {
        setFaqs((prev) =>
          prev.filter((faq) => faq._id !== id)
        );

        if (editingId === id) {
          resetForm();
        }

        alert("FAQ deleted successfully");
      } else {
        alert(result.message || "Delete failed");
      }
    } catch (error) {
      console.error("Delete FAQ error:", error);
      alert("Server error");
    }
  };

  const resetForm = () => {
    setFormData({
      question: "",
      answer: "",
    });

    setEditingId(null);
  };

  return (
    <div className="admin-faq-page">

      <div className="admin-faq-header">
        <h1>FAQ Management</h1>

        <span>
          Total FAQs: {faqs.length}
        </span>
      </div>

      {/* FORM */}

      <div className="admin-faq-card">

        <h2>
          {editingId ? "Edit FAQ" : "Add FAQ"}
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="admin-faq-form-group">
            <label>Question</label>

            <input
              type="text"
              name="question"
              placeholder="Enter question"
              value={formData.question}
              onChange={handleChange}
            />
          </div>

          <div className="admin-faq-form-group">
            <label>Answer</label>

            <textarea
              name="answer"
              placeholder="Enter answer"
              value={formData.answer}
              onChange={handleChange}
            />
          </div>

          <div className="admin-faq-form-actions">

            <button
              type="submit"
              className="admin-faq-save-btn"
            >
              {editingId ? "Update FAQ" : "Add FAQ"}
            </button>

            {editingId && (
              <button
                type="button"
                className="admin-faq-cancel-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}

          </div>

        </form>
      </div>

      {/* LIST */}

      <div className="admin-faq-card">

        <h2>All FAQs</h2>

        {loading ? (
          <div className="admin-faq-empty">
            Loading...
          </div>
        ) : faqs.length === 0 ? (
          <div className="admin-faq-empty">
            No FAQs found.
          </div>
        ) : (
          <div className="admin-faq-list">

            {faqs.map((faq, index) => (
              <div
                className="admin-faq-item"
                key={faq._id}
              >

                <div className="admin-faq-number">
                  {index + 1}
                </div>

                <div className="admin-faq-content">

                  <h3>{faq.question}</h3>

                  <p>{faq.answer}</p>

                </div>

                <div className="admin-faq-actions">

                  <button
                    type="button"
                    className="admin-faq-edit-btn"
                    onClick={() => handleEdit(faq)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="admin-faq-delete-btn"
                    onClick={() =>
                      handleDelete(faq._id)
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
  );
};

export default AdminFAQ;
