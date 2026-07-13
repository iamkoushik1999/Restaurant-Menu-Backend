import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
dotenv.config();
// Database
import connectDB from './config/database.js';
connectDB();
// Routes
import router from './routes.js';
// Error
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';

const { NODE_ENV, FRONTEND_URL } = process.env;

// App
const app = express();

app.set('trust proxy', 1);

// Security & parsing middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(cookieParser());

const allowedOrigins = (FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

if (NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Rate limit auth endpoints to slow down brute force / signup abuse
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/v1/auth', authLimiter);

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

app.use(router);

app.use(notFound);
app.use(errorHandler);

export default app;
