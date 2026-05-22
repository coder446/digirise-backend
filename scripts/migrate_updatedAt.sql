-- ✅ SEO FIX: Add updatedAt columns so sitemap lastmod reflects actual edit time
-- Run this once against your production database

-- Add updatedAt to blog_posts (if it doesn't already exist)
ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP;

-- Backfill existing rows with createdAt value
UPDATE blog_posts SET `updatedAt` = `createdAt` WHERE `updatedAt` IS NULL OR `updatedAt` = '0000-00-00 00:00:00';

-- Add updatedAt to projects (if it doesn't already exist)
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP;

UPDATE projects SET `updatedAt` = `createdAt` WHERE `updatedAt` IS NULL OR `updatedAt` = '0000-00-00 00:00:00';
