// const fs = require("fs");
// const path = require("path");

// const HomesSpeaking = require("../models/HomesSpeaking");

// // =========================================================
// // GET ALL HOMES
// // =========================================================

// const getHomes = async (req, res) => {
//   try {
//     const homes = await HomesSpeaking.find().sort({
//       id: -1,
//     });

//     res.status(200).json({
//       success: true,
//       count: homes.length,
//       data: homes,
//     });
//   } catch (error) {
//     console.error("Get Homes Error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch Homes Speaking data",
//       error: error.message,
//     });
//   }
// };

// // =========================================================
// // GET SINGLE HOME
// // =========================================================

// const getHomeById = async (req, res) => {
//   try {
//     const homeId = Number(req.params.id);

//     const home = await HomesSpeaking.findOne({
//       id: homeId,
//     });

//     if (!home) {
//       return res.status(404).json({
//         success: false,
//         message: "Home not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: home,
//     });
//   } catch (error) {
//     console.error("Get Home Error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch home",
//       error: error.message,
//     });
//   }
// };

// // =========================================================
// // CREATE HOME
// // =========================================================

// const createHome = async (req, res) => {
//   try {
//     const {
//       category,
//       date,
//       author,
//       title,
//       description,
//     } = req.body;

//     if (!title || !description) {
//       if (req.file) {
//         fs.unlinkSync(req.file.path);
//       }

//       return res.status(400).json({
//         success: false,
//         message: "Title and Description are required",
//       });
//     }

//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "Please select an image",
//       });
//     }

//     // =====================================================
//     // GENERATE ID
//     // =====================================================

//     const lastHome = await HomesSpeaking.findOne().sort({
//       id: -1,
//     });

//     const homeId = lastHome
//       ? Number(lastHome.id) + 1
//       : 1;

//     // =====================================================
//     // IMAGE PATH
//     // =====================================================

//     const image = `/uploads/homes-speaking/${req.file.filename}`;

//     // =====================================================
//     // CREATE
//     // =====================================================

//     const home = await HomesSpeaking.create({
//       id: homeId,
//       category: category || "realestate",
//       image,
//       date: date || "",
//       author: author || "",
//       title: title.trim(),
//       description: description.trim(),
//     });

//     res.status(201).json({
//       success: true,
//       message: "Home added successfully",
//       data: home,
//     });
//   } catch (error) {
//     console.error("Create Home Error:", error);

//     if (req.file && fs.existsSync(req.file.path)) {
//       fs.unlinkSync(req.file.path);
//     }

//     res.status(500).json({
//       success: false,
//       message: "Failed to create home",
//       error: error.message,
//     });
//   }
// };

// // =========================================================
// // UPDATE HOME
// // =========================================================

// const updateHome = async (req, res) => {
//   try {
//     const homeId = Number(req.params.id);

//     const home = await HomesSpeaking.findOne({
//       id: homeId,
//     });

//     if (!home) {
//       if (req.file && fs.existsSync(req.file.path)) {
//         fs.unlinkSync(req.file.path);
//       }

//       return res.status(404).json({
//         success: false,
//         message: "Home not found",
//       });
//     }

//     const oldImage = home.image;

//     // =====================================================
//     // UPDATE TEXT DATA
//     // =====================================================

//     home.category =
//       req.body.category ?? home.category;

//     home.date =
//       req.body.date ?? home.date;

//     home.author =
//       req.body.author ?? home.author;

//     home.title =
//       req.body.title?.trim() || home.title;

//     home.description =
//       req.body.description?.trim() ||
//       home.description;

//     // =====================================================
//     // UPDATE IMAGE ONLY IF NEW IMAGE SELECTED
//     // =====================================================

//     if (req.file) {
//       home.image = `/uploads/homes-speaking/${req.file.filename}`;
//     }

//     await home.save();

//     // =====================================================
//     // DELETE OLD IMAGE
//     // =====================================================

//     if (req.file && oldImage) {
//       const oldImagePath = path.join(
//         __dirname,
//         "..",
//         oldImage.replace(/^\/+/, "")
//       );

//       if (
//         fs.existsSync(oldImagePath)
//       ) {
//         fs.unlinkSync(oldImagePath);
//       }
//     }

//     res.status(200).json({
//       success: true,
//       message: "Home updated successfully",
//       data: home,
//     });
//   } catch (error) {
//     console.error("Update Home Error:", error);

//     if (req.file && fs.existsSync(req.file.path)) {
//       fs.unlinkSync(req.file.path);
//     }

//     res.status(500).json({
//       success: false,
//       message: "Failed to update home",
//       error: error.message,
//     });
//   }
// };

// // =========================================================
// // DELETE HOME
// // =========================================================

// const deleteHome = async (req, res) => {
//   try {
//     const homeId = Number(req.params.id);

//     const home =
//       await HomesSpeaking.findOneAndDelete({
//         id: homeId,
//       });

//     if (!home) {
//       return res.status(404).json({
//         success: false,
//         message: "Home not found",
//       });
//     }

//     // =====================================================
//     // DELETE IMAGE
//     // =====================================================

//     if (home.image) {
//       const imagePath = path.join(
//         __dirname,
//         "..",
//         home.image.replace(/^\/+/, "")
//       );

//       if (fs.existsSync(imagePath)) {
//         fs.unlinkSync(imagePath);
//       }
//     }

//     res.status(200).json({
//       success: true,
//       message: "Home deleted successfully",
//       data: home,
//     });
//   } catch (error) {
//     console.error("Delete Home Error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to delete home",
//       error: error.message,
//     });
//   }
// };

// module.exports = {
//   getHomes,
//   getHomeById,
//   createHome,
//   updateHome,
//   deleteHome,
// };





