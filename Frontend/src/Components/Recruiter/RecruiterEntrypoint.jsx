import { Outlet } from 'react-router-dom';
import RecruiterNavbar from './Navbar.jsx';

export default function RecruiterEntrypoint() {
  return (
    <>
      <RecruiterNavbar />
      <Outlet />
    </>
  );
}
