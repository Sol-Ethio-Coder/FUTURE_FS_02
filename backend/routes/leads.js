// LEADS ROUTES
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Lead = require('../models/Lead');

// Get all leads (protected)
router.get('/', auth, async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Create lead (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, source } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ msg: 'Name and email are required' });
    }
    
    const newLead = new Lead({
      name,
      email,
      source: source || 'Website Contact Form',
      status: 'new',
      notes: []
    });
    
    const lead = await newLead.save();
    res.json(lead);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Update lead details (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, email, source } = req.body;
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({ msg: 'Lead not found' });
    }
    
    if (name) lead.name = name;
    if (email) lead.email = email;
    if (source) lead.source = source;
    
    await lead.save();
    res.json(lead);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Update lead status (protected)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({ msg: 'Lead not found' });
    }
    
    lead.status = status;
    await lead.save();
    res.json(lead);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Add note to lead (protected)
router.post('/:id/notes', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({ msg: 'Lead not found' });
    }
    
    lead.notes.push({ text, createdAt: new Date() });
    await lead.save();
    res.json(lead);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Delete lead (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({ msg: 'Lead not found' });
    }
    
    await lead.deleteOne();
    res.json({ msg: 'Lead deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;