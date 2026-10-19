



// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import { CartProvider } from "./context/CartContext";

// // Protected Route
// import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

// // ================= CLIENT PAGES =================

// import Home from "./pages/Home/Home";
// import About from "./pages/About/About";
// import Compare from "./pages/Compare/Compare";
// import Wishlist from "./pages/Wishlist/Wishlist";
// import Login from "./pages/Account/Login";
// import Register from "./pages/Account/Register";
// import Contact from "./pages/Contact/Contact";
// import FAQ from "./pages/faq/FAQ";
// import TermsConditions from "./pages/TermsConditions/TermsConditions";
// import ShippingPolicy from "./pages/ShippingDelivery/ShippingDelivery";
// import Collections from "./components/Hero/innerHeroSlider/Collections";
// import CollectionProducts from "./components/Hero/innerHeroSlider/CollectionProducts";
// import Cart from "./pages/Cart/Cart";
// import Checkout from "./pages/Checkout/Checkout";
// import HomesSpeakingDetails from  "./components/HomesSpeaking/HomesSpeakingDetails";
// import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";


// // ================= ADMIN PAGES =================

// import HeroAdmin from "./admin/pages/HeroAdmin";
// import PropertyAdmin from "./admin/pages/PropertyAdmin";
// import SpaciousLivingAdmin from "./admin/pages/SpaciousLivingAdmin";
// import LuxuryPropertiesAdmin from "./admin/pages/LuxuryPropertiesAdmin";
// import LuxuryPropertiesAllAdmin from "./admin/pages/LuxuryPropertiesAllAdmin";
// import PenthouseAdmin from "./admin/pages/PenthouseAdmin";
// import PenthouseAllAdmin from "./admin/pages/PenthouseAllAdmin";
// import IdealSpaceAdmin from "./admin/pages/IdealSpaceAdmin";
// import HomesSpeakingAdmin from "./admin/pages/HomesSpeakingAdmin";
// import HomesSpeakingAllAdmin from "./admin/pages/HomesSpeakingAllAdmin";
// import AdminDashboard from "./admin/pages/AdminDashboard";
// import AdminAbout from "./admin/pages/about/AdminAbout";
// import AdminContact from "./admin/pages/contact/AdminContact";
// import AdminFaq from "./admin/pages/faq/AdminFaq";
// import BeachfrontAdmin from "./admin/pages/AdminBeachfront/AdminBeachfront";
// import PropertyDetails from "./pages/PropertyDetails/PropertyDetails";
// import AdminOrders from "./admin/pages/AdminOrders/AdminOrders";; 
// import AdminLuxuryOrders from "./admin/pages/AdminOrders/AdminLuxuryOrders";
// import AdminSpaciousOrders from "./admin/pages/AdminOrders/AdminSpaciousOrders";
// import AdminPenthouseOrders from "./admin/pages/AdminOrders/AdminPenthouseOrders";
// import AdminKYC from "./admin/pages/KYC/AdminKYC";
// import SubAdminKYC from "./admin/pages/SubAdmin/SubAdminKYC";
// import SubAdminRegister from "./admin/pages/SubAdmin/SubAdminRegister";
// import SubAdminDashboard from "./admin/pages/SubAdmin/SubAdminDashboard";
// import SubAdminPropertyAdmin from "./admin/pages/SubAdminPropertyAdmin/SubAdminPropertyAdmin";
// import LuxuryPropertiesSubAdmin from "./admin/pages/SubAdminPropertyAdmin/Luxurysubadmin/LuxuryPropertiesSubAdmin";
// import LuxuryPropertiesAllSubAdmin  from "./admin/pages/SubAdminPropertyAdmin/Luxurysubadmin/LuxuryPropertiesAllSubAdmin";
// import PenthousePropertiesSubAdmin from "./admin/pages/SubAdminPropertyAdmin/Penthousesubadmin/PenthousePropertiesSubAdmin";
// import PenthousePropertiesAllSubAdmin  from "./admin/pages/SubAdminPropertyAdmin/Penthousesubadmin/PenthousePropertiesAllSubAdmin";
// import SpaciousLivingSubAdmin from "./admin/pages/SubAdminPropertyAdmin/Spacioussubadmin/SpaciousLivingSubAdmin";



// import AdminRevenueDashboard from "./admin/pages/AdminRevenueDashboard";
// import SubAdminRevenueDashboard from "./admin/pages/SubAdmin/SubAdminRevenueDashboard";


// import AdminLayout from "./admin/layout/AdminLayout";
// function App() {
//   return (
//     <CartProvider>

