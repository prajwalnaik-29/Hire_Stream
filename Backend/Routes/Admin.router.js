import { Router } from 'express';
import {
  getalljob,
  getAllrecruiters,
  getAllStudents,
  getPendingVerifications,
  gettingAllapplication,
} from '../Controllers/Admin.controller.js';
import authMiddleware, { authorizerole } from '../Middlewares/auth.js';
import Job from '../Models/job.model.js';
import User from '../Models/User.model.js';

const router = Router();

router.get('/jobs', authMiddleware, authorizerole('admin'), getalljob);

router.put('/jobs/verify', async (req, res) => {
  const { isVerified, jobId } = req.body;

  const jobs = await Job.findOneAndUpdate(
    { _id: jobId },
    { $set: { isVerified } },
    { new: true }
  );

  res
    .status(200)
    .send({ message: 'updated successfully', success: true, jobs });
});

router.put('/students/:id/verify', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { isVerified } = req.body;

  const students = await User.findOneAndUpdate(
    { _id: id },
    { $set: { isVerified } },
    { new: true }
  );

  res
    .status(200)
    .send({ message: 'updated successfully', success: true, students });
});

router.get('/students', authMiddleware, getAllStudents);

router.get('/pendingverifications', authMiddleware, getPendingVerifications);

router.get('/recruiters', authMiddleware, getAllrecruiters);

router.get('/applications', authMiddleware, gettingAllapplication);

export default router;
