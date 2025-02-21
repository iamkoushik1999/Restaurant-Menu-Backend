import { Router } from 'express';
const router = Router();
// Controller
import {
  login,
  changeFirstPassword,
  myProfile,
  generateAccessFromRefresh,
} from '../controllers/authController.js';
// Middleware
import {
  authorizeOwner,
  isAuthenticated,
} from '../middlewares/authMiddleware.js';

// --------------------------------------------------------------------------

// POST
router.route('/login').post(login);
// POST
router.route('/password').put(changeFirstPassword);
// GET
router.route('/profile').get(isAuthenticated, authorizeOwner, myProfile);
// POST
router.route('/accesstoken').post(generateAccessFromRefresh);

export default router;
