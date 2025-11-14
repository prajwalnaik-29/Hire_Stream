import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  Calendar,
  ArrowRight,
  Building,
} from 'lucide-react';
import { useAuth } from '../../Context/AuthContext';
import api from '../../utils/api.js';
import ShortlistModal from './ShortlistModal.jsx';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalApplications: 0,
    pending: 0,
    shortlisted: 0,
    rejected: 0,
  });
  const [recentApplications, setRecentApplications] = useState(null);
  const [recommendedJobs, setRecommendedJobs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setmodal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch stats
      const statsResponse = await api.get('/student/applications/status');
      console.log(statsResponse);
      setStats(statsResponse);

      // Fetch recent applications
      const applicationsResponse = await api.get(
        '/applications/myapplication?limit=5'
      );
      setRecentApplications(applicationsResponse?.applications);
      // Fetch recommended jobs
      const jobsResponse = await api.get('/student/jobs?limit=4');
      setRecommendedJobs(jobsResponse?.jobs);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      icon: FileText,
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-100',
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'orange',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-100',
    },
    {
      title: 'Shortlisted',
      value: stats.shortlisted,
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-100',
    },
    {
      title: 'Rejected',
      value: stats.rejected,
      icon: XCircle,
      color: 'red',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      borderColor: 'border-red-100',
    },
  ];

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-orange-100 text-orange-700 border-orange-200',
      shortlisted: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
      accepted: 'bg-blue-100 text-blue-700 border-blue-200',
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${
          statusStyles[status] || 'bg-gray-100 text-gray-700'
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  useEffect(() => {
    if (stats.shortlisted > 0) {
      setmodal(true);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading Dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your applications today.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className={`bg-white rounded-xl shadow-sm border ${stat.borderColor} p-6 hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}
                    >
                      <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                    </div>
                    <TrendingUp className="w-5 h-5 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </div>
              );
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Applications */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">
                    Recent Applications
                  </h2>
                  <Link
                    to="/student/applications"
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                  >
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {recentApplications == null ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No applications yet</p>
                    <Link
                      to="/student/jobs"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-orange-500 text-white font-medium rounded-lg hover:shadow-lg transition-shadow"
                    >
                      Browse Jobs
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentApplications.map((application) => (
                      <div
                        key={application._id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-200 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-orange-100 rounded-lg flex items-center justify-center">
                            <Building className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              {application?.job?.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {application?.job?.company}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right hidden sm:block">
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(
                                application?.appliedAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          {getStatusBadge(application?.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recommended Jobs */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">
                    Recommended jobs
                  </h2>
                  <Link
                    to="/student/jobs"
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    See All
                  </Link>
                </div>

                {recommendedJobs == null ? (
                  <div className="text-center py-8">
                    <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No jobs available</p>
                  </div>
                ) : (
                  <div className="space-y-4 overflow-auto max-h-80 no-scrollbar">
                    {recommendedJobs.map((job) => (
                      <Link
                        key={job._id}
                        to={`/student/jobs/${job._id}`}
                        className="block p-4 border border-gray-200 rounded-lg hover:border-purple-200 hover:shadow-sm transition-all"
                      >
                        <h3 className="font-semibold text-gray-800 mb-1">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {job.company}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{job.location}</span>
                          <span className="text-purple-600 font-medium">
                            {job.salary}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-purple-600 to-orange-500 rounded-xl shadow-sm p-6 mt-6 text-white">
                <h3 className="text-lg font-bold mb-3">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    to="/student/profile"
                    className="block w-full py-2 px-4 bg-white/20 hover:bg-white/30 rounded-lg text-center font-medium transition-colors"
                  >
                    Update Profile
                  </Link>
                  <Link
                    to="/student/jobs"
                    className="block w-full py-2 px-4 bg-white/20 hover:bg-white/30 rounded-lg text-center font-medium transition-colors"
                  >
                    Browse Jobs
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <ShortlistModal
        isOpen={modal}
        setIsOpen={() => setmodal(false)}
      ></ShortlistModal>
    </div>
  );
};

export default StudentDashboard;
