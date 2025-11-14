import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  Calendar,
  FileText,
  TrendingUp,
  X,
  Eye,
  UserCheck,
  Clock,
  ArrowRight,
  MapPin,
  DollarSign,
} from 'lucide-react';
import { useAuth } from '../../Context/AuthContext.jsx';
import api from '../../utils/api.js';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [modal, setmodal] = useState(false);
  const [info, setinfo] = useState({});
  const [stats, setStats] = useState({
    totalApplications: 0,
    interviewsScheduled: 0,
  });
  const [activeJobs, setActiveJobs] = useState([]);
  const [totalJobs, settotalJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState(null);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log(recentApplications);
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch stats
      const statsResponse = await api.get('/recruiter/jobs');
      console.log(statsResponse);
      settotalJobs(statsResponse?.jobs || []);

      // Fetch active jobs
      const jobsResponse = await api.get('/recruiter/jobs/active');
      console.log(jobsResponse);
      setActiveJobs(jobsResponse?.activejobs || []);

      // Fetch recent applications
      const applicationsResponse = await api.get(
        '/recruiter/applications?limit=5'
      );
      console.log(applicationsResponse);
      setRecentApplications(applicationsResponse.applications);
      setStats((prev) => ({
        ...prev,
        totalApplications: applicationsResponse?.count,
      }));

      // Fetch upcoming interviews
      const interviewsResponse = await api.get('/recruiter/interviews?limit=4');
      setUpcomingInterviews(interviewsResponse.interviews);
      setStats((prev) => ({
        ...prev,
        interviewsScheduled: interviewsResponse?.count,
      }));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Jobs Posted',
      value: totalJobs.length || 0,
      icon: Briefcase,
      color: 'orange',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-100',
    },
    {
      title: 'Active Jobs',
      value: activeJobs.length || 0,
      icon: FileText,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-100',
    },
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      icon: Users,
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-100',
    },
    {
      title: 'Interviews Scheduled',
      value: stats.interviewsScheduled,
      icon: Calendar,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-100',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
              Here's an overview of your recruitment activities.
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
            {/* Active Jobs */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">
                    Active Job Postings
                  </h2>
                  <Link
                    to="/recruiter/postjobs"
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                  >
                    Post New Job
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {activeJobs.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No active jobs posted</p>
                    <Link
                      to="/recruiter/postjobs"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-purple-500 text-white font-medium rounded-lg hover:shadow-lg transition-shadow"
                    >
                      Post Your First Job
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeJobs.map((job) => (
                      <div
                        key={job._id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-orange-200 hover:shadow-sm transition-all"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {job.salary}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {job.applicantsCount || 0} applicants
                            </span>
                          </div>
                        </div>
                        <Link
                          onClick={() => (setmodal(true), setinfo(job))}
                          className="ml-4 px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors font-medium text-sm"
                        >
                          View Details
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Applications */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">
                    Recent Applications
                  </h2>
                  <Link
                    to="/recruiter/candidates"
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                  >
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {recentApplications == null ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No applications yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentApplications?.map((application) => (
                      <div
                        key={application._id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 font-semibold text-sm">
                              {application?.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">
                              {application.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {application.title}
                            </p>
                          </div>
                        </div>
                        <Link
                          to={`/recruiter/candidates/${application.studentId}`}
                          className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                        >
                          Review
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Upcoming Interviews & Quick Actions */}
            <div className="lg:col-span-1 space-y-6">
              {/* Upcoming Interviews */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Upcoming</h2>
                  <Link
                    to="/recruiter/interviews"
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                  >
                    See All
                  </Link>
                </div>

                {upcomingInterviews.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">
                      No interviews scheduled
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingInterviews.map((interview) => (
                      <div
                        key={interview._id}
                        className="p-4 border border-gray-200 rounded-lg hover:border-orange-200 transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-orange-600" />
                          <span className="text-sm font-medium text-gray-800">
                            {new Date(interview.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-gray-800 mb-1">
                          {interview.candidateName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {interview.jobTitle}
                        </p>
                        <p className="text-xs text-orange-600 mt-2">
                          {interview.time}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-orange-600 to-purple-500 rounded-xl shadow-sm p-6 text-white">
                <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    to="/recruiter/postjobs"
                    className="block w-full py-3 px-4 bg-white/20 hover:bg-white/30 rounded-lg text-center font-medium transition-colors"
                  >
                    Post a Job
                  </Link>
                  <Link
                    to="/recruiter/candidates"
                    className="block w-full py-3 px-4 bg-white/20 hover:bg-white/30 rounded-lg text-center font-medium transition-colors"
                  >
                    View Candidates
                  </Link>
                  <Link
                    to="/recruiter/interviews"
                    className="block w-full py-3 px-4 bg-white/20 hover:bg-white/30 rounded-lg text-center font-medium transition-colors"
                  >
                    Schedule Interview
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative overflow-y-auto max-h-[85vh] no-scrollbar">
            {/* Close button */}
            <button
              onClick={() => setmodal(false)}
              className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-orange-500 p-6 text-white">
              <h2 className="text-2xl font-bold mb-1 pr-8">{info?.title}</h2>
              <p className="text-purple-100 font-medium">{info?.company}</p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Job Info Grid */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 font-medium mb-1">Location</p>
                  <p className="text-gray-800">{info?.location}</p>
                </div>

                <div>
                  <p className="text-gray-500 font-medium mb-1">Job Type</p>
                  <p className="text-gray-800">{info?.jobType}</p>
                </div>

                <div>
                  <p className="text-gray-500 font-medium mb-1">Work Mode</p>
                  <p className="text-gray-800">{info?.workMode}</p>
                </div>

                <div>
                  <p className="text-gray-500 font-medium mb-1">Salary</p>
                  <p className="text-gray-800">{info?.salary}</p>
                </div>

                <div>
                  <p className="text-gray-500 font-medium mb-1">Experience</p>
                  <p className="text-gray-800">{info?.experience}</p>
                </div>

                <div>
                  <p className="text-gray-500 font-medium mb-1">Openings</p>
                  <p className="text-gray-800">{info?.openings}</p>
                </div>

                <div>
                  <p className="text-gray-500 font-medium mb-1">Last Date</p>
                  <p className="text-gray-800">
                    {new Date(info?.lastDate).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 font-medium mb-1">Posted By</p>
                  <p className="text-gray-800">
                    {info?.postedBy?.name || 'N/A'}
                  </p>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Skills */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 text-sm">
                  Skills Required
                </h3>
                <div className="flex flex-wrap gap-2">
                  {info?.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2 text-sm">
                  Description
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {info?.description}
                </p>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2 text-sm">
                  Requirements
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {info?.requirements}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
