# AGENTS.md — AI Coding Rules for Portfolio

These are strict behavior rules that AI coding agents must follow when modifying this repository.

## 🛠️ Code Conventions & Style
- **TypeScript**: Always write fully typed TypeScript. Avoid using `any` types.
- **Framework**: Next.js 14 App Router. Use `"use client"` directives at the top of client-side interactive files.
- **Styling**: Tailwind CSS combined with standard CSS variables in [globals.css](file:///c:/Projects/portfolio/app/globals.css) for custom color themes (glowing cyan `#00d4ff` and violet `#7c3aed`).
- **Icons**: Use `lucide-react` for simple UI icons and `react-icons` for brand icons (GitHub, LinkedIn).

## 🌀 Animations System
- **Smooth Scroll**: Smooth scrolling is powered by Lenis via [components/LenisProvider.tsx](file:///c:/Projects/portfolio/components/LenisProvider.tsx).
- **GSAP & ScrollTrigger**: Custom scroll-driven animations use `gsap` and `@gsap/react`'s `useGSAP` hook (imported as `useGsap` from `hooks/useGsap`). Always clean up scroll triggers or let the `useGSAP` hook handle scoping.
- **Transitions**: Use `framer-motion` for simple layout changes, page loaders, navbar underline swaps, and section entrances.

## 🔒 Configuration & Environment
- Store local configuration in `.env.local` (ignored by git).
- Document all environment variables inside [.env.example](file:///c:/Projects/portfolio/.env.example).
- SMTP configurations are processed securely on server-side Next.js API routes (`/api/contact/route.ts`) to avoid leaking credentials.

## 🚀 Deployment Safeguards
- Always validate types and code formatting by running `npm run build` before pushing commits to GitHub.
- Never commit private credentials or `.env.local` files to public git trees.
