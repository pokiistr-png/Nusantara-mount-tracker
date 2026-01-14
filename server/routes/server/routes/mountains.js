const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  db.all('SELECT data FROM mountains', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const mountains = rows.map(r => JSON.parse(r.data));
    res.json(mountains);
  });
});

router.get('/:slug', (req, res) => {
  const slug = req.params.slug;
  db.get('SELECT data FROM mountains WHERE slug = ?', [slug], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(JSON.parse(row.data));
  });
});

module.exports = router;
