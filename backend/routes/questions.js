const express = require('express');
const Question = require('../models/Question');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.get('/random', async (req, res) => {
  try {
    const { type, difficulty, subtopic } = req.query;
    let filter = {}; 
    if (type && type !== 'Mixed Practice') {
      filter.type = type;
    }
    if (difficulty && difficulty !== 'Any') {
      filter.difficulty = difficulty;
    }
    if (subtopic) {
      filter.tags = subtopic;
    }
    const count = await Question.countDocuments(filter);
    if (count === 0) {
      return res.status(404).json({ error: 'No questions found matching criteria' });
    }
    const random = Math.floor(Math.random() * count);
    const question = await Question.findOne(filter).skip(random).select('-correctOptionIndex -solution');
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/generate-set', async (req, res) => {
  try {
    const { topic, counts } = req.body;
    
    let questions = [];
    for (let [difficulty, count] of Object.entries(counts)) {
      if (count === 0) continue;
      const difficultyCapitalized = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
      
      let filter = { difficulty: difficultyCapitalized };
      if (topic && topic !== 'Mixed Practice') {
        filter.tags = topic;
      }
      const qs = await Question.aggregate([
        { $match: filter },
        { $sample: { size: count } },
        { $project: { correctOptionIndex: 0, solution: 0 } }
      ]);
      
      questions.push(...qs);
    }
    questions = questions.sort(() => Math.random() - 0.5);
    
    res.json({ questions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;