const LiveClass = require("../models/LiveClass");

// Create a Live Class
exports.createLiveClass = async (req, res) => {
  try {
    const { title, description, startTime, endTime, meetingLink, students } = req.body;
    const instructorId = req.user.id;
    if (!title || !startTime || !endTime || !meetingLink || !students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "All required fields must be filled, including at least one student" 
      });
    }
    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time"
      });
    }
    const liveClass = await LiveClass.create({
      title,
      description,
      startTime,
      endTime,
      instructor: instructorId,
      meetingLink,
      students,
    });
    return res.status(201).json({ 
      success: true, 
      message: "Live class created successfully", 
      data: liveClass 
    });
  } catch (error) {
    console.error("Error creating live class:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// Get Upcoming Live Classes for Students
exports.getUpcomingLiveClasses = async (req, res) => {
  try {
    const now = new Date();
    const studentId = req.user.id;
    const upcomingClasses = await LiveClass.find({
      endTime: { $gt: now },
      students: studentId,
    })
      .sort({ startTime: 1 })
      .populate("instructor", "firstName lastName email");

    return res.status(200).json({ success: true, data: upcomingClasses });
  } catch (error) {
    console.error("Error fetching upcoming classes for student:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get Live Class Details by ID (Join a Live Class)
exports.getLiveClassDetails = async (req, res) => {
  try {
    const { classId } = req.query;
    if (!classId) {
      return res.status(400).json({ success: false, message: "classId is required in query parameters" });
    }
    const liveClass = await LiveClass.findById(classId).populate("instructor", "firstName lastName email");
    if (!liveClass) {
      return res.status(404).json({ success: false, message: "Live class not found" });
    }
    return res.status(200).json({ success: true, message: "Live class fetched successfully", data: liveClass });
  } catch (error) {
    console.error("Error fetching live class details:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get Live Classes for a Specific Teacher
exports.getTeacherLiveClasses = async (req, res) => {
  try {
    const now = new Date();
    const teacherClasses = await LiveClass.find({
      instructor: req.user.id,
      endTime: { $gt: now }, // Only future classes
    })
      .sort({ startTime: 1 })
      .populate("instructor", "firstName lastName email");
    return res.status(200).json({ success: true, data: teacherClasses });
  } catch (error) {
    console.error("Error fetching teacher classes:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update a Live Class (classId will come from req.body)
exports.updateLiveClass = async (req, res) => {
  try {
    const { classId, title, description, startTime, endTime, meetingLink, students } = req.body;
    const instructorId = req.user.id; // Authenticated Instructor ID
    if (!classId) {
      return res.status(400).json({ success: false, message: "classId is required in body" });
    }
    const liveClass = await LiveClass.findById(classId);
    if (!liveClass) {
      return res.status(404).json({ success: false, message: "Live class not found" });
    }
    if (liveClass.instructor.toString() !== instructorId) {
      return res.status(403).json({ success: false, message: "You are not authorized to update this class" });
    }
    if (title) liveClass.title = title;
    if (description) liveClass.description = description;
    if (startTime) liveClass.startTime = startTime;
    if (endTime) liveClass.endTime = endTime;
    if (meetingLink) liveClass.meetingLink = meetingLink;
    if (students && Array.isArray(students)) liveClass.students = students;
    await liveClass.save();
    return res.status(200).json({ success: true, message: "Live class updated successfully", data: liveClass });
  } catch (error) {
    console.error("Error updating live class:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete a Live Class (Instructor Only)
exports.deleteLiveClass = async (req, res) => {
  try {
    const { classId } = req.body; // Get classId from the request body
    const instructorId = req.user.id; // Authenticated Instructor ID
    if (!classId) {
      return res.status(400).json({ success: false, message: "classId is required" });
    }
    const liveClass = await LiveClass.findById(classId);
    if (!liveClass) {
      return res.status(404).json({ success: false, message: "Live class not found" });
    }
    if (liveClass.instructor.toString() !== instructorId) {
      return res.status(403).json({ success: false, message: "You are not authorized to delete this class" });
    }
    await LiveClass.findByIdAndDelete(classId);
    return res.status(200).json({ success: true, message: "Live class deleted successfully" });
  } catch (error) {
    console.error("Error deleting live class:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
