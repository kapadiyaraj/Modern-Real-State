


// import React, { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./HomesSpeakingAllAdmin.css";

// const API_URL = "http://localhost:5000/api/homes-speaking";

// const HomesSpeakingAllAdmin = () => {
//   const navigate = useNavigate();

//   const [homes, setHomes] = useState([]);
//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("All");
//   const [sortBy, setSortBy] = useState("latest");
//   const [currentPage, setCurrentPage] = useState(1);

//   const itemsPerPage = 12;

//   // =========================================================
//   // LOAD HOMES FROM MONGODB
//   // =========================================================

//   const loadHomes = async () => {
//     try {
//       const response = await fetch(API_URL);
//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           result.message || "Failed to load Homes Speaking data"
//         );
//       }

//       if (result.success && Array.isArray(result.data)) {
//         setHomes(result.data);
//       } else {
//         setHomes([]);
//       }
//     } catch (error) {
//       console.error("Homes Speaking loading error:", error);
//       setHomes([]);
//     }
//   };

//   useEffect(() => {
//     loadHomes();

//     const handleHomesUpdated = () => {
//       loadHomes();
//     };

//     window.addEventListener(
//       "homesSpeakingUpdated",
//       handleHomesUpdated
//     );

//     window.addEventListener(
//       "storage",
//       handleHomesUpdated
//     );

//     return () => {
//       window.removeEventListener(
//         "homesSpeakingUpdated",
//         handleHomesUpdated
//       );

//       window.removeEventListener(
//         "storage",
//         handleHomesUpdated
//       );
//     };
//   }, []);

//   // =========================================================
//   // CATEGORIES
//   // =========================================================

//   const categories = useMemo(() => {
//     const uniqueCategories = [
//       ...new Set(
//         homes
//           .map((home) => home.category)
//           .filter(Boolean)
//       ),
//     ];

//     return ["All", ...uniqueCategories];
//   }, [homes]);

//   // =========================================================
//   // SEARCH + FILTER + SORT
//   // =========================================================

//   const filteredHomes = useMemo(() => {
//     let result = [...homes];

//     const keyword = search.trim().toLowerCase();

//     // SEARCH

//     if (keyword) {
//       result = result.filter((home) => {
//         return (
//           home.title
//             ?.toLowerCase()
//             .includes(keyword) ||
//           home.category
//             ?.toLowerCase()
//             .includes(keyword) ||
//           home.author
//             ?.toLowerCase()
//             .includes(keyword) ||
//           home.date
//             ?.toLowerCase()
//             .includes(keyword) ||
//           home.description
//             ?.toLowerCase()
//             .includes(keyword)
//         );
//       });
//     }

//     // CATEGORY

//     if (category !== "All") {
//       result = result.filter(
//         (home) => home.category === category
//       );
//     }

//     // SORT

//     if (sortBy === "latest") {
//       result.sort(
//         (a, b) =>
//           Number(b.id) - Number(a.id)
//       );
//     }

//     if (sortBy === "oldest") {
//       result.sort(
//         (a, b) =>
//           Number(a.id) - Number(b.id)
//       );
//     }

//     if (sortBy === "nameAZ") {
//       result.sort((a, b) =>
//         (a.title || "").localeCompare(
//           b.title || ""
//         )
//       );
//     }

//     if (sortBy === "nameZA") {
//       result.sort((a, b) =>
//         (b.title || "").localeCompare(
//           a.title || ""
//         )
//       );
//     }

//     return result;
//   }, [
//     homes,
//     search,
//     category,
//     sortBy,
//   ]);

//   // =========================================================
//   // PAGINATION
//   // =========================================================

//   const totalPages = Math.ceil(
//     filteredHomes.length / itemsPerPage
//   );

//   const startIndex =
//     (currentPage - 1) * itemsPerPage;

//   const endIndex =
//     startIndex + itemsPerPage;

