# Portfolio CMS Enhancements Plan: Inbox, Blog, & Timeline

This plan details the addition of three core updates:
1. **Admin Inbox**: Store contact inquiries in MongoDB Atlas and view them in a dynamic panel inside `/admin`.
2. **Blog Engine**: Publish tech/business insights from `/admin` and read them on dynamic `/blog/[slug]` routes.
3. **Qualifications Database**: Add or edit timeline items (education/jobs) dynamically with expanding hover details.

---

## 💾 MongoDB Schemas

### 1. Inquiries (Messages)
- `name` (String)
- `email` (String)
- `subject` (String)
- `message` (String)
- `isRead` (Boolean)

### 2. Articles (Posts)
- `title` (String)
- `slug` (String, URL-safe identifier)
- `content` (String, blog post body)
- `summary` (String)
- `tags` (Array of Strings)
- `readTime` (String)
- `isPublished` (Boolean)

### 3. Timeline Items (Qualifications)
- `type` (String: "Education" | "Experience")
- `title` (String)
- `subtitle` (String)
- `duration` (String)
- `details` (Array of Strings)
- `tags` (Array of Strings)
- `certUrl` (String)

---

## 🚀 Execution Steps
1. **Extend Models**: Add schemas to `server/models/Schemas.js`.
2. **Backend API Endpoints**: Add route handlers to `server/index.js`.
3. **CMS Forms**: Create Inbox, Blog, and Qualifications panels in Next.js `app/admin/page.tsx`.
4. **Blog Pages**: Create `/blog` lists and `/blog/[slug]` articles in Next.js App Router.
5. **Timeline Sync**: Dynamically pull listings in `components/sections/Qualifications.tsx`.
