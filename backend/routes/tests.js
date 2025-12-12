const express = require('express');
const TestConfig = require('../models/TestConfig');
const TestResult = require('../models/TestResult');
const Question = require('../models/Question');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const tests = await TestConfig.find()
      .select('-questions')
      .lean();
    
    const testsWithCount = await Promise.all(
      tests.map(async (test) => {
        const fullTest = await TestConfig.findById(test._id);
        return {
          ...test,
          questionCount: fullTest.questions.length
        };
      })
    );
    
    res.json(testsWithCount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/start', async (req, res) => {
  try {
    const test = await TestConfig.findById(req.params.id)
      .populate({
        path: 'questions',
        select: '-correctOptionIndex -solution'
      });
    
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }
    
    res.json(test);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/submit', authMiddleware, async (req, res) => {
  try {
    const { answers } = req.body;
    
    const test = await TestConfig.findById(req.params.id)
      .populate('questions');
    
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }
    
    let score = 0;
    const breakdown = answers.map(ans => {
      const question = test.questions.find(q => q._id.toString() === ans.questionId);
      const isCorrect = question.correctOptionIndex === ans.selectedOption;
      
      if (isCorrect) {
        score++;

        if (!req.user.solvedQuestionIds.includes(question._id)) {
          const difficultyKey = question.difficulty.toLowerCase();
          
          User.findByIdAndUpdate(req.user._id, {
            $inc: { 
              [`solvedStats.${difficultyKey}`]: 1,
              'solvedStats.total': 1
            },
            $addToSet: { solvedQuestionIds: question._id }
          }).exec();
        }
      }
      
      return {
        questionId: ans.questionId,
        selectedOption: ans.selectedOption,
        isCorrect
      };
    });
    
    const percentage = Math.round((score / test.totalMarks) * 100);
    
    const result = await TestResult.create({
      user: req.user._id,
      test: req.params.id,
      score,
      totalMarks: test.totalMarks,
      percentage,
      answers: breakdown
    });
    
    res.json({
      resultId: result._id,
      score,
      totalMarks: test.totalMarks,
      percentage,
      breakdown,
      testName: test.title
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/questions', async (req, res) => {
  try {
    const test = await TestConfig.findById(req.params.id)
      .populate('questions');
    
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }
    
    res.json(test.questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;