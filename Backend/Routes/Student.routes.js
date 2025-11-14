import { Router } from 'express';
import {
  getApplicationStatusCounts,
  getStudentInterviews,
  getStudentProfile,
  getvarifiedjobs,
  getVerifiedJobById,
  Resumeparce,
  updateProfile,
} from '../Controllers/Student.controller.js';
import authMiddleware from '../Middlewares/auth.js';
import upload from '../Middlewares/upload.js';

const router = Router();

router.get('/profile', authMiddleware, getStudentProfile);

router.get('/jobs', authMiddleware, getvarifiedjobs);

router.get('/jobs/:id', authMiddleware, getVerifiedJobById);

router.put('/profile', authMiddleware, upload.single('resume'), updateProfile);

router.get('/applications/status', authMiddleware, getApplicationStatusCounts);

router.get('/interviews', authMiddleware, getStudentInterviews);

router.post('/parse-resume', upload.single('file'), Resumeparce);

export default router;
