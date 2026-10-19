


import React, {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import "./PropertyAdmin.css";

const API_URL =
  "http://localhost:5000/api/properties";

const SERVER_URL =
  "http://localhost:5000";

const ITEMS_PER_PAGE = 12;

// ------------------------------------------------
// AUTH HEADER
// ------------------------------------------------

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

// ------------------------------------------------
// COMPONENT
// ------------------------------------------------

const PropertyAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ------------------------------------------------
  // STATES
  // ------------------------------------------------

  const [properties, setProperties] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  // ------------------------------------------------
  // FORM
  // ------------------------------------------------

  const [title, setTitle] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [size, setSize] =
    useState("");

  const [sizes, setSizes] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [oldPrice, setOldPrice] =
    useState("");

  const [description, setDescription] =
    useState("");

  // ------------------------------------------------
  // AVAILABILITY
  // ------------------------------------------------

  const [totalUnits, setTotalUnits] =
    useState(1);

  const [availableUnits, setAvailableUnits] =
    useState(1);

  const [bookedUnits, setBookedUnits] =
    useState(0);

  // ------------------------------------------------
  // IMAGES
  // ------------------------------------------------

  const [mainImageFile, setMainImageFile] =
    useState(null);

  const [mainImagePreview, setMainImagePreview] =
    useState("");

  const [subImageFiles, setSubImageFiles] =
    useState([]);

  const [subImagePreviews, setSubImagePreviews] =
    useState([]);

  // ------------------------------------------------
  // PAGINATION
  // ------------------------------------------------

  const [currentPage, setCurrentPage] =
    useState(1);

  // ------------------------------------------------
  // IMAGE URL
  // ------------------------------------------------

  const getImageUrl = (image) => {
    if (!image) {
      return "";
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    if (image.startsWith("/")) {
      return `${SERVER_URL}${image}`;
    }

    return `${SERVER_URL}/${image}`;
  };

  // ------------------------------------------------
  // FETCH
  // ------------------------------------------------

  const fetchProperties = async () => {
    try {
      setLoading(true);

      const response =
        await fetch(API_URL, {
          method: "GET",
          headers: {
            ...getAuthHeaders(),
          },
        });

      if (!response.ok) {
        throw new Error(
          "Failed to fetch properties"
        );
      }

      const data =
        await response.json();

      const propertyData =
        Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(
              data?.properties
            )
          ? data.properties
          : [];

      setProperties(propertyData);
    } catch (error) {
      console.error(error);

      alert(
        "Failed to load properties"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // ------------------------------------------------
  // RECEIVE EDIT PROPERTY FROM DASHBOARD
  // ------------------------------------------------

  useEffect(() => {
    const editProperty =
      location.state?.editProperty;

    if (!editProperty) {
      return;
    }

    handleEdit(editProperty);

    navigate(location.pathname, {
      replace: true,
      state: {},
    });
  }, [location.state]);

  // ------------------------------------------------
  // RESET PAGE
  // ------------------------------------------------

  useEffect(() => {
    const totalPages = Math.max(
      1,
      Math.ceil(
        properties.length /
          ITEMS_PER_PAGE
      )
    );

    if (
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }
  }, [
    properties,
    currentPage,
  ]);

  // ------------------------------------------------
  // MAIN IMAGE CHANGE
  // ------------------------------------------------

  const handleMainImageChange = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setMainImageFile(file);

    setMainImagePreview(
      URL.createObjectURL(file)
    );
  };

  // ------------------------------------------------
  // SUB IMAGE CHANGE
  // ------------------------------------------------

  const handleSubImagesChange = (
    event
  ) => {
    const files = Array.from(
      event.target.files || []
    );

    if (files.length > 4) {
      alert(
        "Maximum 4 sub images allowed."
      );

      event.target.value = "";

      return;
    }

    setSubImageFiles(files);

    const previews =
      files.map((file) =>
        URL.createObjectURL(file)
      );

    setSubImagePreviews(previews);
  };

  // ------------------------------------------------
  // AVAILABILITY HANDLERS
  // ------------------------------------------------

  const handleTotalUnitsChange = (
    event
  ) => {
    const value =
      Math.max(
        0,
        Number(event.target.value) || 0
      );

    setTotalUnits(value);

    if (availableUnits > value) {
      setAvailableUnits(value);
    }

    if (bookedUnits > value) {
      setBookedUnits(
        Math.max(
          0,
          value - availableUnits
        )
      );
    }
  };

  const handleAvailableUnitsChange = (
    event
  ) => {
    const value =
      Math.max(
        0,
        Number(event.target.value) || 0
      );

    setAvailableUnits(value);
  };

  const handleBookedUnitsChange = (
    event
  ) => {
    const value =
      Math.max(
        0,
        Number(event.target.value) || 0
      );

    setBookedUnits(value);
  };

  // ------------------------------------------------
  // RESET FORM
  // ------------------------------------------------

  const resetForm = () => {
    setEditingId(null);

    setTitle("");
    setCategory("");
    setSize("");
    setSizes("");
    setPrice("");
    setOldPrice("");
    setDescription("");

    setTotalUnits(1);
    setAvailableUnits(1);
    setBookedUnits(0);

    setMainImageFile(null);
    setMainImagePreview("");

    setSubImageFiles([]);
    setSubImagePreviews([]);

    const mainInput =
      document.getElementById(
        "mainImageInput"
      );

    const subInput =
      document.getElementById(
        "subImagesInput"
      );

    if (mainInput) {
      mainInput.value = "";
    }

    if (subInput) {
      subInput.value = "";
    }
  };

  // ------------------------------------------------
  // EDIT
  // ------------------------------------------------

  const handleEdit = (property) => {
    setEditingId(property._id);

    setTitle(
      property.title || ""
    );

    setCategory(
      property.category || ""
    );

    setSize(
      property.size || ""
    );

    setSizes(
      property.sizes
        ? property.sizes.join(", ")
        : ""
    );

    setPrice(
      property.price || ""
    );

    setOldPrice(
      property.oldPrice || ""
    );

    setDescription(
      property.description || ""
    );

    // -------------------------------
    // AVAILABILITY
    // -------------------------------

    const total =
      Number(
        property.totalUnits
      );

    const available =
      Number(
        property.availableUnits
      );

    const booked =
      Number(
        property.bookedUnits
      );

    setTotalUnits(
      Number.isFinite(total)
        ? total
        : 1
    );

    setAvailableUnits(
      Number.isFinite(available)
        ? available
        : Number.isFinite(total)
        ? total
        : 1
    );

    setBookedUnits(
      Number.isFinite(booked)
        ? booked
        : 0
    );

    // -------------------------------
    // MAIN IMAGE
    // -------------------------------

    setMainImageFile(null);

    setMainImagePreview(
      property.mainImage
        ? getImageUrl(
            property.mainImage
          )
        : ""
    );

    // -------------------------------
    // SUB IMAGES
    // -------------------------------

    setSubImageFiles([]);

    setSubImagePreviews(
      property.subImages
        ? property.subImages.map(
            getImageUrl
          )
        : []
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ------------------------------------------------
  // SUBMIT
  // ------------------------------------------------

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    // ----------------------------------------------
    // CREATE VALIDATION
    // ----------------------------------------------

    if (
      !editingId &&
      !mainImageFile
    ) {
      alert(
        "Please select a main image."
      );

      return;
    }

    // ----------------------------------------------
    // SUB IMAGE VALIDATION
    // ----------------------------------------------

    if (
      subImageFiles.length > 4
    ) {
      alert(
        "Maximum 4 sub images allowed."
      );

      return;
    }

    // ----------------------------------------------
    // AVAILABILITY VALIDATION
    // ----------------------------------------------

    const total =
      Number(totalUnits);

    const available =
      Number(availableUnits);

    const booked =
      Number(bookedUnits);

    if (
      !Number.isInteger(total) ||
      !Number.isInteger(available) ||
      !Number.isInteger(booked)
    ) {
      alert(
        "Availability values must be whole numbers."
      );

      return;
    }

    if (total < 0) {
      alert(
        "Total units cannot be negative."
      );

      return;
    }

    if (available < 0) {
      alert(
        "Available units cannot be negative."
      );

      return;
    }

    if (booked < 0) {
      alert(
        "Booked units cannot be negative."
      );

      return;
    }

    if (available > total) {
      alert(
        "Available units cannot be greater than total units."
      );

      return;
    }

    if (booked > total) {
      alert(
        "Booked units cannot be greater than total units."
      );

      return;
    }

    if (
      available + booked !==
      total
    ) {
      alert(
        "Available units + booked units must equal total units."
      );

      return;
    }

    try {
      setLoading(true);

      const formData =
        new FormData();

      // ------------------------------------------
      // TEXT DATA
      // ------------------------------------------

      formData.append(
        "title",
        title
      );

      formData.append(
        "category",
        category
      );

      formData.append(
        "size",
        size
      );

      formData.append(
        "sizes",
        sizes
      );

      formData.append(
        "price",
        price
      );

      formData.append(
        "oldPrice",
        oldPrice
      );

      formData.append(
        "description",
        description
      );

      // ------------------------------------------
      // AVAILABILITY
      // ------------------------------------------

      formData.append(
        "totalUnits",
        String(total)
      );

      formData.append(
        "availableUnits",
        String(available)
      );

      formData.append(
        "bookedUnits",
        String(booked)
      );

      // ------------------------------------------
      // MAIN IMAGE
      // ------------------------------------------

      if (mainImageFile) {
        formData.append(
          "mainImage",
          mainImageFile
        );
      }

      // ------------------------------------------
      // SUB IMAGES
      // ------------------------------------------

      subImageFiles.forEach(
        (file) => {
          formData.append(
            "subImages",
            file
          );
        }
      );

      // ------------------------------------------
      // REQUEST
      // ------------------------------------------

      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const method = editingId
        ? "PUT"
        : "POST";

      const response =
        await fetch(url, {
          method,
          headers: {
            ...getAuthHeaders(),
          },
          body: formData,
        });

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Something went wrong"
        );
      }

      alert(
        editingId
          ? "Property updated successfully!"
          : "Property added successfully!"
      );

      resetForm();

      // New property -> last page
      if (!editingId) {
        setCurrentPage(
          Math.ceil(
            (properties.length + 1) /
              ITEMS_PER_PAGE
          )
        );
      }

      await fetchProperties();
    } catch (error) {
      console.error(
        "Submit error:",
        error
      );

      alert(
        error.message ||
          "Failed to save property"
      );
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------
  // DELETE
  // ------------------------------------------------

  const handleDelete = async (
    id
  ) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this property?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      setLoading(true);

      const response =
        await fetch(
          `${API_URL}/${id}`,
          {
            method: "DELETE",
            headers: {
              ...getAuthHeaders(),
            },
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete"
        );
      }

      alert(
        "Property deleted successfully!"
      );

      await fetchProperties();
    } catch (error) {
      console.error(error);

      alert(
        error.message ||
          "Failed to delete property"
      );
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------
  // PAGINATION
  // ------------------------------------------------

  const totalPages = Math.max(
    1,
    Math.ceil(
      properties.length /
        ITEMS_PER_PAGE
    )
  );

  const pageStartIndex =
    (currentPage - 1) *
    ITEMS_PER_PAGE;

  const paginatedProperties =
    properties.slice(
      pageStartIndex,
      pageStartIndex +
        ITEMS_PER_PAGE
    );

  const goToPage = (page) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);

    const listSection =
      document.getElementById(
        "property-list-section"
      );

    if (listSection) {
      listSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // ------------------------------------------------
  // RENDER
  // ------------------------------------------------

  return (
    <div className="property-admin">

      <div className="property-admin-container">

        {/* ==========================================
            FORM
        =========================================== */}

        <div className="property-admin-form-card">

          <div className="property-admin-header">

            <div>

              <h1>
                {editingId
                  ? "Edit Property"
                  : "Add Property"}
              </h1>

              <p>
                Manage property details,
                pricing and images.
              </p>

            </div>

            {editingId && (
              <button
                type="button"
                className="cancel-btn"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}

          </div>

          <form
            onSubmit={handleSubmit}
          >

            {/* ======================================
                BASIC DETAILS
            ======================================= */}

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Property Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) =>
                    setTitle(
                      e.target.value
                    )
                  }
                  placeholder="Enter property title"
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Category
                </label>

                <input
                  type="text"
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value
                    )
                  }
                  placeholder="Villa / Apartment / House"
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Size
                </label>

                <input
                  type="text"
                  value={size}
                  onChange={(e) =>
                    setSize(
                      e.target.value
                    )
                  }
                  placeholder="1800 sq ft"
                />

              </div>

              <div className="form-group">

                <label>
                  Available Sizes
                </label>

                <input
                  type="text"
                  value={sizes}
                  onChange={(e) =>
                    setSizes(
                      e.target.value
                    )
                  }
                  placeholder="1800 sq ft, 2000 sq ft, 2200 sq ft"
                />

                <small>
                  Separate sizes with comma
                </small>

              </div>

              <div className="form-group">

                <label>
                  Price
                </label>

                <input
                  type="text"
                  value={price}
                  onChange={(e) =>
                    setPrice(
                      e.target.value
                    )
                  }
                  placeholder="₹85,00,000"
                />

              </div>

              <div className="form-group">

                <label>
                  Old Price
                </label>

                <input
                  type="text"
                  value={oldPrice}
                  onChange={(e) =>
                    setOldPrice(
                      e.target.value
                    )
                  }
                  placeholder="₹90,00,000"
                />

              </div>

              {/* ==================================
                  TOTAL UNITS
              ================================== */}

              <div className="form-group">

                <label>
                  Total Units
                </label>

                <input
                  type="number"
                  min="0"
                  value={totalUnits}
                  onChange={
                    handleTotalUnitsChange
                  }
                  placeholder="10"
                  required
                />

              </div>

              {/* ==================================
                  AVAILABLE UNITS
              ================================== */}

              <div className="form-group">

                <label>
                  Available Units
                </label>

                <input
                  type="number"
                  min="0"
                  max={totalUnits}
                  value={availableUnits}
                  onChange={
                    handleAvailableUnitsChange
                  }
                  placeholder="8"
                  required
                />

              </div>

              {/* ==================================
                  BOOKED UNITS
              ================================== */}

              <div className="form-group">

                <label>
                  Booked Units
                </label>

                <input
                  type="number"
                  min="0"
                  max={totalUnits}
                  value={bookedUnits}
                  onChange={
                    handleBookedUnitsChange
                  }
                  placeholder="2"
                  required
                />

              </div>

            </div>

            {/* ======================================
                AVAILABILITY INFO
            ======================================= */}

            <div
              style={{
                marginTop: "10px",
                marginBottom: "20px",
                padding: "12px 15px",
                borderRadius: "8px",
                background:
                  "#f7f7f7",
                fontSize: "14px",
              }}
            >
              <strong>
                Availability:
              </strong>{" "}
              {availableUnits} available
              {" + "}
              {bookedUnits} booked
              {" = "}
              {totalUnits} total
            </div>

            {/* ======================================
                DESCRIPTION
            ======================================= */}

            <div className="form-group full-width">

              <label>
                Description
              </label>

              <textarea
                rows="5"
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                placeholder="Enter property description"
              />

            </div>

            {/* ======================================
                MAIN IMAGE
            ======================================= */}

            <div className="image-upload-section">

              <div className="image-upload-title">

                <h3>
                  Main Image
                </h3>

                <span>
                  1 image only
                </span>

              </div>

              <p className="image-help">
                This image will be used
                as the main property poster
                on the property card.
              </p>

              <input
                id="mainImageInput"
                type="file"
                accept="image/*"
                onChange={
                  handleMainImageChange
                }
              />

              {mainImagePreview && (
                <div className="main-image-preview">

                  <img
                    src={
                      mainImagePreview
                    }
                    alt="Main property"
                  />

                </div>
              )}

            </div>

            {/* ======================================
                SUB IMAGES
            ======================================= */}

            <div className="image-upload-section">

              <div className="image-upload-title">

                <h3>
                  Sub Images
                </h3>

                <span>
                  Maximum 4 images
                </span>

              </div>

              <p className="image-help">
                These images are used
                inside the Quick View
                gallery.
              </p>

              <input
                id="subImagesInput"
                type="file"
                accept="image/*"
                multiple
                onChange={
                  handleSubImagesChange
                }
              />

              {subImagePreviews.length >
                0 && (
                <div className="sub-images-preview">

                  {subImagePreviews
                    .slice(0, 4)
                    .map(
                      (
                        image,
                        index
                      ) => (
                        <div
                          className="sub-image-preview"
                          key={index}
                        >

                          <img
                            src={image}
                            alt={`Sub image ${
                              index + 1
                            }`}
                          />

                          <span>
                            {index + 1}
                          </span>

                        </div>
                      )
                    )}

                </div>
              )}

            </div>

            {/* ======================================
                SUBMIT
            ======================================= */}

            <div className="form-actions">

              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Property"
                  : "Add Property"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={resetForm}
                >
                  Clear
                </button>
              )}

            </div>

          </form>

        </div>

        {/* ==========================================
            PROPERTY LIST
        =========================================== */}

        <div
          className="property-list-section"
          id="property-list-section"
        >

          <div className="property-list-header">

            <div>

              <h2>
                Properties
              </h2>

              <p>
                Total:{" "}
                {properties.length}
              </p>

            </div>

            {properties.length > 0 && (
              <span className="property-page-info">
                Page {currentPage} of{" "}
                {totalPages}
              </span>
            )}

          </div>

          {loading &&
            properties.length === 0 && (
              <div className="loading">
                Loading properties...
              </div>
            )}

          {!loading &&
            properties.length === 0 && (
              <div className="empty-state">
                No properties found.
              </div>
            )}

          <div className="property-admin-grid">

            {paginatedProperties.map(
              (property) => (
                <div
                  className="property-admin-card"
                  key={property._id}
                >

                  {/* MAIN IMAGE */}

                  <div className="property-card-image">

                    {property.mainImage ? (
                      <img
                        src={getImageUrl(
                          property.mainImage
                        )}
                        alt={
                          property.title
                        }
                      />
                    ) : (
                      <div>
                        No image
                      </div>
                    )}

                    <span className="category-badge">
                      {
                        property.category
                      }
                    </span>

                  </div>

                  {/* CONTENT */}

                  <div className="property-card-content">

                    <h3>
                      {
                        property.title
                      }
                    </h3>

                    <p className="property-size">
                      {property.size}
                    </p>

                    <div className="property-price">

                      <strong>
                        {
                          property.price
                        }
                      </strong>

                      {property.oldPrice && (
                        <del>
                          {
                            property.oldPrice
                          }
                        </del>
                      )}

                    </div>

                    {/* AVAILABILITY */}

                    <div
                      style={{
                        marginTop:
                          "8px",
                        marginBottom:
                          "8px",
                        fontSize:
                          "13px",
                      }}
                    >

                      <div>
                        Total:{" "}
                        <strong>
                          {
                            property.totalUnits ??
                            0
                          }
                        </strong>
                      </div>

                      <div>
                        Available:{" "}
                        <strong>
                          {
                            property.availableUnits ??
                            0
                          }
                        </strong>
                      </div>

                      <div>
                        Booked:{" "}
                        <strong>
                          {
                            property.bookedUnits ??
                            0
                          }
                        </strong>
                      </div>

                    </div>

                    {/* SUB IMAGE COUNT */}

                    <p className="sub-image-count">
                      Sub Images:{" "}
                      {
                        property
                          .subImages
                          ?.length || 0
                      }
                      /4
                    </p>

                    {/* ACTIONS */}

                    <div className="property-card-actions">

                      <button
                        type="button"
                        className="edit-btn"
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
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(
                            property._id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>
              )
            )}

          </div>

          {/* ======================================
              PAGINATION
          ======================================= */}

          {totalPages > 1 && (
            <div className="property-admin-pagination">

              <button
                type="button"
                disabled={
                  currentPage === 1
                }
                onClick={() =>
                  goToPage(
                    currentPage - 1
                  )
                }
              >
                ← Prev
              </button>

              {Array.from(
                {
                  length: totalPages,
                },
                (_, index) =>
                  index + 1
              ).map((page) => (
                <button
                  type="button"
                  key={page}
                  className={
                    currentPage ===
                    page
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    goToPage(page)
                  }
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={() =>
                  goToPage(
                    currentPage + 1
                  )
                }
              >
                Next →
              </button>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default PropertyAdmin;