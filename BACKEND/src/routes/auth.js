const express = require('express');
const router = express.Router();
const passport = require('../config/passport');

const { register, login, googleCallback } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

// Google OAuth routes
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=authentication_failed`
  }),
  googleCallback
);

module.exports = router;