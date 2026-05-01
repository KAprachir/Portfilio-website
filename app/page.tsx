import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Qualifications from "@/components/sections/Qualifications";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      
      <div className="flex flex-col">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Qualifications />
        <Contact />
      </div>

      <Footer />
    </main>
  );
}
