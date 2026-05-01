"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import useGsap from "@/hooks/useGsap";
import gsap from "gsap";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

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
          <h2 className="text-4xl md:text-5xl font-bold font-mono mb-8">Building the Future</h2>
          <div className="space-y-6 text-lg text-text-muted">
            <p>
              I'm a final-year <span className="text-accent-cyan">BBA student majoring in MIS</span> at 
              Begum Rokeya University, Rangpur, Bangladesh.
            </p>
            <p>
              My journey started with a fascination for how software can solve business problems. 
              Today, I build <span className="text-accent-cyan">web applications</span> and think deeply about product strategy.
            </p>
            <p>
              I'm passionate about the intersection of business and technology. My goal is to evolve from a 
              developer into a <span className="text-accent-cyan">Technical Product Manager</span>.
            </p>
          </div>
        </div>

        {/* Right Column: Terminal Card */}
        <div ref={rightColRef} className="lg:col-span-2">
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
                  <p className="text-text-primary">Prachir — MIS Student + Dev</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-accent-cyan">&gt;</span>
                <div>
                  <p className="text-accent-violet">location</p>
                  <p className="text-text-primary">Rangpur, Bangladesh 🇧🇩</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-accent-cyan">&gt;</span>
                <div>
                  <p className="text-accent-violet">status</p>
                  <p className="text-text-primary">Open to intern/junior dev roles</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-accent-cyan">&gt;</span>
                <div>
                  <p className="text-accent-violet">goal</p>
                  <p className="text-text-primary">Full Stack Dev → TPM</p>
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
