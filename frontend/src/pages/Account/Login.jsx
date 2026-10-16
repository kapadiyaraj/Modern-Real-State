


// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "./Account.css";
// import Navbar from "../../components/Navbar/Navbar";
// import Footer from "../../components/Footer/Footer";
// import { useAuth } from "../../context/AuthContext";

// const API = "http://localhost:5000/api/auth";

// const Login = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     setLoading(true);

//     const response = await fetch(`${API}/login`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         email: formData.email,
//         password: formData.password,
//       }),
//     });

//     const result = await response.json();

//     if (!response.ok || !result.success) {
//       throw new Error(result.message || "Login failed");
//     }

//     // ==============================
//     // SAVE JWT + USER
//     // ==============================

//     localStorage.setItem("token", result.token);
//     localStorage.setItem("user", JSON.stringify(result.user));

//     // Keep AuthContext in sync
//     login(result.user, result.token);

//     alert("Login successful!");

//     // ==============================
//     // ROLE BASED REDIRECT
//     // ==============================

//     if (result.user?.role === "admin") {
//       navigate("/admin");
//     } else if (result.user?.role === "subAdmin") {
//       navigate("/sub-admin");
//     } else {
//       navigate("/");
//     }
//   } catch (error) {
//     console.error("LOGIN ERROR:", error);

//     alert(
//       error.message ||
//         "Something went wrong while logging in."
//     );
//   } finally {
//     setLoading(false);
//   }
// };
//   return (
//     <>
//       <Navbar />

//       <div className="account-page">

//         {/* BACK TO SHOP */}
//         <div className="account-top">
//           <Link
//             to="/"
//             className="back-to-shop"
//           >
//             <span>←</span>
//             Back to Shop
//           </Link>

//           <h1>Log In</h1>
//         </div>

//         {/* LOGIN BOX */}
//         <div className="account-box login-box">

//           <div className="account-box-heading">
//             <h2>Log In</h2>
//           </div>

//           <form onSubmit={handleSubmit}>

//             <div className="account-form-content">

//               <p className="returning-customer">
//                 I am a returning customer
//               </p>

//               <div className="account-two-columns">

//                 {/* EMAIL */}
//                 <div className="account-field">

//                   <label>
//                     E-mail <span>*</span>
//                   </label>

//                   <input
//                     type="email"
//                     name="email"
//                     placeholder="Email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                   />

//                 </div>

//                 {/* PASSWORD */}
//                 <div className="account-field">

//                   <label>
//                     Password <span>*</span>
//                   </label>

//                   <input
//                     type="password"
//                     name="password"
//                     placeholder="Password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     required
//                   />

//                 </div>

//               </div>

//             </div>

//             {/* LOGIN ACTION */}
//             <div className="account-action-row">

//               <Link
//                 to="/account/forgot-password"
//                 className="forgot-password"
//               >
//                 Forgot Password?
//               </Link>

//               <button
//                 type="submit"
//                 className="account-dark-btn"
//                 disabled={loading}
//               >
//                 {loading ? "Logging in..." : "Login"}
//                 {!loading && <span>→</span>}
//               </button>

//             </div>

//           </form>

//           {/* REGISTER */}
//           <div className="account-register-row">

//             <span>
//               If you dont have account
//             </span>

//             <Link
//               to="/account/register"
//               className="account-register-btn"
//             >
//               Register
//               <span>→</span>
//             </Link>

//           </div>

//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default Login;



import React, { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import "./Account.css";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import { useAuth } from "../../context/AuthContext";

const API =
  "http://localhost:5000/api/auth";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [loading, setLoading] =
    useState(false);

  // ======================================================
  // INPUT
  // ======================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // ======================================================
  // LOGIN
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
        `${API}/login`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email:
              formData.email.trim(),
            password:
              formData.password,
          }),
        }
      );

      const result =
        await response.json();

      console.log(
        "LOGIN RESPONSE:",
        result
      );

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result?.message ||
            "Login failed"
        );
      }

      // ==================================================
      // TOKEN VALIDATION
      // ==================================================

      if (!result.token) {
        console.error(
          "LOGIN RESPONSE DOES NOT CONTAIN TOKEN:",
          result
        );

        throw new Error(
          "Login successful but JWT token was not received."
        );
      }

      if (!result.user) {
        throw new Error(
          "Login successful but user data was not received."
        );
      }

      // ==================================================
      // CLEAN TOKEN
      // ==================================================

      const cleanToken =
        String(result.token)
          .replace(
            /^Bearer\s+/i,
            ""
          )
          .trim();

      // ==================================================
      // SAVE JWT
      // ==================================================

      localStorage.setItem(
        "token",
        cleanToken
      );

      // ==================================================
      // SAVE USER
      // ==================================================

      localStorage.setItem(
        "user",
        JSON.stringify(
          result.user
        )
      );

      // ==================================================
      // AUTH CONTEXT
      // ==================================================

      const loginSuccess =
        login(
          result.user,
          cleanToken
        );

      if (!loginSuccess) {
        throw new Error(
          "Unable to save login session."
        );
      }

      // ==================================================
      // DEBUG
      // ==================================================

      console.log(
        "TOKEN AFTER LOGIN:",
        localStorage.getItem(
          "token"
        )
      );

      console.log(
        "USER AFTER LOGIN:",
        localStorage.getItem(
          "user"
        )
      );

      console.log(
        "ROLE:",
        result.user?.role
      );

      alert(
        "Login successful!"
      );

      // ==================================================
      // ROLE BASED REDIRECT
      // ==================================================

      if (
        result.user?.role ===
        "admin"
      ) {
        navigate("/admin");
      } else if (
        result.user?.role ===
        "subAdmin"
      ) {
        navigate("/sub-admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      alert(
        error.message ||
          "Something went wrong while logging in."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <>
      <Navbar />

      <div className="account-page">

        {/* BACK TO SHOP */}

        <div className="account-top">

          <Link
            to="/"
            className="back-to-shop"
          >
            <span>←</span>
            Back to Shop
          </Link>

          <h1>
            Log In
          </h1>

        </div>

        {/* LOGIN BOX */}

        <div className="account-box login-box">

          <div className="account-box-heading">

            <h2>
              Log In
            </h2>

          </div>

          <form
            onSubmit={handleSubmit}
          >

            <div className="account-form-content">

              <p className="returning-customer">
                I am a returning customer
              </p>

              <div className="account-two-columns">

                {/* EMAIL */}

                <div className="account-field">

                  <label>
                    E-mail{" "}
                    <span>*</span>
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>

                {/* PASSWORD */}

                <div className="account-field">

                  <label>
                    Password{" "}
                    <span>*</span>
                  </label>

                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={
                      formData.password
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>

              </div>

            </div>

            {/* LOGIN ACTION */}

            <div className="account-action-row">

              <Link
                to="/account/forgot-password"
                className="forgot-password"
              >
                Forgot Password?
              </Link>

              <button
                type="submit"
                className="account-dark-btn"
                disabled={loading}
              >

                {loading
                  ? "Logging in..."
                  : "Login"}

                {!loading && (
                  <span>
                    →
                  </span>
                )}

              </button>

            </div>

          </form>

          {/* REGISTER */}

          <div className="account-register-row">

            <span>
              If you dont have account
            </span>

            <Link
              to="/account/register"
              className="account-register-btn"
            >
              Register
              <span>
                →
              </span>
            </Link>

             <Link
              to="/sub-admin/register"
              className="account-register-btn"
            >
              sub-admin Register
              <span>
                →
              </span>
            </Link>

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default Login;