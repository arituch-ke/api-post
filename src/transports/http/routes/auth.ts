import {Router} from 'express';
import * as authController from '../controllers/AuthController';
import {isAuthenticated} from '../middlewares/authenticatePassport';

const router = Router();

router.post('/auth/login', authController.login);
router.post('/auth/refresh', isAuthenticated, authController.refreshToken);

export default router;
