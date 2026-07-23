"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Plus, Trash, Edit, Save, PlusCircle, Briefcase, Code, User, Loader2, CheckCircle2, AlertCircle, Mail, BookOpen, Award, Check } from "lucide-react";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://server-nu-bice.vercel.app";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState<"hero" | "skills" | "projects" | "timeline" | "blog" | "inbox">("hero");

  // Hero States
  const [heroData, setHeroData] = useState({
    title: "",
    typingTexts: [] as string[],
    subtitle: "",
    resumeUrl: "",
    aboutTitle: "",
    aboutBio: [] as string[],
    aboutWhoami: "",
    aboutLocation: "",
    aboutStatus: "",
    aboutGoal: ""
  });
  const [typingTextString, setTypingTextString] = useState("");
  const [aboutBioString, setAboutBioString] = useState("");
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
    technicalDetailsString: "",
    stackString: "",
    challengesString: "",
    futurePlansString: "",
    githubClient: "",
    githubServer: "",
    live: "",
    image: ""
  });
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [projectMessage, setProjectMessage] = useState({ type: "" as "success" | "error" | "", text: "" });

  // Inbox Messages State
  const [messages, setMessages] = useState([] as any[]);

  // Blog States
  const [posts, setPosts] = useState([] as any[]);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [postForm, setPostForm] = useState({
    title: "",
    slug: "",
    content: "",
    summary: "",
    tagsString: "",
    readTime: "",
    isPublished: true
  });
  const [isSavingPost, setIsSavingPost] = useState(false);
  const [postMessage, setPostMessage] = useState({ type: "" as "success" | "error" | "", text: "" });

  // Qualifications Timeline States
  const [qualifications, setQualifications] = useState([] as any[]);
  const [editingQualId, setEditingQualId] = useState<string | null>(null);
  const [qualForm, setQualForm] = useState({
    type: "Education" as "Education" | "Experience",
    title: "",
    subtitle: "",
    duration: "",
    detailsString: "",
    tagsString: "",
    certUrl: ""
  });
  const [isSavingQual, setIsSavingQual] = useState(false);
  const [qualMessage, setQualMessage] = useState({ type: "" as "success" | "error" | "", text: "" });

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
          setAboutBioString(data.aboutBio?.join("\n") || "");
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

      // Fetch Qualifications
      const qualsRes = await fetch(`${API_BASE_URL}/api/qualifications`);
      if (qualsRes.ok) {
        const data = await qualsRes.json();
        setQualifications(data || []);
      }

      // Fetch Blog Posts (Admin Auth)
      const postsRes = await fetch(`${API_BASE_URL}/api/admin/posts`, {
        headers: { "Authorization": `Bearer ${activeToken}` }
      });
      if (postsRes.ok) {
        const data = await postsRes.json();
        setPosts(data || []);
      }

      // Fetch Messages (Admin Auth)
      const messagesRes = await fetch(`${API_BASE_URL}/api/messages`, {
        headers: { "Authorization": `Bearer ${activeToken}` }
      });
      if (messagesRes.ok) {
        const data = await messagesRes.json();
        setMessages(data || []);
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
      typingTexts: typingTextString.split(",").map(t => t.trim()).filter(Boolean),
      aboutBio: aboutBioString.split("\n").map(b => b.trim()).filter(Boolean)
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
      technicalDetails: projectForm.technicalDetailsString.split("\n").map(t => t.trim()).filter(Boolean),
      stack: projectForm.stackString.split(",").map(s => s.trim()).filter(Boolean),
      challenges: projectForm.challengesString.split("\n").map(c => c.trim()).filter(Boolean),
      futurePlans: projectForm.futurePlansString.split("\n").map(p => p.trim()).filter(Boolean),
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
          technicalDetailsString: "",
          stackString: "",
          challengesString: "",
          futurePlansString: "",
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
      technicalDetailsString: project.technicalDetails?.join("\n") || "",
      stackString: project.stack?.join(", ") || "",
      challengesString: project.challenges?.join("\n") || "",
      futurePlansString: project.futurePlans?.join("\n") || "",
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
  // Message Inbox Actions
  // ----------------------------------------------------
  const handleToggleReadMessage = async (id: string, currentReadStatus: boolean) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/messages/${id}/read`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ isRead: !currentReadStatus })
      });
      if (res.ok) {
        const updatedMsg = await res.json();
        setMessages(prev => prev.map(m => m._id === id ? updatedMsg : m));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Delete this contact inquiry?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/messages/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setMessages(prev => prev.filter(m => m._id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ----------------------------------------------------
  // Blog Post Actions
  // ----------------------------------------------------
  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postForm.title.trim() || !postForm.slug.trim() || !postForm.content.trim() || !postForm.summary.trim()) {
      setPostMessage({ type: "error", text: "Title, URL slug, summary, and post content are required." });
      return;
    }

    setIsSavingPost(true);
    setPostMessage({ type: "", text: "" });

    const postPayload = {
      title: postForm.title,
      slug: postForm.slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "-"),
      content: postForm.content,
      summary: postForm.summary,
      tags: postForm.tagsString.split(",").map(t => t.trim()).filter(Boolean),
      readTime: postForm.readTime || "3 min read",
      isPublished: postForm.isPublished
    };

    try {
      const url = editingPostId
        ? `${API_BASE_URL}/api/posts/${editingPostId}`
        : `${API_BASE_URL}/api/posts`;
      const method = editingPostId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(postPayload)
      });

      const data = await res.json();
      if (res.ok) {
        if (editingPostId) {
          setPosts(prev => prev.map(p => p._id === editingPostId ? data : p));
          setPostMessage({ type: "success", text: "Article updated successfully!" });
        } else {
          setPosts(prev => [data, ...prev]);
          setPostMessage({ type: "success", text: "Article published successfully!" });
        }
        
        // Reset Form
        setEditingPostId(null);
        setPostForm({
          title: "",
          slug: "",
          content: "",
          summary: "",
          tagsString: "",
          readTime: "",
          isPublished: true
        });
      } else {
        setPostMessage({ type: "error", text: data.error || "Failed to save blog post." });
      }
    } catch (error) {
      setPostMessage({ type: "error", text: "Server connection failed." });
    } finally {
      setIsSavingPost(false);
    }
  };

  const handleEditPost = (post: any) => {
    setEditingPostId(post._id);
    setPostForm({
      title: post.title || "",
      slug: post.slug || "",
      content: post.content || "",
      summary: post.summary || "",
      tagsString: post.tags?.join(", ") || "",
      readTime: post.readTime || "",
      isPublished: post.isPublished !== undefined ? post.isPublished : true
    });
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setPosts(prev => prev.filter(p => p._id !== id));
      } else {
        alert("Failed to delete post.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ----------------------------------------------------
  // Qualification Actions
  // ----------------------------------------------------
  const handleQualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qualForm.title.trim() || !qualForm.subtitle.trim() || !qualForm.duration.trim()) {
      setQualMessage({ type: "error", text: "Title, institution/company, and duration are required." });
      return;
    }

    setIsSavingQual(true);
    setQualMessage({ type: "", text: "" });

    const qualPayload = {
      type: qualForm.type,
      title: qualForm.title,
      subtitle: qualForm.subtitle,
      duration: qualForm.duration,
      details: qualForm.detailsString.split("\n").map(d => d.trim()).filter(Boolean),
      tags: qualForm.tagsString.split(",").map(t => t.trim()).filter(Boolean),
      certUrl: qualForm.certUrl
    };

    try {
      const url = editingQualId
        ? `${API_BASE_URL}/api/qualifications/${editingQualId}`
        : `${API_BASE_URL}/api/qualifications`;
      const method = editingQualId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(qualPayload)
      });

      const data = await res.json();
      if (res.ok) {
        if (editingQualId) {
          setQualifications(prev => prev.map(q => q._id === editingQualId ? data : q));
          setQualMessage({ type: "success", text: "Qualification updated successfully!" });
        } else {
          setQualifications(prev => [...prev, data]);
          setQualMessage({ type: "success", text: "Qualification added successfully!" });
        }

        // Reset Form
        setEditingQualId(null);
        setQualForm({
          type: "Education",
          title: "",
          subtitle: "",
          duration: "",
          detailsString: "",
          tagsString: "",
          certUrl: ""
        });
      } else {
        setQualMessage({ type: "error", text: data.error || "Failed to save qualification." });
      }
    } catch (error) {
      setQualMessage({ type: "error", text: "Server connection failed." });
    } finally {
      setIsSavingQual(false);
    }
  };

  const handleEditQual = (qual: any) => {
    setEditingQualId(qual._id);
    setQualForm({
      type: qual.type || "Education",
      title: qual.title || "",
      subtitle: qual.subtitle || "",
      duration: qual.duration || "",
      detailsString: qual.details?.join("\n") || "",
      tagsString: qual.tags?.join(", ") || "",
      certUrl: qual.certUrl || ""
    });
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleDeleteQual = async (id: string) => {
    if (!confirm("Are you sure you want to delete this qualification timeline item?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/qualifications/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setQualifications(prev => prev.filter(q => q._id !== id));
      } else {
        alert("Failed to delete qualification.");
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
      <main className="min-h-screen bg-bg-primary flex items-center justify-center p-6 text-text-primary relative overflow-hidden bg-dot-pattern">
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
                className="w-full bg-bg-primary/60 border border-border py-3 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors font-mono text-sm disabled:opacity-50"
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
                className="w-full bg-bg-primary/60 border border-border py-3 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors font-mono text-sm disabled:opacity-50"
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
    <main className="min-h-screen bg-bg-primary p-6 md:p-12 text-text-primary bg-dot-pattern">
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
          {(["hero", "skills", "projects", "timeline", "blog", "inbox"] as const).map((tab) => (
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
              {tab === "timeline" && <span className="flex items-center gap-2"><Award size={16} />Timeline</span>}
              {tab === "blog" && <span className="flex items-center gap-2"><BookOpen size={16} />Blog Articles</span>}
              {tab === "inbox" && (
                <span className="flex items-center gap-2">
                  <Mail size={16} />
                  Inbox
                  {messages.filter(m => !m.isRead).length > 0 && (
                    <span className="bg-accent-cyan text-bg-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full font-mono">
                      {messages.filter(m => !m.isRead).length}
                    </span>
                  )}
                </span>
              )}
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
              className="bg-bg-primary/60 border border-border rounded-xl p-6 md:p-8 space-y-6"
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
                    className="w-full bg-bg-primary/60 border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors"
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
                    className="w-full bg-bg-primary/60 border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono text-text-muted">Bio Subtitle</label>
                  <textarea
                    rows={4}
                    value={heroData.subtitle}
                    onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                    required
                    className="w-full bg-bg-primary/60 border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors resize-none text-sm leading-relaxed"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono text-text-muted">Download Resume/CV PDF Path (e.g. /cv.pdf)</label>
                  <input
                    type="text"
                    value={heroData.resumeUrl}
                    onChange={(e) => setHeroData({ ...heroData, resumeUrl: e.target.value })}
                    className="w-full bg-bg-primary/60 border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors font-mono text-sm"
                  />
                </div>

                {/* About Me Sub-Section */}
                <div className="border-t border-border/40 pt-6 mt-6 space-y-4">
                  <h4 className="text-sm font-mono text-accent-cyan">// About Me Section Settings</h4>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-text-muted">About Section Title</label>
                    <input
                      type="text"
                      value={heroData.aboutTitle}
                      onChange={(e) => setHeroData({ ...heroData, aboutTitle: e.target.value })}
                      required
                      className="w-full bg-bg-primary/60 border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-text-muted">About Bio Paragraphs (one per line, HTML tags allowed like &lt;span class="text-accent-cyan"&gt;text&lt;/span&gt;)</label>
                    <textarea
                      rows={5}
                      value={aboutBioString}
                      onChange={(e) => setAboutBioString(e.target.value)}
                      required
                      className="w-full bg-bg-primary/60 border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors leading-relaxed font-mono text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-text-muted">Terminal Profile: Who Am I</label>
                      <input
                        type="text"
                        value={heroData.aboutWhoami}
                        onChange={(e) => setHeroData({ ...heroData, aboutWhoami: e.target.value })}
                        required
                        className="w-full bg-bg-primary/60 border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-text-muted">Terminal Profile: Location</label>
                      <input
                        type="text"
                        value={heroData.aboutLocation}
                        onChange={(e) => setHeroData({ ...heroData, aboutLocation: e.target.value })}
                        required
                        className="w-full bg-bg-primary/60 border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-text-muted">Terminal Profile: Job Status</label>
                      <input
                        type="text"
                        value={heroData.aboutStatus}
                        onChange={(e) => setHeroData({ ...heroData, aboutStatus: e.target.value })}
                        required
                        className="w-full bg-bg-primary/60 border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-text-muted">Terminal Profile: Goal</label>
                      <input
                        type="text"
                        value={heroData.aboutGoal}
                        onChange={(e) => setHeroData({ ...heroData, aboutGoal: e.target.value })}
                        required
                        className="w-full bg-bg-primary/60 border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-sm"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSavingHero}
                  className="px-6 py-3 bg-accent-cyan text-bg-primary font-bold rounded-lg flex items-center gap-2 hover:scale-105 active:scale-0.95 transition-all font-mono text-sm disabled:opacity-50"
                >
                  {isSavingHero ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Save Hero & About Settings
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
              <div className="bg-bg-primary/60 border border-border rounded-xl p-6 h-fit space-y-6 lg:col-span-1">
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
                      className="w-full bg-bg-primary/60 border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-sm"
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
                      className="w-full bg-bg-primary/60 border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-sm"
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
                      className="w-full bg-bg-primary/60 border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors font-mono text-xs"
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
              <div className="bg-bg-primary/60 border border-border rounded-xl p-6 lg:col-span-2 space-y-6">
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
                                className="flex items-center justify-between p-3 rounded-lg bg-bg-primary/60 border border-border hover:border-accent-cyan/30 transition-all group"
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
              <div className="bg-bg-primary/60 border border-border rounded-xl p-6 md:p-8 space-y-6">
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
                          technicalDetailsString: "",
                          stackString: "",
                          challengesString: "",
                          futurePlansString: "",
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
                        className="w-full bg-bg-primary/60 border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors"
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
                        className="w-full bg-bg-primary/60 border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-sm font-mono"
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
                      className="w-full bg-bg-primary/60 border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-text-muted">Modal Detailed Description (Optional)</label>
                    <textarea
                      rows={4}
                      value={projectForm.longDescription}
                      onChange={(e) => setProjectForm({ ...projectForm, longDescription: e.target.value })}
                      placeholder="A comprehensive breakdown of the application scope, databases, and purpose."
                      className="w-full bg-bg-primary/60 border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-sm leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-text-muted">Project Features (one per line)</label>
                      <textarea
                        rows={5}
                        value={projectForm.featuresString}
                        onChange={(e) => setProjectForm({ ...projectForm, featuresString: e.target.value })}
                        placeholder="Role-based access controls&#10;Stripe Checkout payments&#10;Dynamic filters"
                        className="w-full bg-bg-primary/60 border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-sm leading-relaxed font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-text-muted">Technical Highlights (one per line)</label>
                      <textarea
                        rows={5}
                        value={projectForm.technicalDetailsString}
                        onChange={(e) => setProjectForm({ ...projectForm, technicalDetailsString: e.target.value })}
                        placeholder="Secured with Better Auth&#10;Stripe webhook validations"
                        className="w-full bg-bg-primary/60 border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-sm leading-relaxed font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-text-muted">Tech Stack (comma separated)</label>
                      <textarea
                        rows={5}
                        value={projectForm.stackString}
                        onChange={(e) => setProjectForm({ ...projectForm, stackString: e.target.value })}
                        placeholder="Next.js, Tailwind CSS, MongoDB, Node.js"
                        className="w-full bg-bg-primary/60 border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-sm leading-relaxed font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-text-muted">Challenges Faced (one per line)</label>
                      <textarea
                        rows={4}
                        value={projectForm.challengesString}
                        onChange={(e) => setProjectForm({ ...projectForm, challengesString: e.target.value })}
                        placeholder="Handling Stripe webhook event race conditions&#10;Structuring MongoDB aggregations for real-time filters"
                        className="w-full bg-bg-primary/60 border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-sm leading-relaxed font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-text-muted">Future Plans & Improvements (one per line)</label>
                      <textarea
                        rows={4}
                        value={projectForm.futurePlansString}
                        onChange={(e) => setProjectForm({ ...projectForm, futurePlansString: e.target.value })}
                        placeholder="Implement AI meal plan generator&#10;Add live video cooking rooms"
                        className="w-full bg-bg-primary/60 border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-sm leading-relaxed font-mono"
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
                        className="w-full bg-bg-primary/60 border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-text-muted">GitHub Client Link</label>
                      <input
                        type="url"
                        value={projectForm.githubClient}
                        onChange={(e) => setProjectForm({ ...projectForm, githubClient: e.target.value })}
                        placeholder="https://github.com/user/client"
                        className="w-full bg-bg-primary/60 border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-text-muted">GitHub Server Link</label>
                      <input
                        type="url"
                        value={projectForm.githubServer}
                        onChange={(e) => setProjectForm({ ...projectForm, githubServer: e.target.value })}
                        placeholder="https://github.com/user/server"
                        className="w-full bg-bg-primary/60 border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-xs font-mono"
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
              <div className="bg-bg-primary/60 border border-border rounded-xl p-6 md:p-8 space-y-6">
                <div className="border-b border-border/40 pb-4">
                  <h3 className="text-xl font-bold font-mono text-accent-cyan">Active Projects Showcase</h3>
                  <p className="text-xs text-text-muted font-mono">View, edit, or remove project cards currently rendered on the website.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <div
                      key={project._id}
                      className="border border-border rounded-xl overflow-hidden flex flex-col bg-bg-primary/60 hover:border-accent-cyan/30 transition-colors"
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

          {/* TAB 4: QUALIFICATIONS TIMELINE CONFIG */}
          {activeTab === "timeline" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Form to Add/Edit Timeline Item */}
              <div className="bg-bg-primary/60 border border-border rounded-xl p-6 h-fit space-y-6 lg:col-span-1">
                <div className="border-b border-border/40 pb-4">
                  <h3 className="text-xl font-bold font-mono text-accent-cyan">
                    {editingQualId ? "Edit Item" : "Add Timeline Item"}
                  </h3>
                  <p className="text-xs text-text-muted font-mono">Insert or update education achievements and work milestones.</p>
                </div>

                <form onSubmit={handleQualSubmit} className="space-y-5">
                  {qualMessage.text && (
                    <div className={`p-4 rounded-lg border text-sm flex items-start gap-2 ${
                      qualMessage.type === "success" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                    }`}>
                      {qualMessage.type === "success" ? <CheckCircle2 size={16} className="mt-0.5" /> : <AlertCircle size={16} className="mt-0.5" />}
                      <span>{qualMessage.text}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-text-muted">Item Type</label>
                    <select
                      value={qualForm.type}
                      onChange={(e) => setQualForm({ ...qualForm, type: e.target.value as any })}
                      className="w-full bg-bg-primary/60 border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-sm text-text-primary"
                    >
                      <option value="Education">Education</option>
                      <option value="Experience">Experience</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-text-muted">Degree / Job Title</label>
                    <input
                      type="text"
                      value={qualForm.title}
                      onChange={(e) => setQualForm({ ...qualForm, title: e.target.value })}
                      required
                      placeholder="e.g. BBA in MIS"
                      className="w-full bg-bg-primary/60 border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-text-muted">Institution / Company</label>
                    <input
                      type="text"
                      value={qualForm.subtitle}
                      onChange={(e) => setQualForm({ ...qualForm, subtitle: e.target.value })}
                      required
                      placeholder="e.g. Begum Rokeya University"
                      className="w-full bg-bg-primary/60 border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-text-muted">Duration (Time Period)</label>
                    <input
                      type="text"
                      value={qualForm.duration}
                      onChange={(e) => setQualForm({ ...qualForm, duration: e.target.value })}
                      required
                      placeholder="e.g. 2021–Present or 2024"
                      className="w-full bg-bg-primary/60 border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-text-muted">Bullet Point Details (one per line)</label>
                    <textarea
                      rows={4}
                      value={qualForm.detailsString}
                      onChange={(e) => setQualForm({ ...qualForm, detailsString: e.target.value })}
                      placeholder="Focusing on Database Management...&#10;Majoring in MIS..."
                      className="w-full bg-bg-primary/60 border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-xs font-mono leading-relaxed"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-text-muted">Tags (separated by comma)</label>
                    <input
                      type="text"
                      value={qualForm.tagsString}
                      onChange={(e) => setQualForm({ ...qualForm, tagsString: e.target.value })}
                      placeholder="MIS, Database Management"
                      className="w-full bg-bg-primary/60 border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-text-muted">Credential / Certificate URL (optional)</label>
                    <input
                      type="text"
                      value={qualForm.certUrl}
                      onChange={(e) => setQualForm({ ...qualForm, certUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-bg-primary/60 border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-sm"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSavingQual}
                      className="flex-1 py-3 bg-accent-cyan text-bg-primary font-bold rounded-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all font-mono text-sm disabled:opacity-50"
                    >
                      {isSavingQual ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                      Save Item
                    </button>
                    {editingQualId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingQualId(null);
                          setQualForm({
                            type: "Education",
                            title: "",
                            subtitle: "",
                            duration: "",
                            detailsString: "",
                            tagsString: "",
                            certUrl: ""
                          });
                        }}
                        className="py-3 px-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-xs font-mono"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Qualifications timeline list */}
              <div className="bg-bg-primary/60 border border-border rounded-xl p-6 md:p-8 space-y-6 lg:col-span-2">
                <div className="border-b border-border/40 pb-4">
                  <h3 className="text-xl font-bold font-mono text-accent-cyan">Active Timeline Items</h3>
                  <p className="text-xs text-text-muted font-mono">Manage qualifications displaying on your home page timeline.</p>
                </div>

                <div className="space-y-4">
                  {qualifications.length === 0 ? (
                    <p className="text-xs font-mono text-text-muted">No qualifications found in the database.</p>
                  ) : (
                    qualifications.map((qual) => (
                      <div
                        key={qual._id}
                        className="border border-border rounded-xl p-4 bg-bg-primary/60 hover:border-accent-cyan/20 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono px-2 py-0.5 bg-border/40 text-text-primary rounded border border-white/5">
                              {qual.type}
                            </span>
                            <span className="text-xs font-mono text-text-muted">{qual.duration}</span>
                          </div>
                          <h4 className="font-bold text-accent-cyan font-mono text-base mt-2">{qual.title}</h4>
                          <p className="text-xs text-text-muted font-mono">{qual.subtitle}</p>
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                          <button
                            onClick={() => handleEditQual(qual)}
                            className="flex-1 md:flex-none py-2 px-4 bg-white/5 border border-white/10 text-text-primary rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 hover:bg-white/10 transition-all"
                          >
                            <Edit size={12} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteQual(qual._id)}
                            className="flex-1 md:flex-none py-2 px-4 bg-rose-500/10 border border-rose-500/10 text-rose-400 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 hover:bg-rose-500/20 transition-all"
                          >
                            <Trash size={12} />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 5: BLOG ARTICLES ENGINE CONFIG */}
          {activeTab === "blog" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Form to Write/Edit Article */}
              <div className="bg-bg-primary/60 border border-border rounded-xl p-6 h-fit space-y-6 lg:col-span-1">
                <div className="border-b border-border/40 pb-4">
                  <h3 className="text-xl font-bold font-mono text-accent-cyan">
                    {editingPostId ? "Edit Article" : "Write Article"}
                  </h3>
                  <p className="text-xs text-text-muted font-mono">Publish updates, tech case studies, and business ideas.</p>
                </div>

                <form onSubmit={handlePostSubmit} className="space-y-5">
                  {postMessage.text && (
                    <div className={`p-4 rounded-lg border text-sm flex items-start gap-2 ${
                      postMessage.type === "success" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                    }`}>
                      {postMessage.type === "success" ? <CheckCircle2 size={16} className="mt-0.5" /> : <AlertCircle size={16} className="mt-0.5" />}
                      <span>{postMessage.text}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-text-muted">Article Title</label>
                    <input
                      type="text"
                      value={postForm.title}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        const generatedSlug = newTitle.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
                        setPostForm({ ...postForm, title: newTitle, slug: editingPostId ? postForm.slug : generatedSlug });
                      }}
                      required
                      placeholder="e.g. Bridging MIS and Web Development"
                      className="w-full bg-bg-primary/60 border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-text-muted">URL Slug (safely generated)</label>
                    <input
                      type="text"
                      value={postForm.slug}
                      onChange={(e) => setPostForm({ ...postForm, slug: e.target.value })}
                      required
                      placeholder="e.g. bridging-mis-and-web-development"
                      className="w-full bg-bg-primary/60 border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-sm font-mono text-accent-cyan"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-text-muted">Article Summary (Short Preview)</label>
                    <textarea
                      rows={2}
                      value={postForm.summary}
                      onChange={(e) => setPostForm({ ...postForm, summary: e.target.value })}
                      required
                      placeholder="Summarize the core premise of your article..."
                      className="w-full bg-bg-primary/60 border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-xs leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-text-muted">Read Time</label>
                      <input
                        type="text"
                        value={postForm.readTime}
                        onChange={(e) => setPostForm({ ...postForm, readTime: e.target.value })}
                        placeholder="e.g. 5 min read"
                        className="w-full bg-bg-primary/60 border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-text-muted">Tags (separated by comma)</label>
                      <input
                        type="text"
                        value={postForm.tagsString}
                        onChange={(e) => setPostForm({ ...postForm, tagsString: e.target.value })}
                        placeholder="MIS, Engineering"
                        className="w-full bg-bg-primary/60 border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-text-muted">Article Content (Markdown supported: **bold**, `code` blocks)</label>
                    <textarea
                      rows={8}
                      value={postForm.content}
                      onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                      required
                      placeholder="Write your article content here..."
                      className="w-full bg-bg-primary/60 border border-border py-2.5 px-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors text-xs font-mono leading-relaxed"
                    />
                  </div>

                  <div className="flex items-center gap-3 py-1">
                    <input
                      type="checkbox"
                      id="isPublished"
                      checked={postForm.isPublished}
                      onChange={(e) => setPostForm({ ...postForm, isPublished: e.target.checked })}
                      className="w-4 h-4 rounded accent-accent-cyan bg-bg-primary/60 border border-border focus:ring-0 focus:outline-none cursor-pointer"
                    />
                    <label htmlFor="isPublished" className="text-xs font-mono text-text-primary cursor-pointer select-none">
                      Publish Immediately (Draft if unchecked)
                    </label>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSavingPost}
                      className="flex-1 py-3 bg-accent-cyan text-bg-primary font-bold rounded-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all font-mono text-sm disabled:opacity-50"
                    >
                      {isSavingPost ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                      Publish Post
                    </button>
                    {editingPostId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPostId(null);
                          setPostForm({
                            title: "",
                            slug: "",
                            content: "",
                            summary: "",
                            tagsString: "",
                            readTime: "",
                            isPublished: true
                          });
                        }}
                        className="py-3 px-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-xs font-mono"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Blog articles list */}
              <div className="bg-bg-surface border border-border rounded-xl p-6 md:p-8 space-y-6 lg:col-span-2">
                <div className="border-b border-border/40 pb-4">
                  <h3 className="text-xl font-bold font-mono text-accent-cyan">Article Catalog</h3>
                  <p className="text-xs text-text-muted font-mono">Edit draft entries and view live posts.</p>
                </div>

                <div className="space-y-4">
                  {posts.length === 0 ? (
                    <p className="text-xs font-mono text-text-muted">No posts found in the database.</p>
                  ) : (
                    posts.map((post) => (
                      <div
                        key={post._id}
                        className="border border-border rounded-xl p-4 bg-bg-surface hover:border-accent-cyan/20 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                              post.isPublished 
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                                : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                            }`}>
                              {post.isPublished ? "Live" : "Draft"}
                            </span>
                            <span className="text-xs font-mono text-text-muted">/{post.slug}</span>
                          </div>
                          <h4 className="font-bold text-accent-cyan font-mono text-base mt-2">{post.title}</h4>
                          <p className="text-xs text-text-muted font-mono">{post.summary}</p>
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                          <button
                            onClick={() => handleEditPost(post)}
                            className="flex-1 md:flex-none py-2 px-4 bg-white/5 border border-white/10 text-text-primary rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 hover:bg-white/10 transition-all"
                          >
                            <Edit size={12} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePost(post._id)}
                            className="flex-1 md:flex-none py-2 px-4 bg-rose-500/10 border border-rose-500/10 text-rose-400 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 hover:bg-rose-500/20 transition-all"
                          >
                            <Trash size={12} />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 6: INBOX MESSAGES CONFIG */}
          {activeTab === "inbox" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-bg-surface border border-border rounded-xl p-6 md:p-8 space-y-6"
            >
              <div className="border-b border-border/40 pb-4 flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h3 className="text-xl font-bold font-mono text-accent-cyan">Message Inbox</h3>
                  <p className="text-xs text-text-muted font-mono">Review contact inquiries submitted on your website.</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-text-muted">Total: <strong className="text-text-primary">{messages.length}</strong></span>
                  <span className="text-text-muted">Unread: <strong className="text-accent-cyan">{messages.filter(m => !m.isRead).length}</strong></span>
                </div>
              </div>

              <div className="space-y-6">
                {messages.length === 0 ? (
                  <div className="py-12 text-center border border-border/30 rounded-xl bg-bg-surface max-w-md mx-auto">
                    <p className="text-sm font-mono text-text-muted">No messages in your inbox.</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`border rounded-xl overflow-hidden bg-bg-surface transition-all duration-300 ${
                        msg.isRead ? "border-border opacity-75" : "border-accent-cyan/40 shadow-[0_0_15px_rgba(0,212,255,0.03)]"
                      }`}
                    >
                      {/* Message Header */}
                      <div className="bg-border/10 px-4 py-3 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-border/40 gap-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${msg.isRead ? "bg-text-muted/40" : "bg-accent-cyan animate-pulse"}`} />
                          <h4 className="font-bold text-sm font-mono text-text-primary">{msg.name}</h4>
                          <span className="text-xs font-mono text-text-muted">&lt;{msg.email}&gt;</span>
                        </div>
                        <span className="text-xs font-mono text-text-muted shrink-0">
                          {new Date(msg.createdAt).toLocaleString("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short"
                          })}
                        </span>
                      </div>

                      {/* Message Body */}
                      <div className="p-5 space-y-4">
                        <div>
                          <p className="text-xs font-mono text-accent-cyan">// Subject</p>
                          <p className="text-sm font-bold text-text-primary mt-1 font-mono">{msg.subject || "No Subject"}</p>
                        </div>
                        <div>
                          <p className="text-xs font-mono text-accent-violet">// Inquiry Message</p>
                          <p className="text-sm text-text-muted mt-1 leading-relaxed whitespace-pre-wrap select-all font-sans">
                            {msg.message}
                          </p>
                        </div>

                        {/* Actions block */}
                        <div className="border-t border-border/20 pt-4 flex gap-3 justify-end">
                          <button
                            onClick={() => handleToggleReadMessage(msg._id, msg.isRead)}
                            className={`py-1.5 px-3 border rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                              msg.isRead 
                                ? "bg-white/5 border-white/10 text-text-primary hover:bg-white/10" 
                                : "bg-accent-cyan/10 border-accent-cyan/20 text-accent-cyan hover:bg-accent-cyan/20"
                            }`}
                          >
                            {msg.isRead ? (
                              <>
                                Mark Unread
                              </>
                            ) : (
                              <>
                                <Check size={12} />
                                Mark Read
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteMessage(msg._id)}
                            className="py-1.5 px-3 bg-rose-500/10 border border-rose-500/10 text-rose-400 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 hover:bg-rose-500/20 transition-all"
                          >
                            <Trash size={12} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