//       <Router>

//         <Routes>

//           {/* =====================================================
//               CLIENT SIDE
//           ===================================================== */}

//           <Route
//             path="/"
//             element={<Home />}
//           />

//           <Route
//             path="/about"
//             element={<About />}
//           />

//           <Route
//             path="/contact"
//             element={<Contact />}
//           />

//           <Route
//             path="/compare"
//             element={<Compare />}
//           />

//           <Route
//             path="/wishlist"
//             element={<Wishlist />}
//           />

//           <Route
//             path="/account/login"
//             element={<Login />}
//           />

//           <Route
//             path="/account/register"
//             element={<Register />}
//           />

//           <Route
//             path="/faq"
//             element={<FAQ />}
//           />

//           <Route
//             path="/terms-conditions"
//             element={<TermsConditions />}
//           />

//           <Route
//             path="/shipping-delivery"
//             element={<ShippingPolicy />}
//           />

//           <Route
//             path="/cart"
//             element={<Cart />}
//           />

//           <Route
//             path="/checkout"
//             element={<Checkout />}
//           />

//           <Route
//             path="/collections"
//             element={<Collections />}
//           />

//           <Route
//             path="/collections/:slug"
//             element={<CollectionProducts />}
//           />

//           <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>

          
// <Route
//   path="/sub-admin/kyc"
//   element={<SubAdminKYC />}
// />

// <Route
//   path="/sub-admin/register"
//   element={<SubAdminRegister />}
// />

// <Route
//   path="/sub-admin"
//   element={<SubAdminDashboard />}
// />  

// <Route
//   path="/property-details"
//   element={<PropertyDetails />}
// />


//           {/* =====================================================
//               ADMIN SIDE - PROTECTED ROUTES
//               ONLY ADMIN CAN ACCESS
//           ===================================================== */}

//           <Route
//             element={
//               <ProtectedRoute
//                 allowedRoles={["admin"]}
//               />
//             }
//           >

//             {/* ADMIN DASHBOARD */}
//              <Route
//               path="/admin"
//               element={<AdminDashboard />}
//             /> 
            

//             {/* HERO */}

//             <Route
//               path="/admin/hero"
//               element={<HeroAdmin />}
//             />

//             {/* PROPERTIES */}

//             <Route
//               path="/admin/properties"
//               element={<PropertyAdmin />}
//             />

//             {/* SPACIOUS LIVING */}

//             <Route
//               path="/admin/spacious-living"
//               element={<SpaciousLivingAdmin />}
//             />

//             {/* LUXURY PROPERTIES */}

//             <Route
//               path="/admin/luxury-properties"
//               element={<LuxuryPropertiesAdmin />}
//             />

//             <Route
//               path="/admin/luxury-properties/all"
//               element={<LuxuryPropertiesAllAdmin />}
//             />

//             {/* PENTHOUSE */}

//             <Route
//               path="/admin/penthouse"
//               element={<PenthouseAdmin />}
//             />

//             <Route
//               path="/admin/penthouse/all"
//               element={<PenthouseAllAdmin />}
//             />

//             {/* IDEAL SPACE */}

//             <Route
//               path="/admin/ideal-space"
//               element={<IdealSpaceAdmin />}
//             />

//             {/* HOMES SPEAKING */}

//             <Route
//               path="/admin/homes-speaking"
//               element={<HomesSpeakingAdmin />}
//             />

//             <Route
//               path="/admin/homes-speaking/all"
//               element={<HomesSpeakingAllAdmin />}
//             />

//             {/* ABOUT */}

//             <Route
//               path="/admin/about"
//               element={<AdminAbout />}
//             />

//             {/* CONTACT */}

//             <Route
//               path="/admin/contact"
//               element={<AdminContact />}
//             />

//             {/* FAQ */}

//             <Route
//               path="/admin/faq"
//               element={<AdminFaq />}
//             />

//             {/* BEACHFRONT */}

//             <Route
//               path="/admin/beachfront"
//               element={<BeachfrontAdmin />}
//             />


//             <Route
//   path="/admin/orders"
//   element={<AdminOrders />}
// />

// <Route
//   path="/admin/luxury-orders"
//   element={<AdminLuxuryOrders />}
// />

// <Route
//   path="/admin/spacious-orders"
//   element={<AdminSpaciousOrders />}
// />

// <Route
//   path="/admin/penthouse-orders"
//   element={<AdminPenthouseOrders />}
// />

// {/* <Route
//   path="/property-details"
//   element={<PropertyDetails />}
// /> */}

