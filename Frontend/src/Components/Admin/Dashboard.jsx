import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Briefcase,
  FileText,
  UserCheck,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Download,
  Calendar,
  Building,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../Context/AuthContext.jsx';
import api from '../../utils/api.js';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalRecruiters: 0,
    totalJobs: 0,
    totalApplications: 0,
    pendingVerifications: 0,
    activeJobs: 0,
    placedStudents: 0,
    pendingApplications: 0,
  });
  const [pendingVerifications, setPendingVerifications] = useState(null);
  const [topRecruiters, setTopRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch overall stats
      const studentResponse = await api.get('/admin/students');
      setStats((prev) => ({
        ...prev,
        totalStudents: studentResponse?.count,
      }));

      const allapplications = await api.get('/admin/applications');
      setStats((prev) => ({
        ...prev,
        totalApplications: allapplications?.count,
      }));

      const alljobsresponse = await api.get('/admin/jobs');
      console.log(alljobsresponse.count);
      setStats((prev) => ({
        ...prev,
        totalJobs: alljobsresponse?.count,
      }));

      // Fetch pending verifications
      const verificationsResponse = await api.get(
        '/admin/pendingverifications?limit=5'
      );
      setPendingVerifications(verificationsResponse.students);
      setStats((prev) => ({
        ...prev,
        pendingVerifications: verificationsResponse?.count,
      }));

      // Fetch top recruiters
      const recruitersResponse = await api.get('/admin/recruiters?limit=5');
      setTopRecruiters(recruitersResponse?.recruiters);
      setStats((prev) => ({
        ...prev,
        totalRecruiters: recruitersResponse?.count,
      }));

      // Fetch placement stats
      //const placementResponse = await api.get('/admin/placement-stats');
      //setPlacementStats(placementResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: GraduationCap,
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-100',
      link: '/admin/students',
    },
    {
      title: 'Total Recruiters',
      value: stats.totalRecruiters,
      icon: Building,
      color: 'orange',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-100',
      link: '#',
    },
    {
      title: 'Total Jobs',
      value: stats.totalJobs,
      icon: Briefcase,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-100',
      link: '/admin/jobs',
    },
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      icon: FileText,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-100',
      link: '/admin/applications',
    },
    {
      title: 'Pending Verifications',
      value: stats.pendingVerifications || 0,
      icon: AlertCircle,
      color: 'red',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      borderColor: 'border-red-100',
      link: '/admin/students',
    },
    {
      title: 'Students Placed',
      value: stats.placedStudents,
      icon: CheckCircle,
      color: 'teal',
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
      borderColor: 'border-teal-100',
      link: '#',
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'registration':
        return <UserCheck className="w-4 h-4 text-blue-600" />;
      case 'job_posted':
        return <Briefcase className="w-4 h-4 text-orange-600" />;
      case 'application':
        return <FileText className="w-4 h-4 text-purple-600" />;
      case 'placement':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleQuickVerify = async (userId, action) => {
    navigate('/admin/students');
  };

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
              Here's an overview of the HireStream platform.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Link
                  key={index}
                  to={stat.link}
                  className={`bg-white rounded-xl shadow-sm border ${stat.borderColor} p-6 hover:shadow-md transition-all group`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}
                    >
                      <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                    </div>
                    <TrendingUp className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </Link>
              );
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Pending Verifications */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">
                    Pending Verifications
                  </h2>
                  <Link
                    to="/admin/students"
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                  >
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {pendingVerifications == null ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">All users verified!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingVerifications?.map((verification) => (
                      <div
                        key={verification._id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-200 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 font-semibold">
                              {verification.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              {verification.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {verification.email}
                            </p>
                            <span
                              className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                                verification.role === 'student'
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-orange-100 text-orange-700'
                              }`}
                            >
                              {verification.role.charAt(0).toUpperCase() +
                                verification.role.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleQuickVerify(verification._id, true)
                            }
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() =>
                              handleQuickVerify(verification._id, false)
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <AlertCircle className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Top Recruiters */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-800">
                    Top Recruiters
                  </h2>
                </div>

                {topRecruiters.length === 0 ? (
                  <div className="text-center py-8">
                    <Building className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No recruiters yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {topRecruiters.map((recruiter, index) => (
                      <div
                        key={recruiter._id}
                        className="flex items-center gap-3"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-orange-600">
                            #{index + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800">
                            {recruiter.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {recruiter.company}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-purple-600">
                            {recruiter.jobsPosted}
                          </p>
                          <p className="text-xs text-gray-500">jobs</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Link
                    to="/admin/students"
                    className="block w-full py-3 px-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-center font-medium transition-colors"
                  >
                    View students
                  </Link>
                  <Link
                    to="/admin/jobs"
                    className="w-full py-3 px-4 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg text-center font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    View jobs
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
