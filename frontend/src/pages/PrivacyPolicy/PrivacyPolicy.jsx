import React from "react";
import InnerPageHero from "../../components/InnerPageHero/InnerPageHero";
import "./PrivacyPolicy.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";


const PrivacyPolicy = () => {
  // ==========================================
  // HARDCODED HERO DATA
  // ==========================================
  const hero = {
    title: "Privacy Policy",
    description:
      "We value the diverse perspectives and experiences of our users, and we encourage collaboration and community engagement. Our platform provides opportunities for users to contribute their knowledge, share their opinions.",
  };

  return (
    <>

    <Navbar/>
     <div className="privacy-policy-page">

      {/* ==========================================
          INNER PAGE HERO
      ========================================== */}
      <InnerPageHero
        title={hero.title || "About us"}
        description={hero.description || ""}
        backText="Back to Home"
        backPath="/"
      />

      {/* ==========================================
          PRIVACY POLICY CONTENT
      ========================================== */}
      <main className="privacy-policy-content">

        <div className="privacy-policy-container">

          <h1>Privacy Policy</h1>

          <p>
            When you visit the Site, we automatically collect certain
            information about your device, including information about your
            web browser, IP address, time zone, and some of the cookies that
            are installed on your device. Additionally, as you browse the
            Site, we collect information about the individual web pages or
            products that you view, what websites or search terms referred
            you to the Site, and information about how you interact with the
            Site. We refer to this automatically-collected information as
            “Device Information”.
          </p>

          <p>
            Additionally when you make a purchase or attempt to make a
            purchase through the Site, we collect certain information from
            you, including your name, billing address, shipping address,
            payment information, email address, and phone number. We refer
            to this information as “Order Information”. When we talk about
            “Personal Information” in this Privacy Policy, we are talking
            both about Device Information and Order Information.
          </p>

          <h2>How do we use your personal information?</h2>

          <p>
            We use the Order Information that we collect generally to fulfill
            any orders placed through the Site (including processing your
            payment information, arranging for shipping, and providing you
            with invoices and/or order confirmations). Additionally, we use
            this Order Information to:
          </p>

          <ul>
            <li>Communicate with you.</li>
            <li>Screen our orders for potential risk or fraud.</li>
            <li>
              When in line with the preferences you have shared with us.
            </li>
            <li>
              Provide you with information or advertising relating to our
              products or services.
            </li>
          </ul>

          <p>
            We use the Device Information that we collect to help us screen
            for potential risk and fraud (in particular, your IP address),
            and more generally to improve and optimize our Site (for example,
            by generating analytics about how our customers browse and
            interact with the Site, and to assess the success of our
            marketing and advertising campaigns).
          </p>

          <h2>Sharing your personal information</h2>

          <p>
            We may share your Personal Information with third-party service
            providers who help us operate our website, process payments,
            deliver products, provide customer support, and analyze website
            activity.
          </p>

          <p>
            We may also share your information when required by law or when
            we believe disclosure is necessary to protect our rights,
            property, or safety, or the rights, property, or safety of
            others.
          </p>

          <h2>Data retention</h2>

          <p>
            When you place an order through the Site, we will maintain your
            Order Information for our records unless and until you ask us to
            delete this information.
          </p>

          <h2>Your rights</h2>

          <p>
            Depending on your location, you may have certain rights regarding
            your personal information, including the right to request access,
            correction, or deletion of your personal information.
          </p>

          <h2>Changes to this Privacy Policy</h2>

          <p>
            We may update this Privacy Policy from time to time in order to
            reflect changes to our practices or for other operational, legal,
            or regulatory reasons.
          </p>

          <h2>Contact us</h2>

          <p>
            If you have questions about this Privacy Policy or would like to
            exercise any of your rights, please contact us through the
            Contact Us page of our website.
          </p>

        </div>

      </main>

    </div>

    <Footer/>
    </>
   
  );
};

export default PrivacyPolicy;