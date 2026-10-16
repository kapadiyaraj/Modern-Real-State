


// import React, { useCallback, useEffect, useState } from "react";
// import "./RevenueDashboard.css";

// const API_URL = "http://localhost:5000/api/revenue/dashboard";

// const money = (value) =>
//   new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//     maximumFractionDigits: 2,
//   }).format(Number(value) || 0);

// const getToken = () =>
//   localStorage.getItem("token") ||
//   localStorage.getItem("authToken") ||
//   "";

// const imageUrl = (image) => {
//   if (!image) return "";

//   if (/^(https?:|data:|blob:)/i.test(image)) {
//     return image;
//   }

//   return `http://localhost:5000/${image.replace(/^\/+/, "")}`;
// };

// export default function RevenueDashboard({ role = "admin" }) {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [refreshKey, setRefreshKey] = useState(0);

//   const loadRevenue = useCallback(async (signal) => {
//     try {
//       setLoading(true);
//       setError("");

//       const token = getToken();

//       const response = await fetch(API_URL, {
//         headers: {
//           Accept: "application/json",
//           ...(token
//             ? { Authorization: `Bearer ${token}` }
//             : {}),
//         },
//         signal,
//       });

//       const contentType = response.headers.get("content-type") || "";

//       if (!contentType.includes("application/json")) {
//         throw new Error(
//           "Backend returned HTML instead of JSON. Check the API route."
//         );
//       }

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(
//           result.message || "Unable to load revenue"
//         );
//       }

//       setData(result.data);
//     } catch (err) {
//       if (err.name !== "AbortError") {
//         setError(err.message || "Failed to load revenue");
//       }
//     } finally {
//       if (!signal.aborted) {
//         setLoading(false);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const controller = new AbortController();

//     loadRevenue(controller.signal);

//     return () => controller.abort();
//   }, [loadRevenue, refreshKey]);

//   const isAdmin = role === "admin";
//   const properties = Array.isArray(data?.properties)
//     ? data.properties
//     : [];

//   if (loading) {
//     return (
//       <main className="revenue-page">
//         <div className="revenue-state">Loading revenue...</div>
//       </main>
//     );
//   }

//   return (
//     <main className="revenue-page">
//       <header className="revenue-header">
//         <div>
//           <span className="revenue-eyebrow">
//             FINANCIAL OVERVIEW
//           </span>
//           <h1>
//             {isAdmin ? "Revenue Dashboard" : "My Revenue Dashboard"}
//           </h1>
//           <p>
//             {isAdmin
//               ? "Revenue across all property owners."
//               : "Revenue from properties created by you."}
//           </p>
//         </div>

//         <button
//           className="revenue-refresh"
//           onClick={() => setRefreshKey((v) => v + 1)}
//         >
//           ↻ Refresh
//         </button>
//       </header>

//       {error ? (
//         <div className="revenue-error">
//           <strong>Unable to load revenue</strong>
//           <p>{error}</p>
//         </div>
//       ) : (
//         <>
//           <section className="revenue-cards">
//             <article className="revenue-card">
//               <span>Total Paid Sales</span>
//               <h2>{money(data?.totalSales)}</h2>
//             </article>

//             {isAdmin && (
//               <article className="revenue-card">
//                 <span>Admin Share · 20%</span>
//                 <h2>{money(data?.adminRevenue)}</h2>
//               </article>
//             )}

//             <article className="revenue-card">
//               <span>
//                 {isAdmin
//                   ? "Sub Admin Share · 80%"
//                   : "My Earnings · 80%"}
//               </span>
//               <h2>{money(data?.subAdminRevenue)}</h2>
//             </article>

//             <article className="revenue-card">
//               <span>Paid Order Items</span>
//               <h2>{Number(data?.propertiesSold || 0)}</h2>
//             </article>
//           </section>

//           <section className="revenue-table-section">
//             <div className="revenue-table-heading">
//               <div>
//                 <h2>Property-wise Revenue</h2>
//                 <p>
//                   {isAdmin
//                     ? "Includes Admin and Sub Admin properties."
//                     : "Only your own properties are shown."}
//                 </p>
//               </div>
//               <span>{properties.length} properties</span>
//             </div>

//             <div className="revenue-table-wrapper">
//               <table className="revenue-table">
//                 <thead>
//                   <tr>
//                     <th>Property</th>
//                     <th>Type</th>
//                     <th>Paid Sales</th>
//                     {isAdmin && <th>Admin 20%</th>}
//                     <th>{isAdmin ? "Sub Admin 80%" : "My Share 80%"}</th>
//                     <th>Paid Items</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {properties.length === 0 ? (
//                     <tr>
//                       <td
//                         colSpan={isAdmin ? 6 : 5}
//                         className="revenue-empty"
//                       >
//                         No paid property sales found.
//                       </td>
//                     </tr>
//                   ) : (
//                     properties.map((property) => (
//                       <tr
//                         key={`${property.productType}:${property.productId}`}
//                       >
//                         <td>
//                           <div className="revenue-property">
//                             {property.image ? (
//                               <img
//                                 src={imageUrl(property.image)}
//                                 alt={property.title}
//                                 onError={(event) => {
//                                   event.currentTarget.style.display = "none";
//                                 }}
//                               />
//                             ) : (
//                               <div className="revenue-no-image">⌂</div>
//                             )}

//                             <div>
//                               <strong>{property.title}</strong>
//                               <small>
//                                 {property.ownerName || "Unknown owner"}
//                               </small>
//                             </div>
//                           </div>
//                         </td>

//                         <td>
//                           <span className="revenue-type">
//                             {property.productType}
//                           </span>
//                         </td>

//                         <td>{money(property.totalSales)}</td>

//                         {isAdmin && (
//                           <td>{money(property.adminRevenue)}</td>
//                         )}

//                         <td className="revenue-green">
//                           {money(
//                             isAdmin
//                               ? property.subAdminRevenue
//                               : property.myRevenue ??
//                                   property.subAdminRevenue
//                           )}
//                         </td>

//                         <td>{Number(property.ordersCount || 0)}</td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </section>
//         </>
//       )}
//     </main>
//   );
// }




import React, { useCallback, useEffect, useState } from "react";
import "./RevenueDashboard.css";

const API_URL = "http://localhost:5000/api/revenue/dashboard";
const ITEMS_PER_PAGE = 10;

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const getToken = () =>
  localStorage.getItem("token") ||
  localStorage.getItem("authToken") ||
  "";

const imageUrl = (image) => {
  if (!image) return "";

  if (/^(https?:|data:|blob:)/i.test(image)) {
    return image;
  }

  return `http://localhost:5000/${image.replace(/^\/+/, "")}`;
};

export default function RevenueDashboard({ role = "admin" }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const loadRevenue = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...(token
            ? { Authorization: `Bearer ${token}` }
            : {}),
        },
        signal,
      });

      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          "Backend returned HTML instead of JSON. Check the revenue API route."
        );
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to load revenue"
        );
      }

      setData(result.data);
      setCurrentPage(1);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Failed to load revenue");
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    loadRevenue(controller.signal);

    return () => controller.abort();
  }, [loadRevenue, refreshKey]);

  const isAdmin = role === "admin";

  // Newest revenue date first.
  // Backend should return lastRevenueDate for each property.
  const properties = React.useMemo(() => {
    const list = Array.isArray(data?.properties)
      ? [...data.properties]
      : [];

    return list.sort((a, b) => {
      const dateA = new Date(
        a.lastRevenueDate || a.latestOrderDate || 0
      ).getTime();

      const dateB = new Date(
        b.lastRevenueDate || b.latestOrderDate || 0
      ).getTime();

      if (dateB !== dateA) {
        return dateB - dateA;
      }

      // Stable fallback when dates are equal or missing.
      return String(a.title || "").localeCompare(
        String(b.title || "")
      );
    });
  }, [data]);

  const totalPages = Math.max(
    1,
    Math.ceil(properties.length / ITEMS_PER_PAGE)
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginatedProperties = properties.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const startItem =
    properties.length === 0
      ? 0
      : (safePage - 1) * ITEMS_PER_PAGE + 1;

  const endItem = Math.min(
    safePage * ITEMS_PER_PAGE,
    properties.length
  );

  if (loading) {
    return (
      <main className="revenue-page">
        <div className="revenue-state">
          <div className="revenue-spinner" />
          Loading revenue dashboard...
        </div>
      </main>
    );
  }

  return (
    <main className="revenue-page">
      <header className="revenue-header">
        <div>
          <span className="revenue-eyebrow">
            FINANCIAL OVERVIEW
          </span>

          <h1>
            {isAdmin
              ? "Revenue Dashboard"
              : "My Revenue Dashboard"}
          </h1>

          <p>
            {isAdmin
              ? "Track revenue across all properties and owners."
              : "Track sales and earnings from your properties."}
          </p>
        </div>

        <button
          type="button"
          className="revenue-refresh"
          onClick={() => setRefreshKey((value) => value + 1)}
        >
          ↻ Refresh
        </button>
      </header>

      {error ? (
        <div className="revenue-error">
          <strong>Unable to load revenue</strong>
          <p>{error}</p>
        </div>
      ) : (
        <>
          <section className="revenue-cards">
            <article className="revenue-card">
              <div className="revenue-card-icon purple">₹</div>
              <span>Total Paid Sales</span>
              <h2>{money(data?.totalSales)}</h2>
              <small>Sales from paid orders</small>
            </article>

            {isAdmin && (
              <article className="revenue-card">
                <div className="revenue-card-icon blue">↗</div>
                <span>Admin Share · 20%</span>
                <h2>{money(data?.adminRevenue)}</h2>
                <small>Admin revenue share</small>
              </article>
            )}

            <article className="revenue-card">
              <div className="revenue-card-icon green">↗</div>
              <span>
                {isAdmin
                  ? "Sub Admin Share · 80%"
                  : "My Earnings · 80%"}
              </span>
              <h2>{money(data?.subAdminRevenue)}</h2>
              <small>
                {isAdmin
                  ? "Revenue allocated to sub-admin-owned properties"
                  : "Revenue from your own properties"}
              </small>
            </article>

            <article className="revenue-card">
              <div className="revenue-card-icon orange">▦</div>
              <span>Paid Order Items</span>
              <h2>{Number(data?.propertiesSold || 0)}</h2>
              <small>Items included in paid orders</small>
            </article>
          </section>

          <section className="revenue-table-section">
            <div className="revenue-table-heading">
              <div>
                <h2>Property-wise Revenue</h2>
                <p>
                  Newest revenue activity appears first.
                </p>
              </div>

              <span className="revenue-count">
                {properties.length} properties
              </span>
            </div>

            <div className="revenue-table-wrapper">
              <table className="revenue-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Type</th>
                    <th>Paid Sales</th>
                    {isAdmin && <th>Admin · 20%</th>}
                    <th>
                      {isAdmin
                        ? "Sub Admin · 80%"
                        : "My Share · 80%"}
                    </th>
                    <th>Paid Items</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedProperties.length === 0 ? (
                    <tr>
                      <td
                        colSpan={isAdmin ? 6 : 5}
                        className="revenue-empty"
                      >
                        No paid property sales found.
                      </td>
                    </tr>
                  ) : (
                    paginatedProperties.map((property) => (
                      <tr
                        key={`${property.productType}:${property.productId}`}
                      >
                        <td>
                          <div className="revenue-property">
                            {property.image ? (
                              <img
                                src={imageUrl(property.image)}
                                alt={property.title || "Property"}
                                onError={(event) => {
                                  event.currentTarget.style.display =
                                    "none";
                                }}
                              />
                            ) : (
                              <div className="revenue-no-image">
                                ⌂
                              </div>
                            )}

                            <div>
                              <strong>
                                {property.title || "Untitled property"}
                              </strong>

                              <small>
                                {property.ownerName || "Unknown owner"}
                              </small>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="revenue-type">
                            {property.productType || "property"}
                          </span>
                        </td>

                        <td className="revenue-number">
                          {money(property.totalSales)}
                        </td>

                        {isAdmin && (
                          <td className="revenue-number">
                            {money(property.adminRevenue)}
                          </td>
                        )}

                        <td className="revenue-number revenue-green">
                          {money(
                            isAdmin
                              ? property.subAdminRevenue
                              : property.myRevenue ??
                                  property.subAdminRevenue
                          )}
                        </td>

                        <td>{Number(property.ordersCount || 0)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="revenue-pagination">
              <span>
                Showing {startItem}–{endItem} of{" "}
                {properties.length} properties
              </span>

              <div className="revenue-pagination-buttons">
                <button
                  type="button"
                  disabled={safePage === 1}
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.max(1, page - 1)
                    )
                  }
                >
                  Previous
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    type="button"
                    key={page}
                    className={
                      safePage === page ? "active" : ""
                    }
                    aria-current={
                      safePage === page ? "page" : undefined
                    }
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={safePage === totalPages}
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.min(totalPages, page + 1)
                    )
                  }
                >
                  Next
                </button>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

