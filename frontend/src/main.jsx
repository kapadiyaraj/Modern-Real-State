// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )



// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.jsx";
// import { AuthProvider } from "./context/AuthContext.jsx";

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <AuthProvider>
//       <App />
//     </AuthProvider>
//   </StrictMode>,
// );


// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";

// import "./index.css";

// import App from "./App.jsx";

// import {
//   AuthProvider,
// } from "./context/AuthContext.jsx";

// import {
//   WishlistProvider,
// } from "./context/WishlistContext.jsx";

// createRoot(
//   document.getElementById("root")
// ).render(
//   <StrictMode>
//     <AuthProvider>
//       <WishlistProvider>
//         <App />
//       </WishlistProvider>
//     </AuthProvider>
//   </StrictMode>
// );



import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import App from "./App.jsx";

import {
  AuthProvider,
} from "./context/AuthContext.jsx";

import {
  WishlistProvider,
} from "./context/WishlistContext.jsx";

import {
  CartProvider,
} from "./context/CartContext.jsx";

import {
  CompareProvider,
} from "./context/CompareContext.jsx";

createRoot(
  document.getElementById("root")
).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <CompareProvider>
            <App />
          </CompareProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);