const Beachfront = require("../models/beachfrontModel");

// GET ALL
exports.getBeachfronts = async (req, res) => {
  try {
    const data = await Beachfront.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET BEACHFRONT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch beachfront data",
      error: error.message,
    });
  }
};

// GET SINGLE
exports.getBeachfrontById = async (req, res) => {
  try {
    const data = await Beachfront.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Beachfront data not found",
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET SINGLE BEACHFRONT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch beachfront data",
      error: error.message,
    });
  }
};

// CREATE
exports.createBeachfront = async (req, res) => {
  try {
    const {
      titleTop,
      title,
      description,
      cards,
      featureImage,
      featureDescription,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    let parsedCards = [];

    if (cards) {
      parsedCards =
        typeof cards === "string"
          ? JSON.parse(cards)
          : cards;
    }

    const data = await Beachfront.create({
      titleTop: titleTop || "",
      title,
      description: description || "",
      cards: parsedCards || [],
      featureImage: featureImage || "",
      featureDescription: featureDescription || "",
    });

    res.status(201).json({
      success: true,
      message: "Beachfront created successfully",
      data,
    });
  } catch (error) {
    console.error("CREATE BEACHFRONT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create beachfront",
      error: error.message,
    });
  }
};

// UPDATE PAGE-LEVEL DETAILS (title, description, feature image, etc.)
// This does NOT touch cards — card edits go through updateBeachfrontCard below.
exports.updateBeachfront = async (req, res) => {
  try {
    const beachfront = await Beachfront.findById(req.params.id);

    if (!beachfront) {
      return res.status(404).json({
        success: false,
        message: "Beachfront data not found",
      });
    }

    const {
      titleTop,
      title,
      description,
      featureImage,
      featureDescription,
    } = req.body;

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Title is required",
        });
      }
      beachfront.title = title.trim();
    }

    if (titleTop !== undefined) {
      beachfront.titleTop = titleTop;
    }

    if (description !== undefined) {
      beachfront.description = description;
    }

    if (featureImage !== undefined) {
      beachfront.featureImage = featureImage;
    }

    if (featureDescription !== undefined) {
      beachfront.featureDescription = featureDescription;
    }

    await beachfront.save();

    res.status(200).json({
      success: true,
      message: "Beachfront page updated successfully",
      data: beachfront,
    });
  } catch (error) {
    console.error("UPDATE BEACHFRONT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update beachfront",
      error: error.message,
    });
  }
};

// UPDATE / ADD SINGLE CARD
exports.updateBeachfrontCard = async (req, res) => {
  try {
    const { id, cardIndex } = req.params;

    const beachfront = await Beachfront.findById(id);

    if (!beachfront) {
      return res.status(404).json({
        success: false,
        message: "Beachfront data not found",
      });
    }

    const index = Number(cardIndex);

    if (Number.isNaN(index) || index < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid card index",
      });
    }

    const { title, image } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Card title is required",
      });
    }

    // Existing card → update
    if (index < beachfront.cards.length) {
      beachfront.cards[index].title = title.trim();

      if (image !== undefined) {
        beachfront.cards[index].image = image;
      }

      await beachfront.save();

      return res.status(200).json({
        success: true,
        message: "Card updated successfully",
        data: beachfront,
      });
    }

    // Next card → add
    if (index === beachfront.cards.length) {
      beachfront.cards.push({
        title: title.trim(),
        image: image || "",
      });

      await beachfront.save();

      return res.status(200).json({
        success: true,
        message: "Card added successfully",
        data: beachfront,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid card index",
    });
  } catch (error) {
    console.error(
      "UPDATE BEACHFRONT CARD ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to save beachfront card",
      error: error.message,
    });
  }
};

// DELETE
exports.deleteBeachfront = async (req, res) => {
  try {
    const data = await Beachfront.findByIdAndDelete(
      req.params.id
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Beachfront data not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Beachfront deleted successfully",
    });
  } catch (error) {
    console.error("DELETE BEACHFRONT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete beachfront",
      error: error.message,
    });
  }
};