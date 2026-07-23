import { FaGithub, FaLinkedin } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 border-t border-border">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <Link href="#home" className="text-xl font-bold font-mono text-accent-cyan">
          &lt;Prachir /&gt;
        </Link>
        
        <p className="text-text-muted text-sm text-center md:text-right">
          Designed & Built by Prachir © {new Date().getFullYear()}
        </p>

        <div className="flex items-center gap-6 text-text-muted">
          <Link href="https://github.com/KAprachir" target="_blank" className="hover:text-accent-cyan transition-colors">
            <FaGithub size={24} />
          </Link>
          <Link href="https://www.linkedin.com/in/khairul-alam-prachir/" target="_blank" className="hover:text-accent-cyan transition-colors">
            <FaLinkedin size={24} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
