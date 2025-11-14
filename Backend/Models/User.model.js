import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ['student', 'recruiter', 'admin'],
      required: true,
    },

    phone: String,
    rollNumber: String,
    department: String,
    year: String,
    cgpa: Number,
    skills: [String],
    bio: String,
    dateOfBirth: Date,
    address: String,
    city: String,
    state: String,
    pincode: String,

    linkedinUrl: String,
    githubUrl: String,
    portfolioUrl: String,
    resumeUrl: String, // Cloudinary resume file URL

    isVerified: {
      type: Boolean,
      default: false,
      set: (val) => (val === '' ? false : val), // fixes "" boolean error
    },
  },
  {
    timestamps: true,
    strict: false, // ✅ now both are in the same options object
  }
);

const User = mongoose.model('User', UserSchema);

export default User;
