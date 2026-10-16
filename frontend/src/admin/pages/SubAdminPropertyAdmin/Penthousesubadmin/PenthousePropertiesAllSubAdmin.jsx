import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import "./PenthousesuballAdmin.css";

const API_URL =
  "http://localhost:5000/api/penthouse-properties";

const ITEMS_PER_PAGE = 12;

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

const PenthousePropertiesAllSubAdmin = () => {
  const navigate = useNavigate();

  const [properties, setProperties] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [deletingId, setDeletingId] =
    useState(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [viewProperty, setViewProperty] =
    useState(null);

  const [viewImageIndex, setViewImageIndex] =
    useState(0);

  // ==========================================
  // FETCH MY PROPERTIES
  // ==========================================
  const loadProperties = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/my`,
        {
          headers: getAuthHeaders(),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Failed to load properties."
        );
      }

      const data = Array.isArray(result)
        ? result
        : Array.isArray(
            result?.properties
          )
        ? result.properties
        : Array.isArray(result?.data)
        ? result.data
        : [];

      setProperties(data);
    } catch (error) {
      console.error(
        "Penthouse SubAdmin GET Error:",
        error
      );

      setProperties([]);

      alert(
        error.message ||
          "Failed to load properties."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  // ==========================================
  // PAGINATION
  // ==========================================
  const totalPages = Math.max(
    1,
    Math.ceil(
      properties.length /
        ITEMS_PER_PAGE
    )
  );

  useEffect(() => {
    if (
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }
  }, [
    currentPage,
    totalPages,
  ]);

  const startIndex =
    (currentPage - 1) *
    ITEMS_PER_PAGE;

  const endIndex =
    startIndex + ITEMS_PER_PAGE;

  const currentProperties =
    useMemo(
      () =>
        properties.slice(
          startIndex,
          endIndex
        ),
      [
        properties,
        startIndex,
        endIndex,
      ]
    );

  // ==========================================
  // PAGINATION UI
  // ==========================================
  const renderPagination = () => {
    if (totalPages <= 1) {
      return null;
    }

    let pages = [];

    if (totalPages <= 7) {
      pages = Array.from(
        {
          length: totalPages,
        },
        (_, index) => index + 1
      );
    } else if (
      currentPage <= 4
    ) {
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
      currentPage >=
      totalPages - 3
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
      <div className="lux-pagination">

        <button
          type="button"
          className="lux-pagination-arrow"
          disabled={
            currentPage === 1
          }
          onClick={() =>
            setCurrentPage(
              (page) =>
                Math.max(
                  1,
                  page - 1
                )
            )
          }
        >
          ←
        </button>

        {pages.map(
          (page, index) =>
            page === "..." ? (
              <span
                key={`dots-${index}`}
                className="lux-pagination-dots"
              >
                ...
              </span>
            ) : (
              <button
                type="button"
                key={page}
                className={
                  currentPage === page
                    ? "lux-pagination-number active"
                    : "lux-pagination-number"
                }
                onClick={() =>
                  setCurrentPage(
                    page
                  )
                }
              >
                {page}
              </button>
            )
        )}

        <button
          type="button"
          className="lux-pagination-arrow"
          disabled={
            currentPage ===
            totalPages
          }
          onClick={() =>
            setCurrentPage(
              (page) =>
                Math.min(
                  totalPages,
                  page + 1
                )
            )
          }
        >
          →
        </button>

      </div>
    );
  };

  // ==========================================
  // VIEW
  // ==========================================
  const openView = (property) => {
    setViewProperty(property);
    setViewImageIndex(0);
  };

  const closeView = () => {
    setViewProperty(null);
    setViewImageIndex(0);
  };

  const getImages = (property) => {
    if (!property) return [];

    if (
      Array.isArray(
        property.images
      ) &&
      property.images.length
    ) {
      return property.images.slice(
        0,
        4
      );
    }

    if (property.image) {
      return [property.image];
    }

    return [];
  };

  const viewImages =
    getImages(viewProperty);

  // ==========================================
  // EDIT
  // ==========================================
  const handleEdit = (
    property
  ) => {
    navigate(
      "/sub-admin/penthouse-properties",
      {
        state: {
          editProperty:
            property,
        },
      }
    );
  };

  // ==========================================
  // DELETE
  // ==========================================
  const handleDelete =
    async (id) => {
      if (
        id === undefined ||
        id === null
      ) {
        alert(
          "Property ID not found."
        );
        return;
      }

      const property =
        properties.find(
          (item) =>
            String(
              item.id ??
                item._id
            ) ===
            String(id)
        );

      const confirmed =
        window.confirm(
          `Are you sure you want to delete "${
            property?.title ||
            "this property"
          }"?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setDeletingId(id);

        const response =
          await fetch(
            `${API_URL}/${encodeURIComponent(
              String(id)
            )}`,
            {
              method: "DELETE",
              headers:
                getAuthHeaders(),
            }
          );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Failed to delete property."
          );
        }

        setProperties(
          (previous) =>
            previous.filter(
              (item) =>
                String(
                  item.id ??
                    item._id
                ) !==
                String(id)
            )
        );

        if (
          viewProperty &&
          String(
            viewProperty.id ??
              viewProperty._id
          ) === String(id)
        ) {
          closeView();
        }

        alert(
          "Property deleted successfully."
        );
      } catch (error) {
        console.error(
          "Penthouse SubAdmin DELETE Error:",
          error
        );

        alert(
          error.message ||
            "Failed to delete property."
        );
      } finally {
        setDeletingId(null);
      }
    };

  // ==========================================
  // MAIN IMAGE
  // ==========================================
  const getMainImage = (
    property
  ) =>
    property?.image ||
    property?.images?.[0] ||
    "/images/feature-house1.jpg";

  return (
    <main className="lux-all-admin-page">

      <div className="lux-all-admin-container">

        {/* HEADER */}
        <header className="lux-all-admin-header">

          <div>

            <button
              type="button"
              className="lux-back-button"
              onClick={() =>
                navigate(
                  "/sub-admin/penthouse-properties"
                )
              }
            >
              ← Back to Add Property
            </button>

            <h1>
              All Penthouse Properties
            </h1>

            <p>
              {properties.length}{" "}
              properties total
            </p>

          </div>

          <button
            type="button"
            className="lux-add-header-button"
            onClick={() =>
              navigate(
                "/sub-admin/penthouse-properties"
              )
            }
          >
            + Add Property
          </button>

        </header>

        {/* LOADING */}
        {loading ? (
          <section className="lux-empty-state">
            <h2>
              Loading properties...
            </h2>
          </section>
        ) : currentProperties.length >
          0 ? (
          <>
            {/* RESULT BAR */}
            <div className="lux-result-bar">

              <span>
                Showing{" "}
                <strong>
                  {startIndex + 1}
                </strong>
                –
                <strong>
                  {Math.min(
                    endIndex,
                    properties.length
                  )}
                </strong>{" "}
                of{" "}
                <strong>
                  {properties.length}
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

            {/* GRID */}
            <section className="lux-property-grid">

              {currentProperties.map(
                (property) => {
                  const id =
                    property.id ??
                    property._id;

                  const image =
                    getMainImage(
                      property
                    );

                  return (
                    <article
                      className="lux-property-card"
                      key={id}
                    >

                      <div className="lux-property-card-image">

                        <img
                          src={image}
                          alt={
                            property.title ||
                            "Penthouse"
                          }
                        />

                        <span className="lux-id-badge">
                          ID #{id}
                        </span>

                      </div>

                      <div className="lux-property-card-content">

                        <div className="lux-property-category">
                          {property.category ||
                            "Penthouse"}
                        </div>

                        <h3>
                          {property.title ||
                            "Untitled Property"}
                        </h3>

                        <div className="lux-property-meta">

                          <div className="lux-meta-item">
                            <span>
                              SIZE
                            </span>

                            <strong>
                              {property.size ||
                                "N/A"}
                            </strong>
                          </div>

                          <div className="lux-meta-item">
                            <span>
                              CATEGORY
                            </span>

                            <strong>
                              {property.category ||
                                "Penthouse"}
                            </strong>
                          </div>

                        </div>

                        <div className="lux-property-price-section">

                          <div>
                            <span>
                              PRICE
                            </span>

                            <strong>
                              {property.price ||
                                "N/A"}
                            </strong>
                          </div>

                          {property.oldPrice && (
                            <del>
                              {
                                property.oldPrice
                              }
                            </del>
                          )}

                        </div>

                        <div className="lux-card-actions">

                          <button
                            type="button"
                            className="lux-view-btn"
                            onClick={() =>
                              openView(
                                property
                              )
                            }
                          >
                            View
                          </button>

                          <button
                            type="button"
                            className="lux-edit-btn"
                            disabled={
                              deletingId !==
                              null
                            }
                            onClick={() =>
                              handleEdit(
                                property
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="lux-delete-btn"
                            disabled={
                              deletingId !==
                              null
                            }
                            onClick={() =>
                              handleDelete(
                                id
                              )
                            }
                          >
                            {deletingId ===
                            id
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        </div>

                      </div>

                    </article>
                  );
                }
              )}

            </section>

            {renderPagination()}
          </>
        ) : (
          <section className="lux-empty-state">

            <h2>
              No Penthouse Properties Found
            </h2>

            <p>
              You have not added any
              penthouse properties yet.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/sub-admin/penthouse-properties"
                )
              }
            >
              + Add First Property
            </button>

          </section>
        )}

      </div>

      {/* VIEW MODAL */}
      {viewProperty && (
        <div
          className="lux-view-overlay"
          onClick={closeView}
        >

          <div
            className="lux-view-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="lux-view-close"
              onClick={closeView}
            >
              ×
            </button>

            {/* GALLERY */}
            <div className="lux-view-gallery">

              {viewImages.length >
              0 ? (
                <img
                  src={
                    viewImages[
                      viewImageIndex
                    ]
                  }
                  alt={
                    viewProperty.title
                  }
                  className="lux-view-main-image"
                />
              ) : (
                <div className="lux-view-no-image">
                  No Image
                </div>
              )}

              {viewImages.length >
                1 && (
                <div className="lux-view-thumbnails">

                  {viewImages.map(
                    (
                      image,
                      index
                    ) => (
                      <button
                        type="button"
                        key={`${image}-${index}`}
                        className={
                          viewImageIndex ===
                          index
                            ? "lux-view-thumb active"
                            : "lux-view-thumb"
                        }
                        onClick={() =>
                          setViewImageIndex(
                            index
                          )
                        }
                      >
                        <img
                          src={image}
                          alt={`View ${
                            index + 1
                          }`}
                        />
                      </button>
                    )
                  )}

                </div>
              )}

            </div>

            {/* DETAILS */}
            <div className="lux-view-details">

              <span className="lux-view-category">
                {viewProperty.category ||
                  "Penthouse"}
              </span>

              <h2>
                {viewProperty.title}
              </h2>

              <div className="lux-view-row">

                <span>
                  Size
                </span>

                <strong>
                  {viewProperty.size ||
                    "N/A"}
                </strong>

              </div>

              {viewProperty.sizes?.length >
                0 && (
                <div className="lux-view-row">

                  <span>
                    Available Sizes
                  </span>

                  <strong>
                    {viewProperty.sizes.join(
                      ", "
                    )}
                  </strong>

                </div>
              )}

              <div className="lux-view-row">

                <span>
                  Price
                </span>

                <strong>
                  {viewProperty.price}

                  {viewProperty.oldPrice && (
                    <>
                      {" "}
                      <del>
                        {
                          viewProperty.oldPrice
                        }
                      </del>
                    </>
                  )}
                </strong>

              </div>

              {viewProperty.description && (
                <div className="lux-view-description">

                  <span>
                    Description
                  </span>

                  <p>
                    {
                      viewProperty.description
                    }
                  </p>

                </div>
              )}

              <div className="lux-view-actions">

                <button
                  type="button"
                  className="lux-edit-btn"
                  onClick={() => {
                    closeView();
                    handleEdit(
                      viewProperty
                    );
                  }}
                >
                  Edit Property
                </button>

                <button
                  type="button"
                  className="lux-delete-btn"
                  onClick={() => {
                    const id =
                      viewProperty.id ??
                      viewProperty._id;

                    handleDelete(id);
                  }}
                >
                  Delete Property
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </main>
  );
};

export default PenthousePropertiesAllSubAdmin;