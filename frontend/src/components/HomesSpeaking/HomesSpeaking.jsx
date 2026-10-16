// import React, { useState } from "react";
// import "./HomesSpeaking.css";

// const homes = [
//   {
//     id: 1,
//     category: "realestate",
//     image: "/images/home-place-1.jpg",
//     date: "25 May 2023",
//     author: "WorkDo",
//     title: "Dream House Diaries Points...",
//     description:
//       "where we challenge conventional notions of luxury living and explore the unique joys of prioritizing points over penthouses. In a world where material...",
//   },
//   {
//     id: 2,
//     category: "realestate",
//     image: "/images/home-place-2.jpg",
//     date: "25 May 2023",
//     author: "WorkDo",
//     title: "A one-story house with a...",
//     description:
//       "Single-Story Bliss, a delightful residence offering the perfect combination of comfort, relaxation, and outdoor enjoyment. This one-...",
//   },
//   {
//     id: 3,
//     category: "realestate",
//     image: "/images/home-place-3.jpg",
//     date: "25 May 2023",
//     author: "WorkDo",
//     title: "A modern double house in th...",
//     description:
//       "Forest Haven, a remarkable retreat nestled amidst the serene beauty of the forest. This modern double house offers a unique blend of contemporar...",
//   },
//   {
//     id: 4,
//     category: "realestate",
//     image: "/images/home-place-4.jpg",
//     date: "25 May 2023",
//     author: "WorkDo",
//     title: "A modern home in the...",
//     description:
//       "a contemporary residence offering the perfect blend of modern design and the comforts of San Francisco living. Nestled in the heart of this vibrant cit...",
//   },
//   {
//     id: 5,
//     category: "realestate",
//     image: "/images/feature-house.jpg",
//     date: "25 May 2023",
//     author: "WorkDo",
//     title: "Modern Luxury Residence...",
//     description:
//       "Discover a beautifully designed residence where modern architecture, comfortable interiors and elegant outdoor spaces come together...",
//   },
//   {
//     id: 6,
//     category: "realestate",
//     image: "/images/properties.jpg",
//     date: "25 May 2023",
//     author: "WorkDo",
//     title: "Family Villa Living...",
//     description:
//       "A spacious family villa designed for peaceful living with modern facilities, elegant surroundings and comfortable spaces for everyone...",
//   },
// ];

// const HomesSpeaking = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);

//   const visibleCount = 4;

//   const nextSlide = () => {
//     setCurrentSlide((prev) => (prev + 1) % homes.length);
//   };

//   const prevSlide = () => {
//     setCurrentSlide(
//       (prev) => (prev - 1 + homes.length) % homes.length
//     );
//   };

//   const visibleHomes = Array.from(
//     { length: visibleCount },
//     (_, index) => {
//       return homes[(currentSlide + index) % homes.length];
//     }
//   );

//   return (
//     <section className="homes-speaking">
//       <div className="homes-speaking-container">

//         {/* HEADING */}
//         <h2 className="homes-speaking-title">
//           Homes speaking for themselves
//         </h2>

//         {/* CARDS */}
//         <div className="homes-slider-wrapper">
//           <div className="homes-slider">
//             {visibleHomes.map((home) => (
//               <article
//                 className="home-speaking-card"
//                 key={home.id}
//               >
//                 {/* IMAGE */}
//                 <div className="home-speaking-image">

//                   <img
//                     src={home.image}
//                     alt={home.title}
//                   />

//                   <span className="home-speaking-category">
//                     {home.category}
//                   </span>

//                 </div>

//                 {/* CONTENT */}
//                 <div className="home-speaking-content">

//                   <div className="home-speaking-meta">
//                     {home.date} | {home.author}
//                   </div>

//                   <h3>{home.title}</h3>

//                   <p>{home.description}</p>

//                   <button
//                     type="button"
//                     className="home-speaking-button"
//                   >
//                     Show full details
//                     <span>→</span>
//                   </button>

//                 </div>
//               </article>
//             ))}
//           </div>
//         </div>

//         {/* SLIDER CONTROLS */}
//         <div className="homes-speaking-controls">

