import { Router } from 'express';
const router = Router();
// Controllers
import {
  getAllCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from '../controllers/categoryController.js';
// Middleware
import { isAuthenticated } from '../middlewares/authMiddleware.js';

// ----------------------------------------------------------

router.route('/mine').get(isAuthenticated, getAllCategories);
router.route('/').post(isAuthenticated, createCategory);
router.route('/:id').put(isAuthenticated, updateCategory);
router.route('/:id').delete(isAuthenticated, deleteCategory);

export default router;
