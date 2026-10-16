const mongoose = require("mongoose");

const heroSchema = new mongoose.Schema(
  {
    title: { type: String, default: "About us" },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const introSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    leftText: { type: String, default: "" },
    rightText: { type: String, default: "" },
  },
  { _id: false }
);

const storySectionSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    title: { type: String, default: "" },
    image: { type: String, default: "" },
    paragraphs: { type: [String], default: [] },
  },
  { _id: false }
);

const serviceSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    title: { type: String, default: "" },
    icon: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const aboutSchema = new mongoose.Schema(
  {
    hero: { type: heroSchema, default: () => ({}) },
    intro: { type: introSchema, default: () => ({}) },
    mainHeading: { type: String, default: "" },
    storySections: { type: [storySectionSchema], default: [] },
    services: { type: [serviceSchema], default: [] },
  },
  { timestamps: true }
);

// IMPORTANT
const About = mongoose.model("About", aboutSchema);

module.exports = About;