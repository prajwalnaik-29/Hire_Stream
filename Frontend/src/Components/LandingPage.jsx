import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, TrendingUp, Sparkles } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-orange-500 rounded-lg flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
              HireStream
            </span>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 text-purple-600 border rounded-full hover:bg-red-50 hover:text-purple-700 font-medium transition-colors"
          >
            Sign up
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center min-h-screen px-4 pt-20">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-purple-100">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-gray-600">
              Smart Placement Management Platform
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-orange-500 bg-clip-text text-transparent">
              Streamline Your
            </span>
            <br />
            <span className="text-gray-800">Campus Placements</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Connect students, recruiters, and administrators on one powerful
            platform. Manage applications, schedule interviews, and track
            placements effortlessly.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl shadow-md hover:shadow-lg border-2 border-purple-200 hover:border-purple-300 transition-all duration-200"
            >
              Login to Dashboard
            </button>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
            {/* Students Card */}
            <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-purple-50">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                For Students
              </h3>
              <p className="text-gray-600 text-sm">
                Apply to jobs, track applications, and manage your placement
                journey in one place.
              </p>
            </div>

            {/* Recruiters Card */}
            <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-orange-50">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                For Recruiters
              </h3>
              <p className="text-gray-600 text-sm">
                Post openings, shortlist candidates, and schedule interviews
                seamlessly.
              </p>
            </div>

            {/* Admin Card */}
            <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-purple-50">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-orange-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                For Admins
              </h3>
              <p className="text-gray-600 text-sm">
                Verify users, manage placements, and export comprehensive
                reports.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 p-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-500">
            © 2025 HireStream. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
