



import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Account.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const API = "http://localhost:5000/api/auth";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
        `${API}/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Registration failed"
        );
      }

      alert(
        "Registration successful! Please login."
      );

      navigate("/account/login");
    } catch (error) {
      console.error(
        "REGISTER ERROR:",
        error
      );

      alert(
        error.message ||
          "Something went wrong while registering."
      );
    } finally {
      setLoading(false);
    }
  };

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

          <h1>Register</h1>

        </div>

        {/* REGISTER BOX */}
        <div className="account-box register-box">

          <form onSubmit={handleSubmit}>

            {/* PERSONAL DETAILS */}
            <div className="register-section">

              <div className="account-box-heading">
                <h2>
                  Your Personal Details
                </h2>
              </div>

              <div className="account-form-content">

                <div className="account-two-columns">

                  {/* FIRST NAME */}
                  <div className="account-field">

                    <label>
                      First Name <span>*</span>
                    </label>

                    <input
                      type="text"
                      name="firstName"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />

                  </div>

                  {/* LAST NAME */}
                  <div className="account-field">

                    <label>
                      Last Name <span>*</span>
                    </label>

                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />

                  </div>

                </div>

                {/* EMAIL */}
                <div className="account-field account-full-field">

                  <label>
                    E-mail <span>*</span>
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

            </div>

            {/* PASSWORD */}
            <div className="register-section">

              <div className="account-box-heading">

                <h2>
                  Your <strong>Password</strong>
                </h2>

              </div>

              <div className="account-form-content">

                <div className="account-field">

                  <label>
                    Password <span>*</span>
                  </label>

                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

            </div>

            {/* CREATE */}
            <div className="register-submit-row">

              <button
                type="submit"
                className="account-dark-btn"
                disabled={loading}
              >
                {loading
                  ? "Creating..."
                  : "Create"}

                {!loading && <span>→</span>}
              </button>

            </div>

          </form>

        </div>

      </div>

      <Footer />
    </>
  );
};

export default Register;