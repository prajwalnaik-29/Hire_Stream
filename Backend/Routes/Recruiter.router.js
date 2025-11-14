import { Router } from 'express';
import {
  getActiveJobsController,
  getAllApplicationforRecruiter,
  getApplicationsByStatus,
  getjobs,
  getStudentByIdWithApplications,
  jobsController,
  updateApplicationStatus,
} from '../Controllers/Recruiter.controller.js';
import { authorizerole } from '../Middlewares/auth.js';
import authMiddleware from '../Middlewares/auth.js';
import {
  createInterview,
  deleteInterview,
  getAllInterviews,
  updateInterview,
  updateInterviewStatus,
} from '../Controllers/Interview.controller.js';

const router = Router();

router.post(
  '/jobs',
  authMiddleware,
  authorizerole('recruiter'),
  jobsController
);

router.get('/jobs', getjobs);

router.get('/jobs/active', getActiveJobsController);

router.get('/applications', authMiddleware, getAllApplicationforRecruiter);

router.get('/applicationsbystatus', authMiddleware, getApplicationsByStatus);

router.get('/candidates/:id', authMiddleware, getStudentByIdWithApplications);

router.put(
  '/applications/:applicationId/status',
  authMiddleware,
  updateApplicationStatus
);

router.post('/interviews', authMiddleware, createInterview);

router.put('/interviews/:id', authMiddleware, updateInterview);

router.get('/interviews', authMiddleware, getAllInterviews);

router.delete('/interviews/:id', authMiddleware, deleteInterview);

router.put('/updateinterviews/:id', authMiddleware, updateInterviewStatus);

export default router;
