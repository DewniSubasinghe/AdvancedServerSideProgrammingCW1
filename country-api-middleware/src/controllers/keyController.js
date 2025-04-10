const { ApiKey } = require('../models');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  createKey: async (req, res, next) => {
    try {
      const { name } = req.body;
      const userId = req.session.user.id;

      const apiKey = await ApiKey.create({
        key: `ak_${uuidv4()}`,
        name: name || 'Default Key',
        userId
      });

      res.status(201).json({
        message: 'API key created successfully',
        key: apiKey.key,
        keyId: apiKey.id,
        name: apiKey.name,
        createdAt: apiKey.createdAt
      });
    } catch (error) {
      next(error);
    }
  },

  listKeys: async (req, res, next) => {
    try {
      const keys = await ApiKey.findAll({
        where: { userId: req.session.user.id },
        attributes: ['id', 'name', 'key', 'createdAt', 'lastUsed', 'usageCount'],
        order: [['createdAt', 'DESC']]
      });
      res.json(keys);
    } catch (error) {
      next(error);
    }
  },

  revokeKey: async (req, res, next) => {
    try {
      const key = await ApiKey.findOne({
        where: {
          id: req.params.id,
          userId: req.session.user.id
        }
      });

      if (!key) {
        return res.status(404).json({ error: 'Key not found' });
      }

      await key.update({ isActive: false });
      res.json({ message: 'Key revoked successfully' });
    } catch (error) {
      next(error);
    }
  }
};