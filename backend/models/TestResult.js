const mongoose = require('mongoose');

const TestResultSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  test: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'TestConfig', 
    required: true 
  },
  score: { 
    type: Number, 
    required: true 
  },
  totalMarks: { 
    type: Number, 
    required: true 
  },
  percentage: { 
    type: Number, 
    required: true 
  },
  answers: [
    {
      questionId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
      },
      selectedOption: { 
        type: Number 
      },
      isCorrect: { 
        type: Boolean 
      }
    }
  ]
}, { 
  timestamps: true 
});
TestResultSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('TestResult', TestResultSchema);