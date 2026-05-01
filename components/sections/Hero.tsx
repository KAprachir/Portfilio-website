"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import useGsap from "@/hooks/useGsap";
import gsap from "gsap";
import { MoveRight, Download } from "lucide-react";

const typingTexts = [
  "MIS Student",
  "Web Developer",
  "Future Technical Product Manager"
];

const CharacterReveal = ({ text }: { text: string }) => {
  const characters = text.split("");
  
  return (
    <span className="inline-block">
      {characters.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: i * 0.05,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
};

export default function Hero() {
  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentFullText = typingTexts[textIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentFullText.slice(0, displayText.length + 1));
        if (displayText.length === currentFullText.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayText(currentFullText.slice(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % typingTexts.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, textIndex]);

  useGsap(() => {
    gsap.to(contentRef.current, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
      y: 100,
      opacity: 0,
    });
  }, []);

  return (
    <section 
      id="home" 
      ref={sectionRef}
      className="min-h-screen relative flex items-center bg-dot-pattern overflow-hidden pt-20"
    >
      {/* Floating Code Snippets */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] right-[10%] font-mono text-sm text-accent-cyan opacity-5 hidden lg:block"
        >
          const build = () =&gt; future;
        </motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[20%] left-[5%] font-mono text-sm text-accent-violet opacity-5 hidden lg:block"
        >
          import &#123; passion &#125; from 'life';
        </motion.div>
        <motion.div 
          animate={{ x: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute top-[40%] left-[15%] font-mono text-sm text-accent-cyan opacity-5 hidden lg:block"
        >
          &lt;Developer role="TPM" /&gt;
        </motion.div>
      </div>

      <div ref={contentRef} className="max-w-6xl mx-auto px-6 w-full z-10">
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="font-mono text-accent-cyan text-lg mb-4"
        >
          👋 Hello World
        </motion.p>
        
        <h1 className="text-6xl md:text-8xl font-bold font-mono mb-6 leading-tight">
          I'm <CharacterReveal text="Prachir" />
        </h1>

        <div className="h-12 mb-8">
          <p className="text-2xl md:text-4xl font-mono text-text-primary">
            {displayText}
            <span className="animate-pulse text-accent-cyan ml-1">|</span>
          </p>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-text-muted text-lg md:text-xl max-w-2xl mb-12"
        >
          Crafting precise digital experiences through code and product strategy. 
          Bridging the gap between technical complexity and user-centric design.
        </motion.p>

        <div className="flex flex-wrap gap-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-accent-cyan text-bg-primary font-bold rounded-lg flex items-center gap-2 group transition-all"
          >
            <a href="#projects" className="flex items-center gap-2">
              View Projects
              <MoveRight className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 border border-border hover:border-accent-cyan text-text-primary font-bold rounded-lg flex items-center gap-2 transition-all"
          >
            <a href="/cv.pdf" download className="flex items-center gap-2">
              Download CV
              <Download size={20} />
            </a>
          </motion.button>
        </div>
      </div>
    </section>
  );
}
