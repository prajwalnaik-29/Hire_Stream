import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Calendar,
  FileText,
} from 'lucide-react';
import api from '../../utils/api.js';

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [jobFilter, setJobFilter] = useState('all');
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterCandidates();
  }, [searchQuery, statusFilter, jobFilter, candidates]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch all applications/candidates
      const candidatesResponse = await api.get('/recruiter/applications');
      console.log(candidatesResponse);
      setCandidates(candidatesResponse.applications);
      setFilteredCandidates(candidatesResponse.applications);

      // Fetch jobs for filter dropdown
      const jobsResponse = await api.get('/recruiter/jobs');
      setJobs(jobsResponse.jobs);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCandidates = () => {
    let filtered = [...candidates];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (candidate) =>
          candidate.candidateName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          candidate.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          candidate.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(
        (candidate) => candidate.status === statusFilter
      );
    }

    // Job filter
    if (jobFilter !== 'all') {
      filtered = filtered.filter((candidate) => candidate.jobId === jobFilter);
    }

    setFilteredCandidates(filtered);
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      await api.put(`/recruiter/applications/${applicationId}`, {
        status: newStatus,
      });

      // Update local state
      setCandidates(
        candidates.map((candidate) =>
          candidate._id === applicationId
            ? { ...candidate, status: newStatus }
            : candidate
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: {
        bg: 'bg-orange-100',
        text: 'text-orange-700',
        border: 'border-orange-200',
      },
      shortlisted: {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        border: 'border-blue-200',
      },
      interviewing: {
        bg: 'bg-purple-100',
        text: 'text-purple-700',
        border: 'border-purple-200',
      },
      selected: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        border: 'border-green-200',
      },
      rejected: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        border: 'border-red-200',
      },
    };

    const style = statusStyles[status] || statusStyles.pending;

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-600" />;
      case 'shortlisted':
      case 'interviewing':
        return <Eye className="w-4 h-4 text-blue-600" />;
      case 'selected':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading Candidates...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Candidates
            </h1>
            <p className="text-gray-600">
              Manage and review all job applications
            </p>
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Candidates
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    placeholder="Search by name, email, job..."
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="interviewing">Interviewing</option>
                    <option value="selected">Selected</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Job Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Position
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={jobFilter}
                    onChange={(e) => setJobFilter(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
                  >
                    <option value="all">All Jobs</option>
                    {jobs.map((job) => (
                      <option key={job._id} value={job._id}>
                        {job.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Total</p>
              <p className="text-2xl font-bold text-gray-800">
                {candidates.length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Pending</p>
              <p className="text-2xl font-bold text-orange-600">
                {candidates.filter((c) => c.status === 'pending').length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Shortlisted</p>
              <p className="text-2xl font-bold text-blue-600">
                {candidates.filter((c) => c.status === 'shortlisted').length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-green-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Selected</p>
              <p className="text-2xl font-bold text-green-600">
                {candidates.filter((c) => c.status === 'selected').length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-red-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Rejected</p>
              <p className="text-2xl font-bold text-red-600">
                {candidates.filter((c) => c.status === 'rejected').length}
              </p>
            </div>
          </div>

          {/* Candidates List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">
                {filteredCandidates.length} Candidate
                {filteredCandidates.length !== 1 ? 's' : ''}
              </h2>
              <button className="flex items-center gap-2 px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors font-medium">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>

            {/* Candidates Table */}
            {filteredCandidates == null ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No candidates found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Candidate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Job Applied
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Applied On
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCandidates?.map((candidate) => (
                      <tr
                        key={candidate._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-purple-600 font-semibold text-sm">
                                {candidate.name?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">
                                {candidate.name}
                              </p>
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {candidate.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-800">
                              {candidate.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {candidate.company}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {new Date(candidate.appliedAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(candidate.status)}
                            {getStatusBadge(candidate.status)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/recruiter/candidates/${candidate.studentId}`}
                              className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <a
                              href={candidate.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="View Resume"
                            >
                              <FileText className="w-4 h-4" />
                            </a>

                            {/* Quick Action Buttons */}
                            {candidate.status === 'pending' && (
                              <button
                                onClick={() =>
                                  updateApplicationStatus(
                                    candidate._id,
                                    'shortlisted'
                                  )
                                }
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Shortlist"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            {(candidate.status === 'pending' ||
                              candidate.status === 'shortlisted') && (
                              <button
                                onClick={() =>
                                  updateApplicationStatus(
                                    candidate.studentId,
                                    'rejected'
                                  )
                                }
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Candidates;
