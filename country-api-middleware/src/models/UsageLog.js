const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UsageLog = sequelize.define('UsageLog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    endpoint: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ipAddress: {
      type: DataTypes.STRING,
      field: 'ip_address'
    },
    createdAt: {  // Explicitly define createdAt
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at'
    }
  }, {
    tableName: 'usage_logs',
    timestamps: true,
    underscored: true
  });

  UsageLog.associate = (models) => {
    UsageLog.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    UsageLog.belongsTo(models.ApiKey, {
      foreignKey: 'apiKeyId',
      as: 'apiKey'
    });
  };

  return UsageLog;
};