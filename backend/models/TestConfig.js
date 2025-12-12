const mongoose = require('mongoose');

const TestConfigSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  company: { 
    type: String,
    required: true
  },
  duration: { 
    type: Number, 
    required: true 
  }, 
  totalMarks: { 
    type: Number,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  questions: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Question' 
  }]
}, { 
  timestamps: true 
});
TestConfigSchema.virtual('questionCount').get(function() {
  return this.questions.length;
});
TestConfigSchema.set('toJSON', { virtuals: true });
TestConfigSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('TestConfig', TestConfigSchema);