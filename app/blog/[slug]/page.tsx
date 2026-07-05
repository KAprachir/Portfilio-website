"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Calendar, Clock, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://server-nu-bice.vercel.app";

interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  tags: string[];
  readTime: string;
  createdAt: string;
}

export default function BlogPostReaderPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    
    fetch(`${API_BASE_URL}/api/posts/${slug}`)
      .then(res => {
        if (res.status === 404) throw new Error("Article not found.");
        if (!res.ok) throw new Error("Failed to load article.");
        return res.json();
      })
      .then(data => {
        setPost(data);
      })
      .catch(err => {
        setError(err.message || "Failed to load article.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [slug]);

  // A very basic parser to convert newlines to paragraphs and double stars to bold tags
  const renderFormattedContent = (text: string) => {
    if (!text) return "";
    return text.split("\n\n").map((para, idx) => {
      // Bold text formatting **text** -> <strong>text</strong>
      let formattedText = para.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      
      // Inline code blocks `code` -> <code class="font-mono bg-[#111118] px-1.5 py-0.5 rounded text-accent-cyan">code</code>
      formattedText = formattedText.replace(/`(.*?)`/g, '<code class="font-mono bg-[#111118] px-1.5 py-0.5 border border-border rounded text-accent-cyan">$1</code>');
      
      return (
        <p 
          key={idx} 
          className="text-text-muted text-base md:text-lg leading-relaxed mb-6 font-sans"
          dangerouslySetInnerHTML={{ __html: formattedText }}
        />
      );
    });
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0a0a0f] text-text-primary pt-32 pb-24 relative overflow-hidden bg-dot-pattern">
        {/* Glowing Ambient Orb */}
        <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[60%] aspect-square rounded-full bg-accent-violet/5 blur-[120px] pointer-events-none" />

        <div className="max-w-3xl mx-auto px-6 relative z-10">
          {/* Navigation Header */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-mono text-accent-cyan hover:underline mb-8">
            <ArrowLeft size={12} /> Return to Blog Vault
          </Link>

          {/* Loader */}
          {isLoading ? (
            <div className="py-32 text-center space-y-4">
              <Loader2 className="animate-spin text-accent-cyan mx-auto" size={32} />
              <p className="text-xs font-mono text-text-muted">Decompressing bytes...</p>
            </div>
          ) : error ? (
            /* Error Display */
            <div className="py-24 text-center border border-rose-500/20 bg-rose-500/5 rounded-2xl p-8 space-y-4">
              <AlertCircle className="text-rose-400 mx-auto" size={32} />
              <h3 className="text-xl font-bold font-mono text-rose-400">Loading Failure</h3>
              <p className="text-sm font-mono text-text-muted">{error}</p>
            </div>
          ) : post ? (
            /* Post Content */
            <article className="space-y-8">
              {/* Header Info */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-xs font-mono px-3 py-1 bg-border/40 text-text-primary rounded border border-white/5">
                      #{tag}
                    </span>
                  ))}
                </div>

                <h1 className="text-4xl md:text-5xl font-bold font-mono text-text-primary leading-tight">
                  {post.title}
                </h1>

                <div className="flex items-center gap-6 text-xs font-mono text-text-muted pt-2 border-b border-border/40 pb-6">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-accent-cyan" />
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} className="text-accent-violet" />
                    {post.readTime || "3 min read"}
                  </span>
                </div>
              </div>

              {/* Subheading Summary */}
              <p className="text-lg md:text-xl font-mono text-text-primary italic border-l-2 border-accent-cyan pl-4 leading-relaxed my-8 py-1">
                {post.summary}
              </p>

              {/* Body Content */}
              <div className="article-body font-sans pt-4">
                {renderFormattedContent(post.content)}
              </div>
            </article>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
}
