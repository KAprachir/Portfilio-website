"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Plus, Trash, Edit, Save, PlusCircle, Briefcase, Code, User, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState<"hero" | "skills" | "projects">("hero");

  // Hero States
  const [heroData, setHeroData] = useState({
    title: "",
    typingTexts: [] as string[],
    subtitle: "",
    resumeUrl: ""
  });
  const [typingTextString, setTypingTextString] = useState("");
  const [isSavingHero, setIsSavingHero] = useState(false);
  const [heroMessage, setHeroMessage] = useState({ type: "" as "success" | "error" | "", text: "" });

  // Skills States
  const [skills, setSkills] = useState([] as any[]);
  const [newSkill, setNewSkill] = useState({ category: "Frontend", name: "", icon: "" });
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [skillMessage, setSkillMessage] = useState({ type: "" as "success" | "error" | "", text: "" });

  // Projects States
  const [projects, setProjects] = useState([] as any[]);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    longDescription: "",
    featuresString: "",
    stackString: "",
    githubClient: "",
    githubServer: "",
    live: "",
    image: ""
  });
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [projectMessage, setProjectMessage] = useState({ type: "" as "success" | "error" | "", text: "" });

  // Load token on startup
  useEffect(() => {
    const savedToken = localStorage.getItem("adminToken");
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
      fetchDashboardData(savedToken);
    }
  }, []);

  const fetchDashboardData = async (activeToken: string) => {
    try {
      // Fetch Hero
      const heroRes = await fetch(`${API_BASE_URL}/api/hero`);
      if (heroRes.ok) {
        const data = await heroRes.json();
        if (data) {
          setHeroData(data);
          setTypingTextString(data.typingTexts?.join(", ") || "");
        }
      }

      // Fetch Skills
      const skillsRes = await fetch(`${API_BASE_URL}/api/skills`);
      if (skillsRes.ok) {
        const data = await skillsRes.json();
        setSkills(data || []);
      }

      // Fetch Projects
      const projectsRes = await fetch(`${API_BASE_URL}/api/projects`);
      if (projectsRes.ok) {
        const data = await projectsRes.json();
        setProjects(data || []);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setLoginError("Please enter both username and password.");
      return;
    }

    setIsLoggingIn(true);
    setLoginError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("adminToken", data.token);
        setToken(data.token);
        setIsAuthenticated(true);
        fetchDashboardData(data.token);
      } else {
        setLoginError(data.error || "Invalid login credentials.");
      }
    } catch (error) {
      setLoginError("Failed to connect to the authentication server.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setToken("");
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
  };

  // ----------------------------------------------------
  // Hero Actions
  // ----------------------------------------------------
  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingHero(true);
    setHeroMessage({ type: "", text: "" });

    const updatedHero = {
      ...heroData,
      typingTexts: typingTextString.split(",").map(t => t.trim()).filter(Boolean)
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/hero`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedHero)
      });

      const data = await res.json();
      if (res.ok) {
        setHeroData(data);
        setHeroMessage({ type: "success", text: "Hero details updated successfully!" });
      } else {
        setHeroMessage({ type: "error", text: data.error || "Failed to update hero details." });
      }
    } catch (error) {
      setHeroMessage({ type: "error", text: "Server connection failed." });
    } finally {
      setIsSavingHero(false);
    }
  };

  // ----------------------------------------------------
  // Skill Actions
  // ----------------------------------------------------
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.name.trim() || !newSkill.icon.trim()) {
      setSkillMessage({ type: "error", text: "Skill name and icon name are required." });
      return;
    }

    setIsAddingSkill(true);
    setSkillMessage({ type: "", text: "" });

    try {
      const res = await fetch(`${API_BASE_URL}/api/skills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newSkill)
      });

      const data = await res.json();
      if (res.ok) {
        setSkills(prev => [...prev, data]);
        setNewSkill({ category: "Frontend", name: "", icon: "" });
        setSkillMessage({ type: "success", text: "Skill added successfully!" });
      } else {
        setSkillMessage({ type: "error", text: data.error || "Failed to add skill." });
      }
    } catch (error) {
      setSkillMessage({ type: "error", text: "Server connection failed." });
    } finally {
      setIsAddingSkill(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/skills/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        setSkills(prev => prev.filter(s => s._id !== id));
      } else {
        alert("Failed to delete skill.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ----------------------------------------------------
  // Project Actions
  // ----------------------------------------------------
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title.trim() || !projectForm.description.trim() || !projectForm.image.trim()) {
      setProjectMessage({ type: "error", text: "Title, short description, and image URL are required." });
      return;
    }

    setIsSavingProject(true);
    setProjectMessage({ type: "", text: "" });

    const projectPayload = {
      title: projectForm.title,
      description: projectForm.description,
      longDescription: projectForm.longDescription,
      features: projectForm.featuresString.split("\n").map(f => f.trim()).filter(Boolean),
      stack: projectForm.stackString.split(",").map(s => s.trim()).filter(Boolean),
      githubClient: projectForm.githubClient,
      githubServer: projectForm.githubServer,
      live: projectForm.live,
      image: projectForm.image
    };

    try {
      const url = editingProjectId 
        ? `${API_BASE_URL}/api/projects/${editingProjectId}`
        : `${API_BASE_URL}/api/projects`;
      
      const method = editingProjectId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(projectPayload)
      });

      const data = await res.json();
      if (res.ok) {
        if (editingProjectId) {
          setProjects(prev => prev.map(p => p._id === editingProjectId ? data : p));
          setProjectMessage({ type: "success", text: "Project updated successfully!" });
        } else {
          setProjects(prev => [...prev, data]);
          setProjectMessage({ type: "success", text: "Project added successfully!" });
        }
        
        // Reset Form
        setEditingProjectId(null);
        setProjectForm({
          title: "",
          description: "",
          longDescription: "",
          featuresString: "",
          stackString: "",
          githubClient: "",
          githubServer: "",
          live: "",
          image: ""
        });
      } else {
        setProjectMessage({ type: "error", text: data.error || "Failed to save project." });
      }
    } catch (error) {
      setProjectMessage({ type: "error", text: "Server connection failed." });
    } finally {
      setIsSavingProject(false);
    }
  };

  const handleEditProject = (project: any) => {
    setEditingProjectId(project._id);
    setProjectForm({
      title: project.title || "",
      description: project.description || "",
      longDescription: project.longDescription || "",
      featuresString: project.features?.join("\n") || "",
      stackString: project.stack?.join(", ") || "",
      githubClient: project.githubClient || "",
      githubServer: project.githubServer || "",
      live: project.live || "",
      image: project.image || ""
    });
    // Scroll form into view
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        setProjects(prev => prev.filter(p => p._id !== id));
      } else {
        alert("Failed to delete project.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ----------------------------------------------------
  // LOGIN SCREEN
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6 text-text-primary relative overflow-hidden bg-dot-pattern">
        {/* Decorative Neon Blurs */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] aspect-square rounded-full bg-accent-violet/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] aspect-square rounded-full bg-accent-cyan/10 blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-bg-surface border border-border rounded-2xl overflow-hidden shadow-2xl z-10"
        >
          {/* Header */}
          <div className="bg-border/30 px-6 py-4 flex items-center gap-2 border-b border-border/50">
            <span className="w-3 h-3 rounded-full bg-red-500/50" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <span className="w-3 h-3 rounded-full bg-green-500/50" />
            <span className="ml-2 text-xs font-mono text-text-muted">secure-login.sh</span>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            <div className="text-center space-y-2 mb-4">
              <h2 className="text-2xl font-bold font-mono text-accent-cyan">Admin Access</h2>
              <p className="text-xs text-text-muted font-mono">Authenticate to update portfolio configuration</p>
            </div>

            {loginError && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-lg flex items-start gap-3 text-sm text-rose-400">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-mono text-text-muted">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                disabled={isLoggingIn}
                className="w-full bg-[#0d0d14] border border-border py-3 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors font-mono text-sm disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-text-muted">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoggingIn}
                className="w-full bg-[#0d0d14] border border-border py-3 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors font-mono text-sm disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-4 bg-accent-cyan text-bg-primary font-bold rounded-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 font-mono text-sm"
            >
              {isLoggingIn ? (
                <>
                  Authenticating...
                  <Loader2 size={16} className="animate-spin" />
                </>
              ) : (
                <>
                  Execute Log_In
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <Link href="/" className="text-xs font-mono text-text-muted hover:text-accent-cyan transition-colors">
                &lt; Return to Website /&gt;
              </Link>
            </div>
          </form>
        </motion.div>
      </main>
    );
  }

  // ----------------------------------------------------
  // ADMIN DASHBOARD
  // ----------------------------------------------------
  return (
    <main className="min-h-screen bg-[#0a0a0f] p-6 md:p-12 text-text-primary bg-dot-pattern">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-border/40 pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold font-mono text-accent-cyan">Control Panel</h1>
            <p className="text-sm text-text-muted font-mono">// update portfolio hero, skills, and projects</p>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/" className="px-4 py-2 border border-border hover:border-accent-cyan text-xs font-mono rounded-lg transition-all text-text-primary">
              View Website
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 text-xs font-mono rounded-lg flex items-center gap-2 transition-all"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-4 border-b border-border/40 overflow-x-auto pb-px scrollbar-none">
          {(["hero", "skills", "projects"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm md:text-base font-mono transition-all relative capitalize shrink-0 ${
                activeTab === tab ? "text-accent-cyan" : "text-text-muted hover:text-text-primary"
              }`}
            >
              {tab === "hero" && <span className="flex items-center gap-2"><User size={16} />Hero Section</span>}
              {tab === "skills" && <span className="flex items-center gap-2"><Code size={16} />Tech Stack</span>}
              {tab === "projects" && <span className="flex items-center gap-2"><Briefcase size={16} />Projects</span>}
              {activeTab === tab && (
                <motion.div layoutId="adminTab" className="absolute bottom-0 left-0 w-full h-0.5 bg-accent-cyan" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        <div className="mt-8">
          {/* TAB 1: HERO CONFIG */}
          {activeTab === "hero" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-bg-surface border border-border rounded-xl p-6 md:p-8 space-y-6"
            >
              <div className="border-b border-border/40 pb-4">
                <h3 className="text-xl font-bold font-mono text-accent-cyan">Edit Hero Data</h3>
                <p className="text-xs text-text-muted font-mono">Updates landing page title, dynamic typing statements, and CV file path.</p>
              </div>

              <form onSubmit={handleSaveHero} className="space-y-6 max-w-2xl">
                {heroMessage.text && (
                  <div className={`p-4 rounded-lg border text-sm flex items-start gap-3 ${
                    heroMessage.type === "success" 
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                      : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                  }`}>
                    {heroMessage.type === "success" ? <CheckCircle2 size={18} className="mt-0.5 shrink-0" /> : <AlertCircle size={18} className="mt-0.5 shrink-0" />}
                    <span>{heroMessage.text}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-mono text-text-muted">Display Name (Hero Title)</label>
                  <input
                    type="text"
                    value={heroData.title}
                    onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                    required
                    className="w-full bg-[#0d0d14] border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono text-text-muted">Typing Text Roles (separated by comma)</label>
                  <input
                    type="text"
                    value={typingTextString}
                    onChange={(e) => setTypingTextString(e.target.value)}
                    placeholder="e.g. Web Developer, MIS Student, Technical Manager"
                    required
                    className="w-full bg-[#0d0d14] border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono text-text-muted">Bio Subtitle</label>
                  <textarea
                    rows={4}
                    value={heroData.subtitle}
                    onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                    required
                    className="w-full bg-[#0d0d14] border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors resize-none text-sm leading-relaxed"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono text-text-muted">Download Resume/CV PDF Path (e.g. /cv.pdf)</label>
                  <input
                    type="text"
                    value={heroData.resumeUrl}
                    onChange={(e) => setHeroData({ ...heroData, resumeUrl: e.target.value })}
                    className="w-full bg-[#0d0d14] border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors font-mono text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSavingHero}
                  className="px-6 py-3 bg-accent-cyan text-bg-primary font-bold rounded-lg flex items-center gap-2 hover:scale-105 active:scale-0.95 transition-all font-mono text-sm disabled:opacity-50"
                >
                  {isSavingHero ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Save Hero Settings
                </button>
              </form>
            </motion.div>
          )}

          {/* TAB 2: TECH STACK (SKILLS) */}
          {activeTab === "skills" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Form to Add Skill */}
              <div className="bg-bg-surface border border-border rounded-xl p-6 h-fit space-y-6 lg:col-span-1">
                <div className="border-b border-border/40 pb-4">
                  <h3 className="text-xl font-bold font-mono text-accent-cyan">Add Skill</h3>
                  <p className="text-xs text-text-muted font-mono">Insert a new tool or language into your tech stack grid.</p>
                </div>

                <form onSubmit={handleAddSkill} className="space-y-5">
                  {skillMessage.text && (
                    <div className={`p-4 rounded-lg border text-sm flex items-start gap-2 ${
                      skillMessage.type === "success" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                    }`}>
                      {skillMessage.type === "success" ? <CheckCircle2 size={16} className="mt-0.5" /> : <AlertCircle size={16} className="mt-0.5" />}
                      <span>{skillMessage.text}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-text-muted">Category</label>
                    <select
                      value={newSkill.category}
                      onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                      className="w-full bg-[#0d0d14] border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-sm"
                    >
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Languages">Languages</option>
                      <option value="Tools">Tools</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-text-muted">Skill Name (e.g. React)</label>
                    <input
                      type="text"
                      value={newSkill.name}
                      onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                      placeholder="React"
                      required
                      className="w-full bg-[#0d0d14] border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-text-muted">React Icon Class Name (e.g. FaReact, SiMongodb)</label>
                    <input
                      type="text"
                      value={newSkill.icon}
                      onChange={(e) => setNewSkill({ ...newSkill, icon: e.target.value })}
                      placeholder="FaReact"
                      required
                      className="w-full bg-[#0d0d14] border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors font-mono text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isAddingSkill}
                    className="w-full py-3 bg-accent-cyan text-bg-primary font-bold rounded-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all font-mono text-sm disabled:opacity-50"
                  >
                    {isAddingSkill ? <Loader2 size={16} className="animate-spin" /> : <PlusCircle size={16} />}
                    Add Skill Icon
                  </button>
                </form>
              </div>

              {/* Skills Listing grouped by category */}
              <div className="bg-bg-surface border border-border rounded-xl p-6 lg:col-span-2 space-y-6">
                <div className="border-b border-border/40 pb-4">
                  <h3 className="text-xl font-bold font-mono text-accent-cyan">Current Tech Stack</h3>
                  <p className="text-xs text-text-muted font-mono">Review or delete existing skills grouped by their dashboard rows.</p>
                </div>

                <div className="space-y-8">
                  {["Frontend", "Backend", "Languages", "Tools"].map((category) => {
                    const group = skills.filter((s) => s.category === category);
                    return (
                      <div key={category} className="space-y-4">
                        <h4 className="font-mono text-sm text-accent-violet border-b border-border/30 pb-1.5 uppercase tracking-wide">
                          {category}
                        </h4>
                        
                        {group.length === 0 ? (
                          <p className="text-xs text-text-muted font-mono pl-2">No skills in this category.</p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {group.map((skill) => (
                              <div
                                key={skill._id}
                                className="flex items-center justify-between p-3 rounded-lg bg-[#0d0d14] border border-border hover:border-accent-cyan/30 transition-all group"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="font-mono text-xs text-accent-cyan">{skill.icon}</span>
                                  <span className="text-sm font-medium">{skill.name}</span>
                                </div>
                                <button
                                  onClick={() => handleDeleteSkill(skill._id)}
                                  className="text-text-muted hover:text-rose-400 p-1.5 rounded transition-colors"
                                >
                                  <Trash size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: MANAGE PROJECTS */}
          {activeTab === "projects" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Form to Create/Edit Project */}
              <div className="bg-bg-surface border border-border rounded-xl p-6 md:p-8 space-y-6">
                <div className="border-b border-border/40 pb-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold font-mono text-accent-cyan">
                      {editingProjectId ? "Modify Project Details" : "Create New Project Card"}
                    </h3>
                    <p className="text-xs text-text-muted font-mono">Fill in the fields to deploy or edit your portfolio project metadata.</p>
                  </div>
                  {editingProjectId && (
                    <button
                      onClick={() => {
                        setEditingProjectId(null);
                        setProjectForm({
                          title: "",
                          description: "",
                          longDescription: "",
                          featuresString: "",
                          stackString: "",
                          githubClient: "",
                          githubServer: "",
                          live: "",
                          image: ""
                        });
                      }}
                      className="px-3 py-1.5 bg-border text-text-primary text-xs font-mono rounded hover:bg-border/70 transition-colors"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>

                <form onSubmit={handleProjectSubmit} className="space-y-6">
                  {projectMessage.text && (
                    <div className={`p-4 rounded-lg border text-sm flex items-start gap-2 ${
                      projectMessage.type === "success" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                    }`}>
                      {projectMessage.type === "success" ? <CheckCircle2 size={16} className="mt-0.5" /> : <AlertCircle size={16} className="mt-0.5" />}
                      <span>{projectMessage.text}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-text-muted">Project Title</label>
                      <input
                        type="text"
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                        placeholder="RecipeHub"
                        required
                        className="w-full bg-[#0d0d14] border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-text-muted">Image URL (screenshot link or local asset path)</label>
                      <input
                        type="text"
                        value={projectForm.image}
                        onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                        placeholder="/RecipeHub Picture.png"
                        required
                        className="w-full bg-[#0d0d14] border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-sm font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-text-muted">Card Short Description</label>
                    <input
                      type="text"
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      placeholder="A short overview of the project that displays on the grid card."
                      required
                      className="w-full bg-[#0d0d14] border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-text-muted">Modal Detailed Description (Optional)</label>
                    <textarea
                      rows={4}
                      value={projectForm.longDescription}
                      onChange={(e) => setProjectForm({ ...projectForm, longDescription: e.target.value })}
                      placeholder="A comprehensive breakdown of the application scope, databases, and purpose."
                      className="w-full bg-[#0d0d14] border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-sm leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-text-muted">Project Features (one per line)</label>
                      <textarea
                        rows={5}
                        value={projectForm.featuresString}
                        onChange={(e) => setProjectForm({ ...projectForm, featuresString: e.target.value })}
                        placeholder="Role-based access controls&#10;Stripe Checkout payments&#10;Dynamic filters"
                        className="w-full bg-[#0d0d14] border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-sm leading-relaxed font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-text-muted">Tech Stack (comma separated)</label>
                      <textarea
                        rows={5}
                        value={projectForm.stackString}
                        onChange={(e) => setProjectForm({ ...projectForm, stackString: e.target.value })}
                        placeholder="Next.js, Tailwind CSS, MongoDB, Node.js"
                        className="w-full bg-[#0d0d14] border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-sm leading-relaxed font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-text-muted">Live Demo Link</label>
                      <input
                        type="url"
                        value={projectForm.live}
                        onChange={(e) => setProjectForm({ ...projectForm, live: e.target.value })}
                        placeholder="https://example.com"
                        className="w-full bg-[#0d0d14] border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-text-muted">GitHub Client Link</label>
                      <input
                        type="url"
                        value={projectForm.githubClient}
                        onChange={(e) => setProjectForm({ ...projectForm, githubClient: e.target.value })}
                        placeholder="https://github.com/user/client"
                        className="w-full bg-[#0d0d14] border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-text-muted">GitHub Server Link</label>
                      <input
                        type="url"
                        value={projectForm.githubServer}
                        onChange={(e) => setProjectForm({ ...projectForm, githubServer: e.target.value })}
                        placeholder="https://github.com/user/server"
                        className="w-full bg-[#0d0d14] border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-xs font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingProject}
                    className="px-6 py-3 bg-accent-cyan text-bg-primary font-bold rounded-lg flex items-center gap-2 hover:scale-105 active:scale-0.95 transition-all font-mono text-sm disabled:opacity-50"
                  >
                    {isSavingProject ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {editingProjectId ? "Update Project Card" : "Publish Project Card"}
                  </button>
                </form>
              </div>

              {/* Projects Grid Listing */}
              <div className="bg-bg-surface border border-border rounded-xl p-6 md:p-8 space-y-6">
                <div className="border-b border-border/40 pb-4">
                  <h3 className="text-xl font-bold font-mono text-accent-cyan">Active Projects Showcase</h3>
                  <p className="text-xs text-text-muted font-mono">View, edit, or remove project cards currently rendered on the website.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <div
                      key={project._id}
                      className="border border-border rounded-xl overflow-hidden flex flex-col bg-[#0d0d14] hover:border-accent-cyan/30 transition-colors"
                    >
                      <div className="aspect-video w-full overflow-hidden bg-border/20">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <h4 className="font-bold text-accent-cyan font-mono text-lg">{project.title}</h4>
                          <p className="text-xs text-text-muted line-clamp-2 mt-1">{project.description}</p>
                        </div>

                        <div className="flex gap-3 border-t border-border/40 pt-4">
                          <button
                            onClick={() => handleEditProject(project)}
                            className="flex-1 py-2 bg-white/5 border border-white/10 text-text-primary rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 hover:bg-white/10 transition-all"
                          >
                            <Edit size={12} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project._id)}
                            className="flex-1 py-2 bg-rose-500/10 border border-rose-500/10 text-rose-400 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 hover:bg-rose-500/20 transition-all"
                          >
                            <Trash size={12} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
