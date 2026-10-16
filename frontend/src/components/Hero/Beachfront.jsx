// import React, { useState } from "react";
// import "./Beachfront.css";

// const Beachfront = ({ data }) => {
//   const defaultData = {
//     titleTop: "Contemporary",
//     title: "Beachfront Properties",

//     description:
//       "From the organic architecture to the use of eco-friendly materials, these homes provide a sanctuary where you can live in harmony with nature without compromising on luxury or style.",

//     cards: [
//       {
//         title: "Royal House",
//         image: "/images/royal-house.jpg",
//       },
//       {
//         title: "Properties",
//         image: "/images/properties.jpg",
//       },
//       {
//         title: "Farm Vila",
//         image: "/images/farm-vila.jpg",
//       },
//         {
//         title: "Royal House",
//         image: "/images/royal-house.jpg",
//       },
//       {
//         title: "Properties",
//         image: "/images/properties.jpg",
//       },
//       {
//         title: "Farm Vila",
//         image: "/images/farm-vila.jpg",
//       },
    
    
//     ],

//     featureImage: "/images/feature-house.jpg",

//     featureDescription:
//       "Immerse yourself in a welcoming community with top-rated schools, parks, and recreational facilities just moments away. Create lasting memories as you enjoy the comfort, convenience, and tranquility that these modern family homes offer.",
//   };

//   const beachfrontData = data || defaultData;

//   const cards = beachfrontData.cards || [];

//   const [currentIndex, setCurrentIndex] = useState(0);

//   // Desktop = 3 cards
//   const visibleCards = 3;

//   const nextSlide = () => {
//     if (cards.length <= visibleCards) return;

//     setCurrentIndex((prev) => {
//       const next = prev + 1;

//       return next > cards.length - visibleCards ? 0 : next;
//     });
//   };

//   const prevSlide = () => {
//     if (cards.length <= visibleCards) return;

//     setCurrentIndex((prev) => {
//       const previous = prev - 1;

//       return previous < 0 ? cards.length - visibleCards : previous;
//     });
//   };

//   const displayedCards = cards
//     .slice(currentIndex, currentIndex + visibleCards)
//     .concat(
//       cards.slice(
//         0,
//         Math.max(0, currentIndex + visibleCards - cards.length)
//       )
//     );

//   return (
//     <section className="beachfront-section">
//       <div className="beachfront-container">

//         {/* LEFT SIDE */}
//         <div className="beachfront-left">

//           <div className="beachfront-heading">
//             <span>{beachfrontData.titleTop}</span>
//             <h2>{beachfrontData.title}</h2>
//           </div>

//           <p className="beachfront-description">
//             {beachfrontData.description}
//           </p>

//           {/* PROPERTY CARDS */}
//           <div className="beachfront-cards">
//             {displayedCards.map((card, index) => (
//               <div
//                 className="beachfront-card"
//                 key={`${card.title}-${index}`}
//               >
//                 <div className="beachfront-card-image">
//                   <img
//                     src={card.image}
//                     alt={card.title}
//                   />
//                 </div>

//                 <div className="beachfront-card-info">
//                   <h3>{card.title}</h3>
//                   <span>→</span>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* SLIDER CONTROLS */}
//           <div className="beachfront-controls">

//             <button
//               type="button"
//               onClick={prevSlide}
//               aria-label="Previous property"
//             >
//               ←
//             </button>

//             <div className="beachfront-line">
//               <span
//                 style={{
//                   width:
//                     cards.length > 0
//                       ? `${Math.min(
//                           100,
//                           ((currentIndex + visibleCards) /
//                             cards.length) *
//                             100
//                         )}%`
//                       : "0%",
//                 }}
//               />
//             </div>

//             <button
//               type="button"
//               onClick={nextSlide}
//               aria-label="Next property"
//             >
//               →
//             </button>

//           </div>
//         </div>

//         {/* RIGHT SIDE */}
//         <div className="beachfront-right">

//           <div className="beachfront-feature-image">
//             <img
//               src={beachfrontData.featureImage}
//               alt="Featured property"
//             />
//           </div>

//           <p>
//             {beachfrontData.featureDescription}
//           </p>

//         </div>

//       </div>
//     </section>
//   );
// };

// export default Beachfront;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Beachfront.css";

const API = "http://localhost:5000/api/beachfront";
const SERVER = "http://localhost:5000";

