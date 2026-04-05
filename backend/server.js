// SERVER FILE
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

console.log('🚀 Starting server...');

// MongoDB Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model('User', userSchema);

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'CRM API is running!',
    status: 'active',
    endpoints: ['/api/auth/register', '/api/auth/login']
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', time: new Date().toISOString() });
});

// REGISTER endpoint
app.post('/api/auth/register', async (req, res) => {
  console.log('📝 Register request received:', req.body);
  
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ msg: 'Username and password required' });
    }
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'mysecretkey',
      { expiresIn: '7d' }
    );
    
    console.log('✅ User registered:', username);
    res.json({ token, user: { id: user._id, username: user.username } });
    
  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

// LOGIN endpoint
app.post('/api/auth/login', async (req, res) => {
  console.log('🔐 Login request received:', req.body);
  
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'mysecretkey',
      { expiresIn: '7d' }
    );
    
    console.log('✅ User logged in:', username);
    res.json({ token, user: { id: user._id, username: user.username } });
    
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is not set!');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📍 URL: http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });