const express = require('express');
const router = express.Router();
const keyController = require('../controllers/keyController');
const { sessionAuth } = require('../middlewares/authMiddleware');

// Apply session auth to all key routes
router.use(sessionAuth);

router.post('/', keyController.createKey);
router.get('/', keyController.listKeys);
router.delete('/:id', keyController.revokeKey);

module.exports = router;