import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Home,
  FileText,
  User,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { MdVerified } from 'react-icons/md';
import { useAuth } from '../../Context/AuthContext.jsx';
import NotificationModal from './NotificationModal.jsx';
import api from '../../utils/api.js';

const StudentNavbar = () => {
  const { user, logout, updateUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewCount, setInterviewCount] = useState(0);

  const navLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: Home },
    { name: 'Jobs', path: '/student/jobs', icon: Briefcase },
    { name: 'Applications', path: '/student/applications', icon: FileText },
    { name: 'Profile', path: '/student/profile', icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const fetchInterviewCount = async () => {
      try {
        const response = await api.get('/student/interviews');
        const upcoming = response.data.filter((i) => i.status === 'scheduled');
        setInterviewCount(upcoming.length);

        const profileresponse = await api.get('/student/profile');
        updateUser(profileresponse.data);
      } catch (error) {
        console.error('Error fetching interview count:', error);
      }
    };

    fetchInterviewCount();
  }, []);

  return (
    <>
      <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link to="/student/dashboard" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-orange-500 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                    HireStream
                  </span>
                  <p className="text-xs text-gray-500">Student Portal</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      isActive(link.path)
                        ? 'bg-purple-50 text-purple-600 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right Side - Notifications & Profile */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button
                onClick={(e) => (
                  e.preventDefault(), setShowInterviewModal(true)
                )}
                className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Bell className="w-6 h-6" />

                {interviewCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {interviewCount}
                  </span>
                )}
              </button>

              {/* Profile Dropdown */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-9 h-9 relative bg-gradient-to-br from-purple-600 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                    {user?.isVerified ? (
                      <MdVerified className="w-4 h-4 bg-white rounded-full text-green-600 absolute -bottom-0 -right-1" />
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-semibold text-gray-800">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500">Student</p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-600 transition-transform ${
                      profileDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      to="/student/profile"
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm">My Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive(link.path)
                        ? 'bg-purple-50 text-purple-600 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}

              {/* Mobile Profile Section */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <div className="flex items-center gap-3 px-4 py-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {showInterviewModal && (
        <NotificationModal
          isOpen={showInterviewModal}
          onClose={() => setShowInterviewModal(false)}
        />
      )}
    </>
  );
};

export default StudentNavbar;
