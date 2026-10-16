



const PropertyReview = require("../models/PropertyReview");
const Order = require("../models/orderModel");

// =====================================================
// GET REVIEWS
// GET /api/property-reviews/:propertyType/:propertyId
// =====================================================

const getReviews = async (req, res) => {
  try {
    const { propertyType, propertyId } = req.params;

    const normalizedPropertyType = String(propertyType)
      .trim()
      .toLowerCase();

    const normalizedPropertyId = String(propertyId).trim();

    const allowedPropertyTypes = ["property", "luxury", "spacious","penthouse"];

    if (!allowedPropertyTypes.includes(normalizedPropertyType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property type.",
      });
    }

    const reviews = await PropertyReview.find({
      propertyType: normalizedPropertyType,
      propertyId: normalizedPropertyId,
    })
      .sort({
        createdAt: -1,
      })
      .lean();

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error("Get Reviews Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};

// =====================================================
// GET REVIEW SUMMARY
// GET /api/property-reviews/:propertyType/:propertyId/summary
// =====================================================

const getReviewSummary = async (req, res) => {
  try {
    const { propertyType, propertyId } = req.params;

    const normalizedPropertyType = String(propertyType)
      .trim()
      .toLowerCase();

    const normalizedPropertyId = String(propertyId).trim();

    const allowedPropertyTypes = ["property", "luxury", "spacious",];

    if (!allowedPropertyTypes.includes(normalizedPropertyType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property type.",
      });
    }

    const reviews = await PropertyReview.find({
      propertyType: normalizedPropertyType,
      propertyId: normalizedPropertyId,
    }).lean();

    const totalReviews = reviews.length;

    const ratingCounts = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    let totalRating = 0;

    reviews.forEach((review) => {
      const rating = Number(review.rating);

      if (
        Number.isInteger(rating) &&
        rating >= 1 &&
        rating <= 5
      ) {
        ratingCounts[rating] += 1;
        totalRating += rating;
      }
    });

    const averageRating =
      totalReviews > 0
        ? Number(
            (totalRating / totalReviews).toFixed(1)
          )
        : 0;

    res.status(200).json({
      success: true,

      data: {
        totalReviews,
        averageRating,
        ratingCounts,
      },

      // Compatibility
      summary: {
        totalReviews,
        averageRating,
        ratingDistribution: ratingCounts,
        ratingCounts,
      },
    });
  } catch (error) {
    console.error(
      "Get Review Summary Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch review summary",
      error: error.message,
    });
  }
};

// =====================================================
// CREATE REVIEW
// POST /api/property-reviews
// =====================================================

