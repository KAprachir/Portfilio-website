# CLAUDE.md — Portfolio Project Guide

This guide outlines build commands, project structure, and key development guidelines for this Next.js portfolio website.

## Build & Command Guide
- **Development Server**: `npm run dev`
- **Build Production**: `npm run build`
- **Start Production**: `npm run start`
- **Linter**: `npm run lint`

## Project Structure
- `/app`: Next.js App Router pages and API routes.
  - `layout.tsx`: Root HTML shell and global font/Lenis setups.
  - `page.tsx`: Single-page layout containing main portfolio sections.
  - `globals.css`: Tailwind configuration base rules and custom global themes.
  - `/api/contact/route.ts`: Nodemailer contact form submission handler.
- `/components`: Component tree.
  - `/sections`: Page sections (Hero, About, Projects, Skills, Qualifications, Contact).
  - `/ui`: Reuseable layout elements (Navbar, Footer, CustomCursor).
- `/hooks`: Custom hooks (`useGsap.ts`).
- `/lib`: Global configs (`lenisConfig.ts`).
- `/public`: Assets (project screenshots, CV/resume files, and icons).

## Custom Rules & Constraints
Detailed AI coding rules and guidelines are maintained in [AGENTS.md](file:///c:/Projects/portfolio/AGENTS.md). Refer to it before writing any code or modifying dependencies.
