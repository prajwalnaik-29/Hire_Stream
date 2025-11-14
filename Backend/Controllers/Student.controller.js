import Application from '../Models/Application.model.js';
import Interview from '../Models/Interview.model.js';
import Job from '../Models/job.model.js';
import User from '../Models/User.model.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
import { GoogleGenAI } from '@google/genai';
import PDFParser from 'pdf2json';
import mongoose from 'mongoose';

const ai = new GoogleGenAI({});

export const getStudentProfile = async (req, res) => {
  try {
    // Get student ID from authenticated user (from auth middleware)
    const studentId = req.user.id;

    // Find student by ID and exclude password
    const student = await User.findById(studentId).select('-password');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // Check if user is actually a student
    if (student.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Not a student account.',
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error('Error in getStudentProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/* export const updateStudentProfile = async (req, res) => {

  try {
    // Get student ID from authenticated user
    const studentId = req.user.id;

    console.log(studentId, 'requested to update profile');

    console.log('body', req.body);
    console.log('file', req.file);

    res.status(200).send({ message: 'ss' });

    // Fields that can be updated
    const updateFields = {};

    // Only add fields that are present in request body
    const allowedFields = [
      'name',
      'phone',
      'rollNumber',
      'department',
      'year',
      'cgpa',
      'skills',
      'bio',
      'dateOfBirth',
      'address',
      'city',
      'state',
      'pincode',
      'linkedinUrl',
      'githubUrl',
      'portfolioUrl',
      'resumeUrl',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    // Update student and return new document
    const updatedStudent = await User.findByIdAndUpdate(
      studentId,
      { $set: updateFields },
      {
        new: true, // Return updated document
        runValidators: true, // Run schema validators
      }
    ).select('-password');

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // Check if user is actually a student
    if (updatedStudent.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Not a student account.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedStudent,
    });
  } catch (error) {
    console.error('Error in updateStudentProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
 */

export const updateProfile = async (req, res) => {
  try {
    const studentId = req.user.id; // from auth middleware
    const updates = { ...req.body };
    /* console.log('File:', req.file); */

    // If resume file exists, upload it to Cloudinary
    if (req.file) {
      const resumeUrl = await uploadToCloudinary(
        req.file.buffer,
        'resumes',
        req.file.mimetype
      );

      /* console.log(resumeUrl); */
      updates.resume = resumeUrl;
    }

    // Parse skills if sent as JSON string
    if (updates.skills) {
      try {
        updates.skills = JSON.parse(updates.skills);
      } catch (e) {
        console.log('skills already parsed');
      }
    }

    const updatedProfile = await User.findByIdAndUpdate(studentId, updates, {
      new: true,
    });

    res.status(200).json({
      message: 'Profile updated successfully',
      profile: updatedProfile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error updating profile',
      error: error.message,
    });
  }
};

export const getvarifiedjobs = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    // Find all jobs where isVarified is true
    let query = Job.find({ isVerified: true }).sort({ createdAt: -1 });

    if (limit) {
      query = query.limit(limit);
    }

    /*   console.log(limit); */

    const verifiedJobs = await query.exec();

    if (!verifiedJobs || verifiedJobs.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No verified jobs found or varified jobs not yet',
      });
    }

    res.status(200).json({
      success: true,
      count: verifiedJobs.length,
      jobs: verifiedJobs,
    });
  } catch (error) {
    console.error('Error fetching verified jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching verified jobs',
      error: error.message,
    });
  }
};

export const getVerifiedJobById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find job by ID and ensure it’s verified
    const jobs = await Job.findOne({ _id: id, isVerified: true }).populate(
      'postedBy',
      'name email'
    );

    if (!jobs) {
      return res.status(404).json({
        success: false,
        message: 'Verified job not found or not verified yet',
      });
    }

    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error('Error fetching verified job by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching verified job',
      error: error.message,
    });
  }
};

export const getApplicationStatusCounts = async (req, res) => {
  try {
    const studentId = req.user?.id;

    const studentObjectId = new mongoose.Types.ObjectId(studentId);
    // Aggregate counts grouped by status
    const statusCounts = await Application.aggregate([
      {
        $match: { studentId: studentObjectId }, // filter by logged-in user's applications
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Convert aggregation result into a clean object
    const formattedCounts = {
      accepted: 0,
      rejected: 0,
      shortlisted: 0,
      pending: 0,
      applied: 0,
    };

    /* console.log(formattedCounts); */

    statusCounts.forEach((item) => {
      const key = item._id?.toLowerCase();
      if (formattedCounts[key] !== undefined) {
        formattedCounts[key] = item.count;
      }
    });

    /* console.log(formattedCounts); */
    // Total applications count
    const totalApplications = await Application.countDocuments({ studentId });

    return res.status(200).json({
      success: true,
      totalApplications,
      ...formattedCounts,
      message: 'Application status counts fetched successfully',
    });
  } catch (error) {
    console.error('Error fetching application status counts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching application status counts',
      error: error.message,
    });
  }
};

export const getStudentInterviews = async (req, res) => {
  try {
    const studentId = req.user.id;

    // Find all interviews for this student
    const interviews = await Interview.find({
      candidateId: studentId,
    }).sort({ date: 1, time: 1 }); // Sort by date and time

    res.status(200).json({
      success: true,
      data: interviews,
    });
  } catch (error) {
    console.error('Error fetching student interviews:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const Resumeparce = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // Create a new PDF parser instance
    const pdfParser = new PDFParser();

    const textToSend = await new Promise((resolve, reject) => {
      pdfParser.on('pdfParser_dataError', (errData) => {
        reject(errData.parserError);
      });

      pdfParser.on('pdfParser_dataReady', (pdfData) => {
        const text = pdfData.Pages.map((page) =>
          page.Texts.map((t) =>
            decodeURIComponent(t.R.map((r) => r.T).join(''))
          ).join(' ')
        ).join('\n');

        resolve(text);
      });

      pdfParser.parseBuffer(req.file.buffer);
    });

    const systemInstruction = `
You are a resume parser: extract Name, Email, Phone, Location (if present), Summary, Skills (array),
Experience (array of objects with company, title, start, end, bullets), Education (array with degree, school, year),
Certifications (array), and optionally GitHub/Portfolio links.
Return output as EXACT JSON only, with keys: name, phone, location, bio, skills, year, branch, degree, college ,department,address,dateOfBirth,rollNumber,cgpa,links.
If a field is missing, use an empty string or empty array. Dates should be YYYY or YYYY-MM format if available.
`;

    const prompt = `${systemInstruction}\n\nResume Text:\n${textToSend}\n\nReturn only JSON.`;

    // 3) Call Gemini API to generate the JSON
    // Example using google-genai SDK method from the docs (adjust if your SDK method names differ)
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Specify the model here
      contents: prompt, // Pass your prompt here
    });

    // Response parsing — assumes response.text contains model output
    const modelText =
      response?.text ||
      (response?.candidates && response.candidates[0]?.content) ||
      '';

    // Try to parse JSON safely
    let parsed = null;
    try {
      // Sometimes model may output code fences; strip them
      const cleaned = modelText
        .replace(/^\s*```(?:json)?\s*/, '')
        .replace(/\s*```\s*$/, '');
      parsed = JSON.parse(cleaned);
    } catch (err) {
      // If parsing fails, return model text for debugging
      return res.status(200).json({
        ok: false,
        message: 'Model did not return valid JSON.',
        modelText,
      });
    }

    // 4) Return parsed JSON to client
    return res.json({ ok: true, parsed });
  } catch (err) {
    console.error('Error /api/parse-resume:', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};
