const express = require('express');
const { getDb } = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET /api/applications/my  — get current user's latest application
router.get('/my', authenticate, (req, res) => {
  const db = getDb();
  const app = db.prepare(`
    SELECT * FROM partner_applications 
    WHERE user_id = ? 
    ORDER BY applied_at DESC 
    LIMIT 1
  `).get(req.user.id);

  if (!app) return res.json({ application: null });

  let codes = [];
  if (app.status === 'approved') {
    codes = db.prepare('SELECT * FROM discount_codes WHERE application_id = ? ORDER BY created_at DESC').all(app.id);
  }

  res.json({ application: app, codes });
});

// POST /api/applications  — submit new application
router.post('/', authenticate, (req, res) => {
  const db = getDb();

  // Check for existing pending or approved application
  const existing = db.prepare(`
    SELECT id, status FROM partner_applications 
    WHERE user_id = ? AND status IN ('pending', 'approved')
    ORDER BY applied_at DESC LIMIT 1
  `).get(req.user.id);

  if (existing) {
    return res.status(409).json({
      error: `You already have a ${existing.status} application`,
    });
  }

  const { partner_type, business_name, contact_phone, website, audience_size, description } = req.body;

  if (!partner_type || !business_name) {
    return res.status(400).json({ error: 'partner_type and business_name are required' });
  }

  const validTypes = ['Affiliate', 'Influencer', 'Gym', 'Corporate', 'Partner Associate'];
  if (!validTypes.includes(partner_type)) {
    return res.status(400).json({ error: 'Invalid partner_type' });
  }

  if (description && description.length > 500) {
    return res.status(400).json({ error: 'description must be 500 characters or fewer' });
  }

  const result = db.prepare(`
    INSERT INTO partner_applications 
      (user_id, partner_type, business_name, contact_phone, website, audience_size, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    req.user.id, partner_type, business_name,
    contact_phone || null, website || null,
    audience_size ? parseInt(audience_size) : null,
    description || null
  );

  const app = db.prepare('SELECT * FROM partner_applications WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ application: app });
});

module.exports = router;
