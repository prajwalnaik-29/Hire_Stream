import { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  X,
  Calendar,
  Building,
  MapPin,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import api from '../../utils/api.js';

const Applications = () => {
  const [applications, setApplications] = useState(null);
  const [filteredApplications, setFilteredApplications] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [searchQuery, statusFilter, applications]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/applications');
      console.log(response);
      setApplications(response.applications);
      setFilteredApplications(response.applications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered;
    if (applications != null) {
      filtered = [...applications];
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (app) =>
          app.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.company?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  };

  const downloadCSV = () => {
    // Determine which applications to export
    const dataToExport =
      statusFilter === 'all' ? applications : filteredApplications;

    if (dataToExport.length === 0) {
      alert('No applications to download');
      return;
    }

    // CSV Headers
    const headers = [
      'Job Title',
      'Company',
      'Location',
      'Applied Date',
      'Status',
    ];

    // CSV Rows
    const rows = dataToExport.map((app) => [
      app.jobTitle,
      app.company,
      app.location || 'N/A',
      new Date(app.appliedDate).toLocaleDateString(),
      app.status.charAt(0).toUpperCase() + app.status.slice(1),
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    const fileName =
      statusFilter === 'all'
        ? 'all_applications.csv'
        : `${statusFilter}_applications.csv`;

    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openModal = (application) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedApplication(null);
    setShowModal(false);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      applied: {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        border: 'border-blue-200',
        icon: <Clock className="w-4 h-4" />,
      },
      pending: {
        bg: 'bg-orange-100',
        text: 'text-orange-700',
        border: 'border-orange-200',
        icon: <AlertCircle className="w-4 h-4" />,
      },
      shortlisted: {
        bg: 'bg-purple-100',
        text: 'text-purple-700',
        border: 'border-purple-200',
        icon: <CheckCircle className="w-4 h-4" />,
      },
      accepted: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        border: 'border-green-200',
        icon: <CheckCircle className="w-4 h-4" />,
      },
      rejected: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        border: 'border-red-200',
        icon: <XCircle className="w-4 h-4" />,
      },
    };

    const config = statusConfig[status] || statusConfig.applied;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${config.bg} ${config.text} ${config.border}`}
      >
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading Applications...</p>
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
              All Applications
            </h1>
            <p className="text-gray-600">
              Tracking and managing all students applications
            </p>
          </div>

          {/* Filters and Download Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Applications
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    placeholder="Search by job title or company..."
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Status
                </label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="applied">Applied</option>
                    <option value="pending">Pending</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Download CSV */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Export Applications
                </label>
                <button
                  onClick={downloadCSV}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-orange-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  <Download className="w-5 h-5" />
                  Download{' '}
                  {statusFilter === 'all'
                    ? 'All'
                    : statusFilter.charAt(0).toUpperCase() +
                      statusFilter.slice(1)}{' '}
                  CSV
                </button>
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Total</p>
              <p className="text-2xl font-bold text-gray-800">
                {applications?.length || 0}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-purple-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Shortlisted</p>
              <p className="text-2xl font-bold text-purple-600">
                {applications?.filter((a) => a.status === 'shortlisted').length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Pending</p>
              <p className="text-2xl font-bold text-orange-600">
                {applications?.filter((a) => a.status === 'pending').length ||
                  0}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-green-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Accepted</p>
              <p className="text-2xl font-bold text-green-600">
                {applications?.filter((a) => a.status === 'accepted').length ||
                  0}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-red-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Rejected</p>
              <p className="text-2xl font-bold text-red-600">
                {applications?.filter((a) => a.status === 'rejected').length ||
                  0}
              </p>
            </div>
          </div>

          {/* Applications List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">
                {filteredApplications?.length} Application
                {filteredApplications?.length !== 1 ? 's' : ''}
              </h2>
            </div>

            {filteredApplications == null ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No applications found</p>
                <p className="text-sm text-gray-400">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredApplications?.map((application) => (
                  <div
                    key={application._id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Briefcase className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {application.title}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Building className="w-4 h-4 text-gray-400" />
                              <span>{application.company}</span>
                            </div>
                            {application.location && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span>{application.location}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span>
                                Applied:{' '}
                                {new Date(
                                  application.appliedAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          {getStatusBadge(application.status)}
                        </div>
                      </div>

                      <button
                        onClick={() => openModal(application)}
                        className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Application Detail Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-800">
                Application Details
              </h2>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Job Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Job Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Job Title</p>
                    <p className="text-base font-medium text-gray-800">
                      {selectedApplication.title}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Company</p>
                    <p className="text-base font-medium text-gray-800">
                      {selectedApplication.company}
                    </p>
                  </div>
                  {selectedApplication.location && (
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="text-base font-medium text-gray-800">
                        {selectedApplication.location}
                      </p>
                    </div>
                  )}
                  {selectedApplication.salary && (
                    <div>
                      <p className="text-sm text-gray-500">Salary</p>
                      <p className="text-base font-medium text-gray-800">
                        {selectedApplication.salary}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Application Status */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Application Status
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Current Status</p>
                    {getStatusBadge(selectedApplication.status)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Applied Date</p>
                    <p className="text-base font-medium text-gray-800">
                      {new Date(
                        selectedApplication.appliedAt
                      ).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  {selectedApplication.updatedAt && (
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p className="text-base font-medium text-gray-800">
                        {new Date(
                          selectedApplication.updatedAt
                        ).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Info */}
              {selectedApplication.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Notes
                  </h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                    {selectedApplication.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeModal}
                className="w-full py-3 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
