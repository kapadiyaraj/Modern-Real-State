import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PenthouseAllAdmin.css";

const API_URL = "http://localhost:5000/api/penthouse-properties";
const ITEMS_PER_PAGE = 12;

const PenthouseAllAdmin = () => {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewProperty, setViewProperty] = useState(null);
  const [viewImageIndex, setViewImageIndex] = useState(0);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const result = await response.json();
      if (!response.ok) throw new Error(result?.message || "Failed to fetch");

      const data = Array.isArray(result)
        ? result
        : Array.isArray(result?.properties)
        ? result.properties
        : [];
      setProperties(data);
    } catch (error) {
      console.error("GET Error:", error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const totalPages = Math.max(1, Math.ceil(properties.length / ITEMS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProperties = properties.slice(startIndex, endIndex);

  const openView = (property) => {
    setViewProperty(property);
    setViewImageIndex(0);
  };

  const closeView = () => {
    setViewProperty(null);
    setViewImageIndex(0);
  };

  const viewImages = viewProperty
    ? viewProperty.images?.length
      ? viewProperty.images.slice(0, 4)
      : viewProperty.image
      ? [viewProperty.image]
      : []
    : [];

  const handleEdit = (property) => {
    navigate("/admin/penthouse", { state: { editProperty: property } });
  };

  const handleDelete = async (id) => {
    const property = properties.find((item) => Number(item.id) === Number(id));
    if (!window.confirm(`Are you sure you want to delete "${property?.title || "this property"}"?`)) return;

    try {
      setDeletingId(id);
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.message || "Failed to delete");

      setProperties((previous) => previous.filter((item) => Number(item.id) !== Number(id)));
      if (viewProperty && Number(viewProperty.id) === Number(id)) closeView();
      alert("Property deleted successfully.");
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.message || "Failed to delete property.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="pen-all-admin">
      <div className="pen-all-container">
        <header className="pen-all-header">
          <div>
            <button type="button" className="pen-back-btn" onClick={() => navigate("/admin/penthouse")}>
              ← Back to Penthouse
            </button>
            <h1>All Penthouse Properties</h1>
            <p>{properties.length} properties total</p>
          </div>
          <button type="button" className="pen-add-btn" onClick={() => navigate("/admin/penthouse")}>
            + Add Property
          </button>
        </header>

        {loading ? (
          <section className="pen-empty-state">
            <h2>Loading properties...</h2>
          </section>
        ) : currentProperties.length > 0 ? (
          <>
            <div className="pen-result-bar">
              <span>
                Showing <strong>{startIndex + 1}</strong>–<strong>{Math.min(endIndex, properties.length)}</strong> of{" "}
                <strong>{properties.length}</strong>
              </span>
              <span>
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
              </span>
            </div>

            <section className="pen-property-grid">
              {currentProperties.map((property) => {
                const id = property.id ?? property._id;
                return (
                  <article className="pen-property-card" key={id}>
                    <div className="pen-property-card-image">
                      <img src={property.image || "/images/feature-house.jpg"} alt={property.title || "Property"} />
                      <span className="pen-id-badge">ID #{id}</span>
                    </div>

                    <div className="pen-property-card-content">
                      <div className="pen-property-category">{property.category || "Home"}</div>
                      <h3>{property.title || "Untitled Property"}</h3>
                      <div className="pen-property-meta">
                        <div className="pen-meta-item">
                          <span>SIZE</span>
                          <strong>{property.size || "N/A"}</strong>
                        </div>
                      </div>

                      <div className="pen-property-price-section">
                        <div>
                          <span>PRICE</span>
                          <strong>{property.price || "N/A"}</strong>
                        </div>
                        {property.oldPrice && <del>{property.oldPrice}</del>}
                      </div>

                      <div className="pen-card-actions">
                        <button type="button" className="pen-view-btn" onClick={() => openView(property)}>
                          View
                        </button>
                        <button type="button" className="pen-edit-btn" onClick={() => handleEdit(property)} disabled={deletingId !== null}>
                          Edit
                        </button>
                        <button type="button" className="pen-delete-btn" onClick={() => handleDelete(id)} disabled={deletingId !== null}>
                          {deletingId === id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          </>
        ) : (
          <section className="pen-empty-state">
            <h2>No Properties Found</h2>
            <p>There are no penthouse properties available yet.</p>
            <button type="button" onClick={() => navigate("/admin/penthouse")}>+ Add First Property</button>
          </section>
        )}
      </div>

      {viewProperty && (
        <div className="pen-view-overlay" onClick={closeView}>
          <div className="pen-view-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="pen-view-close" onClick={closeView}>×</button>
            <div className="pen-view-gallery">
              {viewImages.length > 0 ? (
                <img src={viewImages[viewImageIndex]} alt={viewProperty.title} className="pen-view-main-image" />
              ) : (
                <div className="pen-view-no-image">No Image</div>
              )}
              {viewImages.length > 1 && (
                <div className="pen-view-thumbnails">
                  {viewImages.map((image, index) => (
                    <button
                      type="button"
                      key={`${image}-${index}`}
                      className={viewImageIndex === index ? "pen-view-thumb active" : "pen-view-thumb"}
                      onClick={() => setViewImageIndex(index)}
                    >
                      <img src={image} alt={`View ${index + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="pen-view-details">
              <span className="pen-view-category">{viewProperty.category}</span>
              <h2>{viewProperty.title}</h2>
              <div className="pen-view-row">
                <span>Size</span>
                <strong>{viewProperty.size || "N/A"}</strong>
              </div>
              <div className="pen-view-row">
                <span>Price</span>
                <strong>
                  {viewProperty.price} {viewProperty.oldPrice && <del>{viewProperty.oldPrice}</del>}
                </strong>
              </div>
              {viewProperty.description && (
                <div className="pen-view-description">
                  <span>Description</span>
                  <p>{viewProperty.description}</p>
                </div>
              )}
              <div className="pen-view-actions">
                <button type="button" className="pen-edit-btn" onClick={() => { closeView(); handleEdit(viewProperty); }}>
                  Edit Property
                </button>
                <button type="button" className="pen-delete-btn" onClick={() => { const id = viewProperty.id ?? viewProperty._id; handleDelete(id); }}>
                  Delete Property
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PenthouseAllAdmin;