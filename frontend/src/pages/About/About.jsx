import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import InnerPageHero from "../../components/InnerPageHero/InnerPageHero";
import "./About.css";

const API_URL = "http://localhost:5000/api/about";
const SERVER_URL = "http://localhost:5000";

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch(API_URL);
        const result = await response.json();
        setAboutData(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching about data:", error);
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  // Resolve a stored path (e.g. "/uploads/about/x.jpg") into a full URL.
  // Default static images (e.g. "/images/feature-house1.jpg") are left as-is.
  const resolveImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/uploads")) return `${SERVER_URL}${imagePath}`;
    return imagePath;
  };

  if (loading) {
    return <div className="about-loading">Loading...</div>;
  }

  const hero = aboutData?.hero || {};
  const intro = aboutData?.intro || {};
  const mainHeading = aboutData?.mainHeading || "";
  const aboutSections = aboutData?.storySections || [];
  const services = aboutData?.services || [];

  return (
    <div className="about-page">
      <Navbar />

      {/* Page Hero */}
      <InnerPageHero
        title={hero.title || "About us"}
        description={hero.description || ""}
        backText="Back to Home"
        backPath="/"
      />

      {/* First About Section */}
      <section className="about-intro">
        <div className="about-intro-container">
          <h2>{intro.title}</h2>

          <div className="about-intro-grid">
            <p>{intro.leftText}</p>
            <p>{intro.rightText}</p>
          </div>
        </div>
      </section>

      {/* Main Heading */}
      <section className="about-main-heading">
        <div className="about-main-heading-container">
          <h2>{mainHeading}</h2>
        </div>
      </section>

      {/* Dynamic Image + Text Sections */}
      <section className="about-story">
        <div className="about-story-container">
          {aboutSections.map((section, index) => (
            <div
              className={`about-story-row ${
                index % 2 === 0 ? "text-right-image" : "image-left-text"
              }`}
              key={section.id || index}
            >
              {/* Text */}
              <div className="about-story-content">
                <h2>{section.title}</h2>

                {section.paragraphs &&
                  section.paragraphs.map((paragraph, paragraphIndex) => (
                    <p key={paragraphIndex}>{paragraph}</p>
                  ))}
              </div>

              {/* Image */}
              <div className="about-story-image">
                {section.image && (
                  <img src={resolveImageUrl(section.image)} alt={section.title} />
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Our Services */}
      <section className="about-services">
        <div className="about-services-container">
          <div className="about-services-header">
            <h2>About our services</h2>
            <p>
              Our mission is to empower individuals with knowledge and facilitate
              meaningful connections through our platform.
            </p>
          </div>

          <div className="about-services-grid">
            {services.map((service, index) => (
              <div className="about-service-card" key={service.id || index}>
                <div className="about-service-card-header">
                  <h3>{service.title}</h3>
                  <span className="about-service-icon">{service.icon}</span>
                </div>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;