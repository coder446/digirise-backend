const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');
const { pingSitemap } = require('../utils/pingSitemap');

// Get all blog posts
router.get('/', async (req, res) => {
    try {
        const blogs = await BlogPost.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get post by slug
router.get('/:slug', async (req, res) => {
    try {
        const blog = await BlogPost.findOne({ where: { slug: req.params.slug } });
        if (!blog) return res.status(404).json({ message: 'Post not found' });
        res.json(blog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ SEO FIX: Create blog post and ping sitemap so Google indexes it immediately
router.post('/', async (req, res) => {
    try {
        const blog = await BlogPost.create(req.body);
        // Fire-and-forget ping — don't await so response is fast
        pingSitemap();
        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ SEO FIX: Update blog post and ping sitemap
router.put('/:id', async (req, res) => {
    try {
        const blog = await BlogPost.findByPk(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Post not found' });
        await blog.update(req.body);
        pingSitemap();
        res.json(blog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
