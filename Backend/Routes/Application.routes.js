import { Router } from 'express';
import {
  applyForJob,
  getAllApplications,
  getApplicationstatus,
} from '../Controllers/Application.controller.js';
import authMiddleware from '../Middlewares/auth.js';

const router = Router();

router.post('/apply', authMiddleware, applyForJob);

router.get('/myapplication', authMiddleware, getAllApplications);

router.get('/:id', authMiddleware, getApplicationstatus);

export default router;
