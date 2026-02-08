const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connections
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// In-memory storage for emotions (simplified for reliability)
let emotionStorage = [];
let emotionIdCounter = 1;

// Contact routes
app.get('/api/contacts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/contacts', async (req, res) => {
  const { name, email, phone, company } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  
  try {
    const result = await pool.query(
      'INSERT INTO contacts (name, email, phone, company) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, phone || null, company || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Database error:', err);
    if (err.code === '23505') { // Unique violation
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

app.put('/api/contacts/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, company } = req.body;
  
  try {
    const result = await pool.query(
      'UPDATE contacts SET name = $1, email = $2, phone = $3, company = $4 WHERE id = $5 RETURNING *',
      [name, email, phone || null, company || null, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/contacts/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('DELETE FROM contacts WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    res.status(204).send();
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Analyze emotion for a contact's message
app.post('/api/contacts/:id/analyze', async (req, res) => {
  const { message } = req.body;
  const contactId = req.params.id;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  
  try {
    // Check if contact exists
    const contactResult = await pool.query('SELECT * FROM contacts WHERE id = $1', [contactId]);
    
    if (contactResult.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    let sentiment;
    
    try {
      // Try to call Python Flask API for sentiment analysis
      const response = await axios.post('http://localhost:5001/api/emotion/text', 
        { text: message },
        { timeout: 5000 }
      );
      sentiment = response.data;
    } catch (apiError) {
      console.log('External AI API not available, using built-in analysis');
      // Fallback to simple sentiment analysis
      sentiment = performSimpleSentimentAnalysis(message);
    }
    
    // Store emotion log
    const emotionLog = {
      id: emotionIdCounter++,
      contactId: parseInt(contactId),
      message,
      sentiment: sentiment.sentiment || sentiment.label,
      score: sentiment.score ? Math.round(sentiment.score * 100) : 75,
      timestamp: new Date(),
    };
    
    emotionStorage.push(emotionLog);
    
    res.json({
      sentiment: sentiment.sentiment || sentiment.label,
      score: sentiment.score ? Math.round(sentiment.score * 100) : 75,
      analysis: emotionLog
    });
  } catch (err) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get emotion logs for a contact
app.get('/api/contacts/:id/emotions', async (req, res) => {
  const contactId = parseInt(req.params.id);
  
  try {
    let emotions = [];
    
    emotions = emotionStorage.filter(e => e.contactId === contactId);
    
    res.json(emotions);
  } catch (err) {
    console.error('Get emotions error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Simple built-in sentiment analysis fallback
function performSimpleSentimentAnalysis(text) {
  const positiveWords = ['excellent', 'great', 'amazing', 'wonderful', 'fantastic', 'love', 'perfect', 'outstanding', 'brilliant', 'superb', 'happy', 'satisfied', 'pleased', 'thank'];
  const negativeWords = ['terrible', 'awful', 'horrible', 'worst', 'hate', 'disgusting', 'pathetic', 'useless', 'disappointing', 'frustrated', 'angry', 'upset', 'problem', 'issue', 'broken', 'failed', 'bad'];
  
  const words = text.toLowerCase().split(/\s+/);
  let positiveScore = 0;
  let negativeScore = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) positiveScore++;
    if (negativeWords.includes(word)) negativeScore++;
  });
  
  let sentiment, score;
  if (positiveScore > negativeScore) {
    sentiment = 'POSITIVE';
    score = 0.7 + (positiveScore * 0.1);
  } else if (negativeScore > positiveScore) {
    sentiment = 'NEGATIVE';
    score = 0.7 + (negativeScore * 0.1);
  } else {
    sentiment = 'NEUTRAL';
    score = 0.5;
  }
  
  return {
    sentiment,
    score: Math.min(score, 0.95)
  };
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve static files (React frontend)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist/public')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/public', 'index.html'));
  });
}

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`ARGILETTE CRM Backend running on port ${PORT}`);
  console.log(`Server bound to 0.0.0.0:${PORT}`);
  console.log(`Database connected: ${process.env.DATABASE_URL ? 'Yes' : 'No'}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});