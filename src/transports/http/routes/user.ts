import {Router} from 'express';
import * as userController from '../controllers/UserController';
import {isAuthenticated} from '../middlewares/authenticatePassport';
const router = Router();

router.get('/users/current', isAuthenticated, userController.getUser);
router.post('/users', userController.createUser);

export default router;
