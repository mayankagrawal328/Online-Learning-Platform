const mongoose = require("mongoose");

const liveClassSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  startTime: {
    type: Date,
    required: [true, "Start time is required"],
  },
  endTime: {
    type: Date,
    required: [true, "End time is required"],
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Instructor is required"],
  },
  meetingLink: {
    type: String,
    required: [true, "Meeting link is required"],
  },
  status: {
    type: String,
    enum: ["Scheduled", "Live", "Completed"],
    default: "Scheduled",
  },
  students: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    required: [true, "At least one student is required"],
    validate: [arrayLimit, "At least one student must be assigned"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Helper function to validate at least one student
function arrayLimit(val) {
  return val.length > 0;
}

module.exports = mongoose.model("LiveClass", liveClassSchema);
