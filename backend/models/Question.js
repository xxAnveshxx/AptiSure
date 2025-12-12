const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  
  image: { 
    type: String, 
    default: null 
  },
  
  options: [{ 
    type: String, 
    required: true 
  }],
  
  correctOptionIndex: { 
    type: Number, 
    required: true,
    min: 0,
    max: 3
  },
  
  solution: { 
    type: String 
  },
  type: { 
    type: String, 
    enum: ['Quants', 'Logical', 'Verbal'], 
    required: true 
  },
  difficulty: { 
    type: String, 
    enum: ['Easy', 'Medium', 'Hard'], 
    required: true 
  },
  tags: [{ 
    type: String 
  }]
}, { 
  timestamps: true 
});
QuestionSchema.index({ type: 1, difficulty: 1 });
QuestionSchema.index({ tags: 1 });

module.exports = mongoose.model('Question', QuestionSchema);