//   const currentHomes =
//     filteredHomes.slice(
//       startIndex,
//       endIndex
//     );

//   useEffect(() => {
//     if (totalPages === 0) {
//       setCurrentPage(1);
//       return;
//     }

//     if (currentPage > totalPages) {
//       setCurrentPage(totalPages);
//     }
//   }, [totalPages, currentPage]);

//   // =========================================================
//   // SEARCH
//   // =========================================================

//   const handleSearch = (event) => {
//     setSearch(event.target.value);
//     setCurrentPage(1);
//   };

//   // =========================================================
//   // CATEGORY
//   // =========================================================

//   const handleCategory = (value) => {
//     setCategory(value);
//     setCurrentPage(1);
//   };

//   // =========================================================
//   // SORT
//   // =========================================================

//   const handleSort = (event) => {
//     setSortBy(event.target.value);
//     setCurrentPage(1);
//   };

//   // =========================================================
//   // CLEAR FILTERS
//   // =========================================================

//   const clearFilters = () => {
//     setSearch("");
//     setCategory("All");
//     setSortBy("latest");
//     setCurrentPage(1);
//   };

//   // =========================================================
//   // DELETE FROM MONGODB
//   // =========================================================

//   const handleDelete = async (id) => {
//     const home = homes.find(
//       (item) =>
//         Number(item.id) === Number(id)
//     );

//     const confirmed = window.confirm(
//       `Are you sure you want to delete "${
//         home?.title || "this home"
//       }"?`
//     );

//     if (!confirmed) return;

//     try {
//       const response = await fetch(
//         `${API_URL}/${id}`,
//         {
//           method: "DELETE",
//         }
//       );

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           result.message ||
//             "Failed to delete home"
//         );
//       }

//       // Reload from MongoDB
//       await loadHomes();

//       window.dispatchEvent(
//         new Event("homesSpeakingUpdated")
//       );

//       alert("Home deleted successfully.");
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
//   // EDIT
//   // =========================================================

//   const handleEdit = (home) => {
//     navigate("/admin/homes-speaking", {
//       state: {
//         editHome: home,
//       },
//     });
//   };

//   // =========================================================
//   // PAGE CHANGE
//   // =========================================================

//   const goToPage = (page) => {
//     if (
//       page < 1 ||
//       page > totalPages
//     ) {
//       return;
//     }

//     setCurrentPage(page);

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   // =========================================================
//   // PAGINATION
//   // =========================================================

//   const renderPagination = () => {
//     if (totalPages <= 1) {
//       return null;
//     }

//     let pages = [];

//     if (totalPages <= 7) {
//       pages = Array.from(
//         { length: totalPages },
//         (_, index) => index + 1
//       );
//     } else if (currentPage <= 4) {
//       pages = [
//         1,
//         2,
//         3,
//         4,
//         5,
//         "...",
//         totalPages,
//       ];
//     } else if (
//       currentPage >= totalPages - 3
//     ) {
//       pages = [
//         1,
//         "...",
//         totalPages - 4,
//         totalPages - 3,
//         totalPages - 2,
//         totalPages - 1,
//         totalPages,
//       ];
//     } else {
//       pages = [
//         1,
//         "...",
//         currentPage - 1,
//         currentPage,
//         currentPage + 1,
//         "...",
//         totalPages,
//       ];
//     }

//     return (
//       <div className="homes-all-pagination">

//         <button
//           type="button"
//           className="homes-pagination-arrow"
//           disabled={currentPage === 1}
//           onClick={() =>
//             goToPage(currentPage - 1)
//           }
//         >
//           ←
//         </button>

//         {pages.map((page, index) => {
//           if (page === "...") {
//             return (
//               <span
//                 key={`dots-${index}`}
//                 className="homes-pagination-dots"
//               >
//                 ...
//               </span>
//             );
//           }

