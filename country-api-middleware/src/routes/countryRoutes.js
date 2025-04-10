const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countryController');
const apiKeyAuth = require('../middlewares/apiKeyAuth');

// Apply API key auth to all country routes
router.use(apiKeyAuth);

router.get('/', countryController.getAllCountries);
router.get('/name/:name', countryController.getCountryByName);

module.exports = router;