const Beachfront = () => {
  const [beachfrontData, setBeachfrontData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();


  // ==========================================
  // IMAGE URL (same logic as AdminBeachfront)
  // ==========================================
  const getImageUrl = (image) => {
    if (!image) return "";

    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("data:image")
    ) {
      return image;
    }

    if (image.startsWith("/uploads/")) {
      return `${SERVER}${image}`;
    }

    if (image.startsWith("uploads/")) {
      return `${SERVER}/${image}`;
    }

    if (image.startsWith("/")) {
      return image;
    }

    return `${SERVER}/${image}`;
  };

  // ==========================================
  // FETCH FROM API
  // ==========================================
  useEffect(() => {
    const fetchBeachfront = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch beachfront data");
        }

        const items = result.data || [];

        if (items.length > 0) {
          setBeachfrontData(items[0]);
        } else {
          setBeachfrontData(null);
        }
      } catch (err) {
        console.error("Beachfront API Error:", err);
        setError("Unable to load beachfront properties.");
        setBeachfrontData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBeachfront();
  }, []);

  const cards = beachfrontData?.cards || [];

  const handleCardClick = (title) => {
  const routeMap = {
    "Royal House": "/collections/royal-house",
    "Properties": "/collections/properties",
    "Farma Villa": "/collections/farm-vila",
    "Farm Vila": "/collections/farm-vila",
    "Luxury Properties": "/collections/luxury-properties",
    "Best seller":"/collections/bestseller",
  };

  const route = routeMap[title];

  if (route) {
    navigate(route);
  }
};

  const [currentIndex, setCurrentIndex] = useState(0);

  // Desktop = 3 cards
  const visibleCards = 3;

  const nextSlide = () => {
    if (cards.length <= visibleCards) return;

    setCurrentIndex((prev) => {
      const next = prev + 1;
      return next > cards.length - visibleCards ? 0 : next;
    });
  };

  const prevSlide = () => {
    if (cards.length <= visibleCards) return;

    setCurrentIndex((prev) => {
      const previous = prev - 1;
      return previous < 0 ? cards.length - visibleCards : previous;
    });
  };

  const displayedCards = cards
    .slice(currentIndex, currentIndex + visibleCards)
    .concat(
      cards.slice(0, Math.max(0, currentIndex + visibleCards - cards.length))
    );

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <section className="beachfront-section">
        <div className="beachfront-container">
          <p style={{ padding: "40px" }}>Loading beachfront properties...</p>
        </div>
      </section>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================
  if (error) {
    return (
      <section className="beachfront-section">
        <div className="beachfront-container">
          <p style={{ padding: "40px" }}>{error}</p>
        </div>
      </section>
    );
  }

  // ==========================================
  // NO DATA IN MONGODB
  // ==========================================
  if (!beachfrontData) {
    return (
      <section className="beachfront-section">
        <div className="beachfront-container">
          <p style={{ padding: "40px" }}>
            No beachfront properties available.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="beachfront-section">
      <div className="beachfront-container">

        {/* LEFT SIDE */}
        <div className="beachfront-left">

          <div className="beachfront-heading">
            <span>{beachfrontData.titleTop}</span>
            <h2>{beachfrontData.title}</h2>
          </div>

          <p className="beachfront-description">
            {beachfrontData.description}
          </p>

          {/* PROPERTY CARDS */}
          <div className="beachfront-cards">
            {displayedCards.map((card, index) => (
              // <div
              //   className="beachfront-card"
              //   key={`${card.title}-${index}`}
              // >
              <div
  className="beachfront-card"
  key={`${card.title}-${index}`}
  onClick={() => handleCardClick(card.title)}
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      handleCardClick(card.title);
    }
  }}
>
                <div className="beachfront-card-image">
                  <img
                    src={getImageUrl(card.image)}
                    alt={card.title}
                  />
                </div>

                <div className="beachfront-card-info">
                  <h3>{card.title}</h3>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>

          {/* SLIDER CONTROLS */}
          {cards.length > 0 && (
            <div className="beachfront-controls">

              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous property"
              >
                ←
              </button>

              <div className="beachfront-line">
                <span
                  style={{
                    width:
                      cards.length > 0
                        ? `${Math.min(
                            100,
                            ((currentIndex + visibleCards) / cards.length) * 100
                          )}%`
                        : "0%",
                  }}
                />
              </div>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next property"
              >
                →
              </button>

            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="beachfront-right">

          {beachfrontData.featureImage && (
            <div className="beachfront-feature-image">
              <img
                src={getImageUrl(beachfrontData.featureImage)}
                alt="Featured property"
              />
            </div>
          )}

          <p>
            {beachfrontData.featureDescription}
          </p>

        </div>

      </div>
    </section>
  );
};

export default Beachfront;