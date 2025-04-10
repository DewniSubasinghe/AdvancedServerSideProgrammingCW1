const countryService = require('../services/countryService');
const logger = require('../utils/logger');

module.exports = {
  getAllCountries: async (req, res) => {
    try {
      const countries = await countryService.fetchAllCountries();
      res.json(countries);
    } catch (error) {
      logger.error(`Country controller error: ${error.message}`);
      res.status(500).json({ 
        error: 'Failed to fetch countries',
        message: error.message 
      });
    }
  },

  getCountryByName: async (req, res) => {
    try {
      const countries = await countryService.fetchCountryByName(req.params.name);
      res.json(countries);
    } catch (error) {
      logger.error(`Country controller error: ${error.message}`);
      res.status(500).json({ 
        error: 'Failed to fetch country',
        message: error.message 
      });
    }
  }
};