//           <button
//             type="button"
//             className="homes-speaking-arrow"
//             onClick={prevSlide}
//             aria-label="Previous"
//           >
//             ←
//           </button>

//           <div className="homes-speaking-line">
//             <div
//               className="homes-speaking-progress"
//               style={{
//                 width: `${
//                   ((currentSlide + 1) / homes.length) * 100
//                 }%`,
//               }}
//             ></div>
//           </div>

//           <button
//             type="button"
//             className="homes-speaking-arrow"
//             onClick={nextSlide}
//             aria-label="Next"
//           >
//             →
//           </button>

//         </div>

//       </div>
//     </section>
//   );
// };

// export default HomesSpeaking;



import React, { useEffect, useState } from "react";
import "./HomesSpeaking.css";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/homes-speaking";

const HomesSpeaking = () => {
  const [homes, setHomes] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
const navigate = useNavigate();
  const visibleCount = 4;

  // ==========================================
  // GET HOMES FROM MONGODB
  // ==========================================
  useEffect(() => {
    const fetchHomes = async () => {
      try {
        const response = await fetch(API_URL);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to fetch Homes Speaking data"
          );
        }

        if (result.success && Array.isArray(result.data)) {
          setHomes(result.data);
        } else {
          setHomes([]);
        }
      } catch (error) {
        console.error("Homes Speaking API Error:", error);
        setHomes([]);
      }
    };

    fetchHomes();
  }, []);

  // ==========================================
  // NEXT SLIDE
  // ==========================================
  const nextSlide = () => {
    if (homes.length === 0) return;

    setCurrentSlide((prev) => (prev + 1) % homes.length);
  };

  // ==========================================
  // PREVIOUS SLIDE
  // ==========================================
  const prevSlide = () => {
    if (homes.length === 0) return;

    setCurrentSlide(
      (prev) => (prev - 1 + homes.length) % homes.length
    );
  };

  // ==========================================
  // VISIBLE HOMES
  // ==========================================
  const visibleHomes = Array.from(
    {
      length: Math.min(visibleCount, homes.length),
    },
    (_, index) => {
      return homes[(currentSlide + index) % homes.length];
    }
  );

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <section className="homes-speaking">
      <div className="homes-speaking-container">

        {/* HEADING */}
        <h2 className="homes-speaking-title">
          Homes speaking for themselves
        </h2>

        {/* CARDS */}
        <div className="homes-slider-wrapper">
          <div className="homes-slider">
            {visibleHomes.map((home) => (
              <article
                className="home-speaking-card"
                key={home.id}
              >
                {/* IMAGE */}
                <div className="home-speaking-image">

                  {/* <img
                    src={home.image}
                    alt={home.title}
                  /> */}

                  <img
  src={
    home.image?.startsWith("http")
      ? home.image
      : `http://localhost:5000${home.image}`
  }
  alt={home.title}
/>

                  <span className="home-speaking-category">
                    {home.category}
                  </span>

                </div>

                {/* CONTENT */}
                <div className="home-speaking-content">

                  <div className="home-speaking-meta">
                    {home.date} | {home.author}
                  </div>

                  <h3>{home.title}</h3>

                  <p>{home.description}</p>

                  <button
                    type="button"
                    className="home-speaking-button"
                     onClick={() =>
    navigate(`/homes-speaking/${home.id}`)
  }
                  >
                    Show full details
                    <span>→</span>
                  </button>

                </div>
              </article>
            ))}
          </div>
        </div>

        {/* SLIDER CONTROLS */}
        <div className="homes-speaking-controls">

          <button
            type="button"
            className="homes-speaking-arrow"
            onClick={prevSlide}
            aria-label="Previous"
          >
            ←
          </button>

          <div className="homes-speaking-line">
            <div
              className="homes-speaking-progress"
              style={{
                width: `${
                  homes.length > 0
                    ? ((currentSlide + 1) / homes.length) * 100
                    : 0
                }%`,
              }}
            ></div>
          </div>

          <button
            type="button"
            className="homes-speaking-arrow"
            onClick={nextSlide}
            aria-label="Next"
          >
            →
          </button>

        </div>

      </div>
    </section>
  );
};

export default HomesSpeaking;