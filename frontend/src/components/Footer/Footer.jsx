import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">

        {/* NEWSLETTER */}
        <div className="footer-column footer-newsletter">
          <h3>Subscribe newsletter and get -20% off</h3>

          <p>
            Discover the perfect family haven in our spacious suburban
            residences. These thoughtfully designed homes provide ample
            room for your growing family to thrive.
          </p>
        </div>

        {/* SHOP */}
        <div className="footer-column">
          <h3>Shop:</h3>

          <a href="#">Search</a>
          <a href="#">All collections</a>
          <a href="#">All products</a>
          <a href="#">My Cart</a>
        </div>

        {/* ACCOUNT */}
        <div className="footer-column">
          <h3>Account:</h3>

          <a href="#">About us</a>
          <a href="#">Contact with us</a>
          <a href="#">Faq</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Shipping &amp; Delivery</a>
          <a href="#">Terms &amp; Conditions</a>
          <a href="#">Wishlist</a>
        </div>

        {/* SHARE */}
        <div className="footer-column">
          <h3>Share:</h3>

          <a href="#">Youtube</a>
          <a href="#">Facebook</a>
          <a href="#">Instagram</a>
          <a href="#">Twitter</a>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">

        <p>
          © 2026, Modernrealestate WorkDo, Powered by WorkDo.io
        </p>

        <div className="payment-methods">
          <span className="payment visa">VISA</span>
          <span className="payment mastercard">●●</span>
          <span className="payment amex">AMEX</span>
          <span className="payment paypal">P</span>
          <span className="payment discover">DISCOVER</span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;