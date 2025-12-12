const express = require('express');
const User = require('../models/User');
const TestResult = require('../models/TestResult');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.solvedStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/results', authMiddleware, async (req, res) => {
  try {
    const results = await TestResult.find({ user: req.user._id })
      .populate('test', 'title')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    const formattedResults = results.map(r => ({
      _id: r._id,
      testName: r.test.title,
      percentage: r.percentage,
      score: r.score,
      totalMarks: r.totalMarks,
      date: r.createdAt
    }));
    
    res.json(formattedResults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;