require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { Hero, Skill, Project, Admin, Message, Post, Qualification } = require('./models/Schemas');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'jwtsecret';

// Connect to MongoDB Atlas
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Connected successfully to MongoDB Atlas.");
    seedDatabase();
  })
  .catch(err => {
    console.error("MongoDB Atlas connection error:", err);
  });

// JWT Authentication Middleware
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Invalid token" });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: "Authorization header missing" });
  }
};

// ----------------------------------------------------
// Seeding Default Data
// ----------------------------------------------------
async function seedDatabase() {
  try {
    // 1. Seed Admin
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const username = process.env.ADMIN_USERNAME || 'admin';
      const password = process.env.ADMIN_PASSWORD || 'adminpassword';
      const hashedPassword = await bcrypt.hash(password, 10);
      await Admin.create({ username, password: hashedPassword });
      console.log(`Default admin account created: username="${username}"`);
    }

    // 2. Seed Hero
    const heroCount = await Hero.countDocuments();
    if (heroCount === 0) {
      await Hero.create({
        title: "Prachir",
        typingTexts: ["MIS Student", "Web Developer", "Future Technical Product Manager"],
        subtitle: "Crafting precise digital experiences through code and product strategy. Bridging the gap between technical complexity and user-centric design.",
        resumeUrl: "/Khairul_Alam_Prachir_CV_ATS.pdf",
        aboutTitle: "Building the Future",
        aboutBio: [
          "I'm a final-year BBA student majoring in MIS at Begum Rokeya University, Rangpur, Bangladesh.",
          "My journey started with a fascination for how software can solve business problems. Today, I build web applications and think deeply about product strategy.",
          "I'm passionate about the intersection of business and technology. My goal is to evolve from a developer into a Technical Product Manager."
        ],
        aboutWhoami: "Prachir — MIS Student + Dev",
        aboutLocation: "Rangpur, Bangladesh 🇧🇩",
        aboutStatus: "Open to intern/junior dev roles",
        aboutGoal: "Full Stack Dev → TPM"
      });
      console.log("Default Hero data seeded.");
    }

    // 3. Seed Skills
    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      const defaultSkills = [
        // Frontend
        { category: "Frontend", name: "HTML", icon: "FaHtml5" },
        { category: "Frontend", name: "CSS", icon: "FaCss3Alt" },
        { category: "Frontend", name: "Tailwind CSS", icon: "SiTailwindcss" },
        { category: "Frontend", name: "React", icon: "FaReact" },
        { category: "Frontend", name: "Next.js", icon: "SiNextdotjs" },
        // Backend
        { category: "Backend", name: "Node.js", icon: "FaNodeJs" },
        { category: "Backend", name: "Express.js", icon: "SiExpress" },
        { category: "Backend", name: "MongoDB", icon: "SiMongodb" },
        // Languages
        { category: "Languages", name: "JavaScript", icon: "FaJs" },
        { category: "Languages", name: "Python", icon: "FaPython" },
        // Tools
        { category: "Tools", name: "Git", icon: "FaGitAlt" },
        { category: "Tools", name: "GitHub", icon: "FaGithub" },
        { category: "Tools", name: "Figma", icon: "FaFigma" },
        { category: "Tools", name: "Vercel", icon: "SiVercel" },
        { category: "Tools", name: "VS Code", icon: "VscVscode" }
      ];
      await Skill.insertMany(defaultSkills);
      console.log("Default Skills data seeded.");
    }

    // 4. Seed Projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      const defaultProjects = [
        {
          title: "RecipeHub",
          description: "A full-stack recipe sharing platform where food enthusiasts can create, discover, and manage recipes. Features role-based access control, premium memberships, and moderation tools.",
          longDescription: "RecipeHub is a full-stack recipe sharing platform built for food enthusiasts. Free users can post up to 2 recipes, while upgrading to a premium membership via Stripe unlocks unlimited publishing. The platform implements secure session-based authentication using Better Auth, and integrates robust admin moderation utilities to manage offensive or copyrighted content.",
          features: [
            "Role-based access (User vs Admin) & recipe moderation",
            "Stripe-integrated subscriptions for unlimited recipe publishing",
            "Dynamic MongoDB filtering by category, pagination, and real-time likes/favorites"
          ],
          stack: ["Next.js", "Tailwind CSS", "HeroUI", "Framer Motion", "Node.js", "Express.js", "MongoDB", "Better Auth", "Stripe"],
          githubClient: "https://github.com/KAprachir/recipehub-client",
          githubServer: "https://github.com/KAprachir/recipehub-server",
          live: "https://recipehub-client-kappa.vercel.app",
          image: "/RecipeHub Picture.png"
        },
        {
          title: "HireLoop",
          description: "A premium career portal designed to bridge the gap between job seekers and employers. Features a custom candidate pipeline, recruiter analytics, and subscription tiers.",
          longDescription: "HireLoop is a premium career portal designed to bridge the gap between job seekers, recruiters, and platform administrators. Recruiters can purchase subscription tiers to unlock recruiter capabilities, post jobs, and manage candidates. Job seekers can build their profiles, apply to jobs, and track their application progress through a dedicated applicant tracking pipeline.",
          features: [
            "Three roles: Seeker, Recruiter, and Admin, each with unique dashboards",
            "Custom Applicant Tracking System (ATS) pipeline workflow",
            "Subscription analytics dashboard and Stripe payment integration"
          ],
          stack: ["Next.js", "Tailwind CSS", "HeroUI", "Motion", "Node.js", "Express.js", "MongoDB", "Better Auth", "Stripe"],
          githubClient: "https://github.com/KAprachir/HireLoop-Client",
          githubServer: "https://github.com/KAprachir/HireLoop-Server",
          live: "https://hire-loop-client-eta.vercel.app",
          image: "/Hireloop picture.png"
        },
        {
          title: "IdeaVault",
          description: "A collaborative platform where entrepreneurs and innovators share, discover, and validate startup ideas through community engagement and peer feedback.",
          longDescription: "IdeaVault is a collaborative workspace where developers and startup founders can pitch, share, and validate business ideas. It features a complete community discussion system, interactive search features, and instant category filters to streamline idea exploration.",
          features: [
            "Nested comment system with full CRUD interactive features",
            "Stateless JWT authentication and Google OAuth 2.0 login",
            "Real-time client-side keyword search and instant category filter"
          ],
          stack: ["Next.js", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "JWT", "Bcrypt"],
          githubClient: "https://github.com/KAprachir/assignment-9-client",
          live: "https://assignment-9-client-prachir.vercel.app",
          image: "/IdeaVault picture.png"
        }
      ];
      await Project.insertMany(defaultProjects);
      console.log("Default Projects data seeded.");
    }

    // 5. Seed Qualifications
    const qualCount = await Qualification.countDocuments();
    if (qualCount === 0) {
      const defaultQuals = [
        {
          type: "Education",
          title: "BBA in MIS",
          subtitle: "Begum Rokeya University",
          duration: "2021–Present",
          details: [
            "Focusing on Database Management, IT Investment, Business Research, Supply Chain, and International Business.",
            "Majoring in Management Information Systems."
          ],
          tags: ["MIS", "Business IT", "Database Management"]
        },
        {
          type: "Education",
          title: "Web Dev Bootcamp",
          subtitle: "Programming Hero",
          duration: "2023–2024",
          details: ["Intensive training in Full Stack Development with React, Node.js, and MongoDB."],
          tags: ["MERN Stack", "JavaScript", "Full Stack"]
        },
        {
          type: "Experience",
          title: "AI Fluency for Students",
          subtitle: "Anthropic Academy",
          duration: "2024",
          details: ["Certification in prompt engineering and AI strategy for productivity."],
          tags: ["Prompt Engineering", "AI Productivity", "Anthropic Claude"]
        },
        {
          type: "Experience",
          title: "Self-taught Developer",
          subtitle: "React, Next.js, Node.js",
          duration: "2022–Present",
          details: ["Built several full-stack projects using modern web technologies and best practices."],
          tags: ["Next.js", "Framer Motion", "State Management"]
        }
      ];
      await Qualification.insertMany(defaultQuals);
      console.log("Default Qualifications seeded.");
    }
  } catch (error) {
    console.error("Database seeding failed:", error);
  }
}

