require('dotenv').config();

module.exports = {
  sessionSecret: process.env.SESSION_SECRET || 'your-secret-key',
  csrfSecret: process.env.CSRF_SECRET || 'your-csrf-secret',
  jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret',
  saltRounds: 10,
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
  corsOptions: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
  helmetOptions: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https://flagcdn.com'],
      },
    },
  },
};