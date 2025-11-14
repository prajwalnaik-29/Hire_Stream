// controller: applyForJob
import Application from '../Models/Application.model.js';
import Job from '../Models/job.model.js';

export const applyForJob = async (req, res) => {
  try {
    const studentId = req.user.id; // from auth middleware
    const { jobId } = req.body;

    // check if already applied
    const existing = await Application.findOne({ studentId, jobId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Already applied for this job',
      });
    }

    const application = await Application.create({
      jobId,
      studentId,
      resumeUrl: req.body.resume, // optional
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while applying for job',
      error: error.message,
    });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const studentId = req.user.id;

    // 🔹 Step 1: Get optional limit from query string
    const limit = parseInt(req.query.limit) || 0; // 0 means no limit

    // console.log(limit);
    // 🔹 Step 2: Fetch student applications (sorted latest first)
    const applicationsQuery = Application.find({ studentId }).sort({
      createdAt: -1,
    });

    if (limit > 0) {
      applicationsQuery.limit(limit);
    }

    const applications = await applicationsQuery;

    if (applications.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No applications found for this student',
      });
    }

    // 🔹 Step 3: Combine job details efficiently using .lean()
    const combinedData = await Promise.all(
      applications.map(async (application) => {
        const job = await Job.findById(application.jobId).select(
          'title company location jobType workMode salary experience openings lastDate skills description requirements postedBy'
        );

        return {
          _id: application._id,
          appliedAt: application.createdAt,
          status: application.status,
          jobId: application.jobId,
          job: job || {},
        };
      })
    );

    // 🔹 Step 4: Send response
    res.status(200).json({
      success: true,
      count: combinedData.length,
      applications: combinedData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student applications',
      error: error.message,
    });
  }
};

export const getApplicationstatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId } = req.user.id;

    const application = await Application.findOne({ jobId: id, studentId });

    if (!application) {
      return res.status(200).json({
        success: true,
        message: 'not found or application not filled yet',
      });
    }

    res.status(200).json({
      success: true,
      status: application.status,
      applications: application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student applications',
      error: error.message,
    });
  }
};
