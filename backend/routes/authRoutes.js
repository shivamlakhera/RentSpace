const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { register, login, logout, getMe } = require('../controller/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;
