// USER MODELS
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});

// Hash password before saving - NO CALLBACKS, NO NEXT
userSchema.pre('save', function() {
  const user = this;
  
  if (!user.isModified('password')) {
    return;
  }
  
  // Use promise-based approach
  return bcrypt.genSalt(10)
    .then(salt => bcrypt.hash(user.password, salt))
    .then(hash => {
      user.password = hash;
    });
});

// Compare password method
userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);