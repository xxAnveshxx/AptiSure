const mongoose = require('mongoose');

const AttemptSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  question: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Question',
    required: true
  },
  selectedOption: { 
    type: Number,
    required: true,
    min: 0,
    max: 3
  },
  isCorrect: { 
    type: Boolean,
    required: true
  },
  mode: { 
    type: String, 
    enum: ['practice', 'test'],
    default: 'practice'
  },
  timeTaken: { 
    type: Number 
  }
}, { 
  timestamps: true 
});
AttemptSchema.index({ user: 1, question: 1 });

module.exports = mongoose.model('Attempt', AttemptSchema);