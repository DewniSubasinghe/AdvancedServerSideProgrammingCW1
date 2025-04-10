const { v4: uuidv4 } = require('uuid');
const { ApiKey } = require('../models');

module.exports = {
  createKey: async (userId, keyName) => {
    const key = uuidv4();
    return await ApiKey.create({
      key,
      user_id: userId,
      name: keyName
    });
  },

  getKeys: async (userId) => {
    return await ApiKey.findAll({ 
      where: { user_id: userId },
      order: [['created_at', 'DESC']]
    });
  }
};