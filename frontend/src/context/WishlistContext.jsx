import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

const API_URL = "http://localhost:5000/api/wishlist";

const getBaseId = (property) =>
  String(
    property?._id ||
      property?.id ||
      property?.productId ||
      property?.title ||
      ""
  );

const getWishlistType = (property) => {
  if (property?.wishlistType) {
    return String(property.wishlistType);
  }

  if (property?.sourceType) {
    return String(property.sourceType);
  }

  if (property?.sliderImages) {
    return "luxury";
  }

  if (property?.subImages) {
    return "property";
  }

  return "";
};

const getPropertyId = (property) => {
  if (property?.productId !== undefined && property?.productId !== null) {
    return String(property.productId);
  }

  const baseId = getBaseId(property);
  const type = getWishlistType(property);

  return type && baseId ? `${type}:${baseId}` : baseId;
};

const getLegacyPropertyId = (property) => getBaseId(property);

// પ્રિફિક્સ અને બેઝ ID બંનેને મેચ કરવા માટેનું ફંક્શન
const wishlistItemMatches = (item, property) => {
  const itemId = String(item?.productId || "").trim();
  const currentId = String(getPropertyId(property) || "").trim();
  const legacyId = String(getLegacyPropertyId(property) || "").trim();

  if (!itemId || (!currentId && !legacyId)) return false;

  if (itemId === currentId || itemId === legacyId) return true;

  const itemBaseId = itemId.includes(":") ? itemId.split(":").pop() : itemId;
  const currentBaseId = currentId.includes(":") ? currentId.split(":").pop() : currentId;
  const legacyBaseId = legacyId.includes(":") ? legacyId.split(":").pop() : legacyId;

  if (itemBaseId && (itemBaseId === currentBaseId || itemBaseId === legacyBaseId)) {
    return true;
  }

  return false;
};

const getPrice = (price) => {
  if (typeof price === "number") {
    return price;
  }

  const cleaned = String(price || "")
    .replace(/Rs\.?/gi, "")
    .replace(/INR/gi, "")
    .replace(/₹/g, "")
    .replace(/,/g, "")
    .trim();

  const number = parseFloat(cleaned);

  return Number.isFinite(number) ? number : 0;
};

export const WishlistProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = user?._id || user?.id || null;

  const getToken = () => localStorage.getItem("token");

  // const fetchWishlist = useCallback(async () => {
  //   const token = getToken();

  //   if (!isAuthenticated || !userId || !token) {
  //     setWishlist([]);
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const response = await fetch(`${API_URL}/${userId}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const result = await response.json();

  //     if (!response.ok || !result.success) {
  //       throw new Error(result.message || "Failed to fetch wishlist");
  //     }

  //     setWishlist(
  //       Array.isArray(result.data) ? result.data : []
  //     );
  //   } catch (error) {
  //     console.error("FETCH WISHLIST ERROR:", error);
  //     setWishlist([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [isAuthenticated, userId]);
const fetchWishlist = useCallback(async () => {
  const token = getToken();

  if (!isAuthenticated || !userId || !token) {
    setWishlist([]);
    setLoading(false);
    return;
  }

  try {
    setLoading(true);

    const response = await fetch(`${API_URL}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await response.json();

    // TEMP DEBUG — remove after fixing
    console.log("WISHLIST FETCH STATUS:", response.status);
    console.log("WISHLIST FETCH RESULT:", result);

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to fetch wishlist");
    }

    setWishlist(Array.isArray(result.data) ? result.data : []);
  } catch (error) {
    console.error("FETCH WISHLIST ERROR:", error);
    setWishlist([]);
  } finally {
    setLoading(false);
  }
}, [isAuthenticated, userId]);
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (property) => {
    const token = getToken();

    if (!isAuthenticated || !userId || !token) {
      alert("Please login to add to wishlist.");
      return { success: false };
    }

    try {
      const productId = getPropertyId(property);

      // બધી જ સંભવિત ઇમેજ પ્રોપર્ટીઝ ચેક કરશે (Property અને Luxury બંને માટે)
      const image =
        property.mainImage ||
        property.image ||
        property.imageUrl ||
        (Array.isArray(property.sliderImages) ? property.sliderImages[0] : "") ||
        (Array.isArray(property.subImages) ? property.subImages[0] : "") ||
        (Array.isArray(property.images) ? property.images[0] : "") ||
        "";

      const images = Array.isArray(property.images)
        ? property.images
        : Array.isArray(property.sliderImages)
        ? property.sliderImages
        : Array.isArray(property.subImages)
        ? property.subImages
        : image ? [image] : [];

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          productId,
          wishlistType: getWishlistType(property),
          title: property.title || property.name || "",
          category: property.category || property.type || "",
          type: property.type || "",
          image,
          mainImage: property.mainImage || image,
          images,
          sliderImages: Array.isArray(property.sliderImages)
            ? property.sliderImages
            : images,
          subImages: Array.isArray(property.subImages)
            ? property.subImages
            : images,
          price: getPrice(property.price || property.cost),
          oldPrice: getPrice(property.oldPrice),
          size: property.size || property.sizes?.[0] || "",
          sizes: Array.isArray(property.sizes)
            ? property.sizes
            : property.size
            ? [property.size]
            : [],
          description: property.description || property.details || "",
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to add wishlist");
      }

      await fetchWishlist();

      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      console.error("ADD WISHLIST ERROR:", error);
      alert(error.message || "Failed to add wishlist");
      return { success: false };
    }
  };

  const removeFromWishlist = async (productId) => {
    const token = getToken();

    if (!isAuthenticated || !userId || !token) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/${userId}/${encodeURIComponent(productId)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to remove wishlist");
      }

      setWishlist((previous) =>
        previous.filter(
          (item) => String(item.productId) !== String(productId)
        )
      );
    } catch (error) {
      console.error("REMOVE WISHLIST ERROR:", error);
      alert(error.message || "Failed to remove wishlist");
    }
  };

  const toggleWishlist = async (property) => {
    const existingItem = wishlist.find((item) =>
      wishlistItemMatches(item, property)
    );

    if (existingItem) {
      await removeFromWishlist(existingItem.productId);
      return {
        success: true,
        wishlisted: false,
      };
    }

    const result = await addToWishlist(property);

    return {
      success: Boolean(result?.success),
      wishlisted: Boolean(result?.success),
    };
  };

  const isWishlisted = (property) =>
    wishlist.some((item) => wishlistItemMatches(item, property));

  const clearWishlist = async () => {
    const token = getToken();

    if (!isAuthenticated || !userId || !token) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to clear wishlist");
      }

      setWishlist([]);
    } catch (error) {
      console.error("CLEAR WISHLIST ERROR:", error);
      alert(error.message || "Failed to clear wishlist");
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        loading,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isWishlisted,
        clearWishlist,
        refreshWishlist: fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);