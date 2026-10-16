import React, { useEffect, useState } from "react";
import InnerPageHero from "../../components/InnerPageHero/InnerPageHero";
import "./Contact.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
const Contact = () => {
  const [hero, setHero] = useState({
    title: "Contact with us",
    description:
      "With that in mind, we strive to deliver accurate, trustworthy, and engaging content to our users.",
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  // Fetch Hero Data
  useEffect(() => {
    const fetchHero = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/about"
        );

        const result = await response.json();

        if (result?.hero) {
          setHero({
            title: result.hero.title || "Contact with us",
            description: result.hero.description || "",
          });
        }
      } catch (error) {
        console.error("Hero API Error:", error);
      }
    };

    fetchHero();
  }, []);

  // Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.description
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Something went wrong.");
        return;
      }

      alert("Message sent successfully!");

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        description: "",
      });
    } catch (error) {
      console.error("Contact Submit Error:", error);
      alert("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar />
    <div className="contact-page">

      {/* Hero */}
     <InnerPageHero
  title="Contact with us"
  description={hero.description || ""}
  backText="Back to Home"
  backPath="/"
/>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="contact-container">

          {/* Contact Information */}
          <div className="contact-info">

            <div className="contact-info-item">
              <span className="contact-info-label">
                CALL US
              </span>

              <a href="tel:+48002132-12">
                +48 0021-32-12
              </a>
            </div>

            <div className="contact-info-item">
              <span className="contact-info-label">
                EMAIL:
              </span>

              <a href="mailto:shop@company.com">
                shop@company.com
              </a>
            </div>

            <div className="contact-info-item">
              <span className="contact-info-label">
                ADDRESS:
              </span>

              <p>
                1093 Marigold Lane,
                <br />
                Miami, Florida, 33169
              </p>
            </div>

          </div>

          {/* Contact Form */}
          <div className="contact-form-wrapper">

            <h2 className="contact-form-title">
              Contact form
            </h2>

            <form
              className="contact-form"
              onSubmit={handleSubmit}
            >

              <div className="contact-form-row">

                <div className="contact-form-group">
                  <label>
                    First name <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>

                <div className="contact-form-group">
                  <label>
                    Last name <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>

              </div>

              <div className="contact-form-row">

                <div className="contact-form-group">
                  <label>
                    Email <span>*</span>
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder="shop@company.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="contact-form-group">
                  <label>
                    Phone number <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

              </div>

              <div className="contact-form-group contact-description">
                <label>Description:</label>

                <textarea
                  name="description"
                  placeholder="How Can We Help?"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="contact-submit-btn"
                disabled={loading}
              >
                {loading
                  ? "Sending..."
                  : "Send Message →"}
              </button>

            </form>

          </div>

        </div>
      </section>

      <section className="contact-map">
      <iframe
        title="Modern Real Estate Location"
        src="https://www.google.com/maps?q=1-2%20Adam%20Court,%20Sraid%20Grafton,%20Dublin%202,%20Ireland&output=embed"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </section>

    </div>
    <Footer />
    </>
    
  );
};

export default Contact;