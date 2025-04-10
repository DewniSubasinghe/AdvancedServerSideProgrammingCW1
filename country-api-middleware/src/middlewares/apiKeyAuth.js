const { ApiKey, UsageLog } = require('../models');
const logger = require('../utils/logger');

module.exports = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
 
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }

  try {
    const key = await ApiKey.findOne({
      where: { key: apiKey, isActive: true },
      include: 'user'
    });

    if (!key) {
      return res.status(403).json({ error: 'Invalid API key' });
    }

    // Track usage
    await UsageLog.create({
      apiKeyId: key.id,
      userId: key.userId,
      endpoint: req.originalUrl,
      ipAddress: req.ip
    });

    await key.update({
      lastUsed: new Date(),
      usageCount: (key.usageCount || 0) + 1
    });

    req.apiKey = key;
    next();
  } catch (error) {
    logger.error(`API key validation error: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};