




import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Crown,
  Eye,
  Home,
  PanelLeft,
  Users,
  Mail,
  Image,
  HelpCircle,
  Info,
  Waves,
  Search,
  Bell,
  ChevronRight,
  Menu,
  X,
  LogOut,
  Plus,
  ArrowUpRight,
  Activity,
  ShoppingCart,
  FileCheck,
} from "lucide-react";

import "./Dashboard.css";

const API_BASE = "http://localhost:5000";

const PROPERTY_API = `${API_BASE}/api/properties`;
const LUXURY_API = `${API_BASE}/api/luxurious-properties`;
const PENTHOUSE_API = `${API_BASE}/api/penthouse-properties`;
const SPACIOUS_API = `${API_BASE}/api/spacious-living`;
const USERS_API = `${API_BASE}/api/auth/users`;
const CONTACT_API = `${API_BASE}/api/contact`;

/* =========================================
   AUTH
========================================= */

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

/* =========================================
   RESPONSE HELPERS
========================================= */

const getArray = (result) => {
  if (Array.isArray(result)) {
    return result;
  }

  if (Array.isArray(result?.data)) {
    return result.data;
  }

  if (Array.isArray(result?.properties)) {
    return result.properties;
  }

  return [];
};

/* =========================================
   IMAGE URL
========================================= */

const getImageUrl = (image) => {
  if (!image) return "";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  return image.startsWith("/")
    ? `${API_BASE}${image}`
    : image;
};

/* =========================================
   SIDEBAR MENU
========================================= */

const menuItems = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Hero",
    path: "/admin/hero",
    icon: Image,
  },
  {
    label: "Properties",
    path: "/admin/properties",
    icon: Building2,
  },
  {
    label: "Spacious Living",
    path: "/admin/spacious-living",
    icon: Home,
  },
  {
    label: "Ideal Space",
    path: "/admin/ideal-space",
    icon: PanelLeft,
  },
  {
    label: "Homes Speaking",
    path: "/admin/homes-speaking",
    icon: Home,
  },
  {
    label: "About",
    path: "/admin/about",
    icon: Info,
  },
  {
    label: "FAQ",
    path: "/admin/faq",
    icon: HelpCircle,
  },
  {
    label: "Beachfront",
    path: "/admin/beachfront",
    icon: Waves,
  },
  {
    label: "Contact",
    path: "/admin/contact",
    icon: Mail,
  },
  {
  label: "Orders",
  path: "/admin/orders",
  icon: ShoppingCart,
},

{
  label: "Sub-Admin KYC",
  path: "/admin/sub-admin/kyc",
  icon: FileCheck,
},
];

/* =========================================
   COMPONENT
========================================= */

