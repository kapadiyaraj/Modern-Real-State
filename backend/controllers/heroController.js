const HeroSlide = require("../models/HeroSlide");

// GET ALL SLIDES
const getHeroSlides = async (req, res) => {
  try {
    const slides = await HeroSlide.find().sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: slides,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch hero slides",
      error: error.message,
    });
  }
};


// GET SINGLE SLIDE
const getHeroSlide = async (req, res) => {
  try {
    const slide = await HeroSlide.findById(req.params.id);

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: "Hero slide not found",
      });
    }

    res.status(200).json({
      success: true,
      data: slide,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch hero slide",
      error: error.message,
    });
  }
};


// CREATE SLIDE
const createHeroSlide = async (req, res) => {
  try {
    const slide = await HeroSlide.create(req.body);

    res.status(201).json({
      success: true,
      message: "Hero slide created successfully",
      data: slide,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create hero slide",
      error: error.message,
    });
  }
};


// UPDATE SLIDE
const updateHeroSlide = async (req, res) => {
  try {
    const updateData = {
      location: req.body.location,
      title: req.body.title,
      description: req.body.description,
      buttonText: req.body.buttonText,
      buttonUrl: req.body.buttonUrl,
    };

    // bottomCard comes as JSON string from FormData
    if (req.body.bottomCard) {
      updateData.bottomCard = JSON.parse(
        req.body.bottomCard
      );
    }

    // If a new image was selected
    if (req.file) {
      updateData.bgImage = `/uploads/${req.file.filename}`;
    }

    const slide = await HeroSlide.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: "Hero slide not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Hero slide updated successfully",
      data: slide,
    });
  } catch (error) {
    console.error("UPDATE HERO ERROR:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// DELETE SLIDE
const deleteHeroSlide = async (req, res) => {
  try {
    const slide = await HeroSlide.findByIdAndDelete(req.params.id);

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: "Hero slide not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Hero slide deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete hero slide",
      error: error.message,
    });
  }
};


module.exports = {
  getHeroSlides,
  getHeroSlide,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
};