import { Outlet } from 'react-router-dom';
import AdminNavbar from './Navbar.jsx';

export default function AdminEntrypoint() {
  return (
    <>
      <AdminNavbar />
      <Outlet />
    </>
  );
}
