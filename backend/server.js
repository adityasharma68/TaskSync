// server.js — Task Manager Entry Point (v2 with Auth)
require('dotenv').config();

const express         = require('express');
const cors            = require('cors');
const morgan          = require('morgan');
const { testConnection } = require('./config/db');
const taskRoutes      = require('./routes/taskRoutes');
const authRoutes      = require('./routes/authRoutes');
const authMiddleware  = require('./middleware/authMiddleware');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(morgan('dev'));
app.use(cors({
  origin: [process.env.FRONTEND_ORIGIN || 'http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public routes
app.get('/health', (_req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }));
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/tasks', authMiddleware, taskRoutes);

// 404
app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found.' }));

// Error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

const start = async () => {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`🚀  Server  → http://localhost:${PORT}`);
    console.log(`🔐  Auth    → http://localhost:${PORT}/api/auth`);
    console.log(`📋  Tasks   → http://localhost:${PORT}/api/tasks`);
  });
};

start();
