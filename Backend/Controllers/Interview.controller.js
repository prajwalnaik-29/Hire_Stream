import Interview from '../Models/Interview.model.js';

export const createInterview = async (req, res) => {
  try {
    const {
      candidateId,
      candidateName,
      jobTitle,
      date,
      time,
      duration,
      mode,
      location,
      interviewerName,
      notes,
      status,
    } = req.body;

    // 🔹 Validate required fields
    /*    if (
      !candidateId ||
      !candidateName ||
      !jobTitle ||
      !date ||
      !time ||
      !interviewerName
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Please provide all required fields: candidateId, candidateName, jobTitle, date, time, interviewerName',
      });
    } */

    // 🔹 Create a new interview
    const interview = await Interview.create({
      candidateId,
      candidateName,
      jobTitle,
      date,
      time,
      duration,
      mode,
      location,
      interviewerName,
      notes,
      status,
    });

    // 🔹 Respond with success
    res.status(201).json({
      success: true,
      message: 'Interview scheduled successfully',
      interview,
    });
  } catch (error) {
    console.error('Error creating interview:', error);
    res.status(500).json({
      success: false,
      message: 'Error scheduling interview',
      error: error.message,
    });
  }
};

export const updateInterview = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔹 Check if the ID is valid
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Interview ID is required',
      });
    }

    // 🔹 Find and update the interview
    const updatedInterview = await Interview.findByIdAndUpdate(
      id,
      { $set: req.body }, // Allow partial updates
      { new: true, runValidators: true } // Return updated doc and validate fields
    ).lean();

    // 🔹 If interview not found
    if (!updatedInterview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    // 🔹 Success response
    res.status(200).json({
      success: true,
      message: 'Interview updated successfully',
      interview: updatedInterview,
    });
  } catch (error) {
    console.error('Error updating interview:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating interview',
      error: error.message,
    });
  }
};

export const getAllInterviews = async (req, res) => {
  try {
    // 🔹 Optional query filters (you can pass ?candidateId=...&jobTitle=...&date=...)
    const { candidateId, jobTitle, date, limit } = req.query;

    const filters = {};
    if (candidateId) filters.candidateId = candidateId;
    if (jobTitle) filters.jobTitle = jobTitle;
    if (date) filters.date = date;

    const queryLimit = parseInt(limit) || 0; // 0 = no limit

    // 🔹 Fetch interviews sorted by latest date/time
    const interviewsQuery = Interview.find(filters)
      .sort({ createdAt: -1 })
      .lean();

    if (queryLimit > 0) interviewsQuery.limit(queryLimit);

    const interviews = await interviewsQuery;

    // 🔹 If no interviews found
    /*  if (interviews.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No interviews found',
      });
    } */

    // 🔹 Success response
    res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
      message:
        interviews.length === 0
          ? 'No interviews scheduled yet'
          : 'Interviews fetched successfully',
    });
  } catch (error) {
    console.error('Error fetching interviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching interviews',
      error: error.message,
    });
  }
};

export const deleteInterview = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔹 Check if interview exists
    const interview = await Interview.findById(id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    // 🔹 Delete the interview
    await Interview.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Interview deleted successfully',
      deletedInterviewId: id,
    });
  } catch (error) {
    console.error('Error deleting interview:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting interview',
      error: error.message,
    });
  }
};

export const updateInterviewStatus = async (req, res) => {
  try {
    const { id } = req.params; // interviewId from URL
    const { status } = req.body; // new status from request body

    // 🧩 Validate input
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status field is required',
      });
    }

    // 🔹 Find and update interview status
    const updatedInterview = await Interview.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedInterview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    // ✅ Respond with updated interview
    res.status(200).json({
      success: true,
      message: 'Interview status updated successfully',
      interview: updatedInterview,
    });
  } catch (error) {
    console.error('Error updating interview status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating interview status',
      error: error.message,
    });
  }
};
