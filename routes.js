import { Router } from 'express';
const router = Router();

// ------------------------------------------------------

// Import Routes
// Restaurant
import restaurantRoutes from './routes/restaurantRoutes.js';
// Category
import categoryRoutes from './routes/categoryRoutes.js';

// Use Routes
// Restaurants
router.use('/api/v1/restaurant', restaurantRoutes);
// Category
router.use('/api/v1/category', categoryRoutes);

export default router;
