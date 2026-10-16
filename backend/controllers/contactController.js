const Contact = require("../models/contactModel");

// CREATE CONTACT
exports.createContact = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      description,
    } = req.body;

    if (!firstName || !lastName || !email || !description) {
      return res.status(400).json({
        success: false,
        message:
          "First name, last name, email and description are required",
      });
    }

    const contact = await Contact.create({
      firstName,
      lastName,
      email,
      phone,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: contact,
    });
  } catch (error) {
    console.error("CREATE CONTACT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// GET ALL CONTACTS
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    console.error("GET CONTACTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// GET SINGLE CONTACT
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error("GET CONTACT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// DELETE CONTACT
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.error("DELETE CONTACT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};