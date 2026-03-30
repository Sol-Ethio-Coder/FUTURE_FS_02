// LEAD MODELS
const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  source: {
    type: String,
    default: 'Website Contact Form'
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'converted'],
    default: 'new'
  },
  notes: [{
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Lead', leadSchema);