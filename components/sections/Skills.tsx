"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";
import * as VscIcons from "react-icons/vsc";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://server-nu-bice.vercel.app";

const getIconComponent = (iconName: string) => {
  if (iconName.startsWith("Fa")) return (FaIcons as any)[iconName];
  if (iconName.startsWith("Si")) return (SiIcons as any)[iconName];
  if (iconName.startsWith("Vsc")) return (VscIcons as any)[iconName];
  return null;
};

// Static Fallback Data
const fallbackCategories = [
  {
    title: "Frontend",
    skills: [
      { name: "HTML", iconName: "FaHtml5" },
      { name: "CSS", iconName: "FaCss3Alt" },
      { name: "Tailwind CSS", iconName: "SiTailwindcss" },
      { name: "React", iconName: "FaReact" },
      { name: "Next.js", iconName: "SiNextdotjs" },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Node.js", iconName: "FaNodeJs" },
      { name: "Express.js", iconName: "SiExpress" },
      { name: "MongoDB", iconName: "SiMongodb" },
    ],
  },
  {
    title: "Languages",
    skills: [
      { name: "JavaScript", iconName: "FaJs" },
      { name: "Python", iconName: "FaPython" },
    ],
  },
  {
    title: "Tools",
    skills: [
      { name: "Git", iconName: "FaGitAlt" },
      { name: "GitHub", iconName: "FaGithub" },
      { name: "Figma", iconName: "FaFigma" },
      { name: "Vercel", iconName: "SiVercel" },
      { name: "VS Code", iconName: "VscVscode" },
    ],
  },
];

interface Skill {
  category: string;
  name: string;
  icon: string;
}

export default function Skills() {
  const [skillCategories, setSkillCategories] = useState(
    fallbackCategories.map(cat => ({
      title: cat.title,
      skills: cat.skills.map(s => ({ name: s.name, iconComponent: getIconComponent(s.iconName) }))
    }))
  );

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/skills`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data: Skill[]) => {
        if (data && data.length > 0) {
          const categories = ["Frontend", "Backend", "Languages", "Tools"];
          const grouped = categories.map(catTitle => {
            const skillsInCat = data
              .filter(s => s.category.toLowerCase() === catTitle.toLowerCase())
              .map(s => ({
                name: s.name,
                iconComponent: getIconComponent(s.icon)
              }));
            return { title: catTitle, skills: skillsInCat };
          });
          setSkillCategories(grouped);
        }
      })
      .catch(() => {
        // Fallback already set
      });
  }, []);

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
                  const Icon = skill.iconComponent;
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
