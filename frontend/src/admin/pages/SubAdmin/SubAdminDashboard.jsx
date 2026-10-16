// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./SubAdminDashboard.css";

// const API =
//   "http://localhost:5000/api/subadmin/kyc";

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

// const SubAdminDashboard = () => {
//   const navigate = useNavigate();

//   const [kyc, setKyc] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadKYC = async () => {
//       try {
//         const response = await fetch(
//           `${API}/my`,
//           {
//             headers: {
//               ...getAuthHeaders(),
//             },
//           }
//         );

//         const result =
//           await response.json();

//         if (response.ok) {
//           setKyc(result?.data || null);
//         }
//       } catch (error) {
//         console.error(
//           "SubAdmin KYC:",
//           error
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadKYC();
//   }, []);

//   const status =
//     kyc?.status || "not_submitted";

//   const handleAddProperty = () => {
//     if (status !== "approved") {
//       alert(
//         "KYC Verification Required. Please complete your KYC before adding a property."
//       );

//       navigate("/sub-admin/kyc");

//       return;
//     }

//     navigate("/sub-admin/properties/add");
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("adminToken");
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("user");

//     navigate("/account/login");
//   };

//   return (
//     <main className="subadmin-dashboard-page">

//       <header className="subadmin-dashboard-header">

//         <div>
//           <span>SUB-ADMIN PANEL</span>

//           <h1>
//             Sub-Admin Dashboard
//           </h1>

//           <p>
//             Manage your properties and
//             account verification.
//           </p>
//         </div>

//         <button
//           onClick={handleLogout}
//           className="subadmin-logout"
//         >
//           Logout
//         </button>

//       </header>

//       <section className="subadmin-dashboard-grid">

//         {/* KYC */}

//         <div className="subadmin-dashboard-card">

//           <div className="subadmin-card-top">

//             <span>
//               KYC VERIFICATION
//             </span>

//             <strong
//               className={`status-${status}`}
//             >
//               {status ===
//               "not_submitted"
//                 ? "Not Submitted"
//                 : status}
//             </strong>

//           </div>

//           <h2>
//             Verification Status
//           </h2>

//           <p>
//             Complete KYC verification
//             before adding or managing
//             properties.
//           </p>

//           <button
//             onClick={() =>
//               navigate(
//                 "/sub-admin/kyc"
//               )
//             }
//           >
//             {status === "approved"
//               ? "View KYC"
//               : "Complete KYC"}
//             <span>→</span>
//           </button>

//         </div>

//         {/* PROPERTY */}

//         <div className="subadmin-dashboard-card">

//           <div className="subadmin-card-top">
//             <span>
//               PROPERTY MANAGEMENT
//             </span>
//           </div>

//           <h2>
//             My Properties
//           </h2>

//           <p>
//             Manage properties owned by
//             your Sub-Admin account.
//           </p>

//           <div className="subadmin-card-actions">

//             <button
//               onClick={() =>
//                 navigate(
//                   "/sub-admin/properties"
//                 )
//               }
//             >
//               View Properties
//               <span>→</span>
//             </button>

//             <button
//               onClick={handleAddProperty}
//             >
//               Add Property
//               <span>+</span>
//             </button>

//           </div>

//         </div>

//         {/* REVIEWS */}

//         <div className="subadmin-dashboard-card">

//           <div className="subadmin-card-top">
//             <span>
//               REVIEWS
//             </span>
//           </div>

//           <h2>
//             Property Reviews
//           </h2>

//           <p>
//             View reviews received on
//             your properties.
//           </p>

//           <button
//             onClick={() =>
//               navigate(
//                 "/sub-admin/reviews"
//               )
//             }
//           >
//             View Reviews
//             <span>→</span>
//           </button>

//         </div>

//         {/* PAYMENTS */}

//         <div className="subadmin-dashboard-card">

//           <div className="subadmin-card-top">
//             <span>
//               REVENUE
//             </span>
//           </div>

//           <h2>
//             Payments
//           </h2>

//           <p>
//             View your property sales
//             and revenue history.
//           </p>

//           <button
//             onClick={() =>
//               navigate(
//                 "/sub-admin/payments"
//               )
//             }
//           >
//             View Payments
//             <span>→</span>
//           </button>

//         </div>

//       </section>

//     </main>
//   );
// };

// export default SubAdminDashboard;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SubAdminDashboard.css";

const API =
  "http://localhost:5000/api/subadmin/kyc";

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

