const express = require('express');
const { getDb } = require('../db');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication + admin role
router.use(authenticate, requireAdmin);

// GET /api/admin/applications?status=pending|approved|rejected|all
router.get('/applications', (req, res) => {
  const db = getDb();
  const { status = 'all' } = req.query;

  const validStatuses = ['pending', 'approved', 'rejected'];
  const whereClause = validStatuses.includes(status)
    ? `WHERE pa.status = '${status}'`
    : '';

  const apps = db.prepare(`
    SELECT 
      pa.*,
      u.name AS applicant_name,
      u.email AS applicant_email
    FROM partner_applications pa
    JOIN users u ON u.id = pa.user_id
    ${whereClause}
    ORDER BY pa.applied_at DESC
  `).all();

  // Attach discount codes for approved
  const result = apps.map((app) => {
    const codes = app.status === 'approved'
      ? db.prepare('SELECT * FROM discount_codes WHERE application_id = ?').all(app.id)
      : [];
    return { ...app, codes };
  });

  // Counts
  const counts = db.prepare(`
    SELECT status, COUNT(*) as count FROM partner_applications GROUP BY status
  `).all();
  const countMap = { pending: 0, approved: 0, rejected: 0 };
  counts.forEach(r => { countMap[r.status] = r.count; });
  countMap.all = countMap.pending + countMap.approved + countMap.rejected;

  res.json({ applications: result, counts: countMap });
});

// POST /api/admin/applications/:id/approve
router.post('/applications/:id/approve', (req, res) => {
  const db = getDb();
  const app = db.prepare('SELECT * FROM partner_applications WHERE id = ?').get(req.params.id);
  if (!app) return res.status(404).json({ error: 'Application not found' });
  if (app.status !== 'pending') return res.status(409).json({ error: 'Only pending applications can be approved' });

  // Generate a unique discount code
  const user = db.prepare('SELECT name FROM users WHERE id = ?').get(app.user_id);
  const base = user.name.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  const code = `${base}${suffix}`;

  const updateApp = db.prepare(`
    UPDATE partner_applications 
    SET status = 'approved', reviewed_at = CURRENT_TIMESTAMP, reviewed_by = ?
    WHERE id = ?
  `);

  const insertCode = db.prepare(`
    INSERT INTO discount_codes (application_id, user_id, code, discount_type, discount_value, is_active)
    VALUES (?, ?, ?, 'percentage', 20, 1)
  `);

  db.transaction(() => {
    updateApp.run(req.user.id, app.id);
    insertCode.run(app.id, app.user_id, code);
  })();

  const updated = db.prepare('SELECT * FROM partner_applications WHERE id = ?').get(app.id);
  const codes = db.prepare('SELECT * FROM discount_codes WHERE application_id = ?').all(app.id);
  res.json({ application: { ...updated, codes } });
});

// POST /api/admin/applications/:id/reject
router.post('/applications/:id/reject', (req, res) => {
  const db = getDb();
  const { reason } = req.body;
  if (!reason || !reason.trim()) return res.status(400).json({ error: 'A rejection reason is required' });

  const app = db.prepare('SELECT * FROM partner_applications WHERE id = ?').get(req.params.id);
  if (!app) return res.status(404).json({ error: 'Application not found' });
  if (app.status !== 'pending') return res.status(409).json({ error: 'Only pending applications can be rejected' });

  db.prepare(`
    UPDATE partner_applications 
    SET status = 'rejected', rejection_reason = ?, reviewed_at = CURRENT_TIMESTAMP, reviewed_by = ?
    WHERE id = ?
  `).run(reason.trim(), req.user.id, app.id);

  const updated = db.prepare('SELECT * FROM partner_applications WHERE id = ?').get(app.id);
  res.json({ application: updated });
});

// PATCH /api/admin/codes/:id/toggle  — activate or deactivate a code
router.patch('/codes/:id/toggle', (req, res) => {
  const db = getDb();
  const code = db.prepare('SELECT * FROM discount_codes WHERE id = ?').get(req.params.id);
  if (!code) return res.status(404).json({ error: 'Code not found' });

  const newState = code.is_active ? 0 : 1;
  db.prepare('UPDATE discount_codes SET is_active = ? WHERE id = ?').run(newState, code.id);
  const updated = db.prepare('SELECT * FROM discount_codes WHERE id = ?').get(code.id);
  res.json({ code: updated });
});

module.exports = router;
