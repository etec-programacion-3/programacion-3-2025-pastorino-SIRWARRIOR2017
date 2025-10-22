const express = require('express');
const router = express.Router();

// Asegúrate que authController exporte { register, login }
const { register, login } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

module.exports = router;