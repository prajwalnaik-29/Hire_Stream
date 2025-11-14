import { useState, useEffect } from 'react';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  Briefcase,
  MapPin,
  Building2,
  TrendingUp,
  Filter,
  Download,
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const StudentApplications = () => {
  const [applications, setApplications] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications/myapplication');
      setApplications(response?.applications);
      console.log(response?.applications);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: 'orange',
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-700',
        borderColor: 'border-orange-300',
        icon: Clock,
        label: 'Pending',
      },
      reviewed: {
        color: 'blue',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-300',
        icon: Eye,
        label: 'Reviewed',
      },
      shortlisted: {
        color: 'purple',
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-700',
        borderColor: 'border-purple-300',
        icon: TrendingUp,
        label: 'Shortlisted',
      },
      accepted: {
        color: 'green',
        bgColor: 'bg-green-100',
        textColor: 'text-green-700',
        borderColor: 'border-green-300',
        icon: CheckCircle,
        label: 'Accepted',
      },
      rejected: {
        color: 'red',
        bgColor: 'bg-red-100',
        textColor: 'text-red-700',
        borderColor: 'border-red-300',
        icon: XCircle,
        label: 'Rejected',
      },
    };
    return configs[status?.toLowerCase()] || configs.pending;
  };

  const filteredApplications = applications?.filter((app) => {
    if (filterStatus === 'all') return true;
    return app.status?.toLowerCase() === filterStatus;
  });

  const statusCounts = {
    all: applications?.length,
    pending: applications?.filter((a) => a.status?.toLowerCase() === 'pending')
      .length,
    reviewed: applications?.filter(
      (a) => a.status?.toLowerCase() === 'reviewed'
    ).length,
    shortlisted: applications?.filter(
      (a) => a.status?.toLowerCase() === 'shortlisted'
    ).length,
    accepted: applications?.filter(
      (a) => a.status?.toLowerCase() === 'accepted'
    ).length,
    rejected: applications?.filter(
      (a) => a.status?.toLowerCase() === 'rejected'
    ).length,
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  const exportApplications = () => {
    const csv = [
      ['Job Title', 'Company', 'Applied Date', 'Status'],
      ...filteredApplications?.map((app) => [
        app.job?.title || 'N/A',
        app.job?.company || 'N/A',
        new Date(app.appliedAt).toLocaleDateString(),
        app.status || 'Pending',
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my-applications-${
      new Date().toISOString().split('T')[0]
    }.csv`;
    a.click();
    toast.success('Applications exported successfully!');
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
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-purple-900 mb-2">
              My Applications
            </h1>
            <p className="text-gray-600">
              Track and manage your job applications
            </p>
          </div>
          <button
            onClick={exportApplications}
            className="mt-4 md:mt-0 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-xl hover:from-purple-700 hover:to-orange-600 transition-all"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { key: 'all', label: 'Total', color: 'purple' },
            { key: 'pending', label: 'Pending', color: 'orange' },
            { key: 'reviewed', label: 'Reviewed', color: 'blue' },
            { key: 'shortlisted', label: 'Shortlisted', color: 'purple' },
            { key: 'accepted', label: 'Accepted', color: 'green' },
            { key: 'rejected', label: 'Rejected', color: 'red' },
          ].map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => setFilterStatus(key)}
              className={`p-4 rounded-xl transition-all ${
                filterStatus === key
                  ? `bg-${color}-600 text-white shadow-lg scale-105`
                  : 'bg-white text-gray-700 hover:shadow-md'
              }`}
            >
              <div className="text-2xl font-bold">{statusCounts[key]}</div>
              <div className="text-sm mt-1">{label}</div>
            </button>
          ))}
        </div>

        {/* Applications List */}
        {filteredApplications == null ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No applications found
            </h3>
            <p className="text-gray-500 mb-6">
              {filterStatus === 'all'
                ? "You haven't applied to any jobs yet. Start exploring opportunities!"
                : `No ${filterStatus} applications at the moment.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications?.map((application) => {
              const statusConfig = getStatusConfig(application.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={application._id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Left Section - Job Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          {/* Company Logo Placeholder */}
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-8 h-8 text-white" />
                          </div>

                          {/* Job Details */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {application.job?.title ||
                                'Job Title Not Available'}
                            </h3>
                            <p className="text-purple-600 font-medium mb-3">
                              {application.job?.company ||
                                'Company Not Available'}
                            </p>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-orange-500" />
                                {application.job?.location || 'Location N/A'}
                              </div>
                              <div className="flex items-center gap-1">
                                <Briefcase className="w-4 h-4 text-purple-500" />
                                {application.job?.jobType || 'Full-time'}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4 text-blue-500" />
                                Applied{' '}
                                {new Date(
                                  application.appliedAt
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Status and Action */}
                      <div className="flex flex-col items-end gap-3">
                        {/* Status Badge */}
                        <div
                          className={`flex items-center gap-2 px-4 py-2 ${statusConfig.bgColor} ${statusConfig.textColor} rounded-xl border-2 ${statusConfig.borderColor}`}
                        >
                          <StatusIcon className="w-5 h-5" />
                          <span className="font-semibold">
                            {statusConfig.label}
                          </span>
                        </div>

                        {/* View Details Button */}
                        <button
                          onClick={() => handleViewDetails(application)}
                          className="px-6 py-2 border-2 border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50 transition-colors font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal for Application Details */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto no-scrollbar">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-orange-500 p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {selectedApplication.job?.title}
                  </h2>
                  <p className="text-purple-100">
                    {selectedApplication.job?.company}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2">
                  APPLICATION STATUS
                </h3>
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 ${
                    getStatusConfig(selectedApplication.status).bgColor
                  } ${
                    getStatusConfig(selectedApplication.status).textColor
                  } rounded-xl`}
                >
                  {(() => {
                    const StatusIcon = getStatusConfig(
                      selectedApplication.status
                    ).icon;
                    return <StatusIcon className="w-5 h-5" />;
                  })()}
                  <span className="font-semibold">
                    {getStatusConfig(selectedApplication.status).label}
                  </span>
                </div>
              </div>

              {/* Job Details */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2">
                  JOB DETAILS
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    <span>{selectedApplication.job?.location || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Briefcase className="w-4 h-4 text-purple-500" />
                    <span>
                      {selectedApplication.job?.jobType || 'Full-time'}
                    </span>
                  </div>
                  {selectedApplication.job?.salary && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="font-semibold">Salary:</span>
                      <span>{selectedApplication.job.salary}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2">
                  JOB DESCRIPTION
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedApplication.job?.description ||
                    'No description available'}
                </p>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2">
                  APPLICATION TIMELINE
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span>
                      Applied on{' '}
                      {new Date(
                        selectedApplication.appliedAt
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  {selectedApplication.updatedAt && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="w-4 h-4 text-purple-500" />
                      <span>
                        Last updated{' '}
                        {new Date(
                          selectedApplication.updatedAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-orange-600 transition-all"
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

export default StudentApplications;
