import { Router } from 'express';
const router = Router();
// Controller
import {
  register,
  login,
  changePassword,
  myProfile,
  generateAccessFromRefresh,
} from '../controllers/authController.js';
// Middleware
import { isAuthenticated } from '../middlewares/authMiddleware.js';

// --------------------------------------------------------------------------

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/accesstoken').post(generateAccessFromRefresh);
router.route('/profile').get(isAuthenticated, myProfile);
router.route('/password').put(isAuthenticated, changePassword);

export default router;
