import { Outlet } from 'react-router-dom';
import Landing from './Components/LandingPage.jsx';
import { AuthProvider } from './Context/AuthContext.jsx';

function App() {
  return (
    <>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </>
  );
}

export default App;
