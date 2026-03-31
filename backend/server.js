// SERVER FILE
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Don't rely on dotenv - use process.env directly
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leads', require('./routes/leads'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'CRM API is running!',
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    msg: 'Server error', 
    error: process.env.NODE_ENV === 'production' ? 'Internal error' : err.message 
  });
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

console.log('Starting server...');
console.log('MONGODB_URI exists:', !!MONGODB_URI);
console.log('PORT:', PORT);

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in environment variables');
  console.error('Please add MONGODB_URI in Render environment settings');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📍 Health check: https://crm-backend.onrender.com/health`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

module.exports = app;