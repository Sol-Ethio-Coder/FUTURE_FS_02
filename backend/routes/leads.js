// LEADS ROUTER
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Lead = require('../models/Lead');

// Get all leads
router.get('/', auth, async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Create lead
router.post('/', async (req, res) => {
  try {
    const { name, email, source } = req.body;
    const lead = new Lead({ name, email, source: source || 'Website', status: 'new', notes: [] });
    await lead.save();
    res.json(lead);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ msg: 'Not found' });
    lead.status = status;
    await lead.save();
    res.json(lead);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Add note
router.post('/:id/notes', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ msg: 'Not found' });
    lead.notes.push({ text, createdAt: new Date() });
    await lead.save();
    res.json(lead);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete lead
router.delete('/:id', auth, async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;