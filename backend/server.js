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

// MongoDB Schemas
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  source: { type: String, default: 'Website' },
  status: { type: String, default: 'new' },
  notes: [{ text: String, createdAt: { type: Date, default: Date.now } }],
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Lead = mongoose.model('Lead', leadSchema);

// Auth middleware
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecretkey');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'CRM API is running!',
    endpoints: ['/api/auth/register', '/api/auth/login', '/api/leads']
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', time: new Date().toISOString() });
});

// REGISTER
app.post('/api/auth/register', async (req, res) => {
  console.log('📝 Register request:', req.body.username);
  
  try {
    const { username, password } = req.body;
    
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
    res.status(500).json({ msg: 'Server error' });
  }
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  console.log('🔐 Login request:', req.body.username);
  
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

// GET all leads (protected)
app.get('/api/leads', auth, async (req, res) => {
  console.log('📋 Fetching leads for user:', req.user?.username);
  
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    console.log(`✅ Found ${leads.length} leads`);
    res.json(leads);
  } catch (err) {
    console.error('❌ Error fetching leads:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// CREATE lead
app.post('/api/leads', async (req, res) => {
  console.log('➕ Creating lead:', req.body.name);
  
  try {
    const { name, email, source } = req.body;
    const lead = new Lead({
      name,
      email,
      source: source || 'Website',
      status: 'new',
      notes: []
    });
    await lead.save();
    console.log('✅ Lead created:', name);
    res.json(lead);
  } catch (err) {
    console.error('❌ Error creating lead:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// UPDATE lead status
app.put('/api/leads/:id/status', auth, async (req, res) => {
  console.log('🔄 Updating lead status:', req.params.id);
  
  try {
    const { status } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ msg: 'Lead not found' });
    }
    lead.status = status;
    await lead.save();
    console.log('✅ Status updated to:', status);
    res.json(lead);
  } catch (err) {
    console.error('❌ Error updating status:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ADD note to lead
app.post('/api/leads/:id/notes', auth, async (req, res) => {
  console.log('📝 Adding note to lead:', req.params.id);
  
  try {
    const { text } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ msg: 'Lead not found' });
    }
    lead.notes.push({ text, createdAt: new Date() });
    await lead.save();
    console.log('✅ Note added');
    res.json(lead);
  } catch (err) {
    console.error('❌ Error adding note:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE lead
app.delete('/api/leads/:id', auth, async (req, res) => {
  console.log('🗑️ Deleting lead:', req.params.id);
  
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ msg: 'Lead not found' });
    }
    console.log('✅ Lead deleted');
    res.json({ msg: 'Lead deleted' });
  } catch (err) {
    console.error('❌ Error deleting lead:', err);
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
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });