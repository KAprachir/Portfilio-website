"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Code, Lightbulb, Terminal, Target } from "lucide-react";
import useGsap from "@/hooks/useGsap";
import gsap from "gsap";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://server-nu-bice.vercel.app";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [aboutData, setAboutData] = useState({
    aboutTitle: "About Me",
    aboutBio: [
      "I'm <strong>Khairul Alam Prachir</strong>, a full-stack web developer from Bangladesh specializing in Next.js, TypeScript, React, Node.js, and MongoDB. I build production-ready web applications that are fast, scalable, and solve real problems — from AI-powered travel platforms to internship marketplaces with smart matching algorithms.",
      "My background in Management Information Systems gives me an edge — I think like a developer and a business analyst at the same time, which means the products I build actually make sense for the people using them.",
      "Currently in my final year, open to web development opportunities."
    ],
    philosophy: "Code is more than just instructions; it is an art form of logic, strategy, and business efficiency. I believe in clean architectures, readable systems, and building products that solve real-world problems.",
    focus: "Deep diving into Next.js 14 App Router, full-stack MERN architectures, and Technical Product Management. Outside of coding, I enjoy playing sports (cricket & table tennis), reading strategy books, and exploring emerging AI tools.",
    yearsExp: "02+",
    projectsDone: "15+",
    techTools: "10+"
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/hero`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        if (data && data.aboutBio && Array.isArray(data.aboutBio) && data.aboutBio.length > 0) {
          setAboutData(prev => ({
            ...prev,
            aboutBio: data.aboutBio
          }));
        }
      })
      .catch(() => {
        // Safe fallback
      });
  }, []);

  useGsap(() => {
    gsap.from(containerRef.current, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    });
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-32 bg-bg-primary">
      <div ref={containerRef} className="max-w-5xl mx-auto px-6 space-y-8">
        {/* Main Bento Card: Hero Bio + Photo + Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-bg-surface border border-border rounded-3xl p-8 md:p-12 shadow-2xl space-y-8"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-4xl md:text-5xl font-bold font-mono text-text-primary">{aboutData.aboutTitle}</h2>
            <span className="font-mono text-xs text-accent-cyan hidden sm:inline-block">// profile & background</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-center">
            {/* User Photo */}
            <div className="md:col-span-4 flex justify-center md:justify-start">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border border-border/80 bg-bg-primary shadow-xl p-1 group">
                <img
                  src="/profile.png"
                  alt="Khairul Alam Prachir"
                  className="w-full h-full object-cover object-top rounded-xl group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Bio Paragraphs */}
            <div className="md:col-span-8 space-y-4">
              <div className="text-text-muted text-base md:text-lg leading-relaxed font-sans space-y-4">
                {aboutData.aboutBio.map((paragraph, index) => (
                  <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
                ))}
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border/50">
                <div>
                  <p className="text-2xl md:text-3xl font-bold font-mono text-accent-cyan">Fresher</p>
                  <p className="text-xs font-mono text-text-muted mt-1 uppercase tracking-wider">Experience</p>
                </div>
                <div>
                  <p className="text-3xl md:text-4xl font-bold font-mono text-accent-cyan">15+</p>
                  <p className="text-xs font-mono text-text-muted mt-1 uppercase tracking-wider">Projects Built</p>
                </div>
                <div>
                  <p className="text-3xl md:text-4xl font-bold font-mono text-accent-cyan">10+</p>
                  <p className="text-xs font-mono text-text-muted mt-1 uppercase tracking-wider">Core Tools</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bento Cards: Philosophy & Current Focus */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: My Philosophy */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-bg-surface border border-border rounded-3xl p-8 shadow-2xl hover:border-accent-cyan/40 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan mb-6">
                <Code size={24} />
              </div>
              <h3 className="text-2xl font-bold font-mono text-text-primary mb-4">My Philosophy</h3>
              <p className="text-text-muted text-base leading-relaxed font-sans">
                {aboutData.philosophy}
              </p>
            </div>
          </motion.div>

          {/* Card 2: Current Focus */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-bg-surface border border-border rounded-3xl p-8 shadow-2xl hover:border-accent-cyan/40 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center text-accent-violet mb-6">
                <Lightbulb size={24} />
              </div>
              <h3 className="text-2xl font-bold font-mono text-text-primary mb-4">Current Focus</h3>
              <p className="text-text-muted text-base leading-relaxed font-sans">
                {aboutData.focus}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
