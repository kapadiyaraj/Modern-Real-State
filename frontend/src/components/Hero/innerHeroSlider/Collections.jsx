import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Collections.css";
import Navbar from "../../Navbar/Navbar";
import Footer from "../../Footer/Footer";
const API_URL = "http://localhost:5000/api/luxurious-properties";
const SERVER_URL = "http://localhost:5000";

const categories = [
  {
    title: "Bestseller",
    slug: "bestseller",
  },
  {
    title: "Farm Vila",
    slug: "farm-vila",
  },
  {
    title: "Properties",
    slug: "luxury-properties",
  },
  {
    title: "Royal House",
    slug: "royal-house",
  },
];

const Collections = () => {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(API_URL);
        const result = await response.json();

        const data = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result?.properties)
          ? result.properties
          : [];

        setProperties(data);
      } catch (error) {
        console.error("Luxury Properties Error:", error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const getImageUrl = (image) => {
    if (!image) return "";

    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("data:image")
    ) {
      return image;
    }

    if (image.startsWith("/uploads/")) {
      return `${SERVER_URL}${image}`;
    }

    if (image.startsWith("uploads/")) {
      return `${SERVER_URL}/${image}`;
    }

    if (image.startsWith("/")) {
      return image;
    }

    return `${SERVER_URL}/${image}`;
  };

  const getCategoryProperties = (category) => {
    if (category.title === "Bestseller") {
      return properties;
    }

    if (category.title === "Properties") {
      return properties.filter((property) => {
        const value = (property.category || "")
          .trim()
          .toLowerCase();

        return (
          value === "properties" ||
          value === "luxury properties"
        );
      });
    }

    return properties.filter((property) => {
      return (
        (property.category || "")
          .trim()
          .toLowerCase() ===
        category.title.trim().toLowerCase()
      );
    });
  };

  const handleCollectionClick = (category) => {
    navigate(`/collections/${category.slug}`);
  };

  if (loading) {
    return (
      <div className="real-estate-collections-page">
        <div className="real-estate-collections-container">
          <h1 className="real-estate-collections-title">
            Collections
          </h1>

          <p className="real-estate-collections-loading">
            Loading collections...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="real-estate-collections-page">

      <div className="real-estate-collections-container">

        {/* TITLE */}
        <h1 className="real-estate-collections-title">
          Collections
        </h1>

        {/* GRID */}
        <div className="real-estate-collections-grid">

          {categories.map((category) => {
            const categoryProperties =
              getCategoryProperties(category);

            const image =
              categoryProperties.find(
                (property) => property.mainImage
              )?.mainImage || "";

            return (
              <div
                className="real-estate-collection-card"
                key={category.slug}
              >

                {/* IMAGE */}
                <div
                  className="real-estate-collection-image-box"
                  onClick={() =>
                    handleCollectionClick(category)
                  }
                >
                  {image ? (
                    <img
                      src={getImageUrl(image)}
                      alt={category.title}
                      className="real-estate-collection-image"
                    />
                  ) : (
                    <div className="real-estate-collection-no-image">
                      No Image
                    </div>
                  )}
                </div>

                {/* TITLE */}
                <h2 className="real-estate-collection-name">
                  {category.title}
                </h2>

                {/* COUNT */}
                <button
                  type="button"
                  className="real-estate-collection-count"
                  onClick={() =>
                    handleCollectionClick(category)
                  }
                >
                  {categoryProperties.length} - Items
                </button>

              </div>
            );
          })}

        </div>

      </div>

    </div>

    <Footer/>
    </>
    
  );
};

export default Collections;