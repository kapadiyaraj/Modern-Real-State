import React from "react";

import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import Beachfront from "../../components/Hero/Beachfront";
import PropertySection from "../../components/PropertySection/PropertySection";
import SpaciousLiving from "../../components/SpaciousLiving/SpaciousLiving";
import LuxuriousProperties from "../../components/PropertySection/LuxuriousProperties";
import PenthouseProperties from "../../components/PenthouseProperties/PenthouseProperties";
import FindYourIdealSpace from "../../components/FindYourIdealSpace/FindYourIdealSpace";
import HomesSpeaking from "../../components/HomesSpeaking/HomesSpeaking";
import Footer from "../../components/Footer/Footer";

const Home = () => {
  return (
    <div className="home-page">
      <Navbar />

      <Hero />

      <Beachfront />

      <PropertySection />

      <SpaciousLiving />

      <LuxuriousProperties />

      <PenthouseProperties />

      <FindYourIdealSpace />

      <HomesSpeaking />

      <Footer />
    </div>
  );
};

export default Home;