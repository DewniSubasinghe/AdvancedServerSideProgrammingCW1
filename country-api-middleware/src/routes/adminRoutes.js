const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { sessionAuth, adminAuth } = require('../middlewares/authMiddleware');

// Require admin privileges for all admin routes
router.use(sessionAuth);
router.use(adminAuth);

// User Management
router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);  // This is the delete route
router.patch('/users/:id/admin-status', adminController.toggleUserAdminStatus);
router.patch('/users/:id/active-status', adminController.toggleUserActiveStatus);

// API Key Management
router.get('/api-keys', adminController.getAllApiKeys);
router.delete('/api-keys/:id', adminController.deleteApiKey);

// Statistics
router.get('/stats/usage', adminController.getApiUsageStats);
router.get('/stats/sessions', adminController.getSessionStats);

module.exports = router;