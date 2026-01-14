const express = require('express');
const db = require('../db');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password, photo } = req.body;
  if (!email || !password || !name) return res.status(400).json({ error: 'Missing fields' });
  const hashed = await bcrypt.hash(password, 10);
  const id = uuidv4();
  const stmt = db.prepare('INSERT INTO users (id, name, email, password, photo) VALUES (?, ?, ?, ?, ?)');
  stmt.run(id, name, email, hashed, photo || '', function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ id, name, email, photo, premium: false });
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const q = 'SELECT id, name, email, password, photo, premium FROM users WHERE email = ?';
  db.get(q, [email], async (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'User not found' });
    const match = await bcrypt.compare(password, row.password);
    if (!match) return res.status(401).json({ error: 'Invalid password' });
    res.json({ id: row.id, name: row.name, email: row.email, photo: row.photo, premium: !!row.premium });
  });
});

router.get('/profile/:email', (req, res) => {
  const email = req.params.email;
  db.get('SELECT id,name,email,photo,premium FROM users WHERE email = ?', [email], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  });
});

module.exports = router;
