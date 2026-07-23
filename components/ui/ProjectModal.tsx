"use client";

import { motion } from "framer-motion";
import { X, ExternalLink, CheckSquare, Settings, AlertTriangle, Rocket } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { useEffect } from "react";

interface Project {
  title: string;
  description: string;
  features: string[];
  stack: string[];
  githubClient?: string;
  githubServer?: string;
  live?: string;
  image: string;
  longDescription?: string;
  technicalDetails?: string[];
  challenges?: string[];
  futurePlans?: string[];
}

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1000] flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-bg-surface border border-border w-full max-w-3xl rounded-2xl overflow-hidden relative shadow-2xl flex flex-col my-8 max-h-[85vh] text-text-primary"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-black/50 text-white rounded-full hover:bg-accent-cyan hover:text-bg-primary transition-all border border-white/10"
        >
          <X size={18} />
        </button>

        {/* Hero Banner */}
        <div className="relative w-full aspect-video md:h-72 shrink-0 overflow-hidden border-b border-border/50">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-surface via-transparent to-black/30" />
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-8 flex-1">
          {/* Header */}
          <div>
            <span className="font-mono text-xs text-accent-cyan">// featured project</span>
            <h2 className="text-3xl font-bold font-mono text-text-primary mt-1">{project.title}</h2>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h4 className="text-sm font-mono text-accent-cyan font-bold uppercase tracking-wider">Overview</h4>
            <p className="text-text-muted text-base leading-relaxed">
              {project.longDescription || project.description}
            </p>
          </div>

          {/* Tech Stack Grid */}
          <div className="space-y-3">
            <h4 className="text-sm font-mono text-accent-cyan font-bold uppercase tracking-wider">Technologies Used</h4>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="text-xs uppercase tracking-wider font-mono px-3 py-1 bg-border/45 text-text-primary rounded border border-border/50"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Features Checklist */}
          <div className="space-y-3">
            <h4 className="text-sm font-mono text-accent-cyan font-bold uppercase tracking-wider">Key Implementations</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-text-muted list-none pl-0">
              {project.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckSquare size={16} className="text-accent-cyan mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technical Diagnostics details */}
          {project.technicalDetails && project.technicalDetails.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-mono text-accent-cyan font-bold uppercase tracking-wider">Technical Highlights</h4>
              <ul className="space-y-2.5 text-sm text-text-muted list-none pl-0">
                {project.technicalDetails.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Settings size={16} className="text-accent-violet mt-0.5 shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Challenges Faced */}
          {project.challenges && project.challenges.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-mono text-amber-400 font-bold uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle size={16} /> Challenges Faced
              </h4>
              <ul className="space-y-2.5 text-sm text-text-muted list-none pl-0">
                {project.challenges.map((challenge, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="text-amber-400 font-mono text-xs mt-0.5">⚠️</span>
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Potential Improvements & Future Plans */}
          {project.futurePlans && project.futurePlans.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-2">
                <Rocket size={16} /> Potential Improvements & Future Plans
              </h4>
              <ul className="space-y-2.5 text-sm text-text-muted list-none pl-0">
                {project.futurePlans.map((plan, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="text-emerald-400 font-mono text-xs mt-0.5">🚀</span>
                    <span>{plan}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Links */}
          <div className="flex flex-wrap gap-4 pt-6 border-t border-border/40">
            {project.live && (
              <Link
                href={project.live}
                target="_blank"
                className="flex-1 min-w-[140px] px-6 py-3 bg-accent-cyan text-bg-primary font-bold text-sm rounded-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-sm"
              >
                <ExternalLink size={14} />
                Live Deployment
              </Link>
            )}
            {project.githubClient && (
              <Link
                href={project.githubClient}
                target="_blank"
                className="flex-1 min-w-[140px] px-6 py-3 bg-border/30 text-text-primary hover:text-accent-cyan font-bold text-sm rounded-lg flex items-center justify-center gap-2 hover:bg-border/60 transition-all border border-border"
              >
                <FaGithub size={16} />
                GitHub Client
              </Link>
            )}
            {project.githubServer && (
              <Link
                href={project.githubServer}
                target="_blank"
                className="flex-1 min-w-[140px] px-6 py-3 bg-border/30 text-text-primary hover:text-accent-cyan font-bold text-sm rounded-lg flex items-center justify-center gap-2 hover:bg-border/60 transition-all border border-border"
              >
                <FaGithub size={16} />
                GitHub Server
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
