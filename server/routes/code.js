const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

function auth(req, res, next) {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ ok: false });
  const token = h.replace("Bearer ", "");
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data;
    next();
  } catch (e) {
    return res.status(401).json({ ok: false });
  }
}

router.get("/code", auth, async (req, res) => {
  const u = await User.findById(req.user.id);
  if (!u) return res.status(404).json({ ok: false });
  res.json({ ok: true, code: u.personalDoc || "" });
});

router.put("/code", auth, async (req, res) => {
  const { code } = req.body;
  await User.findByIdAndUpdate(req.user.id, { personalDoc: code });
  res.json({ ok: true });
});

module.exports = router;
