import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to User model (student)
      required: true,
    },
    candidateName: {
      type: String,
      required: true,
      trim: true,
    },
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String, // You can also use Date type if you plan to store both date & time together
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 60, // Default 60 minutes
    },
    mode: {
      type: String,
      enum: ['Video Call', 'Offline', 'Phone', 'In-Person', 'Other'],
      default: 'Video Call',
    },
    location: {
      type: String,
      default: '',
    },
    interviewerName: {
      type: String,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      default: 'scheduled',
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  }
);

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;
