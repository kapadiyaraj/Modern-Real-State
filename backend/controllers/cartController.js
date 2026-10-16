
const mongoose = require("mongoose");

const Cart = require("../models/cartModel");
const Property = require("../models/Property");
const LuxuriousProperties = require("../models/LuxuriousProperties");
const PenthouseProperties = require("../models/PenthouseProperties");
const SpaciousLiving = require("../models/SpaciousLiving");

// ======================================================
// GET PRODUCT FROM DATABASE
// ======================================================

const getProductForAvailability = async (
  productId,
  productType = "property"
) => {
  switch (productType) {
    case "property": {
      if (!mongoose.isValidObjectId(productId)) {
        return null;
      }

      return Property.findById(productId);
    }

    case "luxury": {
      const numericId = Number(productId);

      if (!Number.isSafeInteger(numericId)) {
        return null;
      }

      return LuxuriousProperties.findOne({
        id: numericId,
      });
    }

    case "penthouse": {
      const conditions = [];
      const numericId = Number(productId);

      if (productId !== "" && Number.isSafeInteger(numericId)) {
        conditions.push({ id: numericId });
      }

      if (mongoose.isValidObjectId(productId)) {
        conditions.push({ _id: productId });
      }

      if (!conditions.length) return null;

      return PenthouseProperties.findOne({
        $or: conditions,
      });
    }

    case "spacious": {
      // productId must be the slider property's _id.
      if (!mongoose.isValidObjectId(productId)) {
        return null;
      }

      const parent = await SpaciousLiving.findOne({
        "sliderProperties._id": productId,
      });

      if (!parent) return null;

      return parent.sliderProperties.id(productId) || null;
    }

    default:
      return null;
  }
};

// ======================================================
// PARSE DATABASE PRICE
// ======================================================

const parseProductPrice = (rawPrice) => {
  if (
    rawPrice === null ||
    rawPrice === undefined ||
    rawPrice === ""
  ) {
    return NaN;
  }

  if (typeof rawPrice === "number") {
    return Number.isFinite(rawPrice) ? rawPrice : NaN;
  }

  let normalized = String(rawPrice)
    .trim()
    .replace(/^(?:Rs\.?|INR|₹)\s*/i, "")
    .replace(/\s*(?:INR|Rs\.?)$/i, "")
    .replace(/[₹,\s]/g, "");

  // Accept only a plain numeric value after removing
  // currency labels and separators.
  if (!/^\d+(?:\.\d+)?$/.test(normalized)) {
    return NaN;
  }

  return Number(normalized);
};


// ======================================================
// CHECK AVAILABILITY
// ======================================================

const checkAvailability = async ({
  productId,
  productType,
  quantity,
}) => {
  const product = await getProductForAvailability(
    productId,
    productType
  );

  if (!product) {
    return {
      valid: false,
      status: 404,
      message: "Product not found",
    };
  }

  const requestedQuantity = Number(quantity);

  if (
    !Number.isInteger(requestedQuantity) ||
    requestedQuantity < 1
  ) {
    return {
      valid: false,
      status: 400,
      message: "Quantity must be a positive whole number",
    };
  }

  // Spacious slider properties do not currently have
  // availability fields in their schema.
  const hasAvailability =
    product.availableUnits !== undefined &&
    product.availableUnits !== null;

  if (!hasAvailability) {
    return {
      valid: true,
      product,
    };
  }

  const availableUnits = Number(product.availableUnits);

  if (
    !Number.isFinite(availableUnits) ||
    availableUnits < requestedQuantity
  ) {
    return {
      valid: false,
      status: 400,
      message:
        availableUnits <= 0
          ? "This property is sold out"
          : `Only ${availableUnits} unit(s) available`,
      availableUnits,
    };
  }

  return {
    valid: true,
    product,
    availableUnits,
  };
};

// ======================================================
// RECALCULATE CART TOTAL
// ======================================================

const recalculateCartTotal = (cart) => {
  let total = 0;

  for (const item of cart.items) {
    const price = Number(item.price);
    const quantity = Number(item.quantity);

    if (
      !Number.isFinite(price) ||
      price <= 0 ||
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      throw new Error(
        `Invalid cart item: ${item.title || item.productId}`
      );
    }

    total += price * quantity;
  }

  if (!Number.isFinite(total)) {
    throw new Error("Invalid cart total");
  }

  cart.total = total;
};

// ======================================================
// GET CART
// ======================================================

exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [],
        total: 0,
      });
    }

    return res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error("GET CART ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get cart",
    });
  }
};

// ======================================================
// ADD TO CART
// ======================================================

