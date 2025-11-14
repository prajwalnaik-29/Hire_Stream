import { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  GraduationCap,
  X,
  MapPin,
  Globe,
  Download,
} from 'lucide-react';
import { Eye } from 'lucide-react';
import api from '../../utils/api.js';
import { FaLinkedinIn } from 'react-icons/fa';
import { FiGithub } from 'react-icons/fi';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [updatingStatus, setUpdatingStatus] = useState({});
  const [modal, setmodal] = useState(false);
  const [info, setinfo] = useState({});

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [searchQuery, verificationFilter, students]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/students');
      setStudents(response.students);
      setFilteredStudents(response.students);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = [...students];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (student) =>
          student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.phone?.includes(searchQuery) ||
          student.rollNumber?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Verification filter
    if (verificationFilter !== 'all') {
      const isVerified = verificationFilter === 'verified';
      filtered = filtered.filter(
        (student) => student.isVerified === isVerified
      );
    }

    setFilteredStudents(filtered);
  };

  const handleVerificationChange = async (studentId, newStatus) => {
    setUpdatingStatus((prev) => ({ ...prev, [studentId]: true }));

    try {
      const isVerified = newStatus === 'verified';
      await api.put(`/admin/students/${studentId}/verify`, { isVerified });

      // Update local state
      setStudents(
        students.map((student) =>
          student._id === studentId ? { ...student, isVerified } : student
        )
      );
    } catch (error) {
      console.error('Error updating verification status:', error);
      alert('Failed to update verification status');
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [studentId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading Students...</p>
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
              Students Management
            </h1>
            <p className="text-gray-600">
              View and manage all registered students
            </p>
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Students
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    placeholder="Search by name, email, phone, roll number..."
                  />
                </div>
              </div>

              {/* Verification Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Status
                </label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={verificationFilter}
                    onChange={(e) => setVerificationFilter(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
                  >
                    <option value="all">All Students</option>
                    <option value="verified">Verified</option>
                    <option value="unverified">Unverified</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Total Students</p>
              <p className="text-2xl font-bold text-gray-800">
                {students.length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-green-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Verified</p>
              <p className="text-2xl font-bold text-green-600">
                {students.filter((s) => s.isVerified).length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-red-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Unverified</p>
              <p className="text-2xl font-bold text-red-600">
                {students.filter((s) => !s.isVerified).length}
              </p>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">
                {filteredStudents.length} Student
                {filteredStudents.length !== 1 ? 's' : ''}
              </h2>
            </div>

            {/* Table */}
            {filteredStudents.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No students found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Student Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Roll Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Verification Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredStudents.map((student) => (
                      <tr
                        key={student._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <GraduationCap className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">
                                {student.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {student.department || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {student.email}
                            </p>
                            {student.phone && (
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {student.phone}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-800">
                            {student.rollNumber || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {new Date(student.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={
                              student.isVerified ? 'verified' : 'unverified'
                            }
                            onChange={(e) =>
                              handleVerificationChange(
                                student._id,
                                e.target.value
                              )
                            }
                            disabled={updatingStatus[student._id]}
                            className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all outline-none cursor-pointer ${
                              student.isVerified
                                ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                            } ${
                              updatingStatus[student._id]
                                ? 'opacity-50 cursor-not-allowed'
                                : ''
                            }`}
                          >
                            <option value="verified">✓ Verified</option>
                            <option value="unverified">✗ Unverified</option>
                          </select>
                        </td>
                        <td>
                          <div
                            onClick={() => (setinfo(student), setmodal(true))}
                            className="flex gap-1 py-2 px-3 text-sm text-yellow-700 font-medium outline-none cursor-pointer justify-center items-center bg-yellow-50 border-yellow-200 border shadow-sm rounded-lg w-fit"
                          >
                            <Eye size={14} />
                            <span>View details</span>
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
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-purple-600 to-orange-500 px-8 py-6 relative">
              <button
                onClick={() => setmodal(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition"
              >
                <X size={22} />
              </button>
              <h2 className="text-2xl font-bold text-white">
                {info?.name || 'Student'}
              </h2>
              <p className="text-white/90 text-sm mt-1">
                {info?.department} • {info?.year}
              </p>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto no-scrollbar p-8">
              {/* Academic Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                  <p className="text-xs text-purple-600 font-medium mb-1">
                    CGPA
                  </p>
                  <p className="text-xl font-bold text-gray-800">
                    {info?.cgpa || 'N/A'}
                  </p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                  <p className="text-xs text-orange-600 font-medium mb-1">
                    Roll Number
                  </p>
                  <p className="text-xl font-bold text-gray-800">
                    {info?.rollNumber || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Contact
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Mail size={18} className="text-purple-500" />
                    <span>{info?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Phone size={18} className="text-orange-500" />
                    <span>{info?.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-gray-700">
                    <MapPin
                      size={18}
                      className="text-yellow-500 flex-shrink-0 mt-0.5"
                    />
                    <span>
                      {info?.address ? (
                        <>
                          {info.address}, {info.city}, {info.state} -{' '}
                          {info.pincode}
                        </>
                      ) : (
                        'No address available'
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {info?.bio && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    About
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {info.bio}
                  </p>
                </div>
              )}

              {/* Skills */}
              {info?.skills?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {info.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Links
                </h3>
                <div className="space-y-2">
                  {info?.linkedin && (
                    <a
                      href={info?.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
                    >
                      <FaLinkedinIn size={16} />
                      LinkedIn Profile
                    </a>
                  )}
                  {info?.github && (
                    <a
                      href={info.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 font-medium"
                    >
                      <FiGithub size={16} />
                      GitHub Profile
                    </a>
                  )}
                  {info?.portfolio && (
                    <a
                      href={info.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
                    >
                      <Globe size={16} />
                      Portfolio Website
                    </a>
                  )}
                </div>
              </div>

              {/* Resume Download */}
              <div className="pt-4 border-t border-gray-200">
                {info?.resume ? (
                  <a
                    href={info.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-600 to-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition"
                  >
                    <Download size={18} />
                    Download Resume
                  </a>
                ) : (
                  <p className="text-center text-gray-400 text-sm italic">
                    No resume uploaded
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
