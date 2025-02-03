import { Router } from 'express';
const router = Router();
// Controllers
import {
  getRestaurants,
  createRestaurant,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
  restoreRestaurant,
  getDeletedRestaurants,
} from '../controllers/restaurantController.js';

// ---------------------------------------------------

// GET
router.route('/').get(getRestaurants);
// POST
router.route('/').post(createRestaurant);
// PUT
router.route('/update/:id').put(updateRestaurant);
// DELETE
router.route('/delete/:id').delete(deleteRestaurant);
// PUT
router.route('/restore/:id').put(restoreRestaurant);
// GET
router.route('/deleted').get(getDeletedRestaurants);
// GET
router.route('/:id').get(getRestaurant);

export default router;