exports.addToCart = async (req, res) => {
  try {
    const {
      userId,
      productId,
      productType = "property",
      title,
      image,
      quantity = 1,
    } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "userId and productId are required",
      });
    }

    const allowedTypes = [
      "property",
      "luxury",
      "penthouse",
      "spacious",
    ];

    if (!allowedTypes.includes(productType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product type",
      });
    }

    const requestedQuantity = Number(quantity);

    if (
      !Number.isInteger(requestedQuantity) ||
      requestedQuantity < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive whole number",
      });
    }

    // Load the actual product before reading its price.
    const availability = await checkAvailability({
      productId,
      productType,
      quantity: requestedQuantity,
    });

    if (!availability.valid) {
      return res.status(availability.status || 400).json({
        success: false,
        message: availability.message,
        availableUnits: availability.availableUnits,
      });
    }

    const product = availability.product;
    const actualPrice = parseProductPrice(product.price);

    if (!Number.isFinite(actualPrice) || actualPrice <= 0) {
      console.error("INVALID PRODUCT PRICE:", {
        productType,
        productId,
        title: product.title,
        databasePrice: product.price,
      });

      return res.status(400).json({
        success: false,
        message: "Product has an invalid price in the database",
        productType,
        productId: String(productId),
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
        total: 0,
      });
    }

    const existingItem = cart.items.find(
      (item) =>
        String(item.productId) === String(productId) &&
        item.productType === productType
    );

    const finalQuantity = existingItem
      ? Number(existingItem.quantity) + requestedQuantity
      : requestedQuantity;

    // Check availability again against the final quantity.
    const finalAvailability = await checkAvailability({
      productId,
      productType,
      quantity: finalQuantity,
    });

    if (!finalAvailability.valid) {
      return res.status(finalAvailability.status || 400).json({
        success: false,
        message: finalAvailability.message,
        availableUnits: finalAvailability.availableUnits,
      });
    }

    const actualTitle = product.title || title || "Property";
    const actualImage =
      product.mainImage || product.image || image || "";
    const actualCreatedBy = product.createdBy || null;

    if (existingItem) {
      existingItem.quantity = finalQuantity;
      existingItem.title = actualTitle;
      existingItem.image = actualImage;
      existingItem.price = actualPrice;
      existingItem.createdBy = actualCreatedBy;
    } else {
      cart.items.push({
        productId: String(productId),
        productType,
        title: actualTitle,
        image: actualImage,
        price: actualPrice,
        quantity: requestedQuantity,
        createdBy: actualCreatedBy,
      });
    }

    recalculateCartTotal(cart);

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      data: cart,
    });
  } catch (error) {
    console.error("ADD CART ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
      error: error.message,
    });
  }
};

// ======================================================
// UPDATE CART ITEM QUANTITY
// ======================================================

exports.updateCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;

    const requestedQuantity = Number(quantity);

    if (
      !Number.isInteger(requestedQuantity) ||
      requestedQuantity < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive whole number",
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (cartItem) =>
        String(cartItem.productId) === String(productId)
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    const availability = await checkAvailability({
      productId,
      productType: item.productType || "property",
      quantity: requestedQuantity,
    });

    if (!availability.valid) {
      return res.status(availability.status || 400).json({
        success: false,
        message: availability.message,
        availableUnits: availability.availableUnits,
      });
    }

    const actualPrice = parseProductPrice(
      availability.product.price
    );

    if (!Number.isFinite(actualPrice) || actualPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "Product has an invalid price in the database",
      });
    }

    item.quantity = requestedQuantity;
    item.price = actualPrice;

    recalculateCartTotal(cart);

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      data: cart,
    });
  } catch (error) {
    console.error("UPDATE CART ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update cart",
      error: error.message,
    });
  }
};

// ======================================================
// REMOVE ITEM FROM CART
// ======================================================

exports.removeCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { productType } = req.query;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const originalLength = cart.items.length;

    cart.items = cart.items.filter((item) => {
      const sameId =
        String(item.productId) === String(productId);

      const sameType =
        !productType || item.productType === productType;

      return !(sameId && sameType);
    });

    if (cart.items.length === originalLength) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    recalculateCartTotal(cart);

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      data: cart,
    });
  } catch (error) {
    console.error("REMOVE CART ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove product",
      error: error.message,
    });
  }
};

// ======================================================
// CLEAR CART
// ======================================================

exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];
    cart.total = 0;

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared",
      data: cart,
    });
  } catch (error) {
    console.error("CLEAR CART ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to clear cart",
      error: error.message,
    });
  }
};
