import { Link } from 'react-router-dom';
import { Briefcase, Mail } from 'lucide-react';
import { FiGithub } from 'react-icons/fi';
import { FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const StudentFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-orange-500 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                HireStream
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Smart Placement Management Platform connecting students with
              opportunities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/student/dashboard"
                  className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/student/jobs"
                  className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
                >
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link
                  to="/student/applications"
                  className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
                >
                  My Applications
                </Link>
              </li>
              <li>
                <Link
                  to="/student/profile"
                  className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Connect With Us
            </h3>
            <div className="flex items-center gap-2 mb-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <a
                href="mailto:support@hirestream.com"
                className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
              >
                support@hirestream.com
              </a>
            </div>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-8 h-8 bg-gray-100 hover:bg-purple-100 rounded-lg flex items-center justify-center transition-colors"
              >
                <FaXTwitter className="w-4 h-4 text-gray-600 hover:text-purple-600" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-100 hover:bg-purple-100 rounded-lg flex items-center justify-center transition-colors"
              >
                <FaLinkedinIn className="w-4 h-4 text-gray-600 hover:text-purple-600" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-100 hover:bg-purple-100 rounded-lg flex items-center justify-center transition-colors"
              >
                <FiGithub className="w-4 h-4 text-gray-600 hover:text-purple-600" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {currentYear} HireStream. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              to="#"
              className="text-sm text-gray-500 hover:text-purple-600 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="#"
              className="text-sm text-gray-500 hover:text-purple-600 transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default StudentFooter;
