import { Router } from 'express';
import {
  loginController,
  registerController,
} from '../Controllers/User.controller.js';

const router = Router();

router.post('/login', loginController);

router.post('/register', registerController);

export default router;