// <Route
//   path="/homes-speaking/:id"
//   element={<HomesSpeakingDetails />}
// />

// <Route
//   path="/admin/sub-admin/kyc"
//   element={<AdminKYC />}
// />

//           </Route>




//           <Route
//   element={
//     <ProtectedRoute
//       allowedRoles={["subAdmin"]}
//     />
//   }
// >
//   <Route
//     path="/sub-admin/properties"
//     element={
//       <SubAdminPropertyAdmin />
//     }
//   />


//   <Route
//     path="/sub-admin/luxury-properties"
//     element={<LuxuryPropertiesSubAdmin />}
//   />

//   <Route
//     path="/sub-admin/luxury-properties/all"
//     element={<LuxuryPropertiesAllSubAdmin />}
//   />

//     <Route
//     path="/sub-admin/penthouse-properties"
//     element={<PenthousePropertiesSubAdmin />}
//   />

//   <Route
//     path="/sub-admin/penthouse-properties/all"
//     element={<PenthousePropertiesAllSubAdmin />}
//   />

//   <Route
//     path="/sub-admin/spacious-living"
//     element={
//       <SpaciousLivingSubAdmin />
//     }
//   />

// </Route>


// <Route
//   path="/admin/revenue"
//   element={<AdminRevenueDashboard />}
// />

// <Route
//   path="/sub-admin/revenue"
//   element={<SubAdminRevenueDashboard />}
// />
//         </Routes>

//       </Router>

//     </CartProvider>
//   );


// }

// export default App;





import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

// Client pages
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Compare from "./pages/Compare/Compare";
import Wishlist from "./pages/Wishlist/Wishlist";
import Login from "./pages/Account/Login";
import Register from "./pages/Account/Register";
import Contact from "./pages/Contact/Contact";
import FAQ from "./pages/faq/FAQ";
import TermsConditions from "./pages/TermsConditions/TermsConditions";
import ShippingPolicy from "./pages/ShippingDelivery/ShippingDelivery";
import Collections from "./components/Hero/innerHeroSlider/Collections";
import CollectionProducts from "./components/Hero/innerHeroSlider/CollectionProducts";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import HomesSpeakingDetails from "./components/HomesSpeaking/HomesSpeakingDetails";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import PropertyDetails from "./pages/PropertyDetails/PropertyDetails";

// Admin pages
import AdminLayout from "./admin/layout/AdminLayout";
import HeroAdmin from "./admin/pages/HeroAdmin";
import PropertyAdmin from "./admin/pages/PropertyAdmin";
import SpaciousLivingAdmin from "./admin/pages/SpaciousLivingAdmin";
import LuxuryPropertiesAdmin from "./admin/pages/LuxuryPropertiesAdmin";
import LuxuryPropertiesAllAdmin from "./admin/pages/LuxuryPropertiesAllAdmin";
import PenthouseAdmin from "./admin/pages/PenthouseAdmin";
import PenthouseAllAdmin from "./admin/pages/PenthouseAllAdmin";
import IdealSpaceAdmin from "./admin/pages/IdealSpaceAdmin";
import HomesSpeakingAdmin from "./admin/pages/HomesSpeakingAdmin";
import HomesSpeakingAllAdmin from "./admin/pages/HomesSpeakingAllAdmin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminAbout from "./admin/pages/about/AdminAbout";
import AdminContact from "./admin/pages/contact/AdminContact";
import AdminFaq from "./admin/pages/faq/AdminFaq";
import BeachfrontAdmin from "./admin/pages/AdminBeachfront/AdminBeachfront";
import AdminOrders from "./admin/pages/AdminOrders/AdminOrders";
import AdminLuxuryOrders from "./admin/pages/AdminOrders/AdminLuxuryOrders";
import AdminSpaciousOrders from "./admin/pages/AdminOrders/AdminSpaciousOrders";
import AdminPenthouseOrders from "./admin/pages/AdminOrders/AdminPenthouseOrders";
import AdminKYC from "./admin/pages/KYC/AdminKYC";
import AdminRevenueDashboard from "./admin/pages/AdminRevenueDashboard";

