import React from "react";
import { useNavigate } from "react-router-dom";
import "./InnerPageHero.css";

const InnerPageHero = ({
  title,
  description,
  backText = "Back to Home",
  backPath = "/",
}) => {
  const navigate = useNavigate();

  return (
    <section className="inner-page-hero">
   

      <div className="inner-page-hero-container">
        <button
          type="button"
          className="inner-page-hero-back"
          onClick={() => navigate(backPath)}
        >
          <span className="inner-page-hero-arrow">←</span>
          <span>{backText}</span>
        </button>

        <div className="inner-page-hero-content">
          <h1>{title}</h1>

          {description && <p>{description}</p>}
        </div>
      </div>
    </section>
  );
};

export default InnerPageHero;