"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Calendar, Clock, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://server-nu-bice.vercel.app";

interface Post {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  tags: string[];
  readTime: string;
  createdAt: string;
}

export default function BlogListingPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/posts`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setPosts(data || []);
      })
      .catch(err => {
        console.error("Failed to fetch blog posts:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Filter logic
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  // Extract all unique tags
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags || [])));

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg-primary text-text-primary pt-32 pb-24 relative overflow-hidden bg-dot-pattern">
        {/* Glowing Ambient Orbs */}
        <div className="absolute top-[10%] right-[-10%] w-[50%] aspect-square rounded-full bg-accent-cyan/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] left-[-10%] w-[50%] aspect-square rounded-full bg-accent-violet/5 blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 space-y-16 relative z-10">
          
          {/* Header */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-accent-cyan hover:underline mb-2">
              <ArrowLeft size={12} /> Back to Home
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold font-mono text-text-primary">
              The <span className="text-accent-cyan">Bytes</span> Vault
            </h1>
            <p className="text-sm md:text-base text-text-muted font-mono max-w-xl">
              // Writing about management information systems, web engineering, and product building strategy.
            </p>
          </div>

          {/* Search and Filters Bar */}
          <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            {/* Search Input */}
            <div className="relative w-full md:max-w-xs group">
              <Search className="absolute left-3.5 top-3.5 text-text-muted group-focus-within:text-accent-cyan transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-bg-surface border border-border py-3 pl-11 pr-4 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors font-mono text-sm"
              />
            </div>

            {/* Tag List Filters */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs font-mono text-text-muted mr-1">Filter:</span>
              <button
                onClick={() => setSelectedTag(null)}
                className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all ${
                  selectedTag === null 
                    ? "bg-accent-cyan text-bg-primary border-accent-cyan font-bold" 
                    : "bg-border/30 border-border hover:border-accent-cyan/40 text-text-muted"
                }`}
              >
                All
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all ${
                    selectedTag === tag 
                      ? "bg-accent-cyan text-bg-primary border-accent-cyan font-bold" 
                      : "bg-border/30 border-border hover:border-accent-cyan/40 text-text-muted"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Loading Indicator */}
          {isLoading ? (
            <div className="py-24 text-center space-y-4">
              <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-mono text-text-muted">Loading article indexes...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="py-24 text-center border border-border/50 rounded-2xl bg-bg-surface/30">
              <p className="text-sm font-mono text-text-muted">No blog entries match your filter.</p>
            </div>
          ) : (
            /* Blog Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredPosts.map((post, idx) => (
                <motion.article
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -6 }}
                  className="group bg-bg-surface border border-border hover:border-accent-cyan/30 rounded-xl overflow-hidden flex flex-col justify-between p-6 transition-all h-full"
                >
                  <div className="space-y-4">
                    {/* Meta info */}
                    <div className="flex items-center gap-4 text-xs font-mono text-text-muted">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {post.readTime || "3 min read"}
                      </span>
                    </div>

                    {/* Title */}
                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="text-xl font-bold font-mono text-text-primary group-hover:text-accent-cyan transition-colors leading-tight">
                        {post.title}
                      </h3>
                    </Link>

                    {/* Summary */}
                    <p className="text-sm text-text-muted leading-relaxed">
                      {post.summary}
                    </p>
                  </div>

                  {/* Footer tags and Link */}
                  <div className="border-t border-border/40 pt-4 mt-6 flex justify-between items-center">
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] font-mono px-2 py-0.5 bg-border/40 text-text-primary rounded border border-white/5">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-xs font-mono text-accent-cyan flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    >
                      Read Post <ArrowRight size={12} />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