//           return (
//             <button
//               type="button"
//               key={page}
//               className={
//                 currentPage === page
//                   ? "homes-pagination-number active"
//                   : "homes-pagination-number"
//               }
//               onClick={() =>
//                 goToPage(page)
//               }
//             >
//               {page}
//             </button>
//           );
//         })}

//         <button
//           type="button"
//           className="homes-pagination-arrow"
//           disabled={
//             currentPage === totalPages
//           }
//           onClick={() =>
//             goToPage(currentPage + 1)
//           }
//         >
//           →
//         </button>

//       </div>
//     );
//   };

//   // =========================================================
//   // JSX
//   // =========================================================

//   return (
//     <main className="homes-all-admin-page">

//       <div className="homes-all-admin-container">

//         {/* HEADER */}

//         <header className="homes-all-admin-header">

//           <div className="homes-all-header-left">

//             <button
//               type="button"
//               className="homes-back-button"
//               onClick={() =>
//                 navigate(
//                   "/admin/homes-speaking"
//                 )
//               }
//             >
//               <span>←</span>
//               Back to Homes Speaking
//             </button>

//             <div className="homes-admin-heading-label">
//               <span className="homes-heading-line"></span>
//               HOME MANAGEMENT
//             </div>

//             <h1>
//               All Homes
//             </h1>

//             <p>
//               Browse and manage all Homes Speaking properties.
//             </p>

//           </div>

//         </header>

//         {/* FILTER */}

//         <section className="homes-filter-panel">

//           <div className="homes-filter-top">

//             <div>
//               <h2>
//                 Property Listings
//               </h2>

//               <p>
//                 Browse all Homes Speaking properties
//               </p>
//             </div>

//             <div className="homes-showing-text">
//               Showing{" "}
//               <strong>
//                 {filteredHomes.length}
//               </strong>{" "}
//               properties
//             </div>

//           </div>

//           <div className="homes-filter-controls">

//             {/* SEARCH */}

//             <div className="homes-search-wrapper">

//               <span className="homes-search-icon">
//                 ⌕
//               </span>

//               <input
//                 type="text"
//                 value={search}
//                 onChange={handleSearch}
//                 placeholder="Search by title, author, category..."
//               />

//               {search && (
//                 <button
//                   type="button"
//                   className="homes-search-clear"
//                   onClick={() => {
//                     setSearch("");
//                     setCurrentPage(1);
//                   }}
//                 >
//                   ×
//                 </button>
//               )}

//             </div>

//             {/* CATEGORY */}

//             <select
//               className="homes-filter-select"
//               value={category}
//               onChange={(event) =>
//                 handleCategory(
//                   event.target.value
//                 )
//               }
//             >
//               {categories.map((item) => (
//                 <option
//                   key={item}
//                   value={item}
//                 >
//                   {item === "All"
//                     ? "All Categories"
//                     : item}
//                 </option>
//               ))}
//             </select>

//             {/* SORT */}

//             <select
//               className="homes-filter-select"
//               value={sortBy}
//               onChange={handleSort}
//             >
//               <option value="latest">
//                 Latest First
//               </option>

//               <option value="oldest">
//                 Oldest First
//               </option>

//               <option value="nameAZ">
//                 Name A - Z
//               </option>

//               <option value="nameZA">
//                 Name Z - A
//               </option>
//             </select>

//             {(search ||
//               category !== "All" ||
//               sortBy !== "latest") && (
//               <button
//                 type="button"
//                 className="homes-clear-filter-button"
//                 onClick={clearFilters}
//               >
//                 Clear Filters
//               </button>
//             )}

//           </div>

//         </section>

//         {/* RESULT BAR */}

//         {filteredHomes.length > 0 && (
//           <div className="homes-result-bar">

//             <span>
//               Showing{" "}
//               <strong>
//                 {startIndex + 1}
//               </strong>
//               {" - "}
//               <strong>
//                 {Math.min(
//                   endIndex,
//                   filteredHomes.length
//                 )}
//               </strong>{" "}
//               of{" "}
//               <strong>
//                 {filteredHomes.length}
//               </strong>
//             </span>

