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
    title: "Frontend Development",
    categoryKey: "Frontend",
    skills: [
      { name: "HTML5", iconName: "FaHtml5" },
      { name: "CSS3", iconName: "FaCss3Alt" },
      { name: "Tailwind CSS", iconName: "SiTailwindcss" },
      { name: "React", iconName: "FaReact" },
      { name: "Next.js", iconName: "SiNextdotjs" },
    ],
  },
  {
    title: "Backend & Infrastructure",
    categoryKey: "Backend",
    skills: [
      { name: "Node.js", iconName: "FaNodeJs" },
      { name: "Express.js", iconName: "SiExpress" },
      { name: "MongoDB", iconName: "SiMongodb" },
    ],
  },
  {
    title: "Languages",
    categoryKey: "Languages",
    skills: [
      { name: "JavaScript", iconName: "FaJs" },
      { name: "Python", iconName: "FaPython" },
    ],
  },
  {
    title: "Tools & Ecosystem",
    categoryKey: "Tools",
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
          const categoryMappings = [
            { key: "Frontend", displayTitle: "Frontend Development" },
            { key: "Backend", displayTitle: "Backend & Infrastructure" },
            { key: "Languages", displayTitle: "Languages" },
            { key: "Tools", displayTitle: "Tools & Ecosystem" }
          ];

          const grouped = categoryMappings.map(catMap => {
            const skillsInCat = data
              .filter(s => s.category.toLowerCase() === catMap.key.toLowerCase())
              .map(s => ({
                name: s.name === "HTML" ? "HTML5" : s.name === "CSS" ? "CSS3" : s.name,
                iconComponent: getIconComponent(s.icon)
              }));
            return { title: catMap.displayTitle, skills: skillsInCat };
          });
          setSkillCategories(grouped);
        }
      })
      .catch(() => {
        // Fallback already set
      });
  }, []);

  return (
    <section id="skills" className="py-32 bg-bg-primary">
      <div className="max-w-6xl mx-auto px-6 space-y-16">
        {/* Centered Technology Stack Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold font-mono text-text-primary">Technology Stack</h2>
          <p className="text-text-muted text-base md:text-lg leading-relaxed font-sans">
            A curated list of tools and technologies I use to bring ideas to life, categorized by their role in the development lifecycle.
          </p>
        </div>

        {/* Categories Breakdown */}
        <div className="space-y-12">
          {skillCategories.map((category, catIndex) => (
            <div key={category.title} className="space-y-6">
              {/* Category Subheader */}
              <div className="flex items-center gap-3">
                <div className="w-6 h-[1px] bg-accent-cyan" />
                <h3 className="text-xs font-mono text-accent-cyan uppercase tracking-widest font-semibold">
                  {category.title}
                </h3>
              </div>

              {/* Category Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
                {category.skills.map((skill, skillIndex) => {
                  const Icon = skill.iconComponent;
                  return (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      transition={{ duration: 0.2, delay: (catIndex * 0.05) + (skillIndex * 0.03) }}
                      className="bg-bg-surface border border-border hover:border-accent-cyan/60 rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center gap-3 sm:gap-4 text-center group shadow-xl transition-all cursor-pointer"
                    >
                      {Icon ? (
                        <Icon className="text-accent-cyan group-hover:scale-110 transition-transform duration-300" size={34} />
                      ) : (
                        <div className="w-8 h-8 bg-accent-cyan/20 rounded-lg" />
                      )}
                      <span className="text-sm font-semibold font-mono text-text-primary group-hover:text-accent-cyan transition-colors">
                        {skill.name}
                      </span>
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
