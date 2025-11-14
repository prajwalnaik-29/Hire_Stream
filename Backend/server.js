import express from 'express';
import cors from 'cors';
import UserRouter from './Routes/User.router.js';
import RecruiterRouter from './Routes/Recruiter.router.js';
import db from './config/db.js';
import AdminRouter from './Routes/Admin.router.js';
import StudentRouter from './Routes/Student.routes.js';
import ApplicationRouter from './Routes/Application.routes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 5000;

db();

app.use('/user', UserRouter);

app.use('/recruiter', RecruiterRouter);

app.use('/admin', AdminRouter);

app.use('/student', StudentRouter);

app.use('/applications', ApplicationRouter);

app.get('/', (req, res) => {
  res.status(200).send({ message: 'server started' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
