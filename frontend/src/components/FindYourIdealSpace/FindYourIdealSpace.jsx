// import React from "react";
// import "./FindYourIdealSpace.css";

// const FindYourIdealSpace = () => {
//   return (
//     <section className="ideal-space-section">
//       <div className="ideal-space-container">

//         {/* TOP CONTENT */}
//         <div className="ideal-space-top">

//           <div className="ideal-space-title">
//             <h2>
//               Find your ideal
//               <br />
//               space
//             </h2>
//           </div>

//           <div className="ideal-space-description">
//             <p>
//               Welcome to the epitome of modern living in our
//               tech-integrated homes. Seamlessly blending
//               cutting-edge technology with elegant design,
//               these residences are equipped with
//               state-of-the-art smart home systems that
//               enhance convenience, security, and energy
//               efficiency.
//             </p>
//           </div>

//         </div>

//         {/* IMAGE */}
//         <div className="ideal-space-image">
//           <img
//             src="/images/feature-house3.jpg"
//             alt="Modern luxury home"
//           />
//         </div>

//         {/* NEWSLETTER CARD */}
//         <div className="ideal-space-newsletter">

//           <h3>
//             Subscribe newsletter and get -20% off
//           </h3>

//           <p>
//             Control your home's lighting, temperature,
//             and entertainment systems with a simple touch
//             or voice command. Embrace the future of living
//             as you experience the effortless integration
//             of technology into every aspect of your daily
//             life.
//           </p>

//           <form
//             className="ideal-space-form"
//             onSubmit={(e) => e.preventDefault()}
//           >
//             <input
//               type="email"
//               placeholder="Enter email address..."
//             />

//             <button type="submit">
//               Subscription
//               <span>↗</span>
//             </button>
//           </form>

//         </div>

//       </div>
//     </section>
//   );
// };

// export default FindYourIdealSpace;



import React, { useEffect, useState } from "react";
import "./FindYourIdealSpace.css";

const API_URL =
  "http://localhost:5000/api/ideal-space";

const defaultData = {
  title: "Find your ideal space",

  description:
    "Welcome to the epitome of modern living in our tech-integrated homes. Seamlessly blending cutting-edge technology with elegant design, these residences are equipped with state-of-the-art smart home systems that enhance convenience, security, and energy efficiency.",

  image: "/images/feature-house3.jpg",

  newsletterTitle:
    "Subscribe newsletter and get -20% off",

  newsletterDescription:
    "Control your home's lighting, temperature, and entertainment systems with a simple touch or voice command. Embrace the future of living as you experience the effortless integration of technology into every aspect of your daily life.",

  emailPlaceholder:
    "Enter email address...",

  buttonText: "Subscription",
};

const FindYourIdealSpace = () => {
  const [data, setData] = useState(defaultData);

  useEffect(() => {
    const fetchIdealSpace = async () => {
      try {
        const response = await fetch(API_URL);

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to fetch Ideal Space"
          );
        }

        if (result.data) {
          setData({
            ...defaultData,
            ...result.data,
          });
        }
      } catch (error) {
        console.error(
          "Ideal Space API Error:",
          error
        );
      }
    };

    fetchIdealSpace();
  }, []);

  return (
    <section className="ideal-space-section">
      <div className="ideal-space-container">

        {/* TOP CONTENT */}
        <div className="ideal-space-top">

          <div className="ideal-space-title">
            <h2>
              {data.title}
            </h2>
          </div>

          <div className="ideal-space-description">
            <p>
              {data.description}
            </p>
          </div>

        </div>

        {/* IMAGE */}
        <div className="ideal-space-image">
          <img
            src={data.image}
            alt="Modern luxury home"
          />
        </div>

        {/* NEWSLETTER CARD */}
        <div className="ideal-space-newsletter">

          <h3>
            {data.newsletterTitle}
          </h3>

          <p>
            {data.newsletterDescription}
          </p>

          <form
            className="ideal-space-form"
            onSubmit={(e) =>
              e.preventDefault()
            }
          >
            <input
              type="email"
              placeholder={
                data.emailPlaceholder
              }
            />

            <button type="submit">
              {data.buttonText}
              <span>↗</span>
            </button>
          </form>

        </div>

      </div>
    </section>
  );
};

export default FindYourIdealSpace;