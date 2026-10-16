import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([]);
  const { user } = useAuth();
  const userId = user?._id || user?.id || localStorage.getItem("userId") || "guest";

  // Fetch Compare List from Backend Database
  const fetchCompareList = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/compare/${userId}`);
      const result = await response.json();
      if (response.ok && result.success) {
        setCompareList(Array.isArray(result.data) ? result.data : []);
      }
    } catch (error) {
      console.error("Failed to fetch compare list from DB:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchCompareList();
  }, [fetchCompareList]);

  // Add or Toggle in Compare (Database Store)
  const addToCompare = async (product) => {
    try {
      const productId = String(product._id || product.id);
      const response = await fetch("http://localhost:5000/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          productId,
          title: product.title,
          category: product.category || "Real Estate",
          image: product.image || product.mainImage || "",
          price: product.price || "",
          oldPrice: product.oldPrice || "",
          size: product.size || "",
          sizes: product.sizes || [],
          description: product.description || ""
        }),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        await fetchCompareList();
        return { success: true, message: result.message };
      }
      return { success: false, message: result.message };
    } catch (error) {
      console.error("Add to compare error:", error);
      return { success: false, message: "Network error" };
    }
  };

  // Remove from Compare (Database Delete)
  const removeFromCompare = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/compare/${userId}/${encodeURIComponent(productId)}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setCompareList((prev) => prev.filter((item) => String(item.productId || item._id) !== String(productId)));
        return { success: true };
      }
    } catch (error) {
      console.error("Remove compare error:", error);
    }
    return { success: false };
  };

  // Clear All Compare (Database Clear)
  const clearCompare = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/compare/${userId}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setCompareList([]);
      }
    } catch (error) {
      console.error("Clear compare error:", error);
    }
  };

  // Check if item is compared
  const isCompared = (product) => {
    const productId = String(product._id || product.id);
    return compareList.some((item) => String(item.productId || item._id) === productId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isCompared,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => useContext(CompareContext);