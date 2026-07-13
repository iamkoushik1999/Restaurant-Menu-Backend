import { Router } from 'express';
const router = Router();
// Controllers
import { myRestaurant, updateMyRestaurant } from '../controllers/restaurantController.js';
// Middleware
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

// ---------------------------------------------------

router.route('/mine').get(isAuthenticated, myRestaurant);
router
  .route('/mine')
  .put(isAuthenticated, upload.single('logo'), updateMyRestaurant);

export default router;
