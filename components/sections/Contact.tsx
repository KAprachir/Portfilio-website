"use client";

import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Contact() {
  return (
    <section id="contact" className="py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="font-mono text-accent-cyan mb-2">// let's connect</p>
          <h2 className="text-4xl md:text-5xl font-bold font-mono mb-6">Have an opportunity? Let's talk.</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-6 p-6 bg-bg-surface border border-border rounded-xl group hover:border-accent-cyan transition-all"
            >
              <div className="p-4 bg-accent-cyan/10 rounded-lg text-accent-cyan group-hover:bg-accent-cyan group-hover:text-bg-primary transition-all">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-sm text-text-muted font-mono mb-1">Email</p>
                <p className="text-lg font-medium">kaprachir23@gmail.com</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.a
                href="https://linkedin.com"
                target="_blank"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-6 p-6 bg-bg-surface border border-border rounded-xl group hover:border-accent-cyan transition-all"
              >
                <div className="p-4 bg-accent-violet/10 rounded-lg text-accent-violet group-hover:bg-accent-violet group-hover:text-bg-primary transition-all">
                  <FaLinkedin size={24} />
                </div>
                <div>
                  <p className="text-sm text-text-muted font-mono mb-1">LinkedIn</p>
                  <p className="text-lg font-medium">Prachir</p>
                </div>
              </motion.a>

              <motion.a
                href="https://github.com/KAprachir"
                target="_blank"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-6 p-6 bg-bg-surface border border-border rounded-xl group hover:border-accent-cyan transition-all"
              >
                <div className="p-4 bg-white/5 rounded-lg text-text-primary group-hover:bg-text-primary group-hover:text-bg-primary transition-all">
                  <FaGithub size={24} />
                </div>
                <div>
                  <p className="text-sm text-text-muted font-mono mb-1">GitHub</p>
                  <p className="text-lg font-medium">KAprachir</p>
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
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-mono text-text-muted">Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe"
                  className="w-full bg-transparent border-b border-border py-3 px-1 focus:outline-none focus:border-accent-cyan transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-mono text-text-muted">Email</label>
                <input 
                  type="email" 
                  placeholder="john@example.com"
                  className="w-full bg-transparent border-b border-border py-3 px-1 focus:outline-none focus:border-accent-cyan transition-colors"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-mono text-text-muted">Message</label>
              <textarea 
                rows={4} 
                placeholder="How can I help you?"
                className="w-full bg-transparent border-b border-border py-3 px-1 focus:outline-none focus:border-accent-cyan transition-colors resize-none"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-accent-cyan text-bg-primary font-bold rounded-lg flex items-center justify-center gap-2 group"
            >
              Send Message
              <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
