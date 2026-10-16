const About = require("../models/aboutmodel");

// GET: About ડેટા મેળવવા માટે
exports.getAboutData = async (req, res) => {
  try {
    let data = await About.findOne();

    if (!data) {
      return res.status(200).json({
        hero: {
          title: "About us",
          description:
            "At AboutUs, we are a dynamic and innovative company committed to providing comprehensive information and valuable insights on a wide range of topics.",
        },
        intro: {
          title: "Be clear and concise",
          leftText:
            "At Modern Real Estate, we are dedicated to redefining the real estate experience...",
          rightText: "With years of industry experience...",
        },
        mainHeading:
          "The world needs to move fast to make a meaning against climate change.",
        storySections: [
          {
            id: 1,
            title: "Make it inviting and engaging",
            image: "/images/feature-house1.jpg",
            paragraphs: [
              "we provide comprehensive support at every stage...",
              "At Modern Real Estate, we prioritize our clients' needs above all else...",
            ],
          },
          {
            id: 2,
            title: "Find your perfect place",
            image: "/images/feature-house3.jpg",
            paragraphs: [
              "Our goal is to make finding the right property simple, transparent...",
              "From modern apartments to spacious family homes...",
            ],
          },
        ],
        services: [
          {
            id: 1,
            title: "Fast delivery",
            icon: "⚒",
            description: "The specific delivery time will vary...",
          },
          {
            id: 2,
            title: "Many offers",
            icon: "⚙",
            description: "CMS also offers a variety of training...",
          },
          {
            id: 3,
            title: "24/7 support",
            icon: "⌕",
            description: "CMS Service support is available 24 hours...",
          },
        ],
      });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


exports.saveAboutData = async (req, res) => {
  try {
    console.log("Received body:", req.body); // ← temp debug line

    const { hero, intro, mainHeading, storySections, services } = req.body;
    let data = await About.findOne();

    if (data) {
      data.hero = hero;
      data.intro = intro;
      data.mainHeading = mainHeading;
      data.storySections = storySections;
      data.services = services;
      await data.save();
    } else {
      data = new About({ hero, intro, mainHeading, storySections, services });
      await data.save();
    }

    res.status(200).json({ message: "About data updated successfully", data });
  } catch (error) {
    console.error("SAVE ABOUT ERROR:", error); // ← this will show the real stack trace
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};