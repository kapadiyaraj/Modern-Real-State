const IdealSpace = require("../models/idealSpacemodel");

// GET DATA
const getIdealSpace = async (req, res) => {
  try {
    let data = await IdealSpace.findOne();

    // First time હોય ત્યારે default document create
    if (!data) {
      data = await IdealSpace.create({
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
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch Ideal Space data",
      error: error.message,
    });
  }
};

// UPDATE DATA
const updateIdealSpace = async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      newsletterTitle,
      newsletterDescription,
      emailPlaceholder,
      buttonText,
    } = req.body;

    let data = await IdealSpace.findOne();

    if (!data) {
      data = new IdealSpace();
    }

    data.title = title ?? data.title;
    data.description = description ?? data.description;
    data.image = image ?? data.image;
    data.newsletterTitle =
      newsletterTitle ?? data.newsletterTitle;
    data.newsletterDescription =
      newsletterDescription ??
      data.newsletterDescription;
    data.emailPlaceholder =
      emailPlaceholder ?? data.emailPlaceholder;
    data.buttonText =
      buttonText ?? data.buttonText;

    await data.save();

    res.status(200).json({
      success: true,
      message: "Ideal Space updated successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update Ideal Space",
      error: error.message,
    });
  }
};

// RESET DATA
const resetIdealSpace = async (req, res) => {
  try {
    const data = await IdealSpace.findOne();

    if (data) {
      await IdealSpace.deleteOne({
        _id: data._id,
      });
    }

    res.status(200).json({
      success: true,
      message: "Ideal Space reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to reset Ideal Space",
      error: error.message,
    });
  }
};

module.exports = {
  getIdealSpace,
  updateIdealSpace,
  resetIdealSpace,
};