import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Landing from './Components/LandingPage.jsx';
import Login from './Components/LoginPage.jsx';
import Register from './Components/RegisterPage.jsx';
import StudentEntrypoint from './Components/Studentdashboard/StudentEntrypoint.jsx';
import StudentDashboard from './Components/Studentdashboard/Dashboard.jsx';
import StudentJobs from './Components/Studentdashboard/Jobs.jsx';
import StudentApplications from './Components/Studentdashboard/Applications.jsx';
import StudentProfile from './Components/Studentdashboard/Profile.jsx';
import AdminEntrypoint from './Components/Admin/AdminEntrypoint.jsx';
import RecruiterEntrypoint from './Components/Recruiter/RecruiterEntrypoint.jsx';
import RecruiterDashboard from './Components/Recruiter/Dashboard.jsx';
import PostJobs from './Components/Recruiter/PostJobs.jsx';
import Candidates from './Components/Recruiter/Candidates.jsx';
import Interviews from './Components/Recruiter/Interviews.jsx';
import AdminDashboard from './Components/Admin/Dashboard.jsx';
import Students from './Components/Admin/Students.jsx';
import JobList from './Components/Admin/JobList.jsx';
import JobDetails from './Components/Studentdashboard/JobDetails.jsx';
import Applications from './Components/Admin/ApplicationPage.jsx';
import CandidateDetail from './Components/Recruiter/CandidatesDetails.jsx';

const routes = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Landing />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/student',
        element: <StudentEntrypoint />,
        children: [
          {
            path: '/student/profile',
            element: <StudentProfile />,
          },
          {
            path: '/student/applications',
            element: <StudentApplications />,
          },
          {
            path: '/student/jobs',
            element: <StudentJobs />,
          },
          {
            path: '/student/jobs/:id',
            element: <JobDetails />,
          },
          {
            path: '/student/dashboard',
            element: <StudentDashboard />,
          },
        ],
      },
      {
        path: '/admin',
        element: <AdminEntrypoint />,
        children: [
          {
            path: '/admin/jobs',
            element: <JobList />,
          },
          {
            path: '/admin/applications',
            element: <Applications />,
          },
          {
            path: '/admin/dashboard',
            element: <AdminDashboard />,
          },
          {
            path: '/admin/students',
            element: <Students />,
          },
        ],
      },
      {
        path: '/recruiter',
        element: <RecruiterEntrypoint />,
        children: [
          {
            path: '/recruiter/dashboard',
            element: <RecruiterDashboard />,
          },
          {
            path: '/recruiter/candidates',
            element: <Candidates />,
          },
          {
            path: '/recruiter/candidates/:id',
            element: <CandidateDetail />,
          },
          {
            path: '/recruiter/postjobs',
            element: <PostJobs />,
          },
          {
            path: '/recruiter/interviews',
            element: <Interviews />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={routes} />
);
