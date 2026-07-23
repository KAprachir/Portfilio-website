"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import useGsap from "@/hooks/useGsap";
import gsap from "gsap";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://server-nu-bice.vercel.app";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  const [aboutData, setAboutData] = useState({
    aboutTitle: "Building the Future",
    aboutBio: [
      "I'm a final-year BBA student majoring in MIS at Begum Rokeya University, Rangpur, Bangladesh.",
      "My journey started with a fascination for how software can solve business problems. Today, I build web applications and think deeply about product strategy.",
      "I'm passionate about the intersection of business and technology. My goal is to evolve from a developer into a Technical Product Manager.",
      "<strong>Outside of coding:</strong> When I'm not developing apps or analyzing product flows, I enjoy playing sports (cricket & table tennis), reading tech & strategy books, and exploring emerging AI tools."
    ],
    aboutWhoami: "Prachir — MIS Student + Dev",
    aboutLocation: "Rangpur, Bangladesh 🇧🇩",
    aboutStatus: "Open to intern/junior dev roles",
    aboutGoal: "Full Stack Dev → TPM"
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/hero`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        if (data) {
          setAboutData({
            aboutTitle: data.aboutTitle || "Building the Future",
            aboutBio: data.aboutBio && data.aboutBio.length > 0 ? data.aboutBio : [
              "I'm a final-year BBA student majoring in MIS at Begum Rokeya University, Rangpur, Bangladesh.",
              "My journey started with a fascination for how software can solve business problems. Today, I build web applications and think deeply about product strategy.",
              "I'm passionate about the intersection of business and technology. My goal is to evolve from a developer into a Technical Product Manager.",
              "<strong>Outside of coding:</strong> When I'm not developing apps or analyzing product flows, I enjoy playing sports (cricket & table tennis), reading tech & strategy books, and exploring emerging AI tools."
            ],
            aboutWhoami: data.aboutWhoami || "Prachir — MIS Student + Dev",
            aboutLocation: data.aboutLocation || "Rangpur, Bangladesh 🇧🇩",
            aboutStatus: data.aboutStatus || "Open to intern/junior dev roles",
            aboutGoal: data.aboutGoal || "Full Stack Dev → TPM"
          });
        }
      })
      .catch(() => {
        // Fallback already set in state
      });
  }, []);

  useGsap(() => {
    gsap.from(leftColRef.current, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
      },
      x: -100,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });

    gsap.from(rightColRef.current, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
      },
      x: 100,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-32 bg-bg-primary">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-5 gap-16 items-center">
        {/* Left Column: Bio */}
        <div ref={leftColRef} className="lg:col-span-3">
          <p className="font-mono text-accent-cyan mb-4">// about me</p>
          <h2 className="text-4xl md:text-5xl font-bold font-mono mb-8">{aboutData.aboutTitle}</h2>
          <div className="space-y-6 text-lg text-text-muted">
            {aboutData.aboutBio.map((paragraph, index) => (
              <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
            ))}
          </div>
        </div>

        {/* Right Column: Profile Photo + Terminal Card */}
        <div ref={rightColRef} className="lg:col-span-2 space-y-6">
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-36 h-36 rounded-2xl overflow-hidden border-2 border-accent-cyan/40 shadow-xl p-1 bg-gradient-to-br from-accent-cyan/20 to-accent-violet/20">
              <img 
                src="/profile.png" 
                alt="Khairul Alam Prachir" 
                className="w-full h-full object-cover object-top rounded-xl"
              />
            </div>
          </div>

          <div className="bg-bg-surface border border-border rounded-xl overflow-hidden shadow-2xl">
            <div className="bg-border/30 px-4 py-2 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
              <span className="ml-2 text-xs font-mono text-text-muted">bash — profile.sh</span>
            </div>
            <div className="p-6 font-mono text-sm md:text-base space-y-4">
              <div className="flex gap-3">
                <span className="text-accent-cyan">&gt;</span>
                <div>
                  <p className="text-accent-violet">whoami</p>
                  <p className="text-text-primary">{aboutData.aboutWhoami}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-accent-cyan">&gt;</span>
                <div>
                  <p className="text-accent-violet">location</p>
                  <p className="text-text-primary">{aboutData.aboutLocation}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-accent-cyan">&gt;</span>
                <div>
                  <p className="text-accent-violet">status</p>
                  <p className="text-text-primary">{aboutData.aboutStatus}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-accent-cyan">&gt;</span>
                <div>
                  <p className="text-accent-violet">goal</p>
                  <p className="text-text-primary">{aboutData.aboutGoal}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-accent-cyan animate-pulse">&gt;</span>
                <span className="w-2 h-5 bg-accent-cyan/50" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
