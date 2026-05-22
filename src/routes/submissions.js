const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Submit Booking (Start a Project)
router.post('/booking', async (req, res) => {
    try {
        const { firstName, lastName, email, companyUrl, date, timezone, time } = req.body;

        const [result] = await db.query(
            'INSERT INTO bookings (firstName, lastName, email, companyUrl, preferredDate, timezone, preferredTime) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [firstName, lastName, email, companyUrl, date, timezone, time]
        );

        res.status(201).json({ message: 'Booking submitted successfully', id: result.insertId });
    } catch (error) {
        console.error('Booking Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Submit Partnership
router.post('/partnership', async (req, res) => {
    try {
        const { companyName, website, contactPerson, email, partnershipType, message } = req.body;

        const [result] = await db.query(
            'INSERT INTO partnerships (companyName, website, contactPerson, email, partnershipType, message) VALUES (?, ?, ?, ?, ?, ?)',
            [companyName, website, contactPerson, email, partnershipType, message]
        );

        res.status(201).json({ message: 'Partnership application submitted successfully', id: result.insertId });
    } catch (error) {
        console.error('Partnership Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Submit Contact Form (Homepage)
router.post('/contact', async (req, res) => {
    try {
        const { goal, name, email, phone, website, brief } = req.body;

        const [result] = await db.query(
            'INSERT INTO contact_submissions (goal, name, email, phone, website, brief) VALUES (?, ?, ?, ?, ?, ?)',
            [goal, name, email, phone, website, brief]
        );

        res.status(201).json({ message: 'Contact form submitted successfully', id: result.insertId });
    } catch (error) {
        console.error('Contact Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
