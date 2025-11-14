import { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  Edit2,
  Save,
  X,
  Upload,
  Download,
  Globe,
} from 'lucide-react';
import api from '../../utils/api.js';
import { toast } from 'react-hot-toast';
import { FaLinkedinIn } from 'react-icons/fa';
import { FiGithub } from 'react-icons/fi';
import ResumeUploader from './ResumeUploader.jsx';
import { useAuth } from '../../Context/AuthContext.jsx';
import { MdVerified } from 'react-icons/md';

const StudentProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    rollNumber: '',
    dateOfBirth: '',
    address: '',
    department: '',
    location: '',
    college: '',
    degree: '',
    branch: '',
    year: '',
    cgpa: '',
    skills: [],
    bio: '',
    resume: '',
    linkedin: '',
    github: '',
    portfolio: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/student/profile');
      console.log(response);
      setProfile(response?.data || {});
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills?.includes(newSkill.trim())) {
      setProfile((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Resume file size should be less than 5MB');
        return;
      }
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      setResumeFile(file);
      toast.success('Resume selected. Click Save to upload.');
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const formData = new FormData();

      // Append all profile fields
      Object.keys(profile).forEach((key) => {
        if (key === 'skills') {
          formData.append(key, JSON.stringify(profile[key]));
        } else if (key !== 'resume') {
          formData.append(key, profile[key] || '');
        }
      });

      // Append resume file if selected
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      const response = await api.upload('/student/profile', formData, {
        method: 'PUT',
      });

      setProfile(response?.profile);
      setIsEditing(false);
      setResumeFile(null);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setResumeFile(null);
    fetchProfile();
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-purple-900 mb-2">
              My Profile
            </h1>
            <p className="text-gray-600">
              Manage your personal information and resume
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-xl hover:from-purple-700 hover:to-orange-600 transition-all"
              >
                <Edit2 className="w-5 h-5" />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
                >
                  <X className="w-5 h-5" />
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-xl hover:from-purple-700 hover:to-orange-600 transition-all disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 relative bg-gradient-to-br from-purple-600 to-orange-500 rounded-full flex items-center justify-center mb-4">
                  <User className="w-16 h-16 text-white" />
                  {user?.isVerified ? (
                    <MdVerified className="w-10 h-10 bg-white rounded-full text-green-600 absolute -bottom-0 -right-1" />
                  ) : (
                    <></>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 text-center">
                  {profile.name || 'Your Name'}
                </h2>
                <p className="text-purple-600 font-medium mt-1">
                  {profile.degree || 'Student'}{' '}
                  {profile.branch && `- ${profile.branch}`}
                </p>
                {profile.college && (
                  <p className="text-gray-600 text-sm mt-1 text-center">
                    {profile.college}
                  </p>
                )}
              </div>

              {/* Quick Stats */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="w-5 h-5 text-purple-500" />
                  <span className="text-sm truncate">
                    {profile.email || 'No email'}
                  </span>
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone className="w-5 h-5 text-orange-500" />
                    <span className="text-sm">{profile.phone}</span>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="w-5 h-5 text-red-500" />
                    <span className="text-sm">{profile.location}</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {(profile.linkedin || profile.github || profile.portfolio) && (
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-sm font-semibold text-gray-500 mb-3">
                    CONNECT
                  </h3>
                  <div className="space-y-2">
                    {profile.linkedin && (
                      <a
                        href={profile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                      >
                        <FaLinkedinIn className="w-4 h-4" />
                        LinkedIn
                      </a>
                    )}
                    {profile.github && (
                      <a
                        href={profile.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 text-sm"
                      >
                        <FiGithub className="w-4 h-4" />
                        GitHub
                      </a>
                    )}
                    {profile.portfolio && (
                      <a
                        href={profile.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm"
                      >
                        <Globe className="w-4 h-4" />
                        Portfolio
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-purple-900 mb-6 flex items-center gap-2">
                <User className="w-6 h-6" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:outline-none focus:border-purple-500 disabled:bg-gray-50 disabled:text-gray-600"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email || ''}
                    onChange={handleInputChange}
                    disabled={true}
                    className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:outline-none focus:border-purple-500 bg-gray-50 text-gray-600"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:outline-none focus:border-purple-500 disabled:bg-gray-50 disabled:text-gray-600"
                    placeholder="+91 1234567890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={profile.dateOfBirth || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:outline-none focus:border-purple-500 disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={profile.location || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:outline-none focus:border-purple-500 disabled:bg-gray-50 disabled:text-gray-600"
                    placeholder="City, State"
                  />
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 mt-4">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={profile.address || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:outline-none focus:border-purple-500 disabled:bg-gray-50 disabled:text-gray-600"
                      placeholder="address"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Education Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-purple-900 mb-6 flex items-center gap-2">
                <GraduationCap className="w-6 h-6" />
                Education
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    College/University
                  </label>
                  <input
                    type="text"
                    name="college"
                    value={profile.college || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:outline-none focus:border-purple-500 disabled:bg-gray-50 disabled:text-gray-600"
                    placeholder="Your College Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Degree
                  </label>
                  <input
                    type="text"
                    name="degree"
                    value={profile.degree || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:outline-none focus:border-purple-500 disabled:bg-gray-50 disabled:text-gray-600"
                    placeholder="B.Tech, MCA, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Branch/Specialization
                  </label>
                  <input
                    type="text"
                    name="branch"
                    value={profile.branch || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:outline-none focus:border-purple-500 disabled:bg-gray-50 disabled:text-gray-600"
                    placeholder="Computer Science, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Year
                  </label>
                  <select
                    name="year"
                    value={profile.year || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:outline-none focus:border-purple-500 disabled:bg-gray-50 disabled:text-gray-600"
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    CGPA/Percentage
                  </label>
                  <input
                    type="text"
                    name="cgpa"
                    value={profile.cgpa || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:outline-none focus:border-purple-500 disabled:bg-gray-50 disabled:text-gray-600"
                    placeholder="8.5 or 85%"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Roll Number or USN
                  </label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={profile.rollNumber || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:outline-none focus:border-purple-500 disabled:bg-gray-50 disabled:text-gray-600"
                    placeholder="roll number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={profile.department || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:outline-none focus:border-purple-500 disabled:bg-gray-50 disabled:text-gray-600"
                    placeholder="department"
                  />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-purple-900 mb-6 flex items-center gap-2">
                <Award className="w-6 h-6" />
                Skills
              </h3>
              {isEditing && (
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                    className="flex-1 px-4 py-3 border-2 border-purple-100 rounded-xl focus:outline-none focus:border-purple-500"
                    placeholder="Add a skill (e.g., React, Python)"
                  />
                  <button
                    onClick={handleAddSkill}
                    className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {profile.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-orange-100 text-purple-700 rounded-xl font-medium"
                    >
                      <span>{skill}</span>
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No skills added yet</p>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-purple-900 mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6" />
                About Me
              </h3>
              <textarea
                name="bio"
                value={profile.bio || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows="5"
                className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:outline-none focus:border-purple-500 disabled:bg-gray-50 disabled:text-gray-600 resize-none"
                placeholder="Tell us about yourself, your interests, career goals..."
              />
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-purple-900 mb-6 flex items-center gap-2">
                <Briefcase className="w-6 h-6" />
                Professional Links
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    value={profile.linkedin || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:outline-none focus:border-purple-500 disabled:bg-gray-50 disabled:text-gray-600"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    GitHub Profile
                  </label>
                  <input
                    type="url"
                    name="github"
                    value={profile.github || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:outline-none focus:border-purple-500 disabled:bg-gray-50 disabled:text-gray-600"
                    placeholder="https://github.com/yourusername"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Portfolio Website
                  </label>
                  <input
                    type="url"
                    name="portfolio"
                    value={profile.portfolio || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:outline-none focus:border-purple-500 disabled:bg-gray-50 disabled:text-gray-600"
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </div>
            </div>

            {/* Resume Upload */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-purple-900 mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Resume
              </h3>
              {profile.resume && !isEditing ? (
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Resume.pdf</p>
                      <p className="text-sm text-gray-600">
                        Uploaded successfully
                      </p>
                    </div>
                  </div>
                  <a
                    href={profile.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                </div>
              ) : (
                <div>
                  <label className="block w-full cursor-pointer">
                    <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center hover:border-purple-500 transition-colors">
                      <Upload className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                      <p className="text-gray-700 font-medium mb-2">
                        {resumeFile
                          ? resumeFile.name
                          : 'Click to upload resume'}
                      </p>
                      <p className="text-sm text-gray-500">
                        PDF format, max 5MB
                      </p>
                    </div>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleResumeUpload}
                      disabled={!isEditing}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            <p className="text-2xl text-gray-800 text-center py-5">
              --------- OR --------
            </p>

            <ResumeUploader
              setProfile={setProfile}
              setIsEditing={setIsEditing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