// ----------------------------------------------------
// Public Endpoints (Read-Only)
// ----------------------------------------------------

// Get Hero
app.get('/api/hero', async (req, res) => {
  try {
    const hero = await Hero.findOne();
    res.json(hero);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hero data" });
  }
});

// Get Skills
app.get('/api/skills', async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch skills data" });
  }
});

// Get Projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects data" });
  }
});

// Get Qualifications (Public)
app.get('/api/qualifications', async (req, res) => {
  try {
    const qualifications = await Qualification.find().sort({ createdAt: 1 });
    res.json(qualifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch qualifications" });
  }
});

// Get Published Blog Posts (Public)
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blog posts" });
  }
});

// Get Single Blog Post by Slug (Public)
app.get('/api/posts/:slug', async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug, isPublished: true });
    if (!post) {
      return res.status(404).json({ error: "Blog post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blog post" });
  }
});

// Submit Contact Message (Public)
app.post('/api/messages', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All contact fields are required" });
    }
    const newMessage = await Message.create({ name, email, subject, message });
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Failed to submit message inquiry" });
  }
});

// ----------------------------------------------------
// Admin Auth Endpoints
// ----------------------------------------------------

// Admin Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id, username: admin.username }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, username: admin.username });
  } catch (error) {
    res.status(500).json({ error: "Authentication failed" });
  }
});