const fs = require("fs");
const path = require("path");

const HomesSpeaking = require("../models/HomesSpeaking");

// =========================================================
// GET ALL HOMES
// =========================================================

const getHomes = async (req, res) => {
  try {
    const homes = await HomesSpeaking.find().sort({
      id: -1,
    });

    res.status(200).json({
      success: true,
      count: homes.length,
      data: homes,
    });
  } catch (error) {
    console.error("Get Homes Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch Homes Speaking data",
      error: error.message,
    });
  }
};

// =========================================================
// GET SINGLE HOME
// =========================================================

const getHomeById = async (req, res) => {
  try {
    const homeId = Number(req.params.id);

    const home = await HomesSpeaking.findOne({
      id: homeId,
    });

    if (!home) {
      return res.status(404).json({
        success: false,
        message: "Home not found",
      });
    }

    res.status(200).json({
      success: true,
      data: home,
    });
  } catch (error) {
    console.error("Get Home Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch home",
      error: error.message,
    });
  }
};

// =========================================================
// CREATE HOME
// =========================================================

const createHome = async (req, res) => {
  try {
    const {
      category,
      date,
      author,
      title,
      description,
      detailedDescription,
      additionalDescription,
      quote,
      tags,
    } = req.body;

    // =====================================================
    // VALIDATION
    // =====================================================

    if (!title || !description) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(400).json({
        success: false,
        message: "Title and Description are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image",
      });
    }

    // =====================================================
    // GENERATE ID
    // =====================================================

    const lastHome = await HomesSpeaking.findOne().sort({
      id: -1,
    });

    const homeId = lastHome
      ? Number(lastHome.id) + 1
      : 1;

    // =====================================================
    // IMAGE PATH
    // =====================================================

    const image = `/uploads/homes-speaking/${req.file.filename}`;

    // =====================================================
    // PARSE TAGS
    // =====================================================

    let parsedTags = [];

    if (tags) {
      try {
        parsedTags = Array.isArray(tags)
          ? tags
          : JSON.parse(tags);
      } catch {
        parsedTags = String(tags)
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
      }
    }

    // =====================================================
    // CREATE HOME
    // =====================================================

    const home = await HomesSpeaking.create({
      id: homeId,

      category:
        category || "realestate",

      image,

      date:
        date || "",

      author:
        author || "",

      title:
        title.trim(),

      description:
        description.trim(),

      detailedDescription:
        detailedDescription?.trim() || "",

      additionalDescription:
        additionalDescription?.trim() || "",

      quote:
        quote?.trim() || "",

      tags: parsedTags,
    });

    res.status(201).json({
      success: true,
      message: "Home added successfully",
      data: home,
    });
  } catch (error) {
    console.error("Create Home Error:", error);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: "Failed to create home",
      error: error.message,
    });
  }
};

// =========================================================
// UPDATE HOME
// =========================================================

const updateHome = async (req, res) => {
  try {
    const homeId = Number(req.params.id);

    const home = await HomesSpeaking.findOne({
      id: homeId,
    });

    if (!home) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(404).json({
        success: false,
        message: "Home not found",
      });
    }

    const oldImage = home.image;

    // =====================================================
    // UPDATE BASIC DATA
    // =====================================================

    home.category =
      req.body.category ?? home.category;

    home.date =
      req.body.date ?? home.date;

    home.author =
      req.body.author ?? home.author;

    home.title =
      req.body.title?.trim() || home.title;

    home.description =
      req.body.description?.trim() ||
      home.description;

    // =====================================================
    // UPDATE DETAILS DATA
    // =====================================================

    home.detailedDescription =
      req.body.detailedDescription?.trim() ??
      home.detailedDescription;

    home.additionalDescription =
      req.body.additionalDescription?.trim() ??
      home.additionalDescription;

    home.quote =
      req.body.quote?.trim() ??
      home.quote;

    // =====================================================
    // UPDATE TAGS
    // =====================================================

    if (req.body.tags !== undefined) {
      try {
        home.tags = Array.isArray(req.body.tags)
          ? req.body.tags
          : JSON.parse(req.body.tags);
      } catch {
        home.tags = String(req.body.tags)
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
      }
    }

    // =====================================================
    // UPDATE IMAGE
    // =====================================================

    if (req.file) {
      home.image =
        `/uploads/homes-speaking/${req.file.filename}`;
    }

    await home.save();

    // =====================================================
    // DELETE OLD IMAGE
    // =====================================================

    if (req.file && oldImage) {
      const oldImagePath = path.join(
        __dirname,
        "..",
        oldImage.replace(/^\/+/, "")
      );

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    res.status(200).json({
      success: true,
      message: "Home updated successfully",
      data: home,
    });
  } catch (error) {
    console.error("Update Home Error:", error);

    if (
      req.file &&
      fs.existsSync(req.file.path)
    ) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: "Failed to update home",
      error: error.message,
    });
  }
};

// =========================================================
// DELETE HOME
// =========================================================

const deleteHome = async (req, res) => {
  try {
    const homeId = Number(req.params.id);

    const home =
      await HomesSpeaking.findOneAndDelete({
        id: homeId,
      });

    if (!home) {
      return res.status(404).json({
        success: false,
        message: "Home not found",
      });
    }

    // =====================================================
    // DELETE IMAGE
    // =====================================================

    if (home.image) {
      const imagePath = path.join(
        __dirname,
        "..",
        home.image.replace(/^\/+/, "")
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.status(200).json({
      success: true,
      message: "Home deleted successfully",
      data: home,
    });
  } catch (error) {
    console.error("Delete Home Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete home",
      error: error.message,
    });
  }
};

module.exports = {
  getHomes,
  getHomeById,
  createHome,
  updateHome,
  deleteHome,
};