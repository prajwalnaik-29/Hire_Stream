import { useState, useEffect } from 'react';
import {
  Search,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Filter,
  X,
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const StudentJobs = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    jobType: '',
    location: '',
    salaryRange: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState(new Set());

  useEffect(() => {
    fetchJobs();
    fetchAppliedJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/student/jobs');
      setJobs(response?.jobs || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
      setLoading(false);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const response = await api.get('/applications/myapplication');
      console.log(response);
      const appliedJobIds = new Set(
        response?.applications?.map((app) => app?.jobId)
      );
      console.log(appliedJobIds);
      setAppliedJobs(appliedJobIds);
    } catch (error) {
      console.error('Error fetching applied jobs:', error);
    }
  };

  const handleApply = async (jobId) => {
    navigate(`/student/jobs/${jobId}`);
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = !filters.jobType || job.jobType === filters.jobType;
    const matchesLocation =
      !filters.location ||
      job.location?.toLowerCase().includes(filters.location.toLowerCase());

    return matchesSearch && matchesType && matchesLocation;
  });

  const clearFilters = () => {
    setFilters({
      jobType: '',
      location: '',
      salaryRange: '',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-purple-900 mb-2">
            Explore Opportunities
          </h1>
          <p className="text-gray-600">
            Find your dream job from {jobs.length} available positions
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by job title, company, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-purple-100 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Job Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                  </label>
                  <select
                    value={filters.jobType}
                    onChange={(e) =>
                      setFilters({ ...filters, jobType: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-purple-100 rounded-xl focus:outline-none focus:border-purple-500"
                  >
                    <option value="">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Enter location"
                    value={filters.location}
                    onChange={(e) =>
                      setFilters({ ...filters, location: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-purple-100 rounded-xl focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-orange-500 text-orange-600 rounded-xl hover:bg-orange-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing{' '}
            <span className="font-semibold text-purple-900">
              {filteredJobs.length}
            </span>{' '}
            jobs
          </p>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                {/* Job Card Header */}
                <div className="bg-gradient-to-r from-purple-600 to-orange-500 p-6">
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                    {job.title}
                  </h3>
                  <p className="text-purple-100 font-medium">{job.company}</p>
                </div>

                {/* Job Card Body */}
                <div className="p-6">
                  {/* Job Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      <span className="text-sm">
                        {job.location || 'Location not specified'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Briefcase className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">
                        {job.jobType || 'Full-time'}
                      </span>
                    </div>
                    {job.salary && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{job.salary}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Job Description */}
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                    {job.description}
                  </p>

                  {/* Apply Button */}
                  {appliedJobs.has(job._id) ? (
                    <button
                      disabled
                      className="w-full py-3 bg-gray-200 text-gray-500 rounded-xl font-semibold cursor-not-allowed"
                    >
                      Already Applied
                    </button>
                  ) : (
                    <button
                      onClick={(e) => (
                        e.preventDefault(), handleApply(job._id)
                      )}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-orange-600 transition-all transform hover:scale-105"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentJobs;
