import type { Metadata } from "next";
import { JetBrains_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import CustomCursor from "@/components/ui/CustomCursor";
import PageLoader from "@/components/ui/PageLoader";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Prachir | TPM & Web Developer",
  description: "Portfolio of Prachir, a Technical Product Manager and Full Stack Developer. Discover my technical projects, ATS pipelines, and product strategy strategies.",
  keywords: ["Prachir", "TPM", "Web Developer", "Next.js", "Portfolio", "Begum Rokeya University"],
  authors: [{ name: "Khairul Alam Prachir" }],
  openGraph: {
    title: "Prachir | TPM & Web Developer",
    description: "Portfolio of Prachir, a Technical Product Manager and Full Stack Developer. Discover my technical projects, ATS pipelines, and product strategy strategies.",
    url: "https://portfolio-pied-mu-woneet45oo.vercel.app",
    siteName: "Prachir Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prachir | TPM & Web Developer",
    description: "Portfolio of Prachir, a Technical Product Manager and Full Stack Developer. Discover my technical projects, ATS pipelines, and product strategy strategies.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light scroll-smooth">
      <body className={`${jetbrainsMono.variable} ${dmSans.variable} font-sans antialiased bg-bg-primary text-text-primary`}>
        <LenisProvider>
          <CustomCursor />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
