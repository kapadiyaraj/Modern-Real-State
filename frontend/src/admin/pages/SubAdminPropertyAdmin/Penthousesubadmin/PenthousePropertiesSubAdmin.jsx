import React, {
  useEffect,
  useState,
} from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./PenthousesubAdmin.css";

const API_URL =
  "http://localhost:5000/api/penthouse-properties";

const categories = [
  "Ultra Luxury",
  "Sky Collection",
  "Royal Suite",
  "Penthouse Duplex",
  "Penthouse",
];

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

const emptyForm = {
  title: "",
  category: "Ultra Luxury",
  size: "",
  sizes: "",
  price: "",
  oldPrice: "",
  description: "",
  mainImage: "",
  subImages: [],
    // Availability
  totalUnits: 1,
  availableUnits: 1,
  bookedUnits: 0,
};

const PenthousePropertiesSubAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [properties, setProperties] =
    useState([]);

  const [form, setForm] =
    useState(emptyForm);

  const [editingId, setEditingId] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  // =====================================================
  // FETCH MY PENTHOUSE PROPERTIES
  // =====================================================

  const fetchProperties = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/my`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Failed to fetch properties"
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
        "Fetch error:",
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
    fetchProperties();
  }, []);

  // =====================================================
  // RECEIVE EDIT PROPERTY
  // =====================================================

  useEffect(() => {
    const property =
      location.state?.editProperty;

    if (!property) return;

    editProperty(property);

    navigate(location.pathname, {
      replace: true,
      state: {},
    });
  }, [location.state]);

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // FILE TO BASE64
  // =====================================================

  const fileToBase64 = (file) =>
    new Promise(
      (resolve, reject) => {
        const reader =
          new FileReader();

        reader.onload = () =>
          resolve(
            reader.result
          );

        reader.onerror = () =>
          reject(
            new Error(
              "Image could not be read."
            )
          );

        reader.readAsDataURL(file);
      }
    );

  // =====================================================
  // MAIN IMAGE
  // =====================================================

  const handleMainImageUpload =
    async (event) => {
      const file =
        event.target.files?.[0];

      if (!file) return;

      try {
        const image =
          await fileToBase64(file);

        setForm((previous) => ({
          ...previous,
          mainImage: image,
        }));
      } catch (error) {
        console.error(error);

        alert(
          "Failed to load main image."
        );
      }
    };

  // =====================================================
  // SUB IMAGES
  // =====================================================

  const handleSubImagesUpload =
    async (event) => {
      const files = Array.from(
        event.target.files || []
      ).slice(0, 3);

      if (!files.length) return;

      try {
        const images =
          await Promise.all(
            files.map(fileToBase64)
          );

        setForm((previous) => ({
          ...previous,
          subImages: images,
        }));
      } catch (error) {
        console.error(error);

        alert(
          "Failed to load sub images."
        );
      }
    };

  // =====================================================
  // REMOVE SUB IMAGE
  // =====================================================

  const removeSubImage = (
    index
  ) => {
    setForm((previous) => ({
      ...previous,

      subImages:
        previous.subImages.filter(
          (_, i) => i !== index
        ),
    }));
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (
      !form.title.trim() ||
      !form.price.trim()
    ) {
      alert(
        "Please fill in Title and Price."
      );
      return;
    }

    if (
      !editingId &&
      !form.mainImage
    ) {
      alert(
        "Please upload a main image."
      );
      return;
    }

    const sizeList =
      form.sizes
        .split(",")
        .map(
          (item) =>
            item.trim()
        )
        .filter(Boolean);

    const combinedImages = [
      form.mainImage,
      ...form.subImages,
    ]
      .filter(Boolean)
      .slice(0, 4);

    const propertyData = {
      title:
        form.title.trim(),

      category:
        form.category,

      size:
        form.size.trim() ||
        sizeList[0] ||
        "",

      sizes:
        sizeList.length
          ? sizeList
          : form.size
          ? [form.size.trim()]
          : [],

      price:
        form.price.trim(),

      oldPrice:
        form.oldPrice.trim(),

      description:
        form.description.trim(),
         // Stock / Availability
  totalUnits: Number(form.totalUnits),
  availableUnits: Number(form.availableUnits),
  bookedUnits: Number(form.bookedUnits),
    };

    

    if (form.mainImage) {
      propertyData.image =
        form.mainImage;

      propertyData.images =
        combinedImages;
    }

    const isEditing =
      editingId !== null;

    const url = isEditing
      ? `${API_URL}/${editingId}`
      : API_URL;

    const method = isEditing
      ? "PUT"
      : "POST";

    try {
      setLoading(true);

      const response =
        await fetch(url, {
          method,

          headers: {
            "Content-Type":
              "application/json",

            ...getAuthHeaders(),
          },

          body: JSON.stringify(
            propertyData
          ),
        });

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Something went wrong"
        );
      }

      await fetchProperties();

      alert(
        isEditing
          ? "Property updated successfully."
          : "Property added successfully."
      );

      cancelEdit();
    } catch (error) {
      console.error(
        "Save error:",
        error
      );

      alert(
        error.message ||
          "Failed to save property."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // EDIT PROPERTY
  // =====================================================

  const editProperty = (
    property
  ) => {
    const propId =
      property.id ??
      property._id;

    setEditingId(propId);

    const gallery =
      property.images?.length
        ? property.images
        : property.image
        ? [property.image]
        : [];

    setForm({
      title:
        property.title || "",

      category:
        property.category ||
        "Ultra Luxury",

      size:
        property.size || "",

      sizes: (
        property.sizes || []
      ).join(", "),

      price:
        property.price || "",

      oldPrice:
        property.oldPrice || "",

      description:
        property.description || "",

              totalUnits: Number(property.totalUnits ?? 1),
      availableUnits: Number(property.availableUnits ?? 1),
      bookedUnits: Number(property.bookedUnits ?? 0),

      mainImage:
        property.image ||
        gallery[0] ||
        "",

      subImages:
        gallery.slice(1, 4),
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (
    id
  ) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this property?"
      )
    ) {
      return;
    }

    try {
      setLoading(true);

      const response =
        await fetch(
          `${API_URL}/${id}`,
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
            "Failed to delete property"
        );
      }

      await fetchProperties();

      if (editingId === id) {
        cancelEdit();
      }

      alert(
        "Property deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete error:",
        error
      );

      alert(
        error.message ||
          "Failed to delete property."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CANCEL / CLEAR
  // =====================================================

  const cancelEdit = () => {
    setEditingId(null);

    setForm(emptyForm);

    const mainInput =
      document.getElementById(
        "penthouse-subadmin-main-image"
      );

    const subInput =
      document.getElementById(
        "penthouse-subadmin-sub-images"
      );

    if (mainInput) {
      mainInput.value = "";
    }

    if (subInput) {
      subInput.value = "";
    }
  };

  // =====================================================
  // RECENT 4
  // =====================================================

  const recentProperties = [
    ...properties,
  ]
    .sort((a, b) => {
      const aId =
        Number(a.id) || 0;

      const bId =
        Number(b.id) || 0;

      return bId - aId;
    })
    .slice(0, 4);

  const paddedProperties = [
    ...recentProperties,
  ];

  while (
    paddedProperties.length < 4
  ) {
    paddedProperties.push(null);
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="penthouse-admin">

      {/* HEADER */}

      <header className="penthouse-admin-header">

        <div>
          <span className="penthouse-admin-label">
            SUB ADMIN PANEL
          </span>

          <h1>
            Penthouse Properties Management
          </h1>

          <p>
            Add new properties and
            manage your listings.
          </p>
        </div>

        <button
          type="button"
          className="penthouse-view-all-btn"
          onClick={() =>
            navigate(
              "/sub-admin/penthouse-properties/all"
            )
          }
        >
          View All Properties (
          {properties.length}
          )
        </button>

      </header>

      {/* ADD / EDIT FORM */}

      <section className="penthouse-admin-form-card">

        <div className="penthouse-card-title">

          <div>

            <span className="penthouse-admin-label">
              PROPERTY MANAGEMENT
            </span>

            <h2>
              {editingId
                ? "Edit Penthouse Property"
                : "Add New Property"}
            </h2>

          </div>

          {editingId && (
            <button
              type="button"
              className="penthouse-form-cancel-top"
              onClick={cancelEdit}
            >
              Cancel Edit
            </button>
          )}

        </div>

        <form
          onSubmit={handleSubmit}
        >

          <div className="penthouse-form-grid">

            {/* TITLE */}

            <div className="penthouse-form-group">

              <label>
                Property Title *
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={
                  handleChange
                }
                placeholder="e.g. Green Gardens A-72"
              />

            </div>

            {/* CATEGORY */}

            <div className="penthouse-form-group">

              <label>
                Category *
              </label>

              <select
                name="category"
                value={
                  form.category
                }
                onChange={
                  handleChange
                }
              >

                {categories.map(
                  (category) => (
                    <option
                      key={category}
                      value={
                        category
                      }
                    >
                      {category}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* DEFAULT SIZE */}

            <div className="penthouse-form-group">

              <label>
                Default Size
              </label>

              <input
                type="text"
                name="size"
                value={form.size}
                onChange={
                  handleChange
                }
                placeholder="1200 sq ft"
              />

            </div>

            {/* AVAILABLE SIZES */}

            <div className="penthouse-form-group">

              <label>
                Available Sizes
              </label>

              <input
                type="text"
                name="sizes"
                value={form.sizes}
                onChange={
                  handleChange
                }
                placeholder="1200 sq ft, 1400 sq ft"
              />

            </div>

            {/* PRICE */}

            <div className="penthouse-form-group">

              <label>
                Price *
              </label>

              <input
                type="text"
                name="price"
                value={form.price}
                onChange={
                  handleChange
                }
                placeholder="Rs. 99,000.00 INR"
              />

            </div>

            {/* OLD PRICE */}

            <div className="penthouse-form-group">

              <label>
                Old Price
              </label>

              <input
                type="text"
                name="oldPrice"
                value={
                  form.oldPrice
                }
                onChange={
                  handleChange
                }
                placeholder="Optional"
              />

            </div>

            {/* MAIN IMAGE */}

            <div className="penthouse-form-group penthouse-full">

              <label>
                Main Image *
              </label>

              <input
                id="penthouse-subadmin-main-image"
                type="file"
                accept="image/*"
                onChange={
                  handleMainImageUpload
                }
              />

              <small>
                Primary image shown
                on the property card.
              </small>

              {form.mainImage && (
                <div className="penthouse-image-preview-wrap">

                  <div className="penthouse-image-preview-item main">

                    <img
                      className="penthouse-image-preview"
                      src={
                        form.mainImage
                      }
                      alt="Main preview"
                    />

                    <span>
                      Main View
                    </span>

                  </div>

                </div>
              )}

            </div>

            {/* SUB IMAGES */}

            <div className="penthouse-form-group penthouse-full">

              <label>
                Sub Images
                (max 3, gallery)
              </label>

              <input
                id="penthouse-subadmin-sub-images"
                type="file"
                accept="image/*"
                multiple
                onChange={
                  handleSubImagesUpload
                }
              />

              <small>
                Appears in the
                quick-view gallery.
              </small>


              {/* AVAILABILITY */}

<div className="penthouse-form-group">
  <label>Total Units</label>
  <input
    type="number"
    name="totalUnits"
    min="0"
    value={form.totalUnits}
    onChange={handleChange}
    placeholder="Enter total units"
  />
</div>

<div className="penthouse-form-group">
  <label>Available Units</label>
  <input
    type="number"
    name="availableUnits"
    min="0"
    value={form.availableUnits}
    onChange={handleChange}
    placeholder="Enter available units"
  />
</div>

<div className="penthouse-form-group">
  <label>Booked Units</label>
  <input
    type="number"
    name="bookedUnits"
    min="0"
    value={form.bookedUnits}
    onChange={handleChange}
    placeholder="Enter booked units"
  />
</div>

              {form.subImages.length >
                0 && (

                <div className="penthouse-image-preview-wrap">

                  {form.subImages.map(
                    (
                      image,
                      index
                    ) => (

                      <div
                        className="penthouse-image-preview-item"
                        key={`${image}-${index}`}
                      >

                        <img
                          className="penthouse-image-preview"
                          src={image}
                          alt={`Gallery ${
                            index + 1
                          }`}
                        />

                        <button
                          type="button"
                          className="penthouse-remove-image-btn"
                          onClick={() =>
                            removeSubImage(
                              index
                            )
                          }
                        >
                          ×
                        </button>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

            {/* DESCRIPTION */}

            <div className="penthouse-form-group penthouse-full">

              <label>
                Description
              </label>

              <textarea
                name="description"
                value={
                  form.description
                }
                onChange={
                  handleChange
                }
                rows="4"
                placeholder="Property description..."
              />

            </div>

          </div>

          {/* BUTTONS */}

          <div className="penthouse-form-buttons">

            <button
              type="button"
              className="penthouse-cancel-btn"
              onClick={cancelEdit}
              disabled={loading}
            >
              {editingId
                ? "Cancel"
                : "Clear"}
            </button>

            <button
              type="submit"
              className="penthouse-save-btn"
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : editingId
                ? "Update Property"
                : "Add Property"}
            </button>

          </div>

        </form>

      </section>

      {/* RECENT PROPERTIES */}

      <section className="penthouse-list-card">

        <div className="penthouse-list-header">

          <div>

            <span className="penthouse-admin-label">
              YOUR PROPERTY DATA
            </span>

            <h2>
              Recent Properties
            </h2>

            <p className="penthouse-section-subtitle">
              Showing your 4 most
              recently added properties.
            </p>

          </div>

          <button
            type="button"
            className="penthouse-view-all-btn"
            onClick={() =>
              navigate(
                "/sub-admin/penthouse-properties/all"
              )
            }
          >
            View All Properties →
          </button>

        </div>

        <div className="penthouse-table-wrap">

          <table className="penthouse-table">

            <thead>

              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Size</th>
                <th>Price</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {paddedProperties.map(
                (
                  property,
                  index
                ) => {

                  if (!property) {

                    return (
                      <tr
                        key={`empty-${index}`}
                      >

                        <td>
                          <div
                            style={{
                              width:
                                "50px",
                              height:
                                "40px",
                              background:
                                "rgba(255,255,255,0.02)",
                              borderRadius:
                                "6px",
                            }}
                          />
                        </td>

                        <td>
                          <span
                            style={{
                              color:
                                "var(--pen-text-muted)",
                            }}
                          >
                            -
                          </span>
                        </td>

                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>

                      </tr>
                    );
                  }

                  const propId =
                    property.id ??
                    property._id;

                  const image =
                    property.image ||
                    property.images?.[0] ||
                    "";

                  return (
                    <tr
                      key={propId}
                    >

                      <td>

                        {image ? (
                          <img
                            src={image}
                            alt={
                              property.title
                            }
                            style={{
                              width:
                                "50px",
                              height:
                                "40px",
                              objectFit:
                                "cover",
                              borderRadius:
                                "6px",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width:
                                "50px",
                              height:
                                "40px",
                              background:
                                "rgba(255,255,255,0.05)",
                              borderRadius:
                                "6px",
                            }}
                          />
                        )}

                      </td>

                      <td>

                        <div className="penthouse-property-info">

                          <strong>
                            {
                              property.title
                            }
                          </strong>

                          <small>
                            {
                              property.description ||
                              "No description"
                            }
                          </small>

                        </div>

                      </td>

                      <td>

                        <span className="penthouse-cat-badge">
                          {
                            property.category
                          }
                        </span>

                      </td>

                      <td>
                        {
                          property.size ||
                          "N/A"
                        }
                      </td>

                      <td>

                        <div className="penthouse-price-display">

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

                      </td>

                      <td>

                        <div className="penthouse-actions">

                          <button
                            type="button"
                            className="penthouse-edit-btn"
                            onClick={() =>
                              editProperty(
                                property
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="penthouse-delete-btn"
                            onClick={() =>
                              handleDelete(
                                propId
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  );
};

export default PenthousePropertiesSubAdmin;