import express from 'express';
import cors from 'cors';
import { ENV } from './config/env.js';
import { testDatabaseConnection } from './config/db.js';
import { apiRouter } from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Configure CORS for local development and specified frontend origin
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests from all origins (Vercel, Netlify, localhost)
      callback(null, true);
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Built-in middleware to parse incoming JSON payloads
app.use(express.json());

// API route registration
app.use('/api', apiRouter);

// Fallback 404 handler for undefined API routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found.`,
  });
});

// Centralized error handler
app.use(errorHandler);

// Start server
const server = app.listen(ENV.PORT, async () => {
  console.log(`=======================================================`);
  console.log(`🎬 CineTrack Backend API Server is running`);
  console.log(`📍 URL: http://localhost:${ENV.PORT}`);
  console.log(`🌐 Frontend Allowed Origin: ${ENV.FRONTEND_URL}`);
  console.log(`=======================================================`);

  // Verify database connectivity on boot
  await testDatabaseConnection();
});

export default app;
