import { Router } from 'express';
const router = Router();

// ------------------------------------------------------

// Import Routes
// Auth
import authRoutes from './routes/authRoutes.js';
// Owner
import ownerRoutes from './routes/restaurantOwnerRoutes.js';
// Restaurant
import restaurantRoutes from './routes/restaurantRoutes.js';
// Category
import categoryRoutes from './routes/categoryRoutes.js';
// Menu
import menuRoutes from './routes/menuRoutes.js';

// Use Routes
// Auth
router.use('/api/v1/auth', authRoutes);
// Owners
router.use('/api/v1/owner', ownerRoutes);
// Restaurants
router.use('/api/v1/restaurant', restaurantRoutes);
// Category
router.use('/api/v1/category', categoryRoutes);
// Menu
router.use('/api/v1/menu', menuRoutes);

export default router;
