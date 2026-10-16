// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./SubAdminKYC.css";

// const API_BASE = "http://localhost:5000/api/subadmin/kyc";

// // ======================================================
// // AUTH HEADERS
// // ======================================================

// const getAuthHeaders = () => {
//   const token =
//     localStorage.getItem("token") ||
//     localStorage.getItem("adminToken") ||
//     localStorage.getItem("accessToken") ||
//     localStorage.getItem("authToken") ||
//     localStorage.getItem("userToken") ||
//     sessionStorage.getItem("token") ||
//     sessionStorage.getItem("accessToken");

//   if (token) {
//     const cleanToken = String(token)
//       .replace(/^Bearer\s+/i, "")
//       .trim();

//     if (cleanToken) {
//       return {
//         Authorization: `Bearer ${cleanToken}`,
//       };
//     }
//   }

//   // Fallback: token may be stored inside user object
//   try {
//     const storedUser = JSON.parse(
//       localStorage.getItem("user") || "null"
//     );

//     const nestedToken =
//       storedUser?.token ||
//       storedUser?.accessToken;

//     if (nestedToken) {
//       const cleanToken = String(nestedToken)
//         .replace(/^Bearer\s+/i, "")
//         .trim();

//       if (cleanToken) {
//         return {
//           Authorization: `Bearer ${cleanToken}`,
//         };
//       }
//     }
//   } catch (error) {
//     console.warn(
//       "Unable to read stored user:",
//       error
//     );
//   }

//   console.error(
//     "JWT TOKEN NOT FOUND IN STORAGE"
//   );

//   return {};
// };

// // ======================================================
// // EMPTY FORM
// // ======================================================

// const EMPTY_FORM = {
//   firstName: "",
//   lastName: "",
//   phone: "",
//   dateOfBirth: "",
//   address: "",
//   city: "",
//   state: "",
//   pincode: "",

//   idType: "aadhaar",
//   idNumber: "",
//   panNumber: "",

//   idDocument: "",
//   addressProof: "",

//   accountHolderName: "",
//   bankName: "",
//   accountNumber: "",
//   ifscCode: "",
//   branchName: "",
// };

// // ======================================================
// // COMPONENT
// // ======================================================

// const SubAdminKYC = () => {
//   const navigate = useNavigate();

//   const [form, setForm] =
//     useState(EMPTY_FORM);

//   const [status, setStatus] =
//     useState("not_submitted");

//   const [rejectionReason, setRejectionReason] =
//     useState("");

//   const [loading, setLoading] =
//     useState(true);

//   const [saving, setSaving] =
//     useState(false);

//   // ======================================================
//   // FETCH MY KYC
//   // ======================================================

//   const fetchKYC = async () => {
//     try {
//       setLoading(true);

//       const authHeaders =
//         getAuthHeaders();

//       const response = await fetch(
//         `${API_BASE}/my`,
//         {
//           method: "GET",
//           headers: {
//             ...authHeaders,
//           },
//         }
//       );

//       const result =
//         await response.json();

//       // No KYC submitted yet
//       if (
//         response.status === 404 ||
//         !result?.data
//       ) {
//         setStatus("not_submitted");
//         setRejectionReason("");
//         return;
//       }

//       if (!response.ok) {
//         throw new Error(
//           result?.message ||
//             "Failed to load KYC."
//         );
//       }

//       const kyc = result.data;

//       setForm({
//         firstName:
//           kyc.firstName || "",

//         lastName:
//           kyc.lastName || "",

//         phone:
//           kyc.phone || "",

//         dateOfBirth:
//           kyc.dateOfBirth
//             ? String(
//                 kyc.dateOfBirth
//               ).substring(0, 10)
//             : "",

//         address:
//           kyc.address || "",

//         city:
//           kyc.city || "",

//         state:
//           kyc.state || "",

//         pincode:
//           kyc.pincode || "",

//         idType:
//           kyc.idType || "aadhaar",

//         idNumber:
//           kyc.idNumber || "",

//         panNumber:
//           kyc.panNumber || "",

//         idDocument:
//           kyc.idDocument || "",

//         addressProof:
//           kyc.addressProof || "",

//         accountHolderName:
//           kyc.accountHolderName || "",

//         bankName:
//           kyc.bankName || "",

//         accountNumber:
//           kyc.accountNumber || "",

//         ifscCode:
//           kyc.ifscCode || "",

//         branchName:
//           kyc.branchName || "",
//       });

//       setStatus(
//         kyc.status || "pending"
//       );

//       setRejectionReason(
//         kyc.rejectionReason || ""
//       );
//     } catch (error) {
//       console.error(
//         "KYC GET ERROR:",
//         error
//       );

//       alert(
//         error.message ||
//           "Unable to load KYC."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ======================================================
//   // LOAD KYC ON PAGE LOAD
//   // ======================================================

