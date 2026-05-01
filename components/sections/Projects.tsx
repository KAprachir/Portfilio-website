"use client";

import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import Link from "next/link";

const projects = [
  {
    title: "Digitools",
    description: "AI-powered digital toolkit with multiple utilities for developers and creators.",
    stack: ["React 19", "Vite", "Tailwind v4", "DaisyUI v5"],
    github: "https://github.com/KAprachir",
    live: "https://demo.com",
    image: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?auto=format&fit=crop&q=80&w=600",
  },
  {
    title: "Keen Keeper",
    description: "Friend relationship management app to keep track of interactions and important dates.",
    stack: ["Next.js", "Tailwind", "DaisyUI", "Recharts", "localStorage"],
    github: "https://github.com/KAprachir",
    live: "https://demo.com",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600",
  },
  {
    title: "English Janala",
    description: "English learning platform focused on interactive vocabulary and grammar exercises.",
    stack: ["React", "Tailwind CSS"],
    github: "https://github.com/KAprachir",
    live: "https://demo.com",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600",
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
              className="group bg-bg-surface border border-border rounded-xl overflow-hidden relative"
            >
              <div className="aspect-video w-full overflow-hidden relative">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6">
                  <Link href={project.github} target="_blank" className="p-3 bg-white/10 rounded-full hover:bg-accent-cyan hover:text-bg-primary transition-all">
                    <FaGithub size={24} />
                  </Link>
                  <Link href={project.live} target="_blank" className="p-3 bg-white/10 rounded-full hover:bg-accent-cyan hover:text-bg-primary transition-all">
                    <FaExternalLinkAlt size={20} />
                  </Link>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold font-mono mb-3 text-accent-cyan">{project.title}</h3>
                <p className="text-text-muted text-sm mb-6 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map(tech => (
                    <span key={tech} className="text-[10px] uppercase tracking-wider font-mono px-2 py-1 bg-border/50 text-text-primary rounded border border-white/5">
                      {tech}
                    </span>
                  ))}
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
