import React from "react";
import { useNavigate } from "react-router-dom";
import "./Compare.css";
import Navbar from "../../components/Navbar/Navbar";
import { useCompare } from "../../context/CompareContext";
import { useCart } from "../../context/CartContext";

const IMAGE_BASE_URL = "http://localhost:5000";

const getImageUrl = (image) => {
  if (!image) return "";
  if (typeof image !== "string") return "";
  image = image.trim();
  if (!image) return "";

  if (image.startsWith("data:image") || image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }
  return image.startsWith("/") ? `${IMAGE_BASE_URL}${image}` : `${IMAGE_BASE_URL}/${image}`;
};

const Compare = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <main className="compare-page">
        <div className="compare-container">
          <h1>Compare Product</h1>

          {compareList.length === 0 ? (
            <div className="compare-empty">
              <p>No products added for comparison.</p>
            </div>
          ) : (
            <>
              <div className="compare-header">
                <div>Product</div>
                <div>Details</div>
                <div>Status</div>
                <div>Delete</div>
              </div>

              <div className="compare-list">
                {compareList.map((product) => {
                  const itemId = product._id || product.id;
                  const cardImage = getImageUrl(product.mainImage || product.image);

                  return (
                    <div className="compare-row" key={itemId}>
                      <div className="compare-product">
                        <img
                          src={cardImage}
                          alt={product.title}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>

                      <div className="compare-details">
                        <span className="compare-category">
                          {product.category || "Real Estate"}
                        </span>
                        <h3>{product.title}</h3>
                        <p>
                          {product.sizes
                            ? Array.isArray(product.sizes)
                              ? product.sizes.join(", ")
                              : product.sizes
                            : product.size || ""}
                        </p>
                        <div className="compare-price">
                          <strong>{product.price}</strong>
                          {product.oldPrice && <del>{product.oldPrice}</del>}
                        </div>
                      </div>

                      <div className="compare-status">
                        <button
                          type="button"
                          onClick={async () => {
                            const res = await addToCart(product);
                            if (res?.success) alert("Added to cart");
                          }}
                        >
                          Add to Cart
                        </button>
                      </div>

                      <div className="compare-delete">
                        <button
                          type="button"
                          onClick={() => removeFromCompare(itemId)}
                          aria-label="Delete"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button type="button" className="compare-clear" onClick={clearCompare}>
                Clear All
              </button>
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default Compare;