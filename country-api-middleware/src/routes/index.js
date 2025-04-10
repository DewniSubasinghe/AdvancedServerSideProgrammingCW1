const sequelize = require('../config/database');
const User = require('./User')(sequelize);
const ApiKey = require('./ApiKey')(sequelize);
const UsageLog = require('./UsageLog')(sequelize);
const Session = require('./Session')(sequelize);

// Set up associations
User.associate({ ApiKey, UsageLog });
ApiKey.associate({ User, UsageLog });

module.exports = {
  sequelize,
  User,
  ApiKey,
  UsageLog,
  Session
};