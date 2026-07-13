import { Router } from 'express';
const router = Router();

// ------------------------------------------------------

// Import Routes
import authRoutes from './routes/authRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import publicRoutes from './routes/publicRoutes.js';

// Use Routes
router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/restaurant', restaurantRoutes);
router.use('/api/v1/category', categoryRoutes);
router.use('/api/v1/menu', menuRoutes);
router.use('/api/v1/public', publicRoutes);

export default router;
