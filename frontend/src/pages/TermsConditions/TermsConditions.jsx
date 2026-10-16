import React from "react";
import InnerPageHero from "../../components/InnerPageHero/InnerPageHero";
import "./TermsConditions.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
const TermsConditions = () => {
  return (
    <>
    <Navbar />
    <div className="terms-page">

      {/* Hero */}
      <InnerPageHero
        title="Terms & Conditions"
        description="We value the diverse perspectives and experiences of our users, and we encourage collaboration and community engagement. Our platform provides opportunities for users to contribute their knowledge, share their opinions."
        backText="Back to Home"
        backPath="/"
      />

      {/* Terms Content */}
      <section className="terms-section">
        <div className="terms-container">

          <h2>Terms & Conditions</h2>

          <div className="terms-block">
            <h3>I. GENERAL CONDITIONS</h3>

            <p>
              We reserve the right to refuse service to anyone for any
              reason at any time.
            </p>

            <p>
              You understand that your content (not including credit card
              information), may be transferred unencrypted and involve
              (a) transmissions over various networks; and (b) changes to
              conform and adapt to technical requirements of connecting
              networks or devices. Credit card information is always
              encrypted during transfer over networks.
            </p>

            <p>
              You agree not to reproduce, duplicate, copy, sell, resell or
              exploit any portion of the Service, use of the Service, or
              access to the Service or any contact on the website through
              which the service is provided, without express written
              permission by us.
            </p>

            <p>
              The headings used in this agreement are included for
              convenience only and will not limit or otherwise affect
              these Terms.
            </p>
          </div>

          <div className="terms-block">
            <h3>
              2. ACCURACY, COMPLETENESS AND TIMELINESS OF INFORMATION
            </h3>

            <p>
              We are not responsible if information made available on this
              site is not accurate, complete or current. The material on
              this site is provided for general information only and should
              not be relied upon or used as the sole basis for making
              decisions without consulting primary, more accurate, more
              complete or more timely sources of information. Any reliance
              on the material on this site is at your own risk.
            </p>

            <p>
              This site may contain certain historical information.
              Historical information, necessarily, is not current and is
              provided for your reference only. We reserve the right to
              modify the contents of this site at any time, but we have no
              obligation to update any information on our site. You agree
              that it is your responsibility to monitor changes to our site.
            </p>
          </div>

          <div className="terms-block">
            <h3>
              3. MODIFICATIONS TO THE SERVICE AND PRICES
            </h3>

            <p>
              Prices for our products are subject to change without notice.
            </p>

            <p>
              We reserve the right at any time to modify or discontinue the
              Service (or any part or content thereof) without notice at
              any time.
            </p>

            <p>
              We shall not be liable to you or to any third-party for any
              modification, price change, suspension or discontinuance of
              the Service.
            </p>
          </div>

          <div className="terms-block">
            <h3>
              4. PRODUCTS OR SERVICES (if applicable)
            </h3>

            <p>
              Certain products or services may be available exclusively
              online through the website. These products or services may
              have limited quantities and are subject to return or exchange
              only according to our Return Policy.
            </p>

            <p>
              We have made every effort to display as accurately as
              possible the colors and images of our products that appear
              at the store. We cannot guarantee that your computer
              monitor's display of any color will be accurate.
            </p>

            <p>
              We reserve the right, but are not obligated, to limit the
              sales of our products or Services to any person, geographic
              region or jurisdiction. We may exercise this right on a
              case-by-case basis. We reserve the right to limit the
              quantities of any products or services that we offer.
            </p>

            <p>
              All descriptions of products or product pricing are subject
              to change at any time without notice, at the sole discretion
              of us. We reserve the right to discontinue any product at
              any time.
            </p>

            <p>
              Any offer for any product or service made on this site is
              void where prohibited.
            </p>
          </div>

        </div>
      </section>

    </div>
    <Footer />
    </>
    
  );
};

export default TermsConditions;