//   useEffect(() => {
//     fetchKYC();
//   }, []);

//   // ======================================================
//   // HANDLE INPUT
//   // ======================================================

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

//   // ======================================================
//   // SUBMIT KYC
//   // ======================================================

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (saving) {
//       return;
//     }

//     try {
//       setSaving(true);

//       const authHeaders =
//         getAuthHeaders();

//       // Check token before sending request
//       if (!authHeaders.Authorization) {
//         alert(
//           "Authentication token not found. Please login again."
//         );

//         navigate("/account/login");

//         return;
//       }

//       const response = await fetch(
//         `${API_BASE}/`,
//         {
//           method: "POST",

//           headers: {
//             "Content-Type":
//               "application/json",

//             ...authHeaders,
//           },

//           body: JSON.stringify(form),
//         }
//       );

//       const result =
//         await response.json();

//       if (!response.ok) {
//         throw new Error(
//           result?.message ||
//             "KYC submission failed."
//         );
//       }

//       alert(
//         "KYC submitted successfully. Please wait for Admin approval."
//       );

//       setStatus("pending");

//       await fetchKYC();
//     } catch (error) {
//       console.error(
//         "KYC SUBMIT ERROR:",
//         error
//       );

//       alert(
//         error.message ||
//           "Failed to submit KYC."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ======================================================
//   // LOADING
//   // ======================================================

//   if (loading) {
//     return (
//       <div className="subadmin-kyc-loading">
//         Loading KYC...
//       </div>
//     );
//   }

//   // ======================================================
//   // STATUS
//   // ======================================================

//   const isApproved =
//     status === "approved";

//   const statusText =
//     status === "approved"
//       ? "Approved"
//       : status === "rejected"
//       ? "Rejected"
//       : status === "pending"
//       ? "Pending"
//       : "Not Submitted";

//   // ======================================================
//   // UI
//   // ======================================================

//   return (
//     <main className="subadmin-kyc-page">

//       <div className="subadmin-kyc-container">

//         {/* ==================================================
//             HEADER
//         ================================================== */}

//         <div className="subadmin-kyc-header">

//           <button
//             type="button"
//             onClick={() =>
//               navigate("/sub-admin")
//             }
//           >
//             ← Dashboard
//           </button>

//           <div>

//             <span>
//               SUB-ADMIN
//             </span>

//             <h1>
//               KYC Verification
//             </h1>

//             <p>
//               Complete your verification
//               before managing properties.
//             </p>

//           </div>

//         </div>

//         {/* ==================================================
//             STATUS
//         ================================================== */}

//         <div
//           className={`subadmin-kyc-status ${status}`}
//         >

//           <div>

//             <strong>
//               KYC Status
//             </strong>

//             <span>
//               {statusText}
//             </span>

//           </div>

//           {status === "rejected" &&
//             rejectionReason && (
//               <p>
//                 Reason:{" "}
//                 {rejectionReason}
//               </p>
//             )}

//         </div>

//         {/* ==================================================
//             FORM
//         ================================================== */}

//         <form
//           onSubmit={handleSubmit}
//           className="subadmin-kyc-form"
//         >

//           {/* ==================================================
//               PERSONAL DETAILS
//           ================================================== */}

//           <section className="subadmin-kyc-card">

//             <div className="subadmin-kyc-card-title">

//               <h2>
//                 Personal Details
//               </h2>

//             </div>

//             <div className="subadmin-kyc-card-body">

//               <div className="subadmin-kyc-grid">

//                 {/* FIRST NAME */}

//                 <div className="subadmin-kyc-field">

//                   <label>
//                     First Name *
//                   </label>

//                   <input
//                     name="firstName"
//                     value={
//                       form.firstName
//                     }
//                     onChange={
//                       handleChange
//                     }
//                     required
//                   />

//                 </div>

//                 {/* LAST NAME */}

//                 <div className="subadmin-kyc-field">

//                   <label>
//                     Last Name *
//                   </label>

//                   <input
//                     name="lastName"
//                     value={
//                       form.lastName
//                     }
//                     onChange={
//                       handleChange
//                     }
//                     required
//                   />

//                 </div>

//                 {/* PHONE */}

//                 <div className="subadmin-kyc-field">

//                   <label>
//                     Phone *
//                   </label>

//                   <input
//                     type="tel"
//                     name="phone"
//                     value={
//                       form.phone
//                     }
//                     onChange={
//                       handleChange
//                     }
//                     required
//                   />

//                 </div>

//                 {/* DOB */}

//                 <div className="subadmin-kyc-field">

//                   <label>
//                     Date of Birth *
//                   </label>

//                   <input
//                     type="date"
//                     name="dateOfBirth"
//                     value={
//                       form.dateOfBirth
//                     }
//                     onChange={
//                       handleChange
//                     }
//                     required
//                   />

//                 </div>

//                 {/* ADDRESS */}

//                 <div className="subadmin-kyc-field full">

//                   <label>
//                     Address *
//                   </label>

//                   <textarea
//                     name="address"
//                     value={
//                       form.address
//                     }
//                     onChange={
//                       handleChange
//                     }
//                     required
//                   />

//                 </div>

//                 {/* CITY */}

//                 <div className="subadmin-kyc-field">

//                   <label>
//                     City *
//                   </label>

//                   <input
//                     name="city"
//                     value={
//                       form.city
//                     }
//                     onChange={
//                       handleChange
//                     }
//                     required
//                   />

//                 </div>

//                 {/* STATE */}

//                 <div className="subadmin-kyc-field">

//                   <label>
//                     State *
//                   </label>

//                   <input
//                     name="state"
//                     value={
//                       form.state
//                     }
//                     onChange={
//                       handleChange
//                     }
//                     required
//                   />

//                 </div>

//                 {/* PINCODE */}

//                 <div className="subadmin-kyc-field">

//                   <label>
//                     Pincode *
//                   </label>

//                   <input
//                     name="pincode"
//                     value={
//                       form.pincode
//                     }
//                     onChange={
//                       handleChange
//                     }
//                     required
//                   />

//                 </div>

//               </div>

//             </div>

//           </section>

//           {/* ==================================================
//               IDENTITY VERIFICATION
//           ================================================== */}

//           <section className="subadmin-kyc-card">

//             <div className="subadmin-kyc-card-title">

//               <h2>
//                 Identity Verification
//               </h2>

//             </div>

//             <div className="subadmin-kyc-card-body">

//               <div className="subadmin-kyc-grid">

//                 {/* ID TYPE */}

//                 <div className="subadmin-kyc-field">

//                   <label>
//                     ID Type *
//                   </label>

//                   <select
//                     name="idType"
//                     value={
//                       form.idType
//                     }
//                     onChange={
//                       handleChange
//                     }
//                     required
//                   >

//                     <option value="aadhaar">
//                       Aadhaar
//                     </option>

//                     <option value="pan">
//                       PAN
//                     </option>

//                     <option value="passport">
//                       Passport
//                     </option>

//                     <option value="driving_license">
//                       Driving License
//                     </option>

//                     <option value="voter_id">
//                       Voter ID
//                     </option>

//                   </select>

//                 </div>

//                 {/* ID NUMBER */}

//                 <div className="subadmin-kyc-field">

//                   <label>
//                     ID Number *
//                   </label>

//                   <input
//                     name="idNumber"
//                     value={
//                       form.idNumber
//                     }
//                     onChange={
//                       handleChange
//                     }
//                     required
//                   />

//                 </div>

//                 {/* PAN */}

//                 <div className="subadmin-kyc-field">

//                   <label>
//                     PAN Number *
//                   </label>

//                   <input
//                     name="panNumber"
//                     value={
//                       form.panNumber
//                     }
//                     onChange={
//                       handleChange
//                     }
//                     required
//                   />

//                 </div>

//                 {/* ID DOCUMENT */}

//                 <div className="subadmin-kyc-field">

//                   <label>
//                     ID Document
//                   </label>

//                   <input
//                     name="idDocument"
//                     value={
//                       form.idDocument
//                     }
//                     onChange={
//                       handleChange
//                     }
//                     placeholder="Document path / URL"
//                   />

//                 </div>

//                 {/* ADDRESS PROOF */}

//                 <div className="subadmin-kyc-field">

//                   <label>
//                     Address Proof
//                   </label>

//                   <input
//                     name="addressProof"
//                     value={
//                       form.addressProof
//                     }
//                     onChange={
//                       handleChange
//                     }
//                     placeholder="Document path / URL"
//                   />

//                 </div>

//               </div>

//             </div>

//           </section>

//           {/* ==================================================
//               BANK DETAILS
//           ================================================== */}

//           <section className="subadmin-kyc-card">

//             <div className="subadmin-kyc-card-title">

//               <h2>
//                 Bank Details
//               </h2>

//               <p>
//                 Used for property revenue
//                 distribution.
//               </p>

//             </div>

//             <div className="subadmin-kyc-card-body">

//               <div className="subadmin-kyc-grid">

//                 {/* ACCOUNT HOLDER */}

//                 <div className="subadmin-kyc-field">

//                   <label>
//                     Account Holder Name *
//                   </label>

//                   <input
//                     name="accountHolderName"
//                     value={
//                       form.accountHolderName
//                     }
//                     onChange={
//                       handleChange
//                     }
//                     required
//                   />

//                 </div>

//                 {/* BANK */}

//                 <div className="subadmin-kyc-field">

//                   <label>
//                     Bank Name *
//                   </label>

//                   <input
//                     name="bankName"
//                     value={
//                       form.bankName
//                     }
//                     onChange={
//                       handleChange
//                     }
//                     required
//                   />

//                 </div>

//                 {/* ACCOUNT NUMBER */}

//                 <div className="subadmin-kyc-field">

//                   <label>
//                     Account Number *
//                   </label>

//                   <input
//                     type="password"
//                     name="accountNumber"
//                     value={
//                       form.accountNumber
//                     }
//                     onChange={
//                       handleChange
//                     }
//                     required
//                   />

//                 </div>

//                 {/* IFSC */}

//                 <div className="subadmin-kyc-field">

//                   <label>
//                     IFSC Code *
//                   </label>

//                   <input
//                     name="ifscCode"
//                     value={
//                       form.ifscCode
//                     }
//                     onChange={
//                       handleChange
//                     }
//                     required
//                   />

//                 </div>

//                 {/* BRANCH */}

//                 <div className="subadmin-kyc-field">

//                   <label>
//                     Branch Name *
//                   </label>

//                   <input
//                     name="branchName"
//                     value={
//                       form.branchName
//                     }
//                     onChange={
//                       handleChange
//                     }
//                     required
//                   />

//                 </div>

//               </div>

//             </div>

//           </section>

//           {/* ==================================================
//               SUBMIT
//           ================================================== */}

//           {!isApproved && (
//             <div className="subadmin-kyc-submit">

//               <button
//                 type="submit"
//                 disabled={saving}
//               >

//                 {saving
//                   ? "Submitting..."
//                   : status === "rejected"
//                   ? "Resubmit KYC"
//                   : "Submit KYC"}

//                 {!saving && (
//                   <span>
//                     →
//                   </span>
//                 )}

//               </button>

//             </div>
//           )}

//         </form>

//       </div>

//     </main>
//   );
// };

// export default SubAdminKYC; 


import React, {
  useEffect,
  useState,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";

const SERVER = "http://localhost:5000";

const KYC_MY_URL =
  `${SERVER}/api/subadmin/kyc/my`;

const KYC_SUBMIT_URL =
  `${SERVER}/api/subadmin/kyc`;

const MAX_FILE_SIZE =
  5 * 1024 * 1024; // 5 MB

// ======================================================
// TOKEN HELPERS
// ======================================================

const getToken = () => {
  const raw =
    localStorage.getItem("token") ||
    localStorage.getItem("adminToken") ||
    localStorage.getItem("accessToken") ||
    "";

  return String(raw)
    .replace(/^Bearer\s+/i, "")
    .trim();
};

const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("userId");
};

// ======================================================
// EMPTY FORM
// ======================================================

const emptyForm = {
  firstName: "",
  lastName: "",
  phone: "",
  dateOfBirth: "",
  address: "",
  city: "",
  state: "",
  pincode: "",

  idType: "aadhaar",
  idNumber: "",
  panNumber: "",

  idDocument: "",
  addressProof: "",

  accountHolderName: "",
  bankName: "",
  accountNumber: "",
  ifscCode: "",
  branchName: "",
};

// ======================================================
// ID TYPES
// ======================================================

const ID_TYPES = [
  {
    value: "aadhaar",
    label: "Aadhaar",
  },
  {
    value: "pan",
    label: "PAN",
  },
  {
    value: "passport",
    label: "Passport",
  },
  {
    value: "driving_license",
    label: "Driving licence",
  },
  {
    value: "voter_id",
    label: "Voter ID",
  },
];

// ======================================================
// STATUS
// ======================================================

const STATUS_STYLE = {
  none: {
    bg: "#eef0f3",
    fg: "#4b5563",
    label: "Not Submitted",
  },

  pending: {
    bg: "#fef3c7",
    fg: "#92400e",
    label: "Pending review",
  },

  approved: {
    bg: "#d1fae5",
    fg: "#065f46",
    label: "Approved",
  },

  rejected: {
    bg: "#fee2e2",
    fg: "#991b1b",
    label: "Rejected",
  },
};

// ======================================================
// STYLES
// ======================================================

const s = {
  page: {
    minHeight: "100vh",
    background: "#f3f4f6",
    padding: "32px 16px",
    fontFamily:
      "Inter, system-ui, sans-serif",
    color: "#111827",
  },

  wrap: {
    maxWidth: 1100,
    margin: "0 auto",
    background: "#fafafa",
    padding: "32px",
    borderRadius: 4,
  },

  head: {
    display: "flex",
    gap: 28,
    alignItems: "flex-start",
    marginBottom: 28,
    flexWrap: "wrap",
  },

  backBtn: {
    padding: "14px 20px",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 6,
    fontWeight: 600,
    cursor: "pointer",
  },

  title: {
    margin: "4px 0 6px",
    fontSize: 36,
    fontWeight: 800,
  },

  sub: {
    margin: 0,
    color: "#6b7280",
  },

  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    marginBottom: 24,
    overflow: "hidden",
  },

  cardHead: {
    padding: "24px 26px",
    borderBottom:
      "1px solid #e5e7eb",
  },

  cardTitle: {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
  },

  cardBody: {
    padding: 26,
  },

  statusRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: 26,
    flexWrap: "wrap",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: 20,
  },

  full: {
    gridColumn: "1 / -1",
  },

  label: {
    display: "block",
    marginBottom: 8,
    fontWeight: 600,
    fontSize: 14,
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 16px",
    border:
      "1px solid #d1d5db",
    borderRadius: 6,
    fontSize: 15,
    background: "#fff",
  },

  hint: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 6,
    lineHeight: 1.5,
  },

  documentLink: {
    display: "inline-block",
    marginTop: 8,
    fontSize: 13,
    fontWeight: 600,
    color: "#2563eb",
    textDecoration: "none",
  },

  submit: {
    padding: "15px 28px",
    background: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
  },

  disabledSubmit: {
    opacity: 0.6,
    cursor: "not-allowed",
  },

  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "14px 18px",
    borderRadius: 6,
    marginBottom: 20,
  },

  success: {
    background: "#d1fae5",
    color: "#065f46",
    padding: "14px 18px",
    borderRadius: 6,
    marginBottom: 20,
  },

  reason: {
    background: "#fff7ed",
    border:
      "1px solid #fed7aa",
    color: "#9a3412",
    padding: "14px 18px",
    borderRadius: 6,
    margin: "0 26px 26px",
    lineHeight: 1.6,
  },

  loading: {
    minHeight: "100vh",
    background: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily:
      "Inter, system-ui, sans-serif",
    fontSize: 16,
    fontWeight: 600,
    color: "#374151",
  },
};

