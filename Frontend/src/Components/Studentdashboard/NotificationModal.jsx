import { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  Video,
  MapPin,
  User,
  Briefcase,
  FileText,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Bell,
} from 'lucide-react';
import api from '../../utils/api';

const NotificationModal = ({ isOpen, onClose }) => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchInterviews();
    }
  }, [isOpen]);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/student/interviews');
      setInterviews(response.data || []);
    } catch (error) {
      console.error('Error fetching interviews:', error);
      setError('Failed to load interview details');
    } finally {
      setLoading(false);
    }
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'Video Call':
        return <Video className="w-5 h-5 text-purple-600" />;
      case 'Phone':
        return <Clock className="w-5 h-5 text-orange-600" />;
      case 'In-Person':
        return <MapPin className="w-5 h-5 text-blue-600" />;
      default:
        return <Video className="w-5 h-5 text-purple-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      scheduled: {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        border: 'border-blue-200',
        icon: <Clock className="w-4 h-4" />,
      },
      completed: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        border: 'border-green-200',
        icon: <CheckCircle className="w-4 h-4" />,
      },
      cancelled: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        border: 'border-red-200',
        icon: <AlertCircle className="w-4 h-4" />,
      },
    };

    const config = statusConfig[status] || statusConfig.scheduled;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${config.bg} ${config.text} ${config.border}`}
      >
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const isUpcoming = (date) => {
    return new Date(date) >= new Date();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-orange-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Bell className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Interview Notifications
                </h2>
                <p className="text-purple-100 text-sm">
                  Your scheduled interviews
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading interviews...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <p className="text-gray-600">{error}</p>
              </div>
            </div>
          ) : interviews.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 font-medium mb-2">
                  No Interviews Scheduled
                </p>
                <p className="text-sm text-gray-500">
                  You don't have any upcoming interviews
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {interviews.map((interview) => (
                <div
                  key={interview._id}
                  className={`border-2 rounded-xl p-6 transition-all ${
                    isUpcoming(interview.date) &&
                    interview.status === 'scheduled'
                      ? 'border-purple-200 bg-purple-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  {/* Interview Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {interview.jobTitle}
                      </h3>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(interview.status)}
                        {isUpcoming(interview.date) &&
                          interview.status === 'scheduled' && (
                            <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                              Upcoming
                            </span>
                          )}
                      </div>
                    </div>
                  </div>

                  {/* Interview Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Date */}
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {formatDate(interview.date)}
                        </p>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Time</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {formatTime(interview.time)} ({interview.duration}{' '}
                          mins)
                        </p>
                      </div>
                    </div>

                    {/* Mode */}
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {getModeIcon(interview.mode)}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Mode</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {interview.mode}
                        </p>
                      </div>
                    </div>

                    {/* Interviewer */}
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Interviewer</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {interview.interviewerName}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Location/Link */}
                  {interview.location && (
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-blue-600 font-semibold mb-1">
                            {interview.mode === 'Video Call'
                              ? 'Meeting Link'
                              : 'Location'}
                          </p>
                          {interview.location.startsWith('http') ? (
                            <a
                              href={interview.location}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-700 hover:text-blue-800 font-medium flex items-center gap-1 break-all"
                            >
                              {interview.location}
                              <ExternalLink className="w-4 h-4 flex-shrink-0" />
                            </a>
                          ) : (
                            <p className="text-sm text-blue-700 font-medium">
                              {interview.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {interview.notes && (
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-yellow-600 font-semibold mb-1">
                            Important Notes
                          </p>
                          <p className="text-sm text-yellow-800">
                            {interview.notes}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Join Button (for upcoming video calls) */}
                  {isUpcoming(interview.date) &&
                    interview.status === 'scheduled' &&
                    interview.mode === 'Video Call' &&
                    interview.location && (
                      <div className="mt-4">
                        <a
                          href={interview.location}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-orange-500 text-white font-semibold rounded-lg text-center hover:shadow-lg transition-all"
                        >
                          Join Interview
                        </a>
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
