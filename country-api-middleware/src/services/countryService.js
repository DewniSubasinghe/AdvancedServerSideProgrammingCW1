const axios = require('axios');
const logger = require('../utils/logger');

const API_BASE_URL = 'https://restcountries.com/v3.1';

const transformCountryData = (country) => {
  return {
    name: country.name?.common,
    officialName: country.name?.official,
    capital: country.capital?.[0],
    currencies: country.currencies ? Object.keys(country.currencies) : [],
    languages: country.languages ? Object.values(country.languages) : [],
    flag: country.flags?.png
  };
};

module.exports = {
  fetchAllCountries: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/all`);
      return response.data.map(transformCountryData);
    } catch (error) {
      logger.error(`Failed to fetch countries: ${error.message}`);
      throw error;
    }
  },

  fetchCountryByName: async (name) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/name/${name}`);
      return response.data.map(transformCountryData);
    } catch (error) {
      logger.error(`Failed to fetch country ${name}: ${error.message}`);
      throw error;
    }
  }
};