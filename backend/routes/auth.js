const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false 
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { 
    session: false,
    failureRedirect: process.env.CLIENT_URL 
  }),
  (req, res) => {
    try {
      const token = jwt.sign(
        { id: req.user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
    } catch (error) {
      console.error('Callback error:', error);
      res.redirect(`${process.env.CLIENT_URL}?error=auth_failed`);
    }
  }
);

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await req.user.populate('solvedQuestionIds');
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      solvedStats: user.solvedStats,
      isAdmin: user.isAdmin
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;