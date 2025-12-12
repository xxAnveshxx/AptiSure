const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  avatar: { 
    type: String 
  },
  isAdmin: { 
    type: Boolean, 
    default: false 
  },
  solvedStats: {
    easy: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    hard: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  solvedQuestionIds: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Question' 
  }]
}, { 
  timestamps: true 
});

module.exports = mongoose.model('User', UserSchema);