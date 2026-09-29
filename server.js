const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./event_db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================
// API Endpoints
// ============================================================

// GET /api/categories - Retrieve all event categories
app.get('/api/categories', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM categories ORDER BY name');
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({ success: false, message: 'Failed to retrieve categories' });
    }
});

// GET /api/events/home - Retrieve all active (non-suspended) and upcoming/current events
app.get('/api/events/home', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT e.*, c.name AS category_name
             FROM events e
             JOIN categories c ON e.category_id = c.id
             WHERE e.is_suspended = 0
             ORDER BY e.event_date ASC`
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error('Error fetching home events:', err);
        res.status(500).json({ success: false, message: 'Failed to retrieve events' });
    }
});

// GET /api/events/search - Search events based on criteria (date, location, category)
app.get('/api/events/search', async (req, res) => {
    try {
        const { date, location, category } = req.query;

        let sql = `SELECT e.*, c.name AS category_name
                   FROM events e
                   JOIN categories c ON e.category_id = c.id
                   WHERE e.is_suspended = 0`;
        const params = [];

        if (date) {
            sql += ' AND e.event_date = ?';
            params.push(date);
        }
        if (location) {
            sql += ' AND e.location LIKE ?';
            params.push(`%${location}%`);
        }
        if (category) {
            sql += ' AND e.category_id = ?';
            params.push(category);
        }

        sql += ' ORDER BY e.event_date ASC';

        const [rows] = await db.query(sql, params);
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error('Error searching events:', err);
        res.status(500).json({ success: false, message: 'Failed to search events' });
    }
});

// GET /api/events/:id - Retrieve detailed information for a specific event
app.get('/api/events/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query(
            `SELECT e.*, c.name AS category_name
             FROM events e
             JOIN categories c ON e.category_id = c.id
             WHERE e.id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        res.json({ success: true, data: rows[0] });
    } catch (err) {
        console.error('Error fetching event details:', err);
        res.status(500).json({ success: false, message: 'Failed to retrieve event details' });
    }
});

// Serve the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Charity Event server is running on http://localhost:${PORT}`);
});
