import { Router } from 'express';
const router = Router();
// Controllers
import {
  createMenu,
  updateMenu,
  deleteMenu,
  getAllMenus,
} from '../controllers/menuController.js';
// Middleware
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

// ----------------------------------------------------------

router.route('/mine').get(isAuthenticated, getAllMenus);
router.route('/').post(isAuthenticated, upload.single('image'), createMenu);
router.route('/:id').put(isAuthenticated, upload.single('image'), updateMenu);
router.route('/:id').delete(isAuthenticated, deleteMenu);

export default router;
