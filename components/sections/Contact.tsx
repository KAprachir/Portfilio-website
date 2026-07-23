"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitStatus("error");
      setStatusMessage("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setStatusMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        setStatusMessage(data.message || "Thank you! Your message has been sent successfully.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSubmitStatus("error");
        setStatusMessage(data.error || "Something went wrong. Please try again later.");
      }
    } catch (error) {
      console.error("Contact form submission error:", error);
      setSubmitStatus("error");
      setStatusMessage("Failed to connect to the mail server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="font-mono text-accent-cyan mb-2">// let's connect</p>
          <h2 className="text-4xl md:text-5xl font-bold font-mono mb-6">Have an opportunity? Let's talk.</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 p-5 bg-bg-surface border border-border rounded-xl group hover:border-accent-cyan transition-all"
              >
                <div className="p-3.5 bg-accent-cyan/10 rounded-lg text-accent-cyan group-hover:bg-accent-cyan group-hover:text-bg-primary transition-all shrink-0">
                  <Mail size={22} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-text-muted font-mono mb-0.5">Email</p>
                  <p className="text-sm font-medium truncate">kaprachir23@gmail.com</p>
                </div>
              </motion.div>

              <motion.a
                href="tel:+8801863674523"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 }}
                className="flex items-center gap-4 p-5 bg-bg-surface border border-border rounded-xl group hover:border-accent-cyan transition-all"
              >
                <div className="p-3.5 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:bg-emerald-500 group-hover:text-bg-primary transition-all shrink-0">
                  <Phone size={22} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-text-muted font-mono mb-0.5">Phone / WhatsApp</p>
                  <p className="text-sm font-medium truncate">+880 1863-674523</p>
                </div>
              </motion.a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.a
                href="https://www.linkedin.com/in/khairul-alam-prachir/"
                target="_blank"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-4 p-5 bg-bg-surface border border-border rounded-xl group hover:border-accent-cyan transition-all"
              >
                <div className="p-3.5 bg-accent-violet/10 rounded-lg text-accent-violet group-hover:bg-accent-violet group-hover:text-bg-primary transition-all shrink-0">
                  <FaLinkedin size={22} />
                </div>
                <div>
                  <p className="text-xs text-text-muted font-mono mb-0.5">LinkedIn</p>
                  <p className="text-sm font-medium">Prachir</p>
                </div>
              </motion.a>

              <motion.a
                href="https://github.com/KAprachir"
                target="_blank"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4 p-5 bg-bg-surface border border-border rounded-xl group hover:border-accent-cyan transition-all"
              >
                <div className="p-3.5 bg-border/30 rounded-lg text-text-primary group-hover:bg-text-primary group-hover:text-bg-primary transition-all shrink-0">
                  <FaGithub size={22} />
                </div>
                <div>
                  <p className="text-xs text-text-muted font-mono mb-0.5">GitHub</p>
                  <p className="text-sm font-medium">KAprachir</p>
                </div>
              </motion.a>
            </div>
          </div>

          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-mono text-text-muted">Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  disabled={isSubmitting}
                  className="w-full bg-transparent border-b border-border py-3 px-1 focus:outline-none focus:border-accent-cyan transition-colors disabled:opacity-50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-mono text-text-muted">Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                  disabled={isSubmitting}
                  className="w-full bg-transparent border-b border-border py-3 px-1 focus:outline-none focus:border-accent-cyan transition-colors disabled:opacity-50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-mono text-text-muted">Message</label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4} 
                placeholder="How can I help you?"
                required
                disabled={isSubmitting}
                className="w-full bg-transparent border-b border-border py-3 px-1 focus:outline-none focus:border-accent-cyan transition-colors resize-none disabled:opacity-50"
              />
            </div>
            
            {submitStatus && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg flex items-start gap-3 border text-sm ${
                  submitStatus === "success"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                }`}
              >
                {submitStatus === "success" ? (
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                )}
                <span>{statusMessage}</span>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className="w-full py-4 bg-accent-cyan text-bg-primary font-bold rounded-lg flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  Sending Message...
                  <Loader2 size={18} className="animate-spin" />
                </>
              ) : (
                <>
                  Send Message
                  <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
