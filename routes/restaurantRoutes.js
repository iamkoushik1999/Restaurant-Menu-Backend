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
  myRestaurant,
  nearbyRestaurants,
} from '../controllers/restaurantController.js';
// Middleware
import {
  authorizeOwner,
  isAuthenticated,
} from '../middlewares/authMiddleware.js';

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
router.route('/nearby').get(nearbyRestaurants);

// GET
router
  .route('/myRestaurant')
  .get(isAuthenticated, authorizeOwner, myRestaurant);

// GET
router.route('/:id').get(getRestaurant);

export default router;
