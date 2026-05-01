"use client";

import { motion } from "framer-motion";
import { useState, useRef } from "react";
import useGsap from "@/hooks/useGsap";
import gsap from "gsap";

const education = [
  {
    title: "BBA in MIS",
    subtitle: "Begum Rokeya University (2021–Present)",
    description: "Focusing on Database Management, IT Investment, Business Research, Supply Chain, and International Business.",
  },
  {
    title: "Web Dev Bootcamp",
    subtitle: "Programming Hero (2023–2024)",
    description: "Intensive training in Full Stack Development with React, Node.js, and MongoDB.",
  },
];

const experience = [
  {
    title: "AI Fluency for Students",
    subtitle: "Anthropic Academy",
    description: "Certification in prompt engineering and AI strategy for productivity.",
  },
  {
    title: "Self-taught Developer",
    subtitle: "React, Next.js, Node.js",
    description: "Built several full-stack projects using modern web technologies and best practices.",
  },
];

export default function Qualifications() {
  const [activeTab, setActiveTab] = useState<"education" | "experience">("education");
  const lineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
  }, [activeTab]);

  const items = activeTab === "education" ? education : experience;

  return (
    <section id="qualifications" className="py-32 bg-bg-surface/20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-16">
          <p className="font-mono text-accent-cyan mb-2">// education & experience</p>
          <h2 className="text-4xl font-bold font-mono">Qualifications</h2>
        </div>

        <div className="flex gap-8 mb-12 border-b border-border">
          <button
            onClick={() => setActiveTab("education")}
            className={`pb-4 text-lg font-mono transition-all relative ${
              activeTab === "education" ? "text-accent-cyan" : "text-text-muted hover:text-text-primary"
            }`}
          >
            Education
            {activeTab === "education" && (
              <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-0.5 bg-accent-cyan" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("experience")}
            className={`pb-4 text-lg font-mono transition-all relative ${
              activeTab === "experience" ? "text-accent-cyan" : "text-text-muted hover:text-text-primary"
            }`}
          >
            Experience
            {activeTab === "experience" && (
              <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-0.5 bg-accent-cyan" />
            )}
          </button>
        </div>

        <div ref={containerRef} className="relative pl-8 space-y-12">
          {/* Vertical Line */}
          <div className="absolute left-0 top-0 w-0.5 h-full bg-border origin-top">
            <div ref={lineRef} className="w-full h-full bg-accent-cyan origin-top" />
          </div>

          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              {/* Dot */}
              <div className="absolute -left-[37px] top-2 w-4 h-4 rounded-full bg-bg-primary border-2 border-accent-cyan z-10" />
              
              <div className="bg-bg-surface border border-border p-6 rounded-xl hover:border-accent-cyan/50 transition-colors">
                <h3 className="text-xl font-bold text-text-primary mb-1">{item.title}</h3>
                <p className="text-accent-cyan font-mono text-sm mb-4">{item.subtitle}</p>
                <p className="text-text-muted">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
