import { Router } from 'express';
const router = Router();
// Controllers
import {
  createMenu,
  updateMenu,
  deleteMenu,
  getAllMenus,
} from '../controllers/menuController.js';

// ----------------------------------------------------------

// GET
router.route('/:restaurantId').get(getAllMenus);
// POST
router.route('/').post(createMenu);
// PUT
router.route('/update/:id').put(updateMenu);
// DELETE
router.route('/delete/:id').delete(deleteMenu);

export default router;
