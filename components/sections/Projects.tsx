"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { Info } from "lucide-react";
import Link from "next/link";
import ProjectModal from "@/components/ui/ProjectModal";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://server-nu-bice.vercel.app";

const fallbackProjects = [
  {
    title: "RecipeHub",
    description: "A full-stack recipe sharing platform where food enthusiasts can create, discover, and manage recipes. Features role-based access control, premium memberships, and moderation tools.",
    longDescription: "RecipeHub is a full-stack recipe sharing platform built for food enthusiasts. Free users can post up to 2 recipes, while upgrading to a premium membership via Stripe unlocks unlimited publishing. The platform implements secure session-based authentication using Better Auth, and integrates robust admin moderation utilities to manage offensive or copyrighted content.",
    features: [
      "Role-based access (User vs Admin) & recipe moderation",
      "Stripe-integrated subscriptions for unlimited recipe publishing",
      "Dynamic MongoDB filtering by category, pagination, and real-time likes/favorites"
    ],
    technicalDetails: [
      "Secured with Better Auth supporting both Credentials and Google OAuth 2.0 logins",
      "Stripe Checkout API integration with secure server-side webhook validations",
      "Robust Admin Panel with user management, recipe moderation, and reports handling",
      "Optimized MongoDB aggregations for dynamic filtering, sorting, and pagination"
    ],
    challenges: [
      "Handling Stripe webhook event race conditions during asynchronous subscription state updates.",
      "Structuring complex MongoDB aggregations for multi-field search, pagination, and real-time like/favorite counts simultaneously."
    ],
    futurePlans: [
      "Implement an AI-powered meal plan generator tailored to user dietary goals.",
      "Add live video cooking rooms with interactive real-time Q&A."
    ],
    stack: ["Next.js", "Tailwind CSS", "HeroUI", "Framer Motion", "Node.js", "Express.js", "MongoDB", "Better Auth", "Stripe"],
    githubClient: "https://github.com/KAprachir/recipehub-client",
    githubServer: "https://github.com/KAprachir/recipehub-server",
    live: "https://recipehub-client-kappa.vercel.app",
    image: "/RecipeHub Picture.png",
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
    technicalDetails: [
      "Custom Applicant Tracking System (ATS) pipeline workflow supporting state transitions",
      "Role-based multi-dashboard architecture with granular routing guards",
      "Stripe subscriptions integration for recruiter account upgrades",
      "Smart keyword searches matching candidates based on skill criteria"
    ],
    challenges: [
      "Designing a granular multi-role routing guard architecture (Seeker vs Recruiter vs Admin) while keeping client-side navigation fast.",
      "Managing complex state transitions in the applicant pipeline to prevent illegal status leaps."
    ],
    futurePlans: [
      "Integrate automated AI resume keyword matching & candidate scoring against job requirements.",
      "Add automated interview scheduling synced with Google Calendar API."
    ],
    stack: ["Next.js", "Tailwind CSS", "HeroUI", "Motion", "Node.js", "Express.js", "MongoDB", "Better Auth", "Stripe"],
    githubClient: "https://github.com/KAprachir/HireLoop-Client",
    githubServer: "https://github.com/KAprachir/HireLoop-Server",
    live: "https://hire-loop-client-eta.vercel.app",
    image: "/Hireloop picture.png",
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
    technicalDetails: [
      "Stateless JWT-based user authentication combined with Google OAuth 2.0 flows",
      "Nested comment systems supporting recursive CRUD operations",
      "Client-side real-time fuzzy search and instant category filter indexing",
      "Persistent state theme manager synced with browser localStorage"
    ],
    challenges: [
      "Designing performant recursive schema queries in MongoDB for multi-level nested comment threads.",
      "Building a client-side fuzzy search filter without causing re-render lag on large idea lists."
    ],
    futurePlans: [
      "Add real-time WebSockets live chat between startup founders and early-stage investors.",
      "Build an automated investor pitch deck builder with one-click PDF export."
    ],
    stack: ["Next.js", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "JWT", "Bcrypt"],
    githubClient: "https://github.com/KAprachir/assignment-9-client",
    live: "https://assignment-9-client-prachir.vercel.app",
    image: "/IdeaVault picture.png",
  },
];

export default function Projects() {
  const [projectList, setProjectList] = useState<any[]>(fallbackProjects);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/projects`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        if (data && data.length > 0) {
          setProjectList(data);
        }
      })
      .catch(() => {
        // Fallback already set
      });
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <section id="projects" className="py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-16">
          <p className="font-mono text-accent-cyan mb-2">// things I've built</p>
          <h2 className="text-4xl font-bold font-mono">Projects</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectList.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              onMouseMove={handleMouseMove}
              onClick={() => setSelectedProject(project)}
              className="group card-glow bg-bg-surface border border-border hover:border-accent-cyan/40 rounded-xl overflow-hidden relative flex flex-col h-full cursor-pointer transition-colors duration-300"
            >
              <div className="aspect-video w-full overflow-hidden relative border-b border-border/40">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Subtle dark overlay to blend white-bg screenshots into the dark theme */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300 pointer-events-none" />
                
                {/* Quick Details indicator */}
                <div className="absolute top-3 right-3 p-1.5 bg-black/60 text-accent-cyan rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <Info size={14} />
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold font-mono mb-3 text-accent-cyan">{project.title}</h3>
                  <p className="text-text-muted text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  
                  <ul className="space-y-2 mb-6 text-xs text-text-muted list-none pl-0">
                    {project.features && project.features.slice(0, 2).map((feature: string, fIdx: number) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <span className="text-accent-cyan mt-0.5 font-mono text-[8px]">■</span>
                        <span className="line-clamp-1">{feature}</span>
                      </li>
                    ))}
                    {project.features && project.features.length > 2 && (
                      <li className="text-[10px] text-accent-cyan font-mono pl-3">
                        + click to view all features
                      </li>
                    )}
                  </ul>
                </div>
                
                <div>
                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-border/40">
                    {project.stack && project.stack.slice(0, 4).map((tech: string) => (
                      <span key={tech} className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 bg-border/50 text-text-primary rounded border border-border/50">
                        {tech}
                      </span>
                    ))}
                    {project.stack && project.stack.length > 4 && (
                      <span className="text-[10px] font-mono px-2 py-0.5 text-accent-cyan bg-border/20 rounded border border-border/50">
                        +{project.stack.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Dynamic Action Buttons */}
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/40">
                    {project.live && (
                      <Link 
                        href={project.live} 
                        target="_blank" 
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 min-w-[80px] px-2 py-2 bg-accent-cyan text-bg-primary font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 hover:scale-105 transition-all shadow-sm"
                      >
                        <FaExternalLinkAlt size={10} />
                        Live
                      </Link>
                    )}
                    {project.githubClient && (
                      <Link 
                        href={project.githubClient} 
                        target="_blank" 
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 min-w-[80px] px-2 py-2 bg-border/30 text-text-primary hover:text-accent-cyan font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 hover:bg-border/60 transition-all border border-border"
                      >
                        <FaGithub size={12} />
                        Client
                      </Link>
                    )}
                    {project.githubServer && (
                      <Link 
                        href={project.githubServer} 
                        target="_blank" 
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 min-w-[80px] px-2 py-2 bg-border/30 text-text-primary hover:text-accent-cyan font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 hover:bg-border/60 transition-all border border-border"
                      >
                        <FaGithub size={12} />
                        Server
                      </Link>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Decorative accent border */}
              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent-cyan transition-all duration-300 group-hover:w-full" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Project details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
