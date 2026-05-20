import express from 'express';
import cors from 'cors';
import { runQuery, getOne, getAll, getLastInsertId, saveDatabase } from './database.js';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Helper: Calculate NPS category from score
function getCategory(score) {
  if (score >= 9) return 'Promoter';
  if (score >= 7) return 'Passive';
  return 'Detractor';
}

// Helper: Calculate NPS score (% Promoters - % Detractors)
function calculateNPS(responses) {
  if (responses.length === 0) return 0;

  const promoters = responses.filter(r => r.category === 'Promoter').length;
  const detractors = responses.filter(r => r.category === 'Detractor').length;
  const total = responses.length;

  return Math.round(((promoters - detractors) / total) * 100);
}

// POST /api/nps/response - Save a new NPS response
app.post('/api/nps/response', (req, res) => {
  try {
    const { vendorId, campaignId, score, comment, triggeredBy, userId } = req.body;

    if (!vendorId || !campaignId || score === undefined || !triggeredBy || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const category = getCategory(score);
    const timestamp = new Date().toISOString();

    runQuery(`
      INSERT INTO nps_responses (vendorId, campaignId, score, category, comment, triggeredBy, userId, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [vendorId, campaignId, score, category, comment || '', triggeredBy, userId, timestamp]);

    const responseId = getLastInsertId();

    res.json({
      success: true,
      responseId,
      category,
      timestamp
    });
  } catch (error) {
    console.error('Error saving response:', error);
    res.status(500).json({ error: 'Failed to save response' });
  }
});

// POST /api/nps/click-review - Track when user clicks G2 review CTA
app.post('/api/nps/click-review', (req, res) => {
  try {
    const { responseId } = req.body;

    if (!responseId) {
      return res.status(400).json({ error: 'Missing responseId' });
    }

    runQuery(`
      UPDATE nps_responses
      SET reviewCompleted = 1
      WHERE id = ?
    `, [responseId]);

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating click-review:', error);
    res.status(500).json({ error: 'Failed to update click-review' });
  }
});

// POST /api/nps/submit-review - Submit G2 review form
app.post('/api/nps/submit-review', (req, res) => {
  try {
    const { responseId, rating, title, pros, cons } = req.body;

    if (!responseId || !rating || !title || !pros) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // In production, this would forward to G2's API
    // For now, just mark as completed and track budget
    const budgetSpent = 25; // $25 per review

    runQuery(`
      UPDATE nps_responses
      SET reviewCompleted = 1,
          budgetSpent = ?
      WHERE id = ?
    `, [budgetSpent, responseId]);

    console.log(`[G2 Pulse] Review submitted: ${rating} stars - "${title}"`);

    res.json({ success: true });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

// GET /api/nps/responses - Get filtered responses
app.get('/api/nps/responses', (req, res) => {
  try {
    const { vendorId = 'vendor_g2demo', days, category, trigger } = req.query;

    let query = 'SELECT * FROM nps_responses WHERE vendorId = ?';
    const params = [vendorId];

    // Filter by date range
    if (days) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));
      query += ' AND timestamp >= ?';
      params.push(cutoffDate.toISOString());
    }

    // Filter by category
    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    // Filter by trigger type
    if (trigger && trigger !== 'All') {
      query += ' AND triggeredBy = ?';
      params.push(trigger);
    }

    query += ' ORDER BY timestamp DESC LIMIT 20';

    const responses = getAll(query, params);
    res.json(responses);
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({ error: 'Failed to fetch responses' });
  }
});

// GET /api/nps/summary - Get NPS summary statistics
app.get('/api/nps/summary', (req, res) => {
  try {
    const { vendorId = 'vendor_g2demo', days } = req.query;

    let query = 'SELECT * FROM nps_responses WHERE vendorId = ?';
    const params = [vendorId];

    if (days) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));
      query += ' AND timestamp >= ?';
      params.push(cutoffDate.toISOString());
    }

    const responses = getAll(query, params);

    // Calculate metrics
    const totalResponses = responses.length;
    const promoters = responses.filter(r => r.category === 'Promoter').length;
    const passives = responses.filter(r => r.category === 'Passive').length;
    const detractors = responses.filter(r => r.category === 'Detractor').length;

    const npsScore = calculateNPS(responses);
    const avgScore = totalResponses > 0
      ? (responses.reduce((sum, r) => sum + r.score, 0) / totalResponses).toFixed(1)
      : 0;

    // Calculate breakdown percentages
    const breakdown = {
      promoters: totalResponses > 0 ? Math.round((promoters / totalResponses) * 100) : 0,
      passives: totalResponses > 0 ? Math.round((passives / totalResponses) * 100) : 0,
      detractors: totalResponses > 0 ? Math.round((detractors / totalResponses) * 100) : 0,
    };

    // Generate trend data (last 30 days)
    const trendData = [];
    const now = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayResponses = responses.filter(r => {
        const responseDate = new Date(r.timestamp);
        return responseDate >= date && responseDate < nextDate;
      });

      trendData.push({
        date: date.toISOString().split('T')[0],
        nps: calculateNPS(dayResponses),
        responses: dayResponses.length
      });
    }

    res.json({
      npsScore,
      totalResponses,
      avgScore: parseFloat(avgScore),
      responseRate: 68, // Mocked
      breakdown,
      trendData,
      counts: {
        promoters,
        passives,
        detractors
      }
    });
  } catch (error) {
    console.error('Error calculating summary:', error);
    res.status(500).json({ error: 'Failed to calculate summary' });
  }
});

// GET /api/campaign/:campaignId - Get campaign settings
app.get('/api/campaign/:campaignId', (req, res) => {
  try {
    const { campaignId } = req.params;
    const campaign = getOne('SELECT * FROM campaigns WHERE id = ?', [campaignId]);

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json(campaign);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({ error: 'Failed to fetch campaign' });
  }
});

// PUT /api/campaign/:campaignId - Update campaign settings
app.put('/api/campaign/:campaignId', (req, res) => {
  try {
    const { campaignId } = req.params;
    const {
      headline,
      subheadline,
      promoterCta,
      promoterLink,
      passiveMessage,
      passiveLink,
      detractorMessage,
      detractorLink
    } = req.body;

    const updatedAt = new Date().toISOString();

    runQuery(`
      UPDATE campaigns
      SET headline = ?,
          subheadline = ?,
          promoterCta = ?,
          promoterLink = ?,
          passiveMessage = ?,
          passiveLink = ?,
          detractorMessage = ?,
          detractorLink = ?,
          updatedAt = ?
      WHERE id = ?
    `, [
      headline,
      subheadline,
      promoterCta,
      promoterLink,
      passiveMessage,
      passiveLink,
      detractorMessage,
      detractorLink,
      updatedAt,
      campaignId
    ]);

    const updated = getOne('SELECT * FROM campaigns WHERE id = ?', [campaignId]);
    res.json(updated);
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({ error: 'Failed to update campaign' });
  }
});

// GET /api/nps/review-gen-stats - Get review generation statistics
app.get('/api/nps/review-gen-stats', (req, res) => {
  try {
    const { vendorId = 'vendor_g2demo', days, category, trigger } = req.query;

    let query = 'SELECT * FROM nps_responses WHERE vendorId = ?';
    const params = [vendorId];

    // Apply same filters as other endpoints
    if (days) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));
      query += ' AND timestamp >= ?';
      params.push(cutoffDate.toISOString());
    }

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (trigger && trigger !== 'All') {
      query += ' AND triggeredBy = ?';
      params.push(trigger);
    }

    const responses = getAll(query, params);

    // Calculate stats
    const totalRespondents = responses.length;
    const completedReviews = responses.filter(r => r.reviewCompleted === 1).length;
    const completionRate = totalRespondents > 0 ? ((completedReviews / totalRespondents) * 100).toFixed(1) : 0;
    const totalBudget = responses.reduce((sum, r) => sum + (r.budgetSpent || 0), 0);

    // Break down by category
    const byCategory = ['Promoter', 'Passive', 'Detractor'].map(cat => {
      const categoryResponses = responses.filter(r => r.category === cat);
      const categoryCompleted = categoryResponses.filter(r => r.reviewCompleted === 1).length;
      const categoryBudget = categoryResponses.reduce((sum, r) => sum + (r.budgetSpent || 0), 0);

      return {
        category: cat,
        totalRespondents: categoryResponses.length,
        completedReviews: categoryCompleted,
        completionRate: categoryResponses.length > 0
          ? ((categoryCompleted / categoryResponses.length) * 100).toFixed(1)
          : 0,
        budgetSpent: categoryBudget.toFixed(2),
        avgNPS: categoryResponses.length > 0
          ? (categoryResponses.reduce((sum, r) => sum + r.score, 0) / categoryResponses.length).toFixed(1)
          : 0
      };
    });

    res.json({
      totalRespondents,
      completedReviews,
      completionRate: parseFloat(completionRate),
      totalBudget: totalBudget.toFixed(2),
      avgCostPerReview: completedReviews > 0 ? (totalBudget / completedReviews).toFixed(2) : 0,
      byCategory
    });
  } catch (error) {
    console.error('Error fetching review gen stats:', error);
    res.status(500).json({ error: 'Failed to fetch review gen stats' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 G2 Pulse backend running on http://localhost:${PORT}`);
  console.log(`📊 Database initialized with seed data`);
});
