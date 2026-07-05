"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const terminalLines = [
  "Initializing system protocols...",
  "Loading component dependencies...",
  "Connecting to Vercel production edge...",
  "Connection verified. Launching site...",
];

export default function PageLoader() {
  const [currentLine, setCurrentLine] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (currentLine < terminalLines.length) {
      const timer = setTimeout(() => {
        setCurrentLine((prev) => prev + 1);
      }, 400);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setShow(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [currentLine]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-[10000] bg-[#0a0a0f] flex flex-col items-center justify-center p-6"
        >
          <div className="w-full max-w-md font-mono text-xs md:text-sm text-accent-cyan space-y-2 select-none">
            <div className="flex items-center gap-2 mb-4 border-b border-border/40 pb-2">
              <span className="w-3 h-3 rounded-full bg-red-500/50" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <span className="w-3 h-3 rounded-full bg-green-500/50" />
              <span className="ml-2 text-[10px] text-text-muted">system-boot.sh</span>
            </div>
            
            {terminalLines.slice(0, currentLine).map((line, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="text-accent-violet">&gt;</span>
                <span>{line}</span>
              </div>
            ))}

            {currentLine < terminalLines.length && (
              <div className="flex gap-2 items-center">
                <span className="text-accent-violet">&gt;</span>
                <span className="w-1.5 h-4 bg-accent-cyan animate-pulse" />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
