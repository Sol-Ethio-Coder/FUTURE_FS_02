// AUTH ROUTES
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('Registration attempt:', username); // Debug log
    
    // Check if user exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    
    // Create new user
    user = new User({ username, password });
    await user.save();
    
    console.log('User created successfully:', username); // Debug log
    
    // Create token
    const payload = {
      user: {
        id: user.id
      }
    };
    
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '7d' }
    );
    
    res.json({ token });
    
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
    const payload = {
      user: {
        id: user.id
      }
    };
    
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '7d' }
    );
    
    res.json({ token });
    
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;