import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Award,
  Briefcase,
  FileText,
  ExternalLink,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Building,
  Code,
  Target,
} from 'lucide-react';
import api from '../../utils/api.js';

const CandidateDetail = () => {
  const { id } = useParams(); // Student/Candidate ID
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState(null);
  const [applications, setApplications] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCandidateDetails();
  }, [id]);

  const fetchCandidateDetails = async () => {
    try {
      setLoading(true);
      // Fetch candidate/student details and application info
      const response = await api.get(`/recruiter/candidates/${id}`);
      console.log(response);
      setCandidate(response?.candidate);
      setApplications(response?.applications);
    } catch (error) {
      console.error('Error fetching candidate details:', error);
      setError('Failed to load candidate details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    setUpdatingStatus(true);
    try {
      await api.put(`/recruiter/applications/${applicationId}/status`, {
        status: newStatus,
      });

      // ✅ Update local state safely for that application
      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      if (newStatus === 'shortlisted') {
        setShowInterviewModal(true);
      } else {
        alert(`Candidate status updated to ${newStatus}!`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      applied: 'bg-blue-100 text-blue-700 border-blue-200',
      pending: 'bg-orange-100 text-orange-700 border-orange-200',
      shortlisted: 'bg-purple-100 text-purple-700 border-purple-200',
      accepted: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[status] || colors.pending;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">
              Loading Candidate Details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600 font-medium mb-4">
              {error || 'Candidate not found'}
            </p>
            <Link
              to="/recruiter/candidates"
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Candidates
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link
            to="/recruiter/candidates"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Candidates</span>
          </Link>

          {/* Candidate Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-4xl font-bold text-orange-600">
                  {candidate.name?.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                      {candidate.name}
                    </h1>
                    <p className="text-lg text-gray-600 mb-3">
                      {candidate.degree} in{' '}
                      {candidate.branch || candidate.department}
                    </p>
                  </div>

                  {/* Resume Download */}
                  {candidate.resume && (
                    <a
                      href={candidate.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download Resume
                    </a>
                  )}
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a
                      href={`mailto:${candidate.email}`}
                      className="hover:text-orange-600"
                    >
                      {candidate.email}
                    </a>
                  </div>
                  {candidate.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <a
                        href={`tel:${candidate.phone}`}
                        className="hover:text-orange-600"
                      >
                        {candidate.phone}
                      </a>
                    </div>
                  )}
                  {candidate.location && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{candidate.location}</span>
                    </div>
                  )}
                  {candidate.dateOfBirth && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>
                        {new Date(candidate.dateOfBirth).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Detailed Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Bio */}
              {candidate.bio && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-orange-600" />
                    About
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {candidate.bio}
                  </p>
                </div>
              )}

              {/* Education */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-orange-600" />
                  Education
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {candidate.degree}
                      </h3>
                      <p className="text-gray-600">
                        {candidate.branch || candidate.department}
                      </p>
                      <p className="text-sm text-gray-500">
                        {candidate.college}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-gray-600">
                          <span className="font-medium">Roll No:</span>{' '}
                          {candidate.rollNumber}
                        </span>
                        <span className="text-sm text-gray-600">
                          <span className="font-medium">Year:</span>{' '}
                          {candidate.year}
                        </span>
                        {candidate.cgpa && (
                          <span className="text-sm text-gray-600">
                            <span className="font-medium">CGPA:</span>{' '}
                            {candidate.cgpa}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills */}
              {candidate.skills && candidate.skills.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Code className="w-5 h-5 text-orange-600" />
                    Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-orange-50 text-orange-700 font-medium rounded-lg border border-orange-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Details */}
              {candidate.address && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-600" />
                    Address
                  </h2>
                  <p className="text-gray-700">{candidate.address}</p>
                </div>
              )}

              {/* Social Links */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Links</h2>
                <div className="space-y-3">
                  {candidate.linkedin && (
                    <a
                      href={candidate.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                    >
                      <span className="text-blue-700 font-medium">
                        LinkedIn
                      </span>
                      <ExternalLink className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                    </a>
                  )}
                  {candidate.github && (
                    <a
                      href={candidate.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors group"
                    >
                      <span className="text-gray-700 font-medium">GitHub</span>
                      <ExternalLink className="w-4 h-4 text-gray-600 group-hover:translate-x-1 transition-transform" />
                    </a>
                  )}
                  {candidate.portfolio && (
                    <a
                      href={candidate.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
                    >
                      <span className="text-purple-700 font-medium">
                        Portfolio
                      </span>
                      <ExternalLink className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
                    </a>
                  )}
                </div>
              </div>

              {/* Verification Status */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  Verification
                </h2>
                <div className="flex items-center gap-2">
                  {candidate.isVerified ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-700 font-medium">
                        Verified Student
                      </span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-5 h-5 text-orange-600" />
                      <span className="text-orange-700 font-medium">
                        Not Verified
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Actions & Links */}
            <div className="lg:col-span-1 space-y-6">
              {/* Application Info */}

              {applications.length > 0 && (
                <div className="space-y-6">
                  {applications.map((app) => (
                    <div
                      key={app._id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    >
                      <h2 className="text-lg font-bold text-gray-800 mb-4">
                        Application Info
                      </h2>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            Applied For
                          </p>
                          <p className="text-sm font-medium text-gray-800">
                            {app.job?.title || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            Applied Date
                          </p>
                          <p className="text-sm font-medium text-gray-800">
                            {new Date(app.appliedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            Current Status
                          </p>
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${getStatusColor(
                              app.status
                            )}`}
                          >
                            {app.status.charAt(0).toUpperCase() +
                              app.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      {/* Update Buttons */}
                      <div className="mt-5 space-y-3">
                        <button
                          onClick={() =>
                            handleStatusChange(app._id, 'shortlisted')
                          }
                          disabled={
                            updatingStatus || app.status === 'shortlisted'
                          }
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <CheckCircle className="w-4 h-4" />
                          {app.status === 'shortlisted'
                            ? 'Shortlisted'
                            : 'Shortlist'}
                        </button>

                        <button
                          onClick={() =>
                            handleStatusChange(app._id, 'accepted')
                          }
                          disabled={updatingStatus || app.status === 'accepted'}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <CheckCircle className="w-4 h-4" />
                          {app.status === 'accepted' ? 'Accepted' : 'Accept'}
                        </button>

                        <button
                          onClick={() =>
                            handleStatusChange(app._id, 'rejected')
                          }
                          disabled={updatingStatus || app.status === 'rejected'}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <XCircle className="w-4 h-4" />
                          {app.status === 'rejected' ? 'Rejected' : 'Reject'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Interview Scheduling Modal */}
      {showInterviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Candidate Shortlisted!
              </h2>
              <p className="text-gray-600 mb-6">
                {candidate.name} has been shortlisted. Would you like to
                schedule an interview?
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowInterviewModal(false);
                    navigate('/recruiter/interviews');
                  }}
                  className="w-full py-3 px-4 bg-gradient-to-r from-orange-600 to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  Go to Interview Scheduling
                </button>
                <button
                  onClick={() => setShowInterviewModal(false)}
                  className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateDetail;
