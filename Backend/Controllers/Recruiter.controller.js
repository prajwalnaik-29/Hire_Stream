import Job from '../Models/job.model.js';
import Application from '../Models/Application.model.js';
import User from '../Models/User.model.js';

export const jobsController = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      jobType,
      workMode,
      salary,
      experience,
      openings,
      skills,
      description,
      requirements,
      lastDate,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !company ||
      !location ||
      !jobType ||
      !workMode ||
      !salary ||
      !experience ||
      !openings ||
      !skills ||
      !description ||
      !requirements ||
      !lastDate
    ) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    // Create job (postedBy comes from req.user if you use verifyToken middleware)
    const job = new Job({
      title,
      company,
      location,
      jobType,
      workMode,
      salary,
      experience,
      openings,
      skills,
      description,
      requirements,
      lastDate,
      postedBy: req.user?._id || req.body.postedBy, // fallback if not using token middleware
    });

    await job.save();

    res.status(201).json({
      message: 'Job created successfully',
      job,
    });
  } catch (error) {
    console.error('Job creation error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getjobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json({
      success: true,
      count: jobs?.length || 0,
      message: 'Active jobs fetched successfully',
      jobs,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'internal server error' });
  }
};

export const getActiveJobsController = async (req, res) => {
  try {
    const currentDate = new Date();
    const activejobs = await Job.find({ lastDate: { $gte: currentDate } })
      .populate('postedBy', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Active jobs fetched successfully',
      activejobs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getAllApplicationforRecruiter = async (req, res) => {
  try {
    // 🔹 Step 1: Get optional limit from query string
    const limit = parseInt(req.query.limit) || 0; // 0 means no limit

    /* console.log(limit); */
    // 🔹 Step 2: Fetch student applications (sorted latest first)
    const applicationsQuery = Application.find().sort({
      createdAt: -1,
    });

    if (limit > 0) {
      applicationsQuery.limit(limit);
    }

    const applications = await applicationsQuery;

    if (applications.length === 0) {
      return res.status(404).json({
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

        const student = await User.findById(application.studentId)
          .select('name email phone qualification skills resumeUrl isVerified')
          .lean();

        return {
          _id: application._id,
          appliedAt: application.createdAt,
          status: application.status,
          jobId: application.jobId,
          studentId: application.studentId,
          ...(job || {}),
          ...(student || {}),
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

/* export const getcandidatesById = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔹 Step 1: Validate ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Student or candidate ID is required in params',
      });
    }

    // 🔹 Step 2: Find the student user
    const candidate = await User.findOne({ _id: id, role: 'student' })
      .select('-password') // exclude password field
      .lean(); // make it plain JS object

    // 🔹 Step 3: Handle not found
    if (!candidate) {
      return res.status(200).json({
        success: true,
        message: 'Student not found or not a student account',
      });
    }

    // 🔹 Step 4: Send the student data
    res.status(200).json({
      success: true,
      candidate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student details',
      error: error.message,
    });
  }
}; */

export const getStudentByIdWithApplications = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔹 Step 1: Validate ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is required in params',
      });
    }

    // 🔹 Step 2: Find the student
    const student = await User.findOne({ _id: id, role: 'student' })
      .select('-password') // exclude sensitive field
      .lean();

    if (!student) {
      return res.status(200).json({
        success: true,
        message: 'Student not found or not a student account',
      });
    }

    // 🔹 Step 3: Find all applications by that student
    const applications = await Application.find({ studentId: id })
      .populate({
        path: 'jobId',
        select:
          'title company location jobType workMode salary experience openings lastDate skills description requirements postedBy',
      })
      .sort({ createdAt: -1 })
      .lean();

    // 🔹 Step 4: Return combined result
    res.status(200).json({
      success: true,
      candidate: student,
      applications: applications.map((app) => ({
        _id: app._id,
        appliedAt: app.createdAt,
        status: app.status,
        job: app.jobId || {}, // populated job details
      })),
    });
  } catch (error) {
    console.error('Error fetching candidate:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching candidate details and applications',
      error: error.message,
    });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    // Validate required data
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status field is required',
      });
    }

    // Allowed status values
    const allowedStatuses = [
      'applied',
      'pending',
      'shortlisted',
      'accepted',
      'rejected',
    ];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status value. Allowed: ${allowedStatuses.join(', ')}`,
      });
    }

    // Find and update the application
    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );

    // If not found
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Success response
    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      application,
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating application status',
    });
  }
};

/* export const getApplicationsByStatus = async (req, res) => {
  try {
    const { status } = req.query;

    // Validate query param
    if (!status) {
      return res.status(400).json({
        success: false,
        message:
          'Status query parameter is required (e.g., ?status=shortlisted)',
      });
    }

    // Fetch all applications with that status
    const applications = await Application.find({ status })
      .populate(
        'studentId',
        'name email phone degree branch skills resume isVerified'
      )
      .populate('jobId', 'title company location,workMode');

    if (!applications || applications.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No applications found with status: ${status}`,
      });
    }

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error('Error fetching applications by status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching applications by status',
    });
  }
}; */

export const getApplicationsByStatus = async (req, res) => {
  try {
    const { status } = req.query;

    if (!status) {
      return res.status(400).json({
        success: false,
        message:
          'Status query parameter is required (e.g., ?status=shortlisted)',
      });
    }

    // Step 1: Get all applications with given status
    const applications = await Application.find({ status }).lean();

    if (!applications || applications.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No applications found with status: ${status}`,
      });
    }

    // Step 2: For each application, fetch student and job info separately and merge
    const combinedData = await Promise.all(
      applications.map(async (app) => {
        const student = await User.findById(app.studentId)
          .select('name email phone degree branch skills resume isVerified')
          .lean();

        const job = await Job.findById(app.jobId)
          .select('title company location jobType workMode salary')
          .lean();

        return {
          ...app, // Application info (plain object)
          ...(student || null),
          ...(job || null),
        };
      })
    );

    // Step 3: Send the flattened data
    res.status(200).json({
      success: true,
      count: combinedData.length,
      applications: combinedData,
    });
  } catch (error) {
    console.error('Error fetching applications by status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching applications by status',
      error: error.message,
    });
  }
};
