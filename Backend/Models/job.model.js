import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'],
      required: true,
    },
    workMode: {
      type: String,
      enum: ['Office', 'Remote', 'Hybrid'],
      required: true,
    },
    salary: { type: String, required: true },
    experience: { type: String, required: true },
    openings: { type: Number, required: true },
    skills: { type: [String], required: true },
    description: { type: String, required: true },
    requirements: { type: String, required: true },
    lastDate: { type: Date, required: true },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // reference to User model
      required: true,
    },
  },
  { strict: false, timestamps: true }
);

const Job = mongoose.model('Job', jobSchema);
export default Job;
