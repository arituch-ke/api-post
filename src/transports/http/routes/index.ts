import {Router} from 'express';
import rootRouter from './root';
import authRouter from './auth';
import userRouter from './user';
import postRouter from './post';

const router = Router();

router.use(rootRouter);
router.use(authRouter);
router.use(userRouter);
router.use(postRouter);

export default router;
