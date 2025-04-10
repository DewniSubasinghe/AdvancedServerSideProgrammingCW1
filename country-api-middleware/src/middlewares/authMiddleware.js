const { User } = require('../models');
const logger = require('../utils/logger');

module.exports = {
  sessionAuth: (req, res, next) => {
    if (!req.session.user) {
      logger.warn('Unauthenticated request attempt');
      return res.status(401).json({
        error: 'Not authenticated',
        message: 'Please login to access this resource'
      });
    }
    next();
  },

  adminAuth: async (req, res, next) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const user = await User.findByPk(req.session.user.id);
      if (!user || !user.isAdmin) {
        logger.warn(`Unauthorized admin access attempt by user ${req.session.user.id}`);
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Admin privileges required'
        });
      }

      req.session.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
      };

      next();
    } catch (error) {
      logger.error(`Admin auth error: ${error.message}`);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to verify admin status'
      });
    }
  }
};