import express from 'express';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();
// Database
import connectDB from './config/database.js';
connectDB();
// Routes
import router from './routes.js';
// Error
import { errorHandler } from './middlewares/errorMiddleware.js';

// App
const app = express();

// App Use
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(cookieParser());
app.use(cors());
app.use(router);

app.use(errorHandler);

export default app;
