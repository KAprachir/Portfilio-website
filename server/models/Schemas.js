const mongoose = require('mongoose');

// 1. Hero Schema
const HeroSchema = new mongoose.Schema({
  title: { type: String, required: true },
  typingTexts: [{ type: String }],
  subtitle: { type: String, required: true },
  resumeUrl: { type: String }
}, { timestamps: true });

// 2. Skill Schema
const SkillSchema = new mongoose.Schema({
  category: { type: String, required: true }, // e.g. Frontend, Backend, Languages, Tools
  name: { type: String, required: true },
  icon: { type: String, required: true } // React Icon name, e.g. "FaReact"
}, { timestamps: true });

// 3. Project Schema
const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  longDescription: { type: String },
  features: [{ type: String }],
  stack: [{ type: String }],
  githubClient: { type: String },
  githubServer: { type: String },
  live: { type: String },
  image: { type: String }
}, { timestamps: true });

// 4. Admin Schema
const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

module.exports = {
  Hero: mongoose.model('Hero', HeroSchema),
  Skill: mongoose.model('Skill', SkillSchema),
  Project: mongoose.model('Project', ProjectSchema),
  Admin: mongoose.model('Admin', AdminSchema)
};