//             <span>
//               Page{" "}
//               <strong>
//                 {currentPage}
//               </strong>{" "}
//               of{" "}
//               <strong>
//                 {totalPages}
//               </strong>
//             </span>

//           </div>
//         )}

//         {/* PROPERTY GRID */}

//         {currentHomes.length > 0 ? (

//           <section className="homes-property-grid">

//             {currentHomes.map((home) => {

//               const image =
//                 home.image ||
//                 "/images/home-place-1.jpg";

//               return (
//                 <article
//                   className="homes-property-card"
//                   key={home.id}
//                 >

//                   {/* IMAGE */}

//                   <div className="homes-property-card-image">

//                     <img
//                       src={image}
//                       alt={
//                         home.title ||
//                         "Home"
//                       }
//                       onError={(e) => {
//                         e.currentTarget.src =
//                           "/images/home-place-1.jpg";
//                       }}
//                     />

//                     <div className="homes-image-overlay"></div>

//                     <span className="homes-category-badge">
//                       {home.category ||
//                         "realestate"}
//                     </span>

//                     <span className="homes-id-badge">
//                       ID #{home.id}
//                     </span>

//                   </div>

//                   {/* CONTENT */}

//                   <div className="homes-property-card-content">

//                     <div className="homes-property-category">
//                       {home.category ||
//                         "Real Estate"}
//                     </div>

//                     <h3>
//                       {home.title ||
//                         "Untitled Home"}
//                     </h3>

//                     <p className="homes-property-description">
//                       {home.description ||
//                         "No description available."}
//                     </p>

//                     <div className="homes-property-meta">

//                       <div className="homes-meta-item">

//                         <span>
//                           DATE
//                         </span>

//                         <strong>
//                           {home.date ||
//                             "N/A"}
//                         </strong>

//                       </div>

//                       <div className="homes-meta-item">

//                         <span>
//                           AUTHOR
//                         </span>

//                         <strong>
//                           {home.author ||
//                             "N/A"}
//                         </strong>

//                       </div>

//                     </div>

//                     {/* ACTIONS */}

//                     <div className="homes-card-actions">

//                       <button
//                         type="button"
//                         className="homes-edit-btn"
//                         onClick={() =>
//                           handleEdit(home)
//                         }
//                       >
//                         <span>✎</span>
//                         Edit
//                       </button>

//                       <button
//                         type="button"
//                         className="homes-delete-btn"
//                         onClick={() =>
//                           handleDelete(
//                             home.id
//                           )
//                         }
//                       >
//                         <span>⌫</span>
//                         Delete
//                       </button>

//                     </div>

//                   </div>

//                 </article>
//               );
//             })}

//           </section>

//         ) : (

//           <section className="homes-empty-state">

//             <div className="homes-empty-circle">
//               🏠
//             </div>

//             <h2>
//               No Homes Found
//             </h2>

//             <p>
//               {search ||
//               category !== "All"
//                 ? "No homes match your current search or filters."
//                 : "There are no Homes Speaking properties available yet."}
//             </p>

//             {(search ||
//               category !== "All") && (
//               <button
//                 type="button"
//                 onClick={clearFilters}
//               >
//                 Clear Filters
//               </button>
//             )}

//           </section>
//         )}

//         {/* PAGINATION */}

//         {renderPagination()}

//       </div>

//     </main>
//   );
// };

// export default HomesSpeakingAllAdmin;





import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomesSpeakingAllAdmin.css";

const API_URL = "http://localhost:5000/api/homes-speaking";

