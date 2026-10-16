const Compare = require("../models/compareModel");

/* GET COMPARE */
const getCompare = async (req, res) => {
  try {
    const { userId } = req.params;

    const compareList = await Compare.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: compareList,
    });
  } catch (error) {
    console.error("GET COMPARE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch compare list",
    });
  }
};

/* ADD TO COMPARE */
const addToCompare = async (req, res) => {
  try {
    const body = req.body;
    const userId = body.userId || "guest";
    const productId = String(body.productId || body._id || body.id);

    // Check if already exists
    const existing = await Compare.findOne({ userId, productId });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Already in compare list",
        data: existing,
      });
    }

    const resolvedImage =
      body.image || body.mainImage || body.sliderImages?.[0] || "";

    const compareItem = await Compare.create({
      userId,
      productId,
      title: body.title,
      category: body.category || "Real Estate",
      image: resolvedImage,
      price: body.price || "",
      oldPrice: body.oldPrice || "",
      size: body.size || "",
      sizes: Array.isArray(body.sizes) ? body.sizes : [],
      description: body.description || "",
    });

    return res.status(201).json({
      success: true,
      message: "Added to compare successfully",
      data: compareItem,
    });
  } catch (error) {
    console.error("ADD COMPARE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add to compare",
    });
  }
};

/* REMOVE FROM COMPARE */
const removeFromCompare = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const deleted = await Compare.findOneAndDelete({
      userId,
      productId: String(productId),
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Compare item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Removed from compare",
      data: deleted,
    });
  } catch (error) {
    console.error("REMOVE COMPARE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove compare item",
    });
  }
};

/* CLEAR COMPARE */
const clearCompare = async (req, res) => {
  try {
    const { userId } = req.params;

    await Compare.deleteMany({ userId });

    return res.status(200).json({
      success: true,
      message: "Compare list cleared",
    });
  } catch (error) {
    console.error("CLEAR COMPARE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to clear compare list",
    });
  }
};

module.exports = {
  getCompare,
  addToCompare,
  removeFromCompare,
  clearCompare,
};