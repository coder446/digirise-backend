-- SEO Fields for blog_posts
ALTER TABLE blog_posts 
ADD COLUMN image VARCHAR(500),
ADD COLUMN metaTitle VARCHAR(60),
ADD COLUMN metaDescription VARCHAR(160),
ADD COLUMN focusKeyword VARCHAR(255),
ADD COLUMN author VARCHAR(255),
ADD COLUMN content LONGTEXT;

-- SEO Fields for projects
ALTER TABLE projects 
ADD COLUMN metaTitle VARCHAR(255),
ADD COLUMN metaDescription TEXT,
ADD COLUMN focusKeyword VARCHAR(255);
