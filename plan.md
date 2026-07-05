# Portfolio CMS Backend & Admin Panel Plan

This plan outlines the architecture, schemas, and endpoints to implement a dynamic administration panel for your portfolio using MongoDB Atlas.

---

## 🏗️ Architectural Options

### Approach A: Integrated Next.js Serverless Backend (Recommended)
We build API endpoints directly inside your Next.js project under `/app/api/admin/...`.
*   **Pros**: Zero extra hosting costs, no CORS, single repository.
*   **Cons**: Requires caching database connections inside serverless handlers.

### Approach B: Separate Express.js Server
We build a separate Express.js server hosted on Render or Railway.
*   **Pros**: Dedicated running process.
*   **Cons**: Double repository maintenance, extra hosting costs, CORS setup.

---

## 🔒 Security & Admin Details

- **Admin Login**: Secure login page at `/admin` using session cookies or stateless tokens.
- **Credentials**: Stored securely as hashed values in MongoDB, or verified against `.env.local` variables.
- **Protected Actions**: All write operations (POST, PUT, DELETE) will verify admin authentication.

---

## 🗃️ MongoDB Atlas Schemas

### 1. Hero Configuration
- `title` (String)
- `typingTexts` (Array of Strings)
- `subtitle` (String)
- `resumeUrl` (String)

### 2. Tech Stack (Skills)
- `category` (String: "Frontend", "Backend", "Languages", "Tools")
- `name` (String)
- `icon` (String: Name of icon from `react-icons`)

### 3. Projects Showcase
- `title` (String)
- `description` (String)
- `longDescription` (String)
- `features` (Array of Strings)
- `stack` (Array of Strings)
- `githubClient` (String)
- `githubServer` (String)
- `live` (String)
- `image` (String: URL of uploaded screenshot)

---

## 📝 Next Steps
1. **Choose your architecture** (Next.js Integrated vs. Separate Express.js).
2. **Setup Admin Authentication model** (Simple env-based credentials vs. Database Auth).
3. **Configure Image uploading method** (URL paste vs. Cloudinary/ImgBB).
