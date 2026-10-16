

import React, { useEffect, useState } from 'react';
import './Hero.css';

const API_URL = 'http://localhost:5000/api/hero';

// Helper function to prepend backend base URL to relative upload paths
const getImageUrl = (image) => {
  if (!image) return '';
  if (image.startsWith('http')) {
    return image;
  }
  return `http://localhost:5000${image}`;
};

const Hero = () => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPrivacy, setShowPrivacy] = useState(true);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ==============================
  // GET HERO SLIDES FROM BACKEND
  // ==============================
  useEffect(() => {
    const fetchHeroSlides = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error('Failed to fetch hero slides');
        }

        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          setSlides(result.data);
        } else {
          setSlides([]);
        }
      } catch (error) {
        console.error('Hero API Error:', error);
        setError('Unable to load hero slides.');
      } finally {
        setLoading(false);
      }
    };

    fetchHeroSlides();
  }, []);

  // ==============================
  // PREVIOUS SLIDE
  // ==============================
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  // ==============================
  // NEXT SLIDE
  // ==============================
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  // ==============================
  // LOADING
  // ==============================
  if (loading) {
    return (
      <section className="hero-container">
        <div className="hero-content-panel">
          <div className="content-inner">
            <p>Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  // ==============================
  // ERROR
  // ==============================
  if (error) {
    return (
      <section className="hero-container">
        <div className="hero-content-panel">
          <div className="content-inner">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // ==============================
  // NO SLIDES IN DATABASE
  // ==============================
  if (slides.length === 0) {
    return null;
  }

  // ==============================
  // CURRENT SLIDE
  // ==============================
  const currentSlide = slides[currentIndex];

  return (
    <section className="hero-container">

      {/* =====================================
          HERO IMAGE SECTION
      ===================================== */}
      <div
        className="hero-image-wrapper"
        style={{
          backgroundImage: `url(${getImageUrl(currentSlide.bgImage)})`,
        }}
      >

        {/* Hotspot 1 */}
        <button
          className="hotspot hotspot-1"
          aria-label="Hotspot 1"
          type="button"
        >
          +
        </button>

        {/* Hotspot 2 */}
        <button
          className="hotspot hotspot-2"
          aria-label="Hotspot 2"
          type="button"
        >
          +
        </button>

        {/* =====================================
            BOTTOM OVERLAY CARD
        ===================================== */}
        <div className="hero-bottom-card">

          <div className="card-header">

            <span className="card-number-badge">
              {currentSlide.bottomCard?.number || '0'}
            </span>

            <span className="card-title">
              {currentSlide.bottomCard?.title || ''}
            </span>

          </div>

          <p className="card-description">
            {currentSlide.bottomCard?.description || ''}
          </p>

        </div>

      </div>


      {/* =====================================
          HERO CONTENT PANEL
      ===================================== */}
      <div className="hero-content-panel">

        <div className="content-inner">

          {/* =====================================
              LOCATION
          ===================================== */}
          <div className="location-tag">

            <svg
              className="pin-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle
                cx="12"
                cy="12"
                r="8"
              ></circle>

              <circle
                cx="12"
                cy="12"
                r="3"
              ></circle>
            </svg>

            <span>
              {currentSlide.location}
            </span>

          </div>


          {/* =====================================
              TITLE
          ===================================== */}
          <h1 className="hero-heading">
            {currentSlide.title}
          </h1>


          {/* =====================================
              DESCRIPTION
          ===================================== */}
          <p className="hero-text">
            {currentSlide.description}
          </p>


          {/* =====================================
              CTA BUTTON
          ===================================== */}
          <a
            href={currentSlide.buttonUrl}
            className="cta-btn"
          >
            {currentSlide.buttonText} &rarr;
          </a>


          {/* =====================================
              SLIDER CONTROLS
          ===================================== */}
          <div className="slider-controls">

            {/* Previous */}
            <button
              className="slider-arrow"
              onClick={handlePrev}
              aria-label="Previous Slide"
              type="button"
            >
              &larr;
            </button>


            {/* Progress Line */}
            <div className="slider-line-container">

              <div
                className="slider-line-progress"
                style={{
                  width: `${
                    ((currentIndex + 1) / slides.length) * 100
                  }%`,
                }}
              ></div>

            </div>


            {/* Next */}
            <button
              className="slider-arrow"
              onClick={handleNext}
              aria-label="Next Slide"
              type="button"
            >
              &rarr;
            </button>

          </div>

        </div>


        {/* =====================================
            PRIVACY POPUP
        ===================================== */}
        {showPrivacy && (
          <div className="privacy-card">

            <p className="privacy-text">
              By continuing use this site, you agree to the Privacy Policy
            </p>

            <button
              className="privacy-btn"
              onClick={() => setShowPrivacy(false)}
              type="button"
            >
              Accept
            </button>

          </div>
        )}

      </div>

    </section>
  );
};

export default Hero;