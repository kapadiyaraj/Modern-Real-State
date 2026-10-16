import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SubAdminRegister.css";

const API = "http://localhost:5000/api/auth";

const SubAdminRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API}/sub-admin/register`,
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
            "Sub-Admin registration failed."
        );
      }

      alert(
        "Sub-Admin registration successful! Please login."
      );

      navigate("/account/login");
    } catch (error) {
      console.error(
        "SUB ADMIN REGISTER ERROR:",
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
    <div className="subadmin-register-page">

      <div className="subadmin-register-container">

        {/* TOP */}

        <div className="subadmin-register-top">

          <Link
            to="/account/login"
            className="subadmin-back-link"
          >
            <span>←</span>
            Back to Login
          </Link>

          <h1>Sub-Admin Registration</h1>

          <p>
            Create your Sub-Admin account.
            KYC verification is required before
            managing properties.
          </p>

        </div>

        {/* BOX */}

        <div className="subadmin-register-box">

          <div className="subadmin-register-heading">
            <h2>Account Details</h2>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="subadmin-register-content">

              {/* FIRST / LAST */}

              <div className="subadmin-two-columns">

                <div className="subadmin-field">
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

                <div className="subadmin-field">
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

              <div className="subadmin-field">

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

              {/* PASSWORD */}

              <div className="subadmin-two-columns">

                <div className="subadmin-field">

                  <label>
                    Password <span>*</span>
                  </label>

                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    minLength={6}
                    required
                  />

                </div>

                <div className="subadmin-field">

                  <label>
                    Confirm Password <span>*</span>
                  </label>

                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    minLength={6}
                    required
                  />

                </div>

              </div>

              {/* ROLE INFO */}

              <div className="subadmin-role-info">

                <strong>
                  Account Type
                </strong>

                <span>
                  Sub-Admin
                </span>

              </div>

            </div>

            {/* ACTION */}

            <div className="subadmin-register-action">

              <button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Creating..."
                  : "Create Sub-Admin"}

                {!loading && (
                  <span>→</span>
                )}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default SubAdminRegister;