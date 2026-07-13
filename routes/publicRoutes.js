import { Router } from 'express';
const router = Router();
// Controllers
import { getPublicMenu } from '../controllers/publicController.js';

// ----------------------------------------------------------

router.route('/menu/:slug').get(getPublicMenu);

export default router;
