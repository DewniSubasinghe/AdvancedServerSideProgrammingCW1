const { DataTypes } = require('sequelize');
const crypto = require('crypto');

module.exports = (sequelize) => {
  const ApiKey = sequelize.define('ApiKey', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    key: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
      defaultValue: () => crypto.randomBytes(32).toString('hex')
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 50]
      }
    },
    lastUsed: {
      type: DataTypes.DATE,
      allowNull: true
    },
    usageCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'api_keys',
    timestamps: true,
    hooks: {
      beforeCreate: (key) => {
        key.key = `ak_${crypto.randomBytes(24).toString('hex')}`;
      }
    }
  });

  ApiKey.associate = (models) => {
    ApiKey.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    ApiKey.hasMany(models.UsageLog, {
      foreignKey: 'apiKeyId',
      as: 'usageLogs'
    });
  };

  return ApiKey;
};