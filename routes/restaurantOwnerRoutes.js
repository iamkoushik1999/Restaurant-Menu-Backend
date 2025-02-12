import { Router } from 'express';
const router = Router();
// Controllers
import {
  addRestaurantOwner,
  getAllRestaurantOwners,
} from '../controllers/restaurantOwnerController.js';

// ---------------------------------------------------

// GET
router.route('/').get(getAllRestaurantOwners);
// POST
router.route('/').post(addRestaurantOwner);

export default router;
