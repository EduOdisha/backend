import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Routes
import authRoutes from './routes/auth.routes.js';
import collegeRoutes from './routes/college.routes.js';
import courseRoutes from './routes/course.routes.js';
import examRoutes from './routes/exam.routes.js';
import scholarshipRoutes from './routes/scholarship.routes.js';
import coachingRoutes from './routes/coaching.routes.js';
import blogRoutes from './routes/blog.routes.js';
import reviewRoutes from './routes/review.routes.js';
import leadRoutes from './routes/lead.routes.js';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';
import careerRoutes from './routes/career.routes.js';

import { errorHandler, notFound } from './middleware/error.middleware.js';

dotenv.config();

const app = express();

// Trust proxy
app.set('trust proxy', 1);

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW) || 15) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// CORS — accept the CLIENT_URL env var, or fall back to both common dev ports
const ALLOWED_ORIGINS = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL]
  : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    // In development, allow any localhost/127.0.0.1 origin
    if (process.env.NODE_ENV === 'development' && (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:'))) {
      return callback(null, true);
    }
    if (ALLOWED_ORIGINS.includes(origin) || ALLOWED_ORIGINS.includes(origin.replace(/\/$/, ''))) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(compression());
app.use(mongoSanitize());

// Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'EduOdisha API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Base API Route
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to EduOdisha API',
    version: '1.0.0',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/coaching', coachingRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/careers', careerRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 EduOdisha Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    console.log(`🌐 API: http://localhost:${PORT}/api`);
  });
});

export default app;
