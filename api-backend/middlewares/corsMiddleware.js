const cors = require('cors');

const allowedOrigins = ['http://localhost:3000'];
const allowedRoutes = ['/api/stats'];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization',"x-csrf-token"],
  credentials: true,
  optionsSuccessStatus: 200,
};

const corsMiddleware = (req, res, next) => {
  if (allowedRoutes.includes(req.path)) {
    cors({ origin: '*' })(req, res, next);
  } else {
    cors(corsOptions)(req, res, next);
  }
};

module.exports = corsMiddleware;