// ----------------------------------------------------
// Protected Admin Endpoints (Write Actions)
// ----------------------------------------------------

// Update Hero
app.put('/api/hero', authenticateJWT, async (req, res) => {
  try {
    const { title, typingTexts, subtitle, resumeUrl, aboutTitle, aboutBio, aboutWhoami, aboutLocation, aboutStatus, aboutGoal } = req.body;
    let hero = await Hero.findOne();
    if (hero) {
      hero.title = title || hero.title;
      hero.typingTexts = typingTexts || hero.typingTexts;
      hero.subtitle = subtitle || hero.subtitle;
      hero.resumeUrl = resumeUrl !== undefined ? resumeUrl : hero.resumeUrl;
      hero.aboutTitle = aboutTitle !== undefined ? aboutTitle : hero.aboutTitle;
      hero.aboutBio = aboutBio !== undefined ? aboutBio : hero.aboutBio;
      hero.aboutWhoami = aboutWhoami !== undefined ? aboutWhoami : hero.aboutWhoami;
      hero.aboutLocation = aboutLocation !== undefined ? aboutLocation : hero.aboutLocation;
      hero.aboutStatus = aboutStatus !== undefined ? aboutStatus : hero.aboutStatus;
      hero.aboutGoal = aboutGoal !== undefined ? aboutGoal : hero.aboutGoal;
      await hero.save();
    } else {
      hero = await Hero.create({ title, typingTexts, subtitle, resumeUrl, aboutTitle, aboutBio, aboutWhoami, aboutLocation, aboutStatus, aboutGoal });
    }
    res.json(hero);
  } catch (error) {
    res.status(500).json({ error: "Failed to update hero details" });
  }
});

// Add Skill
app.post('/api/skills', authenticateJWT, async (req, res) => {
  try {
    const { category, name, icon } = req.body;
    if (!category || !name || !icon) {
      return res.status(400).json({ error: "All skill fields are required" });
    }
    const skill = await Skill.create({ category, name, icon });
    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ error: "Failed to add skill" });
  }
});

// Delete Skill
app.delete('/api/skills/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    await Skill.findByIdAndDelete(id);
    res.json({ message: "Skill deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete skill" });
  }
});

