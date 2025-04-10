const { User, ApiKey } = require('../models');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  register: async (req, res, next) => {
    try {
      const { username, email, password } = req.body;

      // Check existing user
      const existingUser = await User.findOne({
        where: { email: email.toLowerCase() }
      });
      if (existingUser) {
        return res.status(409).json({ error: 'Email already in use' });
      }

      // First user becomes admin
      const userCount = await User.count();
      const isAdmin = userCount === 0;

      // Create user
      const user = await User.create({
        username,
        email: email.toLowerCase(),
        password,
        isAdmin
      });

      // Create default API key for the user
      const apiKey = await ApiKey.create({
        key: `ak_${uuidv4()}`,
        name: 'Default Key',
        userId: user.id
      });

      // Create session
      req.session.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
      };

      res.status(201).json({
        message: 'Registration successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin
        },
        apiKey: apiKey.key // Send the generated API key to the frontend
      });
    } catch (error) {
      logger.error(`Registration error: ${error.message}`);
      next(error);
    }
  },
  
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({
        where: { email: email.toLowerCase() }
      });

      if (!user || !user.validPassword(password)) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      if (!user.isActive) {
        return res.status(403).json({ error: 'Account is deactivated' });
      }

      req.session.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
      };

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin
        }
      });
    } catch (error) {
      logger.error(`Login error: ${error.message}`);
      next(error);
    }
  },

  logout: (req, res) => {
    req.session.destroy(err => {
      if (err) {
        logger.error(`Logout error: ${err.message}`);
        return res.status(500).json({ error: 'Failed to logout' });
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Logout successful' });
    });
  },

  getCurrentUser: (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    res.json(req.session.user);
  }
};