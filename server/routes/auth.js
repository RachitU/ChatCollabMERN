const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if(!username || !password) return res.status(400).json({ ok:false, error:'missing fields' });
  const hash = await bcrypt.hash(password, 10);
  try {
    const u = await User.create({ username, passwordHash: hash });
    res.json({ ok: true, user: { id: u._id, username: u.username } });
  } catch (e) { res.status(400).json({ ok: false, error: e.message }); }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ ok: false, error:'invalid' });
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ ok: false, error:'invalid' });
  const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET);
  res.json({ ok: true, token, user: { id: user._id, username: user.username } });
});

module.exports = router;
