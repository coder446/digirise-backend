const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all services
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM services');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