const SubAdminDashboard = () => {
  const navigate = useNavigate();

  const [kyc, setKyc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadKYC = async () => {
      try {
        const response = await fetch(`${API}/my`, {
          headers: {
            ...getAuthHeaders(),
          },
        });

        const result = await response.json();

        if (response.ok) {
          setKyc(result?.data || null);
        }
      } catch (error) {
        console.error("SubAdmin KYC:", error);
      } finally {
        setLoading(false);
      }
    };

    loadKYC();
  }, []);

  const status =
    kyc?.status || "not_submitted";

  // ==========================================
  // PROPERTY ADD - KYC CHECK
  // ==========================================
  const handleAddProperty = () => {
    if (status !== "approved") {
      alert(
        "KYC Verification Required. Please complete your KYC before adding a property."
      );

      navigate("/sub-admin/kyc");

      return;
    }

    navigate("/sub-admin/properties/add");
  };

  // ==========================================
  // LUXURY PROPERTY ADD - KYC CHECK
  // ==========================================
  const handleAddLuxuryProperty = () => {
    if (status !== "approved") {
      alert(
        "KYC Verification Required. Please complete your KYC before adding a property."
      );

      navigate("/sub-admin/kyc");

      return;
    }

    navigate("/sub-admin/luxury-properties");
  };

  // ==========================================
  // PENTHOUSE ADD - KYC CHECK
  // ==========================================
  const handleAddPenthouse = () => {
    if (status !== "approved") {
      alert(
        "KYC Verification Required. Please complete your KYC before adding a property."
      );

      navigate("/sub-admin/kyc");

      return;
    }

    navigate("/sub-admin/penthouse-properties");
  };

  // ==========================================
  // SPACIOUS LIVING ADD - KYC CHECK
  // ==========================================
  const handleAddSpacious = () => {
    if (status !== "approved") {
      alert(
        "KYC Verification Required. Please complete your KYC before adding a property."
      );

      navigate("/sub-admin/kyc");

      return;
    }

    navigate("/sub-admin/spacious-living");
  };

  // ==========================================
  // LOGOUT
  // ==========================================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    navigate("/account/login");
  };

  return (
    <main className="subadmin-dashboard-page">

      {/* ========================================
          HEADER
      ======================================== */}
      <header className="subadmin-dashboard-header">

        <div>
          <span>SUB-ADMIN PANEL</span>

          <h1>
            Sub-Admin Dashboard
          </h1>

          <p>
            Manage your properties and
            account verification.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="subadmin-logout"
        >
          Logout
        </button>

      </header>

      {/* ========================================
          DASHBOARD GRID
      ======================================== */}
      <section className="subadmin-dashboard-grid">

        {/* ======================================
            KYC
        ====================================== */}
        <div className="subadmin-dashboard-card">

          <div className="subadmin-card-top">

            <span>
              KYC VERIFICATION
            </span>

            <strong
              className={`status-${status}`}
            >
              {status === "not_submitted"
                ? "Not Submitted"
                : status}
            </strong>

          </div>

          <h2>
            Verification Status
          </h2>

          <p>
            Complete KYC verification
            before adding or managing
            properties.
          </p>

          <button
            onClick={() =>
              navigate("/sub-admin/kyc")
            }
          >
            {status === "approved"
              ? "View KYC"
              : "Complete KYC"}

            <span>→</span>
          </button>

        </div>

        {/* ======================================
            GENERIC PROPERTY
        ====================================== */}
        <div className="subadmin-dashboard-card">

          <div className="subadmin-card-top">
            <span>
              PROPERTY MANAGEMENT
            </span>
          </div>

          <h2>
            My Properties
          </h2>

          <p>
            Manage properties owned by
            your Sub-Admin account.
          </p>

          <div className="subadmin-card-actions">

            <button
              onClick={() =>
                navigate(
                  "/sub-admin/properties"
                )
              }
            >
              Add Property
              <span>→</span>
            </button>

          

          </div>

        </div>

        {/* ======================================
            LUXURY PROPERTIES
        ====================================== */}
        <div className="subadmin-dashboard-card">

          <div className="subadmin-card-top">
            <span>
              LUXURY PROPERTY MANAGEMENT
            </span>
          </div>

          <h2>
            Luxury Properties
          </h2>

          <p>
            Manage your luxury properties,
            including adding, editing and
            deleting your own listings.
          </p>

          <div className="subadmin-card-actions">

            <button
              onClick={() =>
                navigate(
                  "/sub-admin/luxury-properties/all"
                )
              }
            >
              View All
              <span>→</span>
            </button>

            <button
              onClick={handleAddLuxuryProperty}
            >
              Add Property
              <span>+</span>
            </button>

          </div>

        </div>

        {/* ======================================
            PENTHOUSE
        ====================================== */}
        <div className="subadmin-dashboard-card">

          <div className="subadmin-card-top">
            <span>
              PENTHOUSE MANAGEMENT
            </span>
          </div>

          <h2>
            Penthouse Properties
          </h2>

          <p>
            Manage your penthouse properties,
            including adding, editing and
            deleting your own listings.
          </p>

          <div className="subadmin-card-actions">

            <button
              onClick={() =>
                navigate(
                  "/sub-admin/penthouse-properties/all"
                )
              }
            >
              View All
              <span>→</span>
            </button>

            <button
              onClick={handleAddPenthouse}
            >
              Add Property
              <span>+</span>
            </button>

          </div>

        </div>

        {/* ======================================
            SPACIOUS LIVING
        ====================================== */}
        <div className="subadmin-dashboard-card">

          <div className="subadmin-card-top">
            <span>
              SPACIOUS LIVING MANAGEMENT
            </span>
          </div>

          <h2>
            Spacious Living
          </h2>

          <p>
            Manage your spacious living
            properties, including adding,
            editing and deleting your listings.
          </p>

          <div className="subadmin-card-actions">

       

            <button
              onClick={handleAddSpacious}
            >
              Add Property
              <span>+</span>
            </button>

          </div>

        </div>

        {/* ======================================
            REVIEWS
        ====================================== */}
        {/* <div className="subadmin-dashboard-card">

          <div className="subadmin-card-top">
            <span>
              REVIEWS
            </span>
          </div>

          <h2>
            Property Reviews
          </h2>

          <p>
            View reviews received on
            your properties.
          </p>

          <button
            onClick={() =>
              navigate(
                "/sub-admin/reviews"
              )
            }
          >
            View Reviews
            <span>→</span>
          </button>

        </div> */}

        {/* ======================================
            PAYMENTS
        ====================================== */}
        <div className="subadmin-dashboard-card">

          <div className="subadmin-card-top">
            <span>
              REVENUE
            </span>
          </div>

          <h2>
            Payments
          </h2>

          <p>
            View your property sales
            and revenue history.
          </p>

          <button
            onClick={() =>
              navigate(
                "/sub-admin/revenue"
              )
            }
          >
            View Payments
            <span>→</span>
          </button>

        </div>

      </section>

    </main>
  );
};

export default SubAdminDashboard;