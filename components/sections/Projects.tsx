"use client";

import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import Link from "next/link";

const projects = [
  {
    title: "RecipeHub",
    description: "A full-stack recipe sharing platform where food enthusiasts can create, discover, and manage recipes. Users browse community content, save favorites, and upgrade to premium to unlock unlimited publishing.",
    features: [
      "Role-based access (User vs Admin) & recipe moderation",
      "Stripe-integrated subscriptions for unlimited recipe publishing",
      "Dynamic MongoDB filtering by category, pagination, and real-time likes/favorites"
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
    features: [
      "Three roles: Seeker, Recruiter, and Admin, each with unique dashboards",
      "Custom Applicant Tracking System (ATS) pipeline workflow",
      "Subscription analytics dashboard and Stripe payment integration"
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
    features: [
      "Nested comment system with full CRUD interactive features",
      "Stateless JWT authentication and Google OAuth 2.0 login",
      "Real-time client-side keyword search and instant category filter"
    ],
    stack: ["Next.js", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "JWT", "Bcrypt"],
    githubClient: "https://github.com/KAprachir/assignment-9-client",
    live: "https://assignment-9-client-prachir.vercel.app",
    image: "/IdeaVault picture.png",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-16">
          <p className="font-mono text-accent-cyan mb-2">// things I've built</p>
          <h2 className="text-4xl font-bold font-mono">Projects</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group bg-bg-surface border border-border rounded-xl overflow-hidden relative flex flex-col h-full"
            >
              <div className="aspect-video w-full overflow-hidden relative border-b border-border/40">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Subtle dark overlay to blend white-bg screenshots into the dark theme */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300 pointer-events-none" />
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold font-mono mb-3 text-accent-cyan">{project.title}</h3>
                  <p className="text-text-muted text-sm mb-4">
                    {project.description}
                  </p>
                  
                  <ul className="space-y-2 mb-6 text-xs text-text-muted list-none pl-0">
                    {project.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <span className="text-accent-cyan mt-0.5 font-mono text-[8px]">■</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-border/40">
                    {project.stack.map(tech => (
                      <span key={tech} className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 bg-border/50 text-text-primary rounded border border-white/5">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Dynamic Action Buttons */}
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/40">
                    {project.live && (
                      <Link 
                        href={project.live} 
                        target="_blank" 
                        className="flex-1 min-w-[80px] px-2 py-2 bg-accent-cyan text-bg-primary font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 hover:scale-105 transition-all shadow-[0_0_12px_rgba(0,212,255,0.2)]"
                      >
                        <FaExternalLinkAlt size={10} />
                        Live
                      </Link>
                    )}
                    {project.githubClient && (
                      <Link 
                        href={project.githubClient} 
                        target="_blank" 
                        className="flex-1 min-w-[80px] px-2 py-2 bg-white/5 text-text-primary hover:text-accent-cyan font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 hover:bg-white/10 transition-all border border-white/10"
                      >
                        <FaGithub size={12} />
                        Client
                      </Link>
                    )}
                    {project.githubServer && (
                      <Link 
                        href={project.githubServer} 
                        target="_blank" 
                        className="flex-1 min-w-[80px] px-2 py-2 bg-white/5 text-text-primary hover:text-accent-cyan font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 hover:bg-white/10 transition-all border border-white/10"
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
    </section>
  );
}