// ======================================================
// DOCUMENT URL HELPER
// ======================================================

const getDocumentUrl = (documentPath) => {
  if (!documentPath) {
    return "";
  }

  if (
    documentPath.startsWith("http://") ||
    documentPath.startsWith("https://")
  ) {
    return documentPath;
  }

  return `${SERVER}${documentPath.startsWith("/") ? "" : "/"}${documentPath}`;
};

// ======================================================
// COMPONENT
// ======================================================

const SubAdminKYC = () => {
  const navigate = useNavigate();

  const [form, setForm] =
    useState(emptyForm);

  const [kyc, setKyc] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // IMPORTANT:
  // Keep actual File objects separately.
  // Do NOT put File object into form state.
  const [idDocumentFile, setIdDocumentFile] =
    useState(null);

  const [addressProofFile, setAddressProofFile] =
    useState(null);

  // ======================================================
  // REDIRECT TO LOGIN
  // ======================================================

  const redirectToLogin =
    useCallback(() => {
      clearSession();

      navigate(
        "/account/login",
        {
          replace: true,
        }
      );
    }, [navigate]);

  // ======================================================
  // LOAD MY KYC
  // ======================================================

  const loadKyc =
    useCallback(async () => {
      const token = getToken();

      if (!token) {
        redirectToLogin();
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            KYC_MY_URL,
            {
              method: "GET",
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        // ==================================================
        // TOKEN EXPIRED
        // ==================================================

        if (response.status === 401) {
          redirectToLogin();
          return;
        }

        // ==================================================
        // NO KYC
        // ==================================================

        if (response.status === 404) {
          setKyc(null);
          return;
        }

        const result =
          await response.json();

        if (
          !response.ok ||
          result.success === false
        ) {
          throw new Error(
            result.message ||
              "Failed to load KYC"
          );
        }

        const saved =
          result.data ||
          result.kyc ||
          null;

        setKyc(saved);

        // ==================================================
        // PREFILL FORM
        // ==================================================

        if (saved) {
          setForm((prev) => ({
            ...prev,

            firstName:
              saved.firstName || "",

            lastName:
              saved.lastName || "",

            phone:
              saved.phone || "",

            dateOfBirth:
              saved.dateOfBirth
                ? String(
                    saved.dateOfBirth
                  ).substring(0, 10)
                : "",

            address:
              saved.address || "",

            city:
              saved.city || "",

            state:
              saved.state || "",

            pincode:
              saved.pincode || "",

            idType:
              saved.idType ||
              "aadhaar",

            idNumber:
              saved.idNumber || "",

            panNumber:
              saved.panNumber || "",

            idDocument:
              saved.idDocument || "",

            addressProof:
              saved.addressProof || "",

            accountHolderName:
              saved.accountHolderName ||
              "",

            bankName:
              saved.bankName || "",

            accountNumber:
              saved.accountNumber || "",

            ifscCode:
              saved.ifscCode || "",

            branchName:
              saved.branchName || "",
          }));
        }
      } catch (err) {
        console.error(
          "KYC LOAD ERROR:",
          err
        );

        setError(
          err.message ||
            "Failed to load KYC"
        );
      } finally {
        setLoading(false);
      }
    }, [redirectToLogin]);

  // ======================================================
  // PAGE LOAD
  // ======================================================

  useEffect(() => {
    // Prefill first and last name
    // from logged-in user.
    try {
      const stored =
        JSON.parse(
          localStorage.getItem(
            "user"
          ) || "null"
        );

      if (stored) {
        setForm((prev) => ({
          ...prev,

          firstName:
            prev.firstName ||
            stored.firstName ||
            "",

          lastName:
            prev.lastName ||
            stored.lastName ||
            "",
        }));
      }
    } catch {
      // Ignore invalid localStorage data.
    }

    loadKyc();
  }, [loadKyc]);

  // ======================================================
  // HANDLE TEXT INPUT
  // ======================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ======================================================
  // HANDLE FILE
  // ======================================================

  const handleFile = (e) => {
    const {
      name,
      files,
    } = e.target;

    const file =
      files?.[0];

    if (!file) {
      return;
    }

    // ====================================================
    // ALLOWED TYPES
    // ====================================================

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setError(
        "Only JPG, JPEG, PNG, WEBP and PDF files are allowed."
      );

      e.target.value = "";

      return;
    }

    // ====================================================
    // FILE SIZE
    // ====================================================

    if (
      file.size >
      MAX_FILE_SIZE
    ) {
      setError(
        "File is too large. Maximum size is 5 MB."
      );

      e.target.value = "";

      return;
    }

    setError("");
    setSuccess("");

    // ====================================================
    // STORE ACTUAL FILE
    // ====================================================

    if (
      name === "idDocument"
    ) {
      setIdDocumentFile(file);
    }

    if (
      name === "addressProof"
    ) {
      setAddressProofFile(file);
    }
  };

  // ======================================================
  // SUBMIT KYC
  // ======================================================

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      if (submitting) {
        return;
      }

      const token =
        getToken();

      if (!token) {
        redirectToLogin();
        return;
      }

      // ==================================================
      // REQUIRED ID DOCUMENT
      // ==================================================

      if (
        !idDocumentFile &&
        !form.idDocument
      ) {
        setError(
          "Please upload the ID document."
        );

        return;
      }

      // ==================================================
      // REQUIRED ADDRESS PROOF
      // ==================================================

      if (
        !addressProofFile &&
        !form.addressProof
      ) {
        setError(
          "Please upload the address proof."
        );

        return;
      }

      try {
        setSubmitting(true);
        setError("");
        setSuccess("");

        // =================================================
        // FORM DATA
        // =================================================

        const formData =
          new FormData();

        // =================================================
        // PERSONAL DETAILS
        // =================================================

        formData.append(
          "firstName",
          form.firstName || ""
        );

        formData.append(
          "lastName",
          form.lastName || ""
        );

        formData.append(
          "phone",
          form.phone || ""
        );

        formData.append(
          "dateOfBirth",
          form.dateOfBirth || ""
        );

        formData.append(
          "address",
          form.address || ""
        );

        formData.append(
          "city",
          form.city || ""
        );

        formData.append(
          "state",
          form.state || ""
        );

        formData.append(
          "pincode",
          form.pincode || ""
        );

        // =================================================
        // IDENTITY DETAILS
        // =================================================

        formData.append(
          "idType",
          form.idType || ""
        );

        formData.append(
          "idNumber",
          form.idNumber || ""
        );

        formData.append(
          "panNumber",
          form.panNumber || ""
        );

        // =================================================
        // BANK DETAILS
        // =================================================

        formData.append(
          "accountHolderName",
          form.accountHolderName || ""
        );

        formData.append(
          "bankName",
          form.bankName || ""
        );

        formData.append(
          "accountNumber",
          form.accountNumber || ""
        );

        formData.append(
          "ifscCode",
          form.ifscCode || ""
        );

        formData.append(
          "branchName",
          form.branchName || ""
        );

        // =================================================
        // ACTUAL FILES
        // =================================================

        if (idDocumentFile) {
          formData.append(
            "idDocument",
            idDocumentFile
          );
        }

        if (addressProofFile) {
          formData.append(
            "addressProof",
            addressProofFile
          );
        }

        // =================================================
        // DEBUG
        // =================================================

        console.log(
          "Submitting KYC FormData..."
        );

        for (
          const [key, value]
          of formData.entries()
        ) {
          if (
            value instanceof File
          ) {
            console.log(
              key,
              value.name,
              value.type,
              value.size
            );
          } else {
            console.log(
              key,
              value
            );
          }
        }

        // =================================================
        // API REQUEST
        // IMPORTANT:
        // DO NOT SET Content-Type MANUALLY.
        // Browser will create multipart boundary.
        // =================================================

        const response =
          await fetch(
            KYC_SUBMIT_URL,
            {
              method: "POST",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },

              body: formData,
            }
          );

        // =================================================
        // UNAUTHORIZED
        // =================================================

        if (
          response.status === 401
        ) {
          redirectToLogin();
          return;
        }

        // =================================================
        // RESPONSE
        // =================================================

        const result =
          await response.json();

        if (
          !response.ok ||
          result.success === false
        ) {
          throw new Error(
            result.message ||
              "Failed to submit KYC"
          );
        }

        // =================================================
        // SUCCESS
        // =================================================

        setSuccess(
          "KYC submitted successfully. It is now waiting for admin review."
        );

        // Clear newly selected files.
        setIdDocumentFile(null);
        setAddressProofFile(null);

        // Clear file input elements.
        const idInput =
          document.getElementById(
            "idDocument"
          );

        const addressInput =
          document.getElementById(
            "addressProof"
          );

        if (idInput) {
          idInput.value = "";
        }

        if (addressInput) {
          addressInput.value = "";
        }

        // Reload saved KYC
        await loadKyc();

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } catch (err) {
        console.error(
          "KYC SUBMIT ERROR:",
          err
        );

        setError(
          err.message ||
            "Failed to submit KYC"
        );
      } finally {
        setSubmitting(false);
      }
    };

  // ======================================================
  // DERIVED STATUS
  // ======================================================

  const statusKey =
    kyc?.status || "none";

  const badge =
    STATUS_STYLE[
      statusKey
    ] ||
    STATUS_STYLE.none;

  // Pending and approved KYC
  // cannot be edited.
  const locked =
    statusKey === "pending" ||
    statusKey === "approved";

  // ======================================================
  // GENERIC FIELD
  // ======================================================

  const field = (
    name,
    label,
    props = {}
  ) => (
    <div
      style={
        props.full
          ? s.full
          : undefined
      }
    >
      <label
        style={s.label}
        htmlFor={name}
      >
        {label} *
      </label>

      <input
        id={name}
        name={name}
        value={
          form[name] || ""
        }
        onChange={
          handleChange
        }
        style={s.input}
        required
        disabled={locked}
        type={
          props.type ||
          "text"
        }
        placeholder={
          props.placeholder
        }
      />

      {props.hint && (
        <div
          style={s.hint}
        >
          {props.hint}
        </div>
      )}
    </div>
  );

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div
        style={s.loading}
      >
        Loading KYC...
      </div>
    );
  }

  // ======================================================
  // UI
  // ======================================================

  return (
    <div style={s.page}>
      <div style={s.wrap}>

        {/* =================================================
            HEADER
        ================================================= */}

        <div style={s.head}>

          <button
            type="button"
            style={s.backBtn}
            onClick={() =>
              navigate(
                "/sub-admin"
              )
            }
          >
            ← Dashboard
          </button>

          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#6b7280",
              }}
            >
              Sub-admin
            </div>

            <h1
              style={s.title}
            >
              KYC Verification
            </h1>

            <p style={s.sub}>
              Complete your
              verification before
              managing properties.
            </p>
          </div>

        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div style={s.error}>
            {error}
          </div>
        )}

        {/* =================================================
            SUCCESS
        ================================================= */}

        {success && (
          <div
            style={s.success}
          >
            {success}
          </div>
        )}

        {/* =================================================
            STATUS
        ================================================= */}

        <div style={s.card}>

          <div
            style={s.statusRow}
          >

            <strong>
              KYC Status
            </strong>

            <span
              style={{
                background:
                  badge.bg,
                color:
                  badge.fg,
                padding:
                  "6px 14px",
                borderRadius:
                  999,
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {badge.label}
            </span>

          </div>

          {statusKey ===
            "rejected" &&
            kyc?.rejectionReason && (
              <div
                style={s.reason}
              >
                <strong>
                  Reason:{" "}
                </strong>

                {kyc.rejectionReason}

                <div
                  style={{
                    marginTop: 6,
                  }}
                >
                  Fix the details
                  below and submit
                  again.
                </div>
              </div>
            )}

        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={
            handleSubmit
          }
        >

          {/* =================================================
              PERSONAL DETAILS
          ================================================= */}

          <div style={s.card}>

            <div
              style={s.cardHead}
            >
              <h2
                style={s.cardTitle}
              >
                Personal Details
              </h2>
            </div>

            <div
              style={{
                ...s.cardBody,
                ...s.grid,
              }}
            >

              {field(
                "firstName",
                "First Name"
              )}

              {field(
                "lastName",
                "Last Name"
              )}

              {field(
                "phone",
                "Phone",
                {
                  type: "tel",
                }
              )}

              {field(
                "dateOfBirth",
                "Date of Birth",
                {
                  type: "date",
                }
              )}

              {field(
                "address",
                "Address",
                {
                  full: true,
                }
              )}

              {field(
                "city",
                "City"
              )}

              {field(
                "state",
                "State"
              )}

              {field(
                "pincode",
                "PIN Code"
              )}

            </div>
          </div>

          {/* =================================================
              IDENTITY VERIFICATION
          ================================================= */}

          <div style={s.card}>

            <div
              style={s.cardHead}
            >
              <h2
                style={s.cardTitle}
              >
                Identity Verification
              </h2>
            </div>

            <div
              style={{
                ...s.cardBody,
                ...s.grid,
              }}
            >

              {/* ID TYPE */}

              <div>

                <label
                  style={s.label}
                  htmlFor="idType"
                >
                  ID Type *
                </label>

                <select
                  id="idType"
                  name="idType"
                  value={
                    form.idType
                  }
                  onChange={
                    handleChange
                  }
                  style={s.input}
                  disabled={locked}
                  required
                >
                  {ID_TYPES.map(
                    (type) => (
                      <option
                        key={
                          type.value
                        }
                        value={
                          type.value
                        }
                      >
                        {
                          type.label
                        }
                      </option>
                    )
                  )}
                </select>

              </div>

              {/* ID NUMBER */}

              {field(
                "idNumber",
                "ID Number"
              )}

              {/* PAN */}

              {field(
                "panNumber",
                "PAN Number",
                {
                  placeholder:
                    "ABCDE1234F",
                }
              )}

              <div />

              {/* =================================================
                  ID DOCUMENT
              ================================================= */}

              <div>

                <label
                  style={s.label}
                  htmlFor="idDocument"
                >
                  ID Document *
                </label>

                <input
                  id="idDocument"
                  name="idDocument"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                  onChange={
                    handleFile
                  }
                  style={s.input}
                  disabled={locked}
                />

                <div
                  style={s.hint}
                >
                  {idDocumentFile
                    ? `Selected: ${idDocumentFile.name}`
                    : form.idDocument
                    ? "Document already uploaded. Select a new file only if you want to replace it."
                    : "JPG, PNG, WEBP or PDF, maximum 5 MB."}
                </div>

                {/* CURRENT DOCUMENT */}

                {form.idDocument &&
                  !idDocumentFile && (
                    <a
                      href={getDocumentUrl(
                        form.idDocument
                      )}
                      target="_blank"
                      rel="noreferrer"
                      style={
                        s.documentLink
                      }
                    >
                      View current ID
                      document
                    </a>
                  )}

              </div>

              {/* =================================================
                  ADDRESS PROOF
              ================================================= */}

              <div>

                <label
                  style={s.label}
                  htmlFor="addressProof"
                >
                  Address Proof *
                </label>

                <input
                  id="addressProof"
                  name="addressProof"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                  onChange={
                    handleFile
                  }
                  style={s.input}
                  disabled={locked}
                />

                <div
                  style={s.hint}
                >
                  {addressProofFile
                    ? `Selected: ${addressProofFile.name}`
                    : form.addressProof
                    ? "Document already uploaded. Select a new file only if you want to replace it."
                    : "JPG, PNG, WEBP or PDF, maximum 5 MB."}
                </div>

                {/* CURRENT DOCUMENT */}

                {form.addressProof &&
                  !addressProofFile && (
                    <a
                      href={getDocumentUrl(
                        form.addressProof
                      )}
                      target="_blank"
                      rel="noreferrer"
                      style={
                        s.documentLink
                      }
                    >
                      View current
                      address proof
                    </a>
                  )}

              </div>

            </div>
          </div>

          {/* =================================================
              BANK DETAILS
          ================================================= */}

          <div style={s.card}>

            <div
              style={s.cardHead}
            >
              <h2
                style={s.cardTitle}
              >
                Bank Details
              </h2>
            </div>

            <div
              style={{
                ...s.cardBody,
                ...s.grid,
              }}
            >

              {field(
                "accountHolderName",
                "Account Holder Name"
              )}

              {field(
                "bankName",
                "Bank Name"
              )}

              {field(
                "accountNumber",
                "Account Number"
              )}

              {field(
                "ifscCode",
                "IFSC Code",
                {
                  placeholder:
                    "SBIN0001234",
                }
              )}

              {field(
                "branchName",
                "Branch Name",
                {
                  full: true,
                }
              )}

            </div>
          </div>

          {/* =================================================
              SUBMIT
          ================================================= */}

          {!locked && (
            <button
              type="submit"
              style={{
                ...s.submit,
                ...(submitting
                  ? s.disabledSubmit
                  : {}),
              }}
              disabled={
                submitting
              }
            >
              {submitting
                ? "Submitting..."
                : statusKey ===
                  "rejected"
                ? "Resubmit KYC"
                : "Submit KYC"}
            </button>
          )}

        </form>
      </div>
    </div>
  );
};

export default SubAdminKYC;