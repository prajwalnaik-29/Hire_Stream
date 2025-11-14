import Application from '../Models/Application.model.js';
import Job from '../Models/job.model.js';
import User from '../Models/User.model.js';

export async function getalljob(req, res) {
  try {
    const jobs = await Job.find();

    res.status(200).json({
      success: true,
      message: 'all jobs',
      count: jobs.length,
      jobs,
    });
  } catch (err) {
    res.status(500).send({ message: 'internal server error' });
  }
}

export const getAllStudents = async (req, res) => {
  try {
    // Find all users with role = "student"
    const students = await User.find({ role: 'student' }).select('-password');
    // `.select('-password')` removes the password field for safety

    if (!students || students.length === 0) {
      return res.status(404).json({
        success: true,
        message: 'No students found',
      });
    }

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching students',
      error: error.message,
    });
  }
};

export const getPendingVerifications = async (req, res) => {
  try {
    // get optional ?limit=5 from query
    const limit = parseInt(req.query.limit) || 0;

    // find all users with role "student" and not verified
    const pendingStudents = await User.find({
      role: 'student',
      isVerified: false,
    })
      .limit(limit)
      .sort({ createdAt: -1 }); // newest first (optional)

    // if none found
    if (!pendingStudents.length) {
      return res.status(200).json({
        success: true,
        message: 'No pending student verifications found',
      });
    }

    // return success
    res.status(200).json({
      success: true,
      count: pendingStudents.length,
      students: pendingStudents,
    });
  } catch (error) {
    console.error('Error fetching pending verifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pending verifications',
      error: error.message,
    });
  }
};

export const getAllrecruiters = async (req, res) => {
  try {
    // get optional ?limit=5 from query
    const limit = parseInt(req.query.limit) || 0;

    // find all users with role "student" and not verified
    const recruiters = await User.find({
      role: 'recruiter',
    })
      .limit(limit)
      .sort({ createdAt: -1 }); // newest first (optional)

    // if none found
    if (!recruiters.length) {
      return res.status(404).json({
        success: true,
        message: 'No recruiters found',
      });
    }

    // return success
    res.status(200).json({
      success: true,
      count: recruiters.length,
      recruiters: recruiters,
    });
  } catch (error) {
    console.error('Error fetching recruiters :', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recruiters ',
      error: error.message,
    });
  }
};

export const gettingAllapplication = async (req, res) => {
  try {
    const studentId = req.user.id;

    // 🔹 Step 1: Get optional limit from query string
    const limit = parseInt(req.query.limit) || 0; // 0 means no limit

    console.log(limit);
    // 🔹 Step 2: Fetch student applications (sorted latest first)
    const applicationsQuery = Application.find().sort({
      createdAt: -1,
    });

    if (limit > 0) {
      applicationsQuery.limit(limit);
    }

    const applications = await applicationsQuery;

    if (applications.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No applications found',
      });
    }

    // 🔹 Step 3: Combine job details efficiently using .lean()
    const combinedData = await Promise.all(
      applications.map(async (application) => {
        const job = await Job.findById(application.jobId)
          .select(
            'title company location jobType workMode salary experience openings lastDate skills description requirements postedBy'
          )
          .lean();

        return {
          _id: application._id,
          appliedAt: application.createdAt,
          status: application.status,
          jobId: application.jobId,
          ...(job || {}),
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
