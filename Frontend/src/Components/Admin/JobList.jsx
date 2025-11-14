import { useState, useEffect } from 'react';
import {
  Briefcase,
  Search,
  Building,
  MapPin,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  X,
} from 'lucide-react';

import api from '../../utils/api.js';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [verifyingJob, setVerifyingJob] = useState({});
  const [modal, setmodal] = useState(false);
  const [info, setinfo] = useState({});

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [searchQuery, jobs]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/jobs');
      setJobs(response.jobs);
      setFilteredJobs(response.jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = [...jobs];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (job) =>
          job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  };

  const handleVerifyJob = async (jobId, newstatus) => {
    let status;
    if (newstatus === 'verified') {
      status = true;
    } else {
      status = false;
    }
    setVerifyingJob((prev) => ({ ...prev, [jobId]: status }));

    try {
      await api.put(`/admin/jobs/verify`, { isVerified: status, jobId });

      // Update local state
      setJobs(
        jobs.map((job) =>
          job._id === jobId ? { ...job, isVerified: status } : job
        )
      );
    } catch (error) {
      console.error('Error verifying job:', error);
      alert('Failed to verify job');
    } finally {
      setVerifyingJob((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading Jobs...</p>
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
              Jobs Management
            </h1>
            <p className="text-gray-600">View and verify all job postings</p>
          </div>

          {/* Search Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Jobs
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  placeholder="Search by job title, company, or location..."
                />
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-800">{jobs.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-green-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Verified</p>
              <p className="text-2xl font-bold text-green-600">
                {jobs.filter((j) => j.isVerified).length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Pending</p>
              <p className="text-2xl font-bold text-orange-600">
                {jobs.filter((j) => !j.isVerified).length}
              </p>
            </div>
          </div>

          {/* Jobs List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">
                {filteredJobs.length} Job{filteredJobs.length !== 1 ? 's' : ''}
              </h2>
            </div>

            {/* Jobs Cards */}
            {filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No jobs found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredJobs.map((job) => (
                  <div
                    key={job._id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Job Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Briefcase className="w-7 h-7 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                              {job.title}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Building className="w-4 h-4 text-gray-400" />
                                <span>{job.company}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span>{job.location}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <DollarSign className="w-4 h-4 text-gray-400" />
                                <span>{job.salary}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span>
                                  Posted:{' '}
                                  {new Date(job.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
                                {job.jobType}
                              </span>
                              <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-200">
                                {job.workMode}
                              </span>
                              {job.experience && (
                                <span className="px-3 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded-full border border-gray-200">
                                  {job.experience}
                                </span>
                              )}
                            </div>

                            {job.postedBy && (
                              <p className="text-xs text-gray-500 mt-2">
                                Posted by:{' '}
                                <span className="font-medium">
                                  {job.postedBy.name || 'Recruiter'}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col items-start lg:items-end gap-3">
                        <select
                          value={job?.isVerified ? 'verified' : 'unverified'}
                          onChange={(e) =>
                            handleVerifyJob(job._id, e.target.value)
                          }
                          disabled={verifyingJob[job._id]}
                          className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all outline-none cursor-pointer ${
                            job.isVerified
                              ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                              : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                          } ${
                            verifyingJob[job._id]
                              ? 'opacity-50 cursor-not-allowed'
                              : ''
                          }`}
                        >
                          <option value="verified">✓ Verified</option>
                          <option value="unverified">✗ Unverified</option>
                        </select>

                        {/* View Details Link */}
                        <button
                          onClick={() => (setinfo(job), setmodal(true))}
                          className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                        </button>
                      </div>
                    </div>

                    {/* Job Description Preview */}
                    {job.description && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {job.description}
                        </p>
                      </div>
                    )}

                    {/* Skills */}
                    {job.skills && job.skills.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="text-xs text-gray-500 font-medium">
                          Skills:
                        </span>
                        {job.skills.slice(0, 5).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded border border-gray-200"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 5 && (
                          <span className="px-2 py-1 text-gray-500 text-xs">
                            +{job.skills.length - 5} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative overflow-y-auto max-h-[85vh] no-scrollbar">
            {/* Close button */}
            <button
              onClick={() => setmodal(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors"
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

export default JobList;
