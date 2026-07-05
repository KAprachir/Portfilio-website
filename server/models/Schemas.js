const mongoose = require('mongoose');

// 1. Hero Schema
const HeroSchema = new mongoose.Schema({
  title: { type: String, required: true },
  typingTexts: [{ type: String }],
  subtitle: { type: String, required: true },
  resumeUrl: { type: String },
  // About Me Section
  aboutTitle: { type: String },
  aboutBio: [{ type: String }],
  aboutWhoami: { type: String },
  aboutLocation: { type: String },
  aboutStatus: { type: String },
  aboutGoal: { type: String }
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

// 5. Message Schema
const MessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

// 6. Post (Blog) Schema
const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  summary: { type: String, required: true },
  tags: [{ type: String }],
  readTime: { type: String },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

// 7. Qualification Schema
const QualificationSchema = new mongoose.Schema({
  type: { type: String, enum: ['Education', 'Experience'], required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  duration: { type: String, required: true },
  details: [{ type: String }],
  tags: [{ type: String }],
  certUrl: { type: String }
}, { timestamps: true });

module.exports = {
  Hero: mongoose.model('Hero', HeroSchema),
  Skill: mongoose.model('Skill', SkillSchema),
  Project: mongoose.model('Project', ProjectSchema),
  Admin: mongoose.model('Admin', AdminSchema),
  Message: mongoose.model('Message', MessageSchema),
  Post: mongoose.model('Post', PostSchema),
  Qualification: mongoose.model('Qualification', QualificationSchema)
};
