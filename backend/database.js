import initSqlJs from 'sql.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'g2pulse.db');

let db = null;

// Initialize database
async function initDatabase() {
  const SQL = await initSqlJs();

  // Load existing database or create new one
  if (existsSync(dbPath)) {
    const buffer = readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS vendors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id TEXT PRIMARY KEY,
      vendorId TEXT NOT NULL,
      headline TEXT NOT NULL,
      subheadline TEXT NOT NULL,
      promoterCta TEXT NOT NULL,
      promoterLink TEXT NOT NULL,
      passiveMessage TEXT NOT NULL,
      passiveLink TEXT NOT NULL,
      detractorMessage TEXT NOT NULL,
      detractorLink TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (vendorId) REFERENCES vendors(id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS nps_responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vendorId TEXT NOT NULL,
      campaignId TEXT NOT NULL,
      score INTEGER NOT NULL,
      category TEXT NOT NULL,
      comment TEXT,
      triggeredBy TEXT NOT NULL,
      userId TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      reviewCompleted INTEGER DEFAULT 0,
      budgetSpent REAL DEFAULT 0,
      FOREIGN KEY (vendorId) REFERENCES vendors(id),
      FOREIGN KEY (campaignId) REFERENCES campaigns(id)
    );
  `);

  db.run(`CREATE INDEX IF NOT EXISTS idx_responses_vendor ON nps_responses(vendorId)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_responses_campaign ON nps_responses(campaignId)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_responses_timestamp ON nps_responses(timestamp)`);

  // Seed data
  seedDatabase();

  // Save database to file
  saveDatabase();

  return db;
}

// Save database to disk
function saveDatabase() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    writeFileSync(dbPath, buffer);
  }
}

// Seed database with initial data
function seedDatabase() {
  const vendor = db.exec('SELECT id FROM vendors WHERE id = ?', ['vendor_g2demo']);

  if (vendor.length === 0 || vendor[0].values.length === 0) {
    console.log('Seeding database with initial data...');

    // Insert vendor
    db.run(`
      INSERT INTO vendors (id, name, createdAt)
      VALUES (?, ?, ?)
    `, ['vendor_g2demo', 'G2 Pulse Demo', new Date().toISOString()]);

    // Insert campaign
    db.run(`
      INSERT INTO campaigns (
        id, vendorId, headline, subheadline,
        promoterCta, promoterLink,
        passiveMessage, passiveLink,
        detractorMessage, detractorLink,
        createdAt, updatedAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'campaign_demo',
      'vendor_g2demo',
      "You're amazing! Want to help others find us?",
      "Share your experience on G2 and help other teams discover our product.",
      'Leave a Review on G2',
      'https://www.g2.com/products/g2-pulse/reviews',
      "Thanks for your feedback! Here's a resource that might help you get even more value.",
      'https://learn.g2.com/resources',
      "We're sorry to hear you're not satisfied. Let's make this right.",
      'https://support.g2.com/contact',
      new Date().toISOString(),
      new Date().toISOString()
    ]);

    // Generate 90 responses over the last 60 days
    const triggers = ['action', 'delay', 'manual'];
    const comments = {
      promoter: [
        'Love the product! Makes my job so much easier.',
        'Fantastic experience, highly recommend!',
        'Game changer for our team. Best tool we use.',
        'Intuitive interface and great support team.',
        'Worth every penny. Saves us hours each week.',
      ],
      passive: [
        'Good product but missing some features.',
        'Works well but could use better documentation.',
        'Solid tool, though the UI could be more modern.',
        'Does what it promises, nothing exceptional.',
        'Decent product, some room for improvement.',
      ],
      detractor: [
        'Too expensive for what it offers.',
        'Buggy and slow. Needs major improvements.',
        'Customer support is unresponsive.',
        'Missing critical features we need.',
        'Very disappointed with the recent changes.',
      ]
    };

    const now = new Date();

    for (let i = 0; i < 90; i++) {
      // Random timestamp within last 60 days
      const daysAgo = Math.floor(Math.random() * 60);
      const timestamp = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

      // Realistic distribution: 50% Promoters, 30% Passives, 20% Detractors
      const rand = Math.random();
      let score, category, commentPool;

      if (rand < 0.5) {
        // Promoter
        score = Math.random() < 0.7 ? 10 : 9;
        category = 'Promoter';
        commentPool = comments.promoter;
      } else if (rand < 0.8) {
        // Passive
        score = Math.random() < 0.5 ? 8 : 7;
        category = 'Passive';
        commentPool = comments.passive;
      } else {
        // Detractor
        score = Math.floor(Math.random() * 7); // 0-6
        category = 'Detractor';
        commentPool = comments.detractor;
      }

      const comment = commentPool[Math.floor(Math.random() * commentPool.length)];
      const trigger = triggers[Math.floor(Math.random() * triggers.length)];
      const userId = `user_${Math.random().toString(36).substr(2, 9)}`;

      // Review completion logic: Promoters more likely to complete (70%), Passives (40%), Detractors (10%)
      let reviewCompleted = 0;
      let budgetSpent = 0;

      if (category === 'Promoter' && Math.random() < 0.7) {
        reviewCompleted = 1;
        // $25 increments: $25, $50, $75, or $100
        const increments = [25, 50, 75, 100];
        budgetSpent = increments[Math.floor(Math.random() * increments.length)];
      } else if (category === 'Passive' && Math.random() < 0.4) {
        reviewCompleted = 1;
        // $25 increments: $25, $50, or $75
        const increments = [25, 50, 75];
        budgetSpent = increments[Math.floor(Math.random() * increments.length)];
      } else if (category === 'Detractor' && Math.random() < 0.1) {
        reviewCompleted = 1;
        // $25 increments: $25 or $50
        const increments = [25, 50];
        budgetSpent = increments[Math.floor(Math.random() * increments.length)];
      }

      db.run(`
        INSERT INTO nps_responses (
          vendorId, campaignId, score, category, comment, triggeredBy, userId, timestamp, reviewCompleted, budgetSpent
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        'vendor_g2demo',
        'campaign_demo',
        score,
        category,
        comment,
        trigger,
        userId,
        timestamp.toISOString(),
        reviewCompleted,
        budgetSpent
      ]);
    }

    saveDatabase();
    console.log('Database seeded successfully!');
  }
}

// Helper functions for server to use
export function runQuery(sql, params = []) {
  try {
    db.run(sql, params);
    saveDatabase();
    return { success: true };
  } catch (error) {
    console.error('Query error:', error);
    return { success: false, error: error.message };
  }
}

export function getOne(sql, params = []) {
  const result = db.exec(sql, params);
  if (result.length > 0 && result[0].values.length > 0) {
    const columns = result[0].columns;
    const values = result[0].values[0];
    const row = {};
    columns.forEach((col, idx) => {
      row[col] = values[idx];
    });
    return row;
  }
  return null;
}

export function getAll(sql, params = []) {
  const result = db.exec(sql, params);
  if (result.length > 0) {
    const columns = result[0].columns;
    return result[0].values.map(values => {
      const row = {};
      columns.forEach((col, idx) => {
        row[col] = values[idx];
      });
      return row;
    });
  }
  return [];
}

export function getLastInsertId() {
  const result = db.exec('SELECT last_insert_rowid() as id');
  return result[0].values[0][0];
}

export { saveDatabase };

// Initialize and export
await initDatabase();
