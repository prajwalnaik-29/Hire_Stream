import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Briefcase,
} from 'lucide-react';
import api from '../../utils/api.js';

const Interviews = () => {
  const [interviews, setInterviews] = useState(null);
  const [filteredInterviews, setFilteredInterviews] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);

  const [scheduleForm, setScheduleForm] = useState({
    candidateId: '',
    candidateName: '',
    jobTitle: '',
    date: '',
    time: '',
    duration: '60',
    mode: 'Video Call',
    location: '',
    interviewerName: '',
    notes: '',
    status: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterInterviews();
  }, [searchQuery, statusFilter, interviews]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch interviews
      const interviewsResponse = await api.get('/recruiter/interviews');
      setInterviews(interviewsResponse.interviews);
      setFilteredInterviews(interviewsResponse.interviews);

      // Fetch shortlisted candidates for scheduling
      const candidatesResponse = await api.get(
        '/recruiter/applicationsbystatus?status=shortlisted'
      );

      setCandidates(candidatesResponse.applications || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterInterviews = () => {
    let filtered;
    if (interviews != null) {
      filtered = [...interviews];
    }
    // Search filter
    if (searchQuery) {
      filtered = filtered?.filter(
        (interview) =>
          interview?.candidateName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          interview?.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(
        (interview) => interview.status === statusFilter
      );
    }

    setFilteredInterviews(filtered);
  };

  const handleScheduleFormChange = (e) => {
    const { name, value } = e.target;
    setScheduleForm({ ...scheduleForm, [name]: value });
    // Auto-fill candidate details when candidate is selected

    console.log(value);
    if (name === 'candidateId') {
      const selected = candidates.find((c) => c.studentId === value);
      console.log(selected);
      if (selected) {
        setScheduleForm((prev) => ({
          ...prev,
          candidateName: selected?.name,
          jobTitle: selected?.title,
        }));
      }
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    scheduleForm.status = 'scheduled';

    try {
      if (selectedInterview) {
        // Update existing interview
        await api.put(
          `/recruiter/interviews/${selectedInterview._id}`,
          scheduleForm
        );
      } else {
        // Create new interview
        await api.post('/recruiter/interviews', scheduleForm);
      }

      // Refresh data
      await fetchData();

      // Close modal and reset form
      setShowScheduleModal(false);
      setSelectedInterview(null);
      setScheduleForm({
        candidateId: '',
        candidateName: '',
        jobTitle: '',
        date: '',
        time: '',
        duration: '60',
        mode: 'Video Call',
        location: '',
        interviewerName: '',
        notes: '',
        status: '',
      });
    } catch (error) {
      console.error('Error scheduling interview:', error);
      alert('Failed to schedule interview');
    }
  };

  const handleEdit = (interview) => {
    setSelectedInterview(interview);
    setScheduleForm({
      candidateId: interview.candidateId,
      candidateName: interview.candidateName,
      jobTitle: interview.jobTitle,
      date: interview.date.split('T')[0],
      time: interview.time,
      duration: interview.duration || '60',
      mode: interview.mode,
      location: interview.location || '',
      interviewerName: interview.interviewerName || '',
      notes: interview.notes || '',
    });
    setShowScheduleModal(true);
  };

  const handleDelete = async (interviewId) => {
    if (window.confirm('Are you sure you want to delete this interview?')) {
      try {
        await api.delete(`/recruiter/interviews/${interviewId}`);
        await fetchData();
      } catch (error) {
        console.error('Error deleting interview:', error);
        alert('Failed to delete interview');
      }
    }
  };

  const updateInterviewStatus = async (interviewId, status) => {
    try {
      await api.put(`/recruiter/updateinterviews/${interviewId}`, { status });
      setInterviews(
        interviews?.map((interview) =>
          interview._id === interviewId ? { ...interview, status } : interview
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      scheduled: {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        border: 'border-blue-200',
      },
      completed: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        border: 'border-green-200',
      },
      cancelled: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        border: 'border-red-200',
      },
      rescheduled: {
        bg: 'bg-orange-100',
        text: 'text-orange-700',
        border: 'border-orange-200',
      },
    };

    const style = statusStyles[status] || statusStyles.scheduled;

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}
      >
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'Video Call':
        return <Video className="w-4 h-4" />;
      case 'Phone':
        return <Clock className="w-4 h-4" />;
      case 'In-Person':
        return <MapPin className="w-4 h-4" />;
      default:
        return <Video className="w-4 h-4" />;
    }
  };

  const isUpcoming = (date) => {
    return new Date(date) >= new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading Interviews...</p>
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Interviews
              </h1>
              <p className="text-gray-600">
                Schedule and manage candidate interviews
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedInterview(null);
                setShowScheduleModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-purple-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Schedule Interview
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Interviews
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    placeholder="Search by candidate or job..."
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
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="rescheduled">Rescheduled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Total</p>
              <p className="text-2xl font-bold text-gray-800">
                {interviews?.length || 0}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Scheduled</p>
              <p className="text-2xl font-bold text-blue-600">
                {interviews?.filter((i) => i.status === 'scheduled').length ||
                  0}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-green-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {interviews?.filter((i) => i.status === 'completed').length ||
                  0}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Upcoming</p>
              <p className="text-2xl font-bold text-orange-600">
                {interviews?.filter(
                  (i) => isUpcoming(i.date) && i.status === 'scheduled'
                ).length || 0}
              </p>
            </div>
          </div>

          {/* Interviews List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">
                {filteredInterviews?.length} Interview
                {filteredInterviews?.length !== 1 ? 's' : ''}
              </h2>
            </div>

            {filteredInterviews == null ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No interviews scheduled</p>
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-purple-500 text-white font-medium rounded-lg hover:shadow-lg transition-shadow"
                >
                  <Plus className="w-4 h-4" />
                  Schedule Your First Interview
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredInterviews?.map((interview) => (
                  <div
                    key={interview._id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800 text-lg">
                              {interview.candidateName}
                            </h3>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Briefcase className="w-3 h-3" />
                              {interview.jobTitle}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-0 md:ml-15">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4 text-orange-600" />
                            <span>
                              {new Date(interview.date).toLocaleDateString(
                                'en-US',
                                {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                }
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4 text-orange-600" />
                            <span>
                              {interview?.time} ({interview?.duration || '60'}{' '}
                              mins)
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            {getModeIcon(interview.mode)}
                            <span>{interview?.mode}</span>
                          </div>
                        </div>

                        {interview.interviewerName && (
                          <p className="text-sm text-gray-500 mt-2 ml-0 md:ml-15">
                            Interviewer:{' '}
                            <span className="font-medium">
                              {interview?.interviewerName}
                            </span>
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-3">
                        {getStatusBadge(interview?.status)}

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(interview)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {interview?.status === 'scheduled' && (
                            <>
                              <button
                                onClick={() =>
                                  updateInterviewStatus(
                                    interview._id,
                                    'completed'
                                  )
                                }
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Mark as Completed"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  updateInterviewStatus(
                                    interview?._id,
                                    'cancelled'
                                  )
                                }
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Cancel"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => handleDelete(interview._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Schedule Interview Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedInterview
                  ? 'Edit Interview'
                  : 'Schedule New Interview'}
              </h2>
              <button
                onClick={() => {
                  setShowScheduleModal(false);
                  setSelectedInterview(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="p-6 space-y-5">
              {/* Select Candidate */}
              {!selectedInterview && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Candidate <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="candidateId"
                    value={scheduleForm.candidateId}
                    onChange={handleScheduleFormChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  >
                    <option value="">Choose a candidate...</option>
                    {candidates.map((candidate) => (
                      <option
                        key={candidate?.studentId}
                        value={candidate?.studentId}
                      >
                        {candidate?.name} - {candidate?.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={scheduleForm.date}
                    onChange={handleScheduleFormChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={scheduleForm.time}
                    onChange={handleScheduleFormChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Duration & Mode */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={scheduleForm.duration}
                    onChange={handleScheduleFormChange}
                    min="15"
                    step="15"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Interview Mode <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="mode"
                    value={scheduleForm.mode}
                    onChange={handleScheduleFormChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  >
                    <option value="Video Call">Video Call</option>
                    <option value="Phone">Phone</option>
                    <option value="In-Person">In-Person</option>
                  </select>
                </div>
              </div>

              {/* Location/Link */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location / Meeting Link
                </label>
                <input
                  type="text"
                  name="location"
                  value={scheduleForm.location}
                  onChange={handleScheduleFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  placeholder="Meeting link or office location"
                />
              </div>

              {/* Interviewer Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Interviewer Name
                </label>
                <input
                  type="text"
                  name="interviewerName"
                  value={scheduleForm.interviewerName}
                  onChange={handleScheduleFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  placeholder="Who will conduct the interview?"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={scheduleForm.notes}
                  onChange={handleScheduleFormChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
                  placeholder="Any additional notes or instructions..."
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-orange-600 to-purple-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  {selectedInterview
                    ? 'Update Interview'
                    : 'Schedule Interview'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowScheduleModal(false);
                    setSelectedInterview(null);
                  }}
                  className="px-8 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Interviews;