const createReview = async (req, res) => {
  try {
    const {
      propertyId,
      propertyType,
      propertyTitle,
      rating,
      reviewTitle,
      reviewContent,
      displayName,
      email,
    } = req.body;

    // =================================================
    // USER ID FROM JWT
    // =================================================

    const userId = String(
      req.user?.userId ||
        req.user?._id ||
        req.user?.id ||
        ""
    ).trim();

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please login to write a review.",
      });
    }

    // =================================================
    // BASIC VALIDATION
    // =================================================

    if (!propertyId) {
      return res.status(400).json({
        success: false,
        message: "Property ID is required.",
      });
    }

    if (!propertyType) {
      return res.status(400).json({
        success: false,
        message: "Property type is required.",
      });
    }

    // =================================================
    // NORMALIZE VALUES
    // =================================================

    const normalizedPropertyId = String(propertyId).trim();

    const normalizedPropertyType = String(propertyType)
      .trim()
      .toLowerCase();

    // =================================================
    // ALLOWED PROPERTY TYPES
    // =================================================

    const allowedPropertyTypes = [
      "property",
      "luxury",
       "spacious",
       "penthouse"

    ];

    if (!allowedPropertyTypes.includes(normalizedPropertyType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property type.",
      });
    }

    // =================================================
    // RATING VALIDATION
    // =================================================

    if (
      rating === undefined ||
      rating === null ||
      rating === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Please select a rating.",
      });
    }

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    // =================================================
    // REVIEW TITLE
    // =================================================

    if (
      !reviewTitle ||
      !reviewTitle.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Review title is required.",
      });
    }

    // =================================================
    // REVIEW CONTENT
    // =================================================

    if (
      !reviewContent ||
      !reviewContent.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Review content is required.",
      });
    }

    // =================================================
    // DISPLAY NAME
    // =================================================

    if (
      !displayName ||
      !displayName.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Display name is required.",
      });
    }

    // =================================================
    // EMAIL
    // =================================================

    if (
      !email ||
      !email.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    // =================================================
    // TRUSTED USER EMAIL
    // =================================================
    //
    // IMPORTANT:
    // Do NOT use req.body email for authentication.
    // Only JWT email is trusted.
    //
    // =================================================

    const userEmail = String(
      req.user?.email ||
        req.user?.userEmail ||
        ""
    )
      .trim()
      .toLowerCase();

    // =================================================
    // VERIFY PURCHASE + PAYMENT
    // =================================================
    //
    // User can review only when:
    //
    // 1. User is logged in
    // 2. User purchased this exact property
    // 3. Payment status is "paid"
    // 4. Product type matches property type
    //
    // property -> productType: "property"
    // luxury   -> productType: "luxury"
    //
    // =================================================

    const customerConditions = [
      {
        "customer.userId": userId,
        "customer.type": "registered",
      },
    ];

    // Older orders fallback:
    // Only use JWT email, never request body email.
    if (userEmail) {
      customerConditions.push({
        "customer.email": userEmail,
        "customer.type": "registered",
      });
    }

    const purchasedOrder = await Order.findOne({
      paymentStatus: "paid",

      items: {
        $elemMatch: {
          productType: normalizedPropertyType,
          productId: normalizedPropertyId,
        },
      },

      $or: customerConditions,
    }).lean();

    if (!purchasedOrder) {
      console.log(
        "REVIEW PURCHASE CHECK FAILED:",
        {
          userId,
          userEmail,
          propertyId: normalizedPropertyId,
          propertyType: normalizedPropertyType,
        }
      );

      return res.status(403).json({
        success: false,
        message:
          "You can review this property only after purchasing it and completing the payment.",
      });
    }

    console.log(
      "REVIEW PURCHASE VERIFIED:",
      {
        orderId: purchasedOrder._id,
        userId,
        userEmail,
        propertyId: normalizedPropertyId,
        propertyType: normalizedPropertyType,
        paymentStatus:
          purchasedOrder.paymentStatus,
      }
    );

    // =================================================
    // CHECK EXISTING REVIEW
    // =================================================
    //
    // One user can submit only ONE review
    // for the same property.
    //
    // =================================================

    const existingReview =
      await PropertyReview.findOne({
        propertyId: normalizedPropertyId,
        propertyType: normalizedPropertyType,
        userId,
      });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message:
          "You have already reviewed this property.",
      });
    }

    // =================================================
    // REVIEW IMAGES
    // =================================================

    const uploadedFiles = Array.isArray(req.files)
      ? req.files
      : [];

    const media = uploadedFiles
      .slice(0, 3)
      .map(
        (file) =>
          `/uploads/review/${file.filename}`
      );

    // =================================================
    // CREATE REVIEW
    // =================================================

    const review =
      await PropertyReview.create({
        propertyId:
          normalizedPropertyId,

        propertyType:
          normalizedPropertyType,

        propertyTitle:
          propertyTitle?.trim() || "",

        userId,

        rating:
          numericRating,

        reviewTitle:
          reviewTitle.trim(),

        reviewContent:
          reviewContent.trim(),

        displayName:
          displayName.trim(),

        email:
          email.trim().toLowerCase(),

        media,

        verifiedPurchase: true,
      });

    // =================================================
    // SUCCESS RESPONSE
    // =================================================

    return res.status(201).json({
      success: true,

      message:
        "Review submitted successfully.",

      data: review,
    });
  } catch (error) {
    console.error(
      "Create Review Error:",
      error
    );

    // =================================================
    // MONGO DUPLICATE KEY
    // =================================================

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "You have already reviewed this property.",
      });
    }

    // =================================================
    // SERVER ERROR
    // =================================================

    return res.status(500).json({
      success: false,
      message: "Failed to create review.",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE REVIEW
// DELETE /api/property-reviews/:id
// =====================================================

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review =
      await PropertyReview.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    await PropertyReview.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete Review Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete review.",
      error: error.message,
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getReviews,
  getReviewSummary,
  createReview,
  deleteReview,
};