// Add Project
app.post('/api/projects', authenticateJWT, async (req, res) => {
  try {
    const { title, description, longDescription, features, stack, githubClient, githubServer, live, image } = req.body;
    if (!title || !description || !image) {
      return res.status(400).json({ error: "Title, description, and image URL are required" });
    }
    const project = await Project.create({
      title, description, longDescription, features, stack, githubClient, githubServer, live, image
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: "Failed to create project" });
  }
});

// Update Project
app.put('/api/projects/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, longDescription, features, stack, githubClient, githubServer, live, image } = req.body;
    const project = await Project.findByIdAndUpdate(id, {
      title, description, longDescription, features, stack, githubClient, githubServer, live, image
    }, { new: true });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Failed to update project" });
  }
});

// Delete Project
app.delete('/api/projects/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    await Project.findByIdAndDelete(id);
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete project" });
  }
});

// ----------------------------------------------------
// Protected Messages Endpoints
// ----------------------------------------------------

// Get All Messages (Admin only)
app.get('/api/messages', authenticateJWT, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Toggle Read Status of Message (Admin only)
app.put('/api/messages/:id/read', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;
    const message = await Message.findByIdAndUpdate(id, { isRead }, { new: true });
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: "Failed to update message status" });
  }
});

// Delete Message (Admin only)
app.delete('/api/messages/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndDelete(id);
    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete message" });
  }
});

// ----------------------------------------------------
// Protected Qualifications Endpoints
// ----------------------------------------------------

// Create Qualification (Admin only)
app.post('/api/qualifications', authenticateJWT, async (req, res) => {
  try {
    const { type, title, subtitle, duration, details, tags, certUrl } = req.body;
    if (!type || !title || !subtitle || !duration) {
      return res.status(400).json({ error: "Type, title, subtitle, and duration are required" });
    }
    const qualification = await Qualification.create({
      type, title, subtitle, duration, details, tags, certUrl
    });
    res.status(201).json(qualification);
  } catch (error) {
    res.status(500).json({ error: "Failed to create qualification" });
  }
});

// Update Qualification (Admin only)
app.put('/api/qualifications/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { type, title, subtitle, duration, details, tags, certUrl } = req.body;
    const qualification = await Qualification.findByIdAndUpdate(id, {
      type, title, subtitle, duration, details, tags, certUrl
    }, { new: true });
    res.json(qualification);
  } catch (error) {
    res.status(500).json({ error: "Failed to update qualification" });
  }
});

// Delete Qualification (Admin only)
app.delete('/api/qualifications/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    await Qualification.findByIdAndDelete(id);
    res.json({ message: "Qualification deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete qualification" });
  }
});

// ----------------------------------------------------
// Protected Blog Endpoints
// ----------------------------------------------------

// Get All Blog Posts (Admin only - includes unpublished)
app.get('/api/admin/posts', authenticateJWT, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch admin posts" });
  }
});

// Create Blog Post (Admin only)
app.post('/api/posts', authenticateJWT, async (req, res) => {
  try {
    const { title, slug, content, summary, tags, readTime, isPublished } = req.body;
    if (!title || !slug || !content || !summary) {
      return res.status(400).json({ error: "Title, slug, content, and summary are required" });
    }
    // Check if slug is unique
    const existing = await Post.findOne({ slug });
    if (existing) {
      return res.status(400).json({ error: "A blog post with this slug already exists" });
    }
    const post = await Post.create({
      title, slug, content, summary, tags, readTime, isPublished
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to create blog post" });
  }
});

// Update Blog Post (Admin only)
app.put('/api/posts/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, content, summary, tags, readTime, isPublished } = req.body;
    const post = await Post.findByIdAndUpdate(id, {
      title, slug, content, summary, tags, readTime, isPublished
    }, { new: true });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to update blog post" });
  }
});

// Delete Blog Post (Admin only)
app.delete('/api/posts/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    res.json({ message: "Blog post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete blog post" });
  }
});

// Start Server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Express server running on port ${PORT}`);
  });
}

module.exports = app;
