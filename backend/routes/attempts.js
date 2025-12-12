const express = require('express');
const Attempt = require('../models/Attempt');
const Question = require('../models/Question');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { questionId, selectedOption } = req.body;

    const question = await Question.findById(questionId);
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const isCorrect = question.correctOptionIndex === selectedOption;

    await Attempt.create({
      user: req.user._id,
      question: questionId,
      selectedOption,
      isCorrect,
      mode: 'practice'
    });

    if (isCorrect && !req.user.solvedQuestionIds.includes(questionId)) {
      const difficultyKey = question.difficulty.toLowerCase();
      
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { 
          [`solvedStats.${difficultyKey}`]: 1,
          'solvedStats.total': 1
        },
        $addToSet: { solvedQuestionIds: questionId }
      });
    }

    res.json({
      isCorrect,
      correctOptionIndex: question.correctOptionIndex,
      solution: question.solution
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;