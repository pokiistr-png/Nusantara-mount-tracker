const express = require('express');
const db = require('../db');

const router = express.Router();

// Simple admin endpoint to toggle premium for a user
// In production protect this with admin auth!
router.post('/upgrade', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Missing email' });
  db.run('UPDATE users SET premium = 1 WHERE email = ?', [email], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ email, upgraded: true });
  });
});

module.exports = router;