const AdminDashboard = () => {
  const navigate = useNavigate();

  /* =======================================
     STATES
  ======================================= */

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All Categories");

  const [properties, setProperties] = useState([]);

  const [luxuryProperties, setLuxuryProperties] =
    useState([]);

  const [penthouseProperties, setPenthouseProperties] =
    useState([]);

  const [spaciousProperties, setSpaciousProperties] =
    useState([]);

  const [users, setUsers] = useState([]);

  const [contactCount, setContactCount] = useState(0);

  /* =======================================
     FETCH DASHBOARD DATA
  ======================================= */

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const authHeaders = getAuthHeaders();

        const [
          propertyResponse,
          luxuryResponse,
          penthouseResponse,
          spaciousResponse,
          usersResponse,
          contactResponse,
        ] = await Promise.all([
          fetch(PROPERTY_API),

          fetch(LUXURY_API),

          fetch(PENTHOUSE_API),

          fetch(SPACIOUS_API),

          fetch(USERS_API, {
            headers: {
              ...authHeaders,
            },
          }),

          fetch(CONTACT_API, {
            headers: {
              ...authHeaders,
            },
          }),
        ]);

        /* ===================================
           STANDARD PROPERTIES
        =================================== */

        if (propertyResponse.ok) {
          const result =
            await propertyResponse.json();

          setProperties(getArray(result));
        }

        /* ===================================
           LUXURY PROPERTIES
        =================================== */

        if (luxuryResponse.ok) {
          const result =
            await luxuryResponse.json();

          setLuxuryProperties(getArray(result));
        }

        /* ===================================
           PENTHOUSE
        =================================== */

        if (penthouseResponse.ok) {
          const result =
            await penthouseResponse.json();

          setPenthouseProperties(getArray(result));
        }

        /* ===================================
           SPACIOUS LIVING
        =================================== */

        if (spaciousResponse.ok) {
          const result =
            await spaciousResponse.json();

          const spaciousData = result?.data;

          if (
            Array.isArray(
              spaciousData?.sliderProperties
            )
          ) {
            setSpaciousProperties(
              spaciousData.sliderProperties
            );
          } else {
            setSpaciousProperties([]);
          }
        }

        /* ===================================
           USERS
        =================================== */

        if (usersResponse.ok) {
          const result =
            await usersResponse.json();

          if (result?.success) {
            if (Array.isArray(result.data)) {
              setUsers(result.data);
            } else {
              setUsers([]);
            }
          }
        }

        /* ===================================
           CONTACT
        =================================== */

        if (contactResponse.ok) {
          const result =
            await contactResponse.json();

          if (Array.isArray(result)) {
            setContactCount(result.length);
          } else if (Array.isArray(result?.data)) {
            setContactCount(result.data.length);
          } else if (
            typeof result?.count === "number"
          ) {
            setContactCount(result.count);
          } else {
            setContactCount(0);
          }
        }
      } catch (error) {
        console.error(
          "Dashboard data error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  /* =======================================
     COUNTS
  ======================================= */

  const standardCount = properties.length;

  const luxuryCount =
    luxuryProperties.length;

  const penthouseCount =
    penthouseProperties.length;

  const spaciousCount =
    spaciousProperties.length;

  const totalProperties =
    standardCount +
    luxuryCount +
    penthouseCount +
    spaciousCount;

  const usersCount = users.length;

  /* =======================================
     COMBINE ALL PROPERTIES
  ======================================= */

  const allProperties = useMemo(() => {
    const standard = properties.map(
      (item) => ({
        ...item,
        dashboardType: "Standard",
      })
    );

    const luxury = luxuryProperties.map(
      (item) => ({
        ...item,
        dashboardType: "Luxury",
      })
    );

    const penthouse =
      penthouseProperties.map(
        (item) => ({
          ...item,
          dashboardType: "Penthouse",
        })
      );

    const spacious =
      spaciousProperties.map(
        (item) => ({
          ...item,
          dashboardType:
            "Spacious Living",
        })
      );

    return [
      ...standard,
      ...luxury,
      ...penthouse,
      ...spacious,
    ];
  }, [
    properties,
    luxuryProperties,
    penthouseProperties,
    spaciousProperties,
  ]);

  /* =======================================
     GLOBAL SEARCH
     
     Search works on ALL properties.
     Not limited to recent 5.
  ======================================= */

  const searchResults = useMemo(() => {
    const value = search
      .toLowerCase()
      .trim();

    if (!value) {
      return [];
    }

    return allProperties.filter(
      (property) => {
        const searchableText = [
          property.title,
          property.category,
          property.dashboardType,
          property.type,
          property.size,
          ...(Array.isArray(property.sizes)
            ? property.sizes
            : []),
          property.price,
          property.oldPrice,
          property.description,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(
          value
        );
      }
    );
  }, [search, allProperties]);

  /* =======================================
     RECENT 5 BY CATEGORY
     
     Search empty:
     Show latest 5.
     
     Category selected:
     Show latest 5 of that category.
  ======================================= */

  const recentProperties = useMemo(() => {
    let filtered = [
      ...allProperties,
    ];

    if (
      selectedCategory !==
      "All Categories"
    ) {
      filtered = filtered.filter(
        (property) =>
          property.dashboardType ===
          selectedCategory
      );
    }

    filtered.sort((a, b) => {
      const dateA = new Date(
        a.createdAt || 0
      ).getTime();

      const dateB = new Date(
        b.createdAt || 0
      ).getTime();

      return dateB - dateA;
    });

    return filtered.slice(0, 5);
  }, [
    allProperties,
    selectedCategory,
  ]);

  /* =======================================
     LOGOUT
  ======================================= */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    navigate("/login");
  };

  /* =======================================
     NAVIGATION
  ======================================= */

  const handleNavigation = (path) => {
    navigate(path);

    setSidebarOpen(false);
  };

  /* =======================================
     PROPERTY TYPE
  ======================================= */

  const getPropertyType = (
    property
  ) => {
    if (
      property.dashboardType ===
      "Luxury"
    ) {
      return "luxury";
    }

    if (
      property.dashboardType ===
      "Penthouse"
    ) {
      return "penthouse";
    }

    if (
      property.dashboardType ===
      "Spacious Living"
    ) {
      return "spacious";
    }

    return "property";
  };

  /* =======================================
     EDIT PROPERTY
  ======================================= */

  const handleEditProperty = (property) => {
    const id = property._id || property.id;

    if (!id && property.dashboardType !== "Spacious Living") {
      alert("Property ID not found.");
      return;
    }

    if (property.dashboardType === "Standard") {
      navigate("/admin/properties", {
        state: { editProperty: property },
      });
      return;
    }

    if (property.dashboardType === "Luxury") {
      navigate("/admin/luxury-properties", {
        state: { editProperty: property },
      });
      return;
    }

    if (property.dashboardType === "Penthouse") {
      navigate("/admin/penthouse", {
        state: { editProperty: property },
      });
      return;
    }

    if (property.dashboardType === "Spacious Living") {
      navigate("/admin/spacious-living", {
        state: { editProperty: property },
      });
    }
  };

  /* =======================================
     DELETE PROPERTY
  ======================================= */

  const handleDeleteProperty = async (property) => {
    const id = property._id || property.id;

    if (property.dashboardType === "Spacious Living") {
      alert(
        "Spacious Living properties are embedded slider items. Please delete them from Spacious Living Admin."
      );
      return;
    }

    if (!id) {
      alert("Property ID not found.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete \"${property.title || "this property"}\"?`
    );

    if (!confirmed) return;

    let endpoint = "";

    if (property.dashboardType === "Standard") {
      endpoint = PROPERTY_API;
    } else if (property.dashboardType === "Luxury") {
      endpoint = LUXURY_API;
    } else if (property.dashboardType === "Penthouse") {
      endpoint = PENTHOUSE_API;
    }

    if (!endpoint) return;

    try {
      const response = await fetch(
        `${endpoint}/${encodeURIComponent(String(id))}`,
        {
          method: "DELETE",
          headers: {
            ...getAuthHeaders(),
          },
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Failed to delete property. Please login as admin."
        );
      }

      if (property.dashboardType === "Standard") {
        setProperties((previous) =>
          previous.filter(
            (item) => String(item._id || item.id) !== String(id)
          )
        );
      }

      if (property.dashboardType === "Luxury") {
        setLuxuryProperties((previous) =>
          previous.filter(
            (item) => String(item._id || item.id) !== String(id)
          )
        );
      }

      if (property.dashboardType === "Penthouse") {
        setPenthouseProperties((previous) =>
          previous.filter(
            (item) => String(item._id || item.id) !== String(id)
          )
        );
      }

      alert("Property deleted successfully.");
    } catch (error) {
      console.error("Dashboard DELETE Error:", error);
      alert(error.message || "Failed to delete property.");
    }
  };

  /* =======================================
     PROPERTY DETAIL
  ======================================= */

  const handleViewProperty = (
    property
  ) => {
    const id =
      property._id ||
      property.id;

    if (!id) return;

    const type =
      getPropertyType(property);

    navigate(
      `/property-details?id=${id}&type=${type}`
    );
  };

  /* =======================================
     RENDER
  ======================================= */

  return (
    <div className="admin-dashboard">

      {/* =====================================
          MOBILE SIDEBAR OVERLAY
      ===================================== */}

      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* =====================================
          SIDEBAR
      ===================================== */}

      <aside
        className={`admin-sidebar ${
          sidebarOpen
            ? "admin-sidebar-open"
            : ""
        }`}
      >

        <div className="admin-sidebar-top">

          <div className="admin-logo">

            <div className="admin-logo-icon">
              SL
            </div>

            <div>
              <h2>
                Spacious Living
              </h2>

              <span>
                Admin Panel
              </span>
            </div>

          </div>

          <button
            className="admin-mobile-close"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <X size={20} />
          </button>

        </div>

        <div className="admin-menu-title">
          MAIN MENU
        </div>

        <nav className="admin-sidebar-menu">

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                className={
                  window.location.pathname ===
                  item.path
                    ? "admin-menu-item active"
                    : "admin-menu-item"
                }
                onClick={() =>
                  handleNavigation(
                    item.path
                  )
                }
              >

                <Icon size={18} />

                <span>
                  {item.label}
                </span>

              </button>
            );
          })}

        </nav>

        <div className="admin-sidebar-bottom">

          <button
            className="admin-logout-btn"
            onClick={handleLogout}
          >

            <LogOut size={18} />

            <span>
              Logout
            </span>

          </button>

        </div>

      </aside>

      {/* =====================================
          MAIN
      ===================================== */}

      <main className="admin-main">

        {/* ===================================
            HEADER
        =================================== */}

        <header className="admin-header">

          <div className="admin-header-left">

            <button
              className="admin-mobile-menu"
              onClick={() =>
                setSidebarOpen(true)
              }
            >
              <Menu size={22} />
            </button>

            <div>

              <h1>
                Dashboard
              </h1>

              <p>
                Welcome back, Admin
              </p>

            </div>

          </div>

          <div className="admin-header-right">

            {/* SEARCH */}

            <div className="admin-search">

              <Search size={17} />

              <input
                type="text"
                placeholder="Search properties..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

              {search && (
                <button
                  type="button"
                  className="admin-search-clear"
                  onClick={() =>
                    setSearch("")
                  }
                >
                  <X size={14} />
                </button>
              )}

            </div>

            {/* NOTIFICATION */}

            <button className="admin-notification">

              <Bell size={19} />

              <span></span>

            </button>

            {/* PROFILE */}

            <div className="admin-profile">

              <div className="admin-profile-avatar">
                A
              </div>

              <div className="admin-profile-info">

                <strong>
                  Administrator
                </strong>

                <small>
                  Admin
                </small>

              </div>

            </div>

          </div>

        </header>

        {/* ===================================
            CONTENT
        =================================== */}

        <div className="admin-content">

          {/* =================================
              PAGE HEADING
          ================================= */}

          <div className="admin-page-heading">

            <div>

              <h2>
                Overview
              </h2>

              <p>
                Monitor your property
                website performance
                and activity.
              </p>

            </div>

            {/* <button
              className="admin-primary-btn"
              onClick={() =>
                navigate(
                  "/admin/properties"
                )
              }
            >

              <Plus size={18} />

              Add Property

            </button> */}

          </div>

          {/* =================================
              STATISTICS
          ================================= */}

          <section className="admin-stat-grid">

            {/* TOTAL */}

            <div className="admin-stat-card">

              <div className="admin-stat-top">

                <div className="admin-stat-icon blue">
                  <Building2 size={21} />
                </div>

                <span className="admin-stat-label">
                  Total Properties
                </span>

              </div>

              <div className="admin-stat-number">
                {loading
                  ? "..."
                  : totalProperties}
              </div>

              <div className="admin-stat-footer">

                <span>
                  All property sections
                </span>

                <ArrowUpRight
                  size={15}
                />

              </div>

            </div>

            {/* USERS */}

            <div className="admin-stat-card">

              <div className="admin-stat-top">

                <div className="admin-stat-icon green">
                  <Users size={21} />
                </div>

                <span className="admin-stat-label">
                  Registered Users
                </span>

              </div>

              <div className="admin-stat-number">
                {loading
                  ? "..."
                  : usersCount}
              </div>

              <div className="admin-stat-footer">

                <span>
                  MongoDB users
                </span>

                <ArrowUpRight
                  size={15}
                />

              </div>

            </div>

            {/* LUXURY */}

            <div className="admin-stat-card">

              <div className="admin-stat-top">

                <div className="admin-stat-icon purple">
                  <Crown size={21} />
                </div>

                <span className="admin-stat-label">
                  Luxury Properties
                </span>

              </div>

              <div className="admin-stat-number">
                {loading
                  ? "..."
                  : luxuryCount}
              </div>

              <div className="admin-stat-footer">

                <span>
                  Luxury collection
                </span>

                <ArrowUpRight
                  size={15}
                />

              </div>

            </div>

            {/* CONTACT */}

            <div className="admin-stat-card">

              <div className="admin-stat-top">

                <div className="admin-stat-icon orange">
                  <Mail size={21} />
                </div>

                <span className="admin-stat-label">
                  Contact Messages
                </span>

              </div>

              <div className="admin-stat-number">
                {loading
                  ? "..."
                  : contactCount}
              </div>

              <div className="admin-stat-footer">

                <span>
                  Customer enquiries
                </span>

                <ArrowUpRight
                  size={15}
                />

              </div>

            </div>

          </section>

          {/* =================================
              SEARCH RESULTS
              
              Only visible when searching
          ================================= */}

          {search.trim() && (
            <section className="admin-panel search-results-panel">

              <div className="admin-panel-header">

                <div>

                  <h3>
                    Search Results
                  </h3>

                  <p>
                    Results for "{search}"
                  </p>

                </div>

                <span className="search-result-count">
                  {searchResults.length} found
                </span>

              </div>

              <div className="search-results-list">

                {loading ? (
                  <div className="search-empty">
                    Searching properties...
                  </div>
                ) : searchResults.length ===
                  0 ? (
                  <div className="search-empty">

                    <Search size={28} />

                    <strong>
                      No property found
                    </strong>

                    <span>
                      No property matches
                      "{search}"
                    </span>

                  </div>
                ) : (
                  searchResults.map(
                    (
                      property,
                      index
                    ) => {

                      const image =
                        property.mainImage ||
                        property.image ||
                        property.sliderImages?.[0] ||
                        property.subImages?.[0];

                      return (
                        <div
                          className="search-result-item"
                          key={
                            property._id ||
                            property.id ||
                            index
                          }
                        >

                          <div className="search-result-image">

                            {image ? (
                              <img
                                src={getImageUrl(
                                  image
                                )}
                                alt={
                                  property.title ||
                                  "Property"
                                }
                              />
                            ) : (
                              <Building2
                                size={20}
                              />
                            )}

                          </div>

                          <div className="search-result-info">

                            <strong>
                              {property.title ||
                                "Untitled Property"}
                            </strong>

                            <span>
                              {property.category ||
                                property.dashboardType ||
                                "Property"}
                            </span>

                            <small>
                              {property.size ||
                                property.sizes?.[0] ||
                                "Size not available"}
                            </small>

                          </div>

                          <div className="search-result-type">

                            <span className="type-badge">
                              {
                                property.dashboardType
                              }
                            </span>

                          </div>

                          <div className="search-result-price">
                            {property.price ||
                              "—"}
                          </div>

                          <div className="search-result-actions">

                            <button
                              type="button"
                              className="dashboard-edit-btn"
                              onClick={() =>
                                handleEditProperty(property)
                              }
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="dashboard-delete-btn"
                              onClick={() =>
                                handleDeleteProperty(property)
                              }
                            >
                              Delete
                            </button>

                            <button
                              type="button"
                              className="search-view-btn"
                              onClick={() =>
                                handleViewProperty(property)
                              }
                            >
                              View
                              <ArrowUpRight size={15} />
                            </button>

                          </div>

                        </div>
                      );
                    }
                  )
                )}

              </div>

            </section>
          )}

          {/* =================================
              PROPERTY OVERVIEW + QUICK ACTIONS
          ================================= */}

          <section className="admin-dashboard-grid">

            {/* PROPERTY OVERVIEW */}

            <div className="admin-panel property-overview">

              <div className="admin-panel-header">

                <div>

                  <h3>
                    Property Overview
                  </h3>

                  <p>
                    Properties by section
                  </p>

                </div>

                <Activity size={19} />

              </div>

              <div className="property-chart">

                <div className="chart-total">

                  <strong>
                    {totalProperties}
                  </strong>

                  <span>
                    Total
                  </span>

                </div>

                <div className="chart-bars">

                  {/* STANDARD */}

                  <div className="chart-row">

                    <div className="chart-label">

                      <span>
                        Standard
                      </span>

                      <strong>
                        {standardCount}
                      </strong>

                    </div>

                    <div className="chart-bar-bg">

                      <div
                        className="chart-bar standard"
                        style={{
                          width: `${
                            totalProperties
                              ? (standardCount /
                                  totalProperties) *
                                100
                              : 0
                          }%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* LUXURY */}

                  <div className="chart-row">

                    <div className="chart-label">

                      <span>
                        Luxury
                      </span>

                      <strong>
                        {luxuryCount}
                      </strong>

                    </div>

                    <div className="chart-bar-bg">

                      <div
                        className="chart-bar luxury"
                        style={{
                          width: `${
                            totalProperties
                              ? (luxuryCount /
                                  totalProperties) *
                                100
                              : 0
                          }%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* PENTHOUSE */}

                  <div className="chart-row">

                    <div className="chart-label">

                      <span>
                        Penthouse
                      </span>

                      <strong>
                        {penthouseCount}
                      </strong>

                    </div>

                    <div className="chart-bar-bg">

                      <div
                        className="chart-bar penthouse"
                        style={{
                          width: `${
                            totalProperties
                              ? (penthouseCount /
                                  totalProperties) *
                                100
                              : 0
                          }%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* SPACIOUS */}

                  <div className="chart-row">

                    <div className="chart-label">

                      <span>
                        Spacious Living
                      </span>

                      <strong>
                        {spaciousCount}
                      </strong>

                    </div>

                    <div className="chart-bar-bg">

                      <div
                        className="chart-bar spacious"
                        style={{
                          width: `${
                            totalProperties
                              ? (spaciousCount /
                                  totalProperties) *
                                100
                              : 0
                          }%`,
                        }}
                      />

                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* QUICK ACTIONS */}

            <div className="admin-panel quick-actions">

              <div className="admin-panel-header">

                <div>

                  <h3>
                    Quick Actions
                  </h3>

                  <p>
                    Manage your website
                  </p>

                </div>

              </div>

              <div className="quick-action-list">

                <button
                  onClick={() =>
                    navigate(
                      "/admin/properties"
                    )
                  }
                >

                  <Building2 size={18} />

                  <span>
                    Manage Properties
                  </span>

                  <ChevronRight size={17} />

                </button>

                <button
                  onClick={() =>
                    navigate(
                      "/admin/luxury-properties"
                    )
                  }
                >

                  <Crown size={18} />

                  <span>
                    Luxury Properties
                  </span>

                  <ChevronRight size={17} />

                </button>

                <button
                  onClick={() =>
                    navigate(
                      "/admin/penthouse"
                    )
                  }
                >

                  <Home size={18} />

                  <span>
                    Manage Penthouse
                  </span>

                  <ChevronRight size={17} />

                </button>

                <button
                  onClick={() =>
                    navigate(
                      "/admin/contact"
                    )
                  }
                >

                  <Mail size={18} />

                  <span>
                    View Messages
                  </span>

                  <ChevronRight size={17} />

                </button>

              </div>

            </div>

          </section>

          {/* =================================
              RECENT PROPERTIES
          ================================= */}

          <section className="admin-panel recent-properties">

            <div className="admin-panel-header">

              <div>

                <h3>
                  Recent Properties
                </h3>

                <p>
                  Latest 5 properties by category
                </p>

              </div>

              <div className="recent-property-controls">

                <select
                  value={selectedCategory}
                  onChange={(e) =>
                    setSelectedCategory(
                      e.target.value
                    )
                  }
                  className="property-category-select"
                >

                  <option value="All Categories">
                    All Categories
                  </option>

                  <option value="Standard">
                    Standard Properties
                  </option>

                  <option value="Luxury">
                    Luxury Properties
                  </option>

                  <option value="Penthouse">
                    Penthouse
                  </option>

                  <option value="Spacious Living">
                    Spacious Living
                  </option>

                </select>

                <button
                  className="view-all-btn"
                  onClick={() =>
                    navigate(
                      "/admin/properties"
                    )
                  }
                >

                  View All

                  <ChevronRight size={16} />

                </button>

              </div>

            </div>

            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>

                  <tr>

                    <th>
                      Property
                    </th>

                    <th>
                      Category
                    </th>

                    <th>
                      Type
                    </th>

                    <th>
                      Price
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {loading ? (
                    <tr>

                      <td
                        colSpan="6"
                        className="empty-table"
                      >
                        Loading properties...
                      </td>

                    </tr>
                  ) : recentProperties.length ===
                    0 ? (
                    <tr>

                      <td
                        colSpan="6"
                        className="empty-table"
                      >
                        No properties found
                      </td>

                    </tr>
                  ) : (
                    recentProperties.map(
                      (
                        property,
                        index
                      ) => {

                        const image =
                          property.mainImage ||
                          property.image ||
                          property.sliderImages?.[0] ||
                          property.subImages?.[0];

                        return (
                          <tr
                            key={
                              property._id ||
                              property.id ||
                              index
                            }
                          >

                            <td>

                              <div className="property-table-name">

                                <div className="property-table-image">

                                  {image ? (
                                    <img
                                      src={getImageUrl(
                                        image
                                      )}
                                      alt={
                                        property.title ||
                                        "Property"
                                      }
                                    />
                                  ) : (
                                    <Building2
                                      size={18}
                                    />
                                  )}

                                </div>

                                <div>

                                  <strong>
                                    {property.title ||
                                      "Untitled Property"}
                                  </strong>

                                  <small>
                                    {property.size ||
                                      property.sizes?.[0] ||
                                      "Property"}
                                  </small>

                                </div>

                              </div>

                            </td>

                            <td>
                              {property.category ||
                                "—"}
                            </td>

                            <td>

                              <span className="type-badge">
                                {
                                  property.dashboardType
                                }
                              </span>

                            </td>

                            <td>
                              {property.price ||
                                "—"}
                            </td>

                            <td>

                              <div className="property-actions-buttons">

                                <button
                                  type="button"
                                  className="property-view-btn"
                                  onClick={() =>
                                    handleViewProperty(property)
                                  }
                                  title="View property details"
                                  aria-label="View property details"
                                >
                                  <Eye size={13} />
                                  View
                                </button>

                                <button
                                  type="button"
                                  className="property-edit-btn"
                                  onClick={() =>
                                    handleEditProperty(property)
                                  }
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  className="property-delete-btn"
                                  onClick={() =>
                                    handleDeleteProperty(property)
                                  }
                                >
                                  Delete
                                </button>

                              </div>

                            </td>

                          </tr>
                        );
                      }
                    )
                  )}

                </tbody>

              </table>

            </div>

          </section>

          {/* =================================
              USERS + BREAKDOWN
          ================================= */}

          <section className="admin-bottom-grid">

            {/* RECENT USERS */}

            <div className="admin-panel">

              <div className="admin-panel-header">

                <div>

                  <h3>
                    Recent Users
                  </h3>

                  <p>
                    Latest registered users
                  </p>

                </div>

                <button
                  className="view-all-btn"
                  onClick={() =>
                    navigate(
                      "/admin/dashboard"
                    )
                  }
                >
                  {usersCount} Users
                </button>

              </div>

              <div className="user-list">

                {users.length === 0 ? (
                  <div className="empty-state">
                    No registered users found
                  </div>
                ) : (
                  users
                    .slice(0, 5)
                    .map(
                      (
                        user,
                        index
                      ) => (
                        <div
                          className="user-row"
                          key={
                            user._id ||
                            index
                          }
                        >

                          <div className="user-avatar">

                            {(
                              user.firstName ||
                              user.name ||
                              "U"
                            )
                              .charAt(0)
                              .toUpperCase()}

                          </div>

                          <div className="user-info">

                            <strong>
                              {user.name ||
                                `${user.firstName || ""} ${
                                  user.lastName || ""
                                }`.trim() ||
                                "User"}
                            </strong>

                            <span>
                              {user.email ||
                                "No email"}
                            </span>

                          </div>

                          <span className="user-role">
                            {user.role ||
                              "customer"}
                          </span>

                        </div>
                      )
                    )
                )}

              </div>

            </div>

            {/* PROPERTY BREAKDOWN */}

            <div className="admin-panel">

              <div className="admin-panel-header">

                <div>

                  <h3>
                    Property Breakdown
                  </h3>

                  <p>
                    Current inventory
                  </p>

                </div>

              </div>

              <div className="breakdown-list">

                {/* STANDARD */}

                <div className="breakdown-item">

                  <div className="breakdown-icon standard">
                    <Building2 size={18} />
                  </div>

                  <div className="breakdown-info">

                    <span>
                      Standard Properties
                    </span>

                    <strong>
                      {standardCount}
                    </strong>

                  </div>

                  <span>
                    {totalProperties
                      ? Math.round(
                          (standardCount /
                            totalProperties) *
                            100
                        )
                      : 0}
                    %
                  </span>

                </div>

                {/* LUXURY */}

                <div className="breakdown-item">

                  <div className="breakdown-icon luxury">
                    <Crown size={18} />
                  </div>

                  <div className="breakdown-info">

                    <span>
                      Luxury Properties
                    </span>

                    <strong>
                      {luxuryCount}
                    </strong>

                  </div>

                  <span>
                    {totalProperties
                      ? Math.round(
                          (luxuryCount /
                            totalProperties) *
                            100
                        )
                      : 0}
                    %
                  </span>

                </div>

                {/* PENTHOUSE */}

                <div className="breakdown-item">

                  <div className="breakdown-icon penthouse">
                    <Home size={18} />
                  </div>

                  <div className="breakdown-info">

                    <span>
                      Penthouse
                    </span>

                    <strong>
                      {penthouseCount}
                    </strong>

                  </div>

                  <span>
                    {totalProperties
                      ? Math.round(
                          (penthouseCount /
                            totalProperties) *
                            100
                        )
                      : 0}
                    %
                  </span>

                </div>

                {/* SPACIOUS */}

                <div className="breakdown-item">

                  <div className="breakdown-icon spacious">
                    <Building2 size={18} />
                  </div>

                  <div className="breakdown-info">

                    <span>
                      Spacious Living
                    </span>

                    <strong>
                      {spaciousCount}
                    </strong>

                  </div>

                  <span>
                    {totalProperties
                      ? Math.round(
                          (spaciousCount /
                            totalProperties) *
                            100
                        )
                      : 0}
                    %
                  </span>

                </div>

              </div>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
};

export default AdminDashboard;