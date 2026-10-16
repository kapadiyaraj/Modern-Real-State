// import React, { useEffect, useState } from "react";
// import "./AdminContact.css";

// const AdminContact = () => {
//   const [contacts, setContacts] = useState([]);
//   const [selectedContact, setSelectedContact] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const API_URL = "http://localhost:5000/api/contact";

//   const fetchContacts = async () => {
//     try {
//       setLoading(true);

//       const response = await fetch(API_URL);
//       const result = await response.json();

//       if (result.success) {
//         setContacts(result.data || []);
//       }
//     } catch (error) {
//       console.error("Fetch contacts error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchContacts();
//   }, []);

//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this message?"
//     );

//     if (!confirmDelete) return;

//     try {
//       const response = await fetch(`${API_URL}/${id}`, {
//         method: "DELETE",
//       });

//       const result = await response.json();

//       if (result.success) {
//         setContacts((prev) =>
//           prev.filter((contact) => contact._id !== id)
//         );

//         if (selectedContact?._id === id) {
//           setSelectedContact(null);
//         }

//         alert("Contact deleted successfully");
//       } else {
//         alert(result.message || "Delete failed");
//       }
//     } catch (error) {
//       console.error("Delete contact error:", error);
//       alert("Server error");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="admin-contact-page">
//         <h2>Contact Messages</h2>
//         <p>Loading...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="admin-contact-page">
//       <div className="admin-contact-header">
//         <h2>Contact Messages</h2>

//         <span>
//           Total: {contacts.length}
//         </span>
//       </div>

//       {contacts.length === 0 ? (
//         <div className="admin-contact-empty">
//           <h3>No Contact Messages</h3>
//           <p>
//             Contact form submissions will appear here.
//           </p>
//         </div>
//       ) : (
//         <div className="admin-contact-table-wrapper">
//           <table className="admin-contact-table">
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Phone</th>
//                 <th>Message</th>
//                 <th>Date</th>
//                 <th>Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {contacts.map((contact) => (
//                 <tr key={contact._id}>
//                   <td>
//                     {contact.firstName} {contact.lastName}
//                   </td>

//                   <td>{contact.email}</td>

//                   <td>{contact.phone || "-"}</td>

//                   <td>
//                     <div className="contact-message-preview">
//                       {contact.description}
//                     </div>
//                   </td>

//                   <td>
//                     {new Date(
//                       contact.createdAt
//                     ).toLocaleDateString()}
//                   </td>

//                   <td>
//                     <div className="contact-actions">
//                       <button
//                         type="button"
//                         onClick={() =>
//                           setSelectedContact(contact)
//                         }
//                         className="contact-view-btn"
//                       >
//                         View
//                       </button>

//                       <button
//                         type="button"
//                         onClick={() =>
//                           handleDelete(contact._id)
//                         }
//                         className="contact-delete-btn"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {selectedContact && (
//         <div className="contact-modal-overlay">
//           <div className="contact-modal">
//             <button
//               type="button"
//               className="contact-modal-close"
//               onClick={() => setSelectedContact(null)}
//             >
//               ×
//             </button>

//             <h3>Contact Details</h3>

//             <div className="contact-detail">
//               <strong>Name</strong>
//               <span>
//                 {selectedContact.firstName}{" "}
//                 {selectedContact.lastName}
//               </span>
//             </div>

//             <div className="contact-detail">
//               <strong>Email</strong>
//               <span>{selectedContact.email}</span>
//             </div>

//             <div className="contact-detail">
//               <strong>Phone</strong>
//               <span>
//                 {selectedContact.phone || "-"}
//               </span>
//             </div>

//             <div className="contact-detail">
//               <strong>Message</strong>
//               <p>{selectedContact.description}</p>
//             </div>

//             <div className="contact-detail">
//               <strong>Submitted</strong>
//               <span>
//                 {new Date(
//                   selectedContact.createdAt
//                 ).toLocaleString()}
//               </span>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminContact;



import React, { useEffect, useState } from "react";
import "./AdminContact.css";

const AdminContact = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5000/api/contact";

  // =====================================================
  // GET AUTH TOKEN
  // =====================================================

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

  // =====================================================
  // FETCH CONTACTS
  // =====================================================

  const fetchContacts = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          ...getAuthHeaders(),
        },
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Fetch contacts failed:", result);

        if (response.status === 401 || response.status === 403) {
          console.error(
            "Admin authentication failed. Token missing, expired, or user is not admin."
          );
        }

        return;
      }

      if (result.success) {
        setContacts(result.data || []);
      } else {
        console.error(
          result.message || "Failed to fetch contacts"
        );
      }
    } catch (error) {
      console.error("Fetch contacts error:", error);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD CONTACTS
  // =====================================================

  useEffect(() => {
    fetchContacts();
  }, []);

  // =====================================================
  // DELETE CONTACT
  // =====================================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          ...getAuthHeaders(),
        },
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Delete contact failed:", result);

        alert(
          result.message ||
            "Unable to delete contact message"
        );

        return;
      }

      if (result.success) {
        setContacts((prev) =>
          prev.filter((contact) => contact._id !== id)
        );

        if (selectedContact?._id === id) {
          setSelectedContact(null);
        }

        alert("Contact deleted successfully");
      } else {
        alert(result.message || "Delete failed");
      }
    } catch (error) {
      console.error("Delete contact error:", error);
      alert("Server error");
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="admin-contact-page">
        <h2>Contact Messages</h2>
        <p>Loading...</p>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="admin-contact-page">
      <div className="admin-contact-header">
        <h2>Contact Messages</h2>

        <span>
          Total: {contacts.length}
        </span>
      </div>

      {contacts.length === 0 ? (
        <div className="admin-contact-empty">
          <h3>No Contact Messages</h3>

          <p>
            Contact form submissions will appear here.
          </p>
        </div>
      ) : (
        <div className="admin-contact-table-wrapper">
          <table className="admin-contact-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Message</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {contacts.map((contact) => (
                <tr key={contact._id}>
                  <td>
                    {contact.firstName}{" "}
                    {contact.lastName}
                  </td>

                  <td>{contact.email}</td>

                  <td>
                    {contact.phone || "-"}
                  </td>

                  <td>
                    <div className="contact-message-preview">
                      {contact.description}
                    </div>
                  </td>

                  <td>
                    {new Date(
                      contact.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td>
                    <div className="contact-actions">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedContact(contact)
                        }
                        className="contact-view-btn"
                      >
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(contact._id)
                        }
                        className="contact-delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* =================================================
          CONTACT DETAILS MODAL
      ================================================= */}

      {selectedContact && (
        <div className="contact-modal-overlay">
          <div className="contact-modal">
            <button
              type="button"
              className="contact-modal-close"
              onClick={() =>
                setSelectedContact(null)
              }
            >
              ×
            </button>

            <h3>Contact Details</h3>

            <div className="contact-detail">
              <strong>Name</strong>

              <span>
                {selectedContact.firstName}{" "}
                {selectedContact.lastName}
              </span>
            </div>

            <div className="contact-detail">
              <strong>Email</strong>

              <span>
                {selectedContact.email}
              </span>
            </div>

            <div className="contact-detail">
              <strong>Phone</strong>

              <span>
                {selectedContact.phone || "-"}
              </span>
            </div>

            <div className="contact-detail">
              <strong>Message</strong>

              <p>
                {selectedContact.description}
              </p>
            </div>

            <div className="contact-detail">
              <strong>Submitted</strong>

              <span>
                {new Date(
                  selectedContact.createdAt
                ).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContact;