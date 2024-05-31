import {Router} from 'express';
import rootRouter from './root';

const router = Router();

router.use(rootRouter);

export default router;
