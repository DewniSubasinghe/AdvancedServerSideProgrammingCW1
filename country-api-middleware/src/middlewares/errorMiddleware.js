const logger = require('../utils/logger');

module.exports = {
  notFound: (req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
  },
  
  errorHandler: (err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};