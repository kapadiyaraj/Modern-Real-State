const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./config/db");

const heroRoutes = require("./routes/heroRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const spaciousLivingRoutes = require("./routes/spaciousLivingRoutes");
const luxuriousPropertiesRoutes = require("./routes/luxuriousPropertiesRoutes");
const penthousePropertiesRoutes = require("./routes/penthousePropertiesRoutes");
const idealSpaceRoutes = require("./routes/idealSpaceroutes");
const homesSpeakingRoutes = require("./routes/homesSpeakingRoutes");
const aboutRoutes = require("./routes/aboutroutes");
const contactRoutes = require("./routes/contactRoutes");
const faqRoutes = require("./routes/faqRoutes");
const beachfrontRoutes = require("./routes/beachfrontRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const CompareRoutes= require("./routes/compareRoutes");
const propertyReviewRoutes = require(
  "./routes/propertyReviewRoutes"
);
const homeCommentRoutes = require("./routes/homeCommentRoutes");
dotenv.config();
const emailNotificationRoutes = require(
  "./routes/emailNotificationRoutes"
);
const subAdminKYCRoutes =
  require("./routes/subAdminKYCRoutes");

  const revenueRoutes = require("./routes/revenueRoutes");

const app = express();

// ======================================================
// MIDDLEWARE
// ======================================================

app.use(cors());

// IMPORTANT:
// Frontend images are being sent as Base64 strings.
// Therefore JSON payload needs a larger limit.
//
// DO NOT add another express.json() above/below this.
app.use(
  express.json({
    limit: "25mb",
  })
);

app.use(
  express.urlencoded({
    limit: "25mb",
    extended: true,
  })
);

// ======================================================
// UPLOADED IMAGES
// ======================================================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// ======================================================
// DATABASE
// ======================================================

connectDB();

// ======================================================
// API ROUTES
// ======================================================

app.use(
  "/api/hero",
  heroRoutes
);

app.use(
  "/api/properties",
  propertyRoutes
);

app.use(
  "/api/spacious-living",
  spaciousLivingRoutes
);

app.use(
  "/api/luxurious-properties",
  luxuriousPropertiesRoutes
);

app.use("/api/penthouse-properties", penthousePropertiesRoutes);

app.use(
  "/api/ideal-space",
  idealSpaceRoutes
);

app.use(
  "/api/homes-speaking",
  homesSpeakingRoutes
);

app.use("/api/about", aboutRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/contact", contactRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/beachfront", beachfrontRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/wishlist", wishlistRoutes)
app.use("/api/compare",CompareRoutes)
app.use(
  "/api/property-reviews",
  propertyReviewRoutes
);
app.use(
  "/api/home-comments",
  homeCommentRoutes
);

app.use(
  "/api/subadmin/kyc",
  subAdminKYCRoutes
);
// ======================================================
// ROOT
// ======================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "Modern Real Estate Backend is running",
  });
});


app.use(
  "/api/email-notifications",
  emailNotificationRoutes
);


app.use("/api/revenue", revenueRoutes);

// ======================================================
// SERVER
// ======================================================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});