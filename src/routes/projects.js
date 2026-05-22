const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { pingSitemap } = require('../utils/pingSitemap');

// Get all projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get project by slug
router.get('/:slug', async (req, res) => {
    try {
        const project = await Project.findOne({ where: { slug: req.params.slug } });
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ SEO FIX: Create project and ping sitemap
router.post('/', async (req, res) => {
    try {
        const project = await Project.create(req.body);
        pingSitemap();
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ SEO FIX: Update project and ping sitemap
router.put('/:id', async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        await project.update(req.body);
        pingSitemap();
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
