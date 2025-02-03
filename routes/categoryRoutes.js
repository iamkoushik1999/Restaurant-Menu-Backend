import { Router } from 'express';
const router = Router();
// Controllers
import {
  getAllCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from '../controllers/categoryController.js';

// ----------------------------------------------------------

// GET
router.route('/:restaurantId').get(getAllCategories);
// POST
router.route('/').post(createCategory);
// PUT
router.route('/update/:id').put(updateCategory);
// DELETE
router.route('/delete/:id').delete(deleteCategory);

export default router;
