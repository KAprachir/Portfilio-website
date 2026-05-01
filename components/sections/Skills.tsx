"use client";

import { motion } from "framer-motion";
import { 
  FaHtml5, FaCss3Alt, FaReact, FaNodeJs, FaJs, FaPython, FaGitAlt, FaGithub, FaFigma 
} from "react-icons/fa";
import { SiTailwindcss, SiNextdotjs, SiExpress, SiMongodb, SiVercel } from "react-icons/si";
import { VscVscode } from "react-icons/vsc";

const skillCategories = [
  {
    title: "Frontend",
    skills: [
      { name: "HTML", icon: FaHtml5 },
      { name: "CSS", icon: FaCss3Alt },
      { name: "Tailwind CSS", icon: SiTailwindcss },
      { name: "React", icon: FaReact },
      { name: "Next.js", icon: SiNextdotjs },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Node.js", icon: FaNodeJs },
      { name: "Express.js", icon: SiExpress },
      { name: "MongoDB", icon: SiMongodb },
    ],
  },
  {
    title: "Languages",
    skills: [
      { name: "JavaScript", icon: FaJs },
      { name: "Python", icon: FaPython },
    ],
  },
  {
    title: "Tools",
    skills: [
      { name: "Git", icon: FaGitAlt },
      { name: "GitHub", icon: FaGithub },
      { name: "Figma", icon: FaFigma },
      { name: "Vercel", icon: SiVercel },
      { name: "VS Code", icon: VscVscode },
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-32 bg-bg-surface/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-16">
          <p className="font-mono text-accent-cyan mb-2">// what I work with</p>
          <h2 className="text-4xl font-bold font-mono">Tech Stack</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {skillCategories.map((category, catIndex) => (
            <div key={category.title}>
              <h3 className="text-xl font-mono text-text-primary mb-6 border-b border-border pb-2 inline-block">
                {category.title}
              </h3>
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => {
                  const Icon = skill.icon;
                  return (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: (catIndex * 0.1) + (skillIndex * 0.05) }}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-accent-cyan transition-all group bg-bg-surface"
                    >
                      <div className="flex items-center gap-3">
                        {Icon ? (
                          <Icon className="text-text-muted group-hover:text-accent-cyan transition-colors" size={20} />
                        ) : (
                          <div className="w-5 h-5 bg-text-muted/20 rounded" />
                        )}
                        <span className="text-sm font-medium">{skill.name}</span>
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan shadow-[0_0_8px_#00d4ff]" />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
