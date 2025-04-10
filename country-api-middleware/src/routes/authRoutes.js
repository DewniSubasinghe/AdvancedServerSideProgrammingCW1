const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegister, validateLogin, validateRequest } = require('../utils/validator');

// User registration
router.post('/register', 
  validateRegister,
  validateRequest,
  authController.register
);

// User login
router.post('/login',
  validateLogin,
  validateRequest,
  authController.login
);

// User logout
router.post('/logout', authController.logout);

// Get current user
router.get('/me', authController.getCurrentUser);

module.exports = router;