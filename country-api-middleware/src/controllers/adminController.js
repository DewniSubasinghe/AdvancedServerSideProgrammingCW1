const { User, ApiKey, UsageLog, Session } = require('../models');
const { sequelize } = require('../models');
const logger = require('../utils/logger');

module.exports = {
  getAllUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        attributes: ['id', 'username', 'email', 'isAdmin', 'isActive', 'createdAt'],
        order: [['createdAt', 'DESC']]
      });
      res.json(users);
    } catch (error) {
      logger.error(`Admin error: ${error.message}`);
      next(error);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
     
      await ApiKey.destroy({ where: { userId: user.id } });
      await user.destroy();
     
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      logger.error(`Admin error: ${error.message}`);
      next(error);
    }
  },

  toggleUserAdminStatus: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
     
      await user.update({ isAdmin: !user.isAdmin });
      res.json({
        message: 'User admin status updated',
        isAdmin: user.isAdmin
      });
    } catch (error) {
      logger.error(`Admin error: ${error.message}`);
      next(error);
    }
  },

  toggleUserActiveStatus: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
     
      await user.update({ isActive: !user.isActive });
      res.json({
        message: 'User active status updated',
        isActive: user.isActive
      });
    } catch (error) {
      logger.error(`Admin error: ${error.message}`);
      next(error);
    }
  },

  getAllApiKeys: async (req, res, next) => {
    try {
      const apiKeys = await ApiKey.findAll({
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email']
        }],
        order: [['createdAt', 'DESC']]
      });
      res.json(apiKeys);
    } catch (error) {
      logger.error(`Admin error: ${error.message}`);
      next(error);
    }
  },

  deleteApiKey: async (req, res, next) => {
    try {
      const apiKey = await ApiKey.findByPk(req.params.id);
      if (!apiKey) {
        return res.status(404).json({ error: 'API key not found' });
      }
     
      await apiKey.destroy();
      res.json({ message: 'API key deleted successfully' });
    } catch (error) {
      logger.error(`Admin error: ${error.message}`);
      next(error);
    }
  },

  getApiUsageStats: async (req, res, next) => {
    try {
      const stats = await UsageLog.findAll({
        attributes: [
          'endpoint',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('MAX', sequelize.col('created_at')), 'lastUsed']
        ],
        group: ['endpoint'],
        order: [[sequelize.literal('count'), 'DESC']],
        limit: 10
      });
     
      res.json(stats);
    } catch (error) {
      logger.error(`Admin error: ${error.message}`);
      next(error);
    }
  },

  getSessionStats: async (req, res, next) => {
    try {
      const stats = await Session.findAll({
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('sid')), 'totalSessions'],
          [sequelize.fn('MAX', sequelize.col('expires')), 'newestSession'],
          [sequelize.fn('MIN', sequelize.col('expires')), 'oldestSession']
        ]
      });
     
      res.json(stats[0]);
    } catch (error) {
      logger.error(`Admin error: ${error.message}`);
      next(error);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Delete all user's API keys first
      await ApiKey.destroy({ where: { userId: user.id } });
      
      // Delete all user's usage logs
      await UsageLog.destroy({ where: { userId: user.id } });
      
      // Then delete the user
      await user.destroy();
      
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      logger.error(`Admin error: ${error.message}`);
      next(error);
    }
  }
};