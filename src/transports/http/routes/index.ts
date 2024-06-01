import {Router} from 'express';
import rootRouter from './root';
import authRouter from './auth';
import userRouter from './user';

const router = Router();

router.use(rootRouter);
router.use(authRouter);
router.use(userRouter);

export default router;
