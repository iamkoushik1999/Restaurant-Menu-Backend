import { Router } from 'express';
const router = Router();

// ------------------------------------------------------

// Import Routes
// Restaurant
import restaurantRoutes from './routes/restaurantRoutes.js';
// Category
import categoryRoutes from './routes/categoryRoutes.js';
// Menu
import menuRoutes from './routes/menuRoutes.js';

// Use Routes
// Restaurants
router.use('/api/v1/restaurant', restaurantRoutes);
// Category
router.use('/api/v1/category', categoryRoutes);
// Menu
router.use('/api/v1/menu', menuRoutes);

export default router;