// Sub-admin pages
import SubAdminKYC from "./admin/pages/SubAdmin/SubAdminKYC";
import SubAdminRegister from "./admin/pages/SubAdmin/SubAdminRegister";
import SubAdminDashboard from "./admin/pages/SubAdmin/SubAdminDashboard";
import SubAdminPropertyAdmin from "./admin/pages/SubAdminPropertyAdmin/SubAdminPropertyAdmin";
import LuxuryPropertiesSubAdmin from "./admin/pages/SubAdminPropertyAdmin/Luxurysubadmin/LuxuryPropertiesSubAdmin";
import LuxuryPropertiesAllSubAdmin from "./admin/pages/SubAdminPropertyAdmin/Luxurysubadmin/LuxuryPropertiesAllSubAdmin";
import PenthousePropertiesSubAdmin from "./admin/pages/SubAdminPropertyAdmin/Penthousesubadmin/PenthousePropertiesSubAdmin";
import PenthousePropertiesAllSubAdmin from "./admin/pages/SubAdminPropertyAdmin/Penthousesubadmin/PenthousePropertiesAllSubAdmin";
import SpaciousLivingSubAdmin from "./admin/pages/SubAdminPropertyAdmin/Spacioussubadmin/SpaciousLivingSubAdmin";
import SubAdminRevenueDashboard from "./admin/pages/SubAdmin/SubAdminRevenueDashboard";

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* ================= CLIENT SIDE ================= */}

          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/wishlist" element={<Wishlist />} />

          <Route path="/account/login" element={<Login />} />
          <Route path="/account/register" element={<Register />} />

          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/shipping-delivery" element={<ShippingPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:slug" element={<CollectionProducts />} />

          <Route path="/property-details" element={<PropertyDetails />} />
          <Route path="/homes-speaking/:id" element={<HomesSpeakingDetails />} />

          {/* Public sub-admin entry pages retained as in your original App */}
          <Route path="/sub-admin/kyc" element={<SubAdminKYC />} />
          <Route path="/sub-admin/register" element={<SubAdminRegister />} />
          <Route path="/sub-admin" element={<SubAdminDashboard />} />

          {/* ================= PROTECTED ADMIN SIDE ================= */}

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />

              <Route path="/admin/hero" element={<HeroAdmin />} />

              <Route path="/admin/properties" element={<PropertyAdmin />} />

              <Route
                path="/admin/spacious-living"
                element={<SpaciousLivingAdmin />}
              />

              <Route
                path="/admin/luxury-properties"
                element={<LuxuryPropertiesAdmin />}
              />

              <Route
                path="/admin/luxury-properties/all"
                element={<LuxuryPropertiesAllAdmin />}
              />

              <Route path="/admin/penthouse" element={<PenthouseAdmin />} />

              <Route
                path="/admin/penthouse/all"
                element={<PenthouseAllAdmin />}
              />

              <Route
                path="/admin/ideal-space"
                element={<IdealSpaceAdmin />}
              />

              <Route
                path="/admin/homes-speaking"
                element={<HomesSpeakingAdmin />}
              />

              <Route
                path="/admin/homes-speaking/all"
                element={<HomesSpeakingAllAdmin />}
              />

              <Route path="/admin/about" element={<AdminAbout />} />
              <Route path="/admin/contact" element={<AdminContact />} />
              <Route path="/admin/faq" element={<AdminFaq />} />

              <Route
                path="/admin/beachfront"
                element={<BeachfrontAdmin />}
              />

              <Route path="/admin/orders" element={<AdminOrders />} />

              <Route
                path="/admin/luxury-orders"
                element={<AdminLuxuryOrders />}
              />

              <Route
                path="/admin/spacious-orders"
                element={<AdminSpaciousOrders />}
              />

              <Route
                path="/admin/penthouse-orders"
                element={<AdminPenthouseOrders />}
              />

              <Route path="/admin/sub-admin/kyc" element={<AdminKYC />} />

              <Route
                path="/admin/revenue"
                element={<AdminRevenueDashboard />}
              />
            </Route>
          </Route>

          {/* ================= PROTECTED SUB-ADMIN SIDE ================= */}

          <Route element={<ProtectedRoute allowedRoles={["subAdmin"]} />}>
            <Route
              path="/sub-admin/properties"
              element={<SubAdminPropertyAdmin />}
            />

            <Route
              path="/sub-admin/luxury-properties"
              element={<LuxuryPropertiesSubAdmin />}
            />

            <Route
              path="/sub-admin/luxury-properties/all"
              element={<LuxuryPropertiesAllSubAdmin />}
            />

            <Route
              path="/sub-admin/penthouse-properties"
              element={<PenthousePropertiesSubAdmin />}
            />

            <Route
              path="/sub-admin/penthouse-properties/all"
              element={<PenthousePropertiesAllSubAdmin />}
            />

            <Route
              path="/sub-admin/spacious-living"
              element={<SpaciousLivingSubAdmin />}
            />

            <Route
              path="/sub-admin/revenue"
              element={<SubAdminRevenueDashboard />}
            />
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
