# SEO Deployment Checklist — DigitalRise Marketing Backend

## 🗄️ Step 1: Run DB Migration

Run this once on your production database (MySQL/Planetscale):

```sql
-- See scripts/migrate_updatedAt.sql
ALTER TABLE blog_posts  ADD COLUMN IF NOT EXISTS `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
ALTER TABLE projects    ADD COLUMN IF NOT EXISTS `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
```

## 🔑 Step 2: Set Environment Variables

Add to your Render backend service:

```
FRONTEND_URL=https://www.digitalrisemarketing.in
PING_SECRET=your-random-secret-here      # e.g. openssl rand -hex 16
```

Add the same `PING_SECRET` to your Vercel frontend environment variables.

## 🚀 Step 3: Deploy Backend

Push the updated code. After deploy, creating or editing any blog/project via
AdminJS will automatically:
1. Save to the database
2. Call POST /api/ping-sitemap on the frontend
3. Frontend pings Google + Bing to re-crawl the sitemap

## ✅ What Was Fixed

| Problem | Fix |
|---|---|
| New blogs/projects not indexed | `generateStaticParams` pre-renders all slugs; ISR handles new ones |
| Sitemap cached 1–24h | Reduced to 5 min (`revalidate=300`), `no-store` on API fetches |
| `lastmod` always same date | Enabled `updatedAt` on both models |
| No Google/Bing notification | Auto-ping after every create/update |
| Projects page missing canonical/OG | Uses `constructMetadata` now |
| Blog `focusKeyword` ignored in SEO | Passed through to metadata keywords |
| `/api/blogs` 404 fallback | Removed fallback, uses `/api/blog` directly |
