import {Router} from 'express';
import * as postController from '../controllers/PostController';
import {isAuthenticated} from '../middlewares/authenticatePassport';
const router = Router();

router.get('/posts', isAuthenticated, postController.getAllPost);
router.post('/posts', isAuthenticated, postController.createPost);
router.get('/posts/:postId', isAuthenticated, postController.getPost);
router.patch('/posts/:postId', isAuthenticated, postController.updatePost);
router.delete('/posts/:postId', isAuthenticated, postController.deletePost);

export default router;
