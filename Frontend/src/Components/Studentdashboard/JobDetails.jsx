import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Briefcase,
  Building,
  MapPin,
  DollarSign,
  Clock,
  Calendar,
  Users,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  FileText,
  Award,
  Target,
  X,
} from 'lucide-react';
import { useAuth } from '../../Context/AuthContext.jsx';
import api from '../../utils/api';
import { MdOutlineRunningWithErrors } from 'react-icons/md';
import { RiUserUnfollowFill } from 'react-icons/ri';
import { MdFileDownloadDone } from 'react-icons/md';

const JobDetails = () => {
  const { id } = useParams(); // Get job ID from URL
  const navigate = useNavigate();
  const { user } = useAuth();
  const [modal, setmodal] = useState(false);
  const [info, setinfo] = useState({
    route1: '',
    color: '',
    icon: '',
    indicate: '',
    message: '',
    button1: '',
  });

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [error, setError] = useState('');

  console.log(user);

  useEffect(() => {
    fetchJobDetails();
    checkApplicationStatus();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/student/jobs/${id}`);
      setJob(response.jobs);
    } catch (error) {
      console.error('Error fetching job details:', error);
      setError('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const response = await api.get(`/applications/${id}`);
      setHasApplied(response?.status);
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  const checkProfileCompletion = async () => {
    try {
      const response = await api.get(`/student/profile`);

      let data = response.data;
      let isthere = data.hasOwnProperty('resume');
      console.log(isthere);
      if (isthere) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error checking profile:', error);
      return false; // or handle differently if API fails
    }
  };

  const handleApplyNow = async (e) => {
    e.preventDefault();

    // Check 1: Is profile complete?
    if (checkProfileCompletion()) {
      setinfo((prev) => ({
        ...prev,
        icon: RiUserUnfollowFill,
        indicate: 'Profile Incomplete!',
        color: 'yellow',
        message:
          'Your profile is incomplete. Please complete your profile before applying. Go to profile page? click below',
        button1: 'Go to profile',
        route1: '/student/profile',
      }));

      setmodal(true);
      return;
    }

    // Check 2: Is user verified?
    if (!user?.isVerified) {
      setinfo((prev) => ({
        ...prev,
        icon: MdOutlineRunningWithErrors,
        indicate: 'Not Verified!',
        color: 'red',
        message:
          'Your account is not verified yet. Please wait for admin approval before applying for jobs.you cant apply for job without admin approval!',
        button1: 'Browse jobs',
        route1: '/student/jobs',
      }));

      setmodal(true);
      return;
    }

    // Check 3: Has already applied?
    if (hasApplied) {
      alert('You have already applied for this job!');
      return;
    }

    // Proceed with application
    try {
      setApplying(true);
      await api.post('/applications/apply', {
        jobId: id,
        jobTitle: job.title,
        company: job.company,
        resume: user?.resume,
      });

      setinfo((prev) => ({
        ...prev,
        icon: MdFileDownloadDone,
        color: 'green',
        message: 'Application submitted successfully!',
        indicate: 'Successfully Applied for Job',
        button1: 'Track Application',
        route1: '/student/applications',
      }));

      setmodal(true);
      setHasApplied(true);
    } catch (error) {
      console.error('Error applying for job:', error);
      alert(error.message || 'Failed to apply for job');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading Job Details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600 font-medium mb-4">
              {error || 'Job not found'}
            </p>
            <Link
              to="/student/jobs"
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isDeadlinePassed = new Date(job.lastDate) < new Date();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link
            to="/student/jobs"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Jobs</span>
          </Link>

          {/* Job Header Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-10 h-10 text-purple-600" />
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-3">
                  {job.title}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">{job.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span>
                      Apply by: {new Date(job.lastDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-200">
                    {job.jobType}
                  </span>
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 text-sm font-medium rounded-full border border-purple-200">
                    {job.workMode}
                  </span>
                  {job.experience && (
                    <span className="px-3 py-1 bg-orange-50 text-orange-700 text-sm font-medium rounded-full border border-orange-200">
                      {job.experience}
                    </span>
                  )}
                  {job.openings && (
                    <span className="px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full border border-green-200 flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {job.openings} Openings
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Description */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-800">
                    Job Description
                  </h2>
                </div>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {job.description}
                </p>
              </div>

              {/* Requirements */}
              {job.requirements && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                    <h2 className="text-xl font-bold text-gray-800">
                      Requirements
                    </h2>
                  </div>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {job.requirements}
                  </p>
                </div>
              )}

              {/* Required Skills */}
              {job.skills && job.skills.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="w-5 h-5 text-purple-600" />
                    <h2 className="text-xl font-bold text-gray-800">
                      Required Skills
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-purple-50 text-purple-700 font-medium rounded-lg border border-purple-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Apply Button Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
                {hasApplied ? (
                  <div className="text-center">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <p className="text-green-700 font-semibold mb-2">
                      Already Applied
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      You have already applied for this position
                    </p>
                    <Link
                      to="/student/applications"
                      className="block w-full py-3 px-4 bg-green-50 text-green-700 font-semibold rounded-lg hover:bg-green-100 transition-colors"
                    >
                      View Application Status
                    </Link>
                  </div>
                ) : isDeadlinePassed ? (
                  <div className="text-center">
                    <Clock className="w-12 h-12 text-red-600 mx-auto mb-3" />
                    <p className="text-red-700 font-semibold mb-2">
                      Deadline Passed
                    </p>
                    <p className="text-sm text-gray-600">
                      Applications are no longer accepted for this job
                    </p>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleApplyNow}
                      disabled={applying}
                      className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-orange-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mb-4"
                    >
                      {applying ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Applying...
                        </span>
                      ) : (
                        'Apply Now'
                      )}
                    </button>

                    {/* Warning Messages */}
                    {!user?.isVerified && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-yellow-700">
                          Your account is not verified yet. Please wait for
                          admin approval.
                        </p>
                      </div>
                    )}

                    {checkProfileCompletion() && (
                      <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-2 mt-3">
                        <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-orange-700 mb-2">
                            Complete your profile to apply
                          </p>
                          <Link
                            to="/student/profile"
                            className="text-xs text-orange-600 hover:text-orange-700 font-semibold underline"
                          >
                            Go to Profile →
                          </Link>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Job Info Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Job Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Posted Date</p>
                    <p className="text-sm font-medium text-gray-800">
                      {new Date(job.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Application Deadline
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {new Date(job.lastDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  {job.duration && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Duration</p>
                      <p className="text-sm font-medium text-gray-800">
                        {job.duration}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative overflow-y-auto max-h-[90vh]">
            {/* Close button */}
            <button
              onClick={() => setmodal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
            >
              <X size={24} />
            </button>

            <div
              className={`flex mx-auto rounded-md bg-${info.color}-50 border-${info.color}-200 p-3 text-${info.color}-600 text-center border w-fit`}
            >
              <info.icon size={50} />
            </div>

            <p
              className={`text-2xl text-center text-${info.color}-500 mt-4 font-medium`}
            >
              {info?.indicate}
            </p>

            <p className="text-gray-600 text-base px-5 text-center mt-3">
              {info.message}
            </p>

            <div className="flex mt-5 justify-center text-base">
              <Link
                to={info.route1}
                className={`py-2 px-10 w-fit shadow-md rounded-xl shadow-${info.color}-500  hover:bg-${info.color}-100`}
              >
                {info.button1}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
