"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Award, ChevronDown, ChevronUp, Calendar } from "lucide-react";
import useGsap from "@/hooks/useGsap";
import gsap from "gsap";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface QualificationItem {
  _id: string;
  type: "Education" | "Experience";
  title: string;
  subtitle: string;
  duration: string;
  details: string[];
  tags: string[];
  certUrl?: string;
}

export default function Qualifications() {
  const [activeTab, setActiveTab] = useState<"Education" | "Experience">("Education");
  const [qualifications, setQualifications] = useState<QualificationItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const lineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch qualifications
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/qualifications`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setQualifications(data || []);
      })
      .catch(() => {
        // Static Fallbacks
        const fallbackQuals: QualificationItem[] = [
          {
            _id: "e1",
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
            _id: "e2",
            type: "Education",
            title: "Web Dev Bootcamp",
            subtitle: "Programming Hero",
            duration: "2023–2024",
            details: ["Intensive training in Full Stack Development with React, Node.js, and MongoDB."],
            tags: ["MERN Stack", "JavaScript", "Full Stack"]
          },
          {
            _id: "ex1",
            type: "Experience",
            title: "AI Fluency for Students",
            subtitle: "Anthropic Academy",
            duration: "2024",
            details: ["Certification in prompt engineering and AI strategy for productivity."],
            tags: ["Prompt Engineering", "AI Productivity", "Anthropic Claude"]
          },
          {
            _id: "ex2",
            type: "Experience",
            title: "Self-taught Developer",
            subtitle: "React, Next.js, Node.js",
            duration: "2022–Present",
            details: ["Built several full-stack projects using modern web technologies and best practices."],
            tags: ["Next.js", "Framer Motion", "State Management"]
          }
        ];
        setQualifications(fallbackQuals);
      });
  }, []);

  useGsap(() => {
    gsap.fromTo(lineRef.current, 
      { scaleY: 0 },
      { 
        scaleY: 1, 
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          end: "bottom 80%",
          scrub: true,
        },
        ease: "none"
      }
    );
  }, [activeTab, qualifications]);

  const items = qualifications.filter(q => q.type === activeTab);

  return (
    <section id="qualifications" className="py-32 bg-bg-surface/20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-16">
          <p className="font-mono text-accent-cyan mb-2">// education & experience</p>
          <h2 className="text-4xl font-bold font-mono">Qualifications</h2>
        </div>

        <div className="flex gap-8 mb-12 border-b border-border">
          <button
            onClick={() => {
              setActiveTab("Education");
              setExpandedId(null);
            }}
            className={`pb-4 text-lg font-mono transition-all relative ${
              activeTab === "Education" ? "text-accent-cyan" : "text-text-muted hover:text-text-primary"
            }`}
          >
            Education
            {activeTab === "Education" && (
              <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-0.5 bg-accent-cyan" />
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab("Experience");
              setExpandedId(null);
            }}
            className={`pb-4 text-lg font-mono transition-all relative ${
              activeTab === "Experience" ? "text-accent-cyan" : "text-text-muted hover:text-text-primary"
            }`}
          >
            Experience
            {activeTab === "Experience" && (
              <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-0.5 bg-accent-cyan" />
            )}
          </button>
        </div>

        <div ref={containerRef} className="relative pl-8 space-y-12">
          {/* Vertical Line */}
          <div className="absolute left-0 top-0 w-0.5 h-full bg-border origin-top">
            <div ref={lineRef} className="w-full h-full bg-accent-cyan origin-top" />
          </div>

          {items.map((item, index) => {
            const isExpanded = expandedId === item._id;
            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                {/* Dot */}
                <div className="absolute -left-[37px] top-2.5 w-4 h-4 rounded-full bg-bg-primary border-2 border-accent-cyan z-10" />
                
                <div 
                  onClick={() => setExpandedId(isExpanded ? null : item._id)}
                  className="bg-bg-surface border border-border hover:border-accent-cyan/30 rounded-xl p-6 transition-all duration-300 cursor-pointer select-none space-y-4"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-text-primary group-hover:text-accent-cyan transition-colors">{item.title}</h3>
                      <p className="text-accent-cyan font-mono text-sm">{item.subtitle}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-text-muted bg-[#0d0d14] px-3 py-1.5 border border-border/80 rounded-lg flex items-center gap-1.5 shrink-0">
                        <Calendar size={12} className="text-accent-cyan" />
                        {item.duration}
                      </span>
                      {isExpanded ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
                    </div>
                  </div>

                  {/* Tiny Tags in Closed State */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-mono px-2 py-0.5 bg-[#0f0f16] border border-border/40 text-text-muted rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Expandable Details Panel */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden border-t border-border/40 pt-4 mt-2 space-y-4"
                        onClick={(e) => e.stopPropagation()} // Stop bubble-up so clicking text doesn't collapse
                      >
                        <ul className="list-disc list-inside space-y-2 text-text-muted text-sm leading-relaxed pl-1">
                          {item.details.map((detail, dIdx) => (
                            <li key={dIdx} className="marker:text-accent-cyan">
                              {detail}
                            </li>
                          ))}
                        </ul>

                        {item.certUrl && (
                          <div className="pt-2">
                            <a 
                              href={item.certUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-xs font-mono text-accent-cyan hover:text-accent-violet hover:underline transition-all"
                            >
                              <Award size={14} /> View Certificate / Credentials
                            </a>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
