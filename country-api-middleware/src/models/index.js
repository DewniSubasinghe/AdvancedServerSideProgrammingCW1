const sequelize = require('../config/database');
const User = require('./User')(sequelize);
const ApiKey = require('./ApiKey')(sequelize);
const UsageLog = require('./UsageLog')(sequelize);
const Session = require('./Session')(sequelize);

// Setup associations
User.hasMany(ApiKey, { foreignKey: 'userId', as: 'apiKeys' });
ApiKey.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(UsageLog, { foreignKey: 'userId' });
ApiKey.hasMany(UsageLog, { foreignKey: 'apiKeyId' });

module.exports = {
  sequelize,
  User,
  ApiKey,
  UsageLog,
  Session
};