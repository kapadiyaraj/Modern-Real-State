import React, { useEffect, useState } from "react";
import InnerPageHero from "../../components/InnerPageHero/InnerPageHero";
import "./FAQ.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5000/api/faq";

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const response = await fetch(API_URL);
      const result = await response.json();

      if (result.success) {
        setFaqs(result.data || []);
      }
    } catch (error) {
      console.error("FAQ fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFAQ = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <>
    <Navbar />  
    <div className="faq-page">

      <InnerPageHero
        title="Faq"
        description="People will always seek help and advice. They are unwilling to pick up the phone, walk into a store, or wait hours (even minutes) for that information or insight to become accessible."
        backText="Back to Home"
        backPath="/"
      />

      <section className="faq-section">
        <div className="faq-container">

          <h2 className="faq-section-title">
            About shop
          </h2>

          {loading ? (
            <div className="faq-message">
              Loading...
            </div>
          ) : faqs.length === 0 ? (
            <div className="faq-message">
              No FAQs available.
            </div>
          ) : (
            <div className="faq-grid">

              {faqs.map((faq) => (
                <div
                  className={`faq-item ${
                    openId === faq._id
                      ? "faq-item-open"
                      : ""
                  }`}
                  key={faq._id}
                >

                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => toggleFAQ(faq._id)}
                  >
                    <span>{faq.question}</span>

                    <span className="faq-arrow">
                      {openId === faq._id ? "⌃" : "⌄"}
                    </span>
                  </button>

                  {openId === faq._id && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}

                </div>
              ))}

            </div>
          )}

        </div>
      </section>

    </div>

    <Footer />
    </>
    
  );
};

export default FAQ;