const HomesSpeakingAllAdmin = () => {
  const navigate = useNavigate();

  const [homes, setHomes] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 12;

  // =========================================================
  // LOAD HOMES FROM MONGODB
  // =========================================================

  const loadHomes = async () => {
    try {
      const response = await fetch(API_URL);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to load Homes Speaking data"
        );
      }

      if (result.success && Array.isArray(result.data)) {
        setHomes(result.data);
      } else {
        setHomes([]);
      }
    } catch (error) {
      console.error("Homes Speaking loading error:", error);
      setHomes([]);
    }
  };

  useEffect(() => {
    loadHomes();

    const handleHomesUpdated = () => {
      loadHomes();
    };

    window.addEventListener(
      "homesSpeakingUpdated",
      handleHomesUpdated
    );

    window.addEventListener(
      "storage",
      handleHomesUpdated
    );

    return () => {
      window.removeEventListener(
        "homesSpeakingUpdated",
        handleHomesUpdated
      );

      window.removeEventListener(
        "storage",
        handleHomesUpdated
      );
    };
  }, []);

  // =========================================================
  // CATEGORIES
  // =========================================================

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        homes
          .map((home) => home.category)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [homes]);

  // =========================================================
  // SEARCH + FILTER + SORT
  // =========================================================

  const filteredHomes = useMemo(() => {
    let result = [...homes];

    const keyword = search.trim().toLowerCase();

    // SEARCH

    if (keyword) {
      result = result.filter((home) => {
        return (
          home.title
            ?.toLowerCase()
            .includes(keyword) ||
          home.category
            ?.toLowerCase()
            .includes(keyword) ||
          home.author
            ?.toLowerCase()
            .includes(keyword) ||
          home.date
            ?.toLowerCase()
            .includes(keyword) ||
          home.description
            ?.toLowerCase()
            .includes(keyword) ||
          home.detailedDescription
            ?.toLowerCase()
            .includes(keyword) ||
          home.additionalDescription
            ?.toLowerCase()
            .includes(keyword) ||
          home.quote
            ?.toLowerCase()
            .includes(keyword) ||
          (Array.isArray(home.tags)
            ? home.tags.join(" ")
            : String(home.tags || "")
          )
            .toLowerCase()
            .includes(keyword)
        );
      });
    }

    // CATEGORY

    if (category !== "All") {
      result = result.filter(
        (home) => home.category === category
      );
    }

    // SORT

    if (sortBy === "latest") {
      result.sort(
        (a, b) =>
          Number(b.id) - Number(a.id)
      );
    }

    if (sortBy === "oldest") {
      result.sort(
        (a, b) =>
          Number(a.id) - Number(b.id)
      );
    }

    if (sortBy === "nameAZ") {
      result.sort((a, b) =>
        (a.title || "").localeCompare(
          b.title || ""
        )
      );
    }

    if (sortBy === "nameZA") {
      result.sort((a, b) =>
        (b.title || "").localeCompare(
          a.title || ""
        )
      );
    }

    return result;
  }, [
    homes,
    search,
    category,
    sortBy,
  ]);

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages = Math.ceil(
    filteredHomes.length / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const endIndex =
    startIndex + itemsPerPage;

  const currentHomes =
    filteredHomes.slice(
      startIndex,
      endIndex
    );

  useEffect(() => {
    if (totalPages === 0) {
      setCurrentPage(1);
      return;
    }

    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // =========================================================
  // SEARCH
  // =========================================================

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  // =========================================================
  // CATEGORY
  // =========================================================

  const handleCategory = (value) => {
    setCategory(value);
    setCurrentPage(1);
  };

  // =========================================================
  // SORT
  // =========================================================

  const handleSort = (event) => {
    setSortBy(event.target.value);
    setCurrentPage(1);
  };

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setSortBy("latest");
    setCurrentPage(1);
  };

  // =========================================================
  // DELETE FROM MONGODB
  // =========================================================

  const handleDelete = async (id) => {
    const home = homes.find(
      (item) =>
        Number(item.id) === Number(id)
    );

    const confirmed = window.confirm(
      `Are you sure you want to delete "${
        home?.title || "this home"
      }"?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to delete home"
        );
      }

      // Reload from MongoDB
      await loadHomes();

      window.dispatchEvent(
        new Event("homesSpeakingUpdated")
      );

      alert("Home deleted successfully.");
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
  // EDIT
  // =========================================================

  const handleEdit = (home) => {
    navigate("/admin/homes-speaking", {
      state: {
        editHome: home,
      },
    });
  };

  // =========================================================
  // PAGE CHANGE
  // =========================================================

  const goToPage = (page) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // PAGINATION
  // =========================================================

  const renderPagination = () => {
    if (totalPages <= 1) {
      return null;
    }

    let pages = [];

    if (totalPages <= 7) {
      pages = Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
    } else if (currentPage <= 4) {
      pages = [
        1,
        2,
        3,
        4,
        5,
        "...",
        totalPages,
      ];
    } else if (
      currentPage >= totalPages - 3
    ) {
      pages = [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    } else {
      pages = [
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages,
      ];
    }

    return (
      <div className="homes-all-pagination">

        <button
          type="button"
          className="homes-pagination-arrow"
          disabled={currentPage === 1}
          onClick={() =>
            goToPage(currentPage - 1)
          }
        >
          ←
        </button>

        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`dots-${index}`}
                className="homes-pagination-dots"
              >
                ...
              </span>
            );
          }

          return (
            <button
              type="button"
              key={page}
              className={
                currentPage === page
                  ? "homes-pagination-number active"
                  : "homes-pagination-number"
              }
              onClick={() =>
                goToPage(page)
              }
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          className="homes-pagination-arrow"
          disabled={
            currentPage === totalPages
          }
          onClick={() =>
            goToPage(currentPage + 1)
          }
        >
          →
        </button>

      </div>
    );
  };

  // =========================================================
  // JSX
  // =========================================================

  return (
    <main className="homes-all-admin-page">

      <div className="homes-all-admin-container">

        {/* HEADER */}

        <header className="homes-all-admin-header">

          <div className="homes-all-header-left">

            <button
              type="button"
              className="homes-back-button"
              onClick={() =>
                navigate(
                  "/admin/homes-speaking"
                )
              }
            >
              <span>←</span>
              Back to Homes Speaking
            </button>

            <div className="homes-admin-heading-label">
              <span className="homes-heading-line"></span>
              HOME MANAGEMENT
            </div>

            <h1>
              All Homes
            </h1>

            <p>
              Browse and manage all Homes Speaking properties.
            </p>

          </div>

        </header>

        {/* FILTER */}

        <section className="homes-filter-panel">

          <div className="homes-filter-top">

            <div>
              <h2>
                Property Listings
              </h2>

              <p>
                Browse all Homes Speaking properties
              </p>
            </div>

            <div className="homes-showing-text">
              Showing{" "}
              <strong>
                {filteredHomes.length}
              </strong>{" "}
              properties
            </div>

          </div>

          <div className="homes-filter-controls">

            {/* SEARCH */}

            <div className="homes-search-wrapper">

              <span className="homes-search-icon">
                ⌕
              </span>

              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search by title, author, category..."
              />

              {search && (
                <button
                  type="button"
                  className="homes-search-clear"
                  onClick={() => {
                    setSearch("");
                    setCurrentPage(1);
                  }}
                >
                  ×
                </button>
              )}

            </div>

            {/* CATEGORY */}

            <select
              className="homes-filter-select"
              value={category}
              onChange={(event) =>
                handleCategory(
                  event.target.value
                )
              }
            >
              {categories.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item === "All"
                    ? "All Categories"
                    : item}
                </option>
              ))}
            </select>

            {/* SORT */}

            <select
              className="homes-filter-select"
              value={sortBy}
              onChange={handleSort}
            >
              <option value="latest">
                Latest First
              </option>

              <option value="oldest">
                Oldest First
              </option>

              <option value="nameAZ">
                Name A - Z
              </option>

              <option value="nameZA">
                Name Z - A
              </option>
            </select>

            {(search ||
              category !== "All" ||
              sortBy !== "latest") && (
              <button
                type="button"
                className="homes-clear-filter-button"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            )}

          </div>

        </section>

        {/* RESULT BAR */}

        {filteredHomes.length > 0 && (
          <div className="homes-result-bar">

            <span>
              Showing{" "}
              <strong>
                {startIndex + 1}
              </strong>
              {" - "}
              <strong>
                {Math.min(
                  endIndex,
                  filteredHomes.length
                )}
              </strong>{" "}
              of{" "}
              <strong>
                {filteredHomes.length}
              </strong>
            </span>

            <span>
              Page{" "}
              <strong>
                {currentPage}
              </strong>{" "}
              of{" "}
              <strong>
                {totalPages}
              </strong>
            </span>

          </div>
        )}

        {/* PROPERTY GRID */}

        {currentHomes.length > 0 ? (

          <section className="homes-property-grid">

            {currentHomes.map((home) => {

              const image =
                home.image ||
                "/images/home-place-1.jpg";

              return (
                <article
                  className="homes-property-card"
                  key={home.id}
                >

                  {/* IMAGE */}

                  <div className="homes-property-card-image">

                    <img
                      src={image}
                      alt={
                        home.title ||
                        "Home"
                      }
                      onError={(e) => {
                        e.currentTarget.src =
                          "/images/home-place-1.jpg";
                      }}
                    />

                    <div className="homes-image-overlay"></div>

                    <span className="homes-category-badge">
                      {home.category ||
                        "realestate"}
                    </span>

                    <span className="homes-id-badge">
                      ID #{home.id}
                    </span>

                  </div>

                  {/* CONTENT */}

                  <div className="homes-property-card-content">

                    <div className="homes-property-category">
                      {home.category ||
                        "Real Estate"}
                    </div>

                    <h3>
                      {home.title ||
                        "Untitled Home"}
                    </h3>

                    <p className="homes-property-description">
                      {home.description ||
                        "No description available."}
                    </p>

                    <div className="homes-property-meta">

                      <div className="homes-meta-item">

                        <span>
                          DATE
                        </span>

                        <strong>
                          {home.date ||
                            "N/A"}
                        </strong>

                      </div>

                      <div className="homes-meta-item">

                        <span>
                          AUTHOR
                        </span>

                        <strong>
                          {home.author ||
                            "N/A"}
                        </strong>

                      </div>

                      <div className="homes-meta-item">

                        <span>
                          DETAILS
                        </span>

                        <strong>
                          {home.detailedDescription ||
                          home.additionalDescription ||
                          home.quote
                            ? "Available"
                            : "Not Added"}
                        </strong>

                      </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="homes-card-actions">

                      <button
                        type="button"
                        className="homes-edit-btn"
                        onClick={() =>
                          handleEdit(home)
                        }
                      >
                        <span>✎</span>
                        Edit
                      </button>

                      <button
                        type="button"
                        className="homes-delete-btn"
                        onClick={() =>
                          handleDelete(
                            home.id
                          )
                        }
                      >
                        <span>⌫</span>
                        Delete
                      </button>

                    </div>

                  </div>

                </article>
              );
            })}

          </section>

        ) : (

          <section className="homes-empty-state">

            <div className="homes-empty-circle">
              🏠
            </div>

            <h2>
              No Homes Found
            </h2>

            <p>
              {search ||
              category !== "All"
                ? "No homes match your current search or filters."
                : "There are no Homes Speaking properties available yet."}
            </p>

            {(search ||
              category !== "All") && (
              <button
                type="button"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            )}

          </section>
        )}

        {/* PAGINATION */}

        {renderPagination()}

      </div>

    </main>
  );
};

export default HomesSpeakingAllAdmin;