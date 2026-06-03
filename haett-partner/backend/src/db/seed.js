const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../haett.db');
const db = new Database(DB_PATH);

db.pragma('foreign_keys = ON');

// Clear existing seed data
db.exec(`DELETE FROM discount_codes; DELETE FROM partner_applications; DELETE FROM users;`);

const adminHash = bcrypt.hashSync('admin123', 10);
const userHash = bcrypt.hashSync('user123', 10);
const approvedHash = bcrypt.hashSync('partner123', 10);
const pendingHash = bcrypt.hashSync('pending123', 10);
const rejectedHash = bcrypt.hashSync('rejected123', 10);

const insertUser = db.prepare(`
  INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)
`);

const insertApp = db.prepare(`
  INSERT INTO partner_applications 
    (user_id, partner_type, business_name, contact_phone, website, audience_size, description, status, rejection_reason, applied_at, reviewed_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertCode = db.prepare(`
  INSERT INTO discount_codes (application_id, user_id, code, discount_type, discount_value, is_active, use_count, expires_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const adminId = insertUser.run('admin@haett.com', adminHash, 'Admin User', 'admin').lastInsertRowid;
const userId = insertUser.run('user@haett.com', userHash, 'Test User', 'user').lastInsertRowid;
const approvedUserId = insertUser.run('partner@haett.com', approvedHash, 'Sarah Fitness', 'user').lastInsertRowid;
const pendingUserId = insertUser.run('pending@haett.com', pendingHash, 'John Gym', 'user').lastInsertRowid;
const rejectedUserId = insertUser.run('rejected@haett.com', rejectedHash, 'Bob Blogger', 'user').lastInsertRowid;

// Approved application with discount codes
const appId = insertApp.run(
  approvedUserId, 'Influencer', 'FitLife by Sarah',
  '+91-9876543210', 'https://instagram.com/sarahfitlife', 85000,
  'Fitness influencer focused on healthy eating and meal prep.',
  'approved', null, '2025-01-10 10:00:00', '2025-01-11 14:00:00'
).lastInsertRowid;

insertCode.run(appId, approvedUserId, 'SARAH20', 'percentage', 20, 1, 142, '2025-12-31 23:59:59');
insertCode.run(appId, approvedUserId, 'SARAHVIP', 'fixed', 500, 1, 38, null);
insertCode.run(appId, approvedUserId, 'SARAHOLD', 'percentage', 15, 0, 201, '2024-12-31 23:59:59');

// Pending application
insertApp.run(
  pendingUserId, 'Gym', 'Iron Core Fitness',
  '+91-8765432109', 'https://ironcorefitness.in', 1200,
  'Premium gym in Hyderabad with 1200+ active members.',
  'pending', null, '2025-01-15 09:30:00', null
);

// Rejected application
insertApp.run(
  rejectedUserId, 'Affiliate', 'Bob\'s Blog',
  null, 'https://bobsblog.com', 500,
  'General lifestyle blog.',
  'rejected', 'Your audience size does not meet our minimum threshold of 1,000 for affiliate partners. Please reapply once you have grown your platform.', 
  '2025-01-08 11:00:00', '2025-01-09 16:00:00'
);

console.log('✅ Database seeded successfully');
console.log('\n📋 Test Credentials:');
console.log('  Admin:    admin@haett.com    / admin123');
console.log('  New User: user@haett.com     / user123');
console.log('  Partner:  partner@haett.com  / partner123  (approved)');
console.log('  Pending:  pending@haett.com  / pending123  (under review)');
console.log('  Rejected: rejected@haett.com / rejected123 (rejected)');

db.close();
